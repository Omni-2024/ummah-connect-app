"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGeneralUser } from "@/lib/hooks/useUser";
import { useProfession } from "@/lib/hooks/useProfessions";
import { useSpecialists } from "@/lib/hooks/useSpecialists";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile";
import Bottombar from "@/features/app/components/Bottombar";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import IconButton from "@/components/base/IconButton";
import {
  ArrowLeftIcon,
  StarFilledIcon,
  StarIcon,
  GlobeIcon,
  CheckCircledIcon,
  EnvelopeClosedIcon,
  MobileIcon,
  CalendarIcon,
  Share1Icon,
  PersonIcon,
  BookmarkFilledIcon,
  BookmarkIcon,

} from "@radix-ui/react-icons";
import { BuildingLibraryIcon } from "@heroicons/react/16/solid";
import {useChat} from "@/components/getStream/chat/ChatContextProvider";

// Enhanced Loading skeleton component
function ProviderProfileSkeleton() {
  return (
    <div className="container px-4 py-6 lg:px-20 lg:py-10 max-w-7xl">
      <div className="animate-pulse space-y-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex gap-6">
                <div className="size-32 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProviderProfilePageProps {
  providerId: string;
}

export default function ProviderProfilePage({ providerId }: ProviderProfilePageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: educator, isLoading, error } = useGeneralUser(providerId);
  const { data: designationData } = useProfession(educator?.designations?.[0] || "");
  const { data: specialistsData } = useSpecialists(educator?.designations?.[0] || "");
  const { setUserId } = useChat();

  const handleBack = () => {
    router.back();
  };

  const handleContact = () => {
    setUserId(providerId)
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${educator?.name} - Islamic Service Provider`,
        text: `Check out ${educator?.name}'s profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
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

  // Replace the existing getDesignationDisplay function
const getDesignationDisplay = () => {
  if (designationData?.name) {
    return designationData.name;
  }
  return educator?.designations?.[0] || "Service Provider";
};

// Replace the existing getInterestsDisplay function  
const getInterestsDisplay = () => {
  if (!educator?.interests || educator.interests.length === 0) {
    return [];
  }
  
  if (specialistsData) {
    // Map interest IDs to their names from specialistsData
    return educator.interests
      .map(interestId => {
        const specialist = specialistsData.find(s => s.id === interestId);
        return specialist ? { id: interestId, name: specialist.name } : null;
      })
      .filter(item => item !== null);
  }
  
  return educator.interests.map(id => ({ id, name: id }));
};
  // Helper function to clean and display languages
  const getCleanedLanguages = (languages: string[]) => {
    if (!languages || languages.length === 0) {
      return [];
    }
    return languages.map(lang => lang.trim()).filter(lang => lang.length > 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Loading..." size="md" />
            </div>
          }
        />
        <ProviderProfileSkeleton />
        <Bottombar />
      </div>
    );
  }

  if (error || !educator) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Error" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Service Provider Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The service provider you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/explore")}>
              Browse Services
            </Button>
          </div>
        </div>
        <Bottombar />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
    { id: "portfolio", label: "Portfolio" },
  ];

  // Sample data for demonstration
  const sampleServices = [
    {
      id: 1,
      title: "Quran Recitation & Tajweed Classes",
      description: "I will teach you proper Quran recitation with Tajweed rules. Perfect for beginners and intermediate learners.",
      price: "$25",
      duration: "1 hour",
      rating: 4.9,
      reviews: 156,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Islamic Calligraphy Design",
      description: "Beautiful Arabic calligraphy for your home, mosque, or business. Custom designs available.",
      price: "$45",
      duration: "3-5 days",
      rating: 4.8,
      reviews: 89,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Wedding Nikah Ceremony Planning",
      description: "Complete Islamic wedding ceremony planning according to Sunnah traditions.",
      price: "$200",
      duration: "Full service",
      rating: 5.0,
      reviews: 34,
      image: "/api/placeholder/300/200"
    }
  ];

  const sampleReviews = [
    {
      id: 1,
      name: "Ahmed Hassan",
      rating: 5,
      date: "2 weeks ago",
      country: "UAE",
      comment: "Excellent service! Brother Maurizio helped me learn Tajweed perfectly. His patience and knowledge are remarkable. Highly recommended for anyone wanting to improve their Quran recitation."
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      rating: 5,
      date: "1 month ago",
      country: "Saudi Arabia",
      comment: "Beautiful calligraphy work for our mosque. The attention to detail and Islamic authenticity was perfect. Will definitely work with him again."
    },
    {
      id: 3,
      name: "Muhammad Ali",
      rating: 4,
      date: "2 months ago",
      country: "Pakistan",
      comment: "Great experience overall. Very professional and knowledgeable about Islamic practices. The wedding planning service exceeded our expectations."
    }
  ];

  // Clean up the data for display
  const cleanedLanguages = getCleanedLanguages(educator.languages);

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="Service Provider" size="md" />
          </div>
        }
        right={
          <IconButton onClick={handleShare}>
            <Share1Icon className="size-5" />
          </IconButton>
        }
      />

      <div className="container px-4 py-6 lg:px-20 lg:py-10 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Profile Image */}
                <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                  {educator.profileImage ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${educator.profileImage}`}
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
                  {educator.verified && (
                    <div className="absolute -bottom-1 -right-1 size-8 bg-green-500 rounded-full flex items-center justify-center border-3 border-white">
                      <CheckCircledIcon className="size-5 text-white" />
                    </div>
                  )}
                  <div className="absolute -top-1 -left-1 size-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-800">★</span>
                  </div>
                </div>

                {/* Provider Info */}
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
                      {/* className="bg-green-100 text-green-700 border-green-200 px-3 py-1 */}
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

                    {/* Rating & Stats */}
                    <div className="flex items-center gap-4 justify-center sm:justify-start mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(educator.averageScore || 4.9)}
                        <span className="font-semibold text-lg ml-1">{educator.averageScore || "4.9"}</span>
                        <span className="text-gray-500">(reviews)</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
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

            {/* Tabs */}
            <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm p-1 mb-6">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-green-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* About Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <PersonIcon className="size-5 text-green-600" />
                    About Me
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {educator.bio || "No biography provided yet."}
                    </p>
                  </div>
                </Card>

                {/* Skills & Expertise */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Skills & Expertise</h2>
                  {getInterestsDisplay().length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {getInterestsDisplay().map((interest) => (
                        <div
                          key={interest.id}
                          className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                        >
                          <span className="text-green-700 font-medium text-sm">
                            {interest.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No specializations listed yet.
                    </p>
                  )}
                </Card>

                {/* Languages */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Languages</h2>
                  {cleanedLanguages.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {cleanedLanguages.map((language, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                          <p className="font-semibold text-gray-900">{language}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No languages specified.
                    </p>
                  )}
                </Card>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Services</h2>
                  <p className="text-gray-600">{sampleServices.length} Services Available</p>
                </div>
                
                {sampleServices.map((service) => (
                  <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-48 flex-shrink-0">
                        <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-4xl">📖</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">Starting at {service.price}</p>
                            <p className="text-sm text-gray-500">{service.duration}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{service.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {renderStars(service.rating)}
                            <span className="font-semibold">{service.rating}</span>
                            <span className="text-gray-500">({service.reviews} reviews)</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="primary">
                              View Details
                            </Button>
                            <Button size="sm">
                              Order Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Review Summary */}
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-green-600 mb-2">4.9</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(4.9)}
                      </div>
                      <p className="text-gray-600">156 reviews</p>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold mb-4">Rating Breakdown</h3>
                      {[
                        { stars: 5, count: 142, percentage: 91 },
                        { stars: 4, count: 12, percentage: 8 },
                        { stars: 3, count: 2, percentage: 1 },
                        { stars: 2, count: 0, percentage: 0 },
                        { stars: 1, count: 0, percentage: 0 }
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium w-8">{item.stars} ★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{item.count}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center md:text-right">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-lg font-bold text-green-600">5★</div>
                          <div className="text-gray-600">Communication</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">5★</div>
                          <div className="text-gray-600">Service Quality</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">5★</div>
                          <div className="text-gray-600">Delivery</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {sampleReviews.map((review) => (
                    <Card key={review.id} className="p-6">
                      <div className="flex gap-4">
                        <div className="size-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <p className="text-sm text-gray-500">{review.country} • {review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Portfolio & Past Work</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <Card key={item} className="overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center">
                        <span className="text-4xl">🎨</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">Islamic Calligraphy Project {item}</h3>
                        <p className="text-gray-600 text-sm">Beautiful Arabic calligraphy work for mosque decoration</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Contact & Quick Actions Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Contact {educator.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-sm text-gray-600">Usually responds within 2 hours</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
                  onClick={handleContact}
                >
                  <EnvelopeClosedIcon className="size-4 mr-2" />
                  Contact Me
                </Button>
                <Button 
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    {isBookmarked ? <BookmarkFilledIcon className="size-4" /> : <BookmarkIcon className="size-4" />}
                    Save
                  </Button>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  {educator.email && (
                    <div className="flex items-center gap-3">
                      <EnvelopeClosedIcon className="size-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{educator.email || "Not specified"}</p>
                      </div>
                    </div>
                  )}
                  
                  {educator.contactNumber && (
                    <div className="flex items-center gap-3">
                      <MobileIcon className="size-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{educator.contactNumber || "Not specified"}</p>
                      </div>
                    </div>
                  )}
                  
                  {educator.country && (
                    <div className="flex items-center gap-3">
                      <GlobeIcon className="size-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{educator.country || "Not specified"}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">{formatJoinDate(educator.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-4">Professional Information</h4>
                
                {educator.company && (
                  <div className="flex items-center gap-3">
                    <BuildingLibraryIcon className="size-4 text-gray-400" />

                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Organization</h4>
                    <p className="text-sm text-gray-600">{educator.company || "Not specified"}</p>
                  </div>
                  </div>
                )}
                
                {educator.specializations && (
                  <div className="flex items-center gap-3">
                    <StarFilledIcon className="size-4 text-gray-400" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Specializations</h4>
                    <p className="text-sm text-gray-600">{educator.specializations || "Not specified"}kk</p>
                  </div>
                  </div>
                )}
                
              </div>
            </Card>



          </div>
        </div>
      </div>

      <Bottombar />
    </div>
  );
}