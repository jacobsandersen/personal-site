import { sqliteTable, AnySQLiteColumn, text, numeric } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const scribbleContent = sqliteTable("scribble_content", {
	slug: text().primaryKey(),
	url: text().notNull(),
	doc: text().notNull(),
	deleted: numeric().default(sql`(FALSE)`).notNull(),
	updatedAt: numeric("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

