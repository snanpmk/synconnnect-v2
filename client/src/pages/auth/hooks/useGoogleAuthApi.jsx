import React from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import usePostData from "../../../api/usePostData";
import useAuthStore from "../../../store/useAuthStore";
import toast from "react-hot-toast";
import { getUserIdFromToken } from "../../../utils/getUserIdFromToken";

const useGoogleAuthApi = () => {
  const GOGGLE_AUTH_API = "/auth/login";
  const { setUser, setAccessToken, setUserId } = useAuthStore.getState();
  const navigate = useNavigate();

  const googleLoginMutation = usePostData({});
  const isLoginPending = googleLoginMutation.isPending;

  const onSuccess = (res) => {
    const { user, accessToken, message } = res;
    const userId = getUserIdFromToken(accessToken);
    setUserId(userId);

    setUser(user);
    setAccessToken(accessToken);
    toast.success(message, "success");
    const isAdmin = user.isSuperAdmin;
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const onError = (error) => {
    console.error("Google Auth Code Login Error:", error);
    if (error?.response?.data?.message) {
      const adminContact = import.meta.env.VITE_APP_ADMIN_CONTACT;
      const whatsappLink = `https://wa.me/${adminContact}?text=Hello,%20I’m%20interested%20in%20subscribing%20to%20SynConnect.%20Kindly%20assist%20me%20with%20the%20subscription%20details.`;
      toast.error(
        <div>
          {error.response.data.message} <br />
          Please contact support{" "}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            here
          </a>
          .
        </div>,
        { duration: 8000 }
      );
    } else {
      toast.error("Login failed. Please try again.", "error");
    }
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

  return { onLogin, isLoginPending };
};

export default useGoogleAuthApi;
