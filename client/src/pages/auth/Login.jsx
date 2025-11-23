import { useNavigate } from "react-router-dom";
import synconnectTypoGraphy from "../../assets/brand/typography/synconnect-text-logo.svg";
import googleIcon from "../../assets/icons/google.svg";
import useGoogleAuthApi from "./hooks/useGoogleAuthApi";
import MovingDots from "../../components/ui/MovingDots";

const LoginHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center mb-8 sm:mb-10">
      <div className="relative inline-block mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-400 rounded-2xl blur-3xl opacity-40 animate-pulse"></div>
        <div className="relative">
          <img
            src={synconnectTypoGraphy}
            alt="SynConnect Logo"
            className="w-48 sm:w-56 md:w-64 mx-auto drop-shadow-2xl cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
      <p className="text-zinc-400 text-sm sm:text-base">
        Sign in to continue to your account
      </p>
    </div>
  );
};

const GoogleSignInButton = ({ onLogin }) => (
  <div className="flex w-full justify-center">
    <button
      onClick={onLogin}
      className="border border-neutral-50 cursor-pointer flex items-center justify-center gap-3 w-full sm:w-80 glass-card transition-all duration-200 font-medium py-2.5 sm:py-3 rounded-xl mt-7 shadow-md"
    >
      <img src={googleIcon} alt="Google Icon" className="w-[30px] h-[30px]" />
      <span className="text-sm sm:text-base font-semibold text-gray-100">
        Sign in with Google
      </span>
    </button>
  </div>
);

const Divider = () => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-zinc-800"></div>
    </div>
    <div className="relative flex justify-center text-xs sm:text-sm">
      <span className="px-4 bg-zinc-950/80 text-zinc-500">
        Quick & Secure Access
      </span>
    </div>
  </div>
);

const TermsAndPrivacyInfo = () => (
  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed text-center">
      By continuing, you agree to our{" "}
      <span className="text-primary font-semibold hover:underline cursor-pointer">
        Terms of Service
      </span>{" "}
      and{" "}
      <span className="text-primary font-semibold hover:underline cursor-pointer">
        Privacy Policy
      </span>
    </p>
  </div>
);

const LoginCard = ({ onLogin }) => (
  <div className="">
    <LoginHeader />
    <div className="space-y-4 sm:space-y-6">
      <GoogleSignInButton onLogin={onLogin} />
      <Divider />
      <TermsAndPrivacyInfo />
    </div>
  </div>
);

const LoginFooter = () => (
  <div className="text-center mt-6 sm:mt-8 space-y-1 sm:space-y-2">
    <p className="text-zinc-500 text-xs sm:text-sm">
      Don't have an account?{" "}
      <span className="text-primary font-semibold hover:underline cursor-pointer">
        Sign up with Google
      </span>
    </p>
    <p className="text-zinc-600 text-[10px] sm:text-xs">
      Secure authentication powered by Google
    </p>
  </div>
);

const LoginBackgroundWrapper = ({ children }) => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
    <MovingDots />
    <div className="absolute -inset-50 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-lime-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] rounded-full bg-emerald-500/20 blur-3xl"></div>
    </div>
    <div
      className={`relative max-w-md w-full transition-all duration-1000 transform `}
    >
      {children}
    </div>
  </div>
);

const LoginPage = () => {
  const { onLogin } = useGoogleAuthApi();

  return (
    <LoginBackgroundWrapper>
      <LoginCard onLogin={onLogin} />
      <LoginFooter />
    </LoginBackgroundWrapper>
  );
};

export default LoginPage;
