import React from "react";
import { Controller } from "react-hook-form";

const Select = ({
  name,
  label,
  icon: Icon,
  control,
  rules,
  options = [],
  placeholder = "Select...",
  onChange,
  onBlur,
  selectClassName = "",
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const baseClasses = `w-full p-3 border-gray-200 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm shadow-sm`;
        const errorClasses = error ? "border-red-500" : "";
        const finalClasses = `${baseClasses} ${errorClasses} ${selectClassName}`;

        return (
          <div className="mb-4">
            <label
              htmlFor={name}
              className="text-sm font-medium text-gray-600 mb-1 flex items-center"
            >
              {Icon && <Icon className="w-4 h-4 mr-2 text-primary" />}
              {label}
              {rules?.required && <span className="text-red-500">*</span>}
            </label>

            <select
              {...field}
              id={name}
              onChange={(e) => {
                field.onChange(e.target.value);
                onChange && onChange(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                onBlur && onBlur(e);
              }}
              className={finalClasses}
              {...props}
            >
              <option value="" disabled>
                {placeholder}
              </option>

              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {error && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default Select;
