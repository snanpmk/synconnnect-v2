import { useMemo } from "react";
import Input from "../../../../components/inputs/Input";
import { PLATFORM_ICONS } from "../../../../constants/socialIcons";
import { useFieldArray } from "react-hook-form";
import { Check, Users } from "lucide-react";

const StepSocials = ({ control, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
    rules: {
      validate: (value) =>
        value.some((s) => s.url && s.url.trim()) ||
        "Please select at least one social platform and provide its URL.",
    },
  });

  // Convert fields array to a Set for quick lookup of selected platforms
  const selectedPlatforms = useMemo(
    () => new Set(fields.map((field) => field.platform)),
    [fields]
  );

  const availablePlatforms = useMemo(() => Object.keys(PLATFORM_ICONS), []);

  const handleTogglePlatform = (platform) => {
    const isSelected = selectedPlatforms.has(platform);

    if (isSelected) {
      const index = fields.findIndex((f) => f.platform === platform);
      if (index !== -1) {
        remove(index);
      }
    } else {
      // Append new social link with a required platform and empty url
      append({ platform: platform, url: "" });
    }
  };

  return (
    <>
      <div className={`mb-6 p-4 rounded-lg bg-lime-100`}>
        <h3 className="font-semibold text-base mb-3 flex items-center text-lime-700">
          <Check className="w-4 h-4 mr-2" />
          1. Select Your Presence
        </h3>
        <p className={`text-sm text-gray-600 mb-4`}>
          Choose the platforms you want to display on your profile.
        </p>

        <div className="flex flex-wrap gap-3">
          {availablePlatforms.map((platform) => {
            const isSelected = selectedPlatforms.has(platform);
            const { icon: Icon, color } = PLATFORM_ICONS[platform];

            return (
              <button
                key={platform}
                type="button"
                onClick={() => handleTogglePlatform(platform)}
                className={`flex items-center px-3 py-2 text-sm rounded-full transition-all border shadow-sm ${
                  isSelected
                    ? `bg-primary text-white border-primary-hover`
                    : `bg-white border-gray-200 text-gray-600 hover:bg-gray-100`
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    isSelected ? "text-white" : color
                  }`}
                />
                {platform}
                {isSelected && <Check className="w-4 h-4 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-base mb-3 flex items-center text-lime-700">
          <Users className="w-4 h-4 mr-2" />
          2. Enter URLs
        </h3>
        {fields.length === 0 && (
          <p className={`text-gray-600 italic text-sm`}>
            No platforms selected. Please choose platforms above to proceed.
          </p>
        )}
        {/* Use Input component with mapped fields for RHF integration */}
        {fields.map((field, index) => {
          const { icon: Icon } = PLATFORM_ICONS[field.platform];

          return (
            <div key={field.id}>
              <Input
                name={`socialLinks.${index}.url`}
                label={`${field.platform} URL`}
                icon={Icon}
                control={control}
                rules={{
                  required: `${field.platform} URL is required`,
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i,
                    message: "Enter a valid URL",
                  },
                }}
                placeholder={`Enter your full ${field.platform} link here...`}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default StepSocials;
