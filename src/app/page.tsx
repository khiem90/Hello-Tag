import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, LayoutTemplate, Share2, Printer, Sparkles, Palette } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border-2 border-black bg-sunshine-yellow px-4 py-1.5 font-heading text-sm font-bold text-soft-graphite shadow-cartoon-sm mb-6 transform -rotate-2">
                <Sparkles className="mr-2 h-4 w-4" />
                The #1 Fun Label Maker
              </div>
              <h1 className="font-heading text-5xl font-extrabold tracking-tight text-soft-graphite sm:text-6xl mb-6 leading-tight">
                Make Labels That <span className="text-bubble-blue underline decoration-4 decoration-wavy decoration-sunshine-yellow underline-offset-4">Pop!</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
                Create adorable, custom name tags and labels in seconds. Drag, drop, and print your way to organization bliss!
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/create">
                  <Button size="lg" className="text-lg px-10">
                    Start Creating
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="text-lg px-10">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Illustration Area */}
            <div className="relative mx-auto w-full max-w-[500px] aspect-square lg:ml-auto">
               {/* Simulated Label Maker Machine with CSS/SVG shapes */}
               <div className="absolute inset-0 bg-bubble-blue/10 rounded-full blur-3xl transform scale-90" />
               
               <div className="relative z-10 h-full w-full flex items-center justify-center">
                 {/* Card Stack Animation */}
                 <div className="relative w-64 h-40 bg-white rounded-2xl border-4 border-black shadow-cartoon transform rotate-6 z-20 flex items-center justify-center">
                    <span className="font-heading text-3xl text-candy-coral transform -rotate-2">Hello!</span>
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-sunshine-yellow rounded-full border-2 border-black flex items-center justify-center shadow-cartoon-sm animate-bounce">
                      <Sparkles className="w-6 h-6 text-black" />
                    </div>
                 </div>
                 <div className="absolute w-64 h-40 bg-mint-gelato rounded-2xl border-4 border-black shadow-cartoon transform -rotate-6 z-10 translate-y-4"></div>
                 
                 {/* Decorative Elements */}
                 <div className="absolute top-10 left-10 text-4xl animate-pulse">✨</div>
                 <div className="absolute bottom-20 right-10 text-4xl animate-bounce">🎨</div>
                 <div className="absolute top-1/2 left-0 w-20 h-20 bg-pop-purple rounded-full opacity-20 blur-xl"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-warm-cloud">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-4xl font-bold text-soft-graphite mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-600 text-lg">
              Packed with features to make your labeling life easier and way more fun.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card variant="sticker" hoverEffect className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-bubble-blue border-2 border-black shadow-cartoon-sm flex items-center justify-center mb-4 text-white">
                  <Wand2 className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Drag & Drop Magic</h3>
                <p className="text-slate-500">
                  Simply drag text fields where you want them. It works just like magic!
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card variant="sticker" hoverEffect className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-sunshine-yellow border-2 border-black shadow-cartoon-sm flex items-center justify-center mb-4 text-black">
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Custom Themes</h3>
                <p className="text-slate-500">
                  Choose from our playful palettes or mix your own colors to match your style.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card variant="sticker" hoverEffect className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-candy-coral border-2 border-black shadow-cartoon-sm flex items-center justify-center mb-4 text-white">
                  <Share2 className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Bulk Import</h3>
                <p className="text-slate-500">
                  Upload a CSV or Excel file to generate hundreds of labels instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="font-heading text-4xl font-bold text-soft-graphite">How It Works</h2>
           </div>
           
           <div className="relative">
             {/* Connecting Line (Desktop) */}
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-2 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>

             <div className="grid gap-10 lg:grid-cols-3 relative z-10">
               {/* Step 1 */}
               <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-bubble-blue shadow-cartoon mb-6 flex items-center justify-center text-4xl font-heading font-bold text-bubble-blue">
                   1
                 </div>
                 <h3 className="font-heading text-2xl font-bold mb-2">Design</h3>
                 <p className="text-slate-500 max-w-xs">
                   Use our fun editor to customize your label's look and feel.
                 </p>
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-sunshine-yellow shadow-cartoon mb-6 flex items-center justify-center text-4xl font-heading font-bold text-sunshine-yellow">
                   2
                 </div>
                 <h3 className="font-heading text-2xl font-bold mb-2">Import</h3>
                 <p className="text-slate-500 max-w-xs">
                   Add your list of names via CSV or Excel for bulk creation.
                 </p>
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-pop-purple shadow-cartoon mb-6 flex items-center justify-center text-4xl font-heading font-bold text-pop-purple">
                   3
                 </div>
                 <h3 className="font-heading text-2xl font-bold mb-2">Print</h3>
                 <p className="text-slate-500 max-w-xs">
                   Export to Word or PDF and print them out. Done!
                 </p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-mint-gelato/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl font-bold text-soft-graphite mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of organized (and fun!) people making their labels with Label Buddy.
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-12 py-6 h-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              Create My First Label
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
