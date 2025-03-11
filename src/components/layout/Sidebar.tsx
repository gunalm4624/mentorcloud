
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
  LogOutIcon, 
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();

  const menuItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: SearchIcon, label: "Explore", path: "/explore" },
    { icon: BookOpenIcon, label: "My Courses", path: "/dashboard" },
    { icon: CalendarIcon, label: "Mentorship", path: "/mentorship" },
    { icon: CreditCardIcon, label: "Earnings", path: "/dashboard?tab=earnings" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/";
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:relative",
        isOpen ? "w-64" : "w-20",
        "lg:translate-x-0",
        !isOpen && "translate-x-[-100%] lg:translate-x-0"
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {isOpen ? (
          <h1 className="text-xl font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            MasterPlan
          </h1>
        ) : (
          <span className="text-2xl font-bold mx-auto">MP</span>
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
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive(item.path)
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-600 hover:text-black hover:bg-gray-50",
                    !isOpen && "justify-center"
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <Link to="/profile/me">
          <div className={cn(
            "flex items-center",
            isOpen ? "gap-3" : "justify-center"
          )}>
            <Avatar className="h-9 w-9 transition-all">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-gray-500">john@example.com</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
}
