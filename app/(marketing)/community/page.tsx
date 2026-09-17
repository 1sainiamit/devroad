import { Users, Globe2, MessageSquare, Zap } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the community of creators building on Devroad.",
};


export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 font-bold transform rotate-2">
            <Users className="w-5 h-5 text-[#23A094]" />
            <span>Over 10,000 creators</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Join the <span className="inline-block bg-[#90A8ED] px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">community</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-2xl mx-auto leading-relaxed">
            Connect, share, and grow with other creators who are building the future of the digital economy.
          </p>
        </div>

        {/* Discord CTA */}
        <div className="bg-[#5865F2] text-white rounded-3xl border-4 border-black p-12 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-5xl mx-auto mb-24 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 opacity-20">
            <MessageSquare className="w-96 h-96" strokeWidth={1} />
          </div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6">The Devroad Discord</h2>
            <p className="text-2xl font-medium mb-8 text-blue-100">
              The best place to get feedback, share your wins, and hang out with the team building Devroad.
            </p>
            <a href="https://discord.com/invite/6YEhaRcr" target="_blank" rel="noreferrer" className="inline-block bg-white text-black px-10 py-5 text-2xl font-black rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
              Join the Server
            </a>
          </div>
        </div>

        {/* Community Values */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Community Guidelines</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Be Helpful", color: "bg-[#FFC900]", desc: "Share your knowledge and lift others up." },
              { icon: Globe2, title: "Be Respectful", color: "bg-[#23A094]", desc: "Treat everyone with kindness and empathy." },
              { icon: MessageSquare, title: "No Spam", color: "bg-[#FF90E8]", desc: "Self-promo goes in the designated channels only." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center">
                <div className={`${item.color} p-4 rounded-xl border-4 border-black mb-6`}>
                  <item.icon className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="font-medium text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
