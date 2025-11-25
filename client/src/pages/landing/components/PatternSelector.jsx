import React from "react";
import { PatternOverlay } from "./PatternOverlay";

const PatternSelector = ({
  presets,
  selectedOverlay,
  setSelectedOverlay,
  setColorData,
  setFieldValue,
}) => {
  return (
    <div className="glass-gradient gradient-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-neutral-200 mb-6 tracking-wide">
        Select Pattern
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {presets.map((t) => {
          const isActive = selectedOverlay === t.overlay;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                setSelectedOverlay(t.overlay);
                setColorData(t.bg);
                setFieldValue("pattern", t.overlay);
              }}
              className={`group relative rounded-lg overflow-hidden border 
                  transition-all duration-300 shadow-md 
                  focus:outline-none focus:ring-2 focus:ring-purple-400/40
                  ${
                    isActive
                      ? "bg-black text-white shadow-xl scale-105 border-gradient"
                      : "bg-neutral-900/50 hover:bg-neutral-800/70"
                  }`}
              title={t.overaly}
            >
              {/* preview area with pattern overlay */}
              <div className="relative h-16 w-full">
                {console.log(t)
                }
                <div
                  className="absolute inset-0"
                  style={{ background: t.bg?.value }}
                  aria-hidden="true"
                />
                <PatternOverlay type={t.overlay} opacity={0.15} />
              </div>

              {/* template name */}
              <div
                className={`px-2 py-1 text-xs truncate font-medium ${
                  isActive
                    ? "text-white"
                    : "text-neutral-300 group-hover:text-white"
                }`}
              >
                {t.overlay}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PatternSelector;
