
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header />
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300 px-4 py-6",
            isOpen ? "lg:ml-64" : "lg:ml-20"
          )}
        >
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
