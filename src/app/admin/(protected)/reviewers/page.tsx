"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewerCard } from "@/components/reviewers/ReviewerCard";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { reviewers } from "@/lib/mock-data";

export default function AdminReviewersPage() {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");

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
  }, [search, availability]);

  return (
    <AdminShell title="Reviewers">
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search reviewers..."
        className="mb-6"
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((reviewer) => (
          <ReviewerCard key={reviewer.id} reviewer={reviewer} showWorkload />
        ))}
      </div>
    </AdminShell>
  );
}
