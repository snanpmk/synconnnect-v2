import { ChevronRight, Phone } from "lucide-react";

const QuickContacts = ({ actions, trackEvent }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3 border-gray-200">
      <Phone size={20} className="text-gray-900" />
      Quick Actions
    </h2>

    <div className="space-y-1 pt-2">
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={() => {
            trackEvent(a.event, { label: a.label, href: a.href });
            window.open(
              a.href,
              a.label === "Call" || a.label === "Email" ? "_self" : "_blank"
            );
          }}
          className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border-b border-transparent transition group active:bg-gray-100"
        >
          {/* Clean, gray/white icon container */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-100 transition ring-1 ring-transparent group-hover:ring-gray-300">
            <a.icon className="text-gray-600 w-5 h-5 group-hover:text-gray-900 transition" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-base font-semibold text-gray-900">{a.label}</p>
            <p className="text-sm text-gray-500 truncate">{a.subtitle}</p>
          </div>
          <ChevronRight
            className="text-gray-400 group-hover:text-gray-900 flex-shrink-0 transition"
            size={20}
          />
        </button>
      ))}
    </div>
  </div>
);

export default QuickContacts;
