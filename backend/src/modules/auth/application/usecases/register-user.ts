import { Inject, Injectable } from "@nestjs/common";
import { Email, Nickname } from "../../../user/domain/user.value-objects";
import { mapToUserPrimitive } from "../../../user/presentation/user.dtos";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { Password } from "../../domain/auth.value-objects";
import { ITokenService } from "../../domain/token/token.service.interface";
import { IAuthService } from "../../infrastructure/supabase/auth.service.interface";
import { AuthResponseDto } from "../../presentation/graphql/responses/auth-response";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject("IAuthService") private readonly authService: IAuthService,
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("ITokenService") private readonly tokenService: ITokenService,
  ) {}

  async execute(input: {
    email: string;
    password: string;
    nickname: string;
  }): Promise<AuthResponseDto> {
    // 1. validate input
    const { email, password, nickname } = input;

    const emailObj = new Email(email);
    const passwordObj = new Password(password);
    const nicknameObj = new Nickname(nickname);
    // 2. register user via supabase auth service
    const authenticatedUser = await this.authService.register(emailObj, passwordObj, nicknameObj);

    if (!authenticatedUser) {
      throw new Error("User registration failed");
    }
    // 2. create user entity with authId
    const user = authenticatedUser;

    if (!user || !user.authId) {
      throw new Error("User registration failed");
    }

    // 3. save user to database
    const storedUser = await this.userRepository.save(user);
    if (!storedUser || !storedUser.id) {
      throw new Error("User registration failed");
    }

    const accessToken = this.tokenService.createAccessToken(storedUser);
    const refreshToken = this.tokenService.createRefreshToken(storedUser.id.getValue());

    // 4. return auth result
    return {
      user: mapToUserPrimitive(storedUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
