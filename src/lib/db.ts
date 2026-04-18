import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export interface AddEmailInput {
  email: string;
  ip: string;
  userAgent: string;
}

export interface AddEmailResult {
  created: boolean;
  alreadyJoined: boolean;
}

export interface WaitlistDb {
  addEmail(input: AddEmailInput): AddEmailResult;
  count(): number;
  close(): void;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source_ip TEXT,
  user_agent TEXT
);
`;

export function createWaitlistDb(dbPath: string): WaitlistDb {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);

  const insertStmt = db.prepare(
    "INSERT INTO waitlist (email, source_ip, user_agent) VALUES (?, ?, ?)",
  );
  const countStmt = db.prepare("SELECT COUNT(*) as n FROM waitlist");

  return {
    addEmail({ email, ip, userAgent }) {
      const normalized = email.trim().toLowerCase();
      try {
        insertStmt.run(normalized, ip, userAgent);
        return { created: true, alreadyJoined: false };
      } catch (err) {
        const e = err as { code?: string };
        if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
          return { created: false, alreadyJoined: true };
        }
        throw err;
      }
    },
    count() {
      const row = countStmt.get() as { n: number };
      return row.n;
    },
    close() {
      db.close();
    },
  };
}

let singleton: WaitlistDb | null = null;

export function getWaitlistDb(): WaitlistDb {
  if (!singleton) {
    const dbPath =
      process.env.WAITLIST_DB_PATH ??
      path.join(process.cwd(), "data", "waitlist.db");
    singleton = createWaitlistDb(dbPath);
  }
  return singleton;
}
