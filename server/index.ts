import express from "express";
import cors from "cors";
import { db } from "./prisma/db";
import { saveSchema } from "./validations/save";
import { credentialsSchema } from "./validations/credentials";
import { da } from "zod/locales";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/workflow/:id", async (req, res) => {
  const workFlowId = req.params.id;
  if (!workFlowId) res.status(402).json({ message: "WorkFlowId required" });

  const workFlowData = await db.workFlows.findUnique({
    where: {
      id: workFlowId,
    },
    select: {
      nodes: true,
      edges: true,
    },
  });

  res.json(workFlowData);
});
app.post("/workflow/save", async (req, res) => {
  console.log(req.body);
  const { data, success } = saveSchema.safeParse(req.body);

  if (!success) {
    res.status(402).json({ message: "bad request" });
    return;
  }

  await db.workFlows.create({
    data: {
      id: data.id,
      nodes: data.nodes,
      edges: data.edges,
    },
  });
  res.json({ message: "Worflow saved successfully" });
});
app.post("/credentials/new", async (req, res) => {
  const { data, success } = credentialsSchema.safeParse(req.body);

  if (!success) {
    res.status(402).json({ message: "bad request" });
    return;
  }
  await db.credentials.create({
    data: {
      service: data.service,
      value: data.value,
    },
  });
  res.json({ message: "credentials saved successfully" });
});
app.listen(8000, () => {
  console.log("x8x backend up");
});
