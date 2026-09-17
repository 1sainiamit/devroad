import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white text-black py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logoicon.png" alt="Devroad Logo" width={32} height={32} className="object-contain rounded-full" />
              <span className="font-black text-2xl tracking-tighter">Devroad</span>
            </Link>
            <p className="font-medium text-gray-700 max-w-xs">
              Go from zero to $1. The easiest way to sell digital products online.
            </p>
          </div>

          {/* Links: Product */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-lg mb-2">Product</h4>
            <Link href="/features" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Features</Link>
            <Link href="/pricing" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Pricing</Link>
            <Link href="/discover" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Discover</Link>
          </div>

          {/* Links: Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-lg mb-2">Resources</h4>
            <Link href="/blog" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Blog</Link>
            <Link href="/help" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Help Center</Link>
            <Link href="/community" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Community</Link>
          </div>

          {/* Links: Company */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-lg mb-2">Company</h4>
            <Link href="/about" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">About</Link>
            <Link href="/terms" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Terms</Link>
            <Link href="/privacy" className="font-bold text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2">Privacy</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t-2 border-black">
          <p className="font-bold text-gray-600 mb-4 md:mb-0">
            © {new Date().getFullYear()} Devroad. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://x.com/isainiamit" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="text-gray-600 hover:text-black hover:-translate-y-1 transition-transform">
              <Icons.x className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/_sainiamit" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-600 hover:text-black hover:-translate-y-1 transition-transform">
              <Icons.instagram className="w-6 h-6" />
            </a>
            <a href="https://in.pinterest.com/isainiamit/" target="_blank" rel="noreferrer" aria-label="Pinterest" className="text-gray-600 hover:text-black hover:-translate-y-1 transition-transform">
              <Icons.pinterest className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/sainiamit01/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-600 hover:text-black hover:-translate-y-1 transition-transform">
              <Icons.linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
