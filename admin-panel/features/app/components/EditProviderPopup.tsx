"use client";

import { useState, useEffect } from "react";
import Button from "@/components/base/button";
import { Toast } from "@/components/base/toast";
import { changeProviderRoleFn } from "@/lib/endpoints/providersFns";
import { Dropdown } from "@/components/base/custom-dropdown";
import { Shield, User } from "lucide-react";

interface EditProviderRolePopupProps {
  open: boolean;
  currentRole: string;
  userId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

const ROLES = [
  { label: "Admin", value: "admin", icon: <Shield className="w-4 h-4" /> },
  { label: "User", value: "user", icon: <User className="w-4 h-4" /> },
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

  useEffect(() => {
    if (open) setSelectedRole(currentRole);
  }, [open, currentRole]);

  if (!open || !userId) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await changeProviderRoleFn(userId, selectedRole);
      Toast.success("Role updated successfully");
      onUpdate();
      onClose();
    } catch {
      Toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-10 w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Role</h2>

        <Dropdown
          options={ROLES}
          value={selectedRole}
          onChange={setSelectedRole}
          placeholder="Select role"
          className="mb-6"
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
