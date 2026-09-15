import { DiscoverNavbar } from "@/components/discover/discover-navbar";

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-white">
      <DiscoverNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
