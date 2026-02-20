"use client"
import React, {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import Logo from "./Logo"; // Import the Logo component
import { NAV_LOGO_SRC } from "@/lib/constants";
import {useProviderChatState} from "@/features/provider/context/useProviderChatState";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { setIsOneChat } = useProviderChatState();

  useEffect(() => {
    if (pathname?.startsWith("/service/") || pathname?.startsWith("/provider/")) {
      setIsOneChat(true);
    } else {
      setIsOneChat(false);
    }
  }, [pathname, setIsOneChat]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 lg:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <img
                    alt="Ummah Logo"
                    src={NAV_LOGO_SRC}
                    className="max-h-12 min-w-20 cursor-pointer object-contain"
                />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Empowering the Muslim community through quality education and professional development opportunities.
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-1">Serving with excellence</p>
              <p>Building knowledge, strengthening faith</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/explore')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Browse Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/start-selling')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Become a Seller
                </button>
              </li>
              {/* <li>
                <button 
                  onClick={() => handleNavigation('/certifications')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Certifications
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/community')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Community
                </button>
              </li> */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/help-center')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact-us')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/faq')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/feedback')}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Send Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy-policy"
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/guidelines"
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund-policy"
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-700">
              <p>© {currentYear} Ummah Community. All rights reserved.</p>
              <p className="mt-1">Built with dedication for our community</p>
            </div>

            {/* Social Links - Optional, can be removed if not needed */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleExternalLink('mailto:info@ummahconnect.online')}
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                info@ummahconnect.online
              </button>
            </div>
          </div>
        </div>

        {/* Islamic Touch - Optional inspirational text */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-600 italic">
            "And whoever seeks knowledge, Allah makes easy for him the path to Paradise"
          </p>
        </div>
      </div>
    </footer>
  );
}