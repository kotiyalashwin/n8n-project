import z from "zod";

const nodeSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }), // {x: number, y: number}
  type: z.string(),
  draggable: z.boolean(),
  data: z.record(z.string(), z.any()), // or a stricter schema
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const saveSchema = z.object({
  id: z.string(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});
