import React, {JSX, useState} from "react";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import {
  BookmarkIcon,
  Share1Icon,
  ChevronDownIcon,
  ChatBubbleIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { useChat } from "@/components/getStream/chat/ChatContextProvider";
import QuoteRequestModal from "./QuoteRequestModal";
import {useAppState} from "@/features/app/context/useAppState"; // Import the new component

interface ServiceSidebarProps {
  service: any;
  discountedPrice: number;
  isBookmarked: boolean;
  enrollmentButton: JSX.Element;
  onBookmark: () => void;
  onShare: () => void;
  onContact: () => void;
  formatReadableHours: (minutes: number) => string;
  isScrolled?: boolean;
  providerId?: string;
  educator: any;
}

export default function ServiceSidebar({
  service,
  discountedPrice,
  isBookmarked,
  educator,
  enrollmentButton,
  onBookmark,
  onShare,
  onContact,
  formatReadableHours,
  isScrolled = false,
  providerId,
}: ServiceSidebarProps) {
  const { setUserId } = useChat();
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const {setServiceId,setShowServiceShareModal}=useAppState()

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

  const handleShareService = () => {
    setShowServiceShareModal(true)
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <div
          className={`sticky top-24  mt-auto transition-all duration-500 ease-out`}
        >
          <Card className="p-4 lg:p-6 bg-white shadow-sm lg:shadow-lg border border-gray-200 relative overflow-visible">
            {/* Share Icon in Top Right Corner */}
            <button
              onClick={handleShareService}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
              title="Share"
            >
              <Share1Icon className="size-5 text-gray-600 group-hover:text-gray-900" />
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pr-12">
              Pricing Details
            </h2>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice}
                </span>
                {service.discountEnabled && (
                  <span className="text-lg text-gray-400 line-through">
                    ${service.price}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">One-time payment</p>
            </div>

            {service.learningPoints && service.learningPoints.length > 0 && (
                <Card className="p-0 mb-4 border-0 ">
                  <h2 className="text-lg font-semibold text-dark-450  mb-4">
                    Learning points
                  </h2>
                  <div className="space-y-3">
                    {service.learningPoints.map((point: string, index: number) => (
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

            {/* Enrollment Button */}
            {/*<Button onClick={onEnroll} className="w-full mb-4">*/}
            {/*  Enroll Now*/}
            {/*</Button>*/}
            {enrollmentButton}


            {/* Contact Button with Dropdown */}
            <div className="relative z-20 mt-4">
              <Button
                onClick={handleContactClick}
                variant="secondary"
                className="w-full"
              >
                <ChatBubbleIcon  className="size-4" />
                Contact Me
                <ChevronDownIcon 
                  className={`size-4 transition-transform ${
                    showContactOptions ? 'rotate-180' : ''
                  }`} 
                />
              </Button>

              {/* Contact Options Dropdown */}
              {showContactOptions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 min-w-full">
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
          </Card>
        </div>
      </div>

     

      {/* Quote Request Modal - Works for both desktop and mobile */}
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