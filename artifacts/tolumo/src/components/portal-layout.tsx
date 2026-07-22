import React from 'react';
import { Link, useLocation } from 'wouter';
import { useClerk, useUser } from '@clerk/react';
import { 
  BookOpen, Calendar, LayoutDashboard, Settings, LogOut, 
  Menu, X, Bell, User as UserIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PortalLayout({ children, role, links }: { children: React.ReactNode, role: string, links: { href: string, label: string, icon: React.ElementType }[] }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleSignOut = () => {
    signOut({ redirectUrl: basePath || "/" });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-6 w-6" />
          <span className="font-serif font-bold text-lg text-primary tracking-tight">Tolumo</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex
        flex-col w-full md:w-64 bg-primary text-white border-r border-primary-border
        fixed md:sticky top-[61px] md:top-0 h-[calc(100vh-61px)] md:h-[100dvh] z-10
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-8 w-8 brightness-0 invert" />
          <span className="font-serif font-bold text-2xl tracking-tight text-white">Tolumo</span>
        </div>
        
        <div className="px-6 py-4 border-b border-white/10 mb-4">
          <div className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">{role} Portal</div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="font-medium text-white truncate">{user?.fullName || 'User'}</div>
              <div className="text-xs text-white/60 truncate">{user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href || (link.href !== `/${role.toLowerCase()}` && location.startsWith(link.href));
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium
                  ${isActive 
                    ? 'bg-accent text-accent-foreground shadow-sm' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-accent-foreground' : 'text-white/60'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="h-5 w-5 text-white/60" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (Desktop) */}
        <header className="hidden md:flex h-16 items-center justify-end px-6 border-b border-border bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive border border-white"></span>
            </button>
          </div>
        </header>
        
        {/* Content area */}
        <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}