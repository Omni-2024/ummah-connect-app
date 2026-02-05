"use client";
import React, { useState } from "react";
import { CheckCircle, Loader2, Search, ChevronDown } from "lucide-react";
import { Send } from "iconsax-react";
import { Card } from "@/components/base/Card";
import { COUNTRY_LIST } from "@/lib/constants";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export const ContactFormSection = ({ formRef }: { formRef: React.RefObject<HTMLDivElement> }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    profession: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  // Country Dropdown State
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = COUNTRY_LIST.filter(
    (country) =>
      country.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.value.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.country || !formData.profession || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        country: formData.country,
        profession: formData.profession,
        message: formData.message,
        to_name: "Admin",
      };

      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: templateParams,
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", country: "", profession: "", message: "" });
        setCountrySearch("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={formRef}
      className="py-10 lg:py-20 bg-white lg:bg-gradient-to-br lg:from-emerald-50 lg:via-white lg:to-teal-50"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Ready to Get Started?
          </div>
          <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 lg:mb-4 px-2">
            Start Your Seller Application
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Fill out the form below and we'll review your application within 24 hours.
            Join our community of successful sellers today.
          </p>
        </div>

        <Card
          className={`
            p-6 lg:p-12
            lg:shadow-lg lg:shadow-xl
            lg:border lg:border-gray-100
            bg-white
          `}
        >
          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-emerald-600 mx-auto mb-2 lg:mb-3" />
              <p className="text-emerald-700 font-semibold text-base lg:text-lg mb-1">
                Application Submitted Successfully!
              </p>
              <p className="text-sm lg:text-base text-emerald-600">
                We'll review your application and get back to you within 24 hours.
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 font-semibold mb-1">Submission Failed</p>
              <p className="text-red-600 text-sm">Please fill all required fields and try again.</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Ahmed Hassan"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="ahmed@example.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>

              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                disabled={isSubmitting}
                className={`
                  w-full px-4 py-3 text-left bg-white 
                  border-2 border-gray-200 rounded-lg 
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                  outline-none transition-all flex items-center justify-between 
                  disabled:opacity-50
                `}
              >
                <span className="flex items-center gap-3">
                  {formData.country ? (
                    <span>{formData.country}</span>
                  ) : (
                    <span className="text-gray-400">Select your country</span>
                  )}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCountryOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCountryOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCountryOpen(false)} />
                  <div
                    className={`
                      absolute z-50 mt-2 w-full 
                      bg-white border-2 border-gray-200 rounded-lg 
                      shadow-2xl max-h-80 overflow-hidden
                    `}
                  >
                    {/* Search Bar */}
                    <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Country List */}
                    <div className="max-h-64 overflow-y-auto">
                      {filteredCountries.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">No country found</div>
                      ) : (
                        filteredCountries.map((country) => (
                          <button
                            key={country.value}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, country: country.label });
                              setIsCountryOpen(false);
                              setCountrySearch("");
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 transition-colors"
                          >
                            <span className="text-gray-800">{country.label}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profession */}
            <div>
              <label htmlFor="profession" className="block text-sm font-semibold text-gray-700 mb-2">
                Profession/Expertise *
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Qur'an Teacher"
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className="lg:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Tell us about yourself *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="Share your skills, experience, portfolio links, and why you want to join Ummah Connect..."
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-2">
                Include links to your work, social media, or previous clients
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 lg:mt-10">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white 
                py-3.5 lg:py-4 rounded-lg font-semibold 
                hover:from-emerald-700 hover:to-teal-700 transition-all 
                disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-3 text-base lg:text-lg
                shadow-md lg:shadow-lg hover:shadow-xl
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                </>
              )}
            </button>
            <p className="text-center text-xs lg:text-sm text-gray-500 mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>

        {/* Trust Badges */}
        <div className="mt-8 lg:mt-12 grid grid-cols-3 gap-4 lg:gap-6 text-center">
          <div className="flex flex-col items-center py-3 lg:py-0">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              24-hour review process
            </span>
          </div>

          <div className="flex flex-col items-center py-3 lg:py-0">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              Free to join
            </span>
          </div>

          <div className="flex flex-col items-center py-3 lg:py-0">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              No hidden fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};