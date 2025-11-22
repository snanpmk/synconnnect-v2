import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessTokenFromRefresh } from "../pages/auth/utils/getAccessTokenFromRefresh";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    if (!isLoggedIn) {
      const attemptTokenRefresh = async () => {
        try {
          const newToken = await getAccessTokenFromRefresh();
          if (newToken) {
            setAccessToken(newToken);
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        } finally {
          setIsLoading(false);
        }
      };

      attemptTokenRefresh();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, setAccessToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div
          className="w-12 h-12 border-4 border-t-4  border-gray-200 rounded-full animate-spin"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!useAuthStore.getState().accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
