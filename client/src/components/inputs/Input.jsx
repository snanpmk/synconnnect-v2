import React from "react";
import { Controller } from "react-hook-form";

const Input = ({
  name,
  label,
  icon: Icon,
  control,
  rules,
  isTextarea,
  rows,
  type = "text",
  placeholder,
  onChange,
  onBlur,
  inputClassName = "",
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const baseClasses = `w-full p-3 border-gray-200 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all text-sm shadow-sm`;
        const errorClasses = error ? "border-red-500" : "";
        const finalInputClasses = `${baseClasses} ${errorClasses} ${inputClassName}`;

        return (
          <div className="mb-4">
            <label
              htmlFor={name}
              className={`text-sm font-medium text-gray-600 mb-1 flex items-center`}
            >
              {Icon && <Icon className="w-4 h-4 mr-2 text-lime-500" />}
              {label}
              {rules?.required && <span className="text-red-500">*</span>}
            </label>
            {isTextarea ? (
              <textarea
                {...field}
                id={name}
                rows={rows}
                placeholder={placeholder}
                onChange={
                  onChange
                    ? (e) => {
                        field.onChange(e);
                        onChange(e);
                      }
                    : field.onChange
                }
                onBlur={
                  onBlur
                    ? (e) => {
                        field.onBlur();
                        onBlur(e);
                      }
                    : field.onBlur
                }
                className={`${finalInputClasses} resize-none`}
                {...props}
              />
            ) : (
              <input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                onChange={
                  onChange
                    ? (e) => {
                        field.onChange(e);
                        onChange(e);
                      }
                    : field.onChange
                }
                onBlur={
                  onBlur
                    ? (e) => {
                        field.onBlur();
                        onBlur(e);
                      }
                    : field.onBlur
                }
                className={finalInputClasses}
                {...props}
              />
            )}
            {error && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default Input;
