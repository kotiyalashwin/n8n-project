import z from "zod";

export const saveSchema = z.object({
  id: z.string(),
  nodes: z.array(z.object()),
  edges: z.array(z.object()),
});
