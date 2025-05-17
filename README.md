# Voyage Backend

Backend service for the Voyage travel planning platform.

## Architecture

This project follows Clean Architecture principles, organizing code into layers:

- **Domain Layer**: Core business entities and interfaces
- **Application Layer**: Use cases and orchestration logic
- **Infrastructure Layer**: External concerns like databases and APIs
- **Presentation Layer**: Controllers, routes, and HTTP handling

Each module maintains strict separation of concerns and follows SOLID principles:
- Dependencies flow inward (outer layers depend on inner layers)
- Domain entities are independent of infrastructure concerns
- Interfaces define boundaries between layers

## Tech Stack

- TypeScript
- Node.js/Express
- Prisma ORM
- PostgreSQL
- Jest (Testing)

## Development

Instructions for setting up the development environment will be added.
