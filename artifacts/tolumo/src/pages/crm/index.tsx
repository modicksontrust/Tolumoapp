import React from 'react';
import { Route, Switch } from 'wouter';
import { PortalLayout } from '@/components/portal-layout';
import { LayoutDashboard, MessageSquare, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { 
  useGetCrmSummary,
  useListTickets,
  useCreateTicket,
  useUpdateTicket,
  getListTicketsQueryKey,
  getGetCrmSummaryQueryKey
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

function CrmDashboard() {
  const { data: summary, isLoading } = useGetCrmSummary();
  const { data: tickets } = useListTickets();
  const updateTicket = useUpdateTicket();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = (id: number, status: any) => {
    updateTicket.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Ticket status updated" });
        queryClient.invalidateQueries({ queryKey: getListTicketsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCrmSummaryQueryKey() });
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading CRM...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Support Desk</h1>
        <p className="text-muted-foreground">Manage student and tutor issues, monitor SLAs.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Open", value: summary?.openTickets, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "In Progress", value: summary?.inProgressTickets, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Resolved", value: summary?.resolvedTickets, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "SLA Breached", value: summary?.breachedSla, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
          { label: "Avg Resolution", value: `${summary?.avgResolutionHours}h`, icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold font-serif text-foreground mb-1">{stat.value || 0}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b border-border bg-secondary/20 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-primary">Active Tickets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Requester</th>
                <th className="px-6 py-4">Priority & SLA</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!tickets?.length ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No active tickets. Great job!</td></tr>
              ) : (
                tickets.map(t => (
                  <tr key={t.id} className="hover:bg-secondary/10">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground mb-1">#{t.id} - {t.subject}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{t.description}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{t.requesterName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          t.priority === 'urgent' ? 'bg-red-100 text-red-700 border border-red-200' :
                          t.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          t.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {t.priority}
                        </span>
                        {t.slaBreached && (
                          <span className="flex items-center gap-1 text-xs text-destructive font-semibold">
                            <AlertTriangle className="h-3 w-3" /> SLA BREACH
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={t.status}
                        onChange={(e) => handleStatusUpdate(t.id, e.target.value)}
                        className={`text-xs border rounded px-2 py-1 outline-none font-medium uppercase tracking-wider ${
                          t.status === 'resolved' || t.status === 'closed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          t.status === 'in_progress' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                          'bg-white border-input text-foreground focus:border-accent'
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
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

export default function CrmPortal() {
  const links = [
    { href: '/crm', label: 'Support Desk', icon: MessageSquare },
  ];

  return (
    <PortalLayout role="Support" links={links}>
      <Switch>
        <Route path="/crm" component={CrmDashboard} />
      </Switch>
    </PortalLayout>
  );
}