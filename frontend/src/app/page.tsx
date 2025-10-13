import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <Link
        href="/login">
        <Button variant="default">Login</Button>
      </Link>

    </div>
  );
}
