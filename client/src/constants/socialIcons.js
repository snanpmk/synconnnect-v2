import {
  // Web / General
  SiAboutdotme,
  SiSubstack,
  SiHashnode,
  SiWordpress,
  SiMedium,
  SiGhost,

  // Social Media
  SiFacebook,
  SiInstagram,
  SiX,
  SiLinkedin,
  SiTiktok,
  SiYoutube,
  SiWhatsapp,
  SiTelegram,
  SiDiscord,

  // Professional / Portfolio
  SiBehance,
  SiDribbble,
  SiFigma,
  SiCanva,
  SiGithub,
  SiGitlab,
  SiCodepen,

  // Freelancing & Jobs
  SiFiverr,
  SiUpwork,
  SiFreelancer,
  SiToptal,

  // E-commerce
  SiAmazon,
  SiShopify,
  SiEtsy,

  // Payments
  SiPaypal,
  SiStripe,
  SiGooglepay,
  SiPhonepe,
  SiPaytm,

  // Other
  SiSpotify,
  SiGooglemaps,
  SiGoogle,
  SiSlack,
} from "react-icons/si";
import { IoGlobeSharp } from "react-icons/io5";

export const PLATFORM_ICONS = {
  // Web & Blogging
  Website: { icon: IoGlobeSharp, color: "text-gray-700" },
  Substack: { icon: SiSubstack, color: "text-orange-500" },
  Hashnode: { icon: SiHashnode, color: "text-blue-500" },
  WordPress: { icon: SiWordpress, color: "text-blue-700" },
  Medium: { icon: SiMedium, color: "text-black" },
  Ghost: { icon: SiGhost, color: "text-purple-600" },

  // Social Media (Most Common)
  Facebook: { icon: SiFacebook, color: "text-blue-600" },
  Instagram: { icon: SiInstagram, color: "text-pink-600" },
  X: { icon: SiX, color: "text-black" },
  LinkedIn: { icon: SiLinkedin, color: "text-blue-700" },
  TikTok: { icon: SiTiktok, color: "text-black" },
  YouTube: { icon: SiYoutube, color: "text-red-600" },
  // WhatsApp: { icon: SiWhatsapp, color: "text-green-500" },
  Telegram: { icon: SiTelegram, color: "text-blue-500" },
  Discord: { icon: SiDiscord, color: "text-indigo-500" },

  // Professional & Creative
  Behance: { icon: SiBehance, color: "text-blue-600" },
  Dribbble: { icon: SiDribbble, color: "text-pink-500" },
  Figma: { icon: SiFigma, color: "text-red-500" },
  Canva: { icon: SiCanva, color: "text-blue-500" },
  GitHub: { icon: SiGithub, color: "text-gray-800" },
  GitLab: { icon: SiGitlab, color: "text-orange-600" },
  CodePen: { icon: SiCodepen, color: "text-black" },

  // Freelancing & Work
  Fiverr: { icon: SiFiverr, color: "text-green-500" },
  Upwork: { icon: SiUpwork, color: "text-green-600" },
  Freelancer: { icon: SiFreelancer, color: "text-blue-500" },
  Toptal: { icon: SiToptal, color: "text-blue-600" },

  // E-commerce
  Amazon: { icon: SiAmazon, color: "text-black" },
  Shopify: { icon: SiShopify, color: "text-green-600" },
  Etsy: { icon: SiEtsy, color: "text-orange-600" },

  // Payments (Essential)
  PayPal: { icon: SiPaypal, color: "text-blue-600" },
  Stripe: { icon: SiStripe, color: "text-indigo-500" },
  GooglePay: { icon: SiGooglepay, color: "text-green-500" },
  PhonePe: { icon: SiPhonepe, color: "text-purple-600" },
  Paytm: { icon: SiPaytm, color: "text-blue-600" },

  // Other Useful
  Spotify: { icon: SiSpotify, color: "text-green-500" },
  GoogleMaps: { icon: SiGooglemaps, color: "text-blue-600" },
  Google: { icon: SiGoogle, color: "text-blue-500" },
  Slack: { icon: SiSlack, color: "text-purple-700" },
};

// list available social  media here - VALUE,LABEL,PLACEHOLDER
export const AVAILABLE_SOCIAL_PLATFORMS = [
  {
    value: "website",
    label: "Website",
    placeholder: "https://www.yourwebsite.com",
    icon: PLATFORM_ICONS.Website.icon,
    color: PLATFORM_ICONS.Website.color,
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourprofile",
    icon: PLATFORM_ICONS.LinkedIn.icon,
    color: PLATFORM_ICONS.LinkedIn.color,
  },
  {
    value: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourprofile",
    icon: PLATFORM_ICONS.Instagram.icon,
    color: PLATFORM_ICONS.Instagram.color,
  },
  {
    value: "x",
    label: "X (Twitter)",
    placeholder: "https://x.com/yourprofile",
    icon: PLATFORM_ICONS.X.icon,
    color: PLATFORM_ICONS.X.color,
  },
  {
    value: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourprofile",
    icon: PLATFORM_ICONS.Facebook.icon,
    color: PLATFORM_ICONS.Facebook.color,
  },
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/yourchannel",
    icon: PLATFORM_ICONS.YouTube.icon,
    color: PLATFORM_ICONS.YouTube.color,
  },
  {
    value: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourprofile",
    icon: PLATFORM_ICONS.TikTok.icon,
    color: PLATFORM_ICONS.TikTok.color,
  },
  {
    value: "github",
    label: "GitHub",
    placeholder: "https://github.com/yourprofile",
    icon: PLATFORM_ICONS.GitHub.icon,
    color: PLATFORM_ICONS.GitHub.color,
  },
  {
    value: "behance",
    label: "Behance",
    placeholder: "https://www.behance.net/yourprofile",
    icon: PLATFORM_ICONS.Behance.icon,
    color: PLATFORM_ICONS.Behance.color,
  },
  {
    value: "dribbble",
    label: "Dribbble",
    placeholder: "https://dribbble.com/yourprofile",
    icon: PLATFORM_ICONS.Dribbble.icon,
    color: PLATFORM_ICONS.Dribbble.color,
  },
  {
    value: "medium",
    label: "Medium",
    placeholder: "https://medium.com/@yourprofile",
    icon: PLATFORM_ICONS.Medium.icon,
    color: PLATFORM_ICONS.Medium.color,
  },
  {
    value: "telegram",
    label: "Telegram",
    placeholder: "https://t.me/yourprofile",
    icon: PLATFORM_ICONS.Telegram.icon,
    color: PLATFORM_ICONS.Telegram.color,
  },
  {
    value: "googleMaps",
    label: "Google Maps",
    placeholder: "https://goo.gl/maps/yourlocation",
    icon: PLATFORM_ICONS.GoogleMaps.icon,
    color: PLATFORM_ICONS.GoogleMaps.color,
  },
  {
    value: "googleReview",
    label: "Google Review",
    placeholder: "https://g.page/yourbusiness/review",
    icon: PLATFORM_ICONS.Google.icon,
    color: PLATFORM_ICONS.Google.color,
  },
  {
    value: "calendar",
    label: "Calendar/Booking",
    placeholder: "https://calendly.com/yourbooking",
    icon: PLATFORM_ICONS.Google.icon, // Using Google icon as a generic calendar icon
    color: PLATFORM_ICONS.Google.color,
  },
  {
    value: "threads",
    label: "Threads",
    placeholder: "https://threads.net/@yourprofile",
    icon: SiAboutdotme, // Placeholder, consider a Threads specific icon if available
    color: "text-black",
  },
  {
    value: "snapchat",
    label: "Snapchat",
    placeholder: "https://snapchat.com/add/yourprofile",
    icon: SiAboutdotme, // Placeholder, consider a Snapchat specific icon if available
    color: "text-yellow-400",
  },
  {
    value: "onlineStore",
    label: "Online Store",
    placeholder: "https://yourstore.com",
    icon: SiShopify, // Using Shopify as a generic store icon
    color: PLATFORM_ICONS.Shopify.color,
  },
  {
    value: "tripAdvisor",
    label: "TripAdvisor",
    placeholder: "https://www.tripadvisor.com/yourprofile",
    icon: SiAboutdotme, // Placeholder
    color: "text-green-600",
  },
  {
    value: "zomato",
    label: "Zomato",
    placeholder: "https://www.zomato.com/yourrestaurant",
    icon: SiAboutdotme, // Placeholder
    color: "text-red-500",
  },
  {
    value: "swiggy",
    label: "Swiggy",
    placeholder: "https://www.swiggy.com/yourrestaurant",
    icon: SiAboutdotme, // Placeholder
    color: "text-orange-500",
  },
  {
    value: "justDial",
    label: "JustDial",
    placeholder: "https://www.justdial.com/yourbusiness",
    icon: SiAboutdotme, // Placeholder
    color: "text-red-700",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/yournumber",
    icon: SiWhatsapp,
    color: "text-green-500",
  },
  {
    value: "phonepe",
    label: "PhonePe",
    placeholder: "https://phonepe.com/yourid",
    icon: PLATFORM_ICONS.PhonePe.icon,
    color: PLATFORM_ICONS.PhonePe.color,
  },
  {
    value: "paytm",
    label: "Paytm",
    placeholder: "https://paytm.com/yourid",
    icon: PLATFORM_ICONS.Paytm.icon,
    color: PLATFORM_ICONS.Paytm.color,
  },
  {
    value: "googlepay",
    label: "Google Pay",
    placeholder: "https://g.pay/yourid",
    icon: PLATFORM_ICONS.GooglePay.icon,
    color: PLATFORM_ICONS.GooglePay.color,
  },
];
