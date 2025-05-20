import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { NestJwtServiceAdapter } from "./jwt-auth.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1h",
      },
    }),
  ],
  providers: [
    {
      provide: "JwtService",
      useClass: NestJwtServiceAdapter,
    },
  ],
  exports: ["JwtService"],
})
export class JwtInfrastructureModule {}
