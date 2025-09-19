import React from "react";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import {
  BookmarkIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

interface ServiceSidebarProps {
  service: any;
  discountedPrice: number;
  isBookmarked: boolean;
  onEnroll: () => void;
  onBookmark: () => void;
  onShare: () => void;
  formatReadableHours: (minutes: number) => string;
  isScrolled?: boolean;
}

export default function ServiceSidebar({
  service,
  discountedPrice,
  isBookmarked,
  onEnroll,
  onBookmark,
  onShare,
  formatReadableHours,
  isScrolled = false,
}: ServiceSidebarProps) {
  return (
    <div className="hidden lg:block lg:col-span-1 mt-6 lg:mt-0">
      <div className={`sticky top-24 transition-all duration-500 ease-out ${
        isScrolled ? 'mt-8' : 'mt-0'
      }`}>
        <Card className="m-6 p-4 lg:m-0 bg-white lg:shadow-lg border border-gray-200 relative">
          {/* Share Icon in Top Right Corner */}
          <button
            onClick={onShare}
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

          {/* Enrollment Button */}
          <Button
            onClick={onEnroll}
            className="w-full mb-4"
            size="lg"
          >
            Enroll Now
          </Button>
        </Card>
      </div>
    </div>
  );
}