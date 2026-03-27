import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import FindProjects from"./pages/FindProjects";
// 1. I added the import for your new Freelancer Dashboard here!
import FreelancerDashboard from "./pages/FreelancerDashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/register"} component={Register} />
      <Route path={"/dashboard"} component={ClientDashboard} />
      <Route path={"/login"} component={Login} />
      <Route path={"/find-projects"} component={FindProjects} />
      
      {/* 2. I added the specific route for the Freelancer Dashboard here! */}
      <Route path={"/freelancer-dashboard"} component={FreelancerDashboard} />
      
      <Route path={"/project/new"} component={CreateProject} />
      <Route path={"/project/:id"} component={ProjectDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;