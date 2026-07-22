import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGetMe } from '@workspace/api-client-react';

// Pages
import LandingPage from './pages/landing';
import OnboardingPage from './pages/onboarding';
import StudentPortal from './pages/student';
import TutorPortal from './pages/tutor';
import AdminPortal from './pages/admin';
import AgentPortal from './pages/agent';
import SuperAgentPortal from './pages/super-agent';
import CrmPortal from './pages/crm';
import NotFound from './pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "none" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(153, 54%, 15%)",
    colorForeground: "hsl(153, 54%, 15%)",
    colorMutedForeground: "hsl(153, 30%, 40%)",
    colorDanger: "hsl(0, 60%, 45%)",
    colorBackground: "hsl(40, 33%, 96%)",
    colorInput: "hsl(0, 0%, 100%)",
    colorInputForeground: "hsl(153, 54%, 15%)",
    colorNeutral: "hsl(40, 20%, 88%)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none p-0",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    header: "hidden",
    logoBox: "hidden",
    logoImage: "hidden",
    socialButtons: "hidden",
    dividerRow: "hidden",
    formFieldLabel: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1",
    footerActionLink: "text-primary font-semibold hover:text-primary/80",
    footerActionText: "text-muted-foreground text-sm",
    identityPreviewEditButton: "text-primary hover:text-primary/80",
    formFieldSuccessText: "text-primary",
    alertText: "text-sm",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-white shadow-sm border border-transparent font-semibold tracking-wide",
    formFieldInput: "bg-white border border-stone-300 text-foreground focus:ring-primary focus:border-primary rounded-lg",
    footerAction: "flex items-center justify-center gap-1 pt-2",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive/20 text-destructive",
    otpCodeFieldInput: "border-border focus:ring-primary",
    formFieldRow: "mb-5",
    main: "p-0",
  },
};

function AuthLayout({ children, mode }: { children: React.ReactNode; mode: 'sign-in' | 'sign-up' }) {
  return (
    <div className="flex min-h-[100dvh]">
      {/* Left panel — dark green */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-10 relative overflow-hidden">

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <img src={`${window.location.origin}${basePath}/logo.svg`} alt="Tolumo" className="h-8 w-8" />
          <span className="font-serif font-bold text-xl tracking-tight text-white">Tolumo</span>
        </div>

        {/* Quote */}
        <div className="relative max-w-sm">
          <blockquote className="font-serif text-2xl md:text-3xl font-bold text-white leading-snug mb-8">
            "The only platform that truly understands how African students learn."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-white font-bold text-sm shrink-0">E</div>
            <div>
              <p className="text-white font-semibold text-sm">Emeka Okafor</p>
              <p className="text-white/50 text-xs">Law Year 3, University of Port Harcourt</p>
            </div>
          </div>
        </div>

        {/* Star rating */}
        <div className="relative flex items-center gap-2">
          <div className="flex text-amber-400 text-sm">{'★★★★★'}</div>
          <span className="text-white/60 text-xs">12,400+ students</span>
        </div>
      </div>

      {/* Right panel — cream */}
      <div className="flex-1 bg-[#F5F2EB] flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 max-w-lg mx-auto w-full py-12">
          {/* Back link */}
          <a href={basePath || '/'} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            ← Back
          </a>

          {/* Tab switcher */}
          <div className="flex rounded-lg border border-border bg-white p-1 mb-8 w-fit">
            <a
              href={`${basePath}/sign-up`}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'sign-up' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}
            >
              Create Account
            </a>
            <a
              href={`${basePath}/sign-in`}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'sign-in' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}
            >
              Sign In
            </a>
          </div>

          {/* Custom heading */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-primary mb-1">
              {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'sign-in' ? 'Sign in to continue your learning journey.' : 'Start your LL.B journey with Tolumo.'}
            </p>
          </div>

          {/* Clerk component */}
          <div className="rounded-xl border border-border bg-white px-6 py-6">
            {children}
          </div>

          {/* Demo buttons */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Demo Student', href: `${basePath}/student` },
                { label: 'Demo Tutor', href: `${basePath}/tutor` },
                { label: 'Demo Admin', href: `${basePath}/admin` },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="inline-flex items-center rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {label}
                </a>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Agent Portals</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Demo Sub-Agent', href: `${basePath}/agent` },
                  { label: 'Demo Super Agent', href: `${basePath}/super-agent` },
                ].map(({ label, href }) => (
                  <a key={label} href={href} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${label === 'Demo Super Agent' ? 'bg-primary text-white border-primary hover:bg-primary/90' : 'border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'}`}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInPage() {
  return (
    <AuthLayout mode="sign-in">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} appearance={clerkAppearance} />
    </AuthLayout>
  );
}

function SignUpPage() {
  return (
    <AuthLayout mode="sign-up">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} appearance={clerkAppearance} />
    </AuthLayout>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

// Redirects user to their portal based on role
function UserPortalRouter() {
  const { data: user, isLoading, error } = useGetMe();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-12 w-12 opacity-50" />
          <p className="text-muted-foreground font-serif">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // 404 means user exists in Clerk but not in our DB -> Onboarding
  if (error || !user) {
    return <Redirect to="/onboarding" />;
  }

  // Route based on role
  switch (user.role) {
    case 'student': return <Redirect to="/student" />;
    case 'tutor': return <Redirect to="/tutor" />;
    case 'admin': return <Redirect to="/admin" />;
    case 'sub_agent': return <Redirect to="/agent" />;
    case 'super_agent': return <Redirect to="/super-agent" />;
    case 'support': return <Redirect to="/crm" />;
    default: return <Redirect to="/onboarding" />;
  }
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <UserPortalRouter />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

// Protected route wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome to Tolumo",
            subtitle: "Sign in to your learning portal",
          },
        },
        signUp: {
          start: {
            title: "Join Tolumo",
            subtitle: "Begin your LL.B journey today",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            
            <Route path="/onboarding">
              {() => <ProtectedRoute component={OnboardingPage} />}
            </Route>
            <Route path="/student/*?">
              {() => <ProtectedRoute component={StudentPortal} />}
            </Route>
            <Route path="/tutor/*?">
              {() => <ProtectedRoute component={TutorPortal} />}
            </Route>
            <Route path="/admin/*?">
              {() => <ProtectedRoute component={AdminPortal} />}
            </Route>
            <Route path="/agent/*?">
              {() => <ProtectedRoute component={AgentPortal} />}
            </Route>
            <Route path="/super-agent/*?">
              {() => <ProtectedRoute component={SuperAgentPortal} />}
            </Route>
            <Route path="/crm/*?">
              {() => <ProtectedRoute component={CrmPortal} />}
            </Route>

            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
