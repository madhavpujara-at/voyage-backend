# KudoCards Module

This module implements kudoCards management functionality following Clean Architecture principles.

## Validation Strategy

The KudoCards module employs a multi-layered validation approach:

### 1. API-Level Validation (Presentation Layer)

Located in `presentation/validation/`:
- Uses Zod schemas to validate incoming HTTP requests
- Validates structure, types, and format of input data
- Ensures data conforms to API contract before reaching controllers
- Provides clear error messages for client-side consumption

The validation middleware:
- Applies schemas to request data (body, query params)
- Transforms validated data into typed objects
- Passes validated data to controllers

### 2. Entity-Level Validation (Domain Layer)

Located in `domain/entities/KudoCards.ts`:
- Enforces core business rules and invariants
- Ensures entities can never exist in an invalid state
- Independent of HTTP or framework-specific concerns

## Data Transfer Objects (DTOs)

Each use case has its own request and response DTOs:
- Located in `application/useCases/[UseCaseName]/[UseCaseName]RequestDto.ts` and `[UseCaseName]ResponseDto.ts`
- Define data structure for inputs and outputs of use cases 
- Act as a contract between presentation and application layers
- Keep the application layer focused on business logic rather than HTTP details

## Clean Architecture Implementation

1. **Domain Layer**:
   - Contains the `KudoCards` entity and repository interfaces
   - Independent of frameworks and external concerns

2. **Application Layer**:
   - Contains use cases that implement business logic:
     - `CreateKudoCardsUseCase`: Creates new kudoCards
     - `ListKudoCardsUseCase`: Lists kudoCards with filtering and sorting
   - Each use case has its own request/response DTOs
   - No dependency on web frameworks or specific data stores

3. **Presentation Layer**:
   - Handles HTTP requests and responses
   - Validates incoming data
   - Maps between HTTP requests and application layer DTOs
   - Uses dependency injection for testability

4. **Infrastructure Layer**:
   - Implements repository interfaces using Prisma
   - Contains complex query logic for filters and sorting
   - Keeps technical details isolated from business logic

This approach ensures separation of concerns and makes the codebase more maintainable and testable. 