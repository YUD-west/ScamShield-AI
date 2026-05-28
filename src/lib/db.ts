import fs from "fs";
import path from "path";

function sqlitePath(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return null;
  const relative = url.replace(/^file:/, "").replace(/^\//, "");
  return path.isAbsolute(relative) ? relative : path.join(process.cwd(), relative);
}

/** True when database is configured and SQLite file exists (or remote Postgres URL set). */
export function hasDatabase(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;

  if (url.startsWith("file:")) {
    const dbPath = sqlitePath();
    return dbPath ? fs.existsSync(dbPath) : false;
  }

  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}
