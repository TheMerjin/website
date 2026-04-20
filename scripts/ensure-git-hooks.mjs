/**
 * Points this repo at `.githooks/` so pre-commit runs on every commit.
 * No-op when there is no `.git` (e.g. some CI extract layouts).
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
if (!existsSync(join(root, ".git"))) {
  process.exit(0);
}
execSync("git config core.hooksPath .githooks", { cwd: root, stdio: "inherit" });
