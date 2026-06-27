import { integer, pgTable, varchar,text,timestamp } from "drizzle-orm/pg-core";


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