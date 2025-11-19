import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  Clock,
  Share2,
  Image,
  ChevronRight,
  Star,
  Briefcase,
  Users,
  Building2,
  Store,
  Lightbulb,
  X,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

// --- DUMMY DATA ---
const DUMMY_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80",
  "https://images.unsplash.com/photo-1522204523234-8729aa6e993f?w=600&q=80",
  "https://images.unsplash.com/photo-1547484132-ff45b3765e90?w=600&q=80",
  "https://images.unsplash.com/photo-1507680434567-5738876a3e59?w=600&q=80",
];

const DUMMY_YOUTUBE_ID = "jndWxpCzO5g";
const MOCK_REVIEW_PAGE = "https://example.com/mock-review-page";

const themes = {
  light: {
    bg: "bg-white",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
    accent: "text-blue-600",
    accentBg: "bg-blue-600",
    accentHover: "hover:bg-blue-700",
    accentLightBg: "bg-blue-50",
    // Color fix for dark theme contrast
    starEmpty: "text-gray-300 fill-gray-300/20",
  },
  dark: {
    bg: "bg-gray-900",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-gray-800",
    accent: "text-blue-400",
    accentBg: "bg-blue-600",
    accentHover: "hover:bg-blue-700",
    accentLightBg: "bg-gray-800",
    // Color fix for dark theme contrast
    starEmpty: "text-gray-600 fill-gray-600/30",
  },
  ocean: {
    bg: "bg-cyan-50",
    text: "text-cyan-900",
    textSecondary: "text-cyan-700",
    border: "border-cyan-200",
    accent: "text-cyan-600",
    accentBg: "bg-cyan-600",
    accentHover: "hover:bg-cyan-700",
    accentLightBg: "bg-cyan-100",
    starEmpty: "text-gray-300 fill-gray-300/20",
  },
  sunset: {
    bg: "bg-orange-50",
    text: "text-orange-900",
    textSecondary: "text-orange-700",
    border: "border-orange-200",
    accent: "text-orange-600",
    accentBg: "bg-orange-600",
    accentHover: "hover:bg-orange-700",
    accentLightBg: "bg-orange-100",
    starEmpty: "text-gray-300 fill-gray-300/20",
  },
  forest: {
    bg: "bg-green-50",
    text: "text-green-900",
    textSecondary: "text-green-700",
    border: "border-green-200",
    accent: "text-green-600",
    accentBg: "bg-green-600",
    accentHover: "hover:bg-green-700",
    accentLightBg: "bg-green-100",
    starEmpty: "text-gray-300 fill-gray-300/20",
  },
  lavender: {
    bg: "bg-purple-50",
    text: "text-purple-900",
    textSecondary: "text-purple-700",
    border: "border-purple-200",
    accent: "text-purple-600",
    accentBg: "bg-purple-600",
    accentHover: "hover:bg-purple-700",
    accentLightBg: "bg-purple-100",
    starEmpty: "text-gray-300 fill-gray-300/20",
  },
};

export default function BusinessProfile() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const theme = themes[currentTheme];

  const businessProfile = {
    name: "Synconnect Digital",
    tagline: "Your Partner in Digital Transformation",
    industry: "SaaS & Custom Software Development",
    detailedAbout: `Synconnect Digital is a leading technology consultancy specializing in full-cycle SaaS product development and custom enterprise solutions.\n\nOur mission is to empower businesses, from ambitious startups to established enterprises, with the technology they need to lead their markets.`,
    coverPhoto:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    googleReviewLink: MOCK_REVIEW_PAGE,
    averageRating: 4.8,
    totalReviews: 145,
    website: "https://www.synconnect.com",
    workingHours: "Mon - Fri: 9:00 AM - 5:00 PM (IST)",
    contact: {
      phone: "+91 8089555000",
      email: "support@synconnect.com",
      address: "Bangalore, India",
    },
    socials: [
      { icon: Globe, link: "https://www.synconnect.com", label: "Website" },
      {
        icon: Linkedin,
        link: "https://linkedin.com/synconnect",
        label: "LinkedIn",
      },
      { icon: X, link: "https://x.com/synconnect", label: "X (Twitter)" },
      {
        icon: Facebook,
        link: "https://facebook.com/synconnect",
        label: "Facebook",
      },
      {
        icon: Instagram,
        link: "https://instagram.com/synconnect",
        label: "Instagram",
      },
    ],
  };

  const quickActions = [
    {
      icon: Phone,
      label: "Call Us",
      subtitle: businessProfile.contact.phone,
      link: `tel:${businessProfile.contact.phone}`,
    },
    {
      icon: MessageCircle,
      label: "Message Us",
      subtitle: "24/7 Live Support",
      link: "#",
    },
    {
      icon: Mail,
      label: "Email",
      subtitle: businessProfile.contact.email,
      link: `mailto:${businessProfile.contact.email}`,
    },
    {
      icon: MapPin,
      label: "Location",
      subtitle: businessProfile.contact.address,
      link: "#",
    },
  ];

  const offerings = [
    {
      title: "Custom SaaS Development",
      description:
        "End-to-end development of cloud-native, scalable software products.",
    },
    {
      title: "Digital Strategy",
      description:
        "Data-driven roadmaps to optimize operations and accelerate growth.",
    },
    {
      title: "UI/UX & Branding",
      description:
        "Designing intuitive interfaces that captivate users and convert.",
    },
    {
      title: "Dedicated Team",
      description: "Augment your team with our expert MERN/Cloud developers.",
    },
  ];

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    setHoverRating(0);

    if (rating >= 3) {
      // High Rating: Direct to Public Review
      window.open(businessProfile.googleReviewLink, "_blank");
    } else if (rating > 0 && rating < 3) {
      // Low Rating: Open Private Feedback Modal
      setFeedbackText("");
      setShowFeedbackModal(true);
    }
  };

  const handleModalAction = () => {
    if (userRating > 0 && userRating < 3) {
      if (!feedbackText.trim()) {
        alert("Please provide feedback so we can improve.");
        return;
      }
      alert(`Private Feedback sent! Thank you for your input.`);
      setShowFeedbackModal(false);
      setUserRating(0);
      setFeedbackText("");
    } else {
      setShowFeedbackModal(false);
    }
  };

  // --- Components ---

  const ProfileHeader = () => (
    <div className="relative w-full">
      <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        <img
          src={businessProfile.coverPhoto}
          alt="Business Cover"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 lg:pb-14">
            <div className="animate-fadeIn">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 sm:mb-3 leading-tight">
                {businessProfile.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light max-w-2xl mb-6 sm:mb-8">
                {businessProfile.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StarRating = () => (
    <div className="flex flex-col items-start gap-1">
      <p className={`text-xs sm:text-sm font-medium ${theme.text} opacity-80`}>
        Rate Your Experience:
      </p>
      <div
        className="flex items-center gap-1 sm:gap-2"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => handleRatingClick(star)}
            // Stars are now significantly larger
            className={`w-10 h-10 sm:w-8 sm:h-8 transition-all duration-150 cursor-pointer 
              ${
                hoverRating >= star || (!hoverRating && userRating >= star)
                  ? "text-yellow-500 fill-yellow-500" // Filled star color
                  : theme.starEmpty // Empty star color (fixed for contrast)
              } 
              hover:scale-110 active:scale-90`}
            title={`Rate ${star} star${star > 1 ? "s" : ""}`}
          />
        ))}
      </div>
      {userRating > 0 && (
        <p className={`text-xs ${theme.textSecondary} mt-1 font-semibold`}>
          {userRating >= 3
            ? "Thank you! Please leave a public review."
            : "Thanks! Please leave private feedback."}
        </p>
      )}
    </div>
  );

  const ActionButtons = () => (
    <div
      className={`sticky top-0 z-30 backdrop-blur-xl ${theme.bg}/90 border-b ${theme.border} transition-all duration-300 shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* PRIORITY 1: Sticky Star Rating (Bigger stars) */}
          <StarRating />

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Website button is removed */}

            {/* Share Button (moved slightly) */}
            <button
              onClick={() => console.log("Share")}
              className={`p-2 sm:p-2.5 rounded-xl border ${theme.border} ${theme.textSecondary} transition-all duration-300 hover:scale-110 active:scale-90 ${theme.bg}`}
              title="Share Profile"
            >
              <Share2 className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const QuickActionsSection = () => (
    <div className="animate-slideUp">
      <h2
        className={`text-xl sm:text-2xl font-bold ${theme.text} mb-4 sm:mb-6`}
      >
        Quick Contact
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action, i) => (
          <a
            key={i}
            href={action.link}
            target={
              action.link.startsWith("http") || action.link.startsWith("mailto")
                ? "_blank"
                : "_self"
            }
            className={`group p-4 sm:p-5 rounded-2xl border ${theme.border} ${theme.bg} hover:${theme.accentLightBg} cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95`}
          >
            <action.icon
              className={`w-6 h-6 sm:w-7 sm:h-7 ${theme.accent} mb-3 group-hover:scale-110 transition-transform duration-300`}
            />
            <p
              className={`text-sm sm:text-base font-semibold ${theme.text} mb-1`}
            >
              {action.label}
            </p>
            <p
              className={`text-xs sm:text-sm ${theme.textSecondary} leading-snug`}
            >
              {action.subtitle}
            </p>
          </a>
        ))}
      </div>
    </div>
  );

  const SocialLinksSection = () => (
    <div className="animate-slideUp">
      <h3
        className={`text-lg sm:text-xl font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}
      >
        <Users className={`w-5 h-5 ${theme.accent}`} />
        Connect with Us
      </h3>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {businessProfile.socials.map((social, i) => (
          <a
            key={i}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            title={`Go to our ${social.label}`}
            className={`p-3 rounded-full border ${theme.border} ${theme.text} ${theme.accentLightBg} hover:${theme.accentBg} hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95`}
          >
            <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        ))}
      </div>
    </div>
  );

  const DetailedAboutSection = () => (
    <div className="animate-slideUp">
      <h2
        className={`text-xl sm:text-2xl font-bold ${theme.text} mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3`}
      >
        <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.accent}`} />
        About {businessProfile.name}
      </h2>
      <div
        className={`p-5 sm:p-6 rounded-2xl border ${theme.border} ${theme.accentLightBg}`}
      >
        <div className="prose dark:prose-invert max-w-none">
          {businessProfile.detailedAbout
            .split("\n\n")
            .map((paragraph, index) => (
              <p
                key={index}
                className={`text-sm sm:text-base ${theme.textSecondary} leading-relaxed mb-4`}
              >
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </div>
  );

  const OfferingsSection = () => (
    <div className="animate-slideUp">
      <h2
        className={`text-xl sm:text-2xl font-bold ${theme.text} mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3`}
      >
        <Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.accent}`} />
        Our Core Features & Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {offerings.map((service, i) => (
          <div
            key={i}
            className={`group p-5 sm:p-6 rounded-2xl border ${theme.border} ${theme.bg} hover:${theme.accentLightBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Removed icon for dynamic business use */}
            <h3 className={`text-base sm:text-lg font-bold ${theme.text} mb-2`}>
              {service.title}
            </h3>
            <p
              className={`text-sm sm:text-base ${theme.textSecondary} mb-4 leading-relaxed`}
            >
              {service.description}
            </p>
            <a
              href="#"
              className={`inline-flex items-center text-sm font-semibold ${theme.accent} hover:gap-2 transition-all duration-300 group`}
            >
              Details
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const VideoSection = () => (
    <div className="animate-slideUp">
      <h2
        className={`text-xl sm:text-2xl font-bold ${theme.text} mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3`}
      >
        <Store className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.accent}`} />
        Company Showcase Video
      </h2>
      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${DUMMY_YOUTUBE_ID}`}
          title="Company Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );

  const GallerySection = () => (
    <div className="animate-slideUp">
      <h3
        className={`text-lg sm:text-xl font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}
      >
        <Image className={`w-5 h-5 ${theme.accent}`} />
        Visual Gallery
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {DUMMY_GALLERY_IMAGES.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const WorkingHoursSection = () => (
    <div className="animate-slideUp">
      <h3
        className={`text-lg sm:text-xl font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}
      >
        <Clock className={`w-5 h-5 ${theme.accent}`} />
        Working Hours
      </h3>
      <div
        className={`p-4 sm:p-5 rounded-2xl border ${theme.border} ${theme.accentLightBg}`}
      >
        <p className={`text-xs sm:text-sm ${theme.textSecondary} mb-1`}>
          Status: **Open Now**
        </p>
        <p className={`text-sm sm:text-base font-semibold ${theme.text}`}>
          {businessProfile.workingHours}
        </p>
      </div>
    </div>
  );

  const ThemeSwitcher = () => (
    <div className="animate-slideUp">
      <h3
        className={`text-lg sm:text-xl font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}
      >
        <Lightbulb className={`w-5 h-5 ${theme.accent}`} />
        Switch Theme
      </h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(themes).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setCurrentTheme(key)}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            className={`w-12 h-12 rounded-full border-2 ${theme.border} ${
              val.accentBg
            } ${
              currentTheme === key
                ? "ring-4 ring-offset-2 ring-opacity-50 ring-yellow-500 scale-110 shadow-lg"
                : "opacity-70 hover:opacity-100 hover:scale-105"
            } transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );

  const FeedbackModal = () => {
    if (!showFeedbackModal || userRating < 1 || userRating >= 3) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 animate-scaleIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Private Feedback ({userRating} Star{userRating > 1 && "s"})
            </h3>
            <button
              onClick={() => {
                setShowFeedbackModal(false);
                setUserRating(0);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              We're sorry we missed the mark. Your feedback is private and helps
              us improve:
            </p>
            <textarea
              rows="4"
              placeholder="Tell us what went wrong, your honest feedback is valuable..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowFeedbackModal(false);
                setUserRating(0);
                setFeedbackText("");
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleModalAction}
              disabled={!feedbackText.trim()}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base
                ${
                  !feedbackText.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              Send Private Feedback
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme.bg}`}>
      <style>{`
        /* Global animation styles for component */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>

      <ProfileHeader />
      {/* Sticky Action Bar with big stars */}
      <ActionButtons />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-8 sm:space-y-12">
          <SocialLinksSection />
          <QuickActionsSection />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-8 sm:space-y-12">
              <DetailedAboutSection />
              <OfferingsSection />
              <VideoSection />
            </div>

            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              <WorkingHoursSection />
              <GallerySection />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal />
    </div>
  );
}
