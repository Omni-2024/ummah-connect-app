"use client";

import { useState, useEffect } from "react";
import Button from "@/components/base/button";
import { Toast } from "@/components/base/toast";
import {changeProviderRoleFn} from "@/lib/endpoints/providersFns";

interface EditProviderRolePopupProps {
  open: boolean;
  currentRole: string; // frontend string e.g. "admin"
  userId: string | null;
  onClose: () => void;
  onUpdate: () => void; // refetch user list after update
}

// Frontend role options
const ROLES = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];


export const EditProviderRolePopup: React.FC<EditProviderRolePopupProps> = ({
  open,
  currentRole,
  userId,
  onClose,
  onUpdate,
}) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  // Reset selected role whenever popup opens or currentRole changes
  useEffect(() => {
    if (open) setSelectedRole(currentRole);
  }, [open, currentRole]);

  if (!open || !userId) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await changeProviderRoleFn(userId, selectedRole); // Map to backend enum
      Toast.success("Role updated successfully");
      onUpdate(); // refetch user list
      onClose();  // close popup
    } catch (err) {
      Toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h2 className="text-lg font-bold mb-4">Edit Role</h2>

        <select
          className="w-full border rounded-md p-2 mb-4"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
