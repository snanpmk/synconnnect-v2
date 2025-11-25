import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import usePostData from "../../../api/usePostData";
import useGetData from "../../../api/useGetData";
import { useFirebaseImageUpload } from "../../../hooks/useFirebaseImageUpload";
import { processImage } from "../../../utils/ImageCompress&resize";

import {
  defaultPhoneState,
  INITIAL_FORM_STATE,
} from "./constants/InitialFormState";

import { useProfileSteps } from "./hooks/useProfileSteps";

import SetupHeaderBar from "./components/SetupHeaderBar";
import ErrorBanner from "./components/ErrorBanner";
import SetupTitle from "./components/SetupTitle";
import FooterNav from "./components/FooterNav";
import useAuthStore from "../../../store/useAuthStore";

export default function SetupScreenBusiness({ onSetupComplete }) {
  const userId = useAuthStore((state) => state.userId);

  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // 🔥 NEW HOOK (dynamic steps + icons + userType)
  // ─────────────────────────────────────────────
  const {
    stepsConfig,
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
  } = useProfileSteps();

  console.log(userType);

  // ─────────────────────────────────────────────
  // React Hook Form
  // ─────────────────────────────────────────────
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
    mode: "onBlur",
  });

  // ─────────────────────────────────────────────
  // Fetch Existing Profile data
  // ─────────────────────────────────────────────
  const { data: existingProfileRes, isLoading: isProfileLoading } = useGetData({
    queryKey: ["business-profile", userId],
    url: `/user/public?id=${userId}`,
  });

  useEffect(() => {
    if (existingProfileRes?.data) {
      const profileData = existingProfileRes.data;
      setUser(profileData);

      const fieldsToReset = {};
      for (const key in INITIAL_FORM_STATE) {
        if (profileData.hasOwnProperty(key)) {
          if (key === "phone" || key === "whatsapp") {
            fieldsToReset[key] = profileData[key] || { ...defaultPhoneState };
          } else if (key === "coverPhoto" || key === "profilePhoto") {
            fieldsToReset[key] = profileData[key] || {
              url: "",
              fullPath: "",
            };
            fieldsToReset[`${key}ExistingPath`] =
              profileData[key]?.fullPath || "";
          } else if (key === "socialLinks" || key === "services") {
            fieldsToReset[key] = profileData[key] || [];
          } else {
            fieldsToReset[key] = profileData[key];
          }
        } else {
          // If the profileData doesn't have the key, use the initial state default
          fieldsToReset[key] = INITIAL_FORM_STATE[key];
        }
      }

      // Special handling for useSameNumberForWhatsapp if it's not explicitly set in profileData
      if (!profileData.hasOwnProperty("useSameNumberForWhatsapp")) {
        fieldsToReset.useSameNumberForWhatsapp = true;
      }

      reset(fieldsToReset);
    }
  }, [existingProfileRes, reset, setValue, setUser]);

  // ─────────────────────────────────────────────
  // Image Upload Hooks
  // ─────────────────────────────────────────────
  const { upload, update } = useFirebaseImageUpload();

  // ─────────────────────────────────────────────
  // Validation per step
  // ─────────────────────────────────────────────
  const validateCurrentStep = async (stepId) => {
    const stepConfig = stepsConfig[stepId - 1];

    let fieldsToValidate = [];

    if (stepConfig.fields) {
      fieldsToValidate = stepConfig.fields
        .flat()
        .map((f) => {
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

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);

      if (!isValid) {
        const firstErrorKey = fieldsToValidate.find((k) => errors[k]);
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
    if (isValid) goToNextStep();
  };

  // ─────────────────────────────────────────────
  // Submit API Logic
  // ─────────────────────────────────────────────
  const { mutate: postData, isPending } = usePostData({
    onSuccess: () => navigate("/dashboard"),
    onError: (error) => toast.error(error?.message),
  });

  const onSubmit = async (data) => {
    const isValid = await validateCurrentStep(totalSteps);
    if (!isValid) return;

    if (!userId) {
      setValidationError(totalSteps, "User ID missing. Cannot submit profile.");
      return;
    }

    // write the same logic of cover photo to profile photo
    let profilePhoto = "";

    if (data.profilePhoto) {
      if (data.profilePhotoExistingPath) {
        if (data.profilePhoto instanceof File) {
          const processed = await processImage(data.profilePhoto, "square", {
            maxKB: 200,
            outputType: "image/jpeg",
            preserveAspectRatio: true,
          });

          profilePhoto = await update(
            processed,
            data.profilePhotoExistingPath,
            `users/${data?.email}/profile-image`
          );
        } else {
          profilePhoto = {
            url: data.profilePhoto.url,
            fullPath: data.profilePhotoExistingPath,
          };
        }
      } else if (data.profilePhoto instanceof File) {
        const processed = await processImage(data.profilePhoto, "square", {
          maxKB: 200,
          outputType: "image/jpeg",
          preserveAspectRatio: true,
        });

        profilePhoto = await upload(
          processed,
          `users/${data?.email}/profile-image`
        );
      }

      data.profilePhoto = profilePhoto;
    }

    let coverPhoto = "";

    console.log(data?.coverPhoto);
    console.log(data?.coverPhotoExistingPath);

    if (data.coverPhoto) {
      if (data.coverPhotoExistingPath) {
        if (data.coverPhoto instanceof File) {
          const processed = await processImage(data.coverPhoto, "banner", {
            maxKB: 400,
            outputType: "image/jpeg",
            preserveAspectRatio: true,
          });

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
          preserveAspectRatio: true,
        });

        coverPhoto = await upload(
          processed,
          `users/${data?.email}/cover-image`
        );
      }

      data.coverPhoto = coverPhoto;
    }

    const finalData = {
      ...data,
      userId: userId,
      accountType: user.accountType,
    };

    postData({
      url: `/setup/?id=${userId}`,
      data: finalData,
      method: "PUT",
    });
  };

  // ─────────────────────────────────────────────
  // Dynamic Step Rendering
  // ─────────────────────────────────────────────
  const currentStepData = stepsConfig[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;
  const CurrentStepIcon = currentStepData.icon;
  const currentStepError = validationErrors[currentStep];

  const componentProps = {
    control,
    watch,
    setValue,
    getValues,
    trigger,
    errors,
    userType,
  };

  // ─────────────────────────────────────────────
  // UI Rendering
  // ─────────────────────────────────────────────
  return (
    <>
      <title>Profile Setup</title>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="h-screen flex flex-col bg-white"
      >
        <SetupHeaderBar currentStep={currentStep} totalSteps={totalSteps} />

        <main className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="max-w-xl xl:max-w-3xl mx-auto">
            <ErrorBanner message={currentStepError} />

            <div className="p-0 space-y-4">
              <SetupTitle
                Icon={CurrentStepIcon}
                title={currentStepData.title}
                description={currentStepData.description}
              />

              <CurrentStepComponent {...componentProps} />
            </div>
          </div>
        </main>

        <FooterNav
          currentStep={currentStep}
          totalSteps={totalSteps}
          goToPrevStep={goToPrevStep}
          handleNextStep={handleNextStep}
          isPending={isPending}
          currentStepError={currentStepError}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          stepsConfig={stepsConfig}
          setCurrentStep={setCurrentStep}
        />
      </form>
    </>
  );
}
