/**
 * Get the appropriate className for a shift based on its position
 */
export const ROLE_STYLES: Record<
  string,
  { assigned: string; unassigned: string }
> = {
  "Frontend Developer": {
    assigned: "bg-cyan-500 text-white border border-cyan-600",
    unassigned: "border-cyan-300 bg-cyan-50 text-cyan-700",
  },
  "Backend Developer": {
    assigned: "bg-emerald-500 text-white border border-emerald-600",
    unassigned: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  "Full Stack Developer": {
    assigned: "bg-violet-500 text-white border border-violet-600",
    unassigned: "border-violet-300 bg-violet-50 text-violet-700",
  },
  "UI/UX Designer": {
    assigned: "bg-pink-500 text-white border border-pink-600",
    unassigned: "border-pink-300 bg-pink-50 text-pink-700",
  },
  "Product Manager": {
    assigned: "bg-orange-500 text-white border border-orange-600",
    unassigned: "border-orange-300 bg-orange-50 text-orange-700",
  },
  "DevOps Engineer": {
    assigned: "bg-red-500 text-white border border-red-600",
    unassigned: "border-red-300 bg-red-50 text-red-700",
  },
  "QA Engineer": {
    assigned: "bg-yellow-500 text-white border border-yellow-600",
    unassigned: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  "Data Scientist": {
    assigned: "bg-teal-500 text-white border border-teal-600",
    unassigned: "border-teal-300 bg-teal-50 text-teal-700",
  },
  Other: {
    assigned: "bg-gray-500 text-white border border-gray-600",
    unassigned: "border-gray-300 bg-gray-50 text-gray-700",
  },
};

export function getShiftClassName(
  position: string,
  isAssigned: boolean = true
): string {
  const style = ROLE_STYLES[position] || ROLE_STYLES["Other"];
  return isAssigned ? style.assigned : style.unassigned;
}
