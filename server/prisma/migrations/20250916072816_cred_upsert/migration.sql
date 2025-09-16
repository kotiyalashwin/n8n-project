/*
  Warnings:

  - A unique constraint covering the columns `[workFlowId]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credentials_workFlowId_key" ON "public"."Credentials"("workFlowId");
