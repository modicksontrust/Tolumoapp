import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const acquisitionsTable = pgTable("acquisitions", {
  id: serial("id").primaryKey(),
  subAgentId: integer("sub_agent_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email"),
  status: text("status").notNull().default("lead"),
  commissionAmount: numeric("commission_amount", {
    precision: 12,
    scale: 2,
  })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertAcquisitionSchema = createInsertSchema(
  acquisitionsTable,
).omit({ id: true, createdAt: true });
export type InsertAcquisition = z.infer<typeof insertAcquisitionSchema>;
export type Acquisition = typeof acquisitionsTable.$inferSelect;
