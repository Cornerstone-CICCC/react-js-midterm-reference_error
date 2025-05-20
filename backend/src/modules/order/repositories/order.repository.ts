import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Order } from "../domain/order.entity";
import { EnumOrderStatus, OrderId } from "../domain/order.value-objects";
import { IOrderRepository } from "./order.repository.interface";

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: OrderId): Promise<Order | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { id: id.getValue() },
    });

    if (!orderData) return null;

    return new Order({
      id: orderData.id,
      productId: orderData.productId,
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId,
      finalPrice: Number(orderData.finalPrice),
      status: orderData.status as EnumOrderStatus,
      createdAt: orderData.createdAt,
      paidAt: orderData.paidAt || undefined,
      completedAt: orderData.completedAt || undefined,
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const ordersData = await this.prisma.order.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    });

    return ordersData.map(
      (orderData) =>
        new Order({
          id: orderData.id,
          productId: orderData.productId,
          buyerId: orderData.buyerId,
          sellerId: orderData.sellerId,
          finalPrice: Number(orderData.finalPrice),
          status: orderData.status as EnumOrderStatus,
          createdAt: orderData.createdAt,
          paidAt: orderData.paidAt || undefined,
          completedAt: orderData.completedAt || undefined,
        }),
    );
  }

  async save(order: Order): Promise<Order | null> {
    if (!order.hasId()) {
      const createdOrder = await this.prisma.order.create({
        data: {
          productId: order.productId.getValue() ?? "",
          buyerId: order.buyerId.getValue(),
          sellerId: order.sellerId.getValue(),
          finalPrice: order.finalPrice.getAmount(),
          status: order.status,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          completedAt: order.completedAt,
        },
      });
      return new Order({
        id: createdOrder.id,
        productId: createdOrder.productId,
        buyerId: createdOrder.buyerId,
        sellerId: createdOrder.sellerId,
        finalPrice: Number(createdOrder.finalPrice),
        status: createdOrder.status as EnumOrderStatus,
        createdAt: createdOrder.createdAt,
        paidAt: createdOrder.paidAt || undefined,
        completedAt: createdOrder.completedAt || undefined,
      });
    }
    return null;
  }

  async update(order: Order): Promise<void> {
    if (order.hasId()) {
      await this.prisma.order.update({
        where: { id: order.id?.getValue() },
        data: {
          status: order.status,
          paidAt: order.paidAt,
          completedAt: order.completedAt,
        },
      });
    }
  }

  async delete(id: OrderId): Promise<void> {
    await this.prisma.order.delete({
      where: { id: id.getValue() },
    });
  }
}
