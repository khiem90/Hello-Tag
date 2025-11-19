import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Star, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-extrabold text-soft-graphite mb-8">
            About Label Buddy
          </h1>
          
          <div className="prose prose-lg mx-auto text-slate-600 mb-12">
            <p className="text-xl font-medium mb-6">
              We believe organizing shouldn't be boring. That's why we built Label Buddy!
            </p>
            <p className="mb-6">
              Whether you're a teacher preparing for the first day of school, an event organizer managing a big conference, or just someone who loves putting names on things (we get it!), we're here to make the process as fun as the result.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 mb-16">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-bubble-blue flex items-center justify-center text-white mb-4 shadow-cartoon-sm">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Fun First</h3>
              <p className="text-sm text-slate-500">Why use a spreadsheet when you can use a toy factory?</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-sunshine-yellow flex items-center justify-center text-black mb-4 shadow-cartoon-sm">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">For Everyone</h3>
              <p className="text-sm text-slate-500">Simple enough for kids, powerful enough for pros.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-candy-coral flex items-center justify-center text-white mb-4 shadow-cartoon-sm">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Made with Love</h3>
              <p className="text-sm text-slate-500">Crafted by designers who love stickers.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-warm-cloud border-2 border-slate-200 p-8 sm:p-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Ready to make some magic?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Jump into the editor and start designing your perfect labels today.
            </p>
            <Link href="/create">
              <Button size="lg" className="text-lg px-8">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

