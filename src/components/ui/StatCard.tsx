"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  index?: number;
  accent?: "red" | "blue" | "gold";
}

const accentColors = {
  red: "from-paom-red/10 to-paom-red/5 text-paom-red",
  blue: "from-paom-blue/10 to-paom-blue/5 text-paom-blue",
  gold: "from-paom-gold/20 to-paom-gold/10 text-amber-700 dark:text-paom-gold",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  index = 0,
  accent = "blue",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card hover className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
            {trend && <p className="mt-1 text-xs text-muted">{trend}</p>}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
              accentColors[accent]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
