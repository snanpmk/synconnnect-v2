import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What makes SynConnect different from standard business cards?",
    answer:
      "SynConnect uses NFC and QR for instant, app-free contact sharing—making networking faster and more convenient at every event.",
  },
  {
    question: "Is my contact data secure with SynConnect?",
    answer:
      "All data in SynConnect is encrypted and only shared with your consent. Your privacy is our priority.",
  },
  {
    question: "Can I customize my SynConnect card?",
    answer:
      "Yes! Add logos, brand colors, and choose what info to share for a professional presence that's truly yours.",
  },
  {
    question: "Does SynConnect work with my phone?",
    answer:
      "SynConnect NFC cards work with most Android and iPhone devices. Plus, every phone can scan the included QR code.",
  },
  {
    question: "What analytics are available in SynConnect?",
    answer:
      "Track card interactions, get insights on sharings, and measure networking ROI directly from your dashboard.",
  },
  {
    question: "How does SynConnect help with event networking?",
    answer:
      "Digital profiles and instant info exchange make events and career fairs more productive and memorable.",
  },
  {
    question: "Can I integrate SynConnect with other platforms?",
    answer:
      "Link your LinkedIn, WhatsApp, portfolios, and more directly from your SynConnect card for a unified professional identity.",
  },
  {
    question: "Why choose SynConnect over other digital card solutions?",
    answer:
      "SynConnect offers unmatched speed, privacy, branding control, analytics, and flexible NFC/QR sharing compared to competing products.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="min-h-screen relative overflow-hidden py-20 flex flex-col justify-center items-center bg-black px-4"
    >
      {/* Background blur elements */}

      <h1 className="text-neutral-200 font-bold text-4xl md:text-5xl mb-8 text-center leading-tight">
        Frequently asked questions
      </h1>
      <div className="w-full max-w-2xl">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="mb-4">
              <div
                className={`rounded-lg border border-neutral-700 shadow transition-all w-full ${
                  isOpen ? "bg-neutral-800" : "bg-transparent"
                }`}
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-white group"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  <span
                    className={`w-5 h-5 text-neutral-300 transition-transform duration-500 ease-in-out ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    <Plus />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 text-gray-200 text-sm transition-all duration-500 ease-in-out">
                    {faq.answer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQs;
