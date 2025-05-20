import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  // Get GraphQL Context
  const ctx = GqlExecutionContext.create(context);

  // Extract request object
  const request = ctx.getContext().req;

  // JWT token is already verified via strategy and user is attached to request object
  return request.user;
});
