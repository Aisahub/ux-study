import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code's scratch space. `.claude/worktrees/` holds a whole second
    // checkout while an agent is working in one and is empty the rest of the
    // time, so a bare `npx eslint` would report thousands of problems or none
    // depending on the moment it ran. None of it is this project's source.
    // `.claude/launch.json` is the one file here that is committed, and it is
    // configuration rather than code.
    ".claude/**",
  ]),
]);

export default eslintConfig;
