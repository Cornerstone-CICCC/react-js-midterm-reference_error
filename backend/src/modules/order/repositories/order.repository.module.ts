import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderRepository } from "./order.repository";

@Module({
  providers: [
    PrismaService,
    OrderRepository,
    {
      provide: "IOrderRepository",
      useClass: OrderRepository,
    },
  ],
  exports: [PrismaService, OrderRepository, "IOrderRepository"],
})
export class OrderRepositoryModule {}
