import { $getAccountFromSession } from "@/actions/account/account";
import AppLogo from "@/components/common/AppLogo";
import { AccountFetcherClient } from "@/components/layout/AccountFetcherClient";
import { AppError } from "@/utils/appError";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const account = await $getAccountFromSession(true);
  console.log({ account });


  if (account instanceof AppError) return null;

  // if (account.hasOnboarded) redirect(paths.dashboard)


  return (
    <>
      <AccountFetcherClient account={account} />
      <section className="h-fit min-h-screen">
        <div className="flex flex-col justify-center items-center h-full w-full">
          <div className="flex justify-center items-center app-container app-container-y w-full">
            <div className="max-w-[480px] lg:max-w-[540px] flex flex-col gap-4 items-center w-full">
              <AppLogo />
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
