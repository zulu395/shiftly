import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";
import AnalyticsDashboard from "@/components/dashboard/analytics/AnalyticsDashboard";
import { redirect } from "next/navigation";
import { paths } from "@/utils/paths";

export const metadata = {
    title: "Analytics | Shiftly",
};

export default async function AnalyticsPage() {
    const account = await $getAccountFromSession();

    if (!account || account instanceof AppError) {
        redirect(paths.login);
    }

    if (account.role !== "company") {
        redirect(paths.dashboard);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <AnalyticsDashboard />
        </div>
    );
}
