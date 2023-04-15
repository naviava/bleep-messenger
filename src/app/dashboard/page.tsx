import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

// Components.
import ClientOnly from "@/components/ClientOnly";

// Lib and utils.
import { authOptions } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  console.log(session?.user);

  return (
    <>
      <h1>{JSON.stringify(session)}</h1>
    </>
  );
};

export default DashboardPage;
