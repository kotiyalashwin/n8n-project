import cors from "cors";
import express from "express";
import { createServer } from "http";
import { createClient } from "redis";
import { WorkFlowExecutor } from "./execution";
import { Exec } from "./execution/run";
import {
	extractExecNE,
	type RawEdge,
	type RawNode,
} from "./helper/serializenodes";
import { db } from "./prisma/db";
import { saveCredentialSchema } from "./validations/credentials";
import { saveSchema } from "./validations/save";
import WebSocketManager from "./websocket";

const app = express();
const server = createServer(app);

// Initialize WebSocket manager
const wsManager = new WebSocketManager(server);
const redis = createClient();
app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:3000", "https://api.x8x.woksh.com"],
	}),
);

app.get("/workflow/:id", async (req, res) => {
	const workFlowId = req.params.id;
	if (!workFlowId) res.status(402).json({ message: "WorkFlowId required" });

	const workFlowData = await db.workFlows.findFirst({
		where: {
			id: workFlowId,
		},
		select: {
			nodes: true,
			edges: true,
		},
	});
	console.log(workFlowData);

	res.json(workFlowData);
});

app.post("/workflow/execute/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const data = await db.workFlows.findFirst({
			where: { id },
			select: { nodes: true, edges: true },
		});
		if (!data) {
			res.status(404).json({ message: "Workflow not found" });
			return;
		}
		const nodes = data.nodes as RawNode[];
		const edges = data.edges as RawEdge[];
		const {
			edges: execEdges,
			nodes: execNodes,
			runnerId,
		} = extractExecNE(nodes, edges);
		if (!runnerId) {
			res.status(402).json({ message: "runner node required" });
			return;
		}
		const executor = new WorkFlowExecutor({
			id,
			nodes: execNodes,
			edges: execEdges,
		});
		const startNodeId = execNodes.find((n) => n.type === "manual")?.id;
		if (!startNodeId) throw new Error();
		await executor.run(startNodeId);
		// if (success) {
		//   res.json({ message: "execution successfull" });
		// } else {
		//   res.json({ message: "execution failed" });
		// }
		res.json({ message: "executed successfully" })
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/workflow/save", async (req, res) => {
	const { data, success, error } = saveSchema.safeParse(req.body);

	if (!success) {
		console.log(error);
		res.status(402).json({ message: "bad request" });
		return;
	}

	await db.workFlows.upsert({
		where: {
			id: data.id,
		},
		update: {
			nodes: data.nodes,
			edges: data.edges,
		},
		create: {
			id: data.id,
			nodes: data.nodes,
			edges: data.edges,
		},
	});
	res.json({ message: "Worflow saved successfully" });
});

app.post("/credentials/new", async (req, res) => {
	const { data, success, error } = saveCredentialSchema.safeParse(req.body);

	if (!success) {
		console.log(error);
		res.status(402).json({ message: "bad request" });
		return;
	}
	await db.credentials.upsert({
		where: {
			workFlowId: data.workflowid,
		},
		update: {
			credentials: data.credentials,
		},
		create: {
			workFlowId: data.workflowid,
			credentials: data.credentials,
		},
	});
	res.json({ message: "credentials saved successfully" });
});

app.get("/credentials", async (req, res) => {
	const workflowId = req.query.workflowid as string;

	if (!workflowId) {
		return res.status(400).json({ message: "Workflow ID is required" });
	}

	try {
		const credentials = await db.credentials.findFirst({
			where: {
				workFlowId: workflowId,
			},
			select: {
				credentials: true,
			},
		});

		if (!credentials) {
			return res.json([]);
		}

		res.json(credentials);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Export wsManager for use in other modules
export { wsManager };

server.listen(8000, () => {
	console.log("x8x backend up with WebSocket support");
});
