import React from "react";
import featuresBg from "../../../assets/brand/backgrounds/features-bg.png";
import NFCCardImg from "../../../assets/brand/backgrounds/features-card-preview.png";
import { Users, Package, Share2, BarChart3, Settings } from "lucide-react";

const Features = () => {
  const features = [
    {
      name: "Smart Insights",
      icon: "BarChart3",
      description: "Track every\ninteraction",
    },
    {
      name: "Tap & Connect",
      icon: "Users",
      description: "Share contacts\nin one tap",
    },
    {
      name: "Live Showcase",
      icon: "Package",
      description: "Show your\nproducts live",
    },
    {
      name: "One-Tap Blast",
      icon: "Share2",
      description: "Send links\n& socials\ninstantly",
    },
  ];

  const icons = { Users, Package, Share2, BarChart3, Settings };
  const getIcon = (name) => {
    const Icon = icons[name];
    return <Icon size={38} color="#c9c9c9" />;
  };

  const FeatureBlock = ({ feature }) => (
    <div className="shadow-lg backdrop-blur-lg  rounded-2xl w-[160px] h-[160px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] gradient-border">
      <div className="w-full h-full rounded-2xl glass-black  relative group">
        <div className="h-full flex flex-col gap-2 justify-end items-start pb-4 px-4 group-hover:animate-[slideInUp_0.7s_ease-out_forwards]">
          {getIcon(feature.icon)}

          <h4 className="text-sm md:text-md lg:text-lg font-semibold text-slate-200 leading-tight group-hover:animate-[slideInUp_0.7s_ease-out_forwards]">
            {feature.name}
          </h4>

          <p className="block md:hidden  text-slate-300 text-sm lg:text-sm whitespace-pre-line leading-tight group-hover:block group-hover:animate-[slideInUp_0.7s_ease-out_forwards]">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="features"
      className="relative w-full min-h-screen flex flex-col items-center justify-start bg-black overflow-hidden py-10 px-4"
      style={{
        backgroundImage: `url(${featuresBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlays - preserved */}

      {/* <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.6) 40%,rgba(0,0,0,0.8) 70%,rgba(0,0,0,0.95) 85%,rgba(0,0,0,1) 100%)",
        }}
      /> */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 0%, transparent 0%, black 110%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient( black 0%, transparent 50%,black 100%)",
        }}
      />

      <h1 className="z-2 text-4xl md:text-6xl md:mb-4 font-semibold w-full text-center ">
        Honest Pricing,
        <br /> No Unseen Charges.
      </h1>
      {/* Main container */}
      <div className="relative z-15 w-full max-w-7xl mx-auto">
        {/* Mobile Layout: Stack with fixed card sizes */}
        <div className="block md:hidden">
          {/* NFC Card at top */}
          <div className="flex justify-center mb-8 mt-8">
            <img
              src={NFCCardImg}
              alt="NFC Business Card"
              className="w-[200px] max-w-[70vw]"
            />
          </div>

          {/* Feature cards in 2x2 grid with fixed sizes */}
          <div className="grid grid-cols-2 gap-4 justify-items-center px-4">
            {features.map((feature, i) => (
              <FeatureBlock key={i} feature={feature} />
            ))}
          </div>
        </div>

        {/* Tablet Layout: Around center card */}
        <div className="hidden md:block lg:hidden">
          <div className="relative min-h-[700px] flex items-center justify-center">
            {/* Center NFC Card */}
            <img
              src={NFCCardImg}
              alt="NFC Business Card"
              className="w-[280px] z-20"
            />

            {/* Feature cards positioned around with fixed sizes */}
            <div className="absolute top-[8%] left-[10%]">
              <FeatureBlock feature={features[0]} />
            </div>

            <div className="absolute top-[8%] right-[10%]">
              <FeatureBlock feature={features[2]} />
            </div>

            <div className="absolute bottom-[8%] left-[10%]">
              <FeatureBlock feature={features[1]} />
            </div>

            <div className="absolute bottom-[8%] right-[10%]">
              <FeatureBlock feature={features[3]} />
            </div>
          </div>
        </div>

        {/* Desktop Layout: Original positioning with fixed sizes */}
        <div className="hidden lg:block">
          <div className="relative min-h-[800px]">
            {/* Center NFC Card */}
            <div className="absolute top-1/2  md:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <img
                src={NFCCardImg}
                alt="NFC Business Card"
                className="w-[350px]"
              />
            </div>

            {/* Feature cards with original positioning and fixed sizes */}
            <div className="absolute top-[10%] left-[17%] z-5">
              <FeatureBlock feature={features[0]} />
            </div>

            <div className="absolute top-[10%] right-[12%] z-15">
              <FeatureBlock feature={features[2]} />
            </div>

            <div className="absolute bottom-[12%] left-[12%] z-5">
              <FeatureBlock feature={features[1]} />
            </div>

            <div className="absolute bottom-[8%] right-[17%] z-15">
              <FeatureBlock feature={features[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
