import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";
import { redirect } from "next/navigation";
import { paths } from "@/utils/paths";

export default async function TasksPage() {
    const account = await $getAccountFromSession(true);

    if (!(account instanceof AppError) && account.role === "employee") {
        redirect(paths.dashboard);
    }

    return (
        <section className="app-container-fluid app-container-fluid-y">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="max-w-md">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
                    <p className="text-gray-600 mb-6">
                        Task management system coming soon. Organize, assign, and track tasks for your team.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <span className="animate-pulse">🚧</span>
                        <span>Under Development</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
