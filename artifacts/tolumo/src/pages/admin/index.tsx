import React from 'react';
import { Route, Switch } from 'wouter';
import { PortalLayout } from '@/components/portal-layout';
import { LayoutDashboard, Users, BookOpen, Calendar, HelpCircle, ShieldAlert } from 'lucide-react';
import { 
  useGetAdminSummary,
  useListUsers,
  useUpdateUser,
  useListModules,
  useListBookings,
  getListUsersQueryKey
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

function AdminDashboard() {
  const { data: summary, isLoading } = useGetAdminSummary();
  const { data: users } = useListUsers();

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Platform Overview</h1>
        <p className="text-muted-foreground">Master control panel for Tolumo.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Students", value: summary?.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Tutors", value: summary?.totalTutors, icon: Presentation, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Modules", value: summary?.totalModules, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Enrollments", value: summary?.totalEnrollments, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100" },
          { label: "Bookings", value: summary?.totalBookings, icon: Calendar, color: "text-rose-600", bg: "bg-rose-100" },
          { label: "Tickets", value: summary?.openTickets, icon: HelpCircle, color: "text-orange-600", bg: "bg-orange-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-sm text-center">
            <div className={`mx-auto h-10 w-10 rounded-full flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold font-serif text-foreground mb-1">{stat.value || 0}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-primary">Modules by Year</h2>
          </div>
          <div className="p-6 space-y-4">
            {summary?.byYear?.map(y => (
              <div key={y.year} className="flex items-center justify-between">
                <div className="font-medium text-foreground">Year {y.year}</div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground w-24">{y.moduleCount} modules</span>
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${Math.min(y.enrollmentCount, 100)}%` }}></div>
                  </div>
                  <span className="font-bold text-primary w-12 text-right">{y.enrollmentCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-primary">Recent Users</h2>
          </div>
          <div className="divide-y divide-border">
            {users?.slice(0, 5).map(u => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                  {u.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersManager() {
  const { data: users, isLoading } = useListUsers();
  const updateUser = useUpdateUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRoleChange = (id: number, role: string) => {
    // @ts-ignore - casting for simplified enum handling
    updateUser.mutate({ id, data: { role } }, {
      onSuccess: () => {
        toast({ title: "Role updated successfully" });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">User Management</h1>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                users?.map(u => (
                  <tr key={u.id} className="hover:bg-secondary/10">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'tutor' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-input rounded bg-background px-2 py-1 outline-none focus:border-accent"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                        <option value="sub_agent">Sub Agent</option>
                        <option value="super_agent">Super Agent</option>
                        <option value="support">Support</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Presentation, GraduationCap } from 'lucide-react';

export default function AdminPortal() {
  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <PortalLayout role="Admin" links={links}>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/users" component={UsersManager} />
      </Switch>
    </PortalLayout>
  );
}