/*
  Warnings:

  - You are about to drop the column `job_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `job_title` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_phone_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "job_id",
DROP COLUMN "job_title",
DROP COLUMN "message_id",
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
