import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useClerk, useUser } from '@clerk/react';
import { useUpsertMe } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { BookOpen, Presentation, Users, Briefcase, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileInputRole } from '@workspace/api-client-react';

const ROLES = [
  {
    id: ProfileInputRole.student,
    title: 'Student',
    description: 'I want to study and complete my LL.B degree.',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200 hover:border-blue-600',
  },
  {
    id: ProfileInputRole.tutor,
    title: 'Tutor',
    description: 'I am a lecturer providing modules and sessions.',
    icon: Presentation,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200 hover:border-amber-600',
  },
  {
    id: ProfileInputRole.sub_agent,
    title: 'Sales Partner',
    description: 'I want to refer students and earn commissions.',
    icon: Briefcase,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200 hover:border-emerald-600',
  },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const upsertMe = useUpsertMe();
  
  const [selectedRole, setSelectedRole] = useState<ProfileInputRole | null>(null);
  const [displayName, setDisplayName] = useState(user?.fullName || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You must choose how you want to use Tolumo.",
        variant: "destructive"
      });
      return;
    }
    
    if (!displayName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your display name.",
        variant: "destructive"
      });
      return;
    }

    upsertMe.mutate(
      {
        data: {
          name: displayName,
          role: selectedRole,
        }
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Welcome to Tolumo!",
            description: "Your profile has been created.",
          });
          
          // Route based on role
          switch (data.role) {
            case 'student': setLocation("/student"); break;
            case 'tutor': setLocation("/tutor"); break;
            case 'admin': setLocation("/admin"); break;
            case 'sub_agent': setLocation("/agent"); break;
            case 'super_agent': setLocation("/super-agent"); break;
            case 'support': setLocation("/crm"); break;
            default: setLocation("/");
          }
        },
        onError: (error) => {
          const forbidden =
            error instanceof Error && error.message.includes("403");
          toast({
            title: forbidden ? "Role requires approval" : "Error",
            description: forbidden
              ? "Staff roles are assigned by an administrator. Choose Student or Tutor, or contact your admin."
              : "Could not save profile. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Left side - Visual */}
      <div className="md:w-[40%] bg-primary text-white p-8 md:p-12 lg:p-16 flex flex-col relative overflow-hidden">
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-12">
            <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Tolumo" className="h-8 w-8 brightness-0 invert" />
            <span className="font-serif font-bold text-xl tracking-tight">Tolumo</span>
          </div>
          
          <div className="max-w-md">
            <div className="inline-flex items-center justify-center rounded-full bg-accent/20 px-3 py-1 text-sm text-accent-foreground mb-6 backdrop-blur-sm border border-accent/30 font-medium">
              Welcome
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Tell us how you'll use Tolumo
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              We personalize your dashboard and tools based on what you want to achieve.
            </p>
          </div>
          
          <div className="mt-12 text-sm text-white/50">
            © {new Date().getFullYear()} Tolumo Educational Services
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="md:w-[60%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-background overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                Your Display Name
              </label>
              <input 
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex h-12 w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
                placeholder="E.g. John Doe"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                Choose Your Role
              </label>
              <div className="grid gap-4">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  
                  return (
                    <div 
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`
                        relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all
                        ${isSelected ? `border-accent bg-accent/5 ring-1 ring-accent` : `border-border bg-white hover:border-accent/40`}
                      `}
                    >
                      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${role.bg} ${role.color} mr-4`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{role.title}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-accent">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <div className="text-sm text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white min-w-[140px]"
                disabled={upsertMe.isPending}
              >
                {upsertMe.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

// Needed for the checkmark icon above
import { CheckCircle2 } from 'lucide-react';