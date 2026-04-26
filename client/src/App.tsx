import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TeamLogin from "@/pages/TeamLogin";
import TeamPortal from "@/pages/TeamPortal";
import TeamDashboard from "@/pages/TeamDashboard";
import TeamResourcesPage from "@/pages/TeamResourcesPage";
import KnowledgeBasePage from "@/pages/KnowledgeBasePage";
import AdminPanel from "@/pages/AdminPanel";
import WriteUpsPage from "@/pages/WriteUpsPage";
import RecruitmentForm from "@/pages/RecruitmentForm";
import RecruitmentAdmin from "@/pages/RecruitmentAdmin";
import Leaderboard from "@/pages/Leaderboard";

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/team-login"} component={TeamLogin} />
      <Route path={"/team-portal"} component={TeamPortal} />
      <Route path={"/team-dashboard"} component={TeamDashboard} />
      <Route path={"/team-resources"} component={TeamResourcesPage} />
      <Route path={"/knowledge-base"} component={KnowledgeBasePage} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/write-ups"} component={WriteUpsPage} />
      <Route path={"/recruitment"} component={RecruitmentForm} />
      <Route path={"/recruitment-admin"} component={RecruitmentAdmin} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
