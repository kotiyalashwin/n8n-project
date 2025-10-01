import axios from "axios";
import { SendMail } from "../../resend";
import { RunAgent } from "../agent";
import { credConfig } from "../credConfig";
import type { Credentials, DataConfig } from "../../types";
import type { TelegramContext } from "../context";

const getCreds = (
  tools: string[],
  infos: { name: string; value: string }[]
): Credentials[] | [] => {
  const credentials: Credentials[] = [];
  if (infos.length === 0) return [];
  for (const tool of tools) {
    let toolCredInfo: { name: string; value: string }[] = [];
    const toolcredConfig = credConfig[tool as keyof typeof credConfig];
    if (!toolcredConfig) continue;
    const foundConfigs = toolcredConfig.credentials;
    for (const cred of foundConfigs) {
      infos.forEach((i) => {
        if (cred.name === i.name) toolCredInfo.push(i);
      });
    }
    credentials.push({ service: toolcredConfig.service, info: toolCredInfo });
  }
  return credentials;
};

//configure for the context
export const ExecTelegram = async (data: {
  formData: { name: string; value: string }[];
  credentials: {
    info: { name: string; value: string }[];
    service: string;
  }[];
  context?: TelegramContext;
}) => {
  console.log("reached exec telegram");
  try {
    const chatId = data.formData
      .find((field) => field.name === "chatId")
      ?.value.trim();

    const message = data.formData.find(
      (field) => field.name === "message"
    )?.value;
    if (!chatId || !message) {
      throw new Error("ChatId and message are required");
    }

    const { credentials } = data;
    if (!data.credentials) {
      throw new Error("Credentials not found");
    }

    const credentialsData = credentials as {
      info: { name: string; value: string }[];
      service: string;
    }[];

    const telegramCreds = credentialsData.find(
      (cred) => cred.service === "Telegram"
    );
    const botToken = telegramCreds?.info
      .find((info) => info.name === "Bot Token")
      ?.value.trim();

    if (!botToken) {
      throw new Error("Telegram bot token not found");
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: data.context?.message ? message + data.context.message : message,
      }
    );

    if (!response.data.ok) {
      throw new Error("Failed to send message");
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const ListenTelegram = async (
  credentials: {
    info: { name: string; value: string }[];
    service: string;
  }[]
) => {
  console.log("-----------LISTENING TO MESSAGES-------------");
  const telegramCreds = credentials.find((cred) => cred.service === "Telegram");
  const botToken = telegramCreds?.info
    .find((info) => info.name === "Bot Token")
    ?.value.trim();

  if (!botToken) {
    throw new Error("Telegram bot token not found");
  }
  const initRes = await axios.get(
    `https://api.telegram.org/bot${botToken}/getUpdates`
  );
  const initData = await initRes.data;
  let offset =
    initData.result.length > 0
      ? initData.result[initData.result.length - 1].update_id + 1
      : 0;

  // Function that waits for a new message
  const waitForMessage = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        while (true) {
          const res = await axios.get(
            `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=30`
          );
          const data = await res.data;
          if (data.result.length > 0) {
            for (const update of data.result) {
              if (update.message) {
                offset = update.update_id + 1; // update offset
                return resolve(update.message);
              }
            }
          }
          // If no message, loop continues
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const message = await waitForMessage();
  // console.log(
  //   `Received message from ${
  //     message.from.username || message.from.first_name
  //   }: ${message.text}`
  // );

  return message.text as string;
};

export const ExecGmail = async (
  workflowId: string,
  data: {
    formData: { name: string; value: string }[];
    credentials: {
      info: { name: string; value: string }[];
      service: string;
    }[];
  }
) => {
  const recipientMail = data.formData
    .find((field) => field.name === "recipient")
    ?.value.trim();
  const mailSubject = data.formData.find(
    (field) => field.name === "subject"
  )?.value;
  const mailBody = data.formData.find((field) => field.name === "body")?.value;

  if (!recipientMail || !mailBody) {
    throw new Error("Recipient, subject, and body are required");
  }
  const { credentials } = data;
  if (!data.credentials) {
    throw new Error("Credentials not found");
  }
  const credentialsData = credentials as {
    info: { name: string; value: string }[];
    service: string;
  }[];
  const gmailCreds = credentialsData.find((cred) => cred.service === "Gmail");
  const resendKey = gmailCreds?.info
    .find((info) => info.name === "ResendKey")
    ?.value.trim();

  await SendMail({
    to: recipientMail,
    subject: mailSubject ?? "No subject (maybe from agent)",
    body: mailBody,
    key: resendKey,
  });
  return true;
};

export const ExecAgentWrapper = async (data: {
  formData: { name: string; value: string[] | string }[];
  credentials: {
    info: { name: string; value: string }[];
    service: string;
  }[];
}) => {
  try {
    const rawTools = data.formData.find((d) => d.name === "tools")?.value; // "[\"telegram"\ , \"gmail"\]"
    const agentCreds =
      data.credentials.find((c) => c.service === "Agent")?.info ?? [];

    const tools = JSON.parse(rawTools);
    const credentials = getCreds(tools, agentCreds);
    console.log(`creds : ${credentials}`);
    const filteredFormData = data.formData.filter(
      (d) => d.name !== "tools"
    ) as {
      name: string;
      value: string;
    }[];
    //if (typeof tools === "string") return;
    const agentPayload: DataConfig = {
      tools: tools?.length !== 0 ? tools : [],
      data: {
        formData: filteredFormData,
        credentials: [...credentials],
      },
    };
    try {
      await RunAgent(agentPayload);
    } catch (e) {
      console.log(e);
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
