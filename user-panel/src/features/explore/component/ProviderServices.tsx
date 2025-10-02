"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ServiceCard from "@/features/app/components/ServiceCard";
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard";
import { useServices } from "@/lib/hooks/useServices";
import { GetAllServiceParams } from "@/types";
import Button from "@/components/base/Button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { buildAvatarUrl } from "@/features/app/components/Navbar";

interface ProviderServicesProps {
  providerId: string;
  currentServiceId: string;
  providerName: string;
  providerAvatar?: string;
}

const ProviderServices: React.FC<ProviderServicesProps> = ({
  providerId,
  currentServiceId,
  providerName,
  providerAvatar,
}) => {
  const router = useRouter();
  
  const serviceParams = {
    limit: 100, // Fetch more to ensure we get enough from this provider
    offset: 0,
  } as GetAllServiceParams;

  const { data: services, isLoading } = useServices(serviceParams);

  // Filter by provider, exclude current service, and filter published/non-archived services
  const otherServices = services?.data?.filter(
    (service) =>
      service.providerId === providerId &&
      service.id !== currentServiceId &&
      service.isPublished &&
      !service.isArchived
  ) || [];

  // Don't render if no other services
  if (!isLoading && otherServices.length === 0) {
    return null;
  }

  const handleViewAllServices = () => {
    router.push(`/explore?providerId=${providerId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonServicesCard key={i} size="sm" />
          ))}
        </div>
      </div>
    );
  }

  const displayServices = otherServices.slice(0, 3);
  const hasMoreServices = otherServices.length > 3;

  return (
    <div className="bg-white rounded-lg p-4 lg:p-6 lg:pl-0">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            More from Service Provider
          </h2>
          {hasMoreServices && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleViewAllServices}
              className="hidden lg:flex items-center gap-1 text-primary-600 hover:text-primary-700"
            >
              View All
              <ArrowRightIcon className="size-4" />
            </Button>
          )}
        </div>
        {/* <p className="text-sm text-gray-600">
          {otherServices.length} {otherServices.length === 1 ? 'service' : 'services'} available
        </p> */}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayServices.map((service) => (
          <ServiceCard 
            key={service.id} 
            size="sm" 
            service={service}
            className="h-auto"
          />
        ))}
      </div>

      {hasMoreServices && (
        <div className="mt-6 flex justify-center lg:hidden">
          <Button
            variant="primary"
            onClick={handleViewAllServices}
            className="w-full sm:w-auto"
          >
            View All Services
            <ArrowRightIcon className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProviderServices;