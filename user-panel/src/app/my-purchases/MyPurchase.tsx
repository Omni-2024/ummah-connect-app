"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile";
import Bottombar from "@/features/app/components/Bottombar";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import IconButton from "@/components/base/IconButton";
import { ArrowLeftIcon, CalendarIcon } from "@radix-ui/react-icons";
import { UserRole } from "@/lib/constants";
import withAuth from "@/components/withAuth";
import Footer from "@/features/app/components/Footer";

const purchases = [
  {
    id: "b3294e04-d3fb-4c41-aa29-c4b387f4e80c",
    title: "Ruqyah Shariah – Qur’anic Healing & Spiritual Support",
    purchaseDate: "2025-09-25T13:46:44.080Z",
    price: 50,
    status: "succeeded",
  }
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'succeeded':
      return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
    default:
      return null;
  }
}

const MyPurchasesPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'all' | 'succeeded'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter purchases based on selected tab
  const filteredPurchases = selectedTab === 'all' 
    ? purchases 
    : purchases.filter(purchase => purchase.status === selectedTab);

  const handleBack = () => {
    router.back();
  };

  const handleViewService = (serviceId: string) => {
    router.push(`/service/${serviceId}`);
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

      <div className="container px-4 py-4 lg:px-20 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
          <p className="text-gray-600">Manage your purchased services</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All Services', count: purchases.length },
            { key: 'succeeded', label: 'Completed', count: purchases.filter(p => p.status === 'succeeded').length },
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services found</h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'all' 
                ? "You haven't purchased any services yet." 
                : `No services with "${selectedTab}" status.`}
            </p>
            <Button onClick={() => router.push('/explore')}>
              Explore Services
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPurchases.map((purchase) => (
              <Card 
                key={purchase.id} 
                className="bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200 overflow-hidden hover:lg:shadow-md transition-shadow"
              >
                {/* Status Badge */}
                <div className="relative p-4">
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(purchase.status)}
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                      {purchase.title}
                    </h3>
                  </div>

                  {/* Purchase Info */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      Purchased {formatDate(purchase.purchaseDate)}
                    </div>
                    <div className="font-medium">
                      ${purchase.price}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2">
                    <Button 
                      // onClick={() => handleViewService(purchase.id)}
                      variant="primary"
                      className="flex-1"
                      size="sm"
                    >
                      View Service
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredPurchases.length > 0 && (
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                {purchases.length}
              </div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">
                {purchases.filter(p => p.status === 'succeeded').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        )}
      </div>

      <Bottombar />
      <Footer/>
    </div>
  );
};
export default withAuth(MyPurchasesPage, [UserRole.USER]);