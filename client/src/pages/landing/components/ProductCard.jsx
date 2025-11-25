import React from "react";
import { SiWhatsapp } from "react-icons/si";

// Product data definition
const productsData = [
  {
    id: 1,
    icon: "📱",
    name: "NFC Enabled Digital Business Card",
    description:
      "Share your contact details, social media, and portfolio with a single tap. Instantly save to the recipient's phone, making networking seamless and memorable.",
    features: [
      "Instant Tap-to-Share (NFC)",
      "Unlimited Profile Updates",
      "Eco-Friendly & Durable Design",
      "Contact Capture Analytics",
    ],
  },
  {
    id: 2,
    icon: "⭐",
    name: "Google Review Stand with Analytics",
    description:
      "Effortlessly encourage 5-star Google reviews at your business via NFC & QR. Gain insights with real-time engagement tracking and sentiment analysis.",
    features: [
      "NFC & QR Code Enabled",
      "Real-Time Engagement Tracking",
      "Review Sentiment Analysis",
      "Premium, Customizable Design",
    ],
  },
  {
    id: 3,
    icon: "🔗",
    name: "Offline Digital Business Cards",
    description:
      "The reliable digital solution for areas without internet. Share your VCF contact file instantly via QR or link, no app required to receive.",
    features: [
      "Works Completely Offline",
      "Instant VCF Contact Download",
      "Custom Branded Landing Page",
      "Universal & Simple Sharing",
    ],
  },
];

// Reusable Product Card Component
const ProductCard = ({ product }) => {
  const phoneNumber = "918920797587";
  const prefilledText = encodeURIComponent(
    `Hi, I am interested in the ${product.name}. Please send me more details about it.`
  );
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${prefilledText}`;

  return (
    <div
      className="
        group relative p-8 rounded-3xl backdrop-blur-xl
        bg-white/5 border border-white/10
        shadow-lg hover:shadow-primary/20 transition-all duration-500
        hover:-translate-y-1 hover:scale-[1.02]
        bg-gradient-to-br from-white/5 to-white/0 
      "
    >
      {/* Glow border on hover */}
      <div
        className="
        absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
        transition duration-500 pointer-events-none
        bg-gradient-to-br from-primary/30 via-transparent to-primary/5
      "
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-5">
          <span className="text-5xl">{product.icon}</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {product.name}
          </h2>
        </div>

        <p className="text-gray-400 leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Features */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-200 mb-3 text-lg">
            Key Features
          </h3>

          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 text-primary flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4"></path>
                  <circle cx="12" cy="12" r="9"></circle>
                </svg>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-full py-3 rounded-xl bg-primary text-black
            font-semibold shadow-lg shadow-primary/20 flex items-center justify-center
            gap-3 hover:shadow-primary/30 hover:scale-[1.02]
            transition-all duration-300
          "
        >
          <SiWhatsapp className="w-6 h-6" />
          WhatsApp Us
        </a>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 px-4 sm:px-12 py-12 font-sans" id={'product'}> 
      <header className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Our Innovative Solutions
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
          Transform your professional connections and reputation with our
          cutting-edge, tap-to-share technology.
        </p>
      </header>

      {/* Responsive Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {productsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
