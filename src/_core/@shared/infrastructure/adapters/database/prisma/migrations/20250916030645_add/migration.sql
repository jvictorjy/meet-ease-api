-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "closing_time" VARCHAR(5) NOT NULL DEFAULT '23:00',
ADD COLUMN     "max_capacity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "opening_time" VARCHAR(5) NOT NULL DEFAULT '06:00';
