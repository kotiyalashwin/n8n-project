import z from "zod";

const infoItem = z.object({
  name: z.string(),
  value: z.string(),
});

export const credentialsSchema = z.object({
  service: z.string(),
  info: z.union([infoItem, z.array(infoItem)]),
});

export const saveCredentialSchema = z.object({
  workflowid: z.string(),
  credentials: z.array(credentialsSchema),
});
