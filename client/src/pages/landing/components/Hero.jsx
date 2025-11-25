import { ArrowRight } from "lucide-react";
import heroAbstract from "../../../assets/brand/backgrounds/abstract-hero.png";
import heroCard from "../../../assets/brand/backgrounds/card-hero.png";
import GridOverlay from "../components/GridOverlay";
import MovingDots from "../../../components/ui/MovingDots";

const Hero = () => {
  const handleNavigateToProducts = (e, href) => {
    console.log(href);

    e.preventDefault();

    const targetId = href.substring(1); // Remove the '#'
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const navHeight = 64; // Height of your navbar (h-16 = 64px)
      const targetPosition = targetElement.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };
  return (
    <section
      id="home"
      className="relative h-screen min-h-170 md:min-h-screen w-full flex items-start justify-center bg-black overflow-hidden"
    >
      {/* Grid overlay wrapper */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-[1200px] h-full flex justify-center">
          <GridOverlay />
          {/* Fading edges */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/4 bg-black pointer-events-none"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background:
                "linear-gradient(to right, black 0%, transparent 100%)",
              mixBlendMode: "normal",
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-1/4 bg-black pointer-events-none"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background:
                "linear-gradient(to left, black 0%, transparent 100%)",
              mixBlendMode: "normal",
            }}
          />
        </div>
      </div>

      <MovingDots dotCount={30} />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[1200px] px-4 sm:px-8 py-14">
        <h1 className="text-center text-white font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          Smarter Introductions
          <br />
          <span className="text-primary font-bold block">
            Stronger Connections
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl text-center text-theme-muted">
          Transform your networking with smart NFC cards that share your
          professional profile instantly
        </p>
        <div className="flex items-center justify-center w-full">
          <button
            className="btn-primary cursor-pointer mt-10 px-7 py-3 text-base sm:text-lg rounded-full shadow-md font-medium flex items-center gap-2"
            onClick={(e) => handleNavigateToProducts(e, "#product")}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* White glow effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 z-[1] w-80 h-[50px] sm:w-[600px] sm:h-[300px] md:w-[900px] md:h-[400px] lg:w-[1200px] lg:h-[500px] whiteGlow"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.37) 60%, transparent 100%)",
          opacity: 0.72,
        }}
        aria-hidden="true"
      />

      {/* Hero abstract image */}
      <img
        src={heroAbstract}
        alt="hero-section-abstract-design-image"
        className="pointer-events-none absolute left-1/2 top-[65%] min-w-[500px] md:w-[2000px] z-[2]"
        style={{
          opacity: 0.97,
          filter: "blur(0.5px)",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-[65%] top-[70%] z-[3]"
        style={{
          width: "40vw",
          maxWidth: "400px",
          height: "50px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 60%, transparent 100%)",
          filter: "blur(12px)",
          opacity: 0.8,
        }}
        aria-hidden="true"
      />

      <img
        src={heroCard}
        style={{ transform: "translate(-50%, -50%)" }}
        alt="hero-card-image"
        className="
          pointer-events-none absolute 
          left-[65%] top-[66%] w-40 min-w-[20px] z-[4] rotate-[2deg]
          transition-all duration-300 ease-in-out
          sm:w-60
          md:w-[250px]
          lg:w-[400px]
          xl:w-[600px]
      "
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full h-52 z-[5]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, black 100%)",
          opacity: 1,
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default Hero;
