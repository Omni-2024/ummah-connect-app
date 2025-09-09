"use client";

import { Save, User } from "lucide-react";
import Button from "@/components/base/button";

interface EditInfoButtonProps {
  isEditing: boolean;
  onClick: () => void;
  saving: boolean;
}

export function EditInfoButton({ isEditing, onClick, saving }: EditInfoButtonProps) {
  const baseClasses = `
    px-4 py-2
    text-sm
    rounded-md
    flex items-center justify-center
    transition-colors duration-300
  `;

  const saveBtnClasses = "bg-[#04AA6D] text-white hover:bg-[#337f7c]";
  const editBtnClasses = "bg-[#9b9e9d] text-white hover:bg-[#337f7c]";

  // Logic: 
  // - if editing, button is Save => blue
  // - if not editing, button is Edit => red
  const appliedClasses = isEditing ? saveBtnClasses : editBtnClasses;

  return (
    <Button
      onClick={onClick}
      disabled={saving}
      className={`${baseClasses} ${appliedClasses}`}
    >
      {isEditing ? (
        <>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
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
