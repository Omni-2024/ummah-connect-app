import { Card } from "@/components/base/Card";
import Badge from "@/components/base/Badge";
import Button from "@/components/base/Button";
import { StarFilledIcon, StarIcon, PersonIcon, EnvelopeClosedIcon, GlobeIcon, CalendarIcon } from "@radix-ui/react-icons";
import { BuildingLibraryIcon } from "@heroicons/react/16/solid";
import { Skeleton } from "@/components/base/skeleton";

// ==================== PROVIDER HEADER ====================
interface ProviderHeaderProps {
  educator: any;
  getDesignationDisplay: () => string;
  buildAvatarUrl: (url?: string | null) => string | null;
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
    <Card className="p-4 sm:p-6">
      {/* Mobile-optimized layout */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {educator.profileImage ? (
            <img
              src={buildAvatarUrl(educator.profileImage) || "/images/default-avatar.png"}
              alt={educator.name}
              className="size-24 sm:size-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="size-24 sm:size-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-xl sm:text-2xl font-bold">
                {getInitials(educator.name)}
              </span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{educator.name}</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-3">{getDesignationDisplay()}</p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
            {educator.verified && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-2 py-1 text-xs">
                ✓ Verified
              </Badge>
            )}
            <Badge
              className={`px-2 py-1 text-xs border ${
                educator.active
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {educator.active ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-4">
            <div className="flex items-center gap-1">
              {renderStars(educator?.averageReviewScore || 4.9)}
            </div>
            <span className="font-semibold text-base">{educator.averageReviewScore || "4.9"}</span>
            <span className="text-gray-500 text-sm">(reviews)</span>
          </div>

          {/* Stats - Single row on mobile */}
          <div className="flex justify-center sm:justify-start gap-6 sm:gap-8">
            <div>
              <p className="font-bold text-lg sm:text-xl text-gray-900">{educator.totalServices || "0"}</p>
              <p className="text-xs sm:text-sm text-gray-500">Services</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

