"use client";

import { useState, useEffect } from "react";
import Button from "@/components/base/button";
import { Toast } from "@/components/base/toast";
import { changeUserRoleFn } from "@/lib/endpoints/usersFns"; // <-- API for users
import { Dropdown } from "@/components/base/custom-dropdown";
import { BriefcaseBusiness, Shield, UserCheck, UserCog } from "lucide-react";
import { UserTick } from "iconsax-react";

interface UserEditPopupProps {
  open: boolean;
  currentRole: string;
  userId: string | null;
  onClose: () => void;
  onUpdate: () => void; // refetch user list after update
}

// Frontend role options
const ROLES = [
  { label: "Admin", value: "admin", icon: <Shield className="w-4 h-4" /> },
  { label: "Business Admin", value: "business_admin", icon: <BriefcaseBusiness className="w-4 h-4" /> },
];

// Map frontend -> backend enums
const ROLE_MAP: Record<string, string> = {
  admin: "ADMIN",
  business_admin: "BUSINESS_ADMIN",
};

export const UserEditPopup: React.FC<UserEditPopupProps> = ({
  open,
  currentRole,
  userId,
  onClose,
  onUpdate,
}) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  // Reset role when popup reopens
  useEffect(() => {
    if (open) setSelectedRole(currentRole);
  }, [open, currentRole]);

  if (!open || !userId) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await changeUserRoleFn(userId, selectedRole); // send enum to backend
      Toast.success("User role updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      Toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-10 w-[400px]">
        <h2 className="text-lg font-bold mb-4">Edit User Role</h2>

        {/* Reusable custom Dropdown in place of the native select */}
        <Dropdown
          options={ROLES}
          value={selectedRole}
          onChange={setSelectedRole}
          placeholder="Select role"
          className="mb-4"
        />

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
