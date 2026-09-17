import Image from "next/image";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our mission and the team behind Devroad.",
};


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            We help creators make their <span className="inline-block bg-[#FFC900] px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">first dollar.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-2xl mx-auto leading-relaxed">
            The creator economy is broken. It's too hard to start, too expensive to scale, and too confusing to figure out. We're fixing it.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white border-4 border-black rounded-3xl p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto mb-24">
          <div className="prose prose-lg md:prose-xl prose-p:font-medium prose-p:text-gray-800 prose-headings:font-black prose-headings:tracking-tighter max-w-none">
            <h2>Our Story</h2>
            <p>
              We started Devroad because we were tired of setting up 15 different tools just to sell a PDF. We wanted a simple, fast, and beautiful way to monetize our work without learning how to code or paying huge monthly subscription fees before we even made a sale.
            </p>
            <p>
              So we built the platform we wanted to use. A platform where you can go from an idea to a live storefront in under 5 minutes. A platform that only makes money when you make money.
            </p>
            <p>
              Today, Devroad empowers thousands of creators around the world to turn their passions into businesses. And we're just getting started.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16">The Team</h2>
          <div className="flex justify-center">
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-full aspect-square bg-[#FF90E8] rounded-xl border-4 border-black mb-6 flex items-center justify-center overflow-hidden">
                <Image src="/logoicon.png" alt="Amit Saini" width={100} height={100} className="object-contain" />
              </div>
              <h3 className="text-3xl font-black mb-2">Amit Saini</h3>
              <p className="text-xl font-bold text-gray-500 mb-4">Founder & Builder</p>
              <p className="font-medium text-gray-700">Building tools to make the internet a cooler place.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
