import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { PortalLayout } from '@/components/portal-layout';
import { LayoutDashboard, BookOpen, Calendar, Users, Edit, Trash2, Plus, Clock } from 'lucide-react';
import { 
  useGetTutorSummary, 
  useListModules, 
  useListBookings,
  useUpdateBooking,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useGetModule,
  useGetMe,
  getListBookingsQueryKey,
  getGetTutorSummaryQueryKey,
  getListModulesQueryKey,
  getGetModuleQueryKey
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Dashboard
function TutorDashboard() {
  const { data: summary, isLoading } = useGetTutorSummary();
  const { data: bookings } = useListBookings();
  const updateBooking = useUpdateBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleBookingAction = (id: number, status: 'confirmed' | 'cancelled' | 'completed') => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: `Session ${status}` });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTutorSummaryQueryKey() });
      }
    });
  };

  if (isLoading) return <div className="p-8 animate-pulse">Loading dashboard...</div>;

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Faculty Dashboard</h1>
        <p className="text-muted-foreground">Manage your modules and student sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "My Modules", value: summary?.moduleCount || 0, icon: BookOpen },
          { label: "Total Lessons", value: summary?.lessonCount || 0, icon: Edit },
          { label: "Pending Requests", value: summary?.pendingBookings || 0, icon: Clock },
          { label: "Total Students", value: summary?.totalStudents || 0, icon: Users },
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
        <div className="p-6 border-b border-border bg-secondary/20">
          <h2 className="text-xl font-serif font-bold text-primary">Pending Session Requests</h2>
        </div>
        <div className="divide-y divide-border">
          {!pendingBookings.length ? (
            <div className="p-8 text-center text-muted-foreground">No pending requests.</div>
          ) : (
            pendingBookings.map(b => (
              <div key={b.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{b.studentName}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(b.scheduledAt).toLocaleString()}
                  </div>
                  {b.notes && <p className="text-sm mt-2 text-muted-foreground italic">"{b.notes}"</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleBookingAction(b.id, 'cancelled')}>Decline</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleBookingAction(b.id, 'confirmed')}>Accept</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ModulesManager() {
  const { data: user } = useGetMe();
  // Pass an empty object to match the expected signature, or omit if optional
  const { data: allModules, isLoading } = useListModules({}); 
  const createModule = useCreateModule();
  const deleteModule = useDeleteModule();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Filter modules for this tutor
  const modules = allModules?.filter(m => m.tutorId === user?.id) || [];

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createModule.mutate({
      data: {
        code: fd.get('code') as string,
        title: fd.get('title') as string,
        year: parseInt(fd.get('year') as string),
        description: fd.get('description') as string,
        nucApproved: fd.get('nucApproved') === 'on',
        tutorId: user?.id,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Module Created" });
        queryClient.invalidateQueries({ queryKey: getListModulesQueryKey() });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Manage Modules</h1>
          <p className="text-muted-foreground">Create courses and add lessons.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm sticky top-24">
            <h2 className="text-xl font-serif font-bold text-primary mb-6">New Module</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code (e.g. LAW101)</label>
                <input name="code" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input name="title" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LL.B Year (1-5)</label>
                <input type="number" min="1" max="5" name="year" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" rows={3} required className="w-full px-3 py-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent"></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="nucApproved" id="nuc" defaultChecked className="rounded border-input text-accent focus:ring-accent" />
                <label htmlFor="nuc" className="text-sm font-medium">NUC Approved</label>
              </div>
              <Button type="submit" className="w-full" disabled={createModule.isPending}>
                Create Module
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="animate-pulse">Loading modules...</div>
          ) : !modules.length ? (
            <div className="bg-white p-12 text-center rounded-xl border border-border shadow-sm text-muted-foreground">
              You haven't created any modules yet.
            </div>
          ) : (
            modules.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row justify-between gap-4 group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">{m.code}</span>
                    <span className="text-sm text-muted-foreground font-medium">Year {m.year}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-foreground mb-2">{m.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {m.lessonCount} Lessons</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {m.enrolledCount} Enrolled</span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col justify-end gap-2 shrink-0">
                  <Button variant="outline" onClick={() => setLocation(`/tutor/modules/${m.id}`)}>
                    Manage Content
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if(confirm('Delete module?')) {
                        deleteModule.mutate({ id: m.id }, {
                          onSuccess: () => queryClient.invalidateQueries({ queryKey: getListModulesQueryKey() })
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LessonManager({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: module, isLoading } = useGetModule(id, { query: { enabled: !!id, queryKey: getGetModuleQueryKey(id) } });
  const createLesson = useCreateLesson();
  const deleteLesson = useDeleteLesson();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading || !module) return <div className="p-8">Loading...</div>;

  const handleAddLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createLesson.mutate({
      id,
      data: {
        title: fd.get('title') as string,
        description: fd.get('description') as string,
        durationMinutes: parseInt(fd.get('durationMinutes') as string),
        videoUrl: fd.get('videoUrl') as string,
        position: (module.lessons?.length || 0) + 1
      }
    }, {
      onSuccess: () => {
        toast({ title: "Lesson added" });
        queryClient.invalidateQueries({ queryKey: getGetModuleQueryKey(id) });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setLocation('/tutor/modules')}>← Back</Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">{module.code}: {module.title}</h1>
          <p className="text-muted-foreground">Manage lessons and content</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-accent"/> Add New Lesson</h2>
        <form onSubmit={handleAddLesson} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Lesson Title</label>
            <input name="title" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input type="number" name="durationMinutes" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
            <input name="videoUrl" type="url" className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Description / Notes</label>
            <textarea name="description" rows={2} className="w-full px-3 py-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent"></textarea>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={createLesson.isPending}>Add Lesson</Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-primary">Existing Lessons</h2>
        {!module.lessons?.length ? (
          <div className="text-center p-8 text-muted-foreground bg-white border border-border rounded-xl">No lessons yet.</div>
        ) : (
          <div className="bg-white border border-border rounded-xl shadow-sm divide-y divide-border">
            {module.lessons.sort((a,b)=>a.position - b.position).map((lesson, i) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" /> {lesson.durationMinutes} min
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if(confirm('Delete lesson?')) {
                      deleteLesson.mutate({ id: lesson.id }, {
                        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetModuleQueryKey(id) })
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TutorPortal() {
  const links = [
    { href: '/tutor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tutor/modules', label: 'My Modules', icon: BookOpen },
  ];

  return (
    <PortalLayout role="Faculty" links={links}>
      <Switch>
        <Route path="/tutor" component={TutorDashboard} />
        <Route path="/tutor/modules" component={ModulesManager} />
        <Route path="/tutor/modules/:id" component={LessonManager} />
      </Switch>
    </PortalLayout>
  );
}