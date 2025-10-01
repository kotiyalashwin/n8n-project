import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "x8x",
  description: "Build automations like n8n",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        {children}
        <Toaster
          theme="dark"
          richColors
          toastOptions={{
            classNames: {
              content: "text-amber-200 text-lg font-medium",
            },
          }}
          position="top-right"
        />
      </body>
    </html>
  );
}
