import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main content with bottom padding for nav */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}