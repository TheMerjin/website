/**
 * Fetches all rows from Supabase `posts` and writes one Markdown file per post
 * into `md_posts/` (YAML frontmatter + body = stored `content`).
 *
 * Env (same names as Astro / src/lib/supabase.js):
 *   PUBLIC_SUPABASE_URL
 *   PRIVATE_SUPABASE_ROLE_KEY
 *
 * Loads `.env` / `.env.production` from the project root when vars are unset
 * (npm prebuild runs before Astro, so shell may not have loaded them yet).
 */
import { createClient } from "@supabase/supabase-js";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "md_posts");

function loadDotenvFiles() {
  for (const name of [".env", ".env.production"]) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    const content = readFileSync(p, "utf8");
    for (let line of content.split("\n")) {
      line = line.replace(/\r$/, "");
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

function yamlFrontmatter(obj) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    lines.push(`${k}: ${JSON.stringify(String(v))}`);
  }
  lines.push("---");
  return lines.join("\n");
}

loadDotenvFiles();

const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.PRIVATE_SUPABASE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "export-md-posts: missing PUBLIC_SUPABASE_URL or PRIVATE_SUPABASE_ROLE_KEY (set in env or .env / .env.production).",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: posts, error } = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });

if (error) {
  console.error("export-md-posts: Supabase error:", error.message);
  process.exit(1);
}

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true });
}
mkdirSync(outDir, { recursive: true });

let n = 0;
for (const row of posts || []) {
  const id = row.id;
  if (!id) continue;

  const fm = yamlFrontmatter({
    id,
    title: row.title ?? "",
    username: row.username ?? "",
    author_id: row.author_id ?? "",
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
  });

  const body = typeof row.content === "string" ? row.content : "";
  const file = join(outDir, `${id}.md`);
  writeFileSync(file, `${fm}\n\n${body}`, "utf8");
  n++;
}

if (n === 0) {
  writeFileSync(join(outDir, ".gitkeep"), "", "utf8");
}

console.log(`export-md-posts: wrote ${n} file(s) to ${outDir}`);
