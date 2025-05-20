## Description
This project is a backend API built with the Nest framework, a progressive Node.js framework for building efficient and scalable server-side applications. The backend implements a modular architecture with clear separation of concerns:

The API layer handles HTTP requests and responses using NestJS controllers
Business logic is encapsulated in service classes
Data persistence is managed through Prisma ORM, connecting to a serverless Neon PostgreSQL database
Authentication and authorization are implemented using JWT strategy
The application leverages GraphQL with its built-in documentation and playground

The backend follows NestJS's dependency injection pattern and leverages TypeScript for type safety throughout the codebase. It includes proper error handling and validation of incoming data, with API exploration and testing available through GraphQL's standard documentation interface.

## Project setup

```bash
# Install dependencies
$ npm install
```

## Docker Setup

Use the following commands to run the project with Docker:

```bash
# Build and start Docker containers
$ docker-compose up

# Run in background
$ docker-compose up -d

# Stop containers
$ docker-compose down
```

After startup, you can access the application at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4500

When successfully started, both frontend and backend will be running without any errors in the console.

## API Documentation

To access the API Documentation, open the following URL:

```
http://localhost:4500/graphql
```

This URL displays the API documentation using Swagger UI, where you can also test each endpoint.

## Local Development

If you want to develop locally without Docker, use these commands:

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Code Quality & Git Workflow

### Biome Linter

This project uses Biome as the code linter:

```bash
# Check code formatting
$ npx biome check ./backend

# Apply automatic fixes
$ npx biome check --write ./backend
```

### Git Commands

We use Git and Lefthook to ensure code quality:

```bash
# Add changes to staging area
$ git add .

# Commit (Biome checks will run automatically)
$ git commit -m "commit message"

# Push to remote repository (Biome checks will run before pushing)
$ git push origin main
```

With Lefthook configuration, Biome code checks run automatically during commit and push operations. If there are code issues, the commit or push will fail.

## Testing

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Backend Architecture

### Directory Structure
| `docs/class-diagrams/` | Directory for detailed class diagrams (showing attributes, methods, relationships, etc.) |

The backend follows Domain-Driven Design (DDD) principles with a modular architecture:


### Architecture Layers

Each module is organized into three main layers:

1. **Domain Layer** (`domain/`)
   - Contains business logic, entities, and value objects
   - Framework-agnostic
   - Represents core business concepts

2. **Application Layer** (`application/`)
   - Contains use cases and application services
   - Orchestrates business operations
   - Handles DTOs and request/response mapping

3. **Infrastructure Layer** (`infrastructure/`, `repositories/`)
   - Contains external service integrations
   - Implements repository interfaces
   - Handles database operations and external API calls

### Key Principles

- **Module Boundaries**: Each module represents a bounded context
- **Dependency Rule**: Dependencies flow inward (Infrastructure → Application → Domain)
- **Interface Segregation**: Repositories use interfaces defined in the domain layer
- **Framework Independence**: Core business logic is isolated from framework-specific code

### Creating a New API

Follow these steps when creating a new API endpoint:

1. **Define the Domain Model**
   ```typescript
   // src/modules/[module]/domain/[entity].entity.ts
   export class Product {
     constructor(
       public readonly id: string,
       public readonly title: string,
       public readonly price: Money,
       // ... other properties
     ) {}
   }
   ```

2. **Create Value Objects (if needed)**
   ```typescript
   // src/modules/[module]/domain/[entity].value-objects.ts
   export class Money {
     constructor(
       public readonly amount: number,
       public readonly currency: string
     ) {}
   }
   ```

3. **Define Repository Interface**
   ```typescript
   // src/modules/[module]/repositories/[entity].repository.interface.ts
   export interface IProductRepository {
     findById(id: string): Promise<Product | null>;
     save(product: Product): Promise<void>;
     // ... other methods
   }
   ```

4. **Implement Repository**
   ```typescript
   // src/modules/[module]/repositories/[entity].repository.ts
   @Injectable()
   export class ProductRepository implements IProductRepository {
     constructor(private prisma: PrismaService) {}
     
     async findById(id: string): Promise<Product | null> {
       // Implementation
     }
   }
   ```

5. **Create DTOs**
   ```typescript
   // src/modules/[module]/application/[entity].dto.ts
   export class CreateProductDto {
     @IsString()
     title: string;
     
     @IsNumber()
     price: number;
   }
   ```

6. **Implement Service**
   ```typescript
   // src/modules/[module]/application/[entity].service.ts
   @Injectable()
   export class ProductService {
     constructor(private productRepository: IProductRepository) {}
     
     async createProduct(dto: CreateProductDto): Promise<Product> {
       // Business logic here
     }
   }
   ```

7. **Create Controller**
   ```typescript
   // src/modules/[module]/[entity].controller.ts
   @Controller('products')
   export class ProductController {
     constructor(private productService: ProductService) {}
     
     @Post()
     async create(@Body() dto: CreateProductDto) {
       return this.productService.createProduct(dto);
     }
   }
   ```

8. **Register in Module**
   ```typescript
   // src/modules/[module]/[module].module.ts
   @Module({
     controllers: [ProductController],
     providers: [
       ProductService,
       {
         provide: 'IProductRepository',
         useClass: ProductRepository
       }
     ],
     exports: [ProductService]
   })
   export class ProductModule {}
   ```

9. **Add Module to App Module**
   ```typescript
   // src/app.module.ts
   @Module({
     imports: [
       // ... other modules
       ProductModule
     ],
   })
   export class AppModule {}
   ```

10. **Write Tests**
    ```typescript
    // src/modules/[module]/application/[entity].service.spec.ts
    describe('ProductService', () => {
      // Test cases
    });
    ```

**Remember to:**
- Follow the dependency rule (outer layers depend on inner layers)
- Keep business logic in the domain layer
- Use dependency injection for loose coupling
- Write tests for each layer
