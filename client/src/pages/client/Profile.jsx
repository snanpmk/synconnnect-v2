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
const waNumber = (dial, num) =>
  `${(dial || "").replace(/\D/g, "")}${(num || "").replace(/\D/g, "")}`;

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
        return Icon ? { icon: Icon, url: s.url, platform: s.platform } : null;
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
        "Hello!"
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
    onSuccess: () => toast.success("Submitted successfully"),
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
    const name = profile?.name?.trim() || "Contact";
    const tel = waNumber(user.phone?.dialCode, user.phone?.phoneNumber);
    const email = user?.email || "";
    const title = profile?.designation || "";
    const company = profile?.company || "";
    const photo = profile?.photo || "";

    // Build vCard (no spaces, clean formatting)
    const vcfLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${name}`,
      company ? `ORG:${company}` : `ORG:${name}`,
      title ? `TITLE:${title}` : "",
      `TEL;TYPE=CELL:${tel}`,
      email ? `EMAIL;TYPE=WORK:${email}` : "",
      photo ? `PHOTO;VALUE=URI:${photo}` : "",
      "END:VCARD",
    ];

    const vcf = vcfLines.filter(Boolean).join("\n");

    // Correct MIME type for production
    const file = new Blob([vcf], { type: "text/x-vcard" });
    const url = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.vcf`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    // analytics AFTER click so browser doesn't block download
    trackEvent(EVENT_TYPES.SAVE_CONTACT);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading…
      </div>
    );

  return (
    <div className={`${theme.bg} min-h-screen pb-36`}>
      <div className="max-w-5xl mx-auto px-4">
        {" "}
        <Header profile={profile} theme={theme} />
        <StickyButtons
          saveContact={saveContact}
          open={() => {
            trackEvent(EVENT_TYPES.CONNECT_FORM_OPEN);
            setOpen(true);
          }}
          theme={theme}
        />
        <SocialLinks socials={socials} theme={theme} trackEvent={trackEvent} />
        <MainContent
          profile={profile}
          actions={actions}
          services={services}
          serviceHeading={user.servicesHeading}
          youtubeId={user.youtubeVideoUrl}
          theme={theme}
          trackEvent={trackEvent}
        />
        {open && (
          <ConnectModal
            close={() => setOpen(false)}
            control={control}
            submit={handleSubmit(submit)}
            theme={theme}
            isSubmitting={formState.isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   HEADER
---------------------------------------------------- */
const Header = ({ profile, theme }) => (
  <div className="p-4">
    <div className={`h-44 rounded-xl overflow-hidden ${theme.shadow}`}>
      <img src={profile.cover} className="w-full h-full object-cover" />
    </div>

    <div className="-mt-14 flex flex-col items-start gap-3 px-2">
      <img
        src={profile.photo}
        className={`w-28 h-28 rounded-full border-4 ${theme.cardBorder} object-cover ${theme.shadow}`}
      />

      <h1 className={`text-2xl font-bold ${theme.text}`}>{profile.name}</h1>

      <p className={`text-base ${theme.accent}`}>
        {profile.designation}
        {profile.company && (
          <span className={`text-sm ml-1 ${theme.textSecondary}`}>
            @ {profile.company}
          </span>
        )}
      </p>

      {profile.tagline && (
        <blockquote
          className={`text-sm italic border-l-4 pl-3 ${theme.cardBorder} ${theme.textSecondary}`}
        >
          {profile.tagline}
        </blockquote>
      )}
    </div>
  </div>
);

/* ---------------------------------------------------
   STICKY BUTTONS
---------------------------------------------------- */
const StickyButtons = ({ saveContact, open, theme }) => (
  <div
    className={`fixed bottom-0 left-0 right-0 p-3 ${theme.bg} backdrop-blur-sm flex gap-3 border-t ${theme.cardBorder} md:hidden z-99`}
  >
    <button
      onClick={saveContact}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${theme.cardBorder} ${theme.accent} ${theme.shadow}`}
    >
      <UserPlus size={16} /> Save
    </button>

    <button
      onClick={open}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${theme.buttonBg} ${theme.buttonText} ${theme.shadow}`}
    >
      <Send size={16} /> Connect
    </button>
  </div>
);

/* ---------------------------------------------------
   SOCIAL LINKS
---------------------------------------------------- */
const SocialLinks = ({ socials = [], theme, trackEvent }) => {
  if (!socials.length) return null;

  return (
    <div
      className={`flex items-center flex-wrap gap-4 px-4 m-4 border-t pt-4 ${theme.cardBorder}`}
    >
      <span className={`text-sm ${theme.textSecondary}`}>Connect:</span>

      {socials.map(({ icon: Icon, url, platform }) => {
        const safeURL = url.startsWith("http") ? url : `https://${url}`;
        return (
          <button
            key={platform}
            onClick={() =>
              trackEvent(EVENT_TYPES.SOCIAL(platform.toLowerCase()), {
                href: url,
                platform,
              }) || window.open(safeURL, "_blank")
            }
            className="p-2 rounded-full hover:scale-110 transition"
          >
            <Icon className={`${theme.accent} w-6 h-6`} />
          </button>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------
   MAIN CONTENT
---------------------------------------------------- */
const MainContent = ({
  profile,
  actions,
  services,
  youtubeId,
  theme,
  serviceHeading,
  trackEvent,
}) => (
  <div className="px-4 pt-5">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-5">
        <QuickActions actions={actions} theme={theme} trackEvent={trackEvent} />

        {profile.about && (
          <div
            className={`p-5 rounded-xl ${theme.cardBg} ${theme.cardBorder} ${theme.shadow}`}
          >
            <h2 className={`text-lg font-bold mb-3 ${theme.text}`}>About Me</h2>

            {profile.about.split("\n\n").map((p, i) => (
              <p
                key={i}
                className={`text-sm leading-relaxed ${theme.textSecondary} mb-3`}
              >
                {p}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-8 pb-16">
        {services.length > 0 && (
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>
              {serviceHeading}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {services.map((s, i) => (
                <div
                  key={i}
                  onClick={() =>
                    trackEvent(EVENT_TYPES.SERVICE_VIEW, { service: s.title })
                  }
                  className={`p-5 rounded-xl cursor-pointer ${theme.cardBg} ${theme.cardBorder} ${theme.shadow}`}
                >
                  <h3 className={`text-lg font-semibold ${theme.text}`}>
                    {s.title}
                  </h3>
                  <p className={`text-sm mt-2 ${theme.textSecondary}`}>
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {youtubeId && (
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>
              Introduction Video
            </h2>

            <div
              onClick={() => trackEvent(EVENT_TYPES.YOUTUBE_OPEN)}
              className={`aspect-video rounded-xl overflow-hidden cursor-pointer ${theme.shadow}`}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------
   QUICK ACTIONS
---------------------------------------------------- */
const QuickActions = ({ actions, theme, trackEvent }) => (
  <div
    className={`p-5 rounded-xl ${theme.cardBg} ${theme.cardBorder} ${theme.shadow}`}
  >
    <h2 className={`text-lg font-bold mb-3 ${theme.text}`}>Quick Contact</h2>

    <div className="space-y-3">
      {actions.map((a, i) => (
        <div
          key={i}
          onClick={() => {
            trackEvent(a.event, { label: a.label, href: a.href });
            window.open(a.href, "_blank");
          }}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:scale-[1.01] transition ${theme.cardBg} ${theme.cardBorder}`}
        >
          <div className="flex items-center gap-3">
            <a.icon className={`${theme.accent} w-5 h-5`} />
            <div>
              <p className={`text-sm ${theme.text}`}>{a.label}</p>
              <p className={`text-xs ${theme.textSecondary}`}>{a.subtitle}</p>
            </div>
          </div>
          <ChevronRight className={`${theme.textSecondary}`} />
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------
   CONNECT MODAL
---------------------------------------------------- */
const ConnectModal = ({ close, control, submit, theme, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 z-50">
    <div
      className={`w-full max-w-md rounded-xl overflow-hidden ${theme.cardBg} ${theme.cardBorder} ${theme.shadow}`}
    >
      <div className={`px-5 py-4 border-b ${theme.cardBorder}`}>
        <h3 className={`text-lg font-bold ${theme.text}`}>Connect With Me</h3>
      </div>

      <form onSubmit={submit} className="px-5 py-6 space-y-4">
        <Input
          name="leadName"
          label="Your Name"
          control={control}
          rules={{ required: "Name is required" }}
          placeholder="Enter your name"
          inputClass={`${theme.inputBg} ${theme.inputBorder}`}
        />

        <Input
          name="placeWeMet"
          label="Place we met"
          control={control}
          rules={{ required: "Required" }}
          placeholder="Eg: Event, Office, Shop"
          inputClass={`${theme.inputBg} ${theme.inputBorder}`}
        />

        <PhoneInputField
          name="contactNumber"
          label="Contact Number"
          control={control}
          rules={{ required: "Required" }}
          inputClass={`${theme.inputBg} ${theme.inputBorder}`}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={close}
            className={`w-1/2 py-2 rounded-lg border ${theme.cardBorder} ${theme.textSecondary}`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-1/2 py-2 rounded-lg ${theme.buttonBg} ${theme.buttonText}`}
          >
            {isSubmitting ? "Please wait…" : "Send & Open WA"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
