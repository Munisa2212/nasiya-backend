-- CreateTable
CREATE TABLE "Payment_schedule" (
    "id" SERIAL NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "expected_amount" INTEGER NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "credit_id" INTEGER NOT NULL,

    CONSTRAINT "Payment_schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment_schedule" ADD CONSTRAINT "Payment_schedule_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
