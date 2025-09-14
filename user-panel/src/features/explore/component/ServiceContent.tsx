import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import { 
  StarFilledIcon, 
  PersonIcon, 
  GlobeIcon, 
  CheckCircledIcon,
  ArrowRightIcon
} from "@radix-ui/react-icons";

interface ServiceContentProps {
  service: any;
  educator?: any;
}

export default function ServiceContent({ service, educator }: ServiceContentProps) {
  const router = useRouter();

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

      {/* Learning Points */}
      {service.learningPoints && service.learningPoints.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What You'll Learn
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

            {/* Service Provider - Clean & Minimal */}
      {educator && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            About the Service Provider
          </h2>
          
          <div className="flex gap-4">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              {educator.profileImage ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${educator.profileImage}`}
                  alt={educator.name}
                  className="size-16 rounded-full object-cover"
                />
              ) : (
                <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {getInitials(educator.name)}
                  </span>
                </div>
              )}
              {educator.verified && (
                <CheckCircledIcon className="absolute -bottom-1 -right-1 size-5 text-green-500 bg-white rounded-full" />
              )}
            </div>

            {/* Provider Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {educator.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Service Provider </p>
                  
                  {/* Simple stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {educator.averageScore && (
                      <div className="flex items-center gap-1">
                        <StarFilledIcon className="size-4 text-yellow-500" />
                        <span>{educator.averageScore}</span>
                      </div>
                    )}
                    {educator.totalServices && (
                      <span>{educator.totalServices} courses</span>
                    )}
                    {educator.country && (
                      <div className="flex items-center gap-1">
                        <GlobeIcon className="size-4" />
                        <span>{educator.country}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  // variant="outline" 
                  size="sm"
                  onClick={handleViewProfile}
                  className="ml-4"
                >
                  View Profile
                </Button>
              </div>

              {/* Bio */}
              {educator.bio && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
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