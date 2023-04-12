// Components.
import ClientOnly from "@/components/ClientOnly";
import Button from "@/components/ui/Button";

// Lib and utils.
import { db } from "@/lib/db";
import Link from "next/link";

async function Home() {
  await db.set("hello", "world");

  return (
    <ClientOnly>
      <div className="mx-auto flex max-w-md justify-center p-12">
        <Link href="/login" className="rounded-xl bg-aqua p-5 font-bold">
          Login
        </Link>
      </div>
    </ClientOnly>
  );
}

export default Home;
