import { Inject, Injectable } from "@nestjs/common";
import { IAuthService } from "../../infrastructure/supabase/auth.service.interface";

@Injectable()
export class LogoutUseCase {
  constructor(@Inject("IAuthService") private readonly authService: IAuthService) {}

  async execute(): Promise<boolean> {
    // Supabase Authでログアウト処理を実行
    return this.authService.logout();
  }
}
