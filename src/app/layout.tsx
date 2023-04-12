import "./globals.css";
import { Rubik } from "next/font/google";

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
      <body className={font.className}>{children}</body>
    </html>
  );
}
