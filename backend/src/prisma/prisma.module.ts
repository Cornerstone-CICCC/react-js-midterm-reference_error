import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global() // グローバルに使用可能にする
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
