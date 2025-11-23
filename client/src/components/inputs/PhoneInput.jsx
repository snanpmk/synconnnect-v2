import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Controller } from "react-hook-form";

import { FiPhone, FiChevronDown, FiSearch } from "react-icons/fi";
import { COUNTRIES_DATA } from "../../constants/countries";
const Phone = FiPhone;
const ChevronDown = FiChevronDown;
const Search = FiSearch;

const defaultPhoneState = {
  countryCode: "IN",
  dialCode: "+91",
  phoneNumber: "",
};

const CountryDropdownMenu = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    filteredCountries,
    selectedCountry,
    handleCountryChange,
  }) => (
    <div
      className={`absolute top-full left-0 mt-1 w-full sm:w-80 md:w-96 max-h-64 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-20`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 sticky top-0 bg-white border-b border-gray-100">
        <div className="relative">
          {/* React Icon used here */}
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search country or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className={`w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary`}
          />
        </div>
      </div>

      {filteredCountries.length > 0 ? (
        filteredCountries.map((country) => (
          <button
            key={country.code}
            type="button"
            onClick={() => handleCountryChange(country)}
            className={`w-full text-left p-3 flex items-center justify-between text-sm text-gray-900 hover:bg-lime-100 transition-colors ${
              country.code === selectedCountry.code ? "bg-lime-100" : ""
            }`}
          >
            <span className="flex items-center">
              <span className="mr-3 text-xl">{country.flag}</span>
              {country.label}
            </span>
            <span className={`font-medium text-gray-600`}>
              {country.dialCode}
            </span>
          </button>
        ))
      ) : (
        <p className={`p-4 text-sm text-gray-600 text-center`}>
          No countries found.
        </p>
      )}
    </div>
  )
);

const PhoneInputField = ({
  name,
  label,
  control,
  rules,
  disabled = false,
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const defaultCountry = useMemo(
    () => COUNTRIES_DATA.find((c) => c.code === "IN") || COUNTRIES_DATA[0],
    []
  );

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return COUNTRIES_DATA;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return COUNTRIES_DATA.filter(
      (country) =>
        country.label.toLowerCase().includes(lowerCaseSearch) ||
        country.dialCode.includes(searchTerm)
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultPhoneState}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const currentCountryCode = value?.countryCode || defaultCountry.code;
        const selectedCountry =
          COUNTRIES_DATA.find((c) => c.code === currentCountryCode) ||
          defaultCountry;

        const handleCountryChange = useCallback(
          (country) => {
            if (disabled) return;
            onChange({
              ...value,
              dialCode: country.dialCode,
              countryCode: country.code,
            });
            setIsDropdownOpen(false);
            setSearchTerm("");
          },
          [disabled, onChange, value]
        );

        const inputBaseClasses = `flex-1 w-full p-3 border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm shadow-sm`;
        const inputErrorClasses = error
          ? "border-red-500 ring-red-500/50"
          : "border-l-0";
        const inputDisabledClasses = disabled
          ? "bg-gray-100 cursor-not-allowed text-gray-500"
          : "";

        const buttonDisabledClasses = disabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : `bg-gray-50 hover:bg-gray-100`;

        return (
          <div className="mb-4">
            <label
              htmlFor={name}
              className={`block text-sm font-medium text-gray-600 mb-1 flex items-center`}
            >
              {/* React Icon used here */}
              <Phone className="w-4 h-4 mr-2 text-primary" />
              {label}
              {rules?.required && <span className="text-red-500">*</span>}
            </label>

            <div
              className={`flex w-full relative rounded-lg border ${
                error ? "border-red-500" : "border-gray-200"
              }`}
              ref={dropdownRef}
            >
              {/* Country Code Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((p) => !p)}
                disabled={disabled}
                className={`flex-shrink-0 flex items-center justify-center p-3 h-full rounded-l-lg border-r border-gray-200 ${buttonDisabledClasses} transition-all text-sm relative z-10 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                style={{ width: "120px" }}
              >
                <span className="mr-2 text-lg">{selectedCountry.flag}</span>
                <span
                  className={`font-medium ${
                    disabled ? "text-gray-500" : "text-gray-900"
                  }`}
                >
                  {selectedCountry.dialCode}
                </span>
                {/* React Icon used here */}
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${
                    isDropdownOpen && !disabled ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Phone Number Input */}
              <input
                type="tel"
                id={name}
                disabled={disabled}
                value={value?.phoneNumber || ""}
                onChange={(e) =>
                  onChange({ ...value, phoneNumber: e.target.value })
                }
                className={`
                  ${inputBaseClasses}
                  ${inputErrorClasses}
                  ${inputDisabledClasses}
                  rounded-r-lg
                  !border-l-0
                `}
                placeholder="e.g., 98765 43210"
                {...props}
              />

              {/* Dropdown Menu (Rendered conditionally) */}
              {isDropdownOpen && !disabled && (
                <CountryDropdownMenu
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filteredCountries={filteredCountries}
                  selectedCountry={selectedCountry}
                  handleCountryChange={handleCountryChange}
                />
              )}
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
