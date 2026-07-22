import { jsonify } from "../lib/serialize";
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { getAuth, clerkClient } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import {
  GetMeResponse,
  UpsertMeBody,
  UpsertMeResponse,
  ListTutorsResponse,
  ListUsersResponse,
  UpdateUserBody,
  UpdateUserResponse,
} from "@workspace/api-zod";
import { requireAuth, requireUser } from "../middlewares/requireUser";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, auth.userId!));
  if (!user) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(GetMeResponse.parse(jsonify(user)));
});

const SELF_SERVICE_ROLES = ["student", "tutor"];

router.post("/me", requireAuth, async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const parsed = UpsertMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Privileged roles (admin, support, agents) cannot be self-assigned.
  // Bootstrap exception: while no admin exists, a user may claim the admin
  // role (first-admin bootstrap). All other privileged roles are always
  // granted only by an admin via PATCH /users/:id.
  if (!SELF_SERVICE_ROLES.includes(parsed.data.role)) {
    let allowed = false;
    if (parsed.data.role === "admin") {
      const [existingAdmin] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.role, "admin"))
        .limit(1);
      allowed = !existingAdmin;
    }
    if (!allowed) {
      res.status(403).json({
        error:
          "This role is assigned by an administrator. Choose Student or Tutor, or contact your admin.",
      });
      return;
    }
  }

  let email = "";
  try {
    const clerkUser = await clerkClient.users.getUser(auth.userId!);
    email = clerkUser.primaryEmailAddress?.emailAddress ?? "";
  } catch (err) {
    req.log.warn({ err }, "Could not fetch Clerk user email");
  }

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, auth.userId!));

  if (existing) {
    const [updated] = await db
      .update(usersTable)
      .set({ ...parsed.data, ...(email ? { email } : {}) })
      .where(eq(usersTable.id, existing.id))
      .returning();
    res.json(UpsertMeResponse.parse(jsonify(updated)));
    return;
  }

  const [created] = await db
    .insert(usersTable)
    .values({ ...parsed.data, clerkId: auth.userId!, email })
    .returning();
  res.json(UpsertMeResponse.parse(jsonify(created)));
});

router.get("/tutors", requireAuth, async (_req, res): Promise<void> => {
  const tutors = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.role, "tutor"))
    .orderBy(usersTable.name);
  res.json(ListTutorsResponse.parse(jsonify(tutors)));
});

router.get("/users", requireUser, async (req, res): Promise<void> => {
  if (req.currentUser!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(ListUsersResponse.parse(jsonify(users)));
});

router.patch("/users/:id", requireUser, async (req, res): Promise<void> => {
  if (req.currentUser!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [updated] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(UpdateUserResponse.parse(jsonify(updated)));
});

export default router;
