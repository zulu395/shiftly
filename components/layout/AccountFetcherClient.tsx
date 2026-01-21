"use client"

import { useAccountStore } from "@/hooks/stores/accountStore";
import { IAccount } from "@/server/models/Account";
import { useEffect } from "react";

export function AccountFetcherClient({ account }: { account: IAccount }) {
    const setAccount = useAccountStore(s => s.setAccount)
    useEffect(() => {
        setAccount(account)
    }, [account, setAccount])

    return null;
}