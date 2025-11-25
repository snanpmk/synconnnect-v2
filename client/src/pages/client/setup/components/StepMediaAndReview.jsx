import { Star } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Input from "../../../../components/inputs/Input";
import PhotoUpload from "../../../../components/inputs/PhotoUpload";
import { useWatch } from "react-hook-form";

// --- Step 3: Media & Reviews ---
const StepMediaAndReview = ({ control, userType }) => {
  const indiUser = userType === "individual";
  const businessUser = userType === "business";
  return (
    <>
      {/* add a field for profile photo if indi */}
      {indiUser && (
        <PhotoUpload
          name="profilePhoto" // This registers the field with RHF
          label="Profile Photo"
          control={control}
          aspectRatio={"square"}
          maxFileSize={5 * 1024 * 1024}
          rules={{ required: "A profile photo is required." }}
        />
      )}

      <PhotoUpload
        name="coverPhoto" // This registers the field with RHF
        label="Cover Photo"
        control={control}
        aspectRatio={"landscape"}
        maxFileSize={10 * 1024 * 1024}
        rules={{ required: "A cover photo is required for the listing." }}
      />
      <Input
        name="youtubeVideoUrl"
        label="YouTube Video ID (Optional)"
        icon={FaYoutube}
        control={control} // Added control prop
        placeholder="e.g., jndWxpCzO5g"
      />
      {businessUser && (
        <Input
          name="googleReviewLink"
          label="Public Review Link (Optional)"
          icon={Star}
          control={control} // Added control prop
          placeholder="e.g., https://g.page/r/..."
          // rules with proper regex pattern to look like a proper link
          rules={{
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: "Please enter a valid URL",
            },
          }}
        />
      )}
    </>
  );
};

export default StepMediaAndReview;
