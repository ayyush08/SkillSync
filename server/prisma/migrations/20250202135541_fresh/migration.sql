/*
  Warnings:

  - The values [BEGINNER,INTERMEDIATE,ADVANCED,EXPERT] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `designation` on the `User` table. All the data in the column will be lost.
  - Added the required column `field` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profession` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Field" AS ENUM ('Software_Development', 'Data_and_AI', 'Cloud_and_Infrastructure', 'Cybersecurity', 'Blockchain', 'Design_and_UX', 'Product_and_Management', 'Research_and_Academia', 'Miscellaneous');

-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('Frontend_Developer', 'Backend_Developer', 'Fullstack_Developer', 'Software_Engineer', 'Mobile_Developer', 'Game_Developer', 'Embedded_Systems_Engineer', 'Devops_Engineer', 'Qa_Engineer', 'Test_Automation_Engineer', 'Data_Scientist', 'Data_Analyst', 'Data_Engineer', 'Machine_Learning_Engineer', 'Ai_Researcher', 'Computer_Vision_Engineer', 'Nlp_Engineer', 'Big_Data_Engineer', 'Cloud_Engineer', 'Cloud_Solution_Architect', 'Site_Reliability_Engineer', 'Network_Engineer', 'System_Administrator', 'Cybersecurity_Analyst', 'Penetration_Tester', 'Security_Engineer', 'Cryptography_Engineer', 'Blockchain_Developer', 'Smart_Contract_Developer', 'Web3_Developer', 'Ui_Ux_Designer', 'Product_Designer', 'Graphic_Designer', 'Product_Manager', 'Technical_Project_Manager', 'Scrum_Master', 'Research_Scientist', 'Computer_Science_Lecturer', 'Technical_Writer', 'Game_Designer', 'Ar_Vr_Developer', 'Database_Administrator', 'It_Support_Specialist', 'Software_Architect', 'Cto');

-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('Beginner', 'Intermediate', 'Advanced');
ALTER TABLE "User" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "Level_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "designation",
ADD COLUMN     "field" "Field" NOT NULL,
ADD COLUMN     "profession" "Profession" NOT NULL;

-- DropEnum
DROP TYPE "Designation";
