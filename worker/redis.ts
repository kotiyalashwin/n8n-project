import type { RedisClient } from "./index.ts";

export const setOutput = async (
  redis: RedisClient,
  nodeId: string,
  data: any
) => {
  const key = `output:nodeId:${nodeId}`;

  const seralizedOutput = JSON.stringify(data);
  try {
    //can configure later
    await redis.set(key, seralizedOutput, {
      expiration: {
        type: "EX",
        value: 120,
      },
    });
    console.log(`added output for node: ${nodeId}`);
  } catch (e) {
    console.log(e);
  }
};

export const publishUpdates = async (
  redis: RedisClient,
  workflowId: string,
  nodeId: string,
  status: string
) => {
  await redis.publish(
    `updates:${workflowId}`,
    JSON.stringify({ nodeId, status })
  );
};

export const getContext = async (redis: RedisClient, nodes: string[]) => {
  if (nodes.length === 0) {
    // Return an empty array
    return [];
  }
  const keys = nodes.map((id) => `output:nodeId:${id}`);

  let rawOutputs: (string | null)[];

  try {
    rawOutputs = await redis.mGet(keys);
  } catch (e) {
    console.log("error in getting outputs:", e);
    return [];
  }

  const result: (any | null)[] = rawOutputs.map((rawData, index) => {
    if (rawData === null) {
      return null;
    }

    try {
      return JSON.parse(rawData);
    } catch (e) {
      const nodeId = nodes[index];
      console.log(`error parsing context data for ${nodeId}`, e);
      return rawData;
    }
  });

  return result;
};
