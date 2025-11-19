import React from "react";
import useGetData from "../api/useGetData";
import { useNavigate } from "react-router-dom";

const HasProfileSetup = ({ children }) => {
  console.log(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetData({
    url: `/user/?id=${localStorage.getItem("userId")}`,
    queryKey: ["user"],
  });

  console.log(data?.data?.setupStatus);
  const isProfileSetup = data?.data?.setupStatus;

  if (!isProfileSetup) {
    navigate("/setup");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children}</>;
};

export default HasProfileSetup;
