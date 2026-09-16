"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Package, ShoppingCart, BarChart3, Settings, LogOut, Compass, BookOpen, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Products", url: "/products", icon: Package },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Payouts", url: "/payouts", icon: Wallet },
  { title: "Discover", url: "/discover", icon: Compass },
  { title: "Library", url: "/library", icon: BookOpen },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <Sidebar className="border-r-2 border-black bg-white">
      <SidebarHeader className="p-6 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-full" />
          <Link href="/" className="font-black text-xl tracking-tighter">Devroad</Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} className={`h-12 px-4 rounded-md transition-all ${isActive ? 'bg-black text-white hover:bg-black/90 hover:text-white' : 'hover:bg-primary/20 text-black hover:border-2 hover:border-black hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}>
                      <Link href={item.url} className="flex items-center gap-3 font-bold text-base">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-black'}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t-2 border-black">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-secondary border-2 border-black rounded-full flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm truncate max-w-[150px]">{user?.name || "Creator"}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</span>
            </div>
          </div>

          <form action={() => {
            toast.success("You have been successfully logged out.");
            logoutAction();
          }}>
            <Button type="submit" variant="ghost" className="w-full justify-start gap-3 h-10 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
