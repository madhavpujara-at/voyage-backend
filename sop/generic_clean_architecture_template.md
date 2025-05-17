# Clean Architecture Guidelines for [ModuleName] Module

This document outlines the architectural rules and guidelines for the [ModuleName] Module, adhering to Clean Architecture principles. The goal is to maintain a separation of concerns, ensure testability, and promote maintainability.

## Overview of Folder Structure

A typical module adhering to this architecture will have the following structure:

```plaintext
my-module/
│
├── domain/                     # Core business rules and entities
│   ├── entities/               # Business objects (independent of frameworks)
│   │   └── [entity].ts         # e.g., product.ts, user.ts
│   ├── interfaces/             # Repository and service interfaces
│   │   └── repositories/       # Repository interface definitions
│   └── services/               # Domain service interfaces
│
├── application/                # Application-specific business rules
│   └── useCases/               # Implementations of business scenarios
│       ├── [useCase1]/         # e.g., getProducts/
│       │   ├── [useCase1].ts   # e.g., getProducts.ts
│       │   ├── [useCase1]Factory.ts  # Factory for dependency injection
│       │   ├── [useCase1]RequestDto.ts  # Input DTO
│       │   └── [useCase1]ResponseDto.ts # Output DTO
│       └── [useCase2]/         # Additional use cases
│
├── presentation/               # Interface adapters (controllers, presenters)
│   ├── controllers/            # Request handlers
│   │   └── controller.ts       # Main controller implementation
│   ├── routes/                 # API route definitions
│   │   └── routes.ts           # Route configuration
│   ├── interfaces/             # Request/response interfaces
│   │   └── interface.ts        # Type definitions for requests
│   └── validation/             # Input validation schemas
│       └── schemas.ts          # Validation rules
│
├── infrastructure/             # Frameworks, drivers, external services
│   ├── database/               # Database configuration
│   ├── external/               # External API integrations
│   └── config/                 # Application configuration
│
├── repositories/               # Concrete repository implementations
│   ├── [repository].ts         # e.g., productRepository.ts
│   └── baseRepository.ts       # Common repository functionality
│
├── services/                   # External service implementations
│   └── [service].ts            # e.g., loggerService.ts
│
├── mappers/                    # Data transformation between layers
│   └── [mapper].ts             # e.g., productMapper.ts
│
└── dtos/                       # Data Transfer Objects
    ├── request/                # Request DTOs
    └── response/               # Response DTOs
```

## Core Layers & Responsibilities

The architecture is divided into distinct layers, each with specific responsibilities. Dependencies must always flow inwards: outer layers can depend on inner layers, but inner layers must not depend on outer layers. Abstractions (interfaces) are used to invert dependencies where necessary.

### 1. Domain Layer

*   **Directory:** `src/modules/[ModuleName]/domain/` (or your project's standard path to a module's domain layer)
*   **Purpose:** This is the heart of the module, containing the core business logic and rules, independent of any application or infrastructure concerns.
*   **Contents:**
    *   **`entities/`**: Business objects representing core concepts (e.g., `User`, `Order`, `Product`). These encapsulate data and behavior specific to the entity.
    *   **`interfaces/`**: Abstractions for domain-specific operations, primarily repository interfaces (e.g., `IUserRepository`, `IOrderRepository`). These define the contracts that the infrastructure layer will implement. Also, interfaces for domain services if needed.
    *   **`services/`**: Domain Services. These contain domain logic that doesn't naturally fit within a single entity. They orchestrate operations between multiple entities or perform calculations based on domain rules.
    *   **(Optional) `valueObjects/`**: Objects representing descriptive aspects of the domain with no conceptual identity (e.g., `Address`, `Money`).
    *   **(Optional) `domainEvents/`**: Represent significant occurrences within the domain that other parts of the system might react to.
*   **Dependencies:** This layer should have NO dependencies on any other layer in this module. It can depend on shared kernel/libraries if applicable.

### 2. Application Layer

*   **Directory:** `src/modules/[ModuleName]/application/` (or your project's standard path)
*   **Purpose:** Orchestrates the application's use cases. It contains the application-specific business logic and acts as an intermediary between the presentation layer and the domain layer.
*   **Contents:**
    *   **`useCases/`** (or `commands/` & `queries/`): Concrete implementations of specific application functionalities (e.g., `CreateUserUseCase`, `GetOrderDetailsQuery`). Each use case interactor/handler encapsulates the logic for one specific operation.
    *   **(Optional) `services/`**: Application Services that are not use cases but provide broader application-level functionalities or orchestrate multiple use cases.
    *   **(Optional) `interfaces/`**: Interfaces for application-specific services (e.g., `INotificationService`) or DTO validation, if not covered by domain interfaces.
    *   **DTOs (Data Transfer Objects)**: Defined here or in a dedicated `dtos/` subfolder. Used for input (request models) and output (response models) of use cases.
*   **Dependencies:** Depends on the `Domain` layer (entities, domain services, repository interfaces). Does NOT depend on `Presentation` or `Infrastructure`.

### 3. Presentation Layer

*   **Directory:** `src/modules/[ModuleName]/presentation/` (or your project's standard path)
*   **Purpose:** Handles all interactions with the outside world (e.g., users via web/mobile UI, other systems via HTTP APIs, CLI). It is responsible for presenting data and receiving input.
*   **Contents:**
    *   **`controllers/`** (or `handlers/`, `resolvers/` for GraphQL): Handles incoming requests, extracts data, calls appropriate application use cases, and returns responses.
    *   **`routes/`**: Defines the API endpoints or CLI command structures.
    *   **`validation/`**: Contains logic for validating incoming request data.
    *   **(Optional) `viewModels/` or `mappers/`**: For transforming application layer DTOs into presentation-specific formats if needed.
    *   **(Optional) `ui/` or `views/`**: If serving HTML directly or containing UI components.
*   **Dependencies:** Depends on the `Application` layer (use cases, DTOs).

### 4. Infrastructure Layer

*   **Directory:** `src/modules/[ModuleName]/infrastructure/` (or your project's standard path)
*   **Purpose:** Contains all external concerns and implementations of interfaces defined in inner layers. This includes databases, external API clients, file systems, message brokers, etc.
*   **Contents:**
    *   **`repositories/`**: Concrete implementations of the repository interfaces defined in the `Domain` (or `Application`) layer (e.g., `UserPostgresRepository`, `OrderMongoRepository`). This is where data access logic resides.
    *   **(Optional) `clients/`**: Clients for external services (e.g., payment gateways, notification services).
    *   **(Optional) `persistence/` or `database/`**: Database schema definitions, migrations, ORM configurations, connection management.
    *   **(Optional) `messaging/`**: Components for interacting with message queues or event streams.
*   **Dependencies:** Depends on the `Domain` and `Application` layers (typically by implementing interfaces defined there). Frameworks and external libraries are heavily used here. 