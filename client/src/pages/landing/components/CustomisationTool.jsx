import { Form, Formik } from "formik";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { TEMPLATE_PRESETS } from "../constants/cardsData";
import { useLandingContext } from "../contexts/LandingContext";
import ColorPickerPro from "./ColorPickerPro";
import InputField from "./InputField";
import LogoUpload from "./LogoUpload";
import PatternSelector from "./PatternSelector";
import { PreviewCard } from "./PreviewCard";
import VerticalProgressBar from "./VerticalProgressBar";
import synconnectBrandingCard from "../../../assets/images/synconnect-branding-card.png";
import { useLandingStore } from "../../../store/useLandingStore";
import CheckoutModal from "./CheckoutModal";
import { useNavigate } from "react-router";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  designation: Yup.string().required("Designation is required"),
  companyName: Yup.string().required("Company Name is required"),
  logo: Yup.string().when("needLogo", {
    is: true,
    then: Yup.string().required("Logo is required"),
    otherwise: Yup.string().notRequired(),
  }),
  bgColor: Yup.string().required(),
  textColor: Yup.string().required(),
  accentColor: Yup.string().required(),
  pattern: Yup.string().required(),
});

const CustomisingTool = () => {
  const {
    selectedCardType,
    setIsDesignToolOpen,
    selectedOverlay,
    setSelectedOverlay,
    colorData,
    setColorData,
    getAccentColor,
    isDesignToolOpen,
  } = useLandingContext();

  const needLogo = selectedCardType?.productType === "client-custom";

  const initialValues = useMemo(
    () => ({
      fullName: "",
      designation: "",
      companyName: "",
      logo: needLogo ? "" : synconnectBrandingCard,
      bgColor: "#0b0b0b",
      textColor: "#ffffff",
      accentColor: "#67d861",
      pattern: "none",
    }),
    [needLogo]
  );

  const requiredFields = useMemo(
    () => [
      "fullName",
      "designation",
      "companyName",
      ...(needLogo ? ["logo"] : []),
    ],
    [needLogo]
  );

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Ref to access PreviewCard front/back for PDF
  const previewCardRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [downloadMode, setDownloadMode] = useState(null);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      // onSubmit={toCheckout}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
        const completedSteps = requiredFields.filter((f) => values[f]).length;
        const progress = Math.round(
          (completedSteps / requiredFields.length) * 100
        );

        return (
          <Form className={`w-full  px-2  `}>
            <main className="text-center w-full relative">
              <div className="mb-10 sticky top-0 md:mb-5 animate-in fade-in slide-in-from-left duration-300">
                <ChevronLeft
                  className="cursor-pointer text-primary hover:text-white transition-colors"
                  size={50}
                  onClick={() => setIsDesignToolOpen(false)}
                  aria-label="Back"
                  role="button"
                  tabIndex={0}
                />
              </div>
              {/* <div className="pointer-events-none opacity-[0.3]"> */}
              <div className="mb-5">
                <h1 className="font-semibold text-3xl md:text-5xl mb-5">
                  Design Your Smart <br />
                  <span className="text-primary">Business Card</span>
                </h1>
                <p>
                  Customize every detail and watch your design come to life.
                </p>
              </div>
              <div
                className={`flex md:flex-row flex-col gap-4 w-full ${
                  !isDesignToolOpen ? "max-h-screen overflow-hidden" : ""
                }`}
              >
                <div className="flex flex-col flex-1 gap-4 order-2 md:order-1">
                  <PersonalDetails />
                  {needLogo && <LogoUpload />}
                  <ColorPickerPro label="Card Background" />
                  {isMobile ? (
                    <div>
                      <PatternSelector
                        presets={TEMPLATE_PRESETS}
                        selectedOverlay={selectedOverlay}
                        setSelectedOverlay={setSelectedOverlay}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  ) : null}
                  <OrderNowBtn values={values} progress={progress} />
                </div>
                <div className="flex flex-col flex-1 gap-4 order-1 md:order-2">
                  <div className="sticky top-10">
                    <PreviewCard
                      ref={previewCardRef}
                      imgSrc={values.logo}
                      qrSize={104}
                      values={values}
                      colorData={colorData}
                      selectedOverlay={selectedOverlay}
                      getAccentColor={getAccentColor}
                      setFieldValue={setFieldValue}
                      frontRef={frontRef}
                      backRef={backRef}
                      downloadMode={downloadMode}
                    />
                  </div>
                  {!isMobile ? (
                    <PatternSelector
                      presets={TEMPLATE_PRESETS}
                      selectedOverlay={selectedOverlay}
                      setSelectedOverlay={setSelectedOverlay}
                      setFieldValue={setFieldValue}
                    />
                  ) : null}
                </div>
                <div className="hidden md:block order-3">
                  <VerticalProgressBar progress={progress} />
                </div>
              </div>
              {/* </div> */}
            </main>
          </Form>
        );
      }}
    </Formik>
  );
};

const PersonalDetails = () => (
  <section
    aria-label="Personal Details"
    className="glass gradient-border rounded-2xl p-5 w-full flex flex-col justify-center "
  >
    <h2 className="text-xl font-semibold text-start">Personal Details</h2>
    <InputField name="fullName" placeholder="Full Name" />
    <InputField name="designation" placeholder="Designation" />
    <InputField name="companyName" placeholder="Company Name" />
  </section>
);

// cursor-not-allowed
const OrderNowBtn = ({ progress }) => {
  const navigate = useNavigate();
  const toCheckout = () => {
    console.log("Ready To Checkout");
    navigate("/checkout");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => toCheckout()}
        // disabled={progress !== 100}
        className={`mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-full font-medium text-black transition-colors 
                      ${
                        progress === 100
                          ? "bg-primary hover:bg-primary-hover cursor-pointer"
                          : "bg-gray-500 "
                      }`}
        // aria-disabled={progress !== 100}
      >
        {progress === 100
          ? "Design Done ! Order Now"
          : "Complete all fields to order"}
        <ShoppingCart size={25} />
      </button>
      {/* <CheckoutModal /> */}
    </>
  );
};

export default CustomisingTool;
