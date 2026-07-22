import { jsonify } from "../lib/serialize";
import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ticketsTable, usersTable } from "@workspace/db";
import {
  ListTicketsResponse,
  CreateTicketBody,
  CreateTicketResponse,
  UpdateTicketBody,
  UpdateTicketResponse,
} from "@workspace/api-zod";
import { requireUser } from "../middlewares/requireUser";

const router: IRouter = Router();

const SLA_HOURS: Record<string, number> = {
  urgent: 4,
  high: 12,
  medium: 24,
  low: 72,
};

function ticketSelect() {
  return db
    .select({
      id: ticketsTable.id,
      subject: ticketsTable.subject,
      description: ticketsTable.description,
      requesterName: ticketsTable.requesterName,
      priority: ticketsTable.priority,
      status: ticketsTable.status,
      assigneeId: ticketsTable.assigneeId,
      assigneeName: usersTable.name,
      slaDueAt: ticketsTable.slaDueAt,
      createdAt: ticketsTable.createdAt,
      resolvedAt: ticketsTable.resolvedAt,
    })
    .from(ticketsTable)
    .leftJoin(usersTable, eq(ticketsTable.assigneeId, usersTable.id));
}

function withBreach<T extends { slaDueAt: Date; status: string; resolvedAt: Date | null }>(
  row: T,
) {
  const { resolvedAt, ...rest } = row;
  const compareTo =
    row.status === "resolved" || row.status === "closed"
      ? resolvedAt ?? new Date()
      : new Date();
  return { ...rest, slaBreached: compareTo > row.slaDueAt };
}

router.get("/tickets", requireUser, async (req, res): Promise<void> => {
  if (!["support", "admin"].includes(req.currentUser!.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const rows = await ticketSelect().orderBy(desc(ticketsTable.createdAt));
  res.json(ListTicketsResponse.parse(jsonify(rows.map(withBreach))));
});

router.post("/tickets", requireUser, async (req, res): Promise<void> => {
  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const hours = SLA_HOURS[parsed.data.priority] ?? 24;
  const slaDueAt = new Date(Date.now() + hours * 3600 * 1000);
  const [created] = await db
    .insert(ticketsTable)
    .values({ ...parsed.data, slaDueAt })
    .returning();
  const [row] = await ticketSelect().where(eq(ticketsTable.id, created.id));
  res.status(201).json(CreateTicketResponse.parse(jsonify(withBreach(row))));
});

router.patch("/tickets/:id", requireUser, async (req, res): Promise<void> => {
  if (!["support", "admin"].includes(req.currentUser!.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateTicketBody.safeParse(req.body);
  if (!parsed.success || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [existing] = await db
    .select()
    .from(ticketsTable)
    .where(eq(ticketsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.priority && parsed.data.priority !== existing.priority) {
    const hours = SLA_HOURS[parsed.data.priority] ?? 24;
    updates.slaDueAt = new Date(
      existing.createdAt.getTime() + hours * 3600 * 1000,
    );
  }
  const nowResolved =
    (parsed.data.status === "resolved" || parsed.data.status === "closed") &&
    existing.status !== "resolved" &&
    existing.status !== "closed";
  if (nowResolved) {
    updates.resolvedAt = new Date();
  }
  await db.update(ticketsTable).set(updates).where(eq(ticketsTable.id, id));
  const [row] = await ticketSelect().where(eq(ticketsTable.id, id));
  res.json(UpdateTicketResponse.parse(jsonify(withBreach(row))));
});

export default router;
