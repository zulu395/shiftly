import { MappedUserData } from "@/types/csv";
import { LucideMinusCircle } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import AppInput from "../form/AppInput";

export type MappedUserDataWithId = MappedUserData & {
  id: string;
};

type InviteTeamListProps = {
  // Callback function to inform the parent about the current list of valid users
  onDataChange: (data: MappedUserDataWithId[]) => void;
};

const createNewUser = (): MappedUserDataWithId => ({
  id: crypto.randomUUID(), // Use a unique ID for React keys and tracking
  fullname: "",
  email: "",
});

const InviteTeamList: React.FC<InviteTeamListProps> = ({ onDataChange }) => {
  const [users, setUsers] = useState<MappedUserDataWithId[]>([createNewUser()]);

  // 1. Determine if the "Add Teammate" button should be disabled
  // Check the LAST user in the list for completeness
  const lastUser = users[users.length - 1];
  const isLastUserIncomplete = useMemo(() => {
    // If the list is empty (shouldn't happen here, but safe check)
    if (!lastUser) return true;

    // Disabled if fullname OR email is missing/empty
    return lastUser.fullname.trim() === "" || lastUser.email.trim() === "";
  }, [lastUser]);

  // 2. Handler for adding a new empty user entry
  const handleAddTeammate = useCallback(() => {
    if (isLastUserIncomplete) {
      return; // Safety check based on component requirement
    }
    setUsers((prevUsers) => {
      const newUsers = [...prevUsers, createNewUser()];
      // Only call onDataChange with VALID users (in this case, exclude the new empty one)
      onDataChange(prevUsers.filter((u) => u.fullname && u.email));
      return newUsers;
    });
  }, [isLastUserIncomplete, onDataChange]);

  // 3. Handler for input changes in any field
  const handleInputChange = useCallback(
    (
      id: string,
      field: keyof Omit<MappedUserDataWithId, "id">, // Ensure we only target 'fullname' or 'email'
      value: string
    ) => {
      setUsers((prevUsers) => {
        const newUsers = prevUsers.map((user) =>
          user.id === id ? { ...user, [field]: value } : user
        );

        // Filter out incomplete users before calling the prop function
        const validUsers = newUsers.filter(
          (u) => u.fullname.trim() !== "" && u.email.trim() !== ""
        );

        onDataChange(validUsers);
        return newUsers;
      });
    },
    [onDataChange]
  );

  // 4. Handler for removing a user entry
  const handleRemoveUser = useCallback(
    (id: string) => {
      setUsers((prevUsers) => {
        const newUsers = prevUsers.filter((user) => user.id !== id);
        const validUsers = newUsers.filter(
          (u) => u.fullname.trim() !== "" && u.email.trim() !== ""
        );

        onDataChange(validUsers);
        // Ensure there is at least one input field remaining, even if empty
        return newUsers.length > 0 ? newUsers : [createNewUser()];
      });
    },
    [onDataChange]
  );

  // --- Rendering ---
  return (
    <div className="">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <p className="h5 font-medium text-gray-800">Name</p>
          <p className="h5 font-medium text-gray-800">Email</p>
        </div>
        {users.map((user, index) => (
          <div key={user.id} className="flex items-center">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <AppInput
                type="text"
                placeholder="Full Name"
                value={user.fullname}
                onChange={(e) => handleInputChange(user.id, "fullname", e)}
                name={`name-${user.id}`}
                aria-label={`Full Name for teammate ${index + 1}`}
              />

              <AppInput
                type="email"
                placeholder="Email Address"
                value={user.email}
                onChange={(e) => handleInputChange(user.id, "email", e)}
                name={`email-${user.id}`}
                aria-label={`Email for teammate ${index + 1}`}
              />
            </div>

            {users.length > 1 && (
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-150"
                aria-label={`Remove teammate ${index + 1}`}
                type="button"
              >
                <LucideMinusCircle />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Teammate Button */}
      <button
        onClick={handleAddTeammate}
        disabled={isLastUserIncomplete}
        className={"btn btn-white w-full mt-2"}
        type="button"
      >
        + Add Another Teammate
      </button>
     </div>
  );
};

export default InviteTeamList;
