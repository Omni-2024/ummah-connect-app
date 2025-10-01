import React, { JSX, useState } from "react";
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
import { useAppState } from "@/features/app/context/useAppState";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLearningPointsOpen, setIsLearningPointsOpen] = useState(false);
  const { setShowServiceShareModal } = useAppState();

  const handleContactClick = () => {
    setShowContactOptions(!showContactOptions);
  };

  const handleGetQuote = () => {
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

  const toggleLearningPoints = () => {
    setIsLearningPointsOpen(!isLearningPointsOpen);
  };

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="sticky top-24">
        <Card className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl">
          {/* Share and Bookmark Icons */}
          <div className="flex justify-end gap-2 mb-3">
            <button
              onClick={onShare}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Share"
            >
              <Share1Icon className="size-4 text-gray-600 hover:text-gray-900" />
            </button>
            {/* <button
              onClick={onBookmark}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Bookmark"
            >
              <BookmarkIcon
                className={`size-4 ${isBookmarked ? "fill-primary-500 text-primary-500" : "text-gray-600"} hover:text-gray-900`}
              />
            </button> */}
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pr-12 pt-0">Pricing Details</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">${discountedPrice}</span>
              {service.discountEnabled && (
                <span className="text-lg text-gray-400 line-through">${service.price}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">One-time payment</p>
          </div>

          {/* Learning Points Accordion */}
          {service.learningPoints?.length > 0 && (
            <div className="mb-4">
              <button
                onClick={toggleLearningPoints}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>What you'll learn</span>
                <ChevronDownIcon
                  className={`size-4 transition-transform duration-200 ${isLearningPointsOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isLearningPointsOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-2 overflow-hidden"
                  >
                    {service.learningPoints.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="size-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-xs">✓</span>
                        </span>
                        <span className="text-gray-600 text-sm">{point}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Enrollment Button */}
          {enrollmentButton}

          {/* Contact Button with Dropdown */}
          <div className="relative mt-3">
            <Button
              onClick={handleContactClick}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 text-sm"
            >
              <ChatBubbleIcon className="size-4" />
              Contact
              <ChevronDownIcon
                className={`size-4 transition-transform ${showContactOptions ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Contact Options Dropdown */}
            {showContactOptions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleGetQuote}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <FileTextIcon className="size-4 text-gray-600" />
                  Get a Quote
                </button>
                <button
                  onClick={handleChat}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <ChatBubbleIcon className="size-4 text-gray-600" />
                  Ask a Question
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        service={service}
        educator={educator}
        providerId={providerId}
      />
    </div>
  );
}