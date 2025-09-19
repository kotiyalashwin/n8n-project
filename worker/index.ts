import { createClient } from "redis";
import { ExecNodeFunction } from "./exec";

const redis = createClient();
redis.connect();
redis.on("connect", async () => {
	console.log("---Worker started--------");
	while (true) {
		const data = await redis.blPop("tasks", 0);
		if (!data) continue;
		//const _key = "key" in data ? data.key : data[0]; // either object.key or tuple[0]
		const rawData: string = "element" in data ? data.element : data[1];

		let parseData;
		try {
			parseData = JSON.parse(rawData);
		} catch (err) {
			console.error("Invalid JSON task:", rawData, err);
			continue;
		}
		await ExecNodeFunction({ redis, node: parseData });
		await new Promise((r) => setTimeout(r, 3000));
	}
});
export type RedisClient = typeof redis;
