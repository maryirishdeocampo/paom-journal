"use client";

import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/hooks/useStore";
import { updatePublication } from "@/lib/store";
import type { Publication } from "@/lib/types";

export default function AdminPublicationsPage() {
  const { publications, refresh } = useStore();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [selected, setSelected] = useState<Publication | null>(null);
  const [form, setForm] = useState({ status: "published" as Publication["status"], doi: "" });

  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const matchesSearch =
        !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchesYear = year === "all" || p.year === Number(year);
      return matchesSearch && matchesYear;
    });
  }, [publications, search, year]);

  const columns: Column<Publication>[] = [
    {
      key: "title",
      header: "Title",
      render: (p) => (
        <button
          type="button"
          onClick={() => {
            setSelected(p);
            setForm({ status: p.status, doi: p.doi ?? "" });
          }}
          className="text-left font-medium text-paom-blue hover:underline"
        >
          {p.title}
        </button>
      ),
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
  ];

  const save = () => {
    if (!selected) return;
    updatePublication(selected.id, {
      status: form.status,
      doi: form.doi || undefined,
    });
    refresh();
  };

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
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable data={filtered} columns={columns} pageSize={10} />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Edit Publication</CardTitle>
          </CardHeader>
          {selected ? (
            <div className="space-y-3">
              <p className="text-sm font-medium line-clamp-2">{selected.title}</p>
              <div>
                <label htmlFor="pub-status" className="mb-1 block text-xs font-medium">
                  Status
                </label>
                <select
                  id="pub-status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Publication["status"] })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                >
                  <option value="published">Published</option>
                  <option value="in_press">In Press</option>
                </select>
              </div>
              <Input
                id="pub-doi"
                label="DOI"
                value={form.doi}
                onChange={(e) => setForm({ ...form, doi: e.target.value })}
              />
              <Button onClick={save} className="w-full">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted">Click a publication to edit status or DOI.</p>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}
