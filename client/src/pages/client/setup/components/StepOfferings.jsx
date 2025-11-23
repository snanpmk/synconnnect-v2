import { BookOpen, Briefcase, Plus, Type, X } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import Input from "../../../../components/inputs/Input";

const StepOfferings = ({ control, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const currentOfferings = watch("services");

  return (
    <>
      <Input
        name="servicesHeading"
        label="Services Section Heading (Custom)"
        icon={Briefcase}
        control={control}
        rules={{ required: "Heading is required" }}
        placeholder="e.g., Our Key Services"
      />

      <p className={`text-sm text-gray-600 mb-4`}>
        Define your key services (Max 4).
      </p>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={`p-4 border border-gray-200 rounded-lg bg-gray-50 relative shadow-sm`}
          >
            <button
              onClick={() => remove(index)}
              type="button"
              className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 rounded-full bg-white transition"
              title="Remove Offering"
            >
              <X className="w-4 h-4" />
            </button>
            <span className={`block mb-2 font-semibold text-primary`}>
              Offering #{index + 1}
            </span>

            <Input
              name={`services.${index}.title`}
              label="Title"
              icon={Type}
              control={control}
              rules={{ required: "Title is required" }}
              placeholder="e.g., Custom SaaS Dev"
            />
            <Input
              name={`services.${index}.description`}
              label="Description"
              icon={BookOpen}
              control={control}
              rules={{ required: "Description is required" }}
              isTextarea
              rows={2}
              placeholder="e.g., End-to-end cloud-native development."
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => append({ title: "", description: "" })}
        type="button"
        className={`mt-4 w-full p-3 text-sm font-semibold rounded-lg text-white transition-colors shadow-md ${
          currentOfferings?.length >= 4
            ? "bg-gray-400 cursor-not-allowed"
            : `bg-primary hover:bg-primary-hover`
        }`}
        disabled={currentOfferings?.length >= 4}
      >
        <Plus className="w-5 h-5 inline-block mr-2" />
        Add Offering ({currentOfferings?.length || 0} / 4 Max)
      </button>
    </>
  );
};

export default StepOfferings;
