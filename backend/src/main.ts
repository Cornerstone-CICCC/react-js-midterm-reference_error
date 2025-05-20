import { Logger } from "@nestjs/common";
// main.ts
import { NestFactory } from "@nestjs/core";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  // CORS設定
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));

  const port = process.env.PORT ?? 4500;
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`GraphQL Endpoint: http://localhost:${port}/graphql`);
}
bootstrap();
