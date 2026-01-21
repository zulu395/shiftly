import { $getAccountFromSession } from "@/actions/account/account";
import { $getAllEmployees } from "@/actions/employees/getAllEmployees";
import DataTable from "./DataTable";
import Header from "./Header";
import AppErrorPage from "@/components/layout/AppErrorPage";
import { AppError } from "@/utils/appError";
import { redirect } from "next/navigation";
import { paths } from "@/utils/paths";

export default async function DashboardPage() {
  const account = await $getAccountFromSession(true);

  if (!(account instanceof AppError) && account.role === "employee") {
    redirect(paths.dashboard);
  }

  const response = await $getAllEmployees();

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
