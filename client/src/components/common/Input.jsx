import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col mb-4">
    {label && <label className="mb-1 text-sm font-semibold text-gray-600">{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="p-3 border rounded-md focus:ring focus:ring-blue-300 outline-none" />
  </div>
);

export default Input;
