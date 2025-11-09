import api from "../api/axiosInstance.js";
const useFetcher = () => {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const jsonFetcher = async ({ url, method = "GET", data = null }) => {
    const config = {
      url: `${url}`,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data) {
      config.data = data;
    }
    const response = await api(config);
    return response.data;
  };
  return { jsonFetcher };
};

export default useFetcher;
