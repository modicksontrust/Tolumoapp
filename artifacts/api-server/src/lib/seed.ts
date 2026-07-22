/**
 * Seed script: populates Tolumo with demo data.
 * Run: pnpm --filter @workspace/api-server exec tsx src/lib/seed.ts
 */
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
import { logger } from "./logger";

async function seed(): Promise<void> {
  const existing = await db.select().from(modulesTable);
  if (existing.length > 0) {
    logger.info("Seed data already present, skipping");
    return;
  }

  // Tutors
  const tutors = await db
    .insert(usersTable)
    .values([
      { clerkId: "seed_tutor_1", name: "Prof. Adaeze Okonkwo", email: "a.okonkwo@tolumo.ng", role: "tutor", title: "Professor of Constitutional Law", bio: "Former dean, Faculty of Law, University of Lagos. 22 years teaching constitutional and administrative law." },
      { clerkId: "seed_tutor_2", name: "Dr. Babatunde Fashola", email: "b.fashola@tolumo.ng", role: "tutor", title: "Senior Lecturer, Criminal Law", bio: "Barrister and Solicitor of the Supreme Court of Nigeria. Specialist in criminal jurisprudence." },
      { clerkId: "seed_tutor_3", name: "Dr. Ngozi Eze", email: "n.eze@tolumo.ng", role: "tutor", title: "Senior Lecturer, Commercial Law", bio: "Corporate law practitioner and lecturer with a focus on company law and secured transactions." },
      { clerkId: "seed_tutor_4", name: "Prof. Ibrahim Danjuma", email: "i.danjuma@tolumo.ng", role: "tutor", title: "Professor of Jurisprudence", bio: "Author of three leading texts on Nigerian legal theory and Islamic law." },
    ])
    .returning();

  // Students
  const students = await db
    .insert(usersTable)
    .values([
      { clerkId: "seed_student_1", name: "Chidinma Nwosu", email: "chidinma@student.ng", role: "student" },
      { clerkId: "seed_student_2", name: "Emeka Obi", email: "emeka@student.ng", role: "student" },
      { clerkId: "seed_student_3", name: "Fatima Bello", email: "fatima@student.ng", role: "student" },
      { clerkId: "seed_student_4", name: "Tunde Adewale", email: "tunde@student.ng", role: "student" },
      { clerkId: "seed_student_5", name: "Amina Yusuf", email: "amina@student.ng", role: "student" },
    ])
    .returning();

  // Agents & support
  const agents = await db
    .insert(usersTable)
    .values([
      { clerkId: "seed_subagent_1", name: "Kunle Ajayi", email: "kunle@agents.tolumo.ng", role: "sub_agent" },
      { clerkId: "seed_subagent_2", name: "Blessing Okafor", email: "blessing@agents.tolumo.ng", role: "sub_agent" },
      { clerkId: "seed_subagent_3", name: "Musa Garba", email: "musa@agents.tolumo.ng", role: "sub_agent" },
      { clerkId: "seed_superagent_1", name: "Chief Olumide Bankole", email: "olumide@agents.tolumo.ng", role: "super_agent" },
      { clerkId: "seed_support_1", name: "Grace Adebayo", email: "grace@support.tolumo.ng", role: "support" },
    ])
    .returning();
  const subAgents = agents.filter((a) => a.role === "sub_agent");
  const support = agents.find((a) => a.role === "support")!;

  // Modules — LL.B years 1-5
  const moduleData: Array<{ code: string; title: string; year: number; description: string; tutorIdx: number }> = [
    { code: "LAW101", title: "Legal Methods I", year: 1, description: "Introduction to legal reasoning, sources of Nigerian law, case analysis, and the structure of the Nigerian legal system.", tutorIdx: 3 },
    { code: "LAW102", title: "Nigerian Legal System", year: 1, description: "Courts hierarchy, legal profession, customary and Islamic law systems, and the administration of justice in Nigeria.", tutorIdx: 3 },
    { code: "LAW201", title: "Constitutional Law I", year: 2, description: "The 1999 Constitution, federalism, separation of powers, fundamental rights, and judicial review.", tutorIdx: 0 },
    { code: "LAW202", title: "Law of Contract", year: 2, description: "Offer, acceptance, consideration, terms, vitiating elements, discharge, and remedies under Nigerian contract law.", tutorIdx: 2 },
    { code: "LAW301", title: "Criminal Law", year: 3, description: "The Criminal and Penal Codes, elements of offences, parties to crime, defences, and specific offences.", tutorIdx: 1 },
    { code: "LAW302", title: "Law of Torts", year: 3, description: "Negligence, nuisance, defamation, trespass, strict liability, and vicarious liability in Nigerian case law.", tutorIdx: 1 },
    { code: "LAW401", title: "Land Law", year: 4, description: "The Land Use Act, customary land tenure, certificates of occupancy, mortgages, and leases.", tutorIdx: 0 },
    { code: "LAW402", title: "Company Law", year: 4, description: "CAMA 2020, incorporation, corporate personality, directors' duties, shares, and winding up.", tutorIdx: 2 },
    { code: "LAW501", title: "Jurisprudence & Legal Theory", year: 5, description: "Schools of legal thought, African jurisprudence, law and morality, and contemporary legal theory.", tutorIdx: 3 },
    { code: "LAW502", title: "Evidence", year: 5, description: "The Evidence Act 2011, relevance, admissibility, burden of proof, witnesses, and documentary evidence.", tutorIdx: 1 },
  ];
  const modules = await db
    .insert(modulesTable)
    .values(
      moduleData.map((m) => ({
        code: m.code,
        title: m.title,
        year: m.year,
        description: m.description,
        nucApproved: true,
        tutorId: tutors[m.tutorIdx].id,
      })),
    )
    .returning();

  // Lessons — 5-6 per module
  const lessonTitles = [
    "Introduction and Course Overview",
    "Core Principles and Key Authorities",
    "Leading Nigerian Cases",
    "Statutory Framework in Depth",
    "Problem Questions and Exam Technique",
    "Revision and Past Questions Workshop",
  ];
  const allLessons = [] as { id: number; moduleId: number }[];
  for (const mod of modules) {
    const rows = await db
      .insert(lessonsTable)
      .values(
        lessonTitles.map((t, i) => ({
          moduleId: mod.id,
          title: `${t}`,
          position: i + 1,
          durationMinutes: 25 + ((i * 7) % 30),
          description: `${mod.code}: ${t}.`,
        })),
      )
      .returning({ id: lessonsTable.id, moduleId: lessonsTable.moduleId });
    allLessons.push(...rows);
  }

  // Enrollments + progress
  const enrollPlan: Array<[number, number[]]> = [
    [0, [0, 1]],
    [1, [2, 3]],
    [2, [4, 5]],
    [3, [6, 7]],
    [4, [8, 9]],
  ];
  for (const [sIdx, mIdxs] of enrollPlan) {
    for (const mIdx of mIdxs) {
      await db.insert(enrollmentsTable).values({
        studentId: students[sIdx].id,
        moduleId: modules[mIdx].id,
      });
      const lessons = allLessons.filter((l) => l.moduleId === modules[mIdx].id);
      const completeCount = (sIdx + mIdx) % 5;
      for (let i = 0; i < completeCount; i++) {
        await db.insert(lessonProgressTable).values({
          studentId: students[sIdx].id,
          lessonId: lessons[i].id,
          completed: true,
          completedAt: new Date(Date.now() - (i + 1) * 86400000),
        });
      }
    }
  }

  // Bookings
  const day = 86400000;
  await db.insert(bookingsTable).values([
    { studentId: students[0].id, tutorId: tutors[3].id, moduleId: modules[0].id, scheduledAt: new Date(Date.now() + 2 * day), status: "confirmed", notes: "Struggling with case analysis format." },
    { studentId: students[1].id, tutorId: tutors[0].id, moduleId: modules[2].id, scheduledAt: new Date(Date.now() + 3 * day), status: "pending", notes: "Want to review fundamental rights chapter." },
    { studentId: students[2].id, tutorId: tutors[1].id, moduleId: modules[4].id, scheduledAt: new Date(Date.now() + 5 * day), status: "pending" },
    { studentId: students[3].id, tutorId: tutors[2].id, moduleId: modules[7].id, scheduledAt: new Date(Date.now() - 4 * day), status: "completed", notes: "Directors' duties under CAMA 2020." },
    { studentId: students[4].id, tutorId: tutors[1].id, moduleId: modules[9].id, scheduledAt: new Date(Date.now() - 2 * day), status: "cancelled" },
  ]);

  // Acquisitions
  await db.insert(acquisitionsTable).values([
    { subAgentId: subAgents[0].id, studentName: "Yemi Alade", studentEmail: "yemi@example.ng", status: "paid", commissionAmount: "15000" },
    { subAgentId: subAgents[0].id, studentName: "Sola Adeyemi", studentEmail: "sola@example.ng", status: "enrolled", commissionAmount: "15000" },
    { subAgentId: subAgents[0].id, studentName: "Nkechi Umeh", status: "contacted", commissionAmount: "0" },
    { subAgentId: subAgents[1].id, studentName: "Ahmed Sani", studentEmail: "ahmed@example.ng", status: "paid", commissionAmount: "15000" },
    { subAgentId: subAgents[1].id, studentName: "Bola Ige", status: "lead", commissionAmount: "0" },
    { subAgentId: subAgents[2].id, studentName: "Chiamaka Ude", studentEmail: "chiamaka@example.ng", status: "enrolled", commissionAmount: "15000" },
    { subAgentId: subAgents[2].id, studentName: "David Essien", status: "lead", commissionAmount: "0" },
  ]);

  // Tickets
  const now = Date.now();
  await db.insert(ticketsTable).values([
    { subject: "Cannot access LAW202 video lessons", description: "The lesson player shows a blank screen on module LAW202.", requesterName: "Emeka Obi", priority: "high", status: "open", slaDueAt: new Date(now + 12 * 3600000) },
    { subject: "Payment receipt not received", description: "Paid for Year 3 bundle but no receipt email arrived.", requesterName: "Fatima Bello", priority: "medium", status: "in_progress", assigneeId: support.id, slaDueAt: new Date(now + 24 * 3600000) },
    { subject: "Request to change tutorial time", description: "Need to move my Thursday session with Dr. Fashola.", requesterName: "Chidinma Nwosu", priority: "low", status: "open", slaDueAt: new Date(now + 72 * 3600000) },
    { subject: "Account locked after password reset", description: "Cannot sign in after resetting password this morning.", requesterName: "Tunde Adewale", priority: "urgent", status: "resolved", assigneeId: support.id, slaDueAt: new Date(now - 20 * 3600000), resolvedAt: new Date(now - 22 * 3600000) },
    { subject: "Certificate not generated after completion", description: "Completed LAW101 but certificate section shows nothing.", requesterName: "Amina Yusuf", priority: "medium", status: "open", slaDueAt: new Date(now - 2 * 3600000) },
  ]);

  logger.info("Seed complete");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error({ err }, "Seed failed");
    process.exit(1);
  });
