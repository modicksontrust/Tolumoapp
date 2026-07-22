import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { PortalLayout } from '@/components/portal-layout';
import { LayoutDashboard, Users, Briefcase, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { 
  useGetAgentSummary,
  useListAcquisitions,
  useCreateAcquisition,
  useUpdateAcquisition,
  getListAcquisitionsQueryKey,
  getGetAgentSummaryQueryKey
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

function AgentDashboard() {
  const { data: summary, isLoading } = useGetAgentSummary();
  const { data: acquisitions } = useListAcquisitions();
  const createAcquisition = useCreateAcquisition();
  const updateAcquisition = useUpdateAcquisition();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createAcquisition.mutate({
      data: {
        studentName: fd.get('studentName') as string,
        studentEmail: fd.get('studentEmail') as string,
        status: 'lead',
        commissionAmount: 50000 // default expected commission
      }
    }, {
      onSuccess: () => {
        toast({ title: "Lead added to pipeline" });
        queryClient.invalidateQueries({ queryKey: getListAcquisitionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAgentSummaryQueryKey() });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  const handleStatusUpdate = (id: number, status: 'lead'|'contacted'|'enrolled'|'paid') => {
    updateAcquisition.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAcquisitionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAgentSummaryQueryKey() });
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Sales Partner Portal</h1>
        <p className="text-muted-foreground">Manage your student pipeline and commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: summary?.totalAcquisitions, icon: Users, isMoney: false },
          { label: "Successfully Enrolled", value: summary?.enrolledCount, icon: CheckCircle2, isMoney: false },
          { label: "Pending Commission", value: summary?.pendingCommission, icon: TrendingUp, isMoney: true },
          { label: "Total Earned", value: summary?.totalCommission, icon: DollarSign, isMoney: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-primary mb-1">
              {stat.isMoney ? `₦${(stat.value || 0).toLocaleString()}` : (stat.value || 0)}
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm sticky top-24">
            <h2 className="text-xl font-serif font-bold text-primary mb-6">Add New Lead</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input name="studentName" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email / Contact</label>
                <input type="email" name="studentEmail" required className="w-full h-10 px-3 rounded-md border border-input outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={createAcquisition.isPending}>
                Add to Pipeline
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-border bg-secondary/20">
              <h2 className="text-xl font-serif font-bold text-primary">Your Pipeline</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Prospect</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Comm. Expected</th>
                    <th className="px-6 py-4 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {!acquisitions?.length ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Your pipeline is empty. Add a lead to get started.</td></tr>
                  ) : (
                    acquisitions.map(a => (
                      <tr key={a.id} className="hover:bg-secondary/10">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{a.studentName}</div>
                          <div className="text-xs text-muted-foreground">{a.studentEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            a.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                            a.status === 'enrolled' ? 'bg-blue-100 text-blue-700' :
                            a.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                            'bg-secondary text-secondary-foreground'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium">₦{a.commissionAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            value={a.status}
                            onChange={(e) => handleStatusUpdate(a.id, e.target.value as any)}
                            disabled={a.status === 'paid'}
                            className="text-xs border border-input rounded bg-background px-2 py-1 outline-none focus:border-accent disabled:opacity-50"
                          >
                            <option value="lead">Lead</option>
                            <option value="contacted">Contacted</option>
                            <option value="enrolled">Enrolled</option>
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
      </div>
    </div>
  );
}

export default function AgentPortal() {
  const links = [
    { href: '/agent', label: 'Pipeline', icon: Briefcase },
  ];

  return (
    <PortalLayout role="Partner" links={links}>
      <Switch>
        <Route path="/agent" component={AgentDashboard} />
      </Switch>
    </PortalLayout>
  );
}