import { Check, Sparkles, Zap, Globe, Shield, Paintbrush } from "lucide-react";
import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything you need to sell your digital products online.",
};


const features = [
  {
    title: "Sell anywhere, anytime.",
    description: "Embed your storefront on your website, or use our hosted page. We handle the rest.",
    icon: Globe,
    color: "bg-[#FF90E8]",
  },
  {
    title: "Lightning fast checkout.",
    description: "Optimized for conversions. Your customers will fly through checkout.",
    icon: Zap,
    color: "bg-[#FFC900]",
  },
  {
    title: "Secure by default.",
    description: "Enterprise-grade security without the enterprise-grade headache.",
    icon: Shield,
    color: "bg-[#23A094]",
  },
  {
    title: "Make it yours.",
    description: "Customizable to the core. Match your brand's look and feel effortlessly.",
    icon: Paintbrush,
    color: "bg-[#90A8ED]",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 font-bold transform -rotate-2">
            <Sparkles className="w-5 h-5 text-[#FF90E8]" />
            <span>Everything you need to sell online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Features that feel like <span className="inline-block bg-[#FFC900] px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">magic</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            We built the hard stuff so you can focus on what you do best: creating. No coding required.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-black border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(255,144,232,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,144,232,1)] transition-all">
            Start building for free
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all`}
            >
              <div className={`w-16 h-16 ${feature.color} border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Big list of minor features */}
        <div className="mt-32 bg-black text-white p-12 md:p-20 rounded-3xl border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,201,0,1)]">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">And a whole lot more...</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "License keys", "Discount codes", "Pay what you want", 
              "Analytics dashboard", "Webhooks", "API access", 
              "Affiliate center", "PDF Stamping", "Subscription billing"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-xl font-bold">
                <div className="bg-[#23A094] p-1 rounded-full border-2 border-black">
                  <Check className="w-5 h-5 text-black" strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
