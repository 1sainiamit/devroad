import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "How to Make Your First $1,000 on Devroad",
    excerpt: "The exact blueprint used by top creators to launch their first digital product and get their first paying customers.",
    date: "Sep 15, 2026",
    category: "Guides",
    color: "bg-[#FF90E8]",
  },
  {
    title: "The Ultimate Guide to Pricing Digital Products",
    excerpt: "Stop underselling yourself. Here is how to find the sweet spot between what your audience will pay and what your work is worth.",
    date: "Sep 10, 2026",
    category: "Strategy",
    color: "bg-[#FFC900]",
  },
  {
    title: "Why We Chose a 10% Flat Fee Structure",
    excerpt: "Transparency in pricing is rare. We explain the math behind our flat fee and why subscriptions are bad for creators.",
    date: "Sep 05, 2026",
    category: "Inside Devroad",
    color: "bg-[#23A094]",
  },
  {
    title: "Building an Audience from Scratch in 2026",
    excerpt: "You don't need a million followers. You need 100 true fans. Here is how to find them without losing your mind.",
    date: "Aug 28, 2026",
    category: "Marketing",
    color: "bg-[#90A8ED]",
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Read the <span className="inline-block bg-[#23A094] text-white px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-2xl mx-auto leading-relaxed">
            Tips, tricks, and stories from the front lines of the creator economy.
          </p>
        </div>

        {/* Featured Post (First Item) */}
        <div className="mb-16">
          <div className="block group">
            <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 group-hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${blogPosts[0].color} rounded-bl-full border-b-4 border-l-4 border-black -translate-y-4 translate-x-4`}></div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-black text-white px-4 py-1 font-bold rounded-full border-2 border-black">
                  {blogPosts[0].category}
                </span>
                <span className="text-gray-600 font-bold">{blogPosts[0].date}</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-6 pr-12 group-hover:underline decoration-4 underline-offset-8">
                {blogPosts[0].title}
              </h2>
              
              <p className="text-2xl text-gray-700 font-medium mb-8 max-w-3xl leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              
              <div className="flex items-center gap-2 font-black text-xl">
                Read full article <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, i) => (
            <Link key={i} href="#" className="block group h-full">
              <div className="bg-white rounded-2xl border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-16 h-16 ${post.color} rounded-bl-full border-b-4 border-l-4 border-black -translate-y-2 translate-x-2`}></div>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-black text-white px-3 py-1 text-sm font-bold rounded-full border-2 border-black">
                    {post.category}
                  </span>
                  <span className="text-gray-600 font-bold text-sm">{post.date}</span>
                </div>
                
                <h3 className="text-2xl font-black mb-4 group-hover:underline decoration-2 underline-offset-4">
                  {post.title}
                </h3>
                
                <p className="text-gray-700 font-medium mb-6 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 font-black">
                  Read article <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
