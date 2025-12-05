"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Connect Your Wallet",
    description:
      "Link your MetaMask or WalletConnect-enabled wallet to get started. Your wallet is your identity.",
  },
  {
    step: "02",
    title: "Post or Find Jobs",
    description:
      "Clients post jobs with clear requirements. Freelancers browse and apply to opportunities that match their skills.",
  },
  {
    step: "03",
    title: "Funds Lock in Escrow",
    description:
      "When a freelancer is hired, the client's payment locks in a smart contract. It's safe and transparent.",
  },
  {
    step: "04",
    title: "Complete & Get Paid",
    description:
      "Submit your work, get approval, and receive instant payment. No delays, no disputes.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How it Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple, secure, and transparent. Start earning or hiring in 4 easy
            steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
