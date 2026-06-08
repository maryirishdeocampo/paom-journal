"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Redirect legacy route → unified manuscripts module */
export default function SubmissionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/manuscripts");
  }, [router]);
  return null;
}
