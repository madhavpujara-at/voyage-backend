# SOP: Application Layer Development

## 1. Introduction & Purpose

The Application Layer is a core component of our Clean Architecture approach. Its primary purpose is to orchestrate the application's use cases by containing application-specific business logic. It acts as an intermediary:
*   It is called by the Presentation Layer.
*   It calls upon the Domain Layer to fulfill business rules and access core entities.

This layer ensures that application logic is decoupled from UI concerns (Presentation) and data access/external service details (Infrastructure).

## 2. Directory Structure & Location

*   **Standard Path:** `src/modules/[ModuleName]/application/`
*   **Internal Structure:**
    *   `useCases/` (or `commands/` & `queries/` for CQRS patterns)
        *   Each use case resides in its own sub-folder, e.g., `createUser/`, `getProductDetails/`.
        *   Files within each use case folder typically include:
            *   `[UseCaseName].ts` (e.g., `createUser.ts`): Contains the core logic of the use case.
            *   `[UseCaseName]RequestDto.ts`: Defines the structure of the input data for the use case.
            *   `[UseCaseName]ResponseDto.ts`: Defines the structure of the output data from the use case.
    *   `dtos/` (Optional: can be used for shared DTOs across multiple use cases if not placed within individual use case folders).
    *   `services/` (Optional): For application-specific services that are not use cases themselves but might orchestrate multiple use cases or provide broader application-level functionalities. These differ from Domain Services, which contain core business logic.
    *   `interfaces/` (Optional): For defining interfaces specific to application services (e.g., `INotificationServiceApplication`) or for DTO validation schemas if validation is handled at this layer and requires abstract definitions.

## 3. Key Components & Responsibilities

*   **Use Cases (Interactors/Handlers):**
    *   **Definition:** Represents a specific, self-contained piece of application functionality or a business scenario (e.g., "Register User," "Calculate Order Total," "Fetch Product Recommendations").
    *   **Encapsulation:** Each use case class/function encapsulates all the steps and logic required for that one specific operation.
    *   **Interaction:** It coordinates with Domain Layer components (entities, domain services, and repository interfaces) to execute business rules and data operations. It should *not* bypass the Domain Layer to interact directly with Infrastructure.
*   **Data Transfer Objects (DTOs):**
    *   **Purpose:** DTOs serve as simple, serializable data containers that define the contract for data flowing into (Request DTOs) and out of (Response DTOs) the Application Layer's use cases.
    *   **Characteristics:**
        *   They should be plain objects with properties, ideally without any business logic or behavior.
        *   They help decouple the Application Layer from the specific data formats of the Presentation or Infrastructure layers.
    *   **Naming:** Clearly distinguish between request (e.g., `CreateUserRequestDto`) and response (e.g., `CreateUserResponseDto`) DTOs.
*   **(Optional) Application Services:**
    *   **Use Cases:** Employed when a piece of application logic is broader than a single use case, or when orchestrating multiple use cases. For example, an `OrderProcessingService` in the application layer might coordinate `ValidateOrderUseCase`, `ProcessPaymentUseCase`, and `UpdateInventoryUseCase`.
    *   **Distinction from Domain Services:** Application services deal with application flow and orchestration, while Domain Services encapsulate core, reusable business rules and logic that are independent of any single application.
*   **(Optional) Interfaces:**
    *   **Application Service Interfaces:** If application services are used, their interfaces can be defined here to allow for different implementations or easier testing.
    *   **DTO Validation Interfaces:** If a common structure for validation rules or schemas is used across DTOs and handled within the application layer, interfaces can define these.

## 4. Dependencies

*   **ALLOWED Dependencies:**
    *   **Domain Layer:** The Application Layer **MUST** depend on abstractions (interfaces) and entities defined in the Domain Layer. This includes repository interfaces, domain service interfaces, and domain entities/value objects.
*   **FORBIDDEN Dependencies:**
    *   **Presentation Layer:** The Application Layer **MUST NOT** have any knowledge of or dependencies on the Presentation Layer (e.g., HTTP controllers, GraphQL resolvers, UI components).
    *   **Infrastructure Layer:** The Application Layer **MUST NOT** depend directly on concrete implementations from the Infrastructure Layer (e.g., specific database clients, ORMs, external API SDKs). Dependencies on infrastructure are managed through the Domain Layer's repository/service interfaces.

## 5. Workflow: Implementing a New Use Case

1.  **Define the Contract (DTOs):**
    *   Create `[UseCaseName]RequestDto.ts`: Define the precise input data structure required by the use case. Include necessary data fields and their types.
    *   Create `[UseCaseName]ResponseDto.ts`: Define the precise output data structure that the use case will return upon successful execution or in case of expected business errors (if error details are part of the DTO).
2.  **Implement the Use Case Logic (`[UseCaseName].ts`):**
    *   Create a class or function for the use case (e.g., `CreateUserUseCase`).
    *   The primary method/function should accept the `RequestDto` as a parameter.
    *   **Inject Dependencies:** Required dependencies (e.g., repository interfaces from the Domain layer like `IUserRepository`) should be injected, typically via the constructor.
    *   **Logic Implementation:**
        *   Perform any application-level validation on the input DTO if not handled by a dedicated validation mechanism.
        *   Interact with Domain Layer components:
            *   Fetch existing entities or create new ones via repository interfaces.
            *   Call Domain Services for complex business rule execution.
        *   Orchestrate the flow of operations.
        *   Map domain entities or results to the `ResponseDto`.
    *   Return the `ResponseDto`.
3.  **Dependency Injection:**
    *   Ensure that concrete implementations of dependencies (e.g., `PostgresUserRepository` implementing `IUserRepository`) are provided to the use case from outside the Application Layer, typically by a dependency injection container or composition root at the application's entry point (often in or near the `main.ts` or server setup).
    *   Constructor injection is the preferred method for providing dependencies to use case classes.
4.  **Application-Level Validation (If Applicable):**
    *   Decide where DTO validation occurs. It can be:
        *   In the Presentation Layer (for basic format/type checks).
        *   In the Application Layer (for checks specific to the use case input, before domain logic).
        *   Within Domain Entities/Services (for business rule invariants).
    *   If handled in the Application Layer, use validation libraries or custom validation logic to check the `RequestDto`. This validation should be distinct from domain entity invariants.
5.  **Unit Testing:**
    *   Write unit tests for each use case.
    *   **Focus:** Test the logic within the use case itself: the orchestration, calls to domain services, and mapping to DTOs.
    *   **Mocking:** Mock all external dependencies, especially Domain Layer interfaces (repositories, domain services). This isolates the use case logic for testing.
    *   **Verification:** Assert that:
        *   Dependencies are called with correct arguments.
        *   The `ResponseDto` is correctly formed based on different inputs and mock behaviors.
        *   Errors are handled as expected.

## 6. Best Practices

*   **Single Responsibility Principle (SRP):** Each use case should have one clear responsibility and reason to change. Avoid creating overly broad use cases.
*   **Immutability:** Favor immutable DTOs and internal data structures to prevent unintended side effects.
*   **Explicit Error Handling:** Define a clear and consistent strategy for how use cases report business errors or exceptional conditions. This could involve returning result objects (e.g., with success/failure status and data/error details) or using typed custom exceptions. Avoid leaking low-level exceptions.
*   **Transaction Management:** While the actual transaction management (begin, commit, rollback) is often handled by the Infrastructure layer (e.g., via a decorator or middleware wrapping the use case execution), the Application Layer use case defines the boundary of the transaction. The use case should encompass a complete business operation that either fully succeeds or fully fails.
*   **Idempotency:** For use cases that modify state (commands), consider designing them to be idempotent where appropriate. This means calling the use case multiple times with the same input should have the same effect as calling it once.
*   **No Framework/Infrastructure Leakage:** Strictly avoid any direct references to web frameworks (e.g., Express request/response objects), ORM-specific features, or other infrastructure concerns within the Application Layer code. Use domain abstractions.
*   **DTOs as Data Contracts:** Treat DTOs strictly as data contracts. They should not contain business logic. Logic belongs in use cases or domain services/entities.

## 7. Example (Simplified GetProductDetailsUseCase)

**`getProductDetailsRequestDto.ts`**
```typescript
export interface GetProductDetailsRequestDto {
  productId: string;
}
```

**`getProductDetailsResponseDto.ts`**
```typescript
export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  // other relevant details
}

export interface GetProductDetailsResponseDto {
  product: ProductDetails | null;
  error?: string; // Example of including potential error message
}
```

**`getProductDetails.ts`**
```typescript
import { IProductRepository } from '../../domain/interfaces/repositories/IProductRepository'; // Assuming path
import { Product } from '../../domain/entities/product'; // Assuming path
import { GetProductDetailsRequestDto, GetProductDetailsResponseDto }
from './getProductDetailsDtos'; // Simplified DTO import

export class GetProductDetailsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    request: GetProductDetailsRequestDto
  ): Promise<GetProductDetailsResponseDto> {
    try {
      const product = await this.productRepository.findById(request.productId);

      if (!product) {
        return { product: null, error: 'Product not found' };
      }

      // Map domain entity to DTO
      const productDetailsDto = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.getValue(), // Assuming price is a Value Object
      };

      return { product: productDetailsDto };
    } catch (err: any) {
      console.error('Error in GetProductDetailsUseCase:', err);
      // More sophisticated error handling should be used in a real app
      return { product: null, error: 'An unexpected error occurred' };
    }
  }
}
``` 