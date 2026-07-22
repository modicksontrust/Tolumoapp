import { Router, type IRouter } from "express";
import { eq, and, gt, count, sql, inArray } from "drizzle-orm";
import {
  db,
  usersTable,
  modulesTable,
  lessonsTable,
  enrollmentsTable,
  lessonProgressTable,
  bookingsTable,
  acquisitionsTable,
  ticketsTable,
} from "@workspace/db";
import {
  GetStudentSummaryResponse,
  GetTutorSummaryResponse,
  GetAdminSummaryResponse,
  GetAgentSummaryResponse,
  GetSuperAgentSummaryResponse,
  GetCrmSummaryResponse,
} from "@workspace/api-zod";
import { requireUser } from "../middlewares/requireUser";

const router: IRouter = Router();

router.get(
  "/summaries/student",
  requireUser,
  async (req, res): Promise<void> => {
    if (req.currentUser!.role !== "student") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const studentId = req.currentUser!.id;
    const [enr] = await db
      .select({ c: count() })
      .from(enrollmentsTable)
      .where(eq(enrollmentsTable.studentId, studentId));
    const [totals] = await db
      .select({
        total: sql<number>`count(*)::int`,
      })
      .from(lessonsTable)
      .innerJoin(
        enrollmentsTable,
        eq(lessonsTable.moduleId, enrollmentsTable.moduleId),
      )
      .where(eq(enrollmentsTable.studentId, studentId));
    const [done] = await db
      .select({ c: count() })
      .from(lessonProgressTable)
      .where(
        and(
          eq(lessonProgressTable.studentId, studentId),
          eq(lessonProgressTable.completed, true),
        ),
      );
    const [upcoming] = await db
      .select({ c: count() })
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.studentId, studentId),
          gt(bookingsTable.scheduledAt, new Date()),
          inArray(bookingsTable.status, ["pending", "confirmed"]),
        ),
      );
    const totalLessons = totals?.total ?? 0;
    const completedLessons = done?.c ?? 0;
    res.json(
      GetStudentSummaryResponse.parse({
        enrolledModules: enr?.c ?? 0,
        completedLessons,
        totalLessons,
        upcomingBookings: upcoming?.c ?? 0,
        overallProgress:
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      }),
    );
  },
);

router.get("/summaries/tutor", requireUser, async (req, res): Promise<void> => {
  if (req.currentUser!.role !== "tutor") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const tutorId = req.currentUser!.id;
  const [mods] = await db
    .select({ c: count() })
    .from(modulesTable)
    .where(eq(modulesTable.tutorId, tutorId));
  const [less] = await db
    .select({ c: count() })
    .from(lessonsTable)
    .innerJoin(modulesTable, eq(lessonsTable.moduleId, modulesTable.id))
    .where(eq(modulesTable.tutorId, tutorId));
  const [pending] = await db
    .select({ c: count() })
    .from(bookingsTable)
    .where(
      and(eq(bookingsTable.tutorId, tutorId), eq(bookingsTable.status, "pending")),
    );
  const [upcoming] = await db
    .select({ c: count() })
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.tutorId, tutorId),
        eq(bookingsTable.status, "confirmed"),
        gt(bookingsTable.scheduledAt, new Date()),
      ),
    );
  const [students] = await db
    .select({
      c: sql<number>`count(distinct ${enrollmentsTable.studentId})::int`,
    })
    .from(enrollmentsTable)
    .innerJoin(modulesTable, eq(enrollmentsTable.moduleId, modulesTable.id))
    .where(eq(modulesTable.tutorId, tutorId));
  res.json(
    GetTutorSummaryResponse.parse({
      moduleCount: mods?.c ?? 0,
      lessonCount: less?.c ?? 0,
      pendingBookings: pending?.c ?? 0,
      upcomingBookings: upcoming?.c ?? 0,
      totalStudents: students?.c ?? 0,
    }),
  );
});

router.get("/summaries/admin", requireUser, async (req, res): Promise<void> => {
  if (req.currentUser!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [students] = await db
    .select({ c: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "student"));
  const [tutors] = await db
    .select({ c: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "tutor"));
  const [mods] = await db.select({ c: count() }).from(modulesTable);
  const [books] = await db.select({ c: count() }).from(bookingsTable);
  const [enrs] = await db.select({ c: count() }).from(enrollmentsTable);
  const [open] = await db
    .select({ c: count() })
    .from(ticketsTable)
    .where(inArray(ticketsTable.status, ["open", "in_progress"]));
  const byYear = await db
    .select({
      year: modulesTable.year,
      moduleCount: sql<number>`count(distinct ${modulesTable.id})::int`,
      enrollmentCount: sql<number>`count(${enrollmentsTable.id})::int`,
    })
    .from(modulesTable)
    .leftJoin(enrollmentsTable, eq(enrollmentsTable.moduleId, modulesTable.id))
    .groupBy(modulesTable.year)
    .orderBy(modulesTable.year);
  res.json(
    GetAdminSummaryResponse.parse({
      totalStudents: students?.c ?? 0,
      totalTutors: tutors?.c ?? 0,
      totalModules: mods?.c ?? 0,
      totalBookings: books?.c ?? 0,
      totalEnrollments: enrs?.c ?? 0,
      openTickets: open?.c ?? 0,
      byYear,
    }),
  );
});

router.get("/summaries/agent", requireUser, async (req, res): Promise<void> => {
  if (!["sub_agent", "admin"].includes(req.currentUser!.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const agentId = req.currentUser!.id;
  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      enrolled: sql<number>`count(*) filter (where ${acquisitionsTable.status} in ('enrolled', 'paid'))::int`,
      pipeline: sql<number>`count(*) filter (where ${acquisitionsTable.status} in ('lead', 'contacted'))::int`,
      paidCommission: sql<number>`coalesce(sum(${acquisitionsTable.commissionAmount}) filter (where ${acquisitionsTable.status} = 'paid'), 0)::float8`,
      pendingCommission: sql<number>`coalesce(sum(${acquisitionsTable.commissionAmount}) filter (where ${acquisitionsTable.status} = 'enrolled'), 0)::float8`,
    })
    .from(acquisitionsTable)
    .where(eq(acquisitionsTable.subAgentId, agentId));
  res.json(
    GetAgentSummaryResponse.parse({
      totalAcquisitions: stats?.total ?? 0,
      enrolledCount: stats?.enrolled ?? 0,
      pipelineCount: stats?.pipeline ?? 0,
      totalCommission: stats?.paidCommission ?? 0,
      pendingCommission: stats?.pendingCommission ?? 0,
    }),
  );
});

router.get(
  "/summaries/super-agent",
  requireUser,
  async (req, res): Promise<void> => {
    if (!["super_agent", "admin"].includes(req.currentUser!.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const [agents] = await db
      .select({ c: count() })
      .from(usersTable)
      .where(eq(usersTable.role, "sub_agent"));
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        enrolled: sql<number>`count(*) filter (where ${acquisitionsTable.status} in ('enrolled', 'paid'))::int`,
        commission: sql<number>`coalesce(sum(${acquisitionsTable.commissionAmount}) filter (where ${acquisitionsTable.status} = 'paid'), 0)::float8`,
      })
      .from(acquisitionsTable);
    res.json(
      GetSuperAgentSummaryResponse.parse({
        subAgentCount: agents?.c ?? 0,
        totalAcquisitions: stats?.total ?? 0,
        totalEnrolled: stats?.enrolled ?? 0,
        networkCommission: stats?.commission ?? 0,
      }),
    );
  },
);

router.get("/summaries/crm", requireUser, async (req, res): Promise<void> => {
  if (!["support", "admin"].includes(req.currentUser!.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [stats] = await db
    .select({
      open: sql<number>`count(*) filter (where ${ticketsTable.status} = 'open')::int`,
      inProgress: sql<number>`count(*) filter (where ${ticketsTable.status} = 'in_progress')::int`,
      resolved: sql<number>`count(*) filter (where ${ticketsTable.status} in ('resolved', 'closed'))::int`,
      breached: sql<number>`count(*) filter (where (${ticketsTable.status} in ('open', 'in_progress') and ${ticketsTable.slaDueAt} < now()) or (${ticketsTable.resolvedAt} is not null and ${ticketsTable.resolvedAt} > ${ticketsTable.slaDueAt}))::int`,
      avgHours: sql<number>`coalesce(avg(extract(epoch from (${ticketsTable.resolvedAt} - ${ticketsTable.createdAt})) / 3600) filter (where ${ticketsTable.resolvedAt} is not null), 0)::float8`,
    })
    .from(ticketsTable);
  const byPriority = await db
    .select({
      priority: ticketsTable.priority,
      count: sql<number>`count(*)::int`,
    })
    .from(ticketsTable)
    .groupBy(ticketsTable.priority);
  res.json(
    GetCrmSummaryResponse.parse({
      openTickets: stats?.open ?? 0,
      inProgressTickets: stats?.inProgress ?? 0,
      resolvedTickets: stats?.resolved ?? 0,
      breachedSla: stats?.breached ?? 0,
      avgResolutionHours: stats?.avgHours ?? 0,
      byPriority,
    }),
  );
});

export default router;
