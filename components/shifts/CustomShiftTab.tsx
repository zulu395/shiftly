"use client";

import { $checkShiftConflicts } from "@/actions/availability";
import { $createShift } from "@/actions/shifts/createShift";
import { useAppActionState } from "@/hooks/useAppActionState";
import { ROLE_STYLES } from "@/utils/shiftStyles";
import { format } from "date-fns";
import { useState } from "react";
import { LuCalendar } from "react-icons/lu";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import AppInput from "../form/AppInput";
import AppSelect from "../form/AppSelect";
import FormButton from "../form/FormButton";
import EmployeesPicker from "./EmployeesPicker";
import ShiftRepeatSelect from "./ShiftRepeatSelect";

type CustomShiftTabProps = {
    initialDate?: Date;
    employeeId?: string;
    onClose: () => void;
};

export default function CustomShiftTab({
    initialDate,
    employeeId,
    onClose,
}: CustomShiftTabProps) {
    const [employees, setEmployees] = useState<string[]>(employeeId ? [employeeId] : []);
    const [repeatValue, setRepeatValue] = useState("Never");
    const [repeatDays, setRepeatDays] = useState<number[]>([]);
    const [repeatEnd, setRepeatEnd] = useState("");

    // Conflict Detection State
    const [date, setDate] = useState(initialDate ? format(initialDate, "yyyy-MM-dd") : "");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [location, setLocation] = useState("Onsite");
    const [conflictMessage, setConflictMessage] = useState<string | null>(null);

    const { action, state, submitting, formKey } = useAppActionState($createShift, {
        onSuccess: onClose,
    });

    useDebounce(
        async () => {
            setConflictMessage(null);
            if (employees.length > 0 && date && startTime && endTime) {
                const result = await $checkShiftConflicts(employees, date, startTime, endTime, location);
                // alert(JSON.stringify(result));
                if (result.conflict) {
                    toast.error(result.message);
                    setConflictMessage(result.message);
                }
            }
        },
        500,
        [employees, date, startTime, endTime, location]
    );

    return (
        <form key={formKey} action={action} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid gap-4">
                {/* Date */}
                <AppInput
                    name="date"
                    title="Date"
                    type="date"
                    placeholder="MM/DD/YYYY"
                    value={date}
                    onChange={setDate}
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
                                value={startTime}
                                onChange={setStartTime}
                                error={state.fieldErrors?.startTime}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">End</label>
                            <AppInput
                                name="endTime"
                                placeholder="9:00 AM"
                                type="time"
                                value={endTime}
                                onChange={setEndTime}
                                error={state.fieldErrors?.endTime}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">Break</label>
                            <AppSelect
                                name="break"
                                placeholder="None"
                                options={["None", "15 min", "30 min", "1 hour"]}
                                defaultValue="None"
                            />
                        </div>
                    </div>
                </div>

                {/* Repeat */}
                <ShiftRepeatSelect
                    value={repeatValue}
                    onChange={setRepeatValue}
                    days={repeatDays}
                    onDaysChange={setRepeatDays}
                    endDate={repeatEnd}
                    onEndDateChange={setRepeatEnd}
                    error={state.fieldErrors?.repeat}
                />
                <input type="hidden" name="repeat" value={repeatValue} />
                <input type="hidden" name="repeatDays" value={JSON.stringify(repeatDays)} />
                <input type="hidden" name="repeatEnd" value={repeatEnd} />

                <AppSelect
                    name="location"
                    title="Location"
                    placeholder="Select Location"
                    options={["Onsite", "Remote"]}
                    value={location}
                    onChange={setLocation}
                    error={state.fieldErrors?.location}
                />

                {/* Position */}
                <AppSelect
                    name="position"
                    title="Position"
                    placeholder="Select Position"
                    options={Object.keys(ROLE_STYLES)}
                    defaultValue="Frontend Developer"
                    error={state.fieldErrors?.position}
                />

                {/* Employee Picker */}
                <EmployeesPicker
                    value={employees}
                    onChange={setEmployees}
                    error={state.fieldErrors?.employees}
                />
                <input type="hidden" name="employees" value={JSON.stringify(employees)} />

                {/* Add Note */}
                <AppInput
                    name="note"
                    title="Add Note"
                    placeholder="Add Note"
                    textarea
                    rows={3}
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
                                defaultChecked
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="publish"
                                value="no"
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">No</span>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Do you want to publish?
                    </p>
                </div>
            </div>

            {state.error && (
                <p className="text-red-600 text-sm font-medium mt-4 text-center">{state.error}</p>
            )}

            {conflictMessage && (
                <p className="text-amber-600 text-sm font-medium mt-4 text-center bg-amber-50 p-2 rounded border border-amber-200">
                    {conflictMessage}
                </p>
            )}

            {/* Footer with Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <FormButton loading={submitting} className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 text-white justify-center">
                    Save Shift
                </FormButton>
            </div>
        </form>
    );
}
