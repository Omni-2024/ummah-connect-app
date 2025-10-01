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

export default function ServiceContent({ service, educator, providerId }: ServiceContentProps) {
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
    if (providerId) {
      setUserId(providerId);
    }
  };

  return (
    <div className="space-y-4  pb-6 !mt-8">
      {/* Course Description - Mobile Optimized */}
      <Card className="p-0 sm:p-0 !border-0 bg-transparent">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          About this Service
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          {service.description}
        </p>
      </Card>

      {/* Why Me Section - Mobile Optimized */}
      {service.whyMe && service.whyMe.length > 0 && (
        <Card className="p-0 !border-0 bg-transparent mt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Why Me?
          </h2>
          <div className="space-y-3">
            {service.whyMe.map((point: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="size-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-xs font-medium">
                    ✓
                  </span>
                </div>
                <span className="text-gray-700 text-sm sm:text-base flex-1">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Service Provider - Mobile First Design */}
      {educator && (
        <Card id="provider-section" className=" sm:p-0 scroll-mt-24 !border-0 bg-transparent !mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            About the Service Provider
          </h2>

          {/* Mobile-First Layout */}
          <div className="space-y-4">
            {/* Top Row - Profile Info */}
            <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-medium text-base sm:text-lg">
                    {getInitials(educator.name)}
                  </span>
                </div>
              </div>

              {/* Name and Basic Info */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={handleViewProfile}
                  className="text-left hover:text-green-600 transition-colors duration-200 w-full"
                >
                  <h3 className="font-semibold text-gray-900 hover:underline text-base sm:text-lg leading-tight">
                    {educator.name}
                  </h3>
                </button>

                {/* Location */}
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                  <GlobeIcon className="w-4 h-4" />
                  <span>{educator.country}</span>
                </div>

                <div className="flex items-center gap-1 min-w-0 mt-1">
                <StarFilledIcon className="size-4 text-yellow-500 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm">
                  {service.averageReviewScore}
                </span>
                <span className="text-gray-600 text-sm truncate">
                  ({service.totalReviewCount} reviews)
                </span>
              </div>
              </div>
            </div>              

              {/* Contact Button - Prominent on Mobile */}
              <Button
                onClick={handleChat}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium"
                variant="secondary"
              >
                Contact Me
              </Button>
            </div>

            {/* Bio - Full Width on Mobile */}
            {educator.bio && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-2">
                  {educator.bio}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Mobile Sticky Contact Button (Optional - Uncomment if needed) */}
      {/*
      <div className="fixed bottom-4 left-4 right-4 sm:hidden">
        <Button
          onClick={handleChat}
          className="w-full py-3 text-base font-medium shadow-lg"
          variant="primary"
        >
          Contact Provider
        </Button>
      </div>
      */}
    </div>
  );
}