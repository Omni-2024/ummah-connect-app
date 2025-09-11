"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile";
import Bottombar from "@/features/app/components/Bottombar";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import IconButton from "@/components/base/IconButton";
import { ArrowLeftIcon, StarFilledIcon, ClockIcon, PlayIcon, DownloadIcon, CalendarIcon } from "@radix-ui/react-icons";
import { UserRole } from "@/lib/constants";
import withAuth from "@/components/withAuth";

const mockPurchases = [
  {
    id: "1",
    title: "Advanced Cardiac Surgery Techniques",
    tagline: "Master minimally invasive cardiac procedures",
    coverImageUrl: "/images/coverImage.png",
    purchaseDate: "2024-08-15",
    price: 299.99,
    discountedPrice: 239.99,
    progress: 65,
    duration: 480, // minutes
    cmePoints: 12,
    status: "in_progress", // completed, not_started, in_progress
    certificateAvailable: false,
    averageReviewScore: 4.8,
    instructor: "Dr. Sarah Johnson"
  },
  {
    id: "2",
    title: "Emergency Medicine Protocols",
    tagline: "Critical care decision making",
    coverImageUrl: "/images/coverImage.png",
    purchaseDate: "2024-07-22",
    price: 199.99,
    discountedPrice: 199.99,
    progress: 100,
    duration: 360,
    cmePoints: 8,
    status: "completed",
    certificateAvailable: true,
    averageReviewScore: 4.9,
    instructor: "Dr. Michael Chen"
  },
  {
    id: "3",
    title: "Pediatric Radiology Essentials",
    tagline: "Imaging interpretation for children",
    coverImageUrl: "/images/coverImage.png",
    purchaseDate: "2024-09-01",
    price: 249.99,
    discountedPrice: 199.99,
    progress: 0,
    duration: 420,
    cmePoints: 10,
    status: "not_started",
    certificateAvailable: false,
    averageReviewScore: 4.7,
    instructor: "Dr. Lisa Rodriguez"
  }
];

function formatReadableHours(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
  if (hrs > 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${mins} min`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>;
    case 'not_started':
      return <Badge className="bg-gray-100 text-gray-800 text-xs">Not Started</Badge>;
    default:
      return null;
  }
}

const MyPurchasesPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter purchases based on selected tab
  const filteredPurchases = selectedTab === 'all' 
    ? mockPurchases 
    : mockPurchases.filter(purchase => purchase.status === selectedTab);

  const handleBack = () => {
    router.back();
  };

  const handleContinueCourse = (courseId: string) => {
    router.push(`/course/${courseId}/learn`);
  };

  const handleStartCourse = (courseId: string) => {
    router.push(`/course/${courseId}/learn`);
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/service/${courseId}`);
  };

  const handleDownloadCertificate = (courseId: string) => {
    console.log("Downloading certificate for course:", courseId);
    // Implement certificate download logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="My Purchases" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
        <Bottombar />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white ">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="My Purchases" size="md" />
          </div>
        }
      />

      <div className="container px-4  py-4 lg:px-20 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
          <p className="text-gray-600">Manage your purchased courses and track your progress</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All Courses', count: mockPurchases.length },
            { key: 'in_progress', label: 'In Progress', count: mockPurchases.filter(p => p.status === 'in_progress').length },
            { key: 'completed', label: 'Completed', count: mockPurchases.filter(p => p.status === 'completed').length },
            { key: 'not_started', label: 'Not Started', count: mockPurchases.filter(p => p.status === 'not_started').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Purchases Grid */}
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <PlayIcon className="size-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'all' 
                ? "You haven't purchased any courses yet." 
                : `No courses with "${selectedTab.replace('_', ' ')}" status.`}
            </p>
            <Button onClick={() => router.push('/explore')}>
              Explore Courses
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPurchases.map((purchase) => (
              <Card 
                key={purchase.id} 
                className="bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200 overflow-hidden hover:lg:shadow-md transition-shadow"
              >
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                  <img
                    alt="course cover"
                    src={purchase.coverImageUrl ? buildAvatarUrl(purchase.coverImageUrl)!! : "/images/coverImage.png"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(purchase.status)}
                  </div>

                  {/* Progress for in-progress courses */}
                  {purchase.status === 'in_progress' && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                            <div 
                              className="bg-white rounded-full h-1.5 transition-all"
                              style={{ width: `${purchase.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{purchase.progress}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate Available Badge */}
                  {purchase.certificateAvailable && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white text-xs">
                        Certificate Ready
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                      {purchase.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {purchase.tagline}
                    </p>
                  </div>

                  <div className="mb-3 text-sm text-gray-600">
                    <p className="font-medium">Instructor: {purchase.instructor}</p>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {formatReadableHours(purchase.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <StarFilledIcon className="size-3" />
                      {purchase.cmePoints} CME
                    </div>
                    <div className="flex items-center gap-1">
                      <StarFilledIcon className="size-3 text-yellow-500" />
                      {purchase.averageReviewScore}
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      Purchased {formatDate(purchase.purchaseDate)}
                    </div>
                    <div className="font-medium">
                      ${purchase.discountedPrice}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {purchase.status === 'not_started' && (
                      <Button 
                        onClick={() => handleStartCourse(purchase.id)}
                        className="flex-1"
                        size="sm"
                      >
                        Start Course
                      </Button>
                    )}
                    
                    {purchase.status === 'in_progress' && (
                      <Button 
                        onClick={() => handleContinueCourse(purchase.id)}
                        className="flex-1"
                        size="sm"
                      >
                        Continue
                      </Button>
                    )}
                    
                    {purchase.status === 'completed' && !purchase.certificateAvailable && (
                      <Button 
                        onClick={() => handleViewCourse(purchase.id)}
                        variant="primary"
                        className="flex-1"
                        size="sm"
                      >
                        Review Course
                      </Button>
                    )}

                    {purchase.status === 'completed' && purchase.certificateAvailable && (
                      <>
                        <Button 
                          onClick={() => handleViewCourse(purchase.id)}
                          variant="primary"
                          className="flex-1"
                          size="sm"
                        >
                          Review Course
                        </Button>
                        <Button 
                          onClick={() => handleDownloadCertificate(purchase.id)}
                          className="px-3"
                          size="sm"
                        >
                          <DownloadIcon className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredPurchases.length > 0 && (
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                {mockPurchases.length}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                {mockPurchases.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                {mockPurchases.reduce((sum, p) => sum + p.cmePoints, 0)}
              </div>
              <div className="text-sm text-gray-600">CME Points</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                {mockPurchases.filter(p => p.certificateAvailable).length}
              </div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>
        )}
      </div>

      <Bottombar />
    </div>
  );
};
export default withAuth(MyPurchasesPage, [UserRole.USER]);