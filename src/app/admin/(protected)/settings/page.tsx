"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { resetStore } from "@/lib/store";

export default function AdminSettingsPage() {
  const handleReset = () => {
    if (
      confirm(
        "Reset all data to defaults? This will clear submissions, edits, and uploaded files stored in this browser."
      )
    ) {
      resetStore();
      window.location.reload();
    }
  };

  return (
    <AdminShell title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Journal Settings</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              id="journal-name"
              label="Journal Name"
              defaultValue="PAoM Journal of Management"
            />
            <Input
              id="contact-email"
              label="Contact Email"
              defaultValue="journal@paom.org.ph"
            />
            <Input id="issn" label="ISSN" defaultValue="0000-0000" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <p className="mb-4 text-sm text-muted">
            All admin changes are saved in your browser (localStorage). For
            multi-device access, connect Supabase in a future update.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Reset to Demo Data
          </Button>
        </Card>
      </div>
    </AdminShell>
  );
}
