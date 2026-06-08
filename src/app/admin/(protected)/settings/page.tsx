import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
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
            <Input
              id="issn"
              label="ISSN"
              defaultValue="0000-0000"
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              id="supabase-url"
              label="Supabase URL"
              placeholder="https://your-project.supabase.co"
            />
            <Input
              id="supabase-key"
              label="Supabase Anon Key"
              placeholder="eyJ..."
              type="password"
            />
            <Input
              id="sheets-id"
              label="Google Sheets ID"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            />
          </div>
          <p className="mt-4 text-xs text-muted">
            Configure backend integrations in .env.local. See README for setup
            instructions.
          </p>
        </Card>
      </div>
    </AdminShell>
  );
}
