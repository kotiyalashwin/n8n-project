import type { ExecEdge, ExecNode } from "../helper/serializenodes";
import { execFunctions } from "./functions/configs";

export type Workflow = { id: string; nodes: ExecNode[]; edges: ExecEdge[] };

export class WorkFlowExecutor {
  private nodeMap: Map<string, ExecNode>;
  private childMap: Map<string, string[]>;

  constructor(private workflow: Workflow) {
    this.nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));
    this.childMap = new Map();
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

    const executor = execFunctions[node.type as keyof typeof execFunctions];
    if (!executor) throw new Error(`No executor for type "${node.type}"`);

    console.log(
      `[${this.workflow.id}] ▶️ Executing ${node.type} node ${nodeId}`
    );

    const result = await executor(this.workflow.id, {
      ...node.data,
      ...inputData,
    });

    console.log(
      `[${this.workflow.id}] ✅ Finished ${node.type} node ${nodeId}`
    );

    const children = this.childMap.get(nodeId) || [];
    await Promise.all(
      children.map((childId) => this.executeNode(childId, result))
    );

    return true;
  }
}
