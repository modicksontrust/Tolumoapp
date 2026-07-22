import { jsonify } from "../lib/serialize";
import { Router, type IRouter } from "express";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  db,
  enrollmentsTable,
  modulesTable,
  lessonsTable,
  lessonProgressTable,
  bookingsTable,
  usersTable,
} from "@workspace/db";
import {
  ListEnrollmentsResponse,
  CreateEnrollmentBody,
  CreateEnrollmentResponse,
  ListBookingsResponse,
  CreateBookingBody,
  CreateBookingResponse,
  UpdateBookingBody,
  UpdateBookingResponse,
} from "@workspace/api-zod";
import { requireUser } from "../middlewares/requireUser";

const router: IRouter = Router();

async function enrollmentRows(studentId: number, enrollmentId?: number) {
  return db
    .select({
      id: enrollmentsTable.id,
      moduleId: enrollmentsTable.moduleId,
      moduleTitle: modulesTable.title,
      moduleCode: modulesTable.code,
      year: modulesTable.year,
      enrolledAt: enrollmentsTable.enrolledAt,
      imageUrl: modulesTable.imageUrl,
      lessonCount: sql<number>`(select count(*)::int from ${lessonsTable} where ${lessonsTable.moduleId} = ${enrollmentsTable.moduleId})`,
      completedLessons: sql<number>`(select count(*)::int from ${lessonProgressTable} join ${lessonsTable} on ${lessonsTable.id} = ${lessonProgressTable.lessonId} where ${lessonsTable.moduleId} = ${enrollmentsTable.moduleId} and ${lessonProgressTable.studentId} = ${studentId} and ${lessonProgressTable.completed} = true)`,
    })
    .from(enrollmentsTable)
    .innerJoin(modulesTable, eq(enrollmentsTable.moduleId, modulesTable.id))
    .where(
      and(
        eq(enrollmentsTable.studentId, studentId),
        enrollmentId !== undefined
          ? eq(enrollmentsTable.id, enrollmentId)
          : undefined,
      ),
    )
    .orderBy(desc(enrollmentsTable.enrolledAt));
}

function requireStudent(req: { currentUser?: { role: string } }): boolean {
  return req.currentUser?.role === "student";
}

router.get("/enrollments", requireUser, async (req, res): Promise<void> => {
  if (!requireStudent(req)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const rows = await enrollmentRows(req.currentUser!.id);
  res.json(ListEnrollmentsResponse.parse(jsonify(rows)));
});

router.post("/enrollments", requireUser, async (req, res): Promise<void> => {
  if (!requireStudent(req)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const parsed = CreateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const studentId = req.currentUser!.id;
  const [existing] = await db
    .select()
    .from(enrollmentsTable)
    .where(
      and(
        eq(enrollmentsTable.studentId, studentId),
        eq(enrollmentsTable.moduleId, parsed.data.moduleId),
      ),
    );
  if (existing) {
    const [row] = await enrollmentRows(studentId, existing.id);
    res.status(201).json(CreateEnrollmentResponse.parse(jsonify(row)));
    return;
  }
  const [created] = await db
    .insert(enrollmentsTable)
    .values({ studentId, moduleId: parsed.data.moduleId })
    .returning();
  const [row] = await enrollmentRows(studentId, created.id);
  res.status(201).json(CreateEnrollmentResponse.parse(jsonify(row)));
});

const studentUser = alias(usersTable, "student_user");
const tutorUser = alias(usersTable, "tutor_user");

function bookingSelect() {
  return db
    .select({
      id: bookingsTable.id,
      studentId: bookingsTable.studentId,
      tutorId: bookingsTable.tutorId,
      studentName: studentUser.name,
      tutorName: tutorUser.name,
      moduleId: bookingsTable.moduleId,
      moduleTitle: modulesTable.title,
      scheduledAt: bookingsTable.scheduledAt,
      status: bookingsTable.status,
      notes: bookingsTable.notes,
    })
    .from(bookingsTable)
    .innerJoin(studentUser, eq(bookingsTable.studentId, studentUser.id))
    .innerJoin(tutorUser, eq(bookingsTable.tutorId, tutorUser.id))
    .leftJoin(modulesTable, eq(bookingsTable.moduleId, modulesTable.id));
}

router.get("/bookings", requireUser, async (req, res): Promise<void> => {
  const user = req.currentUser!;
  let where;
  if (user.role === "student") {
    where = eq(bookingsTable.studentId, user.id);
  } else if (user.role === "tutor") {
    where = eq(bookingsTable.tutorId, user.id);
  } else if (user.role === "admin" || user.role === "support") {
    where = undefined;
  } else {
    where = eq(bookingsTable.studentId, user.id);
  }
  const rows = await bookingSelect()
    .where(where)
    .orderBy(desc(bookingsTable.scheduledAt));
  res.json(ListBookingsResponse.parse(jsonify(rows)));
});

router.post("/bookings", requireUser, async (req, res): Promise<void> => {
  if (!requireStudent(req)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(bookingsTable)
    .values({
      studentId: req.currentUser!.id,
      tutorId: parsed.data.tutorId,
      moduleId: parsed.data.moduleId ?? null,
      scheduledAt: new Date(parsed.data.scheduledAt),
      notes: parsed.data.notes ?? null,
    })
    .returning();
  const [row] = await bookingSelect().where(eq(bookingsTable.id, created.id));
  res.status(201).json(CreateBookingResponse.parse(jsonify(row)));
});

router.patch("/bookings/:id", requireUser, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateBookingBody.safeParse(req.body);
  if (!parsed.success || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const user = req.currentUser!;
  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, id));
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const allowed =
    user.role === "admin" ||
    booking.studentId === user.id ||
    booking.tutorId === user.id;
  if (!allowed) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const { scheduledAt, ...rest } = parsed.data;
  await db
    .update(bookingsTable)
    .set({
      ...rest,
      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
    })
    .where(eq(bookingsTable.id, id));
  const [row] = await bookingSelect().where(eq(bookingsTable.id, id));
  res.json(UpdateBookingResponse.parse(jsonify(row)));
});

export default router;
