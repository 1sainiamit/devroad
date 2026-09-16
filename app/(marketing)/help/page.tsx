import { Search, Book, MessageCircle, AlertCircle, Settings, CreditCard } from "lucide-react";
import Link from "next/link";

const helpCategories = [
  {
    title: "Getting Started",
    description: "Everything you need to know to set up your first product.",
    icon: Book,
    color: "bg-[#FF90E8]",
  },
  {
    title: "Payments & Payouts",
    description: "How to get paid, manage refunds, and deal with taxes.",
    icon: CreditCard,
    color: "bg-[#FFC900]",
  },
  {
    title: "Account Settings",
    description: "Update your profile, change your password, and manage emails.",
    icon: Settings,
    color: "bg-[#23A094]",
  },
  {
    title: "Troubleshooting",
    description: "Common issues and how to fix them quickly.",
    icon: AlertCircle,
    color: "bg-[#90A8ED]",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            How can we <span className="inline-block bg-[#FF90E8] px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">help?</span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto mt-12">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full pl-16 pr-6 py-6 text-2xl font-bold bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          {helpCategories.map((category, index) => (
            <Link href="#" key={index} className="block group">
              <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all h-full flex flex-col items-start">
                <div className={`p-4 rounded-xl border-4 border-black ${category.color} mb-6`}>
                  <category.icon className="w-8 h-8 text-black" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black mb-3 group-hover:underline decoration-4 underline-offset-4">{category.title}</h2>
                <p className="text-lg text-gray-700 font-medium">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-black text-white p-12 rounded-3xl border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,201,0,1)] text-center max-w-4xl mx-auto">
          <MessageCircle className="w-16 h-16 mx-auto mb-6 text-[#FFC900]" />
          <h2 className="text-4xl font-black mb-4">Still need help?</h2>
          <p className="text-xl text-gray-300 font-medium mb-8 max-w-2xl mx-auto">
            Our support team is always here for you. We typically reply within 24 hours.
          </p>
          <button className="bg-[#FFC900] text-black px-8 py-4 text-2xl font-black rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}
