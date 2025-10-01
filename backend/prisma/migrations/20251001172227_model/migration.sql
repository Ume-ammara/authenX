/*
  Warnings:

  - You are about to drop the column `verificationTokenExpriy` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "verificationTokenExpriy",
ADD COLUMN     "verificationTokenExpiry" TEXT;
