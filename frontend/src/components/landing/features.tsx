"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Coins, Globe, CheckCircle } from "lucide-react";

const features = [
  {
    title: "Smart Contract Escrow",
    description:
      "Funds are locked in a smart contract and only released when the work is approved. No more payment disputes.",
    icon: Lock,
    color: "text-blue-500",
  },
  {
    title: "Crypto Payments",
    description:
      "Get paid instantly in ETH or stablecoins. Low transaction fees and no banking delays.",
    icon: Coins,
    color: "text-yellow-500",
  },
  {
    title: "Global Talent Pool",
    description:
      "Access a decentralized network of skilled professionals from around the world without borders.",
    icon: Globe,
    color: "text-green-500",
  },
  {
    title: "Reputation System",
    description:
      "On-chain reputation that you own. Build trust through verified work history.",
    icon: CheckCircle,
    color: "text-purple-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Why Choose FairLance?
          </h2>
          <p className="text-muted-foreground text-lg">
            We leverage blockchain technology to solve the biggest pain points
            in freelancing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-lg bg-background/50 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
