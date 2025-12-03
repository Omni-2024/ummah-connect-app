"use client";

import { Card } from "@/components/base/card";
import { Shield } from "lucide-react";
import { OnboardButton } from "./onboardButton";

export function OnboardingPopup() {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-[95%] max-w-md p-8 border rounded-xl hover:shadow-sm transition-all duration-200 border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white rounded-2xl animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary-700" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground">
            Complete Your Onboarding
          </h2>

          <p className="text-muted-foreground">
            To start receiving payments and offering services, you must complete the onboarding process.
          </p>

          <div className="pt-4">
            <OnboardButton />
          </div>
        </div>
      </Card>
    </div>
  );
}
