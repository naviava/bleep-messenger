// Lib and utils.
import { db } from "@/lib/db";
import Link from "next/link";

async function Home() {
  await db.set("hello", "world");

  return (
    <div className="mx-auto flex max-w-md justify-center p-12">
      <Link href="/login" className="bg-aqua rounded-xl p-5 font-bold">
        Login
      </Link>
    </div>
  );
}

export default Home;
