import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Star, Palette, Zap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">

      {/* Hero Section */}
      <header className="grid md:grid-cols-2 min-h-[85vh] border-b-2 border-black">
        {/* Left column (Pink) */}
        <div className="bg-primary p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b-2 md:border-b-0 md:border-r-2 border-black">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            Go from<br />zero to $1.
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-md">
            With GumroadClone, anyone can earn their first dollar online. Just start with what you know, see what sticks, and get paid. It's that easy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-secondary text-black hover:bg-secondary/90 text-xl h-16 px-8 w-full sm:w-auto">
              <Link href="/signup">Start selling</Link>
            </Button>
          </div>
        </div>

        {/* Right column (Yellow/White Graphics) */}
        <div className="bg-secondary p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
          {/* Decorative shapes representing neo-brutalism */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center -rotate-12 animate-pulse">
            <Sparkles className="w-16 h-16" strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12">
            <Zap className="w-20 h-20" strokeWidth={1.5} />
          </div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-primary border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-full" />
        </div>
      </header>

      {/* Features/Value Prop Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-16 text-center tracking-tighter">
          Make your own road.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary rounded-full border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sell anything</h3>
              <p className="text-lg font-medium leading-relaxed">
                Video lessons, monthly subscriptions, physical products, whatever! GumroadClone was created to help you experiment with all kinds of ideas and formats.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-secondary rounded-full border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sell to anyone</h3>
              <p className="text-lg font-medium leading-relaxed">
                Build a loyal following with simple posts, email newsletters, and automated workflows. Plus let your customers pay what they want or choose between one-time, monthly, or yearly payments.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent rounded-full border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <ArrowRight className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sell anywhere</h3>
              <p className="text-lg font-medium leading-relaxed">
                Create a customized storefront, embed the checkout onto your own website, or just share a simple link. It's never been easier to make money online.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Massive CTA */}
      <section className="border-y-2 border-black bg-black text-white py-32 px-6 text-center">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
          Ready to get paid?
        </h2>
        <Button asChild size="lg" className="bg-primary text-black hover:bg-primary border-2 border-primary hover:border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] text-2xl h-20 px-12 transition-all">
          <Link href="/signup">Start Selling Today</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full" />
            <span className="font-bold text-xl tracking-tighter">GumroadClone</span>
          </div>
          <div className="flex gap-6 font-bold text-sm md:text-base">
            <Link href="#" className="hover:underline decoration-2 underline-offset-4">Help</Link>
            <Link href="#" className="hover:underline decoration-2 underline-offset-4">Terms</Link>
            <Link href="#" className="hover:underline decoration-2 underline-offset-4">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
