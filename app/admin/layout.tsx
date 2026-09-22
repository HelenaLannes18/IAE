import { Plus_Jakarta_Sans } from "next/font/google";
import AdminThemeProvider from "@/components/admin/AdminThemeProvider";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={jakarta.className}>
            <AdminThemeProvider>{children}</AdminThemeProvider>
        </div>
    );
}
