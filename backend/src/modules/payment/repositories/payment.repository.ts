import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { OrderId } from "../../order/domain/order.value-objects";
import { Payment } from "../domain/payment.entity";
import { EnumPaymentMethod, EnumPaymentStatus, PaymentId } from "../domain/payment.value-object";
import { IPaymentRepository } from "./payment.repository.interface";

@Injectable()
export class PaymentPrismaRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: PaymentId): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { id: id.getValue() },
    });

    if (!paymentData) return null;

    return new Payment({
      id: paymentData.id,
      orderId: paymentData.orderId,
      amount: Number(paymentData.amount),
      fee: Number(paymentData.fee),
      method: paymentData.method as EnumPaymentMethod,
      status: paymentData.status as EnumPaymentStatus,
      createdAt: paymentData.createdAt,
      processedAt: paymentData.processedAt || undefined,
    });
  }

  async findByOrderId(orderId: OrderId): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { orderId: orderId.getValue() },
    });

    if (!paymentData) return null;

    return new Payment({
      id: paymentData.id,
      orderId: paymentData.orderId,
      amount: Number(paymentData.amount),
      fee: Number(paymentData.fee),
      method: paymentData.method as EnumPaymentMethod,
      status: paymentData.status as EnumPaymentStatus,
      createdAt: paymentData.createdAt,
      processedAt: paymentData.processedAt || undefined,
    });
  }

  async save(payment: Payment): Promise<Payment | null> {
    if (!payment.hasId()) {
      const paymentResponse = await this.prisma.payment.create({
        data: {
          orderId: payment.orderId.getValue(),
          amount: payment.amount.getAmount(),
          fee: payment.fee.getAmount(),
          method: payment.method,
          status: payment.status,
        },
      });

      return new Payment({
        id: paymentResponse.id,
        orderId: paymentResponse.orderId,
        amount: Number(paymentResponse.amount),
        fee: Number(paymentResponse.fee),
        method: paymentResponse.method as EnumPaymentMethod,
        status: paymentResponse.status as EnumPaymentStatus,
        createdAt: paymentResponse.createdAt,
        processedAt: paymentResponse.processedAt || undefined,
      });
    }
    return null;
  }

  async update(payment: Payment): Promise<void> {
    if (!payment.hasId()) {
      throw new Error("Payment ID is required for update");
    }
    await this.prisma.payment.update({
      where: { id: payment.id?.getValue() },
      data: {
        status: payment.status,
        processedAt: payment.processedAt,
      },
    });
  }
}
