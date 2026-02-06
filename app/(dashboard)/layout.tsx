import type { Metadata } from "next";
import AdminShell from "@/components/layout/AdminShell";

export const metadata: Metadata = {
    title: "Maa Khana Admin",
    description: "Admin Dashboard for Maa Khana",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <AdminShell>{children}</AdminShell>;
}
