import { $getAccountFromSession } from "@/actions/account/account";
import { $getAllContacts } from "@/actions/contacts/getAllContacts";
import AppErrorPage from "@/components/layout/AppErrorPage";
import { AppError } from "@/utils/appError";
import { redirect } from "next/navigation";
import { paths } from "@/utils/paths";
import Header from "../Header";
import DataTable from "./DataTable";

export default async function EventContactsPage() {
    const account = await $getAccountFromSession(true);

    if (!(account instanceof AppError) && account.role === "employee") {
        redirect(paths.dashboard);
    }

    const response = await $getAllContacts();

    return (
        <section className="app-container-fluid app-container-fluid-y">
            <Header />

            {response instanceof AppError ? (
                <AppErrorPage error={response} />
            ) : (
                <DataTable data={response} />
            )}
        </section>
    );
}
