import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });


export const metadata: Metadata = {
	title: "x8x-Home",
	description: "Build automations like n8n",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={` ${inter.variable} antialiased`}
			>
				<div className="min-h-screen w-screen grid grid-cols-[200px_1fr]">
					<Sidebar />
					<main className="min-h-screen overflow-hidden">{children}</main>
				</div>
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
