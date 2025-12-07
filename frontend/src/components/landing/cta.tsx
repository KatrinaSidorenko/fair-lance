"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-blue-500/10" />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 md:p-12 rounded-2xl border bg-background/50 backdrop-blur-sm shadow-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Join the Revolution?
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Be part of the decentralized future of work. Fair payments, no
            middlemen, complete transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base rounded-full"
            >
              <Link href="/signup">Get Started Now</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 px-8 text-base"
            >
              <Link href="/jobs">Explore Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
