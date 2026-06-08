"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/public/PageTransition";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { useStore } from "@/hooks/useStore";
import type { Publication } from "@/lib/types";

const columns: Column<Publication>[] = [
  {
    key: "title",
    header: "Title",
    render: (p) => <span className="font-medium">{p.title}</span>,
  },
  {
    key: "authors",
    header: "Authors",
    render: (p) => p.authors.join(", "),
  },
  {
    key: "year",
    header: "Year",
    render: (p) => p.year,
  },
  {
    key: "category",
    header: "Category",
    render: (p) => (
      <span className="rounded-lg bg-background px-2 py-0.5 text-xs">{p.category}</span>
    ),
  },
  {
    key: "doi",
    header: "DOI",
    render: (p) =>
      p.doi ? (
        <span className="font-mono text-xs text-paom-blue">{p.doi}</span>
      ) : (
        "—"
      ),
  },
];

export default function ArchivePage() {
  const { publications } = useStore();
  const published = publications.filter((p) => p.status === "published");

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("all");

  const years = [...new Set(published.map((p) => p.year))].sort((a, b) => b - a);
  const categories = [...new Set(published.map((p) => p.category))];

  const filtered = useMemo(() => {
    return published.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        p.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchesYear = year === "all" || p.year === Number(year);
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesYear && matchesCategory;
    });
  }, [published, search, year, category]);

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
                label="Category"
                value={category}
                onChange={setCategory}
                options={[
                  { value: "all", label: "All Categories" },
                  ...categories.map((c) => ({ value: c, label: c })),
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
