import React, { useState } from "react";
import { Card } from "@/components/base/Card";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number; // Added order field to interface
}

interface ServiceFAQProps {
  faqs?: FAQItem[];
}

export default function ServiceFAQ({ faqs }: ServiceFAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Sort FAQs by order field before displaying
  const faqData = faqs ? [...faqs].sort((a, b) => a.order - b.order) : [];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (!faqData || faqData.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-3">
        {faqData.map((faq, index) => {
          const isExpanded = expandedItems.has(faq.id);
          const isLast = index === faqData.length - 1;
          
          return (
            <div key={faq.id} className={`${!isLast ? 'border-b border-gray-100 pb-3' : ''}`}>
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 rounded-md p-2 -m-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-gray-900 text-sm pr-2">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 transition-transform duration-200 ease-in-out">
                    {isExpanded ? (
                      <ChevronUpIcon className="size-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="size-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="mt-3 pl-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}