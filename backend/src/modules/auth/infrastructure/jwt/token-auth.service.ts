// import { Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { User } from "src/modules/user/domain/user.entities";
// import { JwtPayload } from "../../domain/token/jwt-model";

// @Injectable()
// export class TokenService {
//   constructor(private jwtService: JwtService) {}

//   generateAccessToken(user: User): string {
//     const payload: Partial<JwtPayload> = {
//       sub: user.id?.getValue(),
//       email: user.email.getValue(),
//     };

//     return this.jwtService.sign(payload);
//   }

//   generateRefreshToken(userId: string): string {
//     const payload = { sub: userId };

//     return this.jwtService.sign(payload, { expiresIn: "7d" });
//   }

//   validateAccessToken(token: string): JwtPayload | null {
//     return this.jwtService.verify<JwtPayload>(token);
//   }

//   decodeToken(token: string): JwtPayload | null {
//     return this.jwtService.decode<JwtPayload>(token);
//   }
// }
