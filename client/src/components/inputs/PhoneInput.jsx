import React, { useMemo, useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";
import { createPortal } from "react-dom";
import { COUNTRIES_DATA } from "../../constants/countries";

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
  placeholder = "",
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);

  const defaultCountry = useMemo(
    () => COUNTRIES_DATA.find((c) => c.code === "IN") || COUNTRIES_DATA[0],
    []
  );

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase();
    return COUNTRIES_DATA.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!triggerRef.current) return;
      if (
        !triggerRef.current.contains(e.target) &&
        !document.getElementById("dropdown-root")?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDropdown = () => {
    if (!triggerRef.current || disabled) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });

    setOpen(true);
    setSearch(""); // reset search
  };

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
          <div className="mb-4 relative">
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
              {label}
              {rules?.required && <span className="text-red-500">*</span>}
            </label>

            <div
              className={`flex items-center w-full bg-white rounded-xl border transition-all ${
                error
                  ? "border-red-500 shadow-sm"
                  : "border-gray-300 hover:border-gray-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              }`}
              ref={triggerRef}
            >
              {/* COUNTRY SELECT (CLICK TO OPEN DROPDOWN) */}
              <div
                className={`px-3 py-3 w-[140px] border-r border-gray-200 rounded-l-xl cursor-pointer flex items-center justify-between ${
                  disabled && "bg-gray-100 cursor-not-allowed"
                }`}
                onClick={openDropdown}
              >
                <span className="text-sm">
                  {selectedCountry.flag} {selectedCountry.dialCode}
                </span>
                <FiChevronDown className="ml-2 text-gray-500" />
              </div>

              {/* PHONE INPUT */}
              <input
                type="tel"
                disabled={disabled}
                value={value?.phoneNumber || ""}
                onChange={(e) =>
                  onChange({ ...value, phoneNumber: e.target.value })
                }
                className={`w-full px-3 py-3 text-sm rounded-r-xl bg-transparent focus:outline-none placeholder-gray-400 ${
                  disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
                placeholder={placeholder}
                {...props}
              />
            </div>

            {/* MODAL-SAFE DROPDOWN (PORTAL) */}
            {open &&
              position &&
              createPortal(
                <div
                  className="z-[9999] bg-white border border-gray-300 rounded-xl shadow-xl p-2"
                  style={{
                    position: "fixed",
                    top: position.top,
                    left: position.left,
                    width: position.width,
                  }}
                >
                  {/* SEARCH INPUT */}
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="w-full px-3 py-2 mb-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />

                  {/* LIST */}
                  <div className="max-h-56 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <div
                        key={country.code}
                        onClick={() => {
                          onChange({
                            ...value,
                            countryCode: country.code,
                            dialCode: country.dialCode,
                          });
                          setOpen(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2"
                      >
                        <span>{country.flag}</span>
                        <span>{country.label}</span>
                        <span className="ml-auto text-gray-500">
                          {country.dialCode}
                        </span>
                      </div>
                    ))}

                    {filteredCountries.length === 0 && (
                      <p className="text-center text-gray-400 py-2 text-sm">
                        No results found
                      </p>
                    )}
                  </div>
                </div>,
                document.getElementById("dropdown-root")
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

export default PhoneInputField;
