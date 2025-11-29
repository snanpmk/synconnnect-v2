import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { FiPhone } from "react-icons/fi";
import { COUNTRIES_DATA } from "../../constants/countries";

const Phone = FiPhone;

const defaultPhoneState = {
  countryCode: "IN",
  dialCode: "+91",
  phoneNumber: "",
};

const PhoneInputField = ({
  name,
  label,
  control,
  rules,
  disabled = false,
  ...props
}) => {
  const defaultCountry = useMemo(
    () => COUNTRIES_DATA.find((c) => c.code === "IN") || COUNTRIES_DATA[0],
    []
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultPhoneState}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedCountry =
          COUNTRIES_DATA.find((c) => c.code === value?.countryCode) ||
          defaultCountry;

        return (
          <div className="mb-4">
            <label
              htmlFor={name}
              className=" text-sm font-semibold text-gray-700 mb-1  items-center gap-2"
            >
              {label}
              {rules?.required && <span className="text-red-500">*</span>}
            </label>

            {/* This container must have w-full to match the width of the Input component */}
            <div
              className={`flex items-center w-full bg-white rounded-xl border transition-all duration-200 ${
                error
                  ? "border-red-500 shadow-sm"
                  : "border-gray-300 hover:border-gray-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              }`}
            >
              {/* Country Dropdown */}
              <select
                disabled={disabled}
                value={selectedCountry.code}
                onChange={(e) => {
                  const selected = COUNTRIES_DATA.find(
                    (c) => c.code === e.target.value
                  );
                  onChange({
                    ...value,
                    countryCode: selected.code,
                    dialCode: selected.dialCode,
                  });
                }}
                // FIX: Setting width back to w-[100px]. This is often the tightest width for flags + dial code.
                className={`
                  px-3 py-3 text-sm w-[90px] bg-transparent border-r border-gray-200 
                  focus:outline-none cursor-pointer rounded-l-xl
                  ${
                    disabled
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {COUNTRIES_DATA.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.dialCode}
                  </option>
                ))}
              </select>

              {/* Phone Number Input */}
              <input
                type="tel"
                id={name}
                disabled={disabled}
                value={value?.phoneNumber || ""}
                onChange={(e) =>
                  onChange({ ...value, phoneNumber: e.target.value })
                }
                // flex-1 ensures this input takes up all remaining space.
                className={`
                  w-full px-3 py-3 text-sm rounded-r-xl bg-transparent
                  focus:outline-none placeholder-gray-400 
                  ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                `}
                placeholder="98765 43210"
                {...props}
              />
            </div>

            {error && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default PhoneInputField;
