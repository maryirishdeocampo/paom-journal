import { AuthGuard } from "@/components/admin/AuthGuard";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
