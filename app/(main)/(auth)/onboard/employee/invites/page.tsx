import { $getInvites } from "@/actions/onboard/employee/getInvites";
import { AppError } from "@/utils/appError";
import InviteCard from "./InviteCard";

export default async function Page() {
    const invites = await $getInvites();

    if (invites instanceof AppError) {
        return <div className="text-red-500">Error loading invites</div>;
    }

    return (
        <div className="max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Pending Invitations</h1>
                <p className="text-gray-500">
                    You have been invited to join the following teams.
                </p>
            </div>

            <div className="grid gap-4">
                {invites.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No pending invitations found.</p>
                ) : (
                    invites.map((invite) => (
                        <InviteCard key={invite._id} invite={invite} />
                    ))
                )}
            </div>
        </div>
    );
}
