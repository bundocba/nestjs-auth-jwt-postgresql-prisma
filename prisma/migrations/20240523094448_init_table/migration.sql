-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(15),
    "email" VARCHAR(63) NOT NULL,
    "profile_picture" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "secure_password" VARCHAR(63) NOT NULL,
    "gender" "Gender" DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lock_time" TIMESTAMP(3),
    "wrong_password_attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_uuid_idx" ON "user" USING HASH ("uuid");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user" USING HASH ("email");
