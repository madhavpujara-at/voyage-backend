import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Digital Kudos API",
      version: "1.0.0",
      description: "API documentation for the Digital Kudos backend services",
      contact: {
        name: "API Support",
        // url: 'http://www.example.com/support',
        // email: 'support@example.com',
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Adjusted: Removed /v1 to match server.ts
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  // Note: __dirname will point to the dist/config folder after compilation,
  // so we need to adjust the path to point to the src folder where the route files are.
  // This assumes your TS output directory is 'dist' and you run the app from the project root.
  apis: [
    // Corrected paths to point to source .ts files from project root
    path.join(process.cwd(), "src/modules/**/presentation/routes/*.routes.ts"),
    path.join(process.cwd(), "src/presentation/routes/*.routes.ts"),
    path.join(process.cwd(), "src/modules/**/presentation/validation/*.schema.ts"),
    path.join(process.cwd(), "src/presentation/schemas/openapi.schemas.ts"),
    // Add paths to your DTOs or schema definition files if they are separate
  ],
};

export default swaggerOptions;
