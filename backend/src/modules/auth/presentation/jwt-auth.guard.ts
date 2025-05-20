import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlContextType } from "@nestjs/graphql";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../../infrastructures/supabase";

@Injectable()
export class AuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token: string | undefined;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let request: any;

    if (context.getType() === "http") {
      // HTTPリクエストの場合
      const request = context.switchToHttp().getRequest();
      token = this.extractTokenFromHeader(request);
    } else if (context.getType() === "ws") {
      // WebSocketの場合
      const client = context.switchToWs().getClient();
      token = this.extractTokenFromWsConnection(client);
    } else if (context.getType<GqlContextType>() === "graphql") {
      // GraphQLの場合
      const gqlContext = context.getArgByIndex(2);
      token = this.extractTokenFromGqlContext(gqlContext);
    }

    if (!token) {
      throw new UnauthorizedException("認証トークンがありません");
    }

    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error) {
        throw new UnauthorizedException("無効なトークンです");
      }

      if (request) {
        request.user = data.user;
      }
      return true;
    } catch {
      throw new UnauthorizedException("認証に失敗しました");
    }
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private extractTokenFromWsConnection(client): string | undefined {
    const token = client.handshake.headers["sec-websocket-protocol"];
    return token;
  }

  private extractTokenFromGqlContext(gqlContext): string | undefined {
    const token = gqlContext.req.headers.authorization?.split(" ")[1];
    return token;
  }
}
