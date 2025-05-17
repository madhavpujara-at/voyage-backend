# Teams Module

This module implements team management functionality following Clean Architecture principles.

## Validation Strategy

The Teams module employs a multi-layered validation approach:

### 1. API-Level Validation (Presentation Layer)

Located in `presentation/validation/teamValidationSchemas.ts`:
- Uses Zod schemas to validate incoming HTTP requests
- Validates structure, types, and format of input data
- Ensures data conforms to API contract before reaching controllers
- Provides clear error messages for client-side consumption

The validation middleware:
- Applies schemas to combined request data (body, params, query)
- Transforms validated data into typed objects
- Replaces request.body with the validated data for controllers to use

### 2. Entity-Level Validation (Domain Layer)

Located in `domain/entities/Team.ts`:
- Enforces core business rules and invariants
- Ensures entities can never exist in an invalid state
- Provides a single source of truth for business validation rules
- Independent of HTTP or framework-specific concerns

## Data Transfer Objects (DTOs)

- Located in `application/useCases/*/[UseCase]RequestDto.ts` and `[UseCase]ResponseDto.ts`
- Define data structure for inputs and outputs of use cases 
- Focus on data structure, not validation logic
- Act as a contract between presentation and application layers
- Validation happens before data reaches these DTOs

## Validation Flow

1. HTTP request received
2. Request data validated against Zod schemas in middleware
3. If validation fails, 400 response with detailed errors
4. If validation passes, controller receives validated data
5. Data mapped to application layer DTOs
6. Controller passes DTOs to use cases
7. Entity-level validation as final protection layer

This approach aligns with the Clean Architecture principles defined in the `backend_plan.md`, ensuring:
- Proper separation of concerns
- Validation at appropriate architectural boundaries
- DTOs focused on structure rather than validation
- Multiple layers of protection
- Consistent error handling 