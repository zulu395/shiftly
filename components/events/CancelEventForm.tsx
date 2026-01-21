"use client";

import { $cancelEvent } from "@/actions/events/cancelEvent";
import { useAppActionState } from "@/hooks/useAppActionState";
import { toast } from "sonner";
import FormButton from "../form/FormButton";

type CancelEventFormProps = {
    eventId: string;
    onSuccess: () => void;
    onCancel: () => void;
};

export default function CancelEventForm({ eventId, onSuccess, }: CancelEventFormProps) {
    const { action, } = useAppActionState($cancelEvent, {
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.success);
                onSuccess();
            }
        },
        onError: (res) => {
            if (res.error) {
                toast.error(res.error);
            }
        },
    });

    return (
        <form action={action}>
            <input type="hidden" name="eventId" value={eventId} />
            <div className="flex justify-end gap-3 mt-4">

                <FormButton className="btn btn-danger">
                    Confirm Cancel
                </FormButton>
            </div>
        </form>
    );
}
