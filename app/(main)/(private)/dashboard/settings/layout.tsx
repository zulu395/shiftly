import React from "react";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-6 h-full p-4 md:p-6 overflow-y-auto">
            <Header />
            <div className="max-w-2xl">{children}</div>
        </div>
    );
}
