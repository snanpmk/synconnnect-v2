// src/pages/profile/MinimalProfile.jsx

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  UserPlus,
  Send,
  ChevronRight,
  Download,
  Feather,
  Star,
  Calendar,
  Bookmark,
  Share2,
  Briefcase,
  Users,
} from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";
import useGetData from "../../api/useGetData";
import usePostData from "../../api/usePostData";
import useEventTracker from "../../hooks/useEventTracker";
import { PLATFORM_ICONS } from "../../constants/socialIcons";
import { EVENT_TYPES } from "../../constants/eventTypes";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../components/inputs/Input";
import PhoneInputField from "../../components/inputs/PhoneInput";
import { defaultPhoneState } from "./setup/constants/InitialFormState";

/* ---------------------------------------------------
    HELPERS
---------------------------------------------------- */

// Removes non-digit characters from dial code and number
const waNumber = (dial, num) =>
  `${(dial || "").replace(/\D/g, "")}${(num || "").replace(/\D/g, "")}`;

// Creates a WhatsApp API link with pre-filled message
const waLink = (dial, num, msg) =>
  `https://wa.me/${waNumber(dial, num)}?text=${encodeURIComponent(msg)}`;

/* ---------------------------------------------------
    MAIN COMPONENT
---------------------------------------------------- */
export default function MinimalProfile() {
  const userId = window.location.pathname.split("/").pop();

  const { data, isLoading } = useGetData({
    queryKey: ["profile", userId],
    url: `/user/public?id=${userId}`,
  });

  const trackEvent = useEventTracker(userId);

  const user = data?.data || {};
  const { currentTheme, themeConfigs } = useThemeStore();
  const theme = themeConfigs[currentTheme];

  /* Track page view */
  useEffect(() => {
    if (user?._id) {
      setTimeout(() => trackEvent(EVENT_TYPES.VIEW), 300);
    }
  }, [user?._id]);

  const profile = {
    name: user.fullName,
    designation: user.designation,
    company: user.companyName,
    tagline: user.tagline,
    about: user.detailedAbout,
    photo: user.profilePhoto?.url,
    cover: user.coverPhoto?.url,
  };

  const socials =
    (user.socialLinks || [])
      .map((s) => {
        const Icon = PLATFORM_ICONS[s.platform]?.icon;
        const color = PLATFORM_ICONS[s.platform]?.color;
        return Icon
          ? { icon: Icon, url: s.url, platform: s.platform, color: color }
          : null;
      })
      .filter(Boolean) || [];

  const actions = [
    {
      icon: Phone,
      label: "Call",
      subtitle: `${user.phone?.dialCode || ""} ${
        user.phone?.phoneNumber || ""
      }`,
      href: `tel:${user.phone?.dialCode}${user.phone?.phoneNumber}`,
      event: EVENT_TYPES.CONTACT_CALL,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      subtitle: `${user.whatsapp?.dialCode || ""} ${
        user.whatsapp?.phoneNumber || ""
      }`,
      href: waLink(
        user.whatsapp?.dialCode,
        user.whatsapp?.phoneNumber,
        "Hi, I saw your profile and wanted to connect."
      ),
      event: EVENT_TYPES.CONTACT_WHATSAPP,
    },
    {
      icon: Mail,
      label: "Email",
      subtitle: user.email,
      href: `mailto:${user.email}`,
      event: EVENT_TYPES.CONTACT_EMAIL,
    },
    {
      icon: MapPin,
      label: "Location",
      subtitle: user.location || "View location",
      href: user.location,
      event: EVENT_TYPES.CONTACT_LOCATION,
    },
  ];

  const services = user.services || [];
  const [open, setOpen] = useState(false);

  const postConnection = usePostData({
    onSuccess: () => toast.success("Submitted successfully, check WhatsApp!"),
    onError: () => toast.error("Error submitting"),
  });

  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      leadName: "",
      placeWeMet: "",
      contactNumber: defaultPhoneState,
    },
  });

  const submit = async (v) => {
    trackEvent(EVENT_TYPES.CONNECT_FORM_SUBMIT, {
      leadName: v.leadName,
      placeWeMet: v.placeWeMet,
    });

    await postConnection.mutateAsync({
      url: "/user/public/lead",
      method: "POST",
      data: { userId, ...v },
    });

    const msg = `Hi, I'm ${v.leadName}. We met at ${v.placeWeMet}. My number is ${v.contactNumber.phoneNumber}.`;

    window.open(
      waLink(user.whatsapp?.dialCode, user.whatsapp?.phoneNumber, msg),
      "_blank"
    );

    reset();
    setOpen(false);
  };

  const saveContact = () => {
    trackEvent(EVENT_TYPES.SAVE_CONTACT);

    const name = profile?.name?.trim() || "Contact";
    const tel = waNumber(user.phone?.dialCode, user.phone?.phoneNumber);
    const email = user?.email || "";
    const title = profile?.designation || "";
    const company = profile?.company || "";
    const photo = profile?.photo || ""; // This is often tricky for VCF, using URI if available

    // Build vCard (no unnecessary spaces, clean formatting)
    const vcfLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${name}`,
      company ? `ORG:${company}` : `ORG:${name}`,
      title ? `TITLE:${title}` : "",
      `TEL;TYPE=CELL:${tel}`,
      email ? `EMAIL;TYPE=WORK:${email}` : "",
      // Photo line is included here but may not work universally for all clients
      photo ? `PHOTO;VALUE=URI:${photo}` : "",
      "END:VCARD",
    ];

    const vcf = vcfLines.filter(Boolean).join("\n");

    // Create a Blob with the correct MIME type
    const file = new Blob([vcf], { type: "text/x-vcard;charset=utf-8" });
    const url = URL.createObjectURL(file);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.vcf`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  // --- LOADING STATE ---
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );

  return (
    // Clean, high-contrast background based on the new design's gray-100/white theme
    <div className="min-h-screen bg-gray-100 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-2 py-3 md:py-10">
        <ProfileCardMinimal
          profile={profile}
          socials={socials}
          trackEvent={trackEvent}
          saveContact={saveContact}
          // The MinimalProfile component itself will handle the new share function
          shareProfile={() => {
            trackEvent(EVENT_TYPES.SHARE);
            if (navigator.share) {
              navigator
                .share({
                  title: `${profile.name}'s Digital Profile`,
                  text: `Check out ${profile.name}'s professional profile: ${profile.designation} @ ${profile.company}`,
                  url: window.location.href,
                })
                .catch((error) => console.log("Error sharing", error));
            } else {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Profile link copied to clipboard!");
            }
          }}
          openConnect={() => {
            trackEvent(EVENT_TYPES.CONNECT_FORM_OPEN);
            setOpen(true);
          }}
        />

        <ContentGrid
          profile={profile}
          actions={actions}
          services={services}
          serviceHeading={user.servicesHeading}
          youtubeId={user.youtubeVideoUrl}
          trackEvent={trackEvent}
        />

        {open && (
          <ConnectModal
            close={() => setOpen(false)}
            control={control}
            submit={handleSubmit(submit)}
            isSubmitting={formState.isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
    SOCIAL BAR (Flat and High-Contrast)
---------------------------------------------------- */
const SocialIconsRow = ({ socials, trackEvent }) => {
  if (!socials.length) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      {socials.map(({ icon: Icon, url, platform, color: brandColorClass }) => {
        const safeURL = url.startsWith("http") ? url : `https://${url}`;
        return (
          <button
            key={platform}
            onClick={() => {
              trackEvent(EVENT_TYPES.SOCIAL(platform.toLowerCase()), {
                href: url,
                platform,
              });
              window.open(safeURL, "_blank");
            }}
            className="group p-2 rounded-full bg-white hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all shadow-sm active:scale-95 transform"
            title={platform}
          >
            <Icon
              className={`${brandColorClass} w-6 h-6 transition group-hover:opacity-80`}
            />
          </button>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------
    PROFILE CARD (Minimalist Inspiration)
---------------------------------------------------- */
const ProfileCardMinimal = ({
  profile,
  socials,
  trackEvent,
  saveContact,
  shareProfile,
  openConnect,
}) => (
  // Use max-w-lg from the MinimalProfile implementation
  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-200 max-w-lg mx-auto">
    {/* Cover with Vibrant, Dynamic Photo */}
    <div className="relative h-48 md:h-56 bg-gray-900 m-2 rounded-2xl overflow-hidden">
      {profile.cover ? (
        <img
          src={profile.cover}
          className="w-full h-full object-cover opacity-90"
          alt="Cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600"></div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Share Icon - Top right */}
      <button
        onClick={shareProfile}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm shadow-md text-white hover:bg-white/40 transition active:scale-95"
        title="Share Profile"
      >
        <Share2 size={20} />
      </button>

      {/* Bookmark Icon - Top left */}
      <button
        onClick={saveContact} // <-- ADD THIS
        className="absolute top-4 left-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm shadow-md hover:bg-white/40 transition active:scale-95 transform"
        title="Save Contact (VCF Download)" // <-- ADD/UPDATE TITLE
      >
        <UserPlus size={20} className="text-white" />
      </button>
    </div>

    {/* Profile info */}
    <div className="relative px-6 md:px-8 pb-6">
      <div className="flex flex-col items-center text-center -mt-16">
        {/* Avatar */}
        <div className="relative">
          <img
            src={profile.photo}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-gray-900/50"
            alt={profile.name}
          />
        </div>

        {/* Name and Designation */}
        <div className="pt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-0">
            {profile.name}
          </h1>
          <p className="text-lg text-gray-800 font-medium mb-2">
            {profile.designation}
          </p>
        </div>

        {/* Tagline */}
        {profile.tagline && (
          <p className="text-sm text-gray-600 leading-relaxed italic max-w-sm mb-4">
            "{profile.tagline}"
          </p>
        )}

        {/* Social Icons */}
        <div className="mb-4">
          <SocialIconsRow socials={socials} trackEvent={trackEvent} />
        </div>
      </div>

      {/* ACTION BUTTONS: Save Contact and Get In Touch */}
      <div className="flex gap-4 items-stretch">
        {/* Secondary Action: Save Contact */}
        {/* <button
          onClick={saveContact}
          className="flex items-center justify-center p-3 rounded-2xl border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition active:scale-95 transform shadow-sm w-fit whitespace-nowrap"
          title="Add to Contacts"
        >
          <UserPlus className="w-5 h-5" />
        </button> */}

        {/* MAIN CTA: Get In Touch */}
        <button
          onClick={openConnect}
          className="flex-1 py-3.5 rounded-full bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 shadow-xl shadow-gray-500/50 transition-all active:scale-[0.98] transform"
        >
          Get In Touch
        </button>
      </div>
    </div>
  </div>
);

// Helper component for the Stat Row - Not fully used here but kept for completeness
// const StatItem = ({ icon: Icon, value, label }) => (
//   <div className="flex flex-col items-center w-1/3">
//     <div className="flex items-center gap-1">
//       <Icon
//         size={16}
//         className={label === "Rating" ? "text-yellow-500" : "text-gray-700"}
//       />
//       <span className="text-base font-semibold text-gray-800">{value}</span>
//     </div>
//     <span className="text-xs text-gray-500 uppercase font-medium">{label}</span>
//   </div>
// );

/* ---------------------------------------------------
    CONTENT GRID
---------------------------------------------------- */
const ContentGrid = ({
  profile,
  actions,
  services,
  youtubeId,
  serviceHeading,
  trackEvent,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto ">
    {/* Sidebar */}
    <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit lg:col-span-1">
      <ContactCard actions={actions} trackEvent={trackEvent} />
      {profile.about && <AboutCard about={profile.about} />}
    </div>

    {/* Main content */}
    <div className="lg:col-span-2 space-y-6">
      {services.length > 0 && (
        <ServicesSection
          services={services}
          heading={serviceHeading}
          trackEvent={trackEvent}
        />
      )}
      {youtubeId && (
        <VideoSection youtubeId={youtubeId} trackEvent={trackEvent} />
      )}
    </div>
  </div>
);

/* ---------------------------------------------------
    CONTACT CARD
---------------------------------------------------- */
const ContactCard = ({ actions, trackEvent }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3 border-gray-200">
      <Phone size={20} className="text-gray-900" />
      Quick Actions
    </h2>

    <div className="space-y-1 pt-2">
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={() => {
            trackEvent(a.event, { label: a.label, href: a.href });
            window.open(
              a.href,
              a.label === "Call" || a.label === "Email" ? "_self" : "_blank"
            );
          }}
          className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border-b border-transparent transition group active:bg-gray-100"
        >
          {/* Clean, gray/white icon container */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-100 transition ring-1 ring-transparent group-hover:ring-gray-300">
            <a.icon className="text-gray-600 w-5 h-5 group-hover:text-gray-900 transition" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-base font-semibold text-gray-900">{a.label}</p>
            <p className="text-sm text-gray-500 truncate">{a.subtitle}</p>
          </div>
          <ChevronRight
            className="text-gray-400 group-hover:text-gray-900 flex-shrink-0 transition"
            size={20}
          />
        </button>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------
    ABOUT CARD
---------------------------------------------------- */
const AboutCard = ({ about }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3 border-gray-200">
      <Feather size={20} className="text-gray-900" />
      About Me
    </h2>
    <div className="space-y-4 pt-2">
      {about.split("\n\n").map((p, i) => (
        <p key={i} className="text-base text-gray-700 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------
    SERVICES SECTION
---------------------------------------------------- */
const ServicesSection = ({ services, heading, trackEvent }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-3 border-gray-200">
      <Briefcase size={20} className="text-gray-900" />
      {heading || "My Services"}
    </h2>

    <div className="grid grid-cols-1 gap-3 pt-3">
      {services.map((s, i) => (
        <div
          key={i}
          onClick={() =>
            trackEvent(EVENT_TYPES.SERVICE_VIEW, { service: s.title })
          }
          className="group p-4 rounded-lg bg-white hover:bg-gray-50/50 border border-gray-200 hover:border-gray-300 cursor-pointer transition-all shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition">
            {s.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {s.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------
    VIDEO SECTION
---------------------------------------------------- */
const VideoSection = ({ youtubeId, trackEvent }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-3 border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-900 w-6 h-6"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21.5 6.096c-.347-1.144-1.298-2.096-2.441-2.442C17.7 3 12 3 12 3S6.3 3 4.941 3.654C3.798 4.001 2.847 4.953 2.5 6.096c-.654 2.217-.654 6.783-.654 6.783s0 4.566.654 6.783c.347 1.144 1.298 2.096 2.441 2.442C6.3 22 12 22 12 22s5.7 0 7.059-.654c1.143-.346 2.094-1.298 2.441-2.442c.654-2.217.654-6.783.654-6.783s0-4.566-.654-6.783zm-14.5 10V7.999L16 12l-8.999 4.096z" />
      </svg>
      Introduction Video
    </h2>

    <div
      onClick={() => trackEvent(EVENT_TYPES.YOUTUBE_OPEN)}
      className="aspect-video rounded-lg overflow-hidden cursor-pointer transition-all shadow-xl hover:shadow-2xl border border-gray-200"
    >
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        className="w-full h-full"
        allowFullScreen
        title="Introduction Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  </div>
);

/* ---------------------------------------------------
   CONNECT MODAL (Updated with Tailwind Animation)
---------------------------------------------------- */
const ConnectModal = ({ close, control, submit, isSubmitting }) => (
  <div
    // Added classes for fade-in and duration
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
  >
    <div
      className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 
      // Added classes for zoom-in effect (95% initial scale)
      animate-in zoom-in-95 duration-300"
    >
      {/* Header color changed to dark gray */}
      <div className="bg-gray-900 px-6 py-5">
        <h3 className="text-2xl font-bold text-white">Let's Connect! 🤝</h3>
        <p className="text-gray-300 text-base mt-1">
          Share your details to start the conversation.
        </p>
      </div>

      <form onSubmit={submit} className="p-6 space-y-6">
        <Input
          name="leadName"
          label="Your Name"
          control={control}
          rules={{ required: "Name is required" }}
          placeholder="Enter your name"
          inputClass="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 shadow-sm"
        />

        <Input
          name="placeWeMet"
          label="Where we met"
          control={control}
          rules={{ required: "Required" }}
          placeholder="e.g., Tech Conference 2024, or LinkedIn"
          inputClass="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 shadow-sm"
        />

        <PhoneInputField
          name="contactNumber"
          label="Contact Number (for lead capture)"
          control={control}
          rules={{ required: "Required" }}
          inputClass="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 shadow-sm"
        />

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={close}
            className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-500/50 transition active:scale-95 transform"
          >
            {isSubmitting ? "Sending..." : "Send & Open WhatsApp"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
export { ProfileCardMinimal as ProfileCard };
