import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getCurrentSession() {
  return await getServerSession(authOptions);
}

export default async function getSession() {
  try {
    const session = await getCurrentSession();

    if (!session) return null;
    return session;
  } catch (err: any) {
    return null;
  }
}
