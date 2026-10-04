import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Business from "@/pages/Business";

/**
 * The /projects listing page was merged into the home page, where it is the work section (#work).
 * Keep the old URL working: replace it with /#work and let Home scroll to that section on mount.
 */
function ProjectsRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/#work", { replace: true });
  }, [navigate]);
  return null;
}


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/business-templates" component={Business} />
      <Route path={"/projects"} component={ProjectsRedirect} />
      <Route path={"/projects/:id"} component={ProjectDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
