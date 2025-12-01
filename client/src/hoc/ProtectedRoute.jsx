import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessTokenFromRefresh } from "../pages/auth/utils/getAccessTokenFromRefresh";
import useAuthStore from "../store/useAuthStore";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

const ProtectedRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserId = useAuthStore((state) => state.setUserId);

  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    if (!isLoggedIn) {
      const attemptTokenRefresh = async () => {
        try {
          const newToken = await getAccessTokenFromRefresh();
          if (newToken) {
            setAccessToken(newToken);
            // set user id in state
            console.log(newToken);

            const userId = getUserIdFromToken(newToken);
            console.log(userId);
            
            setUserId(userId);
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
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
          {/* Profile Link Shimmer */}
          <div className="p-5 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-3 w-full max-w-sm">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-72"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Setup card shimmer */}
          <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* KPI Cards Shimmer */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Shimmer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-white border rounded-xl"></div>
              <div className="h-64 bg-white border rounded-xl"></div>
            </div>
            <div className="h-64 bg-white border rounded-xl"></div>
          </div>

          {/* Footer Shimmer */}
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
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
