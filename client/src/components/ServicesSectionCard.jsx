import { Briefcase, ChevronRight } from "lucide-react";
import { EVENT_TYPES } from "../constants/eventTypes";

const ServicesSectionCard = ({ services, heading, trackEvent }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-3 border-gray-200">
      <Briefcase size={20} className="text-gray-900" />
      {heading || "My Services"}
    </h2>

    <div className="grid grid-cols-1 gap-3 pt-3">
      {services.map((s, i) => (
        <div
          key={i}
          onClick={() =>
            trackEvent(EVENT_TYPES.SERVICE_VIEW, { service: s.title })
          }
          className="group p-4 rounded-lg bg-white hover:bg-gray-50/50 border border-gray-200 hover:border-gray-300 cursor-pointer transition-all shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition">
            {s.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {s.description}
          </p>

          {s.waHref && (
            <a
              href={s.waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the parent div's onClick from firing
                trackEvent(EVENT_TYPES.SERVICE_INQUIRY, {
                  service: s.title,
                  href: s.waHref,
                });
              }}
              className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Know More
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ServicesSectionCard;
