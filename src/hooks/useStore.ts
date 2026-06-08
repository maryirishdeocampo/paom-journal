"use client";

import { useCallback, useEffect, useState } from "react";
import { getStore, STORE_UPDATE_EVENT } from "@/lib/store";
import type { StoreData } from "@/lib/types";

export function useStore() {
  const [data, setData] = useState<StoreData>(() => getStore());

  const refresh = useCallback(() => {
    setData(getStore());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(STORE_UPDATE_EVENT, refresh);
    return () => window.removeEventListener(STORE_UPDATE_EVENT, refresh);
  }, [refresh]);

  return {
    ...data,
    /** @deprecated use manuscripts */
    submissions: data.manuscripts,
    /** @deprecated use issues */
    scheduleIssues: data.issues,
    refresh,
  };
}
