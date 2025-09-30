import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import {
  EnvelopeClosedIcon,
  GlobeIcon,
  CalendarIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { BuildingLibraryIcon } from "@heroicons/react/16/solid";

interface SidebarProps {
  educator: any;
  handleContact: () => void;
}

export default function Sidebar({ educator, handleContact }: SidebarProps) {
  const formatJoinDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          Contact {educator.name || "Educator"}
        </h3>
        <div className="text-xs sm:text-sm text-gray-600">
          Usually responds within 2 hours
        </div>
      </div>

      {/* Contact Button */}
      <Button
        onClick={handleContact}
        variant="primary"
        className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <EnvelopeClosedIcon className="size-4" />
        Contact Me
      </Button>

      {/* Contact Info */}
      <div className="border-t border-gray-100 pt-4 space-y-3 sm:space-y-4">
        <div className="flex items-start gap-3">
          <GlobeIcon className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900">Location</p>
            <p className="text-sm text-gray-600 truncate">
              {educator.country?.trim() || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarIcon className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900">Member Since</p>
            <p className="text-sm text-gray-600">
              {formatJoinDate(educator.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BuildingLibraryIcon className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900">Organization</p>
            <p className="text-sm text-gray-600 break-words">
              {educator.company?.trim() || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <StarFilledIcon className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900">Specializations</p>
            <p className="text-sm text-gray-600 break-words">
              {educator.specializations?.trim() || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}