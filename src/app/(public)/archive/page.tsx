"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/public/PageTransition";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { useStore } from "@/hooks/useStore";
import type { Manuscript } from "@/lib/types";

const columns: Column<Manuscript>[] = [
  {
    key: "title",
    header: "Title",
    render: (m) => <span className="font-medium">{m.title}</span>,
  },
  {
    key: "authors",
    header: "Authors",
    render: (m) => m.authors.join(", "),
  },
  {
    key: "year",
    header: "Year",
    render: (m) => new Date(m.updatedAt).getFullYear(),
  },
  {
    key: "researchArea",
    header: "Research Area",
    render: (m) => (
      <span className="rounded-lg bg-background px-2 py-0.5 text-xs">{m.researchArea}</span>
    ),
  },
  {
    key: "doi",
    header: "DOI",
    render: (m) =>
      m.doi ? (
        <span className="font-mono text-xs text-paom-blue">{m.doi}</span>
      ) : (
        "—"
      ),
  },
];

export default function ArchivePage() {
  const { manuscripts } = useStore();
  const published = manuscripts.filter((m) => m.status === "published");

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [area, setArea] = useState("all");

  const years = [...new Set(published.map((m) => new Date(m.updatedAt).getFullYear()))].sort(
    (a, b) => b - a
  );
  const areas = [...new Set(published.map((m) => m.researchArea))].sort();

  const filtered = useMemo(() => {
    return published.filter((m) => {
      const matchesSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        m.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchesYear =
        year === "all" || new Date(m.updatedAt).getFullYear() === Number(year);
      const matchesArea = area === "all" || m.researchArea === area;
      return matchesSearch && matchesYear && matchesArea;
    });
  }, [published, search, year, area]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Publications Archive</h1>
          <p className="mt-2 text-muted">
            Browse published research from the PAoM Journal.
          </p>
        </div>

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          placeholder="Search by title, author, or keyword..."
          className="mb-6"
          filters={
            <>
              <SelectFilter
                label="Year"
                value={year}
                onChange={setYear}
                options={[
                  { value: "all", label: "All Years" },
                  ...years.map((y) => ({ value: String(y), label: String(y) })),
                ]}
              />
              <SelectFilter
                label="Research Area"
                value={area}
                onChange={setArea}
                options={[
                  { value: "all", label: "All Areas" },
                  ...areas.map((a) => ({ value: a, label: a })),
                ]}
              />
            </>
          }
        />

        <DataTable data={filtered} columns={columns} pageSize={8} />
      </div>
    </PageTransition>
  );
}
