"use client";

import { Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { updateReviewer } from "@/lib/store";
import type { Reviewer } from "@/lib/types";

interface ReviewerEditorProps {
  reviewer: Reviewer | null;
  onSaved: () => void;
}

export function ReviewerEditor({ reviewer, onSaved }: ReviewerEditorProps) {
  const [form, setForm] = useState({
    name: "",
    affiliation: "",
    email: "",
    expertise: "",
    availability: "available" as Reviewer["availability"],
    deadline: "",
  });

  useEffect(() => {
    if (reviewer) {
      setForm({
        name: reviewer.name,
        affiliation: reviewer.affiliation,
        email: reviewer.email,
        expertise: reviewer.expertise.join(", "),
        availability: reviewer.availability,
        deadline: reviewer.deadline ?? "",
      });
    }
  }, [reviewer]);

  if (!reviewer) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Edit Reviewer</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Click <Pencil className="inline h-3 w-3" /> on a reviewer card to edit their
          profile, availability, and expertise.
        </p>
      </Card>
    );
  }

  const save = () => {
    updateReviewer(reviewer.id, {
      name: form.name,
      affiliation: form.affiliation,
      email: form.email,
      expertise: form.expertise.split(",").map((e) => e.trim()).filter(Boolean),
      availability: form.availability,
      deadline: form.deadline || undefined,
    });
    onSaved();
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Reviewer</CardTitle>
          <StatusBadge variant={reviewer.availability}>
            {reviewer.activeReviews} active
          </StatusBadge>
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
          label="Next Deadline"
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <Button onClick={save} className="w-full">
          <Save className="h-4 w-4" />
          Save Reviewer
        </Button>
      </div>
    </Card>
  );
}
