import {
  AlertTriangle,
  Briefcase,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import usePostData from "../../../api/usePostData";

import { useEffect } from "react";
import toast from "react-hot-toast";
import useGetData from "../../../api/useGetData";
import { useFirebaseImageUpload } from "../../../hooks/useFirebaseImageUpload";
import { processImage } from "../../../utils/ImageCompress&resize";
import StepContact from "./components/StepContact";
import { StepCoreInfo } from "./components/StepCoreInfo";
import StepMediaAndReview from "./components/StepMediaAndReview";
import StepOfferings from "./components/StepOfferings";
import StepSocials from "./components/StepSocials";
import useProfileSetupStore from "./store/useProfileSetupStore";

const defaultPhoneState = {
  dialCode: "+91",
  countryCode: "IN",
  phoneNumber: "",
};

const INITIAL_FORM_STATE = {
  // Step 1: Core Info
  businessName: "",
  businessCategory: "",
  tagline: "",
  detailedAbout: ``,

  // Step 2: Contact
  phone: { ...defaultPhoneState },
  whatsapp: { ...defaultPhoneState },
  email: "",
  location: "",
  useSameNumberForWhatsapp: true,

  // Step 3: Media & Reviews
  coverPhoto: "",
  existingCoverPhoto: {
    url: "",
    fullPath: "",
  },

  // youtubeId: "",
  googleReviewLink: "",
  youtubeVideoUrl: "",

  // Step 4: Socials (useFieldArray)
  socialLinks: [], // Start empty

  // Step 5: Services & Offerings (useFieldArray)
  servicesHeading: "Services",
  services: [],
};

const stepsConfig = [
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

// ====================================================================
// Main Parent Component
// ====================================================================

export default function SetupScreenBusiness({ onSetupComplete }) {
  const userId = localStorage?.getItem("userId");
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_FORM_STATE,
    mode: "onBlur", // Use onBlur for smoother field-level validation
  });

  const {
    data: existingProfileRes,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileFetchError,
  } = useGetData({
    queryKey: ["business-profile", userId],
    url: `/user/public?id=${userId}`,
  });

  console.log(existingProfileRes);

  useEffect(() => {
    if (existingProfileRes?.data) {
      // reset the state
      const profileData = existingProfileRes.data;

      // Map existing profile data to form fields
      reset({
        businessName: profileData.businessName || "",
        businessCategory: profileData.businessCategory || "",
        tagline: profileData.tagline || "",
        detailedAbout: profileData.detailedAbout || "",
        phone: profileData.phone || { ...defaultPhoneState },
        whatsapp: profileData.whatsapp || { ...defaultPhoneState },
        email: profileData.email || "",
        location: profileData.location || "",
        useSameNumberForWhatsapp:
          profileData.useSameNumberForWhatsapp !== undefined
            ? profileData.useSameNumberForWhatsapp
            : true,
        coverPhoto: profileData.coverPhoto || { url: "", fullPath: "" },
        coverPhotoExistingPath: profileData.coverPhoto?.fullPath || "",
        youtubeVideoUrl: profileData.youtubeVideoUrl || "",
        googleReviewLink: profileData.googleReviewLink || "",
        socialLinks: profileData.socialLinks || [],
        servicesHeading: profileData.servicesHeading || "Services",
        services: profileData.services || [],
      });
    }
  }, [existingProfileRes, reset, setValue]);

  const {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    setCurrentStep,
    validationErrors,
    setValidationError,
  } = useProfileSetupStore();

  const { upload, update } = useFirebaseImageUpload();

  const validateCurrentStep = async (stepId) => {
    const stepConfig = stepsConfig[stepId - 1];
    console.log(stepConfig);

    let fieldsToValidate = [];
    if (stepConfig.fields) {
      fieldsToValidate = stepConfig.fields
        .flat()
        .map((f) => {
          // Special handling for nested structures like phone.phoneNumber or offerings.*
          if (f === "phone" || f === "whatsapp")
            return [f + ".phoneNumber", f + ".countryCode"];
          if (f === "services")
            return getValues("services")
              .map((_, i) => [
                `services.${i}.title`,
                `services.${i}.description`,
              ])
              .flat();
          if (f === "socialLinks")
            return getValues("socialLinks")
              .map((_, i) => [`socialLinks.${i}.url`])
              .flat();
          return f;
        })
        .flat();
    }

    // Trigger validation for RHF-managed fields
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);

      if (!isValid) {
        // Find the first error message from RHF errors object
        const firstErrorKey = fieldsToValidate.find((key) => errors[key]);
        const firstError =
          errors[firstErrorKey]?.message ||
          "Please complete all required fields.";

        setValidationError(stepId, firstError);
        return false;
      }
    }

    return true;
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep(currentStep);

    if (isValid) {
      goToNextStep();
    }
  };

  const { mutate: postData, isPending } = usePostData({
    onSuccess: (data) => {
      // setSetupSuccess(true);
      console.log(data);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const onSubmit = async (data) => {
    const isValid = await validateCurrentStep(totalSteps);

    if (!isValid) {
      return;
    }

    if (!userId) {
      setValidationError(totalSteps, "User ID missing. Cannot submit profile.");
      return;
    }

    let coverPhoto = "";
    if (data.coverPhoto) {
      if (data.coverPhotoExistingPath) {
        if (data.coverPhoto instanceof File) {
          const processed = await processImage(data.coverPhoto, "banner", {
            maxKB: 400,
            outputType: "image/jpeg",
          });
          if (!processed) {
            alert("Image processing failed.");
            return;
          }
          coverPhoto = await update(
            processed,
            data.coverPhotoExistingPath,
            `users/${data?.email}/cover-image`
          );
        } else {
          coverPhoto = {
            url: data.coverPhoto.url,
            fullPath: data.coverPhotoExistingPath,
          };
        }
      } else if (data.coverPhoto instanceof File) {
        const processed = await processImage(data.coverPhoto, "banner", {
          maxKB: 400,
          outputType: "image/jpeg",
        });
        if (!processed) {
          alert("Image processing failed.");
          return;
        }
        console.log("2️⃣ Uploading new image...");
        coverPhoto = await upload(processed, `users/${userId}/cover-image`);
      } else {
        coverPhoto = null;
      }
      data.coverPhoto = coverPhoto;
    }

    const finalData = {
      ...data,
      userId: userId,
      accountType: "business",
    };

    const res = postData({
      url: `/setup/?id=${userId}`,
      data: finalData,
      method: "PUT",
    });

    console.log(res);
  };

  const currentStepData = stepsConfig[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;
  const CurrentStepIcon = currentStepData.icon;
  const currentStepError = validationErrors[currentStep];

  // Passed to all step components
  const componentProps = {
    control,
    watch,
    setValue,
    getValues,
    trigger,
    errors,
  };

  return (
    // Wrap the entire content in a form using RHF's handleSubmit
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`h-screen flex flex-col bg-white`}
    >
      {/* Header Bar */}
      <header
        className={`p-2 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm`}
      >
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className={`text-xl font-bold text-gray-900`}>Profile Setup</h1>
          <p className={`text-sm font-medium text-gray-600`}>
            Step {currentStep} / {totalSteps}
          </p>
        </div>
      </header>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className={`max-w-xl xl:max-w-3xl mx-auto`}>
          {/* Validation Error Banner */}
          {currentStepError && (
            <div
              className="p-3 mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 font-medium flex items-start shadow-md"
              role="alert"
            >
              <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{currentStepError}</span>
            </div>
          )}

          {/* Current Step Content Area */}
          <div className={`p-0 space-y-4`}>
            <div
              className={`flex items-start mb-4 border-b border-gray-200 pb-3`}
            >
              <CurrentStepIcon
                className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 text-primary`}
              />
              <div>
                <h2 className={`text-xl font-bold text-gray-900`}>
                  {currentStepData.title}
                </h2>
                <p className={`text-sm text-gray-600`}>
                  {currentStepData.description}
                </p>
              </div>
            </div>
            {/* Render the current step component with props */}
            <CurrentStepComponent {...componentProps} />
          </div>
        </div>
      </main>

      {/* Sticky Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-2xl z-30">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStep === 1 || isPending}
            className={`flex items-center px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-300 border border-gray-200 shadow-sm ${
              currentStep === 1 || isPending
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : `text-gray-600 hover:bg-gray-100`
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Pagination */}
          <div className="flex space-x-2">
            {stepsConfig.map((step) => {
              const isCurrent = step.id === currentStep;
              const isComplete = step.id < currentStep;

              return (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? `bg-primary-hover-dark scale-110 shadow-md`
                      : isComplete
                      ? "bg-primary hover:bg-primary-hover"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                  title={step.title}
                ></div>
              );
            })}
          </div>

          {/* Next / Submit Button */}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isPending}
              className={`flex items-center px-3 py-2 text-sm rounded-lg text-white font-semibold transition-all duration-300 shadow-md bg-primary hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button" // <— FIXED: prevent auto-submit
              disabled={!!currentStepError || isPending}
              onClick={() => handleSubmit(onSubmit)()}
              className={`flex items-center px-4 py-2 text-sm rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
                !currentStepError && !isPending
                  ? `bg-green-600 hover:bg-green-700`
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-1" />
                  Finish
                </>
              )}
            </button>
          )}
        </div>
      </footer>
    </form>
  );
}
