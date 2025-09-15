import z from "zod";

export const credentialsSchema = z.object({
  service: z.string(),
  value: z.string(),
});
