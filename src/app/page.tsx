import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, LayoutTemplate, FileSpreadsheet, Download, Sparkles, Mail, FileText, Award, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border-2 border-black bg-sunshine-yellow px-4 py-1.5 font-heading text-sm font-bold text-soft-graphite shadow-cartoon-sm mb-6 transform -rotate-2">
                <Sparkles className="mr-2 h-4 w-4" />
                The Fun Mail Merge Tool
              </div>
              <h1 className="font-heading text-5xl font-extrabold tracking-tight text-soft-graphite sm:text-6xl mb-6 leading-tight">
                Personalize <span className="text-bubble-blue underline decoration-4 decoration-wavy decoration-sunshine-yellow underline-offset-4">Everything!</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
                Create beautiful personalized letters, certificates, labels, and envelopes in seconds. Import your data, design once, export hundreds.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/create">
                  <Button size="lg" className="text-lg px-10">
                    Start Merging
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
               <div className="absolute inset-0 bg-bubble-blue/10 rounded-full blur-3xl transform scale-90" />
               
               <div className="relative z-10 h-full w-full flex items-center justify-center">
                 {/* Mail Stack Animation */}
                 <div className="relative w-72 h-48 bg-white rounded-2xl border-4 border-black shadow-cartoon transform rotate-3 z-30 flex flex-col items-center justify-center p-4">
                    <p className="text-sm text-slate-500 mb-1">Dear {"{{FirstName}}"},</p>
                    <span className="font-heading text-2xl text-bubble-blue">Welcome!</span>
                    <p className="text-xs text-slate-400 mt-2">Your personalized message...</p>
                    <div className="absolute -top-5 -right-5 w-10 h-10 bg-mint-gelato rounded-full border-2 border-black flex items-center justify-center shadow-cartoon-sm animate-bounce">
                      <Mail className="w-5 h-5 text-black" />
                    </div>
                 </div>
                 <div className="absolute w-72 h-48 bg-candy-coral/20 rounded-2xl border-4 border-black shadow-cartoon transform -rotate-6 z-20 translate-y-2"></div>
                 <div className="absolute w-72 h-48 bg-pop-purple/20 rounded-2xl border-4 border-black shadow-cartoon transform rotate-12 z-10 translate-y-4"></div>
                 
                 {/* Decorative Elements */}
                 <div className="absolute top-10 left-10 text-4xl animate-pulse">✉️</div>
                 <div className="absolute bottom-20 right-10 text-4xl animate-bounce">📋</div>
                 <div className="absolute top-1/2 left-0 w-20 h-20 bg-pop-purple rounded-full opacity-20 blur-xl"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types Preview */}
      <section className="py-16 bg-warm-cloud border-y-2 border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-soft-graphite mb-3">
              One Tool, Endless Possibilities
            </h2>
            <p className="text-slate-600">
              Create any type of personalized document
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: FileText, label: "Letters", color: "bg-bubble-blue" },
              { icon: Award, label: "Certificates", color: "bg-sunshine-yellow" },
              { icon: Users, label: "Name Tags", color: "bg-mint-gelato" },
              { icon: Mail, label: "Envelopes", color: "bg-candy-coral" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-2 shadow-cartoon-sm transition-transform hover:scale-105"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color} border-2 border-black`}>
                  <item.icon className="h-4 w-4 text-black" />
                </div>
                <span className="font-heading font-bold text-soft-graphite">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-4xl font-bold text-soft-graphite mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-600 text-lg">
              Packed with features to make mail merge fun and effortless.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card variant="sticker" hoverEffect className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-bubble-blue border-2 border-black shadow-cartoon-sm flex items-center justify-center mb-4 text-white">
                  <Wand2 className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Visual Editor</h3>
                <p className="text-slate-500">
                  Drag and drop merge fields anywhere. See your design come to life instantly.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card variant="sticker" hoverEffect className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-sunshine-yellow border-2 border-black shadow-cartoon-sm flex items-center justify-center mb-4 text-black">
                  <FileSpreadsheet className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Easy Data Import</h3>
                <p className="text-slate-500">
                  Upload CSV or Excel files. Column headers become merge fields automatically.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card variant="sticker" hoverEffect className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-candy-coral border-2 border-black shadow-cartoon-sm flex items-center justify-center mb-4 text-white">
                  <Download className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Instant Export</h3>
                <p className="text-slate-500">
                  Generate hundreds of personalized documents in seconds. Download as Word files.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-warm-cloud overflow-hidden">
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
                   Choose a document type and add merge fields like {"{{FirstName}}"} or {"{{Company}}"}.
                 </p>
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-sunshine-yellow shadow-cartoon mb-6 flex items-center justify-center text-4xl font-heading font-bold text-sunshine-yellow">
                   2
                 </div>
                 <h3 className="font-heading text-2xl font-bold mb-2">Import</h3>
                 <p className="text-slate-500 max-w-xs">
                   Upload your recipient list from CSV or Excel. Preview each merged document.
                 </p>
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-pop-purple shadow-cartoon mb-6 flex items-center justify-center text-4xl font-heading font-bold text-pop-purple">
                   3
                 </div>
                 <h3 className="font-heading text-2xl font-bold mb-2">Export</h3>
                 <p className="text-slate-500 max-w-xs">
                   Download all your personalized documents in one Word file. Print or share!
                 </p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-4xl font-bold text-soft-graphite mb-4">
              Perfect For
            </h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { emoji: "🏫", title: "Schools", desc: "Certificates, report cards, parent letters" },
              { emoji: "💼", title: "Businesses", desc: "Client letters, invoices, thank you notes" },
              { emoji: "🎉", title: "Events", desc: "Name badges, place cards, invitations" },
              { emoji: "🏠", title: "Personal", desc: "Holiday cards, wedding stationery, labels" },
            ].map((item) => (
              <div 
                key={item.title}
                className="rounded-2xl border-2 border-black bg-warm-cloud p-6 text-center shadow-cartoon-sm transition-transform hover:scale-105 hover:-rotate-1"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-heading text-xl font-bold text-soft-graphite mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-mint-gelato/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl font-bold text-soft-graphite mb-6">
            Ready to Start Merging?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy users creating personalized documents with MailBuddy.
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-12 py-6 h-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              Create My First Merge
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
