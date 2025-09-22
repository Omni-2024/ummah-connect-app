import React, { useState } from "react";
import Button from "@/components/base/Button";
import {
  Cross1Icon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { buildAvatarUrl } from "@/features/app/components/Navbar";

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
  educator: any;
  providerId?: string;
}

interface QuoteData {
  serviceDescription: string;
  budget: string;
  attachedFiles: any[];
}

export default function QuoteRequestModal({
  isOpen,
  onClose,
  service,
  educator,
  providerId,
}: QuoteRequestModalProps) {
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [customDeliveryTime, setCustomDeliveryTime] = useState('');
  const [quoteData, setQuoteData] = useState<QuoteData>({
    serviceDescription: '',
    budget: '',
    attachedFiles: []
  });

  const handleQuoteSubmit = async () => {
    const quoteRequest = {
      serviceDescription: quoteData.serviceDescription,
      deliveryTime: selectedDeliveryTime === 'other' ? customDeliveryTime : selectedDeliveryTime,
      budget: quoteData.budget,
      attachedFiles: quoteData.attachedFiles,
      providerId,
      serviceId: service.id,
    };
    
    try {
      // Replace this with your actual API call to send email to provider
      // await sendQuoteRequest(quoteRequest);
      console.log('Quote Request:', quoteRequest);
      
      // Reset form
      setQuoteData({ serviceDescription: '', budget: '', attachedFiles: [] });
      setSelectedDeliveryTime('');
      setCustomDeliveryTime('');
      onClose();
      
      alert('Quote request submitted successfully!');
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setQuoteData(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index)
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] lg:max-h-[90vh]  overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Request A Quote</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Cross1Icon className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Provider Info */}
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0">
              {educator.profileImage ? (
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={buildAvatarUrl(educator.profileImage) || "/images/coverImage.png"} 
                    alt={educator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {getInitials(educator.name)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {service.providerName || 'Service Provider'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Hi, please provide your request details below and I'll get back to you.
              </p>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Describe the service you're looking to purchase - please be as detailed as possible:
            </label>
            <textarea
              value={quoteData.serviceDescription}
              onChange={(e) => setQuoteData(prev => ({ 
                ...prev, 
                serviceDescription: e.target.value 
              }))}
              placeholder="I'm looking for..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              maxLength={2500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {quoteData.serviceDescription.length}/2500
            </div>
          </div>

          {/* File Attachment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Attach Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <UploadIcon className="size-4 text-gray-600" />
              <span className="text-sm text-gray-600">Choose files</span>
            </label>
            
            {/* Display uploaded files */}
            {quoteData.attachedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {quoteData.attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                      {file.name || 'filename'}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <Cross1Icon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Once you place your order, when would you like your service delivered?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {['24 Hours', '3 Days', '7 Days'].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedDeliveryTime(time)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedDeliveryTime === time
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedDeliveryTime('other')}
              className={`w-full px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                selectedDeliveryTime === 'other'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>Other</span>
            </button>
            
            {selectedDeliveryTime === 'other' && (
              <input
                type="text"
                value={customDeliveryTime}
                onChange={(e) => setCustomDeliveryTime(e.target.value)}
                placeholder="Specify your preferred delivery time"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            )}
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              What is your budget for this service?
            </label>
            <input
              type="text"
              value={quoteData.budget}
              onChange={(e) => setQuoteData(prev => ({ 
                ...prev, 
                budget: e.target.value 
              }))}
              placeholder="Enter your budget"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleQuoteSubmit}
            className="w-full"
            size="lg"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );
}