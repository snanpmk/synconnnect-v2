import React from "react";

const Button = ({ children, type = "button", onClick, className = "" }) => (
  <button type={type} onClick={onClick} className={\`px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition \${className}\`}>
    {children}
  </button>
);

export default Button;
