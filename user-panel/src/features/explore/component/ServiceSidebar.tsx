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
}

export default function ServiceSidebar({
  service,
  discountedPrice,
  isBookmarked,
  onEnroll,
  onBookmark,
  onShare,
  formatReadableHours,
}: ServiceSidebarProps) {
  return (
    <div className="hidden lg:block lg:col-span-1 mt-6 lg:mt-0">
      <div className="sticky top-16">
        <Card className="m-6 p-4 lg:m-0 bg-white lg:shadow-lg border border-gray-200">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">
                {formatReadableHours(service.duration)}
              </div>
              <div className="text-xs text-gray-600">Duration</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">
                {service.cmePoints}
              </div>
              <div className="text-xs text-gray-600">CME Points</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={onBookmark}
              className="flex-1"
            >
              <BookmarkIcon className="size-4 mr-1" />
              {isBookmarked ? "Saved" : "Save"}
            </Button>
            <Button
              variant="primary"
              onClick={onShare}
              className="flex-1"
            >
              <Share1Icon className="size-4 mr-1" />
              Share
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}