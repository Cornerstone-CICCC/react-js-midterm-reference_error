import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserRepository } from "./user.repository";

@Module({
  providers: [
    PrismaService,
    UserRepository,
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
  ],
  exports: [PrismaService, UserRepository, "IUserRepository"],
})
export class UserRepositoryModule {}
