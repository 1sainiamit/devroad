export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Terms of <span className="inline-block bg-[#FF90E8] px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">Service</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl">
            TL;DR: Don't do illegal stuff and we'll get along fine.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border-4 border-black rounded-3xl p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] prose prose-lg prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 max-w-none">
          <h2>1. The Basics</h2>
          <p>
            Welcome to Devroad! By using this platform, you agree to these terms. If you don't agree, you can't use Devroad. Sorry, we don't make the rules (wait, actually we do make the rules here).
          </p>
          
          <h2>2. Your Stuff is Your Stuff</h2>
          <p>
            You own everything you upload. We just help you sell it. We don't claim ownership over your digital masterpieces, whether that's a sick UI kit, a novel, or a 10-hour video tutorial on how to knit sweaters for cats. 
          </p>
          
          <h2>3. The "Don't Be a Jerk" Clause</h2>
          <p>
            Don't use our platform to sell illegal things, stolen things, or things that are generally awful. If you do, we'll ban you faster than you can say "crypto rug pull". 
          </p>
          
          <h2>4. Money Stuff</h2>
          <p>
            We take a flat 10% cut because servers and developers aren't free (shocker, right?). The payment processor (like Stripe or PayPal) will also take their standard cut. You get the rest. Payouts happen when they happen (usually pretty fast, don't worry).
          </p>

          <h2>5. Uptime & Warranties</h2>
          <p>
            We try really hard to keep the site up 100% of the time, but sometimes computers are hard. Devroad is provided "as is". If the internet breaks, we are not liable for your lost cat sweater sales.
          </p>

          <h2>6. Changes to these Terms</h2>
          <p>
            We might change these terms sometimes. If we make big changes, we'll probably let you know. If you keep using the site after we change them, it means you agree to the new terms.
          </p>

          <hr className="my-8 border-t-4 border-black" />
          
          <p className="text-sm font-bold text-gray-500">
            Last updated: Right before you read this.
          </p>
        </div>

      </div>
    </div>
  );
}
