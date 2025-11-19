import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  Award,
  BookOpen,
  MonitorPlay,
  Lightbulb,
  UserPlus,
  Share2,
  Send,
  Image,
  ChevronRight,
} from "lucide-react";
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useThemeStore } from "../../store/useThemeStore";

// --- DUMMY DATA ---
const DUMMY_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1549645902-601d32912ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1582213146447-79730596328a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1507925921958-81d3c01c0172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=600",
];
const DUMMY_YOUTUBE_ID = "jndWxpCzO5g";

const profile = {
  name: "Sinan Pmk",
  designation: "Software Developer",
  company: "Finnest Technologies",
  about: "Crafting digital realities through modern MERN stack development.",
  detailedAbout: `As a passionate **Full-Stack Software Developer** at Finnest Technologies, I specialize in building robust, scalable, and user-centric web applications. My expertise lies primarily in the **MERN stack (MongoDB, Express, React, Node.js)**, where I focus on delivering end-to-end solutions, from high-performance REST APIs to dynamic, responsive front-end interfaces.

  I thrive on solving complex technical challenges, writing **clean, efficient, and well-documented code**, and actively participating in the entire software development lifecycle (SDLC). I am a strong advocate for **Agile methodologies** and collaborative team environments, constantly seeking opportunities for continuous learning and technology adoption to drive product innovation and quality.
  
  My mission is to transform innovative ideas into impactful, commercially viable digital products that provide exceptional user experiences.`,
  photo:
    "https://firebasestorage.googleapis.com/v0/b/synconnect-1526.appspot.com/o/2025-10-02_12%3A41%3A41_image.jpg?alt=media&token=7bbbc02c-ba8d-4146-87c1-d51a4399eia",
  coverPhoto:
    "https://firebasestorage.googleapis.com/v0/b/synconnect-1526.appspot.com/o/2024-01-28_19%3A48%3A02_image.jpg?alt=media&token=ba815ff6-6994-47db-ad5a-eb7ae0ff6026",
};

const socials = [
  { icon: FaLinkedin, url: "#" },
  { icon: FaXTwitter, url: "#" },
  { icon: FaInstagram, url: "#" },
  { icon: Globe, url: "#" },
  { icon: FaGithub, url: "#" },
];

const quickActions = [
  { icon: Phone, label: "Call", subtitle: "+91 7736689774" },
  { icon: MessageCircle, label: "WhatsApp", subtitle: "+91 7736689774" },
  { icon: Mail, label: "Email", subtitle: "pmksinan@gmail.com" },
  { icon: MapPin, label: "Location", subtitle: "San Francisco, CA" },
];

const services = [
  {
    icon: BookOpen,
    title: "Interactive Live Classes",
    description: "Engaging and conceptual online sessions for all subjects.",
  },
  {
    icon: MonitorPlay,
    title: "Recorded Lecture Library",
    description: "Access to a vast library of HD recorded classes 24/7.",
  },
  {
    icon: Award,
    title: "Personalized Mentorship",
    description: "One-on-one guidance and doubt clearing sessions.",
  },
  {
    icon: Lightbulb,
    title: "Exam-Oriented Notes & Tests",
    description: "Curated study material and regular mock assessments.",
  },
];

// --- HELPER COMPONENTS ---

const ActionButtons = ({ current }) => {
  const handleAddToContacts = () => console.log("VCard Download initiated.");
  const handleConnectWithMe = () =>
    console.log(
      "Redirecting to primary connection method (e.g., WhatsApp/Chat)."
    );
  const handleShare = () =>
    console.log(
      "Sharing link copied to clipboard or native share sheet opened."
    );

  return (
    <div
      className={`fixed -bottom-10 md:inset-0 left-0 right-0 p-4 md:static md:p-0 ${current.bg} shadow-[0_-5px_15px_rgba(0,0,0,0.05)] md:shadow-none z-40 transition-all duration-300`}
    >
      <div className="flex items-center gap-3 w-full max-w-5xl mx-auto md:px-0">
        {/* Ghost Button */}
        <button
          onClick={handleAddToContacts}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border ${current.border} ${current.accent} hover:${current.accentLightBg} transition-all duration-300 active:scale-[0.98] whitespace-nowrap hover:shadow-lg`}
        >
          <UserPlus className="w-4 h-4" />
          Save Contact
        </button>
        {/* Primary Solid Button */}
        <button
          onClick={handleConnectWithMe}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white ${current.accentBg} ${current.accentHover} transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg`}
        >
          <Send className="w-4 h-4" />
          Connect Now
        </button>
        {/* Share button moved inside the main content area for better flow on desktop */}
        <button
          onClick={handleShare}
          className={`p-3 rounded-xl border ${current.border} ${current.textSecondary} hover:${current.accentLightBg} transition-all duration-300 active:scale-[0.9] hidden md:block hover:shadow-md`}
          aria-label="Share profile"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const QuickActionItem = ({ icon: Icon, label, subtitle, current, onClick }) => (
  <div
    onClick={onClick}
    // Updated background to current.accentLightBg, removed border and added shadow for pop
    className={`flex items-center text-start justify-between gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer group hover:opacity-90 active:scale-[0.99] shadow-sm hover:shadow-md hover:-translate-y-0.5 border-transparent ${current.accentLightBg}`}
  >
    <div className="flex items-center gap-4">
      <Icon className={`${current.accent} w-5 h-5 flex-shrink-0`} />
      <div>
        <p className={`text-sm font-semibold ${current.text}`}>{label}</p>
        <p className={`text-xs ${current.textSecondary}`}>{subtitle}</p>
      </div>
    </div>
    <ChevronRight
      className={`w-5 h-5 ${current.textSecondary} group-hover:${current.accent} group-hover:translate-x-1 transition-all duration-300`}
    />
  </div>
);

const ServiceCard = ({ icon: Icon, title, description, current, index }) => (
  <div
    // Updated background to current.accentLightBg, added shadow and removed border
    className={`flex flex-col p-6 rounded-xl border-transparent ${current.accentLightBg} transition-all duration-300 transform group hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] shadow-md`}
  >
    <div
      className={`p-3 rounded-xl self-start mb-4 ${current.accentLightBg} flex items-center justify-center`}
    >
      <Icon
        className={`w-6 h-6 ${current.accent} group-hover:rotate-6 transition-transform duration-300`}
      />
    </div>
    <h3 className={`text-lg font-bold ${current.text}`}>{title}</h3>
    <p className={`text-sm mt-2 ${current.textSecondary}`}>{description}</p>
    <a
      href="#"
      className={`text-sm font-bold mt-4 inline-block ${current.accent} hover:underline transition-colors flex items-center`}
    >
      Enroll Now{" "}
      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
    </a>
  </div>
);

// --- MAIN COMPONENT ---
export default function MinimalProfile() {
  const {
    currentTheme: theme,
    themeConfigs: themes,
    setCurrentTheme: setTheme,
  } = useThemeStore();

  const current = themes[theme];

  const handleQuickActionClick = (label) =>
    console.log(`Action clicked: ${label}`);

  const ProfileHeader = () => (
    <div className={`relative w-full pt-4 `}>
      {/* Cover Photo */}
      <div className="h-44 sm:h-56 w-full overflow-hidden relative z-10 rounded-xl">
        <img
          src={profile.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
      </div>

      {/* Main Header Block (Identity) */}
      <div className={`-mt-16 sm:-mt-20 px-4 md:px-0 w-full relative z-20`}>
        <div className={`w-full`}>
          {/* Profile Photo and Identity Block */}
          <div className="flex md:mt-30 flex-col md:flex-row items-start md:items-end w-full">
            {/* Profile Photo - floatOrb animation left for visual appeal */}
            <img
              src={profile.photo}
              alt={profile.name}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 ${current.border} object-cover flex-shrink-0 transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl hover:rotate-1 mb-4 md:mb-0 animate-floatOrb shadow-lg`}
            />

            {/* Identity & Tagline */}
            <div className="flex-1 md:ml-6 md:mt-0 self-center">
              <h1
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${current.text} transition duration-300 hover:opacity-90`}
              >
                {profile.name}
              </h1>
              <p
                className={`text-xl font-medium tracking-wide ${current.accent} mt-1`}
              >
                {profile.designation}
                <span
                  className={`text-base ${current.textSecondary} font-normal ml-2`}
                >
                  @ {profile.company}
                </span>
              </p>
              <blockquote
                className={`mt-4 text-base italic ${current.textSecondary} border-l-4 pl-4 ${current.accentBorder} opacity-70`}
              >
                {profile.about}
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SocialsSection = () => (
    <div
      className={`flex items-center gap-4 px-4 md:px-0 mt-8 pt-4 border-t ${current.border}`}
    >
      <h3
        className={`text-sm font-semibold uppercase ${current.textSecondary} flex-shrink-0`}
      >
        Follow:
      </h3>
      <div className="flex gap-4">
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${profile.name}'s social profile`}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-125 hover:bg-opacity-10 ${
              current.accent
            } hover:${
              current.accentLightBg
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${current.accent
              .replace("text-", "")
              .replace("-400", "-500")
              .replace("-300", "-500")}`}
          >
            <s.icon className={`w-5 h-5`} />
          </a>
        ))}
      </div>
    </div>
  );

  const DetailedAboutSection = () => (
    // Updated background to current.accentLightBg and added shadow
    <div
      className={`p-6 rounded-xl border-transparent ${current.accentLightBg} shadow-lg`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${current.text} border-b ${current.border} pb-3`}
      >
        <UserPlus
          className={`inline-block w-5 h-5 mr-2 mb-1 ${current.accent}`}
        />{" "}
        My Development Philosophy
      </h2>
      {profile.detailedAbout.split("\n\n").map((paragraph, index) => (
        <p
          key={index}
          className={`text-sm ${current.textSecondary} mb-3 leading-relaxed`}
          dangerouslySetInnerHTML={{
            __html: paragraph.replace(
              /\*\*(.*?)\*\*/g,
              `<strong class="${current.accent.replace(
                "text-",
                ""
              )} font-semibold">$1</strong>`
            ),
          }}
        />
      ))}
    </div>
  );

  const QuickActionsSection = () => (
    // Updated background to current.accentLightBg and added shadow
    <div
      className={`p-6 rounded-xl border-transparent ${current.accentLightBg} shadow-lg`}
    >
      <h2
        className={`text-xl font-bold mb-5 ${current.text} border-b ${current.border} pb-3`}
      >
        <MessageCircle
          className={`inline-block w-5 h-5 mr-2 mb-1 ${current.accent}`}
        />{" "}
        Quick Contact
      </h2>
      <div className="space-y-3">
        {quickActions.map((a, i) => (
          <QuickActionItem
            key={i}
            icon={a.icon}
            label={a.label}
            subtitle={a.subtitle}
            current={current}
            onClick={() => handleQuickActionClick(a.label)}
          />
        ))}
      </div>
    </div>
  );

  const ServicesSection = () => (
    <div className={`pt-8`}>
      <h2
        className={`text-2xl font-extrabold mb-7 ${current.text} border-b ${current.border} pb-3`}
      >
        <BookOpen
          className={`inline-block w-6 h-6 mr-3 mb-1 ${current.accent}`}
        />{" "}
        Academic Offerings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-8 gap-6">
        {" "}
        {/* Increased large screen gap */}
        {services.map((s, i) => (
          <ServiceCard
            key={i}
            icon={s.icon}
            title={s.title}
            description={s.description}
            current={current}
            index={i}
          />
        ))}
      </div>
    </div>
  );

  const GallerySection = () => (
    <div className={`pt-8`}>
      <h2
        className={`text-2xl font-extrabold mb-7 ${current.text} border-b ${current.border} pb-3`}
      >
        <Image className={`inline-block w-6 h-6 mr-3 mb-1 ${current.accent}`} />{" "}
        Campus & Student Life
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:gap-6 gap-4">
        {" "}
        {/* Increased large screen gap */}
        {DUMMY_GALLERY_IMAGES.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-lg transition-shadow duration-300 hover:shadow-2xl"
          >
            <img
              src={src}
              alt={`Gallery image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const ThemeSwitcher = () => (
    // Updated background to current.accentLightBg and added shadow
    <div
      className={`p-6 rounded-xl border-transparent ${current.accentLightBg} shadow-lg`}
    >
      <h3
        className={`text-xl font-bold mb-5 ${current.text} border-b ${current.border} pb-3`}
      >
        <Lightbulb
          className={`inline-block w-5 h-5 mr-2 mb-1 ${current.accent}`}
        />{" "}
        Switch Theme
      </h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(themes).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            aria-label={`Switch to ${key} theme`}
            title={key.split(/(?=[A-Z])/).join(" ")}
            className={`w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 ${
              val.accentBg
            } ${
              theme === key
                ? "ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-current scale-110"
                : "opacity-70 hover:opacity-100 hover:scale-105"
            } transition-all duration-200`}
            style={{
              borderColor: theme === key ? "currentColor" : "",
              ringColor: themes[key].accentColor,
            }}
          />
        ))}
      </div>
    </div>
  );

  const VideoSection = () => (
    <div className={`pt-8`}>
      <h2
        className={`text-2xl font-extrabold mb-7 ${current.text} border-b ${current.border} pb-3`}
      >
        <FaYoutube
          className={`inline-block w-6 h-6 mr-3 mb-1 ${current.accent}`}
        />{" "}
        Video Introduction
      </h2>
      <div className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl transition-shadow duration-500 hover:shadow-cyan-500/50">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${DUMMY_YOUTUBE_ID}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-in; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${current.bg} flex flex-col items-center`}
    >
      <div className="max-w-5xl w-full px-4 md:px-20 space-y-8 pb-32 md:pb-20">
        {/* Profile Header (Photo, Name, Tagline) */}
        <ProfileHeader />

        {/* Action Buttons (Sticky on mobile, static on desktop) */}
        <ActionButtons current={current} />

        {/* Social Icons */}
        <SocialsSection />

        {/* Main Sections */}
        {/* FIX: Increased top padding for better separation on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full pt-10">
          {/* Sidebar - Grouped Card Sections */}
          <div className="lg:col-span-1 space-y-8 order-1 lg:order-1">
            <DetailedAboutSection />
            <QuickActionsSection />
            <ThemeSwitcher />
          </div>

          {/* Core Content */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-2">
            {" "}
            {/* Reduced vertical spacing for large screens */}
            <ServicesSection />
            <GallerySection />
            <VideoSection />
          </div>
        </div>
      </div>
    </div>
  );
}
