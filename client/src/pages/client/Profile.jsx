// src/pages/profile/MinimalProfile.jsx

import React, { useState, useEffect, useMemo } from "react";
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
  X,
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
import { openSafe } from "./setup/utility/openSage";
import QuickContacts from "../../components/QuickContacts";
import AboutSectionCard from "../../components/AboutSectionCard";
import ServicesSection from "../../components/ServicesSectionCard";
import ServicesSectionCard from "../../components/ServicesSectionCard";
import { formatPhoneForWhatsApp } from "../../utils/formatPhoneForWhatsApp";

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

  console.log(user);

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

  const servicesWithWhatsApp = useMemo(() => {
    const waNumber = formatPhoneForWhatsApp(user.whatsapp);
    return (user.services || []).map((service) => {
      const message = `Hi, I'm interested in the service: ${
        service.title || service.name
      }`;
      const waHref = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      return { ...service, waHref };
    });
  }, [user.services, user.whatsapp]);

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

    const msg = `Hi, I'm ${v.leadName}. We met at ${v.placeWeMet}.`;

    openSafe(
      waLink(user.whatsapp?.dialCode, user.whatsapp?.phoneNumber, msg),
      "_blank"
    );

    reset();
    setOpen(false);
  };

  const saveContact = () => {
    trackEvent(EVENT_TYPES.SAVE_CONTACT);

    const name = profile?.fullName?.trim() || "Contact";
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
      <div className="max-w-6xl mx-auto px-3 py-3 md:py-10">
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
          services={servicesWithWhatsApp}
          serviceHeading={user.servicesHeading}
          youtubeId={user.youtubeVideoUrl}
          trackEvent={trackEvent}
        />
        <ConnectModal
          close={() => setOpen(false)}
          control={control}
          open={open}
          submit={handleSubmit(submit)}
          isSubmitting={formState.isSubmitting}
        />
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
    <div className="flex items-center justify-start gap-2 my-2 flex-wrap">
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
          className="w-full h-full object-cover"
          alt="Cover"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-indigo-700 via-purple-700 to-pink-600"></div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Share Icon - Top right */}
      <button
        onClick={shareProfile}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm shadow-md text-white hover:bg-white/40 transition active:scale-95"
        title="Share Profile"
      >
        <Share2 size={23} />
      </button>

      {/* Bookmark Icon - Top left */}
      <button
        onClick={saveContact}
        // Increased opacity to ensure visibility against bright backgrounds
        className="absolute top-4 left-4 p-2 rounded-lg bg-white/40 backdrop-blur-sm shadow-md hover:bg-white/50 transition active:scale-95"
        title="Save Contact (VCF Download)"
      >
        <UserPlus size={23} className="text-white" />
      </button>
    </div>

    {/* Profile info */}
    <div className="relative px-6 md:px-8 pb-8">
      {" "}
      {/* Increased pb-8 for more bottom space */}
      <div className="flex flex-col items-start text-start -mt-16">
        {/* Avatar */}
        <div className="relative animate-float-subtle">
          <img
            src={profile.photo}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-xl"
            alt={profile.name}
          />
        </div>

        {/* Name and Designation */}
        <div className="pt-4">
          <h1 className="text-2xl text-start md:text-3xl font-bold text-gray-900 mb-0">
            {profile.name}
          </h1>
          <p className="text-lg text-start font-medium **mb-3**">
            {" "}
            {/* Adjusted mb-2 to mb-3 for slightly more separation */}
            <span className="text-slate-600">{profile.designation}</span>
            <span className="text-black px-2">@</span>
            <span className="text-gray-800">{profile.company}</span>
          </p>
        </div>

        {/* Tagline */}
        {profile.tagline && (
          <p className="text-sm text-gray-600 leading-relaxed italic max-w-sm **mb-5**">
            {" "}
            {/* Adjusted mb-4 to mb-5 for better separation from socials */}"
            {profile.tagline}"
          </p>
        )}

        {/* Social Icons */}
        <div className="**mb-6**">
          {" "}
          {/* Adjusted mb-4 to mb-6 for better separation from action buttons */}
          {/* SocialIconsRow must be defined elsewhere and is used here */}
          <SocialIconsRow socials={socials} trackEvent={trackEvent} />
        </div>
      </div>
      {/* ACTION BUTTONS: Save Contact and Get In Touch */}
      <div className="flex gap-3 items-stretch">
        {" "}
        {/* Adjusted gap-4 to gap-3 for slightly tighter button spacing if needed, but gap-4 is fine too. Reverted to gap-4 below. */}
        <button
          onClick={openConnect}
          className="flex-1 py-3.5 rounded-full bg-gray-900 text-white font-bold text-lg
             hover:bg-gray-800 shadow-xl shadow-gray-500/50 transition-all
             active:scale-[0.98] transform"
        >
          Get In Touch
        </button>
      </div>
    </div>
  </div>
);
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
      <QuickContacts actions={actions} trackEvent={trackEvent} />
      {profile.about && (
        <AboutSectionCard about={profile.about} aboutHeading={`About Me`} />
      )}
    </div>

    {/* Main content */}
    <div className="lg:col-span-2 space-y-6">
      {services.length > 0 && (
        <ServicesSectionCard
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
const ConnectModal = ({ close, open, control, submit, isSubmitting }) => (
  <div
    // Outer Container: Controls backdrop, visibility, and fade-in keyframe animation
    // Keyframe Animation: 'backdrop-in' (fades from 0% to 100% opacity over 300ms)
    className={`${
      open ? "block" : "hidden"
    } fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 
       ${open ? "animate-backdrop-in" : ""} duration-300`}
  >
    <div
      // Inner Container: Controls content styling and zoom-in keyframe animation
      // Keyframe Animation: 'modal-in' (fades from 0% opacity and scales from 0.95 to 1 over 300ms)
      className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl  
      animate-modal-in"
    >
      {/* Header */}
      <div className="bg-gray-900 px-6 py-5">
        <h3 className="text-2xl font-bold text-white">Let's Connect! 🤝</h3>
        <p className="text-gray-300 text-base mt-1">
          Share your details to start the conversation.
        </p>
      </div>

      {/* Form Content */}
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
          label="Contact Number"
          control={control}
          rules={{ required: "Required" }}
          inputClass="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900 shadow-sm"
          placeholder="54 514 4220"
        />

        <div className="flex gap-4 pt-2">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={close}
            className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium 
               hover:bg-gray-100 transition shadow-sm flex items-center justify-center gap-2"
          >
            <X size={20} /> {/* Cancel icon */}
            Cancel
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 
               disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-500/50 
               transition active:scale-95 transform flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send size={20} /> {/* Send icon */}
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);
export { ProfileCardMinimal as ProfileCard };
