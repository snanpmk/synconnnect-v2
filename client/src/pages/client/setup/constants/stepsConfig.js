import { Briefcase, Building2, MapPin, Star, Users } from "lucide-react";
import { StepCoreInfo } from "../components/StepCoreInfo";
import StepContact from "../components/StepContact";
import StepMediaAndReview from "../components/StepMediaAndReview";
import StepSocials from "../components/StepSocials";
import StepOfferings from "../components/StepOfferings";

export const stepsConfig = [
  {
    id: 1,
    title: "Core Business Info",
    icon: Building2,
    component: StepCoreInfo,
    description: "Name, tagline, and quick summary.",
    fields: ["businessName", "businessCategory", "tagline", "detailedAbout"],
  },
  {
    id: 2,
    title: "Contact Details",
    icon: MapPin,
    component: StepContact,
    description: "Phone, email, and physical address.",
    // RHF validation handles nested fields automatically, but list them for manual trigger
    fields: ["phone", "whatsapp", "email", "location"],
  },
  {
    id: 3,
    title: "Media & Reviews",
    icon: Star,
    component: StepMediaAndReview,
    description: "Cover photo and public links.",
    fields: ["coverPhoto", "youtubeVideoUrl", "googleReviewLink"], // Only coverPhoto is required/validated by RHF rules
  },
  {
    id: 4,
    title: "Social Presence",
    icon: Users,
    component: StepSocials,
    description: "Select and link your website and social media profiles.",
    fields: ["socials"], // useFieldArray validation handles required fields
  },
  {
    id: 5,
    title: "Services & Offerings",
    icon: Briefcase,
    component: StepOfferings,
    description: "Your top 4 products or services.",
    fields: ["offeringsHeading", "offerings"],
  },
];
