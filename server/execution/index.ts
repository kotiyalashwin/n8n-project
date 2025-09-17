import type { ExecEdge, ExecNode } from "../helper/serializenodes";
import { execFunctions } from "./functions/configs";
import WebSocketManager from "../websocket";

export type Workflow = { id: string; nodes: ExecNode[]; edges: ExecEdge[] };

export class WorkFlowExecutor {
  private nodeMap: Map<string, ExecNode>;
  private childMap: Map<string, string[]>;
  private wsManager?: WebSocketManager;
  private workflowId: string;

  constructor(workflow: Workflow, wsManager?: WebSocketManager) {
    this.workflowId = workflow.id;
    this.nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));
    this.childMap = new Map();
    this.wsManager = wsManager;
    workflow.edges.forEach(({ source, target }) => {
      if (!this.childMap.has(source)) this.childMap.set(source, []);
      this.childMap.get(source)!.push(target);
    });
  }

  async run(startNodeId: string) {
    return this.executeNode(startNodeId, {});
  }

  private async executeNode(nodeId: string, inputData: any) {
    const node = this.nodeMap.get(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);
    console.log("node", node);

    const executor = execFunctions[node.type as keyof typeof execFunctions];
    if (!executor) throw new Error(`No executor for type "${node.type}"`);

    // Emit processing status
    this.emitNodeStatus(nodeId, "processing");

    console.log(
      `[${this.workflowId}] ▶️ Executing ${node.type} node ${nodeId}`
    );

    try {
      const result = await executor(this.workflowId, {
        formData: node.data.formData ?? [],
      });

      // Emit completed status
      this.emitNodeStatus(nodeId, "completed");

      console.log(
        `[${this.workflowId}] ✅ Finished ${node.type} node ${nodeId}`
      );

      const children = this.childMap.get(nodeId) || [];
      await Promise.all(
        children.map((childId) => this.executeNode(childId, result))
      );

      return true;
    } catch (error) {
      // Emit error status
      this.emitNodeStatus(
        nodeId,
        "error",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  private emitNodeStatus(
    nodeId: string,
    status: "processing" | "completed" | "error",
    error?: string
  ) {
    if (this.wsManager) {
      this.wsManager.broadcastNodeStatus({
        workflowId: this.workflowId,
        nodeId,
        status,
        timestamp: Date.now(),
        error,
      });
    }
  }
}
