import React from "react";
import { Card } from "@/components/base/card";

interface ServiceContentProps {
  service: any;
}

export default function ServiceContent({ service }: ServiceContentProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <Card className="p-6 pt-0 bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          About this Service
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {service.description}
        </p>
      </Card>

      {/* Learning Points */}
      {service.learningPoints && service.learningPoints.length > 0 && (
        <Card className="lg:p-6 p-6 pt-0 bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What You'll Learn
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {service.learningPoints.map((point: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-50"
              >
                <div className="size-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">
                    ✓
                  </span>
                </div>
                <span className="text-gray-700 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}