import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans selection:bg-primary selection:text-black">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen w-full">
          <div className="flex items-center p-4 md:hidden border-b-2 border-black bg-white sticky top-0 z-40">
            <SidebarTrigger />
            <span className="font-bold ml-4">Menu</span>
          </div>
          <div className="flex-1 overflow-auto bg-[#fafafa]">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
