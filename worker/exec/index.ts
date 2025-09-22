import type { RedisClient } from "../index.ts";
import { execFunctions } from "./functions/configs.ts";
export type ExecNode = {
	nodeId: string;
	type: string;
	data: {
		formData?: { name: string; value: string }[];
		credentials: {
			info: { name: string; value: string }[];
			service: string;
		}[];
	};
	workflowId: string;
};

type ExecuteFunctionProps = {
	redis: RedisClient;
	node: ExecNode;
};

export const ExecNodeFunction = async ({
	redis,
	node,
}: ExecuteFunctionProps) => {
	const executor = execFunctions[node.type as keyof typeof execFunctions];
	try {
		//not publishing
		// console.log(`publishing to updates:${node.workflowId}`);
		// console.log("recieved data:", node.data)
		await redis.publish(
			`updates:${node.workflowId}`,
			JSON.stringify({ nodeId: node.nodeId, status: "processing" }),
		);
		console.log(`executing ${node.type}`);

		//here is some error
		executor(node.workflowId, {
			formData: node.data.formData ?? [],
			credentials: node.data.credentials,
		});
		console.log(`executed : ${node.type}`);
		await redis.publish(
			`updates:${node.workflowId}`,
			JSON.stringify({ nodeId: node.nodeId, status: "completed" }),
		);
		return true;
	} catch (e) {
		console.log(e)
		await redis.publish(
			`updates:${node.workflowId}`,
			JSON.stringify({ nodeId: node.nodeId, status: "error" }),
		);
		return false;
	}
};
