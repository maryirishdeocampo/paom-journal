"use client";

import { Pencil, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { addReviewer, updateReviewer } from "@/lib/store";
import type { Reviewer } from "@/lib/types";

interface ReviewerEditorProps {
  reviewer: Reviewer | null;
  adding?: boolean;
  onSaved: () => void;
}

const EMPTY_FORM = {
  name: "",
  affiliation: "",
  email: "",
  expertise: "",
  availability: "available" as Reviewer["availability"],
  deadline: "",
  followUpDate: "",
};

export function ReviewerEditor({ reviewer, adding = false, onSaved }: ReviewerEditorProps) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (reviewer) {
      setForm({
        name: reviewer.name,
        affiliation: reviewer.affiliation,
        email: reviewer.email,
        expertise: reviewer.expertise.join(", "),
        availability: reviewer.availability,
        deadline: reviewer.deadline ?? "",
        followUpDate: reviewer.followUpDate ?? "",
      });
      setError("");
    } else if (adding) {
      setForm({ ...EMPTY_FORM });
      setError("");
    }
  }, [adding, reviewer]);

  if (!reviewer && !adding) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Edit Reviewer</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Click <Pencil className="inline h-3 w-3" /> to edit a reviewer, or use Add
          Reviewer to create a new profile.
        </p>
      </Card>
    );
  }

  const save = () => {
    if (!form.name.trim() || !form.affiliation.trim() || !form.email.trim()) {
      setError("Name, affiliation, and email are required.");
      return;
    }

    const reviewerData = {
      name: form.name,
      affiliation: form.affiliation,
      email: form.email,
      expertise: form.expertise.split(",").map((e) => e.trim()).filter(Boolean),
      availability: form.availability,
      deadline: form.deadline || undefined,
      followUpDate: form.followUpDate || undefined,
    };

    if (adding) {
      addReviewer({
        id: `r-${Date.now().toString(36)}`,
        activeReviews: 0,
        ...reviewerData,
      });
    } else if (reviewer) {
      updateReviewer(reviewer.id, reviewerData);
    }

    onSaved();
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{adding ? "Add Reviewer" : "Edit Reviewer"}</CardTitle>
          {reviewer && (
            <StatusBadge variant={reviewer.availability}>
              {reviewer.activeReviews} active
            </StatusBadge>
          )}
        </div>
      </CardHeader>
      <div className="space-y-3">
        <Input
          id="rev-name"
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          id="rev-affiliation"
          label="Affiliation"
          value={form.affiliation}
          onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
        />
        <Input
          id="rev-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          id="rev-expertise"
          label="Expertise (comma-separated)"
          value={form.expertise}
          onChange={(e) => setForm({ ...form, expertise: e.target.value })}
        />
        <div>
          <label htmlFor="rev-avail" className="mb-1 block text-xs font-medium">
            Availability
          </label>
          <select
            id="rev-avail"
            value={form.availability}
            onChange={(e) =>
              setForm({
                ...form,
                availability: e.target.value as Reviewer["availability"],
              })
            }
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <Input
          id="rev-deadline"
          label="Review Deadline"
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <Input
          id="rev-follow-up"
          label="Follow-up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
        />
        {error && <p className="text-xs text-paom-red">{error}</p>}
        <Button onClick={save} className="w-full">
          {adding ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {adding ? "Add Reviewer" : "Save Reviewer"}
        </Button>
      </div>
    </Card>
  );
}
