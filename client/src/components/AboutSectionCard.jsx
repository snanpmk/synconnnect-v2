import { Feather } from "lucide-react";

const AboutSectionCard = ({ about, aboutHeading }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3 border-gray-200">
      <Feather size={20} className="text-gray-900" />
      {aboutHeading}
    </h2>
    <div className="space-y-4 pt-2">
      {about.split("\n\n").map((p, i) => (
        <p key={i} className="text-base text-gray-700 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  </div>
);

export default AboutSectionCard;
