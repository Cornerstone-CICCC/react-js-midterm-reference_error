import { Order } from "../domain/order.entity";
import { OrderId } from "../domain/order.value-objects";

export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  save(order: Order): Promise<Order | null>;
  update(order: Order): Promise<void>;
  delete(id: OrderId): Promise<void>;
}
