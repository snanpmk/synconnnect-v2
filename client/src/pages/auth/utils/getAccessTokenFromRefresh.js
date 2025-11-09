import axios from "axios";

export const getAccessTokenFromRefresh = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API_BASE_URL}/auth/refresh`,
      { withCredentials: true }
    );
    const token = await res.data.accessToken;
    console.log(token);

    return token;
  } catch (err) {
    console.warn("Refresh token failed:", err);

    return null;
  }
};
