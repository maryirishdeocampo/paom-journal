"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
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
  { key: "year", header: "Year", render: (p) => p.year },
  { key: "category", header: "Category", render: (p) => p.category },
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
    render: (p) => p.doi ?? "—",
  },
];

export default function AdminPublicationsPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const matchesSearch =
        !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchesYear = year === "all" || p.year === Number(year);
      return matchesSearch && matchesYear;
    });
  }, [search, year]);

  return (
    <AdminShell title="Publications">
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search publications..."
        className="mb-6"
        filters={
          <SelectFilter
            label="Year"
            value={year}
            onChange={setYear}
            options={[
              { value: "all", label: "All Years" },
              ...years.map((y) => ({ value: String(y), label: String(y) })),
            ]}
          />
        }
      />
      <DataTable data={filtered} columns={columns} pageSize={10} />
    </AdminShell>
  );
}
