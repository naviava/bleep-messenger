import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

async function Home() {
  await db.set("hello", "world");

  return (
    <div className="m-6 mx-auto">
      <Button>Button</Button>
    </div>
  );
}

export default Home;
