import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { PageShell } from "@/components/shared/PageShell";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/admin");
  }

  return (
    <PageShell className="pb-10">
      <LoginForm />
    </PageShell>
  );
}
