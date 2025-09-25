import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import { EnvelopeClosedIcon, MobileIcon, GlobeIcon, CalendarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { BuildingLibraryIcon } from "@heroicons/react/16/solid";

interface SidebarProps {
  educator: any;
  handleContact: () => void;
}

export default function Sidebar({ educator, handleContact }: SidebarProps) {
  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Contact {educator.name}</h3>
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Usually responds within 2 hours</span>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <Button 
            onClick={handleContact}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            <EnvelopeClosedIcon className="size-4 mr-2" />
            Contact Me
          </Button>
        </div>
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
          <div className="space-y-3">
            {educator.email && (
              <div className="flex items-center gap-3">
                <EnvelopeClosedIcon className="size-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{educator.email || "Not specified"}</p>
                </div>
              </div>
            )}
            {educator.contactNumber && (
              <div className="flex items-center gap-3">
                <MobileIcon className="size-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{educator.contactNumber || "Not specified"}</p>
                </div>
              </div>
            )}
            {educator.country && (
              <div className="flex items-center gap-3">
                <GlobeIcon className="size-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{educator.country || "Not specified"}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <CalendarIcon className="size-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-600">{formatJoinDate(educator.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-4">Professional Information</h4>
          {educator.company && (
            <div className="flex items-center gap-3">
              <BuildingLibraryIcon className="size-4 text-gray-400" />
              <div>
                <h4 className="text-xs font-medium text-gray-900">Organization</h4>
                <p className="text-sm text-gray-600">{educator.company || "Not specified"}</p>
              </div>
            </div>
          )}
          {educator.specializations && (
            <div className="flex items-center gap-3">
              <StarFilledIcon className="size-4 text-gray-400" />
              <div>
                <h4 className="text-xs font-medium text-gray-900">Specializations</h4>
                <p className="text-sm text-gray-600">{educator.specializations || "Not specified"}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}