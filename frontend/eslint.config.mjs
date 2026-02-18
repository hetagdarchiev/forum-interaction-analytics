import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import fsdPlugin from "eslint-plugin-fsd-lint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.

  fsdPlugin.configs.recommended,

  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    ".history/**",
  ]),

  {
    plugins: {
      fsd: fsdPlugin,
    },
    rules: {
      // Enforces FSD layer import rules (e.g., features cannot import pages)
      "fsd/forbidden-imports": "error",

      // Disallows relative imports between slices/layers, use aliases (@)
      // Allows relative imports within the same slice by default (configurable)
      "fsd/no-relative-imports": "error",

      // Enforces importing only via public API (index files)
      "fsd/no-public-api-sidestep": "error",

      // Prevents direct imports between slices in the same layer
      "fsd/no-cross-slice-dependency": "error",

      // Prevents UI imports in business logic layers (e.g., entities)
      "fsd/no-ui-in-business-logic": "error",

      // Forbids direct import of the global store
      "fsd/no-global-store-imports": "error",

      // Enforces import order based on FSD layers
      "fsd/ordered-imports": "warn",
    },
    settings: {
      "fsd-lint": {
        layers: ["app", "pages", "widgets", "features", "entities", "shared"],
      },
    },
  },
]);

export default eslintConfig;
