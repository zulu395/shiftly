import { $getAvailability } from "@/actions/availability";
import AvailabilityForm from "@/components/availability/AvailabilityForm";
import { AppError } from "@/utils/appError";
import { redirect } from "next/navigation";
import { paths } from "@/utils/paths";
import { IAvailability } from "@/server/models/Availability";
import { $getAccountFromSession } from "@/actions/account/account";

export const metadata = {
    title: "Weekly Availability | Shiftly",
};

export default async function AvailabilityPage() {
    const account = await $getAccountFromSession(true);

    if (!(account instanceof AppError) && account.role !== "employee") {
        redirect(paths.dashboard);
    }

    const availability = await $getAvailability();

    if (availability instanceof AppError) {
        if (availability.message === "Unauthorized") {
            redirect(paths.login);
        }
        // Handle other errors or pass null
        // Ideally user is logged in if they are here
    }

    const initialData = availability instanceof AppError ? null : (availability as IAvailability);

    return (
        <div className="app-container-fluid app-container-fluid-y">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    My Availability
                </h1>
                <p className="mt-2 text-gray-600">
                    Manage your weekly availability and location preferences.
                </p>
            </div>

            <AvailabilityForm initialData={initialData} />
        </div>
    );
}
