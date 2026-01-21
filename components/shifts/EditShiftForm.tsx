"use client";

import { $updateShift } from "@/actions/shifts/updateShift";
import { useAppActionState } from "@/hooks/useAppActionState";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { useMemo } from "react";
import { LuCalendar } from "react-icons/lu";
import { $getAllEmployees } from "@/actions/employees/getAllEmployees";
import type { Shift } from "@/types/schedule";
import { AppError } from "@/utils/appError";
import { PopulatedEmployee } from "@/types/employee";
import AppInput from "../form/AppInput";
import AppSelect from "../form/AppSelect";
import FormButton from "../form/FormButton";
import { ROLE_STYLES } from "@/utils/shiftStyles";

type EditShiftFormProps = {
    shift: Shift;
    onClose: () => void;
};

export default function EditShiftForm({
    shift,
    onClose,
}: EditShiftFormProps) {
    const { action, state, submitting, formKey } = useAppActionState($updateShift, {
        onSuccess: onClose,
    });

    const { data: employees } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await $getAllEmployees();
            if (res instanceof AppError) throw res;
            return res;
        },
    });

    const employeeDisplay = useMemo(() => {
        if (!shift.employeeId) return "Unassigned";
        if (!employees || !Array.isArray(employees)) return shift.employeeId;
        const emp = (employees as PopulatedEmployee[]).find(
            (e) => e._id.toString() === shift.employeeId
        );
        return emp ? (emp.account?.fullname || emp.dummyName) : "Unknown Employee";
    }, [shift.employeeId, employees]);

    const convertTo24Hour = (timeStr: string) => {
        if (!timeStr) return "";
        try {
            const date = parse(timeStr, "h:mm a", new Date());
            return format(date, "HH:mm");
        } catch {
            return timeStr;
        }
    };

    return (
        <form key={formKey} action={action} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <input type="hidden" name="id" value={shift._id} />

            <div className="grid gap-4">
                {/* Date */}
                <AppInput
                    name="date"
                    title="Date"
                    type="date"
                    placeholder="MM/DD/YYYY"
                    value={shift.date}
                    icon={<LuCalendar />}
                    error={state.fieldErrors?.date}
                />

                {/* Time */}
                <div>
                    <label className="inline-block pb-1 text-base">Time</label>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">Start</label>
                            <AppInput
                                name="startTime"
                                placeholder="9:00 AM"
                                type="time"
                                value={convertTo24Hour(shift.startTime)}
                                error={state.fieldErrors?.startTime}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">End</label>
                            <AppInput
                                name="endTime"
                                placeholder="9:00 AM"
                                type="time"
                                value={convertTo24Hour(shift.endTime)}
                                error={state.fieldErrors?.endTime}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">Break</label>
                            <AppSelect
                                name="break"
                                placeholder="None"
                                options={["None", "15 min", "30 min", "1 hour"]}
                                defaultValue={shift.break || "None"}
                            />
                        </div>
                    </div>
                </div>

                {/* Repeat - Readonly */}
                <AppSelect
                    name="repeat"
                    title="Repeat"
                    options={[
                        "Never",
                        "Daily",
                        "Weekly",
                        "Bi-weekly",
                        "Monthly",
                    ]}
                    value={shift.repeat || "Never"}
                    defaultValue={shift.repeat || "Never"}
                    readonly
                    error={state.fieldErrors?.repeat}
                />

                {/* Location */}
                <AppInput
                    name="location"
                    title="Location"
                    placeholder="Add Location"
                    value={shift.location}
                    error={state.fieldErrors?.location}
                />

                {/* Position */}
                <AppSelect
                    name="position"
                    title="Position"
                    placeholder="Select Position"
                    options={Object.keys(ROLE_STYLES)}
                    value={shift.position}
                    defaultValue={shift.position}
                    error={state.fieldErrors?.position}
                />

                {/* Employee - Readonly */}
                <AppInput
                    name="employee_display"
                    title="Employee"
                    placeholder="Employee"
                    value={employeeDisplay}
                    readonly
                />
                <input type="hidden" name="employee" value={shift.employeeId || ""} />

                {/* Add Note */}
                <AppInput
                    name="note"
                    title="Add Note"
                    placeholder="Add Note"
                    textarea
                    rows={3}
                    value={shift.details}
                />

                {/* Publish */}
                <div>
                    <label className="inline-block pb-1 text-base">Publish</label>
                    <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="publish"
                                value="yes"
                                defaultChecked={shift.status === "assigned"}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="publish"
                                value="no"
                                defaultChecked={shift.status === "unassigned"}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>
            </div>

            {state.error && (
                <p className="text-red-600 text-sm font-medium mt-4 text-center">{state.error}</p>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
                <FormButton loading={submitting} className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 text-white justify-center">
                    Save Changes
                </FormButton>
            </div>
        </form>
    );
}
