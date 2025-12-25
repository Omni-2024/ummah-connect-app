"use client"
import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Link from "next/link";
import Footer from "@/features/app/components/Footer";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile from "@/features/app/components/Navbar.mobile";
import NavDrawerMobile from "@/features/app/components/NavDrawer.mobile";
import NotificationsModal from "@/features/app/components/notifications/NotificationsModal.mobile";
import NotLoggedInNavModal from "@/features/app/components/NotLoggedInNavModal.mobile";
import { useAppState } from "@/features/app/context/useAppState";
import { useAuthState } from "@/features/auth/context/useAuthState";
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton";
import Button from "@/components/base/Button";
import { NAV_LOGO_SRC } from "@/lib/constants";

const FAQPage = () => {
  const { isAuthenticated } = useAuthState();
  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleShowNavDrawer = () => {
    setShowNavDrawer(true);
  };

  const faqData = [
    {
      category: "general",
      categoryName: "General",
      icon: "🌟",
      questions: [
        {
          q: "What is UmmahConnect?",
          a: "UmmahConnect is a halal service marketplace that connects the Muslim Ummah with trusted freelancers and professionals. We operate using a secure escrow system via Stripe and ethical, Shariah-compliant principles."
        },
        {
          q: "How does UmmahConnect make money?",
          a: "UmmahConnect uses a success-based fee model:<ul class='list-disc pl-5 mt-2 space-y-2'><li>A 20% platform commission is charged only on successfully completed services</li><li>A 5% service/processing charge covers Stripe payment processing, escrow handling, and operational costs</li></ul><p class='mt-3'>We do not earn any fees if a service fails or is fully refunded.</p>"
        },
        {
          q: "Is UmmahConnect Shariah-compliant?",
          a: "Yes. UmmahConnect:<ul class='list-disc pl-5 mt-2 space-y-2'><li>Uses escrow (trust-based holding of funds)</li><li>Allows only halal and ethical services</li><li>Does not earn fees on failed transactions</li><li>Returns eligible refunds to the original payment method</li><li>Operates with fairness, transparency, and justice</li></ul>"
        }
      ]
    },
    {
      category: "payments",
      categoryName: "Payments & Escrow",
      icon: "💳",
      questions: [
        {
          q: "How does escrow work?",
          a: "When you place an order:<ul class='list-disc pl-5 mt-2 space-y-2'><li>Your payment is securely held in escrow via Stripe.</li><li> Funds are released to the seller only after service delivery.</li><li>If a dispute arises, funds remain protected until resolved.</li></ul>"
        },
        {
          q: "Who holds my money?",
          a: "Payments are securely processed and held by Stripe, a regulated payment provider. UmmahConnect acts solely as a facilitator and does not use or own your funds before delivery."
        },
        {
          q: "When does the seller get paid?",
          a: "The seller receives payment:<ul class='list-disc pl-5 mt-2 space-y-2'><li>After the service is delivered.</li><li>Once the order is marked complete or confirmed.</li></ul>"
        },
        {
          q: "How are fees calculated?",
          a: "Fees are calculated on the total order value and shown clearly before checkout.<p class='mt-3 font-medium'>Example:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Service price: £100</li><li>Platform commission (20%): £20</li><li>Service/processing charge (5%): £5</li><li>Freelancer receives: £75</li></ul>"
        }
      ]
    },
    {
      category: "refunds",
      categoryName: "Refunds & Cancellations",
      icon: "↩️",
      questions: [
        {
          q: "When am I eligible for a refund?",
          a: "You may be eligible if:<ul class='list-disc pl-5 mt-2 space-y-2'><li>The service is not delivered</li><li>The seller cancels or becomes unresponsive</li><li>The service is significantly not as described</li><li>There is a violation of UmmahConnect's guidelines</li></ul>"
        },
        {
          q: "How are refunds issued?",
          a: "Eligible refunds are returned to the original payment method. We do not force refunds into platform credits."
        },
        {
          q: "Are there services that are non-refundable?",
          a: "Yes. Refunds are generally not available for:<ul class='list-disc pl-5 mt-2 space-y-2'><li>Completed consultations or calls</li><li>Services already delivered as described</li><li>Buyer-initiated cancellations after work has started</li></ul>"
        }
      ]
    },
    {
      category: "disputes",
      categoryName: "Disputes & Protection",
      icon: "🛡️",
      questions: [
        {
          q: "What happens if there is a dispute?",
          a: "We encourage both parties to resolve issues amicably. If needed, UmmahConnect will review:<ul class='list-disc pl-5 mt-2 space-y-2'><li>The service description</li><li>Platform messages</li><li>Delivery evidence</li></ul><p class='mt-3'>A fair decision will be made to protect both parties.</p>"
        },
        {
          q: "How long do disputes take to resolve?",
          a: "Most disputes are resolved within a few working days, depending on complexity and responsiveness."
        }
      ]
    },
    {
      category: "transactions",
      categoryName: "Off-Platform Transactions",
      icon: "⚠️",
      questions: [
        {
          q: "Can I pay or be paid outside UmmahConnect?",
          a: "No. All payments must remain on the platform. Transactions conducted outside UmmahConnect:<ul class='list-disc pl-5 mt-2 space-y-2'><li>Are not protected by escrow</li><li>Are not eligible for refunds or dispute resolution</li><li>Are undertaken entirely at the parties' own risk</li></ul><p class='mt-3'>UmmahConnect is not responsible or liable for any outcome of off-platform transactions.</p>"
        },
        {
          q: "What happens if someone asks me to pay outside the platform?",
          a: "You should decline and report the request. Circumventing the platform may result in account suspension or termination."
        }
      ]
    },
    {
      category: "freelancers",
      categoryName: "For Freelancers",
      icon: "💼",
      questions: [
        {
          q: "Can I offer any type of service?",
          a: "Only halal, ethical, and lawful services are permitted. Services involving deception, exploitation, or haram activities are prohibited."
        },
        {
          q: "When do I earn my platform rating?",
          a: "Ratings and reviews may be left once an order is successfully completed."
        }
      ]
    },
    {
      category: "safety",
      categoryName: "Accounts & Safety",
      icon: "🔒",
      questions: [
        {
          q: "Can UmmahConnect suspend accounts?",
          a: "Yes. Accounts may be suspended or removed for:<ul class='list-disc pl-5 mt-2 space-y-2'><li>Scams or fraud</li><li>Repeated guideline violations</li><li>Abuse of refunds or disputes</li><li>Attempting to bypass platform systems</li></ul>"
        },
        {
          q: "Is my personal information safe?",
          a: "Yes. We follow strict data protection and privacy standards. Payment details are securely handled by Stripe."
        }
      ]
    },
    {
      category: "islamic",
      categoryName: "Islamic Ethics",
      icon: "🕌",
      questions: [
        {
          q: "What Islamic principles guide UmmahConnect?",
          a: "We are guided by:<ul class='list-disc pl-5 mt-2 space-y-2'><li>Trust (Amānah)</li><li>Justice (ʿAdl)</li><li>Transparency</li><li>Mutual respect</li></ul><p class='mt-3'>Our goal is benefit (khayr) and fairness for the Ummah.</p>"
        }
      ]
    },
    {
      category: "support",
      categoryName: "Support",
      icon: "💬",
      questions: [
        {
          q: "How can I contact support?",
          a: "You can contact our support team through the Help or Contact page. We aim to respond promptly and fairly."
        },
        {
          q: "I still have a question. What should I do?",
          a: "If your question is not listed here, please reach out to us, We're happy to help!"
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedItems((prev: string[]) =>
      prev.includes(key)
        ? prev.filter((item: string) => item !== key)
        : [...prev, key]
    );
  };

  const filteredFAQs = faqData
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        item =>
          (activeCategory === "all" || category.category === activeCategory) &&
          (searchTerm === "" ||
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }))
    .filter(category => category.questions.length > 0);

  const categories = [
    { id: "all", name: "All Topics", icon: "📋" },
    ...faqData.map(cat => ({ id: cat.category, name: cat.categoryName, icon: cat.icon }))
  ];

  return (
    <>
      <Navbar />
      <NavbarMobile
        className="px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
        left={
          <Link href="/" className="flex items-center">
            <img
              alt="Ummah Logo"
              src={NAV_LOGO_SRC}
              className="h-8 w-auto cursor-pointer object-contain"
            />
          </Link>
        }
        right={
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileMenuButton onClick={handleShowNavDrawer} />
            ) : (
              <>
                <Link href="/start-selling">
                  <Button variant="unstyled" className="text-sm font-medium h-9">
                    Become a Seller
                  </Button>
                </Link>
                <Link href="/user/login">
                  <Button variant="primary" size="sm" className="text-sm font-medium h-9">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        }
      />

      <NotificationsModal disabled />
      <NavDrawerMobile />
      <NotLoggedInNavModal />

      <div className="container max-w-[1120px] px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-2">
          <div>
            <h1 className="font-primary text-[31px] font-bold">Frequently Asked Questions</h1>
          </div>
        </div>

        <p className="mt-4 text-base text-dark-400">
          As-salamu alaykum! Find answers to common questions about UmmahConnect.
        </p>

        {/* Search Bar */}
        {/* <div className="mt-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Category Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary-500 text-white"
                  : "bg-white text-dark-400 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="mt-10 space-y-8">
          {filteredFAQs.map((category, catIndex) => (
            <div key={category.category} className="rounded-lg bg-white border border-gray-200 overflow-hidden">
              <div className="bg-primary-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark-500 flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  {category.categoryName}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isExpanded = expandedItems.includes(key);
                  return (
                    <div key={qIndex}>
                      <button
                        onClick={() => toggleItem(catIndex, qIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-base font-medium text-dark-500 pr-4">
                          {item.q}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-dark-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-dark-400 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-5 pt-2">
                          <div 
                            className="text-base text-dark-400 leading-relaxed prose prose-ul:my-2"
                            dangerouslySetInnerHTML={{ __html: item.a }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-400 text-base">No FAQs found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
              className="mt-4 text-status-blue hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-12 rounded-lg bg-primary-50 p-6">
          <h3 className="text-xl font-semibold text-dark-500 mb-3">Still need help?</h3>
          <p className="text-base text-dark-400 mb-4">
            Can't find the answer you're looking for? Our support team is here to assist you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact-us">
              <Button variant="primary" size="md">
                Contact Support
              </Button>
            </Link>
            <a href="mailto:support@ummahconnect.io">
              <Button variant="primary" size="md">
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQPage;