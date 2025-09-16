/*
  Warnings:

  - You are about to drop the column `service` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Credentials` table. All the data in the column will be lost.
  - Added the required column `credentials` to the `Credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workFlowId` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Credentials" DROP COLUMN "service",
DROP COLUMN "value",
ADD COLUMN     "credentials" JSONB NOT NULL,
ADD COLUMN     "workFlowId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Credentials_workFlowId_idx" ON "public"."Credentials"("workFlowId");
