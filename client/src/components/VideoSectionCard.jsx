import { FiYoutube } from "react-icons/fi";
import { EVENT_TYPES } from "../constants/eventTypes";

const extractYoutubeId = (urlOrId) => {
  if (!urlOrId) return "";

  // If it's already an ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;

  try {
    const url = new URL(urlOrId);

    // Handle normal watch URL
    if (url.searchParams.get("v")) {
      return url.searchParams.get("v");
    }

    // Handle youtu.be short URL
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }
  } catch (_) {
    // If invalid URL, fallback
    return urlOrId;
  }

  return urlOrId;
};

const VideoSectionCard = ({ youtubeId, trackEvent }) => {
  const id = extractYoutubeId(youtubeId);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-3 border-gray-200">
        <FiYoutube className="text-gray-900 w-6 h-6" />
        Introduction Video
      </h2>

      <div
        onClick={() => trackEvent(EVENT_TYPES.YOUTUBE_OPEN)}
        className="aspect-video rounded-lg overflow-hidden cursor-pointer transition-all shadow-xl hover:shadow-2xl border border-gray-200"
      >
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          className="w-full h-full"
          allowFullScreen
          title="Introduction Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default VideoSectionCard;
