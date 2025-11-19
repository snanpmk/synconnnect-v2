import React from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import usePostData from "../../../api/usePostData";
import useAuthStore from "../../../store/useAuthStore";
import toast from "react-hot-toast";

const useGoogleAuthApi = () => {
  const GOGGLE_AUTH_API = "/auth/login";
  const { setUser, setAccessToken } = useAuthStore.getState();
  const navigate = useNavigate();
  const clearIntendedPath = () => {
    localStorage.removeItem("intendedPath");
  };
  const intendedPath = localStorage.getItem("intendedPath");
  console.log(intendedPath);

  const googleLoginMutation = usePostData({});

  const onSuccess = (res) => {
    const { user, accessToken, message } = res;
    console.log(res);
    localStorage.setItem("userId", user?._id);
    setUser(user);
    setAccessToken(accessToken);
    toast.success(message, "success");
    const isAdmin = user.isSuperAdmin;
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate(intendedPath);
    }
    clearIntendedPath();
  };

  const onError = (error) => {
    console.error("Google Auth Code Login Error:", error);
    toast.error("Login failed. Please try again.", "error");
  };

  const handleGoogleLogin = async (codeResponse) => {
    try {
      const { code } = codeResponse;
      if (!code) throw new Error("Authorization code missing");
      googleLoginMutation.mutate(
        { url: GOGGLE_AUTH_API, data: { code } },
        {
          onSuccess: (res) => onSuccess(res),
          onError: (error) => onError(error),
        }
      );
    } catch (error) {
      console.error("Google Auth Code Login Error:", error);
      toast.error("Login failed. Please try again.", "error");
    }
  };

  const onLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: (err) => console.log("Login Failed:", err),
    flow: "auth-code",
  });

  return { onLogin };
};

export default useGoogleAuthApi;
