import type { Metadata } from "next";

// Not listed in search results: this link is only for guests invited to the reception.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ReceptionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
