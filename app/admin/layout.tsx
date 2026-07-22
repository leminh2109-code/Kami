import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  manifest: "/kami-admin-manifest.json",
  appleWebApp: {
    capable: true,
    title: "Kami Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/kami-admin-apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2C1A0E",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
