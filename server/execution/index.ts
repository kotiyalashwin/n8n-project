import { createClient } from "redis";
import type { ExecEdge, ExecNode } from "../helper/serializenodes";
import WebSocketManager from "../websocket";
import { db } from "../prisma/db";

export type Workflow = { id: string; nodes: ExecNode[]; edges: ExecEdge[] };

const redis = createClient();
await redis.connect();

export class WorkFlowExecutor {
  private nodeMap: Map<string, ExecNode>;
  private childMap: Map<string, string[]>; // parentId -> childIds[]
  private parentMap: Map<string, string[]>;
  private workflowId: string;

  constructor(workflow: Workflow, wsManager?: WebSocketManager) {
    this.workflowId = workflow.id;
    this.nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));
    this.childMap = new Map();
    this.parentMap = new Map();

    workflow.edges.forEach(({ source, target }) => {
      if (!this.childMap.has(source)) this.childMap.set(source, []);
      this.childMap.get(source)!.push(target);

      if (!this.parentMap.has(target)) this.parentMap.set(target, []);
      this.parentMap.get(target)!.push(source);
    });
  }

  async run(startNodeId: string) {
    const queue: { nodeId: string }[] = [];
    queue.push({ nodeId: startNodeId });

    while (queue.length > 0) {
      const { nodeId } = queue.shift()!;
      await this.enqueueNodeExecution(nodeId);

      const children = this.childMap.get(nodeId) || [];
      for (const childId of children) {
        queue.push({ nodeId: childId });
      }
    }
  }

  private async enqueueNodeExecution(nodeId: string) {
    const node = this.nodeMap.get(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);

    const data = await db.credentials.findUnique({
      where: { workFlowId: this.workflowId },
    });

    const credentials = data?.credentials as {
      info: { name: string; value: string }[];
      service: string;
    }[];

    const parents = this.parentMap.get(nodeId) || [];

    const payload = {
      workflowId: this.workflowId,
      nodeId,
      parents,
      type: node.type,
      data: {
        formData: node.data.formData ?? [],
        credentials,
      },
    };

    await redis.rPush("tasks", JSON.stringify(payload));

    console.log(`[${this.workflowId}] 📤 Enqueued node ${nodeId}`);
  }
}
