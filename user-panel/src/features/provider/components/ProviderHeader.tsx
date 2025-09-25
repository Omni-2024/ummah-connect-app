import { Card } from "@/components/base/Card";
import Badge from "@/components/base/Badge";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface ProviderHeaderProps {
  educator: any;
  getDesignationDisplay: () => string;
  buildAvatarUrl: (url?: string | null) => string | null; // Updated type
}

export default function ProviderHeader({ educator, getDesignationDisplay, buildAvatarUrl }: ProviderHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          {educator.profileImage ? (
            <img
              src={buildAvatarUrl(educator.profileImage) || "/images/default-avatar.png"} // Fallback image
              alt={educator.name}
              className="size-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="size-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-2xl font-bold">
                {getInitials(educator.name)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{educator.name}</h1>
            <p className="text-lg text-gray-600 mb-3">{getDesignationDisplay()}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
              {educator.verified && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                  ✓ Verified Provider
                </Badge>
              )}
              <Badge
                className={`px-3 py-1 border 
                  ${educator.active
                    ? 'bg-green-100 text-green-700 border-green-200 px-3 py-1 '
                    : 'bg-red-100 text-red-700 border-red-200 px-3 py-1'
                  }`}
              >
                {educator.active ? 'Online now' : 'Offline'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start mb-4">
              <div className="flex items-center gap-1">
                {renderStars(educator?.averageReviewScore || 4.9)}
                <span className="font-semibold text-lg ml-1">{educator.averageReviewScore || "4.9"}</span>
                <span className="text-gray-500">(reviews)</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="font-bold text-xl text-gray-900">{educator.totalServices || "0"}</p>
                <p className="text-sm text-gray-500">Total Services</p>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">{educator.totalServicesCompleted || "0"}</p>
                <p className="text-sm text-gray-500">Services Completed</p>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">{educator.totalActiveServices || "0"}</p>
                <p className="text-sm text-gray-500">Ongoing Services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}