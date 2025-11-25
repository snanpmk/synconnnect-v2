import {
  CheckCircle2,
  Wifi,
  XCircle,
  Star,
  Sparkles,
  ArrowLeft,
  MoveLeft,
  ChevronLeft,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import MovingDots from "../../../components/landing-components/MovingDots";
import {
  createOrderApi,
  verifyPaymentApi,
} from "../../../services/userServices";
import { useLandingContext } from "../contexts/LandingContext";
import CustomisingTool from "./CustomisationTool";
import { cardsData } from "../constants/cardsData";

const CardIntro = () => (
  <div className="flex-1 text-center flex flex-col w-full justify-center mt-6 sm:mt-10 md:mt-14 lg:mt-16 xl:mt-20 relative px-4 sm:px-6">
    {/* Premium heading with green gradient and animations */}
    <div className="relative z-10 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-green-200 leading-tight tracking-wide animate-in slide-in-from-bottom duration-1000">
        Crafted Exclusively for You
      </h1>

      <div className="relative">
        <p className="text-sm sm:text-base   md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto leading-relaxed flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 animate-in slide-in-from-bottom duration-1000 delay-300">
          <span>Select, Personalize, Own </span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400 animate-pulse flex-shrink-0" />
        </p>
      </div>

      {/* Trust indicators with green accents */}
    </div>
  </div>
);

const CardsRow = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const {
    isDesignToolOpen,
    setIsDesignToolOpen,
    selectedCardType,
    setSelectedCardType,
  } = useLandingContext();

  const onSelect = (card) => {
    setSelectedCardType(card);
    setIsDesignToolOpen(true);
  };

  return (
    <div className="flex flex-col w-full items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-1 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-col gap-15  lg:flex-row w-full   md:gap-8 lg:gap-6 xl:gap-8 items-stretch justify-center max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            className="flex flex-col w-full max-w-sm sm:max-w-sm mx-auto lg:mx-0 lg:max-w-none lg:flex-1 animate-in slide-in-from-bottom duration-700"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {/* FlipCard Container */}
            <div className="flex-shrink-0 mb-4 sm:mb-5 md:mb-6">
              <FlipCard
                card={card}
                isSelected={selectedCardType?.id === card.id}
                onHover={setHoveredId}
                onLeave={() => setHoveredId(null)}
                onSelect={onSelect}
              />
            </div>

            {/* Content Section with consistent height */}
            <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
              {/* Description */}
              <div className="px-2 sm:px-3 md:px-4 lg:px-2">
                <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg text-gray-300 leading-relaxed text-left">
                  {card.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="px-2 sm:px-3 md:px-4 lg:px-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white">
                    ₹{card.price}
                  </span>
                  {card.period && (
                    <span className="text-xs sm:text-sm md:text-base lg:text-sm text-gray-400">
                      /{card.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Optional CTA Button */}
              {card.ctaText && (
                <div className="px-2 sm:px-3 md:px-4 lg:px-2 pt-3 sm:pt-4">
                  <button
                    onClick={() => onSelect(card)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-all duration-300 ${
                      selectedCardType?.id === card.id
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {card.ctaText}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlipCard = ({ card, isSelected, onHover, onLeave, onSelect }) => {
  const { name, designation, imgSrc, productType, company, id } = card;
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [qrSize, setQrSize] = useState(80);

  const isSmallScreen = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 640,
    []
  );

  const intervalRef = useRef(null);

  // Dynamic QR size based on screen size
  useEffect(() => {
    const updateQRSize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setQrSize(50);
      } else if (width < 640) {
        setQrSize(60);
      } else if (width < 768) {
        setQrSize(70);
      } else if (width < 1024) {
        setQrSize(65);
      } else {
        setQrSize(80);
      }
    };

    updateQRSize();
    window.addEventListener("resize", updateQRSize);
    return () => window.removeEventListener("resize", updateQRSize);
  }, []);

  const rotate = (to) =>
    setFlipped((prev) => (typeof to === "boolean" ? to : !prev));

  useEffect(() => {
    if (!isSmallScreen) return;
    const offset = (id % 5) * 400;
    const start = setTimeout(() => {
      intervalRef.current = setInterval(() => rotate(), 3000);
    }, offset);
    return () => {
      clearTimeout(start);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id, isSmallScreen]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    rotate(true);
    onHover?.(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotate(false);
    onLeave?.();
  };

  return (
    <div className="relative w-full group">
      <button
        className={`relative w-full p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 aspect-[1.586/1] [perspective:1000px] rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-500 transform hover:scale-105 ${
          isSelected ? "ring ring-primary shadow-2xl " : ""
        } ${isHovered ? "z-10" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect?.(card)}
        aria-pressed={isSelected}
      >
        {/* Selection indicator with green styling */}
        {isSelected && (
          <div className="absolute -top-0 -right-0 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 lg:-top-2 lg:-right-2 xl:-top-3 xl:-right-3 z-30 bg-primary rounded-full p-1.5 sm:p-2 md:p-2.5 lg:p-2 xl:p-2.5 shadow-lg shadow-white/20 animate-in zoom-in duration-300">
            <CheckCircle2 className="text-black w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
          </div>
        )}

        <div
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front side - Enhanced with subtle green accents */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl [backface-visibility:hidden] overflow-hidden border border-gray-600/30 shadow-xl drop-shadow-zinc-500 shadow-neutral-900">
            {/* Subtle pattern overlay with green tint */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2367d861' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>

            {productType === "company-branding" ? (
              <div className="relative w-full h-full">
                <img
                  src={imgSrc}
                  alt=""
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg sm:rounded-xl md:rounded-2xl"></div>
              </div>
            ) : (
              <div className="text-center space-y-1 sm:space-y-2 px-2">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl select-none uppercase text-gray-400 font-light tracking-wider">
                  Your Logo Here
                </h2>
                <div className="w-12 sm:w-14 md:w-16 lg:w-12 xl:w-16 h-0.5 bg-gradient-to-r from-transparent via-green-500/50 to-transparent mx-auto"></div>
              </div>
            )}
          </div>

          {/* Back side - Enhanced with green accents */}
          <div
            className={`absolute inset-0 w-full h-full text-white flex flex-col items-center justify-between rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] border shadow-xl drop-shadow-zinc-500 shadow-neutral-900 ${
              productType !== "company-branding"
                ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-neutral-600/30"
                : "bg-gradient-to-tl  from-green-950  via-neutral-950 to-black border-gray-700"
            }`}
          >
            {/* Top section */}
            <div className="flex justify-between w-full items-start">
              <div className="text-start flex-1 min-w-0">
                <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-white truncate">
                  {name}
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base opacity-80 text-gray-300 mt-0.5 sm:mt-1 truncate">
                  {designation}
                </p>
              </div>
              <Wifi className="rotate-90 text-green-400 ml-2 sm:ml-3 md:ml-4 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" />
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-end w-full">
              <div className="text-start">
                <span className="text-xs sm:text-xs md:text-sm lg:text-xs xl:text-sm 2xl:text-base font-semibold text-white">
                  synconnect
                </span>
              </div>
              <div className="bg-white p-1.5 sm:p-2 md:p-2.5 lg:p-2 xl:p-2.5 rounded-md sm:rounded-lg shadow-lg shadow-white/20">
                <QRCodeCanvas
                  value={JSON.stringify({ name, designation, company })}
                  size={qrSize}
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

const Customisation = () => {
  const { isDesignToolOpen, setIsDesignToolOpen } = useLandingContext();

  return (
    <section
      className={`relative overflow-hidden  w-full flex flex-col text-center items-center justify-center bg-black sm:px-2 md:px-6 lg:px-8 `}
      id="product"
    >
      {/* Enhanced background elements */}
      <MovingDots />

      <div
        className={`relative w-full max-w-sm sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto z-10 `}
      >
        {/* Catalog (Intro + Cards) */}
        <div
          className={`
            
            absolute inset-0 w-full 
            transition-all duration-700 ease-in-out
            transform-gpu
            ${
              isDesignToolOpen
                ? "opacity-0 -translate-x-full pointer-events-none"
                : "opacity-100 translate-x-0 pointer-events-auto"
            }
          `}
        >
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-20 2xl:gap-14 items-center justify-start">
            <CardIntro />
            <CardsRow />

            {/* <div className="text-center  px-4">
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                Need help choosing? Our experts are here to assist you.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-xs md:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  🚚 Free shipping on orders above ₹1000
                </span>
                <span className="flex items-center gap-1">
                  ⚡ Same-day processing
                </span>
                <span className="flex items-center gap-1">
                  🔒 Secure payments
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Customisation panel */}
        <div
          className={`
             w-full
            transition-all duration-700 ease-in-out
            transform-gpu
            ${
              isDesignToolOpen
                ? "opacity-100 translate-x-0 pointer-events-auto "
                : "opacity-0 translate-x-full pointer-events-none"
            }
          `}
        >
          <CustomisingTool />
        </div>
      </div>
    </section>
  );
};

export default Customisation;
