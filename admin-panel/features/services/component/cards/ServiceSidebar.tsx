import React from "react";
import { Card } from "@/components/base/card";
import Button from "@/components/base/button";
import {
  BookmarkIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

interface ServiceSidebarProps {
  service: any;
  discountedPrice: number;
  isScrolled?: boolean;
}

export default function ServiceSidebar({
  service,
  discountedPrice,
  isScrolled = false,
}: ServiceSidebarProps) {
  return (
    <div className="hidden lg:block lg:col-span-1 mt-6 lg:mt-0">
      <div className={`sticky top-24 transition-all duration-500 ease-out ${
        isScrolled ? 'mt-8' : 'mt-0'
      }`}>
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
            className="w-full mb-4"
            size="lg"
          >
            Enroll Now
          </Button>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              className="flex-1"
            >
              <BookmarkIcon className="size-4 mr-1" />
               Save
            </Button>
            <Button
              variant="primary"
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