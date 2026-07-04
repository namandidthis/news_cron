import { integer, pgTable, varchar,text,timestamp } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";


export const newsTable= pgTable("news",{
    guid: text("guid").primaryKey(),
    source: text("source").notNull(),
    category: text("category").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    link: text("link").notNull(),
    publishedAt: timestamp("published_at"),
    createdAt:   timestamp("created_at").defaultNow().notNull(),

})

export const userTable = pgTable("users",{
    id: uuid("id").primaryKey().defaultRandom(),
    email:text("email").notNull(),
    deliveryTime: text("delivery_time").notNull(),
    preferredLanguage: text("preferred_language").notNull().default("English"),
    categories: text("categories").array().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),

})