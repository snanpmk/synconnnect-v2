import { Star } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Input from "../../../../components/inputs/Input";
import PhotoUpload from "../../../../components/inputs/PhotoUpload";

// --- Step 3: Media & Reviews ---
const StepMediaAndReview = ({ control }) => {
  // Removed unnecessary watch, setValue, trigger props since they weren't used outside of coverPhoto watch
  return (
    <>
      <PhotoUpload
        name="coverPhoto" // This registers the field with RHF
        label="Cover Photo"
        control={control}
        ratio="landscape"
        maxFileSize={10 * 1024 * 1024}
        rules={{ required: "A cover photo is required for the listing." }}
      />
      <Input
        name="youtubeId"
        label="YouTube Video ID (Optional)"
        icon={FaYoutube}
        control={control} // Added control prop
        placeholder="e.g., jndWxpCzO5g"
      />
      <Input
        name="googleReviewLink"
        label="Public Review Link (Optional)"
        icon={Star}
        control={control} // Added control prop
        placeholder="e.g., https://g.page/r/..."
      />
    </>
  );
};

export default StepMediaAndReview;
