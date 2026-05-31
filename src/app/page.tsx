import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIcon, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Generate Stunning <span className="text-primary">YouTube Thumbnails</span> in Seconds
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Boost your click-through rate with AI-powered thumbnails. Professional, high-quality, and tailored to your content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg gap-2">
                  Start Generating <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Gallery
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 border-t">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose ThumbAI?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border bg-card shadow-sm">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get high-quality results in under 10 seconds using state-of-the-art Flux models.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card shadow-sm">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">High Resolution</h3>
                <p className="text-muted-foreground">
                  Generate 16:9 landscape images perfect for YouTube, optimized for all screens.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card shadow-sm">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Copyright Free</h3>
                <p className="text-muted-foreground">
                  Fully original AI-generated images that you own and can use anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2026 ThumbAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
