import { getContext, publishUpdates, setOutput } from "../redis.ts";
import { execFunctions } from "./functions/configs.ts";
import type { ExecuteFunctionProps } from "../types.ts";

export const ExecNodeFunction = async ({
  redis,
  node,
}: ExecuteFunctionProps) => {
  //get context
  const context = await getContext(redis, node.parents ?? []);
  //context :  { nodeId : message}
  console.log(context);
  const executor = execFunctions[node.type as keyof typeof execFunctions];
  try {
    await publishUpdates(redis, node.workflowId, node.nodeId, "processing");

    //calling execution function
    const output = await executor(node.workflowId, {
      formData: node.data.formData ?? [],
      credentials: node.data.credentials,
      context: context,
    });

    //check for the producesOutput parmeter
    const producesOutput =
      node.data.formData
        ?.find((f) => f.name === "producesOutput")
        ?.value.toLocaleLowerCase() === "true";

    //setting updates to redis
    if (producesOutput) {
      await setOutput(redis, node.nodeId, output);
    }
    return true;
  } catch (e) {
    console.log(e);
    await publishUpdates(redis, node.workflowId, node.nodeId, "error");
    return false;
  }
};
