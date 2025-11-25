import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  if (!token || typeof token !== "string") return null;

  try {
    const decoded = jwtDecode(token);

    // Support: userId, id, _id (common patterns)
    return decoded?.userId || decoded?.id || decoded?._id || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
