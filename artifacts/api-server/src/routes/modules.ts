import { jsonify } from "../lib/serialize";
import { Router, type IRouter } from "express";
import { eq, and, count, sql } from "drizzle-orm";
import {
  db,
  modulesTable,
  lessonsTable,
  enrollmentsTable,
  lessonProgressTable,
  usersTable,
} from "@workspace/db";
import {
  ListModulesResponse,
  CreateModuleBody,
  CreateModuleResponse,
  GetModuleResponse,
  UpdateModuleBody,
  UpdateModuleResponse,
  CreateLessonBody,
  CreateLessonResponse,
  UpdateLessonBody,
  UpdateLessonResponse,
  SetLessonProgressBody,
  SetLessonProgressResponse,
} from "@workspace/api-zod";
import { requireAuth, requireUser } from "../middlewares/requireUser";

const router: IRouter = Router();

function parseId(param: string | string[]): number {
  const raw = Array.isArray(param) ? param[0] : param;
  return parseInt(raw, 10);
}

async function moduleWithCounts(moduleId?: number, year?: number) {
  const rows = await db
    .select({
      id: modulesTable.id,
      code: modulesTable.code,
      title: modulesTable.title,
      year: modulesTable.year,
      description: modulesTable.description,
      nucApproved: modulesTable.nucApproved,
      tutorId: modulesTable.tutorId,
      imageUrl: modulesTable.imageUrl,
      tutorName: usersTable.name,
      lessonCount: sql<number>`(select count(*)::int from ${lessonsTable} where ${lessonsTable.moduleId} = ${modulesTable.id})`,
      enrolledCount: sql<number>`(select count(*)::int from ${enrollmentsTable} where ${enrollmentsTable.moduleId} = ${modulesTable.id})`,
    })
    .from(modulesTable)
    .leftJoin(usersTable, eq(modulesTable.tutorId, usersTable.id))
    .where(
      and(
        moduleId !== undefined ? eq(modulesTable.id, moduleId) : undefined,
        year !== undefined ? eq(modulesTable.year, year) : undefined,
      ),
    )
    .orderBy(modulesTable.year, modulesTable.code);
  return rows;
}

/** Returns true when the user may modify the module: admin always, tutor only if they own it. */
async function canManageModule(
  user: { id: number; role: string },
  moduleId: number,
): Promise<"ok" | "not_found" | "forbidden"> {
  if (user.role !== "tutor" && user.role !== "admin") return "forbidden";
  const [mod] = await db
    .select({ tutorId: modulesTable.tutorId })
    .from(modulesTable)
    .where(eq(modulesTable.id, moduleId));
  if (!mod) return "not_found";
  if (user.role === "tutor" && mod.tutorId !== user.id) return "forbidden";
  return "ok";
}

async function moduleIdForLesson(lessonId: number): Promise<number | undefined> {
  const [lesson] = await db
    .select({ moduleId: lessonsTable.moduleId })
    .from(lessonsTable)
    .where(eq(lessonsTable.id, lessonId));
  return lesson?.moduleId;
}

router.get("/modules", async (req, res): Promise<void> => {
  const yearRaw = req.query.year;
  const year =
    typeof yearRaw === "string" && yearRaw !== ""
      ? parseInt(yearRaw, 10)
      : undefined;
  const rows = await moduleWithCounts(undefined, year);
  res.json(ListModulesResponse.parse(jsonify(rows)));
});

router.post("/modules", requireUser, async (req, res): Promise<void> => {
  const role = req.currentUser!.role;
  if (role !== "tutor" && role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const parsed = CreateModuleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const tutorId =
    role === "tutor" ? req.currentUser!.id : parsed.data.tutorId ?? null;
  const [created] = await db
    .insert(modulesTable)
    .values({ ...parsed.data, tutorId })
    .returning();
  const [row] = await moduleWithCounts(created.id);
  res.status(201).json(CreateModuleResponse.parse(jsonify(row)));
});

router.get("/modules/:id", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await moduleWithCounts(id);
  if (!row) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  // Determine the current student (if authed with a profile) for progress/enrolled flags
  const { getAuth } = await import("@clerk/express");
  const auth = getAuth(req);
  let studentId: number | undefined;
  if (auth.userId) {
    const [u] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, auth.userId));
    studentId = u?.id;
  }

  const lessons = await db
    .select({
      id: lessonsTable.id,
      moduleId: lessonsTable.moduleId,
      title: lessonsTable.title,
      position: lessonsTable.position,
      durationMinutes: lessonsTable.durationMinutes,
      description: lessonsTable.description,
      videoUrl: lessonsTable.videoUrl,
      completed:
        studentId !== undefined
          ? sql<boolean>`coalesce((select ${lessonProgressTable.completed} from ${lessonProgressTable} where ${lessonProgressTable.lessonId} = ${lessonsTable.id} and ${lessonProgressTable.studentId} = ${studentId}), false)`
          : sql<boolean>`false`,
    })
    .from(lessonsTable)
    .where(eq(lessonsTable.moduleId, id))
    .orderBy(lessonsTable.position);

  let enrolled = false;
  if (studentId !== undefined) {
    const [e] = await db
      .select({ c: count() })
      .from(enrollmentsTable)
      .where(
        and(
          eq(enrollmentsTable.moduleId, id),
          eq(enrollmentsTable.studentId, studentId),
        ),
      );
    enrolled = (e?.c ?? 0) > 0;
  }

  res.json(GetModuleResponse.parse(jsonify({ ...row, lessons, enrolled })));
});

router.patch("/modules/:id", requireUser, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateModuleBody.safeParse(req.body);
  if (!parsed.success || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const access = await canManageModule(req.currentUser!, id);
  if (access === "not_found") {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  if (access === "forbidden") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [updated] = await db
    .update(modulesTable)
    .set(parsed.data)
    .where(eq(modulesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  const [row] = await moduleWithCounts(id);
  res.json(UpdateModuleResponse.parse(jsonify(row)));
});

router.delete("/modules/:id", requireUser, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const access = await canManageModule(req.currentUser!, id);
  if (access === "not_found") {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  if (access === "forbidden") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [deleted] = await db
    .delete(modulesTable)
    .where(eq(modulesTable.id, id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.sendStatus(204);
});

router.post(
  "/modules/:id/lessons",
  requireUser,
  async (req, res): Promise<void> => {
    const moduleId = parseId(req.params.id);
    const parsed = CreateLessonBody.safeParse(req.body);
    if (!parsed.success || Number.isNaN(moduleId)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const access = await canManageModule(req.currentUser!, moduleId);
    if (access === "not_found") {
      res.status(404).json({ error: "Module not found" });
      return;
    }
    if (access === "forbidden") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const [created] = await db
      .insert(lessonsTable)
      .values({ ...parsed.data, moduleId })
      .returning();
    res.status(201).json(CreateLessonResponse.parse(jsonify(created)));
  },
);

router.patch("/lessons/:id", requireUser, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateLessonBody.safeParse(req.body);
  if (!parsed.success || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const moduleId = await moduleIdForLesson(id);
  if (moduleId === undefined) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  if ((await canManageModule(req.currentUser!, moduleId)) !== "ok") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [updated] = await db
    .update(lessonsTable)
    .set(parsed.data)
    .where(eq(lessonsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  res.json(UpdateLessonResponse.parse(jsonify(updated)));
});

router.delete("/lessons/:id", requireUser, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const moduleId = await moduleIdForLesson(id);
  if (moduleId === undefined) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  if ((await canManageModule(req.currentUser!, moduleId)) !== "ok") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [deleted] = await db
    .delete(lessonsTable)
    .where(eq(lessonsTable.id, id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  res.sendStatus(204);
});

router.post(
  "/lessons/:id/progress",
  requireUser,
  async (req, res): Promise<void> => {
    if (req.currentUser!.role !== "student") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const lessonId = parseId(req.params.id);
    const parsed = SetLessonProgressBody.safeParse(req.body);
    if (!parsed.success || Number.isNaN(lessonId)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const studentId = req.currentUser!.id;
    const completedAt = parsed.data.completed ? new Date() : null;
    const [row] = await db
      .insert(lessonProgressTable)
      .values({ studentId, lessonId, completed: parsed.data.completed, completedAt })
      .onConflictDoUpdate({
        target: [lessonProgressTable.studentId, lessonProgressTable.lessonId],
        set: { completed: parsed.data.completed, completedAt },
      })
      .returning();
    res.json(
      SetLessonProgressResponse.parse({
        lessonId: row.lessonId,
        completed: row.completed,
        completedAt: row.completedAt?.toISOString() ?? null,
      }),
    );
  },
);

export default router;
