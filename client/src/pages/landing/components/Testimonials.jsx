import React from "react";
import { Quote } from "lucide-react";
import MovingDots from "../../../components/ui/MovingDots";

// Quote Icon Component
const QuoteIcon = ({ size = 34, strokeWidth = 1.5 }) => {
  return (
    <div className="bg-black  gradient-glass rotate-180 p-3 relative aspect-square w-15 h-15 flex items-center justify-center rounded-full">
      <Quote className="text-white-500" size={size} strokeWidth={strokeWidth} />
    </div>
  );
};

// Author Info Component
const AuthorInfo = ({ name, role }) => {
  return (
    <div>
      <h4 className="text-white font-semibold text-base mb-7">{name}</h4>
      <p className="text-gray-400 text-sm">{role}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="gradient-border shadow-lg hover:transform hover:scale-105 transition-all duration-300 backdrop-blur-lg rounded-3xl  p-5 md:p-8 relative glass-gradient">
      <div className="w-full justify-start flex my-5">
        <QuoteIcon />
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        {testimonial.text}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-gray-600/50 mb-6"></div>

      <AuthorInfo name={testimonial.name} role={testimonial.role} />
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-16 z-20">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      <p className="text-gray-400 text-lg">{subtitle}</p>
    </div>
  );
};

// Testimonial Grid Component
const TestimonialGrid = ({ testimonials }) => {
  return (
    <div className="grid z-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
};

// Main Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "SynConnect has transformed the way I network by making digital business cards seamless and efficient. The interface is sleek and easy to use.",
      name: "Arjun Mehta",
      role: "Software Engineer",
    },
    {
      id: 2,
      text: "I love how SynConnect makes sharing my contact details effortless and professional. It’s a must-have for anyone serious about business networking.",
      name: "Nitya Sharma",
      role: "Marketing Specialist",
    },
    {
      id: 3,
      text: "The NFC digital card feature in SynConnect is a game changer. It’s unbelievably convenient and saves so much time at events.",
      name: "Rohan Das",
      role: "Entrepreneur",
    },
    {
      id: 4,
      text: "SynConnect’s platform is intuitive and reliable. The ability to connect instantly with others through NFC technology is impressive.",
      name: "Meera Nair",
      role: "Freelancer",
    },
    {
      id: 5,
      text: "Using SynConnect has allowed me to go completely paperless without losing the personal touch of exchanging business cards.",
      name: "Dev Patel",
      role: "Consultant",
    },
  ];

  return (
    <section
      className="relative bg-black w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-20 px-4"
      id="testimonials"
    >
      {/* Overlay that transitions to black at the bottom */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-t from-transparent to-black"></div>
      </div> */}
      <MovingDots />
      <SectionHeader
        title="What Our Users Say"
        subtitle="Trusted by our users around the world."
      />

      <TestimonialGrid testimonials={testimonials} />

      {/* Overlay that transitions to black at the bottom */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black to-transparent"></div>
      </div> */}
    </section>
  );
};

export default Testimonials;
