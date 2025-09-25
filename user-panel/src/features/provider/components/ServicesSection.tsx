import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface ServicesSectionProps {
  services: any;
  servicesLoading: boolean;
  router: ReturnType<typeof useRouter>;
  buildAvatarUrl: (url?: string | null) => string | null; // Updated type
}

export default function ServicesSection({ services, servicesLoading, router, buildAvatarUrl }: ServicesSectionProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilledIcon key={i} className="size-4 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="size-4 text-yellow-500" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="size-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Services</h2>
        <p className="text-gray-600">
          {services && services.data ? services.data.length : 0} Services Available
        </p>
      </div>
      {servicesLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map((index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 flex-shrink-0">
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : services && services.data && services.data.length > 0 ? (
        services.data.map((service: any) => (
          <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-48 flex-shrink-0">
                {service.coverImageUrl ? (
                  <img
                    src={buildAvatarUrl(service.coverImageUrl) || "/images/default-service.png"} // Fallback image
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-4xl">📖</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${service.discountEnabled && service.discount > 0
                        ? (service.price * (1 - service.discount / 100)).toFixed(2)
                        : service.price.toFixed(2)}
                    </p>
                    {service.discountEnabled && service.discount > 0 && (
                      <p className="text-sm text-red-500 line-through">
                        ${service.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{service.tagline}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderStars(parseFloat(service.averageReviewScore) || 0)}
                    <span className="font-semibold">{service.averageReviewScore || "0.0"}</span>
                    <span className="text-gray-500">({service.totalReviewCount} reviews)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => router.push(`/service/${service.slug}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No services available at the moment.</p>
        </Card>
      )}
    </div>
  );
}