import ToasterProvider from "@/providers/ToasterProvider";
import "./globals.css";
import { Rubik } from "next/font/google";
import ClientOnly from "@/components/ClientOnly";

export const metadata = {
  title: "Bleep Messenger",
  description: "$#%&! it out",
};

const font = Rubik({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
        </ClientOnly>
        <div>{children}</div>
      </body>
    </html>
  );
}
