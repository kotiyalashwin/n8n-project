import { WorkFlowExecutor, type Workflow } from ".";
import WebSocketManager from "../websocket";

export const Exec = async (nodeId: string, workflow: Workflow, wsManager?: WebSocketManager) => {
  const executor = new WorkFlowExecutor(workflow, wsManager);
  const done = await executor.run(nodeId);
  return done;
};
