import type { ReactNode } from "react";

import ClientBackdrop from "@/app/components/ClientBackdrop";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white lux-rect">
      <ClientBackdrop />
      <div className="relative z-20">{children}</div>
    </div>
  );
}

