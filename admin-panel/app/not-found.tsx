'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/base/button';
import { Card } from '@/components/base/card';
import { LockClosedIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

export default function Admin404() {
  const router = useRouter();

  const handleGoLogin = () => {
    router.push('/login'); // 🔁 Redirect to admin login
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-lg w-full">
        <Card className="p-8 bg-white text-center sm:shadow-lg sm:border sm:border-none">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-gray-300 mb-2">404</h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Admin Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The page you’re looking for doesn’t exist or you may not have permission
              to access it. Please check the URL or return to the login page.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoLogin}
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              <LockClosedIcon className="size-4" />
              Back to Login
            </Button>

            <Button
              onClick={handleGoBack}
              variant="secondary"
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              <ArrowLeftIcon className="size-4" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need assistance? Contact the administrator or{' '}
              <button
                onClick={() => router.push('/admin/help')}
                className="text-primary hover:text-primary/80 underline"
              >
                visit support
              </button>
              .
            </p>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Error Code: 404 | Admin Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
}
