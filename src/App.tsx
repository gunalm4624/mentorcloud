
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import ExplorePage from "./pages/ExplorePage";
import CoursePage from "./pages/CoursePage";
import MentorshipPage from "./pages/MentorshipPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import CreateCoursePage from "./pages/CreateCoursePage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/landing" replace />} />
    <Route path="/landing" element={<LandingPage />} />
    <Route path="/auth" element={<AuthPage />} />
    
    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/app" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="course/:id" element={<CoursePage />} />
        <Route path="create-course" element={<CreateCoursePage />} />
        <Route path="mentorship" element={<MentorshipPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
    
    <Route path="*" element={<Navigate to="/landing" replace />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="masterplan-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
