import {
  BookOpen,
  Briefcase,
  Tag,
  Type,
  Building2,
  User,
  Layers,
} from "lucide-react";

import Input from "../../../../components/inputs/Input";
import { businessCategories } from "../../../../constants/businessCategories";
import Select from "../../../../components/inputs/Select";

export const StepCoreInfo = ({ control, userType }) => {
  const indiUser = userType === "individual";
  const businessUser = userType === "business";

  return (
    <>
      {indiUser && (
        <Input
          name="fullName"
          label="Full Name"
          icon={User}
          control={control}
          rules={{ required: "Full Name is required" }}
          placeholder="e.g., John Doe"
        />
      )}
      {businessUser && (
        <Input
          name="businessName"
          label="Business Name"
          icon={Building2}
          control={control}
          rules={{ required: "Business Name is required" }}
          placeholder="e.g., GreenThumb Landscaping"
        />
      )}

      {indiUser && (
        <>
          <Input
            name="designation"
            label="Designation"
            icon={Briefcase}
            control={control}
            rules={{ required: "Designation is required" }}
            placeholder="e.g., Software Engineer"
          />

          <Input
            name="companyName"
            label="Company Name"
            icon={Building2}
            control={control}
            rules={{ required: "Company Name is required" }}
            placeholder="e.g., Google"
          />
        </>
      )}

      <Input
        name="tagline"
        label="Tagline / Motto"
        icon={Tag}
        control={control}
        rules={{ required: "Tagline is required" }}
        placeholder="e.g., Growing your perfect space."
      />

      {businessUser && (
        <Select
          name="businessCategory"
          label="Business Category"
          icon={Layers}
          control={control}
          rules={{ required: "Business category is required" }}
          options={businessCategories}
          placeholder="Select your business category"
        />
      )}

      <Input
        name="detailedAbout"
        label="Detailed About (Brief)"
        icon={BookOpen}
        control={control}
        rules={{ required: "About is required" }}
        isTextarea
        rows={4}
        placeholder="Briefly describe what your business does (max 2–3 sentences)."
      />
    </>
  );
};
