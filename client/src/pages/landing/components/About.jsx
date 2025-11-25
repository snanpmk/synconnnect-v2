import React, { useState } from "react";
import { User, Smartphone, Palette, Mouse } from "lucide-react";
import MovingDots from "../../../components/ui/MovingDots";
import profileScreen from "../../../assets/brand/backgrounds/profile-screen.png";

// Icon data with corresponding text
const iconData = [
  {
    id: "palette",
    icon: Palette,
    heading: "Customize Your Design",
    p: "Fully Customizable with your branding & design",
  },
  {
    id: "user",
    icon: User,
    heading: "Personalize Your Profile",
    p: "Add links, contact info, and digital portfolios",
  },
  {
    id: "smartphone",
    icon: Smartphone,
    heading: "Mobile-First Experience",
    p: "One tap connects you with any NFC - enabled device",
  },
];

// Individual Interactive Icon Component
const InteractiveIcon = ({
  iconItem,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  const IconComponent = iconItem.icon;

  return (
    <span
      onMouseEnter={() => onMouseEnter(iconItem.id)}
      onMouseLeave={onMouseLeave}
      className="p-0.5 bg-gradient-to-tr from-neutral-700 via-neutral-900 to-neutral-700 rounded-full shadow-lg hover:bg-gradient-to-tr hover:from-[var(--color-primary-hover-dark)] hover:via-[var(--color-primary-hover)] hover:to-[var(--color-primary-hover-dark)] cursor-pointer transition-all duration-3000"
    >
      <div
        className="p-3 sm:p-4 bg-black rounded-full transition-all duration-3000"
        style={{
          background:
            isHovered === iconItem.id
              ? "radial-gradient(circle, var(--color-primary-hover-dark) 5%, black)"
              : "black",
        }}
      >
        <IconComponent
          size={20}
          className="sm:w-6 sm:h-6"
          color={isHovered === iconItem.id ? "var(--color-primary)" : "white"}
        />
      </div>
    </span>
  );
};

// Interactive Icons Grid Component
const InteractiveIconsGrid = ({ hoveredIcon, onIconHover, onIconLeave }) => {
  return (
    <div className="flex justify-center gap-2 sm:gap-4 w-full">
      {iconData.map((iconItem) => (
        <InteractiveIcon
          key={iconItem.id}
          iconItem={iconItem}
          isHovered={hoveredIcon}
          onMouseEnter={onIconHover}
          onMouseLeave={onIconLeave}
        />
      ))}
    </div>
  );
};

// Individual Feature Card for Mobile
const MobileFeatureCard = ({ iconItem }) => {
  const IconComponent = iconItem.icon;

  return (
    <div className="glass-gradient gradient-border rounded-2xl shadow-lg p-4 sm:p-6 flex-shrink-0 w-full">
      <div className="flex flex-col items-center text-center">
        <div className="p-1 bg-gradient-to-tr from-neutral-700 via-black to-neutral-700 rounded-full shadow-lg mb-4">
          <div className="p-3 bg-black rounded-full">
            <IconComponent size={24} color="var(--color-primary)" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
          {iconItem.heading}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">{iconItem.p}</p>
      </div>
    </div>
  );
};

// Mobile Features Grid
const MobileFeaturesGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full ">
      {iconData.map((iconItem) => (
        <MobileFeatureCard key={iconItem.id} iconItem={iconItem} />
      ))}
    </div>
  );
};

// Features Showcase Card for Desktop
const FeaturesShowcaseCard = ({ hoveredIcon, onIconHover, onIconLeave }) => {
  const getContentText = (type) => {
    const hoveredIconData = iconData.find((item) => item.id === hoveredIcon);
    return hoveredIconData ? hoveredIconData[type] : "Powerful Features";
  };

  return (
    <div className="glass-gradient gradient-border rounded-3xl shadow-lg p-4 sm:p-6 w-full max-w-[300px] h-[280px] sm:h-[300px] flex-shrink-0">
      <div className="flex flex-col items-center justify-between h-full">
        <div className="text-start flex-1 flex flex-col justify-center px-2">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 leading-tight overflow-hidden">
            <span
              key={getContentText("heading")} // Force re-render on content change
              className="block animate-[slideInUp_0.7s_ease-out] transition-all duration-3000"
            >
              {getContentText("heading")}
            </span>
          </h3>

          <div className="min-h-[40px] sm:min-h-[50px] flex items-center justify-center overflow-hidden">
            {hoveredIcon ? (
              <p
                key={getContentText("p")} // Force re-render on content change
                className="text-gray-300 text-xs sm:text-sm leading-relaxed animate-[fadeInUp_0.7s_ease-out]"
              >
                {getContentText("p")}
              </p>
            ) : (
              <span className="text-gray-300 text-xs sm:text-sm leading-relaxed animate-bounce">
                <Mouse />
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <InteractiveIconsGrid
            hoveredIcon={hoveredIcon}
            onIconHover={onIconHover}
            onIconLeave={onIconLeave}
          />
        </div>
      </div>
    </div>
  );
};

// Company Info Card
const CompanyInfoCard = () => {
  return (
    <div className="glass-gradient gradient-border relative rounded-3xl shadow-lg p-4 sm:p-6 flex-1 min-h-[380px] md:min-h-[280px] overflow-hidden">
      {/* For md+ screens: side-by-side layout with image to the right */}
      <div className="hidden md:grid md:grid-cols-2 gap-4 h-full">
        {/* Text Content */}
        <div className="flex flex-col justify-center z-10 relative">
          <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">
            About <br className="hidden sm:block" /> SynConnect
          </h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            SynConnect is transforming networking with smart, sustainable
            NFC-enabled digital cards. Make lasting impressions and connect
            seamlessly—just like thousands of professionals already have.
          </p>
        </div>

        {/* Image Container - Right side and positioned from bottom */}
        <div className="flex  items-end justify-end relative">
          <div className="relative -mb-18 h-80">
            <img
              src={profileScreen}
              className="w-auto h-full object-contain"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* For mobile screens: stacked layout with image below text */}
      <div className="md:hidden flex flex-col h-full">
        {/* Text Content */}
        <div className="flex flex-col justify-center z-10 relative flex-1">
          <h3 className="text-xl font-bold mb-3 leading-tight text-white">
            About SynConnect
          </h3>
          <p className="text-gray-300 text-sm mb-3 md:mb-0 leading-relaxed">
            SynConnect is transforming networking with smart, sustainable
            NFC-enabled digital cards. Make lasting impressions and connect
            seamlessly—just like thousands of professionals already have.
          </p>
        </div>

        {/* Image Container - Centered below text and positioned from bottom */}
        <div className="flex justify-center items-end relative">
          <div className="sbsolute -mb-10 h-70">
            <img
              src={profileScreen}
              className="w-auto h-full object-contain"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Content Cards Container
const MainContentSection = ({ hoveredIcon, onIconHover, onIconLeave }) => {
  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      {/* Desktop Layout - Hidden on mobile/tablet */}
      <div className="hidden xl:flex flex-row gap-6">
        <FeaturesShowcaseCard
          hoveredIcon={hoveredIcon}
          onIconHover={onIconHover}
          onIconLeave={onIconLeave}
        />
        <CompanyInfoCard />
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="xl:hidden space-y-6">
        {/* Company Info Card - Full width on mobile */}
        <CompanyInfoCard />

        {/* Features Cards Grid - Three separate cards */}
        <MobileFeaturesGrid />
      </div>
    </div>
  );
};

// Product Benefits Banner Component
const ProductBenefitsBanner = () => {
  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border border-primary-hover-dark bg-gradient-to-br from-green-400/10 to-black rounded-xl p-6 sm:p-8 shadow-lg">
        <h4 className="text-primary text-base sm:text-lg font-semibold mb-3">
          Next-gen Business Cards
        </h4>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
          Ditch paper business cards forever. Our NFC digital cards share your
          complete contact info with just one tap—no apps needed. Generate more
          leads, make better impressions, and never lose a contact again.
        </p>
      </div>
    </div>
  );
};

// Main About Component
const About = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconId) => {
    setHoveredIcon(iconId);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      <MovingDots />

      <div className="relative z-10">
        <MainContentSection
          hoveredIcon={hoveredIcon}
          onIconHover={handleIconHover}
          onIconLeave={handleIconLeave}
        />
        <ProductBenefitsBanner />
      </div>
    </section>
  );
};

export default About;
