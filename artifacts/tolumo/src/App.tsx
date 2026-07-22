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
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(43, 74%, 49%)",
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
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-border",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none bg-secondary/30",
    headerTitle: "font-serif text-2xl font-bold text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "font-medium text-foreground",
    formFieldLabel: "text-foreground font-medium",
    footerActionLink: "text-accent font-semibold hover:text-accent/80",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground bg-white px-2",
    identityPreviewEditButton: "text-accent hover:text-accent/80",
    formFieldSuccessText: "text-primary",
    alertText: "text-sm",
    logoBox: "h-12 flex items-center justify-center mb-4",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "border-border hover:bg-secondary/50",
    formButtonPrimary: "bg-accent hover:bg-accent/90 text-white shadow-sm border border-transparent font-semibold",
    formFieldInput: "bg-white border-border text-foreground focus:ring-accent",
    footerAction: "flex items-center justify-center gap-1",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive/20 text-destructive",
    otpCodeFieldInput: "border-border focus:ring-accent",
    formFieldRow: "mb-4",
    main: "p-6",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
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
