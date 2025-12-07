"use client";

import Link from "next/link";
import { WalletConnect } from "@/components/wallet-connect";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, LogIn } from "lucide-react";

export function LandingNavbar() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary">FL</span>
            </div>
            FairLance
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/jobs"
            className="hover:text-foreground transition-colors"
          >
            Find Jobs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <WalletConnect />

          {!isLoading && (
            isAuthenticated ? (
              <Button asChild variant="default" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
