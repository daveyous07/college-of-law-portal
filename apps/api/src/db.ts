import { drizzle } from "drizzle-orm/d1";
import * as schema from "@col/db";

export type Env = {
  DB: D1Database;
  MEDIA: R2Bucket;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
};

export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}

export type AppDb = ReturnType<typeof getDb>;
