import { serial, bigint, timestamp, pgTable } from "drizzle-orm/pg-core";

export const dailyVisitor = pgTable("daily_visitor", {
  id: serial().notNull().primaryKey(),
  count: bigint({ mode: "number" }).default(0),
  day_start: timestamp().notNull().unique(),
});

export const dailyLiveServey = pgTable("daily_live_survey", {
  id: serial().notNull().primaryKey(),
  count: bigint({ mode: "number" }).default(0),
  day_start: timestamp().defaultNow(),
});
