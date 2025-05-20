import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserUseCasesModule } from "./application/user-usecases.module";
import { UserResolver } from "./presentation/user.resolver";
import { UserRepositoryModule } from "./repositories/user.repository.module";

@Module({
  imports: [UserUseCasesModule, UserRepositoryModule],
  providers: [UserResolver, PrismaService],
  exports: [UserResolver],
})
export class UserModule {}
