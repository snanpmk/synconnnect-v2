import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Status from "./components/Status";
import About from "./components/About";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQs from "./components/FAQ";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
const LandingMain = () => (
  <div className="flex flex-col min-w-screen text-white relative">
    {/* <LandingProvider> */}
    <Navbar />
    <Hero />
    <Status />
    <About />
    <Features />
    <ProductCard />
    {/* <Customisation /> */}
    <Testimonials />
    <FAQs />
    <Footer />
    {/* </LandingProvider> */}
  </div>
);

export default LandingMain;
