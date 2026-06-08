"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/public/PageTransition";
import { ReviewerCard } from "@/components/reviewers/ReviewerCard";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { reviewers } from "@/lib/mock-data";

export default function ReviewersPage() {
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("all");

  const allExpertise = [...new Set(reviewers.flatMap((r) => r.expertise))].sort();

  const filtered = useMemo(() => {
    return reviewers.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.affiliation.toLowerCase().includes(search.toLowerCase()) ||
        r.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()));
      const matchesExpertise =
        expertise === "all" || r.expertise.includes(expertise);
      return matchesSearch && matchesExpertise;
    });
  }, [search, expertise]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editorial Review Board</h1>
          <p className="mt-2 text-muted">
            Meet our distinguished reviewers who uphold the academic standards of the
            PAoM Journal.
          </p>
        </div>

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          placeholder="Search by name, affiliation, or expertise..."
          className="mb-8"
          filters={
            <SelectFilter
              label="Expertise"
              value={expertise}
              onChange={setExpertise}
              options={[
                { value: "all", label: "All Expertise" },
                ...allExpertise.map((e) => ({ value: e, label: e })),
              ]}
            />
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((reviewer) => (
            <ReviewerCard key={reviewer.id} reviewer={reviewer} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted">No reviewers match your search.</p>
        )}
      </div>
    </PageTransition>
  );
}
