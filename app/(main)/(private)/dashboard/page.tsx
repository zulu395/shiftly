import { $getAccountFromSession } from "@/actions/account/account";
import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const account = await $getAccountFromSession();

    if (!account || account instanceof AppError) {
        redirect(paths.login);
    }

    // Ensure plain object for client components
    // Mongoose documents can't be passed to client components directly if they have methods/complex types
    // But our Account type is an interface. We might need to serialize it.
    const serializedAccount = JSON.parse(JSON.stringify(account));

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">
                    Overview of your {account.role === "company" ? "company" : "shifts"}
                </p>
            </div>

            {account.role === "company" ? (
                <CompanyDashboard />
            ) : (
                <EmployeeDashboard account={serializedAccount} />
            )}
        </div>
    );
}
