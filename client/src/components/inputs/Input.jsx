import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  variant = "client",
  ...props
}) => {
  const baseClass = "w-full p-3 border rounded focus:ring focus:outline-none";

  const variantClass = {
    admin: "border-gray-400 focus:ring-blue-400",
    client: "border-gray-300 focus:ring-blue-300",
    store: "border-gray-300 focus:ring-green-300",
  };

  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 font-semibold">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`${baseClass} ${variantClass[variant]}`}
        {...props}
      />
    </div>
  );
};

export default Input;
