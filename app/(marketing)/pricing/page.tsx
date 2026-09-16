import { Check, HelpCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Are there any monthly fees?",
    answer: "Nope. We only make money when you make money. No subscriptions, no hidden fees."
  },
  {
    question: "What about payment processing fees?",
    answer: "Standard Stripe/PayPal processing fees (usually 2.9% + 30¢) apply on top of our 10% flat fee."
  },
  {
    question: "Do I need to be a developer to use this?",
    answer: "Not at all. You can set up your first product and start selling in under 5 minutes without writing a single line of code."
  },
  {
    question: "How do payouts work?",
    answer: "Payouts are processed automatically to your connected bank account or PayPal account on a weekly basis."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Simple, transparent <span className="inline-block bg-[#FF90E8] px-4 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">pricing</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            We only make money when you do. No monthly fees, no limits, no catches.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC900] rounded-bl-full border-b-4 border-l-4 border-black -z-10 translate-x-12 -translate-y-12"></div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Flat Fee</h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-8xl font-black">10%</span>
              </div>
              <p className="text-xl font-bold text-gray-600">+ standard processing fees</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto mb-12">
              {[
                "Unlimited products",
                "Unlimited customers",
                "Unlimited file hosting",
                "Analytics & Insights",
                "Custom domains",
                "Discount codes"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-xl font-bold">
                  <div className="bg-[#FF90E8] p-1 rounded-full border-2 border-black">
                    <Check className="w-5 h-5 text-black" strokeWidth={3} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/signup" className="inline-flex w-full md:w-auto items-center justify-center px-12 py-5 text-2xl font-bold text-white bg-black border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(35,160,148,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(35,160,148,1)] transition-all">
                Start selling today
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-32">
          <h2 className="text-4xl font-black mb-12 text-center">Got questions?</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <h3 className="text-2xl font-bold mb-4 flex items-start gap-3">
                  <HelpCircle className="w-8 h-8 text-[#90A8ED] shrink-0" strokeWidth={2.5} />
                  {faq.question}
                </h3>
                <p className="text-xl text-gray-700 font-medium pl-11">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
