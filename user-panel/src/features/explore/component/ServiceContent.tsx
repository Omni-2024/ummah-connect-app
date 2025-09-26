import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import { 
  StarFilledIcon, 
  GlobeIcon,
} from "@radix-ui/react-icons";
import { useChat } from "@/components/getStream/chat/ChatContextProvider";


interface ServiceContentProps {
  service: any;
  educator?: any;
  providerId?: string;

}

export default function ServiceContent({ service, educator ,   providerId,
}: ServiceContentProps) {
  const router = useRouter();
  const { setUserId } = useChat();
  

  const handleViewProfile = () => {
    if (educator?.id) {
      router.push(`/provider/${educator.id}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

    const handleChat = () => {
    setShowContactOptions(false);
    if (providerId) {
      setUserId(providerId);
    }
  };

  return (
    <div className="space-y-6">


      {/* Course Description */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          About this Service
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {service.description}
        </p>
      </Card>

      {service.whyMe && service.whyMe.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What Me?
          </h2>
          <div className="space-y-3">
            {service.whyMe.map((point: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <div className="size-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-medium">
                    ✓
                  </span>
                </div>
                <span className="text-gray-700 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

            {/* Service Provider - Clean & Minimal */}
      {educator && (
        <Card id="provider-section"  className="p-6 scroll-mt-24">
{/* <div className="bg-white rounded-lg border border-gray-200 p-4"> */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        About the Service Provider
      </h2>
      
      <div className="flex gap-4">
        {/* Smaller Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {getInitials(educator.name)}
            </span>
          </div>
        </div>

        {/* Condensed Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <button
                onClick={handleViewProfile}
                className="text-left hover:text-green-600 transition-colors duration-200"
              >
                <h3 className="font-semibold text-gray-900 hover:underline truncate">
                  {educator.name}
                </h3>
              </button>
              
              {/* Inline stats - more compact */}
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <GlobeIcon className="w-4 h-4" />
                  <span>{educator.country}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="size-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      {service.averageReviewScore}
                    </span>
                    <span className="text-gray-600">
                      ({service.totalReviewCount} reviews)
                    </span>
                  </div>
                  {/* <StudentCountLabel
                    count={Number(service.enrollmentCount)}
                  /> */}
                </div>
              </div>
            </div>
            
            {/* Contact button moved to top right */}
            <Button
              onClick={handleChat}
              className=""
              variant="secondary"
            >
              Contact Me
            </Button>
          </div>
          
          {/* Bio - single line with truncation */}
          {educator.bio && (
            <p className="text-sm text-gray-600 line-clamp-1">
              {educator.bio}
            </p>
          )}
        </div>
      </div>
        </Card>
      )}
    </div>
  );
}

function setShowContactOptions(arg0: boolean) {
  throw new Error("Function not implemented.");
}
