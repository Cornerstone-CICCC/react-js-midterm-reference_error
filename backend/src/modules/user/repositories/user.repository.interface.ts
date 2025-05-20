import { User } from "../domain/user.entities";
import { AuthId, UserId } from "../domain/user.value-objects";

export interface IUserRepository {
  update(id: UserId, userData: Partial<User>): Promise<User>;
  findById(id: UserId): Promise<User | null>;
  findByAuthId(authId: AuthId): Promise<User | null>;
  save(user: User): Promise<User>;
}
