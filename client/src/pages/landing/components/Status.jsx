import React, { useState, useEffect, useRef } from "react";

const Status = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to trigger animation when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full mt-0 md:mt-5 flex flex-col items-center justify-center bg-black overflow-hidden py-8 sm:py-12 md:py-16  px-5 "
    >
      <div className="glass-gradient gradient-border p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-10 max-w-sm sm:max-w-2xl md:max-w-4xl w-full mx-auto">
        {/* Active Users */}
        <div className="flex flex-col items-center text-center flex-1">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            <CountUpAnimation
              end={1000}
              duration={2000}
              isVisible={isVisible}
              suffix="+"
            />
          </h3>
          <p className="text-primary text-xs sm:text-sm font-medium">
            Active Users
          </p>
        </div>

        {/* Satisfaction Rate */}
        <div className="flex flex-col items-center text-center flex-1">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            <CountUpAnimation
              end={99}
              duration={2000}
              isVisible={isVisible}
              suffix="%"
            />
          </h3>
          <p className="text-primary text-xs sm:text-sm font-medium">
            Satisfaction Rate
          </p>
        </div>

        {/* Global Support */}
        <div className="flex flex-col items-center text-center flex-1">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            24/7
          </h3>
          <p className="text-primary text-xs sm:text-sm font-medium">
            Global Support
          </p>
        </div>
      </div>
    </section>
  );
};

// Count Up Animation Component
export const CountUpAnimation = ({ end, duration, isVisible, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * end);

      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [end, duration, isVisible]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export default Status;
