export interface TaskNodeData extends Record<string, unknown> {
  id: string;
  name: string;
  dragging: true;
  type: string;
  count: number;
  variant: "action" | "trigger" | "ifelse";
  deleteNode: (id: string) => void;
}

export type newNodeParams = {
  name: string;
  type: string;
  variant: string;
};
