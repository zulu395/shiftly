
import { AppError } from "@/utils/appError";
import { ReloadPageButton } from "./ReloadPageButton";


export default function AppErrorPage({ error }: { error: AppError }) {



    return (
        <div className="rounded-xl bg-red-50 shadow border border-red-100 px-4 py-10 flex flex-col justify-center items-center my-4 gap-6">
            <h1 className="h2 font-semibold">{error.message}</h1>
            <p className="h5 font-medium text-red-600">{error.description}</p>
            <ReloadPageButton />
        </div>
    );
}