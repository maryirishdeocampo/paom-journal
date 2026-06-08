"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAuthed = document.cookie.includes("paom-admin=true");
    if (!isAuthed && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-paom-blue border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
