import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { PortalLayout } from '@/components/portal-layout';
import { LayoutDashboard, BookOpen, Calendar, Clock, CheckCircle2, PlayCircle, Star, GraduationCap } from 'lucide-react';
import { 
  useGetStudentSummary, 
  useListModules, 
  useGetModule,
  useCreateEnrollment,
  useListEnrollments,
  useListBookings,
  useListTutors,
  useCreateBooking,
  useSetLessonProgress,
  ListModulesParams,
  getGetModuleQueryKey,
  getListModulesQueryKey,
  getListEnrollmentsQueryKey,
  getListBookingsQueryKey,
  getGetStudentSummaryQueryKey
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Sub-pages
function StudentDashboard() {
  const { data: summary, isLoading } = useGetStudentSummary();
  const { data: enrollments } = useListEnrollments();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground font-serif">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Welcome back.</h1>
        <p className="text-muted-foreground">Here's your LL.B progress at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Enrolled Modules", value: summary?.enrolledModules || 0, icon: BookOpen },
          { label: "Completed Lessons", value: summary?.completedLessons || 0, icon: CheckCircle2 },
          { label: "Overall Progress", value: `${summary?.overallProgress || 0}%`, icon: Star },
          { label: "Upcoming Sessions", value: summary?.upcomingBookings || 0, icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-primary mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
          <h2 className="text-xl font-serif font-bold text-primary">Your Modules</h2>
          <Button variant="outline" onClick={() => setLocation('/student/modules')}>Browse All</Button>
        </div>
        <div className="divide-y divide-border">
          {!enrollments?.length ? (
            <div className="p-8 text-center text-muted-foreground">
              You haven't enrolled in any modules yet.
              <div className="mt-4">
                <Button onClick={() => setLocation('/student/modules')}>Browse Curriculum</Button>
              </div>
            </div>
          ) : (
            enrollments.slice(0, 5).map(enr => (
              <div key={enr.id} className="p-6 hover:bg-secondary/10 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/5 rounded-lg flex items-center justify-center text-primary font-bold">
                    {enr.moduleCode}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{enr.moduleTitle}</h3>
                    <p className="text-sm text-muted-foreground">Year {enr.year} • {enr.completedLessons}/{enr.lessonCount} Lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent" 
                      style={{ width: `${enr.lessonCount ? (enr.completedLessons/enr.lessonCount)*100 : 0}%` }}
                    />
                  </div>
                  <Button size="sm" onClick={() => setLocation(`/student/modules/${enr.moduleId}`)}>Continue</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ModulesList() {
  const [yearFilter, setYearFilter] = useState<number | undefined>();
  const { data: modules, isLoading } = useListModules(yearFilter ? { year: yearFilter } : undefined);
  const { data: enrollments } = useListEnrollments();
  const createEnrollment = useCreateEnrollment();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleEnroll = (moduleId: number) => {
    createEnrollment.mutate({ data: { moduleId } }, {
      onSuccess: () => {
        toast({ title: "Enrolled successfully", description: "You can now access the lessons." });
        queryClient.invalidateQueries({ queryKey: getListModulesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
        setLocation(`/student/modules/${moduleId}`);
      }
    });
  };

  const isEnrolled = (moduleId: number) => enrollments?.some(e => e.moduleId === moduleId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Curriculum</h1>
          <p className="text-muted-foreground">Browse NUC-approved LL.B modules.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-border shadow-sm">
          {[undefined, 1, 2, 3, 4, 5].map(y => (
            <button
              key={y || 'all'}
              onClick={() => setYearFilter(y)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                yearFilter === y ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {y ? `Year ${y}` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading modules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules?.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md hover:border-accent/40">
              <div className="h-32 bg-primary/5 flex items-center justify-center border-b border-border/50 relative">
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="h-12 w-12 text-primary/20" />
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-primary">
                  {m.code}
                </div>
                {m.nucApproved && (
                  <div className="absolute top-3 right-3 bg-accent/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> NUC
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-muted-foreground mb-2">Year {m.year} • {m.lessonCount} Lessons</div>
                <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">{m.description}</p>
                
                {isEnrolled(m.id) ? (
                  <Button variant="outline" className="w-full" onClick={() => setLocation(`/student/modules/${m.id}`)}>
                    Continue Learning
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-white" 
                    onClick={() => handleEnroll(m.id)}
                    disabled={createEnrollment.isPending}
                  >
                    Enroll Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: module, isLoading } = useGetModule(id, { query: { enabled: !!id, queryKey: getGetModuleQueryKey(id) } });
  const setProgress = useSetLessonProgress();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading || !module) return <div className="p-8 text-muted-foreground">Loading module...</div>;

  const handleToggleProgress = (lessonId: number, currentStatus: boolean) => {
    setProgress.mutate({ 
      id: lessonId, 
      data: { completed: !currentStatus } 
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetModuleQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getGetStudentSummaryQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-primary text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold tracking-wider">{module.code}</span>
            <span className="bg-accent/20 px-3 py-1 rounded-full text-sm font-semibold text-accent-foreground">Year {module.year}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{module.title}</h1>
          <p className="text-white/80 max-w-2xl text-lg">{module.description}</p>
          <div className="mt-8 flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-accent" />
              {module.lessonCount} Video Lessons
            </div>
            {module.tutorName && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Dr. {module.tutorName}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">Course Content</h2>
        {!module.lessons?.length ? (
          <div className="bg-white p-8 rounded-xl border border-border text-center text-muted-foreground">
            Lessons are being uploaded for this module. Check back soon.
          </div>
        ) : (
          <div className="bg-white border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {module.lessons.sort((a,b)=>a.position - b.position).map((lesson, i) => (
              <div key={lesson.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-secondary/10 transition-colors">
                <div className="flex-1 flex items-start gap-4">
                  <button 
                    onClick={() => handleToggleProgress(lesson.id, !!lesson.completed)}
                    className={`mt-1 shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      lesson.completed ? 'bg-accent border-accent text-white' : 'border-muted-foreground/30 text-transparent hover:border-accent'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <div>
                    <div className="text-sm font-medium text-accent mb-1 uppercase tracking-wider">Lesson {i + 1}</div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">{lesson.title}</h3>
                    {lesson.description && <p className="text-sm text-muted-foreground">{lesson.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:pl-10">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                    <Clock className="h-4 w-4" /> {lesson.durationMinutes} min
                  </div>
                  {lesson.videoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Watch</a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Bookings() {
  const { data: tutors } = useListTutors();
  const { data: bookings } = useListBookings();
  const createBooking = useCreateBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const tutorId = parseInt(fd.get('tutorId') as string);
    const scheduledAt = fd.get('scheduledAt') as string;
    const notes = fd.get('notes') as string;

    if (!tutorId || !scheduledAt) return;

    createBooking.mutate({
      data: {
        tutorId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes
      }
    }, {
      onSuccess: () => {
        toast({ title: "Session requested", description: "The tutor will confirm your booking shortly." });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">1-on-1 Sessions</h1>
        <p className="text-muted-foreground">Book private tutorials with our faculty experts.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-serif font-bold text-primary mb-6">Request a Session</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Tutor</label>
              <select name="tutorId" required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-accent outline-none">
                <option value="">Choose a tutor...</option>
                {tutors?.map(t => (
                  <option key={t.id} value={t.id}>{t.title ? `${t.title} ` : ''}{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input type="datetime-local" name="scheduledAt" required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Topic / Notes (Optional)</label>
              <textarea name="notes" rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-accent outline-none" placeholder="What do you want to cover?"></textarea>
            </div>
            <Button type="submit" className="w-full" disabled={createBooking.isPending}>
              {createBooking.isPending ? 'Requesting...' : 'Request Session'}
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-primary">Your Sessions</h2>
          {!bookings?.length ? (
            <div className="bg-white p-8 rounded-xl border border-border text-center text-muted-foreground shadow-sm">
              No sessions booked yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-white p-5 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">With {b.tutorName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" /> 
                      {new Date(b.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  {b.notes && <div className="text-sm bg-secondary/50 p-2 rounded max-w-xs truncate">{b.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentPortal() {
  const links = [
    { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/modules', label: 'Curriculum', icon: BookOpen },
    { href: '/student/bookings', label: '1-on-1 Sessions', icon: Calendar },
  ];

  return (
    <PortalLayout role="Student" links={links}>
      <Switch>
        <Route path="/student" component={StudentDashboard} />
        <Route path="/student/modules" component={ModulesList} />
        <Route path="/student/modules/:id" component={ModuleDetail} />
        <Route path="/student/bookings" component={Bookings} />
      </Switch>
    </PortalLayout>
  );
}
