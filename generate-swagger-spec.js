/* eslint-disable */
const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
// We need to adjust the path to swaggerOptions because this script is in the root,
// and swaggerOptions.ts will be compiled to dist/config/swaggerOptions.js
// However, swagger-jsdoc itself resolves paths relative to where IT is called from,
// but the paths *inside* swaggerOptions.ts are relative to ITS OWN location.
// For the 'apis' paths in swaggerOptions.ts to work correctly when this script
// is run from the project root AFTER compilation, they need to be relative
// to the compiled location of swaggerOptions.js (dist/config).
// The swaggerOptions.ts already uses path.join(__dirname, ...) which handles this.

// IMPORTANT: This script assumes you have BUILT your project first (e.g., using 'npm run build')
// so that 'dist/config/swaggerOptions.js' exists.
const swaggerOptions = require("./dist/config/swaggerOptions").default;

const swaggerSpec = swaggerJsdoc(swaggerOptions);

fs.writeFileSync("./openapi-spec.json", JSON.stringify(swaggerSpec, null, 2));

console.log("OpenAPI specification generated successfully: openapi-spec.json");
