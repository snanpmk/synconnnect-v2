import { useRef, useState, useEffect } from "react";
import { PatternOverlay } from "./PatternOverlay";
import { QRCodeCanvas } from "qrcode.react";
import { Wifi } from "lucide-react";
import { useLandingContext } from "../contexts/LandingContext";

const CardFront = ({
  imgSrc,
  colorData,
  values,
  selectedOverlay,
  selectedCardType,
  logoImgRef,
  canvasRef,
}) => (
  <div
    className="absolute inset-0 w-full aspect-[1.586/1] flex items-center justify-center rounded-xl overflow-hidden shadow-xl drop-shadow-zinc-500 shadow-neutral-900"
    style={{
      background: colorData.value,
      position: "relative",
      backfaceVisibility: "hidden",
      transform: "rotateY(0deg)",
      zIndex: 2,
    }}
  >
    {imgSrc ? (
      <img
        src={imgSrc}
        alt="Uploaded Logo Preview"
        ref={logoImgRef}
        role="img"
        className={`w-full h-full rounded-xl ${
          selectedCardType?.productType === "company-branding"
            ? "object-cover"
            : "object-contain"
        }`}
        style={{ position: "relative", zIndex: 3 }}
      />
    ) : (
      <div
        className="text-center px-2"
        style={{ position: "relative", zIndex: 3 }}
      >
        <h2
          className="uppercase font-light tracking-wider"
          style={{ color: values.textColor }}
        >
          Upload your Logo / Image
        </h2>
      </div>
    )}
    <PatternOverlay type={selectedOverlay} opacity={0.12} />
    <canvas ref={canvasRef} style={{ display: "none" }} />
  </div>
);

const CardBack = ({ colorData, values, selectedOverlay, qrSize }) => (
  <div
    className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-xl p-4 shadow-xl drop-shadow-zinc-500 shadow-neutral-900"
    style={{
      background: colorData.value,
      color: values.textColor,
      backfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      zIndex: 1,
    }}
  >
    <PatternOverlay type={selectedOverlay} opacity={0.12} />
    <div className="flex justify-between w-full items-start">
      <div className="flex-1 min-w-0 text-start">
        <p className="font-bold truncate text-xl sm:text-2xl md:text-3xl">
          {values.fullName}
        </p>
        <p className="mt-2 opacity-80 truncate text-sm sm:text-lg md:text-xl">
          {values.designation}
        </p>
      </div>
      <Wifi
        className="rotate-90 flex-shrink-0"
        style={{ color: values.accentColor }}
        aria-label="Wi-Fi Icon"
      />
    </div>
    <div className="flex justify-between items-end w-full">
      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-start">
        {values.companyName}
      </span>
      <div className="bg-white p-2 rounded shadow-lg">
        <QRCodeCanvas
          value={JSON.stringify({
            name: values.fullName,
            designation: values.designation,
            company: values.companyName,
          })}
          size={qrSize}
          includeMargin={false}
          aria-label="QR Code"
        />
      </div>
    </div>
  </div>
);

const FlipControls = ({ flipped, setFlipped }) => (
  <div className="flex justify-center items-center bg-black w-full">
    <div className="flex w-full bg-black">
      {["Front", "Back"].map((side, index) => {
        const isFlipped = side === "Back";
        const active = flipped === isFlipped;
        return (
          <button
            key={side}
            type="button"
            onClick={() => setFlipped(isFlipped)}
            className={`flex-1 px-6 py-3 font-semibold text-center transition-colors duration-300 border ${
              active
                ? "text-primary border-primary"
                : "text-gray-400 border-neutral-400"
            } rounded-${index === 0 ? "l" : "r"}-full`}
          >
            {side}
          </button>
        );
      })}
    </div>
  </div>
);

export const PreviewCard = ({
  imgSrc,
  values,
  colorData,
  selectedOverlay,
  frontRef,
  backRef,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [qrSize, setQrSize] = useState(128);

  const logoImgRef = useRef(null);
  const canvasRef = useRef(null);

  const { selectedCardType } = useLandingContext();

  // Responsive QR code sizing based on window width
  useEffect(() => {
    const updateQrSize = () => {
      const width = window.innerWidth;
      if (width < 640) setQrSize(60);
      else setQrSize(100);
    };
    updateQrSize();
    window.addEventListener("resize", updateQrSize);
    return () => window.removeEventListener("resize", updateQrSize);
  }, []);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <FlipControls flipped={flipped} setFlipped={setFlipped} />
      <div className="relative w-full aspect-[1.586/1] [perspective:1000px] rounded-xl">
        <div
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]`}
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <CardFront
            imgSrc={imgSrc}
            colorData={colorData}
            values={values}
            selectedOverlay={selectedOverlay}
            selectedCardType={selectedCardType}
            logoImgRef={logoImgRef}
            canvasRef={canvasRef}
            ref={frontRef}
          />
          <CardBack
            colorData={colorData}
            values={values}
            selectedOverlay={selectedOverlay}
            qrSize={qrSize}
            ref={backRef}
          />
        </div>
      </div>
    </div>
  );
};
