import { AlertTriangle } from "lucide-react";

const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-3 mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 font-medium flex items-start shadow-md">
      <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorBanner;
