import { jsonify } from "../lib/serialize";
import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, acquisitionsTable, usersTable } from "@workspace/db";
import {
  ListAcquisitionsResponse,
  CreateAcquisitionBody,
  CreateAcquisitionResponse,
  UpdateAcquisitionBody,
  UpdateAcquisitionResponse,
  ListSubAgentsResponse,
} from "@workspace/api-zod";
import { requireUser } from "../middlewares/requireUser";

const router: IRouter = Router();

function acquisitionSelect() {
  return db
    .select({
      id: acquisitionsTable.id,
      subAgentId: acquisitionsTable.subAgentId,
      subAgentName: usersTable.name,
      studentName: acquisitionsTable.studentName,
      studentEmail: acquisitionsTable.studentEmail,
      status: acquisitionsTable.status,
      commissionAmount: sql<number>`${acquisitionsTable.commissionAmount}::float8`,
      createdAt: acquisitionsTable.createdAt,
    })
    .from(acquisitionsTable)
    .innerJoin(usersTable, eq(acquisitionsTable.subAgentId, usersTable.id));
}

router.get("/acquisitions", requireUser, async (req, res): Promise<void> => {
  const user = req.currentUser!;
  if (!["sub_agent", "super_agent", "admin"].includes(user.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const scoped = user.role === "sub_agent";
  const rows = await acquisitionSelect()
    .where(scoped ? eq(acquisitionsTable.subAgentId, user.id) : undefined)
    .orderBy(desc(acquisitionsTable.createdAt));
  res.json(ListAcquisitionsResponse.parse(jsonify(rows)));
});

router.post("/acquisitions", requireUser, async (req, res): Promise<void> => {
  if (req.currentUser!.role !== "sub_agent") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const parsed = CreateAcquisitionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(acquisitionsTable)
    .values({
      subAgentId: req.currentUser!.id,
      studentName: parsed.data.studentName,
      studentEmail: parsed.data.studentEmail ?? null,
      status: parsed.data.status ?? "lead",
      commissionAmount: String(parsed.data.commissionAmount ?? 0),
    })
    .returning();
  const [row] = await acquisitionSelect().where(
    eq(acquisitionsTable.id, created.id),
  );
  res.status(201).json(CreateAcquisitionResponse.parse(jsonify(row)));
});

router.patch(
  "/acquisitions/:id",
  requireUser,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);
    const parsed = UpdateAcquisitionBody.safeParse(req.body);
    if (!parsed.success || Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const user = req.currentUser!;
    if (!["sub_agent", "super_agent", "admin"].includes(user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const [existing] = await db
      .select()
      .from(acquisitionsTable)
      .where(eq(acquisitionsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Acquisition not found" });
      return;
    }
    if (user.role === "sub_agent" && existing.subAgentId !== user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const { commissionAmount, ...rest } = parsed.data;
    await db
      .update(acquisitionsTable)
      .set({
        ...rest,
        ...(commissionAmount !== undefined
          ? { commissionAmount: String(commissionAmount) }
          : {}),
      })
      .where(eq(acquisitionsTable.id, id));
    const [row] = await acquisitionSelect().where(eq(acquisitionsTable.id, id));
    res.json(UpdateAcquisitionResponse.parse(jsonify(row)));
  },
);

router.get("/sub-agents", requireUser, async (req, res): Promise<void> => {
  const role = req.currentUser!.role;
  if (role !== "super_agent" && role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const rows = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      totalAcquisitions: sql<number>`(select count(*)::int from ${acquisitionsTable} where ${acquisitionsTable.subAgentId} = ${usersTable.id})`,
      enrolledCount: sql<number>`(select count(*)::int from ${acquisitionsTable} where ${acquisitionsTable.subAgentId} = ${usersTable.id} and ${acquisitionsTable.status} in ('enrolled', 'paid'))`,
      totalCommission: sql<number>`coalesce((select sum(${acquisitionsTable.commissionAmount})::float8 from ${acquisitionsTable} where ${acquisitionsTable.subAgentId} = ${usersTable.id} and ${acquisitionsTable.status} = 'paid'), 0)`,
    })
    .from(usersTable)
    .where(eq(usersTable.role, "sub_agent"))
    .orderBy(usersTable.name);
  res.json(ListSubAgentsResponse.parse(jsonify(rows)));
});

export default router;
