import { Module } from "@nestjs/common";
import { UserRepositoryModule } from "../repositories/user.repository.module";
import { DeactivateUserUseCase } from "./usecases/deactivate-user";
import { GetUserUseCase } from "./usecases/get-user";
import { UpdateProfileUseCase } from "./usecases/update-profile";

@Module({
  imports: [UserRepositoryModule],
  providers: [GetUserUseCase, UpdateProfileUseCase, DeactivateUserUseCase],
  exports: [GetUserUseCase, UpdateProfileUseCase, DeactivateUserUseCase],
})
export class UserUseCasesModule {}
