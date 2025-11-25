import React, { useEffect, useState } from "react";
import DemoVideo from "../../../assets/brand/video/demo.mp4";
import { ArrowRight, Menu, Play, X } from "lucide-react";
import synconnectTextLogo from "../../../assets/brand/typography/synconnect-text-logo.svg";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const openDemoPanel = () => setShowDemoPanel(true);
  const closeDemoPanel = () => setShowDemoPanel(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" }, // you'll need to add this section
    { name: "Product", href: "#product" }, // or create a separate product section
    { name: "Testimonials", href: "#testimonials" }, // you'll need to add this section
    { name: "Contact", href: "#contact" }, // you'll need to add this section
  ];

  // Smooth scroll function
  const handleNavClick = (e, href) => {
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

      setActiveSection(targetId);
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.href.substring(1));
      const navHeight = 64;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= navHeight + 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full bg-theme z-30 md:py-3 sticky top-0">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16 relative">
        {/* Logo */}
        <span className=" flex items-center justify-center  w-30 sm:w-30 md:w-40 lg:w-50 tracking-tight select-none">
          <img src={synconnectTextLogo} alt="synconnect-text-logo" />
        </span>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-white font-medium transition-colors duration-150 flex flex-col relative group ${
                  activeSection === link.href.substring(1) ? "text-primary" : ""
                }`}
              >
                <p className="relative">
                  {link.name}
                  <span
                    className={`block h-[3px] bg-[var(--color-primary-hover)] rounded-2xl mt-3 absolute left-0 bottom-0 transition-[width] duration-300 ease-in-out ${
                      activeSection === link.href.substring(1)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </p>
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={openDemoPanel}
          className="hidden border border-primary text-primary hover:bg-primary hover:text-black cursor-pointer md:inline-flex btn px-5 py-3 text-base rounded-full font-medium items-center gap-2"
        >
          Watch Demo
          <Play className="w-5 h-5" />
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none text-theme"
          aria-label="Toggle Menu"
          onClick={() => setOpen((val) => !val)}
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden min-h-screen bg-black/55 backdrop-blur-xl absolute w-full transition-all duration-300 ${
          open
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        } overflow-hidden`}
      >
        <ul className="flex flex-col items-center gap-4 py-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block py-2 px-4 font-medium hover:text-primary transition-colors duration-150 text-end ${
                  activeSection === link.href.substring(1)
                    ? "text-primary"
                    : "text-theme-muted"
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                setOpen(false);
                openDemoPanel();
              }}
              className="mt-2 p-5 border rounded-full font-semibold inline-flex items-center gap-2"
            >
              Watch Demo
              <Play className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </div>

      <DemoSlidePanel
        isOpen={showDemoPanel}
        onClose={closeDemoPanel}
        videoSrc={DemoVideo}
      />
    </nav>
  );
};

export default Navbar;

// DemoSlidePanel component remains the same
const DemoSlidePanel = ({ isOpen, onClose, videoSrc }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Glassy Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white/20 backdrop-blur-md rounded-xl
          shadow-xl border border-white/30
          flex flex-col items-center
          w-11/12 max-w-xs sm:max-w-sm md:max-w-md
          p-6 max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Demo video panel"
      >
        {/* Close Button - top left, half outside */}
        <button
          onClick={onClose}
          aria-label="Close Demo Video Panel"
          className="absolute -top-4 -right-4 z-50
     text-2xl font-bold focus:outline-none
     bg-white text-black backdrop-blur-lg 
    shadow-xl border border-white/30 rounded-full w-9 h-9 flex items-center justify-center
    hover:bg-white/80 cursor-pointer"
        >
          &times;
        </button>

        {/* Instagram Story Ratio Video (Portrait 9:16) */}
        <div
          className="w-full"
          style={{
            aspectRatio: "9/16",
            maxHeight: "80vh",
          }}
        >
          <video
            src={videoSrc}
            controls
            autoPlay
            muted
            loop
            className="w-full h-full object-contain rounded-lg bg-black"
          />
        </div>
      </div>
    </>
  );
};
