-- DropForeignKey
ALTER TABLE "Credit_image" DROP CONSTRAINT "Credit_image_credit_id_fkey";

-- DropForeignKey
ALTER TABLE "Credits" DROP CONSTRAINT "Credits_debtor_id_fkey";

-- DropForeignKey
ALTER TABLE "Debtor" DROP CONSTRAINT "Debtor_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_credit_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment_schedule" DROP CONSTRAINT "Payment_schedule_credit_id_fkey";

-- DropForeignKey
ALTER TABLE "debtor_image" DROP CONSTRAINT "debtor_image_debtor_id_fkey";

-- DropForeignKey
ALTER TABLE "debtor_phone" DROP CONSTRAINT "debtor_phone_debtor_id_fkey";

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debtor_image" ADD CONSTRAINT "debtor_image_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debtor_phone" ADD CONSTRAINT "debtor_phone_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_image" ADD CONSTRAINT "Credit_image_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment_schedule" ADD CONSTRAINT "Payment_schedule_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
