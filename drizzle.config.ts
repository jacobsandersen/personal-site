import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: process.env.CF_ACCOUNT_ID!,
        databaseId: process.env.DB_ID!,
        token: process.env.D1_TOKEN!,
    }
})
