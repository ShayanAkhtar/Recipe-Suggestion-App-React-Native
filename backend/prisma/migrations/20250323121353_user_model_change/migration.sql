-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Earth',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'User';
