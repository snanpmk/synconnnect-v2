import { BookOpen, Tag, Type } from "lucide-react";
import Input from "../../../../components/inputs/Input";

export const StepCoreInfo = ({ control }) => {
  return (
    <>
      <Input
        name="name"
        label="Business Name"
        icon={Type}
        control={control}
        rules={{ required: "Business Name is required" }}
        placeholder="e.g., GreenThumb Landscaping"
      />
      <Input
        name="tagline"
        label="Tagline/Motto"
        icon={Tag}
        control={control}
        rules={{ required: "Tagline is required" }}
        placeholder="e.g., Growing your perfect space."
      />
      <Input
        name="detailedAbout"
        label="Detailed About (Brief)"
        icon={BookOpen}
        control={control}
        rules={{ required: "About is required" }}
        isTextarea
        rows={4}
        placeholder="Briefly describe what your business does, who it serves, and its primary mission (max 2-3 sentences)."
      />
    </>
  );
};
