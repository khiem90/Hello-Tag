import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Star, Users, Mail, FileText, Award, Tag } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-extrabold text-soft-graphite mb-8">
            About MailBuddy
          </h1>
          
          <div className="prose prose-lg mx-auto text-slate-600 mb-12">
            <p className="text-xl font-medium mb-6">
              We believe mail merge shouldn&apos;t be complicated. That&apos;s why we built MailBuddy!
            </p>
            <p className="mb-6">
              Whether you&apos;re a teacher sending personalized letters to parents, an HR manager creating employee certificates, or a small business owner mailing thank-you cards, we&apos;re here to make the process as fun as the result.
            </p>
          </div>

          {/* Document Types */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: FileText, label: "Letters", color: "bg-bubble-blue text-white" },
              { icon: Award, label: "Certificates", color: "bg-sunshine-yellow text-black" },
              { icon: Tag, label: "Labels", color: "bg-mint-gelato text-black" },
              { icon: Mail, label: "Envelopes", color: "bg-candy-coral text-white" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 font-heading text-sm font-bold shadow-cartoon-sm ${item.color}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-3 mb-16">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-bubble-blue flex items-center justify-center text-white mb-4 shadow-cartoon-sm border-2 border-black">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Fun First</h3>
              <p className="text-sm text-slate-500">Why use a complicated tool when you can use something delightful?</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-sunshine-yellow flex items-center justify-center text-black mb-4 shadow-cartoon-sm border-2 border-black">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">For Everyone</h3>
              <p className="text-sm text-slate-500">Simple enough for beginners, powerful enough for pros.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-candy-coral flex items-center justify-center text-white mb-4 shadow-cartoon-sm border-2 border-black">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Made with Love</h3>
              <p className="text-sm text-slate-500">Crafted by designers who love personalization.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-warm-cloud border-2 border-slate-200 p-8 sm:p-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Ready to start merging?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Jump into the editor and start creating personalized documents today.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8">
                Start Merging
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
