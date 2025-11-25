import React, { useEffect } from "react";
import useGetData from "../api/useGetData";
import { useNavigate } from "react-router-dom";
import useUserDetailStore from "../pages/client/setup/store/useUserDetailStore";
import useAuthStore from "../store/useAuthStore";

const HasProfileSetup = ({ children }) => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  const { setUser } = useUserDetailStore();

  const { data, isLoading, isError, error } = useGetData({
    url: `/user/public?id=${userId}`,
    queryKey: ["user", userId],
    enabled: !!userId, // prevent invalid fetch
  });

  // Store user in Zustand only when data is ready
  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data]);

  // Redirect if setup incomplete
  useEffect(() => {
    if (!isLoading && data?.data?.setupStatus === false) {
      navigate("/setup");
    }
  }, [isLoading, data, navigate]);

  if (!userId) return <div>No user detected</div>;

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return <>{children}</>;
};

export default HasProfileSetup;
