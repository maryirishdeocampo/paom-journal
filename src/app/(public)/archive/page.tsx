"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/public/PageTransition";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { publications } from "@/lib/mock-data";
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
    key: "status",
    header: "Status",
    render: (p) => (
      <StatusBadge variant={p.status === "published" ? "published" : "in_press"}>
        {p.status === "published" ? "Published" : "In Press"}
      </StatusBadge>
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

const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
const categories = [...new Set(publications.map((p) => p.category))];

export default function ArchivePage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        p.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchesYear = year === "all" || p.year === Number(year);
      const matchesCategory = category === "all" || p.category === category;
      const matchesStatus = status === "all" || p.status === status;
      return matchesSearch && matchesYear && matchesCategory && matchesStatus;
    });
  }, [search, year, category, status]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Publications Archive</h1>
          <p className="mt-2 text-muted">
            Browse published and in-press research from the PAoM Journal.
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
              <SelectFilter
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "published", label: "Published" },
                  { value: "in_press", label: "In Press" },
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
