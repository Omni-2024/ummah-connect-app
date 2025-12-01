"use client";

import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import {
  EnvelopeClosedIcon,
  GlobeIcon,
  CalendarIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { BuildingLibraryIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";           // ← Correct import
import { useCurrentUser } from "@/lib/hooks/useUser";   // ← Your auth hook

interface SidebarProps {
  educator: any;
  handleContact: () => void;
}

export default function Sidebar({ educator, handleContact }: SidebarProps) {
  const router = useRouter();
  const { data: user } = useCurrentUser(); // ← null = not logged in

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Protected contact handler
  const onContactClick = () => {
    if (!user) {
      router.push("/user/signup");
      return;
    }
    handleContact(); // Only runs if user is logged in
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6 border border-gray-200 rounded-lg">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Contact {educator.name || "Educator"}
          </h3>
          <div className="text-sm text-gray-600">
            Usually responds within 2 hours
          </div>
        </div>

        {/* Contact Button - Now Protected */}
        <div>
          <Button
            onClick={onContactClick}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            <EnvelopeClosedIcon className="size-4" />
            Contact Me
          </Button>
        </div>

        {/* Contact Info Section */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <GlobeIcon className="size-4 text-gray-400 mt-1" />
            <div>
              <p className="text-xs font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-600">
                {educator.country?.trim() || "Not specified"}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-start gap-3">
            <CalendarIcon className="size-4 text-gray-400 mt-1" />
            <div>
              <p className="text-xs font-medium text-gray-900">Member Since</p>
              <p className="text-sm text-gray-600">
                {formatJoinDate(educator.createdAt)}
              </p>
            </div>
          </div>

          {/* Organization */}
          <div className="flex items-start gap-3">
            <BuildingLibraryIcon className="size-4 text-gray-400 mt-1" />
            <div>
              <p className="text-xs font-medium text-gray-900">Organization</p>
              <p className="text-sm text-gray-600">
                {educator.company?.trim() || "Not specified"}
              </p>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex items-start gap-3">
            <StarFilledIcon className="size-4 text-gray-400 mt-1" />
            <div>
              <p className="text-xs font-medium text-gray-900">
                Specializations
              </p>
              <p className="text-sm text-gray-600">
                {educator.specializations?.trim() || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}