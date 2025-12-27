"use client";

import { Save, User } from "lucide-react";
import Button from "@/components/base/button";

interface EditInfoButtonProps {
  isEditing: boolean;
  onClick: () => void;
  saving: boolean;
  disabled?: boolean; // ✅ ADD THIS
}

export function EditInfoButton({
  isEditing,
  onClick,
  saving,
  disabled = false,
}: EditInfoButtonProps) {
  const baseClasses = `
    px-4 py-2
    text-sm
    flex items-center justify-center
    transition-colors duration-300
  `;

  const appliedClasses = "bg-primary-500";

  const isDisabled = saving || disabled; // ✅ MERGED LOGIC

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${appliedClasses} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isEditing ? (
        <>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </>
      ) : (
        <>
          <User className="w-4 h-4 mr-2" />
          Edit Info
        </>
      )}
    </Button>
  );
}
