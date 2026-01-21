import { $getAccountFromSession } from "@/actions/account/account";
import { AccountFetcherClient } from "./AccountFetcherClient";
import { AppError } from "@/utils/appError";
import { redirect } from "next/navigation";
import { paths } from "@/utils/paths";

export async function AccountFetcher() {
    const account = await $getAccountFromSession(true);

    if (account instanceof AppError) return null;
    if (!account.hasOnboarded || !account.role) redirect(paths.onboard)

    return <AccountFetcherClient account={account} />;

}