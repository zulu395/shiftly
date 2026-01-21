import AppLogo from "@/components/common/AppLogo";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-fit min-h-screen">
      <div className="grid lg:grid-cols-2 justify-stretch items-stretch h-full">
        <div className="flex justify-center items-center app-container app-container-y">
          <div className="max-w-[480px] flex flex-col gap-4 items-center w-full">
            <AppLogo />
            {children}
          </div>
        </div>
        <div className="p-4 hidden lg:flex justify-stretch items-stretch h-screen sticky top-0">
          <Image
            alt="Authentication image"
            src={"/images/auth-image.png"}
            height={700}
            width={500}
            className="object-cover h-full w-full overflow-hidden rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
