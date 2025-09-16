import { WorkFlowExecutor, type Workflow } from ".";

export const Exec = async (nodeId: string, workflow: Workflow) => {
  const executor = new WorkFlowExecutor(workflow);
  const done = await executor.run(nodeId);
  return done;
};
