-- CreateEnum
CREATE TYPE "Credit_status" AS ENUM ('ACTIVE', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "Schedule_status" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "Payment_status" AS ENUM ('SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debtor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "seller_id" INTEGER NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debtor_image" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "debtor_id" INTEGER NOT NULL,

    CONSTRAINT "debtor_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debtor_phone" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "debtor_id" INTEGER NOT NULL,

    CONSTRAINT "debtor_phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credits" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "remaining_amount" INTEGER NOT NULL,
    "monthly_payment_amount" INTEGER NOT NULL,
    "status" "Credit_status" NOT NULL,
    "product_name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "debtor_id" INTEGER NOT NULL,

    CONSTRAINT "Credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_image" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "credit_id" INTEGER NOT NULL,

    CONSTRAINT "Credit_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "credit_id" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "status" "Payment_status" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debtor_image" ADD CONSTRAINT "debtor_image_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debtor_phone" ADD CONSTRAINT "debtor_phone_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_image" ADD CONSTRAINT "Credit_image_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
