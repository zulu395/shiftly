import TopBar from "@/components/dashboard/TopBar";
import LeftPane from "./LeftPane";
import { AccountFetcher } from "@/components/layout/AccountFetcher";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AccountFetcher />
      <section className="flex">
        <LeftPane />
        <div className="flex-1 min-h-screen w-full lg:w-[calc(100%-288px)] ">
          <TopBar />
          {children}
        </div>
      </section>
    </>
  );
}
