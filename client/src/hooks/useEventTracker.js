// src/hooks/useEventTracker.js

import usePostData from "../api/usePostData";

export default function useEventTracker(userId) {
  const eventMutation = usePostData();

  const trackEvent = (type, meta = {}) => {
    if (!userId) return;

    try {
      eventMutation.mutate({
        url: "/event",
        method: "POST",
        data: {
          userId,
          type,
          meta,
        },
      });
    } catch (error) {
      console.log("Event tracking error:", error);
    }
  };

  return trackEvent;
}
