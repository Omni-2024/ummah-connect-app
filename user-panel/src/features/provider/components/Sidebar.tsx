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

        {/* Contact Button */}
        <div>
          <Button
            onClick={handleContact}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            <EnvelopeClosedIcon className="size-4" />
            Contact Me
          </Button>
        </div>

        {/* Contact Info Section */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          {/* <h4 className="font-medium text-gray-900">Contact Information</h4> */}

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
