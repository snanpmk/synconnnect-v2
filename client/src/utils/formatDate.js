export const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
