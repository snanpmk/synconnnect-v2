// src/pages/BusinessProfile.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Star,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useGetData from "../../api/useGetData";
import usePostData from "../../api/usePostData";
import Input from "../../components/inputs/Input";
import { PLATFORM_ICONS } from "../../constants/socialIcons";
import { EVENT_TYPES } from "../../constants/eventTypes";
import { openSafe } from "./setup/utility/openSage";
import useEventTracker from "../../hooks/useEventTracker";
import QuickContacts from "../../components/QuickContacts";
import AboutSectionCard from "../../components/AboutSectionCard";
import ServicesSectionCard from "../../components/ServicesSectionCard";
import { formatPhoneForWhatsApp } from "../../utils/formatPhoneForWhatsApp";

const ProfileHeader = React.memo(function ProfileHeader({
  coverPhoto,
  name,
  tagline,
  onShare,
}) {
  return (
    <header className="relative w-full">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-24 right-16 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-36 left-12 w-80 h-80 bg-slate-200/18 rounded-full blur-3xl" />
      </div>
      {/* responsive and 16:9 ratio */}
      {/* give max height for the image */}
      <div
        className="relative w-full  h-[30vh] min-h-[200px] max-h-[400px] md:h-[40vh] lg:h-[50vh]
       aspect-video overflow-hidden "
      >
        <img
          src={coverPhoto}
          alt="Business Cover"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.22)_0%,transparent_55%)]" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg inline-block animate-fadeIn">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    {name}
                  </h1>
                  <p className="text-sm sm:text-base text-white/80 mt-1 max-w-2xl">
                    {tagline}
                  </p>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                  <button
                    onClick={onShare}
                    title="Share profile"
                    className="p-2.5 rounded-full bg-white/90 backdrop-blur shadow-md border border-gray-200 hover:bg-white transition-all"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end hero */}
    </header>
  );
});

// 2. FeedbackModal (renamed from FeedbackModalInner)
function FeedbackModal({ visible, userRating, onClose, userId, trackEvent }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { feedback: "" },
  });

  const feedbackMutation = usePostData({
    onSuccess: () => {
      reset();
      onClose();
      toast.success("Thank you for your feedback!");
      try {
        trackEvent("feedback_private_submitted", { rating: userRating });
      } catch (e) {
        console.log(e);
      }
    },
  });

  const onSubmit = (values) => {
    feedbackMutation.mutate({
      url: "/feedback",
      method: "POST",
      data: { userId, rating: userRating, feedback: values.feedback },
    });
  };

  if (!visible || userRating < 1 || userRating >= 3) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 animate-scaleIn overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Private Feedback ({userRating}★)
          </h3>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close feedback"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-6">
          <p className="text-sm text-gray-600 mb-4">
            We're sorry your experience wasn't great. Please help us improve.
          </p>

          <Input
            name="feedback"
            control={control}
            label="Your Feedback"
            placeholder="Describe what went wrong..."
            isTextarea
            rows={4}
            rules={{ required: "Feedback is required" }}
          />

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={feedbackMutation.isPending}
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl text-white font-semibold text-sm bg-slate-800 hover:bg-slate-900 disabled:bg-gray-400"
            >
              {feedbackMutation.isPending ? "Submitting..." : "Send Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. SocialsSection
function SocialsSection({ socials, trackEvent }) {
  if (socials?.length === 0) return null;

  return (
    <section className="animate-slideUp bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-slate-700" />
        Connect with Us
      </h3>
      <div className="flex flex-wrap gap-3">
        {socials.map(
          ({ icon: Icon, url, platform, color: brandColorClass }) => {
            const safeURL = url.startsWith("http") ? url : `https://${url}`;
            return (
              <button
                key={platform}
                onClick={() => {
                  trackEvent(EVENT_TYPES.SOCIAL(platform.toLowerCase()), {
                    href: url,
                    platform,
                  });
                  openSafe(safeURL);
                }}
                className="group p-2 rounded-full bg-white hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all shadow-lg active:scale-95 transform"
                title={platform}
              >
                <Icon
                  className={`${brandColorClass} w-6 h-6 transition group-hover:opacity-80`}
                />
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}

// 6. ServicesSection
function ServicesSection({ services, servicesHeading, trackEvent }) {
  if (services?.length === 0) return null;

  return (
    <section className="animate-slideUp">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-slate-700" />
        {servicesHeading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {service.title || service.name}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {service.description || service.desc}
            </p>
            <a
              href={service.waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("service_inquiry", {
                  service: service.title || service.name,
                  href: service.waHref,
                })
              }
              className="inline-flex items-center text-sm font-semibold text-slate-800 hover:gap-2 transition-all duration-200"
            >
              Query on WhatsApp
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// 7. VideoShowcaseSection
function VideoShowcaseSection({ youtubeVideoUrl }) {
  if (!youtubeVideoUrl) return null;

  return (
    <section className="animate-slideUp">
      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl border border-slate-200 bg-white/60">
        <iframe
          title="Showcase Video"
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeVideoUrl}`}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </section>
  );
}

// 8. RatingStrip (Sticky header component)
function RatingStrip({
  userRating,
  hoverRating,
  setHoverRating,
  handleRatingClick,
}) {
  return (
    <div className="sticky top-0 z-30 px-4 py-3 sm:py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-xl mx-auto w-full">
        <div className="flex flex-col items-center gap-2">
          {/* Star Selection (mobile optimized) */}
          <div className="gold-border rounded-xl">
            <div
              className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-3 shadow-md"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const filled =
                  hoverRating >= star || (!hoverRating && userRating >= star);
                return (
                  <Star
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => handleRatingClick(star)}
                    className={`w-10 h-10 cursor-pointer transition-all duration-200 ${
                      filled
                        ? "text-amber-400 fill-amber-400 scale-110"
                        : "text-gray-300"
                    } hover:scale-125`}
                  />
                );
              })}
            </div>
          </div>

          <p className=" text-slate-600 mt-1">
            {/* message to say what we mean by rating on basis of stars */}
            {userRating === 0 && hoverRating === 0 && (
              <span className="text-sm text-slate-600">
                Rate your experience!{" "}
                <Sparkles className="inline w-3 h-3 text-amber-500" /> Your
                feedback helps us improve!
              </span>
            )}
            {hoverRating > 0 && (
              <span className="text-xs text-slate-600">
                {hoverRating >= 3
                  ? "Click to leave a public review on Google!"
                  : "Click to provide private feedback."}
              </span>
            )}
            {userRating > 0 && hoverRating === 0 && (
              <span className="text-xs text-slate-600">
                {userRating >= 3
                  ? "Redirecting to Google Reviews..."
                  : "Opening private feedback form..."}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------
   Main Component (Themed)
   ------------------------*/
export default function BusinessProfile() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const userId = useMemo(() => {
    try {
      return window.location.pathname.split("/").pop();
    } catch {
      return null;
    }
  }, []);

  const { data: userDataResponse } = useGetData({
    queryKey: ["user", userId],
    url: `/user/public?id=${userId}`,
    options: { retry: 1 },
  });

  const userData = userDataResponse?.data ?? {};

  const waNumber = (dial, num) =>
    `${(dial || "").replace(/\D/g, "")}${(num || "").replace(/\D/g, "")}`;

  const waLink = (dial, num, msg) =>
    `https://wa.me/${waNumber(dial, num)}?text=${encodeURIComponent(msg)}`;

  const businessProfile = useMemo(() => {
    const socials =
      (userData?.socialLinks ?? [])
        .map((link) => {
          const IconComponent = PLATFORM_ICONS?.[link?.platform]?.icon;
          return IconComponent
            ? {
                icon: IconComponent,
                link: link?.url ?? "",
                label: link?.platform,
              }
            : null;
        })
        .filter(Boolean) ?? [];

    return {
      name: userData?.businessName || "",
      tagline: userData?.tagline || "",
      detailedAbout: userData?.detailedAbout || "",
      coverPhoto:
        userData?.coverPhoto?.url ??
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
      googleReviewLink: userData?.googleReviewLink,
      website:
        userData?.socialLinks?.find((l) => l?.platform === "Website")?.url ??
        "",
      contact: {
        phone:
          (userData?.phone?.dialCode && userData?.phone?.phoneNumber
            ? `${userData?.phone?.dialCode} ${userData?.phone?.phoneNumber}`
            : userData?.phone?.phoneNumber) ?? "",
        email: userData?.email ?? "",
      },
      socials,
      services: userData?.services ?? [],
      servicesHeading: userData?.servicesHeading ?? "Our Services",
      whatsapp: userData?.whatsapp ?? {},
      location: userData?.location ?? "",
      youtubeVideoUrl: userData?.youtubeVideoUrl ?? "",
    };
  }, [userData]);

  const socials =
    (userData.socialLinks || [])
      .map((s) => {
        const Icon = PLATFORM_ICONS[s.platform]?.icon;
        const color = PLATFORM_ICONS[s.platform]?.color;
        return Icon
          ? { icon: Icon, url: s.url, platform: s.platform, color: color }
          : null;
      })
      .filter(Boolean) || [];

  /* ------------------------
     event mutation + tracking
     ------------------------*/
  const eventMutation = usePostData();

  const trackEvent = useCallback(
    (type, meta = {}) => {
      if (!userId) return;
      try {
        eventMutation.mutate({
          url: "/event",
          method: "POST",
          data: { userId, type, meta },
        });
      } catch (err) {
        // swallow
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userDataResponse?.data?._id) {
      setTimeout(() => trackEvent("view"), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDataResponse?.data?._id]);

  const actions = [
    {
      icon: Phone,
      label: "Call",
      subtitle: `${userData.phone?.dialCode || ""} ${
        userData.phone?.phoneNumber || ""
      }`,
      href: `tel:${userData.phone?.dialCode}${userData.phone?.phoneNumber}`,
      event: EVENT_TYPES.CONTACT_CALL,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      subtitle: `${userData.whatsapp?.dialCode || ""} ${
        userData.whatsapp?.phoneNumber || ""
      }`,
      href: waLink(
        userData.whatsapp?.dialCode,
        userData.whatsapp?.phoneNumber,
        "Hi, I saw your profile and wanted to connect."
      ),
      event: EVENT_TYPES.CONTACT_WHATSAPP,
    },
    {
      icon: Mail,
      label: "Email",
      subtitle: userData.email,
      href: `mailto:${userData.email}`,
      event: EVENT_TYPES.CONTACT_EMAIL,
    },
    {
      icon: MapPin,
      label: "Location",
      subtitle: userData.location || "View location",
      href: userData.location,
      event: EVENT_TYPES.CONTACT_LOCATION,
    },
  ];

  /* ------------------------
     Native share (option A)
     ------------------------*/
  const onShare = useCallback(async () => {
    const shareData = {
      title: businessProfile?.fullName || "Business Profile",
      text: businessProfile?.tagline || "Check this out",
      url: window.location.href,
    };

    trackEvent("share_attempt", { location: "cover_header" });

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        trackEvent("share_other", { method: "native" });
      } else {
        toast.error("Sharing is not supported on this device/browser.");
        trackEvent("share_unsupported", { userAgent: navigator.userAgent });
      }
    } catch (err) {
      if (err && err.name !== "AbortError") {
        trackEvent("share_error", { message: err?.message ?? "unknown" });
      }
    }
  }, [businessProfile, trackEvent]);

  const handleRatingClick = useCallback(
    (rating) => {
      setUserRating(rating);
      setHoverRating(0);

      if (rating >= 3) {
        trackEvent("feedback_clicked_public", { rating });
        window.open(
          businessProfile?.googleReviewLink,
          "_blank",
          "noopener,noreferrer"
        );
      } else if (rating > 0) {
        setShowFeedbackModal(true);
        trackEvent("feedback_low_rating_open", { rating });
      }
    },
    [trackEvent, businessProfile]
  );

  const servicesWithWhatsApp = useMemo(() => {
    const waNumber = formatPhoneForWhatsApp(businessProfile.whatsapp);
    return (businessProfile.services || []).map((service) => {
      const message = `Hi, I'm interested in the service: ${
        service.title || service.name
      }`;
      const waHref = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      return { ...service, waHref };
    });
  }, [businessProfile.services, businessProfile.whatsapp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 transition-all duration-500">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.55s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.28s ease-out; }
      `}</style>

      <ProfileHeader
        coverPhoto={businessProfile.coverPhoto}
        name={businessProfile.name}
        tagline={businessProfile.tagline}
        onShare={onShare}
      />

      <RatingStrip
        userRating={userRating}
        hoverRating={hoverRating}
        setHoverRating={setHoverRating}
        handleRatingClick={handleRatingClick}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-10">
          <SocialsSection socials={socials} trackEvent={trackEvent} />

          <QuickContacts actions={actions} trackEvent={trackEvent} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="lg:col-span-2 space-y-8">
              {businessProfile.detailedAbout && (
                <AboutSectionCard
                  aboutHeading={`About Us`}
                  about={businessProfile.detailedAbout}
                />
              )}

              <ServicesSectionCard
                services={servicesWithWhatsApp}
                heading={businessProfile.servicesHeading}
                trackEvent={trackEvent}
              />

              <VideoShowcaseSection
                youtubeVideoUrl={businessProfile.youtubeVideoUrl}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-slate-600">
        © {new Date().getFullYear()} {businessProfile.name} • Powered by
        Synconnect Business
      </footer>

      <FeedbackModal
        visible={showFeedbackModal}
        userRating={userRating}
        onClose={() => {
          setShowFeedbackModal(false);
          setUserRating(0);
        }}
        userId={userId}
        trackEvent={trackEvent}
      />
    </div>
  );
}
