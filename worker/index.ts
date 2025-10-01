import { createClient } from "redis";
import { ExecNodeFunction } from "./exec";
import { publishUpdates } from "./redis";

const redis = createClient();
redis.connect();
redis.on("connect", async () => {
  console.log("---Worker started--------");
  while (true) {
    const data = await redis.blPop("tasks", 0);
    if (!data) continue;
    const rawData: string = "element" in data ? data.element : data[1];

    let parseData;
    try {
      parseData = JSON.parse(rawData);
    } catch (err) {
      console.error("Invalid JSON task:", rawData, err);
      continue;
    }
    const successfull = await ExecNodeFunction({ redis, node: parseData });
    if (successfull) {
      await publishUpdates(
        redis,
        parseData.workflowId,
        parseData.nodeId,
        "completed"
      );
    } else {
      await publishUpdates(
        redis,
        parseData.workflowId,
        parseData.nodeId,
        "error"
      );
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
});
export type RedisClient = typeof redis;
