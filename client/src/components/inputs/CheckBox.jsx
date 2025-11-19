import { Controller } from "react-hook-form";

const Checkbox = ({ name, control, label, id, className = "" }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={`flex items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 ${className}`}
        >
          <input
            type="checkbox"
            id={id || name}
            checked={field.value}
            onChange={field.onChange}
            className="h-4 w-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
          />

          <label
            htmlFor={id || name}
            className="ml-3 text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        </div>
      )}
    />
  );
};

export default Checkbox;
