import { useMemo } from "react";
import { Briefcase, Building2, MapPin, Star, Users } from "lucide-react";
import useProfileSetupStore from "../store/useProfileSetupStore";
import { StepCoreInfo } from "../components/StepCoreInfo";
import StepContact from "../components/StepContact";
import StepMediaAndReview from "../components/StepMediaAndReview";
import StepSocials from "../components/StepSocials";
import StepOfferings from "../components/StepOfferings";
import useUserDetailStore from "../store/useUserDetailStore";

export function useProfileSteps() {
  const {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    setCurrentStep,
    validationErrors,
    setValidationError,
  } = useProfileSetupStore();

  const { user, setUser } = useUserDetailStore();

  const userType = user?.accountType;
  const getDynamicTitle = (title) => {
    if (userType === "individual") {
      if (title === "Core Business Info") return "Personal Info";
      if (title === "Contact Details") return "Contact Info";
      if (title === "Media & Reviews") return "Media";
      if (title === "Social Presence") return "Social Profiles";
      if (title === "Services & Offerings") return "Skills & Services";
    }
    return title;
  };

  const getDynamicIcon = (icon) => {
    if (userType === "individual") {
      if (icon === Building2) return Users;
      if (icon === Briefcase) return Users;
    }
    return icon;
  };

  /** Final dynamic steps config */
  const stepsConfig = useMemo(() => {
    const base = [
      {
        id: 1,
        title: "Core Business Info",
        icon: Building2,
        component: StepCoreInfo,
        description: "Name, tagline, and quick summary.",
        fields: [
          "businessName",
          "businessCategory",
          "tagline",
          "detailedAbout",
          "designation",
          "companyname",
          "fullName",
        ],
      },
      {
        id: 2,
        title: "Contact Details",
        icon: MapPin,
        component: StepContact,
        description: "Phone, email, and physical address.",
        fields: ["phone", "whatsapp", "email"],
      },
      {
        id: 3,
        title: "Media & Reviews",
        icon: Star,
        component: StepMediaAndReview,
        description: "Cover photo and public links.",
        fields: ["coverPhoto", "youtubeVideoUrl", "googleReviewLink"],
      },
      {
        id: 4,
        title: "Social Presence",
        icon: Users,
        component: StepSocials,
        description: "Select and link your website and social media profiles.",
        fields: ["socials"],
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

    return base.map((step) => ({
      ...step,
      title: getDynamicTitle(step.title),
      icon: getDynamicIcon(step.icon),
    }));
  }, [userType]);

  return {
    stepsConfig, // <— MAIN dynamic config
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    setCurrentStep,
    validationErrors,
    setValidationError,
    user,
    userType,
    setUser,
  };
}
