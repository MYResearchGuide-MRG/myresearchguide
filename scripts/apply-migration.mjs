// Applies pending supabase/migrations/*.sql to the remote project.
//
//   npm run db:migrate                      # apply all pending (reads .env.local)
//   npm run db:migrate -- 0002              # apply only matching files
//
// Override connection via DB_HOST / DB_USER / DB_PORT / DB_PASSWORD env vars
// (defaults target the direct db.<ref> host; on IPv6-only networks use the
// pooler: DB_HOST=aws-0-<region>.pooler.supabase.com DB_PORT=6543
// DB_USER=postgres.<ref>).
//
// Tracks applied files in mrg_schema_migrations. If the tracker is empty but
// the 0001 tables already exist (applied manually via the dashboard SQL
// editor), 0001 is recorded as applied instead of re-run.
import { readFileSync, readdirSync } from "node:fs";
import pg from "pg";

function loadEnvLocal() {
  const out = {};
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // no .env.local — rely on process env
  }
  return out;
}

const env = { ...loadEnvLocal(), ...process.env };
const ref = "ttfreondychefrkzclvl";
const password = env.DB_PASSWORD;
if (!password) {
  console.error("Missing DB_PASSWORD (env or .env.local).");
  process.exit(1);
}

const filter = process.argv.slice(2)[0];

const client = new pg.Client({
  host: env.DB_HOST ?? `db.${ref}.supabase.co`,
  port: Number(env.DB_PORT ?? 5432),
  database: "postgres",
  user: env.DB_USER ?? "postgres",
  password,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

await client.connect();

// Split on ";\n" only OUTSIDE dollar-quoted bodies ($$...$$) and quoted
// strings, and skip line comments.
function splitStatements(sql) {
  const stmts = [];
  let current = "";
  let inDollar = false;
  let inQuote = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    const next = sql[i + 1];
    if (inDollar) {
      current += c;
      if (c === "$" && next === "$") {
        current += "$";
        i++;
        inDollar = false;
      }
      continue;
    }
    if (inQuote) {
      current += c;
      if (c === "'") {
        if (next === "'") {
          current += "'";
          i++;
        } else {
          inQuote = false;
        }
      }
      continue;
    }
    if (c === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
      current += "\n";
      continue;
    }
    if (c === "$" && next === "$") {
      current += "$$";
      i++;
      inDollar = true;
      continue;
    }
    if (c === "'") {
      inQuote = true;
      current += c;
      continue;
    }
    if (c === ";" && next === "\n") {
      stmts.push(current.trim());
      current = "";
      i++;
      continue;
    }
    current += c;
  }
  if (current.trim()) stmts.push(current.trim());
  return stmts.filter(Boolean);
}

await client.query(`
  create table if not exists public.mrg_schema_migrations (
    file text primary key,
    applied_at timestamptz not null default now()
  )
`);

// Detect a manually-applied 0001 (dashboard SQL editor) so it isn't re-run.
const { rows: tracked } = await client.query(
  "select file from public.mrg_schema_migrations"
);
if (tracked.length === 0) {
  const { rows: tables } = await client.query(
    `select table_name from information_schema.tables
     where table_schema = 'public' and table_name = 'profiles'`
  );
  if (tables.length > 0) {
    await client.query(
      "insert into public.mrg_schema_migrations (file) values ('0001_init.sql')"
    );
    console.log("0001_init.sql already applied (manual) — recorded as done.");
  }
}

const dir = new URL("../supabase/migrations/", import.meta.url).pathname;
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .filter((f) => !filter || f.includes(filter))
  .sort();

const done = new Set(tracked.map((r) => r.file));
let applied = 0;

for (const file of files) {
  if (done.has(file)) continue;
  const sql = readFileSync(`${dir}/${file}`, "utf8");
  const statements = splitStatements(sql);
  console.log(`Applying ${file} (${statements.length} statements)…`);
  for (const stmt of statements) {
    await client.query(stmt);
  }
  await client.query("insert into public.mrg_schema_migrations (file) values ($1)", [file]);
  applied++;
}

if (applied === 0) console.log("Nothing to apply — migrations up to date.");

// Sanity: core tables + guard trigger present.
const { rows: tables } = await client.query(
  `select table_name from information_schema.tables
   where table_schema = 'public' and table_name in
   ('profiles','researcher_profiles','team_profiles','articles','mrg_schema_migrations')
   order by 1`
);
const { rows: triggers } = await client.query(
  `select tgname from pg_trigger
   where tgname = 'profiles_protect_identity' and not tgisinternal`
);

await client.end();
console.log("Tables:", tables.map((r) => r.table_name).join(", "));
console.log("Guard trigger:", triggers.length ? "profiles_protect_identity ✓" : "MISSING!");
