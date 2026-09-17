
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Privacy <span className="inline-block bg-[#23A094] text-white px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">Policy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl">
            TL;DR: We don't sell your data to creepy ad companies.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border-4 border-black rounded-3xl p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] prose prose-lg prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 max-w-none">
          <h2>1. What Data We Collect</h2>
          <p>
            We collect basic stuff: your email, your name, and whatever you need to sell your products. We also use cookies, but not the delicious chocolate chip kind. Just the boring internet kind that keeps you logged in so you don't have to type your password every 5 minutes.
          </p>
          
          <h2>2. What We Do With Your Data</h2>
          <p>
            We use it to make Devroad work. We process payments, send you emails about your sales (yay!), and figure out how to make the platform better. That's it. 
          </p>
          
          <h2>3. What We DON'T Do With Your Data</h2>
          <p>
            We do NOT sell your data to third parties. We don't want to be tracked around the internet by weird shoe ads, and we assume you don't either. Your business is your business.
          </p>
          
          <h2>4. Payment Stuff</h2>
          <p>
            When you buy or sell something, the heavy lifting is handled by Stripe or PayPal. They are giant companies with lots of security nerds. We don't store your raw credit card numbers on our servers because that sounds like a terrible idea.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            Want to see what data we have? Want us to delete it? Just email us. We'll nuke your account from orbit (it's the only way to be sure). Note: this means you won't be able to log in or sell things anymore.
          </p>

          <hr className="my-8 border-t-4 border-black" />
          
          <p className="text-sm font-bold text-gray-500">
            Last updated: When we realized we needed a privacy policy.
          </p>
        </div>

      </div>
    </div>
  );
}
