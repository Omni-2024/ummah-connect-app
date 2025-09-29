import React, { useState } from "react";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import {
  StarFilledIcon,
  ClockIcon,
  ChevronDownIcon,
  ChatBubbleIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import StudentCountLabel from "@/components/widgets/StudentCountLabel";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import { useChat } from "@/components/getStream/chat/ChatContextProvider";
import QuoteRequestModal from "./QuoteRequestModal";

interface ServiceHeaderProps {
  service: any;
  educator: any;
  discountedPrice: number;
  onEnroll: () => void;
  onContact: () => void;
  formatReadableHours: (minutes: number) => string;
  providerId?: string;
}

export const getInitials = (name: string) => {
  return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
};

export default function ServiceHeader({
  service,
  educator,
  discountedPrice,
  onEnroll,
  onContact,
  formatReadableHours,
  providerId,
}: ServiceHeaderProps) {
  const { setUserId } = useChat();
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const handleContactClick = () => {
    setShowContactOptions(!showContactOptions);
  };

  const handleGetQuote = () => {
    console.log("Get a Quote button clicked");
    setShowContactOptions(false);
    setShowQuoteModal(true);
  };

  const handleChat = () => {
    setShowContactOptions(false);
    if (providerId) {
      setUserId(providerId);
    }
    onContact();
  };

  return (
    <>
      {/* Title and Quick Info Card - Moved before image */}
      <Card className="p-4 lg:p-6 pt-0 bg-white shadow-none border-none mb-4 pb-2 lg:pl-0">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {service.title}
            </h1>
            <p className="text-base text-gray-600 mb-4">
              {service.tagline}
            </p>
            
            {/* Educator Info Section */}
            <div className="flex-1 min-w-0">
                <button
                  onClick={() => {
                    document
                      .getElementById("provider-section")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="text-left hover:text-primary-500 transition-colors duration-200 block mb-1"
                >
                  <h3 className="font-semibold text-gray-900 text-lg hover:underline transition-colors duration-200 truncate">
                    {educator.name}
                  </h3>
                </button>
                
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="size-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      {service.averageReviewScore}
                    </span>
                    <span className="text-gray-600">
                      ({service.totalReviewCount} reviews)
                    </span>
                  </div>
                  <StudentCountLabel
                    count={Number(service.enrollmentCount)}
                  />
                </div>

                {/* Mobile pricing - visible only on mobile */}
                <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {service.discountEnabled && (
                      <span className="text-sm text-gray-400 line-through">
                        ${service.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="relative flex-shrink-0">
                  <Button
                    onClick={handleContactClick}
                    variant="secondary"
                    size="lg"
                    className="px-4"
                  >
                    <ChatBubbleIcon  className="size-4 mr-2" />
                    Contact
                    <ChevronDownIcon 
                      className={`size-4 ml-2 transition-transform ${
                        showContactOptions ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>

                  {showContactOptions && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px]">
                      <button
                        onClick={handleGetQuote}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 transition-colors duration-200"
                      >
                        <FileTextIcon className="size-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Get a Quote</span>
                      </button>
                      <button
                        onClick={handleChat}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200"
                      >
                        <ChatBubbleIcon className="size-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Ask a Question</span>
                      </button>
                    </div>
                  )}
                </div>
                </div>
              </div>
          </div>

          {/* Mobile pricing and action buttons - visible only on mobile */}



        </div>
      </Card>

      {/* Compact Hero Section - Moved after title */}
      <div className="relative mb-6">
        <div className="relative h-48 lg:h-96 lg:rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
          <img
            alt="service cover"
            src={
              service.coverImageUrl
                ? buildAvatarUrl(service.coverImageUrl)!!
                : "/images/coverImage.png"
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {service.discountEnabled && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white font-semibold px-3 py-1">
                {service.discount}% OFF
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="lg:hidden mt-4">

  </div>


      <QuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        service={service}
        educator={educator}
        providerId={providerId}
      />
    </>
  );
}