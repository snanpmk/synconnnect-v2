import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import synconnectTextLogo from "../../../assets/brand/typography/synconnect-text-logo.svg";

export default function Footer() {
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
    }
  };

  return (
    <footer className="bg-neutral-950 text-gray-300 py-3 z-5">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="text-start">
            <span className="flex items-center justify-center w-30 sm:w-30 md:w-40 lg:w-50 tracking-tight select-none">
              <img src={synconnectTextLogo} alt="synconnect-text-logo" />
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Your smart digital business card – connect, share, and grow your
              network instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-start">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, "#features")}
                  className="hover:text-white transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleNavClick(e, "#product")}
                  className="hover:text-white transition"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "#about")}
                  className="hover:text-white transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="hover:text-white transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="text-start">
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, "#faq")}
                  className="hover:text-white transition"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  onClick={(e) => handleNavClick(e, "#support")}
                  className="hover:text-white transition"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(e) => handleNavClick(e, "#blog")}
                  className="hover:text-white transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => handleNavClick(e, "#terms")}
                  className="hover:text-white transition"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-start">
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-5">
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition"
              >
                <Instagram size={22} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition"
              >
                <Twitter size={22} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition"
              >
                <Linkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} Synconnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
