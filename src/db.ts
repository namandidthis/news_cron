import postgres from "postgres";
import * as schema from "./schema.ts";
import { drizzle } from "drizzle-orm/postgres-js";


export const sql = postgres(process.env.DATABASE_URL!);


export const db = drizzle(sql,{schema});

