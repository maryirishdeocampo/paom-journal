"use client";

import { Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewerEditor } from "@/components/admin/ReviewerEditor";
import { ReviewerCard } from "@/components/reviewers/ReviewerCard";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/hooks/useStore";
import type { Reviewer } from "@/lib/types";

export default function AdminReviewersPage() {
  const { reviewers, refresh } = useStore();
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [selected, setSelected] = useState<Reviewer | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    return reviewers.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.affiliation.toLowerCase().includes(search.toLowerCase());
      const matchesAvailability =
        availability === "all" || r.availability === availability;
      return matchesSearch && matchesAvailability;
    });
  }, [reviewers, search, availability]);

  return (
    <AdminShell title="Reviewers">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          placeholder="Search reviewers..."
          className="flex-1"
          filters={
            <SelectFilter
              label="Availability"
              value={availability}
              onChange={setAvailability}
              options={[
                { value: "all", label: "All" },
                { value: "available", label: "Available" },
                { value: "limited", label: "Limited" },
                { value: "unavailable", label: "Unavailable" },
              ]}
            />
          }
        />
        <Button
          onClick={() => {
            setSelected(null);
            setAdding(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Reviewer
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {filtered.length === 0 ? (
            <Card className="sm:col-span-2">
              <p className="text-sm text-muted">
                No reviewers match your search. Use <strong>Add Reviewer</strong> to
                create a new profile.
              </p>
            </Card>
          ) : (
            filtered.map((reviewer) => (
            <div key={reviewer.id} className="relative">
              <ReviewerCard reviewer={reviewer} showWorkload />
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setSelected(reviewer);
                }}
                className="absolute right-3 top-3 rounded-lg bg-card p-2 shadow-sm hover:bg-background"
                aria-label="Edit reviewer"
              >
                <Pencil className="h-4 w-4 text-paom-blue" />
              </button>
            </div>
            ))
          )}
        </div>
        <ReviewerEditor
          reviewer={selected}
          adding={adding}
          onSaved={() => {
            refresh();
            setAdding(false);
            setSelected(null);
          }}
        />
      </div>
    </AdminShell>
  );
}
