"use client";

import { PubNubProvider as Provider } from "pubnub-react";
import PubNub from "pubnub";
import { useEffect, useState } from "react";
import { useAccountStore } from "@/hooks/stores/accountStore";
import MessagesSkeleton from "./MessagesSkeleton";

export default function PubNubProvider({ children }: { children: React.ReactNode }) {
    const account = useAccountStore(s => s.account);
    const [client, setClient] = useState<PubNub | null>(null);

    useEffect(() => {
        if (account?._id) {
            const pubnub = new PubNub({
                publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY || "demo",
                subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY || "demo",
                userId: account._id.toString(),
            });
            requestAnimationFrame(() => {
                setClient(pubnub);
            });
        }
    }, [account?._id]);

    if (!client) return <MessagesSkeleton />;

    return <Provider client={client}>{children}</Provider>;
}
