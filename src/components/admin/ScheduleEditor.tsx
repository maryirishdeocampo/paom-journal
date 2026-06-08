"use client";

import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import {
  addScheduleIssue,
  deleteScheduleIssue,
  updateScheduleIssue,
} from "@/lib/store";
import type { ScheduleIssue } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ScheduleEditorProps {
  issues: ScheduleIssue[];
  onUpdated: () => void;
}

const emptyIssue = (): ScheduleIssue => ({
  id: `s-${Date.now()}`,
  volume: "",
  issue: "",
  releaseDate: new Date().toISOString().slice(0, 10),
  submissionDeadline: new Date().toISOString().slice(0, 10),
  progress: 0,
  status: "planning",
  isPublic: false,
});

export function ScheduleEditor({ issues, onUpdated }: ScheduleEditorProps) {
  const [editing, setEditing] = useState<ScheduleIssue | null>(null);
  const [form, setForm] = useState<ScheduleIssue>(emptyIssue());

  const startEdit = (issue: ScheduleIssue) => {
    setEditing(issue);
    setForm({ ...issue });
  };

  const startNew = () => {
    setEditing(null);
    setForm(emptyIssue());
  };

  const save = () => {
    if (!form.volume || !form.issue) return;
    if (editing) {
      updateScheduleIssue(editing.id, form);
    } else {
      addScheduleIssue(form);
    }
    setEditing(null);
    setForm(emptyIssue());
    onUpdated();
  };

  const remove = (id: string) => {
    if (confirm("Delete this schedule issue?")) {
      deleteScheduleIssue(id);
      onUpdated();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        {issues.map((issue) => (
          <Card key={issue.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">
                  Volume {issue.volume}, Issue {issue.issue}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Deadline: {formatDate(issue.submissionDeadline)} · Release:{" "}
                  {formatDate(issue.releaseDate)}
                </p>
                <div className="mt-2 flex gap-2">
                  <StatusBadge variant={issue.status}>
                    {STATUS_LABELS[issue.status] ?? issue.status}
                  </StatusBadge>
                  {issue.isPublic && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Public
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <ProgressBar value={issue.progress} />
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(issue)}
                  className="rounded-lg p-2 hover:bg-background"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(issue.id)}
                  className="rounded-lg p-2 text-paom-red hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{editing ? "Edit Issue" : "Add Issue"}</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="volume"
              label="Volume"
              value={form.volume}
              onChange={(e) => setForm({ ...form, volume: e.target.value })}
            />
            <Input
              id="issue"
              label="Issue"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
            />
          </div>
          <Input
            id="deadline"
            label="Submission Deadline"
            type="date"
            value={form.submissionDeadline}
            onChange={(e) => setForm({ ...form, submissionDeadline: e.target.value })}
          />
          <Input
            id="release"
            label="Release Date"
            type="date"
            value={form.releaseDate}
            onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
          />
          <div>
            <label htmlFor="progress" className="mb-1 block text-xs font-medium">
              Progress ({form.progress}%)
            </label>
            <input
              id="progress"
              type="range"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="sched-status" className="mb-1 block text-xs font-medium">
              Status
            </label>
            <select
              id="sched-status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as ScheduleIssue["status"],
                })
              }
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
            >
              {["planning", "open", "review", "production", "published"].map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            />
            Show on public site
          </label>
          <div className="flex gap-2">
            <Button onClick={save}>
              <Save className="h-4 w-4" />
              {editing ? "Update" : "Add Issue"}
            </Button>
            {!editing && (
              <Button variant="outline" onClick={startNew}>
                <Plus className="h-4 w-4" />
                New
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
