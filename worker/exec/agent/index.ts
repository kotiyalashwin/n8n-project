import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ExecGmail, ExecTelegram } from "../functions/functions";
import type { DataConfig } from "../../types";
import { GOOGLE_API_KEY } from "../../constant";
const llm = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0,
});

export async function RunAgent(inputData: DataConfig) {
  try {
    function getTools(
      data: { info: { name: string; value: string }[]; service: string }[]
    ) {
      const telegram = tool(
        async ({ message }) => {
          await ExecTelegram({
            ...inputData.data,
            formData: [
              ...inputData.data.formData,
              { name: "message", value: message },
            ],
          });
          //const creds = getToolCredentials("telegram", data);
          //const botToken = creds.find(c => c.name === "botToken")?.value;
          //console.log(`Telegram sending: "${message}" using token: ${botToken}`);
          //return `Message "${message}" sent via Telegram using bot token: ${botToken}`;
        },
        {
          name: "TelegramTool",
          description: "Sends message to Telegram",
          schema: z.object({ message: z.string() }),
        }
      );

      const gmail = tool(
        async ({ to, message }) => {
          //console.log(`Gmail is sending ${message} to: ${to}`)
          await ExecGmail("1234", {
            ...inputData.data,
            formData: [
              ...inputData.data.formData,
              { name: "recipient", value: `${to}` },
              { name: "body", value: `${message}` },
            ],
          });
        },
        {
          name: "GmailTool",
          description: "Sends mail to the recipient",
          schema: z.object({
            to: z.string().optional().describe("The recipient of the mail"),
            message: z
              .string()
              .describe("Message you want to send to the user"),
          }),
        }
      );

      return [telegram, gmail];
    }
    const tools = getTools(inputData.data.credentials);
    const toolByName = Object.fromEntries(tools.map((t) => [t.name, t]));
    const llmWithTools = llm.bindTools(tools);

    async function llmCall(state: typeof MessagesAnnotation.State) {
      //reads the state messages
      const result = await llmWithTools.invoke([...state.messages]);
      //console.log(result.tool_calls);
      //adds to the state
      return {
        messages: [result],
      };
    }
    //node
    const toolNode = new ToolNode(tools);

    //end node or not
    function shouldContinue(state: typeof MessagesAnnotation.State) {
      const messages = state.messages;
      //checking the last message from the llm call, wether it calls another tool or not
      const lastMessage = messages.at(-1);

      //llm is calling more tools which means CHAIN needs to continue
      if (lastMessage?.tool_calls?.length) {
        return "Action";
      }
      // Otherwise, we stop (reply to the user)
      return "__end__";
    }

    const agent = new StateGraph(MessagesAnnotation)
      .addNode("llmCall", llmCall)
      .addNode("tools", toolNode)
      .addEdge("__start__", "llmCall")
      .addConditionalEdges("llmCall", shouldContinue, {
        Action: "tools", //next node to call if action exist is tools,
        __end__: "__end__",
      })
      .addEdge("tools", "llmCall")
      .compile();

    const userPrompt = inputData.data.formData.find((d) => d.name === "prompt")
      ?.value as string;
    const messages = [
      {
        role: "user",
        content: `${userPrompt}`,
      },
    ];
    const result = await agent.invoke({ messages });
    //console.log(result.messages);
    //console.log("executed");
    if (!result.messages || result.messages.length === 0) return;
    console.log("--------------INFORMATION ABOUT THE EXECUTION------- \n");
    console.log("User asked for: ", result.messages[0].content);
    console.log("--------------TOOLS CALLED--------------------------");
    for (const toolCall of result.messages[1].tool_calls) {
      console.log(
        `Agent called ${toolCall.name} and  send : ${toolCall.args.message} to ${toolCall.args.to} \n`
      );
      //console.log(toolCall)
    }
    console.log("--------------AGENT RESPONSE------------------------ \n");
    console.log(`${result.messages.at(-1).content}`);
  } catch (e) {
    console.log(e);
  }
}
