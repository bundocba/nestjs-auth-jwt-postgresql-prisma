-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(63) NOT NULL,
    "profile_picture" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "secure_password" VARCHAR(63) NOT NULL,
    "gender" "Gender" DEFAULT 'UNKNOWN',
    "job_id" VARCHAR(15),
    "job_title" VARCHAR(63),
    "message_id" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lock_time" TIMESTAMP(3),
    "wrong_password_attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE INDEX "user_uuid_idx" ON "user" USING HASH ("uuid");

-- CreateIndex
CREATE INDEX "user_phone_idx" ON "user" USING HASH ("phone");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user" USING HASH ("email");
