import React from 'react';
import { Route, Switch } from 'wouter';
import { PortalLayout } from '@/components/portal-layout';
import { LayoutDashboard, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { 
  useGetSuperAgentSummary,
  useListSubAgents
} from '@workspace/api-client-react';

function SuperAgentDashboard() {
  const { data: summary, isLoading } = useGetSuperAgentSummary();
  const { data: subAgents } = useListSubAgents();

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Network Management</h1>
        <p className="text-muted-foreground">Oversee your sales network and organizational performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Sub-Agents", value: summary?.subAgentCount, icon: Users, isMoney: false },
          { label: "Total Network Leads", value: summary?.totalAcquisitions, icon: TrendingUp, isMoney: false },
          { label: "Total Network Enrolled", value: summary?.totalEnrolled, icon: ShieldCheck, isMoney: false },
          { label: "Network Commission Flow", value: summary?.networkCommission, icon: TrendingUp, isMoney: true },
        ].map((stat, i) => (
          <div key={i} className="bg-primary border border-primary-border text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 scale-150 -mr-4 -mt-4">
              <stat.icon className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold font-serif mb-2">
                {stat.isMoney ? `₦${(stat.value || 0).toLocaleString()}` : (stat.value || 0)}
              </div>
              <div className="text-sm font-medium text-white/70 uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/20">
          <h2 className="text-xl font-serif font-bold text-primary">Sub-Agent Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4 text-center">Leads Generated</th>
                <th className="px-6 py-4 text-center">Successful Conversions</th>
                <th className="px-6 py-4 text-center">Conversion Rate</th>
                <th className="px-6 py-4 text-right">Total Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!subAgents?.length ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No active sub-agents in your network yet.</td></tr>
              ) : (
                subAgents.map(a => {
                  const convRate = a.totalAcquisitions > 0 ? Math.round((a.enrolledCount / a.totalAcquisitions) * 100) : 0;
                  return (
                    <tr key={a.userId} className="hover:bg-secondary/10">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                            {a.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{a.name}</div>
                            <div className="text-xs text-muted-foreground font-normal">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">{a.totalAcquisitions}</td>
                      <td className="px-6 py-4 text-center font-medium text-emerald-600">{a.enrolledCount}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${convRate}%` }}></div>
                          </div>
                          <span className="text-xs font-bold w-8 text-right">{convRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-primary">₦{a.totalCommission.toLocaleString()}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SuperAgentPortal() {
  const links = [
    { href: '/super-agent', label: 'Network Overview', icon: LayoutDashboard },
  ];

  return (
    <PortalLayout role="Super Agent" links={links}>
      <Switch>
        <Route path="/super-agent" component={SuperAgentDashboard} />
      </Switch>
    </PortalLayout>
  );
}