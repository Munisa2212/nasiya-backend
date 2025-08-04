/*
  Warnings:

  - A unique constraint covering the columns `[credit_id,due_date]` on the table `Payment_schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_schedule_credit_id_due_date_key" ON "Payment_schedule"("credit_id", "due_date");
