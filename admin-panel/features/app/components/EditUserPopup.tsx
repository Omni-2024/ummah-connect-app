"use client";

import { useState, useEffect } from "react";
import Button from "@/components/base/button";
import { Toast } from "@/components/base/toast";
import { changeUserRoleFn } from "@/lib/endpoints/usersFns";
import { Dropdown } from "@/components/base/custom-dropdown";
import { BriefcaseBusiness, Shield } from "lucide-react";

interface UserEditPopupProps {
  open: boolean;
  currentRole: string;
  userId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

const ROLES = [
  { label: "Business Admin", value: "business_admin", icon: <BriefcaseBusiness className="w-4 h-4" /> },
  { label: "Admin", value: "admin", icon: <Shield className="w-4 h-4" /> },
];

export const UserEditPopup: React.FC<UserEditPopupProps> = ({
                                                              open,
                                                              currentRole,
                                                              userId,
                                                              onClose,
                                                              onUpdate,
                                                            }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole);
      setConfirmOpen(false);
    }
  }, [open, currentRole]);

  if (!open || !userId) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await changeUserRoleFn(userId, selectedRole);
      Toast.success("User role updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      Toast.error("Failed to update role");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const getRoleLabel = (value: string) =>
      ROLES.find((r) => r.value === value)?.label || value;

  return (
      <>
        {/* MAIN MODAL */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[420px]">
            <h2 className="text-lg font-bold mb-4">Edit User Role</h2>

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
              <Button
                  onClick={() => setConfirmOpen(true)}
                  disabled={loading || selectedRole === currentRole}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* CONFIRMATION MODAL */}
        {confirmOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-xl p-8 w-[420px]">
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Role Change
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
                  <p className="mb-2">
                    <strong>Current Role:</strong>{" "}
                    {getRoleLabel(currentRole)}
                  </p>
                  <p>
                    <strong>New Role:</strong>{" "}
                    {getRoleLabel(selectedRole)}
                  </p>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Changing user roles may affect permissions and access levels.
                  Please confirm to proceed.
                </p>

                <div className="flex justify-end gap-2">
                  <Button
                      variant="secondary"
                      onClick={() => setConfirmOpen(false)}
                      disabled={loading}
                  >
                    Back
                  </Button>
                  <Button onClick={handleConfirm} disabled={loading}>
                    {loading ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};
