
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  BookOpenIcon, 
  UserIcon, 
  CreditCardIcon, 
  SearchIcon, 
  CalendarIcon, 
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Sparkles,
  Pencil
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();
  const { profile, user } = useAuth();

  // Get initials from full name
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  };

  const menuItems = [
    { icon: HomeIcon, label: "Home", path: "/app" },
    { icon: SearchIcon, label: "Explore", path: "/app/explore" },
    { icon: BookOpenIcon, label: "My Courses", path: "/app/dashboard" },
    { icon: CalendarIcon, label: "Mentorship", path: "/app/mentorship" },
  ];

  // Add creator menu items if the user is a creator
  const creatorMenuItems = profile?.is_creator ? [
    { icon: Pencil, label: "Create Course", path: "/app/create-course", badge: "Creator" },
    { icon: CreditCardIcon, label: "Earnings", path: "/app/dashboard?tab=earnings", badge: "Creator" },
  ] : [];

  // Combine regular and creator menu items
  const allMenuItems = [...menuItems, ...creatorMenuItems];

  const isActive = (path: string) => {
    if (path === "/app" && location.pathname === "/app") {
      return true;
    }
    if (path !== "/app") {
      return location.pathname.startsWith(path);
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out lg:relative",
        isOpen ? "w-64" : "w-20",
        "lg:translate-x-0",
        !isOpen && "translate-x-[-100%] lg:translate-x-0"
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {isOpen ? (
          <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            MasterPlan
          </h1>
        ) : (
          <span className="text-2xl font-bold mx-auto text-gradient-purple">MP</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={toggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {allMenuItems.map((item) => (
            <li key={item.label}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive(item.path)
                      ? "bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                    !isOpen && "justify-center"
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive(item.path) && "text-purple-600 dark:text-purple-400"
                  )} />
                  {isOpen && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="outline" className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link to="/app/profile/me">
          <div className={cn(
            "flex items-center",
            isOpen ? "gap-3" : "justify-center"
          )}>
            <Avatar className="h-9 w-9 transition-all border-2 border-purple-200 dark:border-purple-800">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
              <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{profile?.full_name || 'User'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
}
