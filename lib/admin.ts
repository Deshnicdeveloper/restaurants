import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function isAdminAuthenticated() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.id);
}
