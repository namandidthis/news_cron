import dotenv from "dotenv";
import postgres from "postgres";
import * as schema from "./schema.ts";
import { drizzle } from "drizzle-orm/postgres-js";

dotenv.config();

export const sql = postgres(process.env.DATABASE_URL!);


export const db = drizzle(sql,{schema});

