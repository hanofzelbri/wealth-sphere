import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-axios",
  experimentalParser: true,
  input: "http://localhost:3001/api-json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "src/api-client",
  },
  plugins: [
    "@hey-api/schemas",
    "@hey-api/services",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "javascript",
      name: "@hey-api/types",
    },
    "@tanstack/react-query",
  ],
});
