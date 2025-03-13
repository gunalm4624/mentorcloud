
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const { isOpen } = useSidebar();
  const { isLoading, profile } = useAuth();

  // Fix for dashboard menu by applying correct overflow handling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Apply user's theme if available
    if (profile?.theme_color) {
      document.documentElement.classList.add(`theme-${profile.theme_color}`);
    } else {
      // Default to black theme
      document.documentElement.classList.add('theme-black');
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('theme-black', 'theme-blue', 'theme-green', 'theme-red', 'theme-orange', 'theme-purple');
    };
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-color border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
