import { DiscoverNavbar } from "@/components/discover/discover-navbar";
import { Footer } from "@/components/layout/footer";

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-white">
      <DiscoverNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
