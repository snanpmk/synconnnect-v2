export const themeConfigs = {
  // ⚪ PURE WHITE — Non-gradient, true minimal
  pureWhite: {
    bg: "bg-white",
    text: "text-gray-900",
    textSecondary: "text-gray-500",
    border: "border-gray-200",
    accent: "text-blue-600",
    accentBg: "bg-blue-600",
    accentLightBg: "bg-blue-50",
    accentHover: "hover:bg-blue-700",

    cardBg: "bg-white",
    cardBorder: "border-gray-200",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    buttonBg: "bg-blue-600",
    buttonText: "text-white",
    shadow: "shadow-sm",
  },

  // ⚫ PURE BLACK — Non-gradient, elegant dark
  trueBlack: {
    bg: "bg-black",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-gray-900",
    accent: "text-gray-300",
    accentBg: "bg-blue-700",
    accentLightBg: "bg-blue-400",
    accentHover: "hover:bg-blue-600",

    cardBg: "bg-gray-950",
    cardBorder: "border-gray-800",
    inputBg: "bg-gray-900",
    inputBorder: "border-gray-700",
    buttonBg: "bg-blue-700",
    buttonText: "text-white",
    shadow: "shadow-md shadow-black/40",
  },

  // 🩵 Minimal Light
  minimalLight: {
    bg: "bg-gradient-to-br from-white via-[#dbeafe] to-[#3b82f6]",
    text: "text-gray-900",
    textSecondary: "text-gray-500",
    border: "border-gray-200",
    accent: "text-blue-600",
    accentBg: "bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb]",
    accentLightBg: "bg-gradient-to-r from-[#eff6ff] to-[#dbeafe]",
    accentHover: "hover:from-[#3b82f6] hover:to-[#1d4ed8]",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-blue-200",
    inputBg: "bg-white/80",
    inputBorder: "border-blue-300",
    buttonBg: "bg-blue-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 🌙 Minimal Dark
  minimalDark: {
    bg: "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800",
    text: "text-gray-50",
    textSecondary: "text-gray-400",
    border: "border-gray-800",
    accent: "text-cyan-400",
    accentBg: "bg-gradient-to-r from-cyan-600 to-cyan-700",
    accentLightBg: "bg-gradient-to-r from-gray-800 to-gray-900",
    accentHover: "hover:from-cyan-500 hover:to-cyan-700",

    cardBg: "bg-gray-900/70 backdrop-blur",
    cardBorder: "border-gray-700",
    inputBg: "bg-gray-800",
    inputBorder: "border-gray-700",
    buttonBg: "bg-cyan-600",
    buttonText: "text-white",
    shadow: "shadow-lg shadow-black/30",
  },

  // 🌿 Minimal Green
  minimalGreen: {
    bg: "bg-gradient-to-br from-white via-emerald-50 to-emerald-100",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    accentBg: "bg-gradient-to-r from-emerald-500 to-emerald-700",
    accentLightBg: "bg-gradient-to-r from-emerald-100 to-emerald-50",
    accentHover: "hover:from-emerald-600 hover:to-emerald-800",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-emerald-200",
    inputBg: "bg-white",
    inputBorder: "border-emerald-300",
    buttonBg: "bg-emerald-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 💜 Minimal Purple
  minimalPurple: {
    bg: "bg-gradient-to-br from-white via-purple-50 to-purple-100",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-purple-200",
    accent: "text-purple-700",
    accentBg: "bg-gradient-to-r from-purple-500 to-purple-700",
    accentLightBg: "bg-gradient-to-r from-purple-100 to-purple-50",
    accentHover: "hover:from-purple-600 hover:to-purple-800",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-purple-200",
    inputBg: "bg-white",
    inputBorder: "border-purple-300",
    buttonBg: "bg-purple-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 🌌 Midnight Blue
  midnightBlue: {
    bg: "bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950",
    text: "text-slate-50",
    textSecondary: "text-slate-400",
    border: "border-slate-700",
    accent: "text-blue-400",
    accentBg: "bg-gradient-to-r from-blue-700 to-indigo-700",
    accentLightBg: "bg-gradient-to-r from-slate-800 to-slate-900",
    accentHover: "hover:from-blue-600 hover:to-indigo-800",

    cardBg: "bg-slate-900/60 backdrop-blur",
    cardBorder: "border-slate-700",
    inputBg: "bg-slate-800",
    inputBorder: "border-slate-700",
    buttonBg: "bg-indigo-700",
    buttonText: "text-white",
    shadow: "shadow-lg shadow-black/40",
  },

  // 🌇 Sunset Orange
  sunsetOrange: {
    bg: "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-orange-200",
    accent: "text-orange-700",
    accentBg: "bg-gradient-to-r from-orange-500 to-orange-700",
    accentLightBg: "bg-gradient-to-r from-orange-100 to-orange-50",
    accentHover: "hover:from-orange-600 hover:to-orange-800",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-orange-200",
    inputBg: "bg-white",
    inputBorder: "border-orange-300",
    buttonBg: "bg-orange-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 🌸 Soft Pink
  softPink: {
    bg: "bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-pink-200",
    accent: "text-pink-700",
    accentBg: "bg-gradient-to-r from-pink-500 to-pink-700",
    accentLightBg: "bg-gradient-to-r from-pink-100 to-pink-50",
    accentHover: "hover:from-pink-600 hover:to-pink-800",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-pink-200",
    inputBg: "bg-white",
    inputBorder: "border-pink-300",
    buttonBg: "bg-pink-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 🌊 Ocean Blue
  oceanBlue: {
    bg: "bg-gradient-to-br from-sky-50 via-sky-100 to-blue-100",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-sky-200",
    accent: "text-sky-700",
    accentBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    accentLightBg: "bg-gradient-to-r from-sky-100 to-sky-50",
    accentHover: "hover:from-sky-600 hover:to-blue-700",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-sky-200",
    inputBg: "bg-white",
    inputBorder: "border-sky-300",
    buttonBg: "bg-sky-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 🍷 Dark Red
  darkRed: {
    bg: "bg-gradient-to-br from-red-950 via-red-900 to-red-800",
    text: "text-red-50",
    textSecondary: "text-red-300",
    border: "border-red-800",
    accent: "text-red-400",
    accentBg: "bg-gradient-to-r from-red-600 to-red-700",
    accentLightBg: "bg-gradient-to-r from-red-900 to-red-800",
    accentHover: "hover:from-red-500 hover:to-red-700",

    cardBg: "bg-red-900/60 backdrop-blur",
    cardBorder: "border-red-800",
    inputBg: "bg-red-950",
    inputBorder: "border-red-800",
    buttonBg: "bg-red-600",
    buttonText: "text-white",
    shadow: "shadow-xl shadow-red-900/40",
  },

  // 🍋 Lemon Lime
  lemonLime: {
    bg: "bg-gradient-to-br from-lime-50 via-lime-100 to-yellow-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-lime-200",
    accent: "text-lime-700",
    accentBg: "bg-gradient-to-r from-primary to-green-600",
    accentLightBg: "bg-gradient-to-r from-lime-100 to-lime-50",
    accentHover: "hover:from-lime-600 hover:to-green-700",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-lime-200",
    inputBg: "bg-white",
    inputBorder: "border-lime-300",
    buttonBg: "bg-lime-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 🧿 Teal Gem
  tealGem: {
    bg: "bg-gradient-to-br from-teal-50 via-cyan-50 to-cyan-100",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-teal-200",
    accent: "text-teal-700",
    accentBg: "bg-gradient-to-r from-teal-500 to-cyan-600",
    accentLightBg: "bg-gradient-to-r from-teal-100 to-cyan-50",
    accentHover: "hover:from-teal-600 hover:to-cyan-700",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-teal-200",
    inputBg: "bg-white",
    inputBorder: "border-teal-300",
    buttonBg: "bg-teal-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // ☕ Warm Brown
  warmBrown: {
    bg: "bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-amber-200",
    accent: "text-amber-800",
    accentBg: "bg-gradient-to-r from-amber-600 to-orange-700",
    accentLightBg: "bg-gradient-to-r from-amber-100 to-orange-50",
    accentHover: "hover:from-amber-700 hover:to-orange-800",

    cardBg: "bg-white/70 backdrop-blur",
    cardBorder: "border-amber-200",
    inputBg: "bg-white",
    inputBorder: "border-amber-300",
    buttonBg: "bg-amber-600",
    buttonText: "text-white",
    shadow: "shadow",
  },

  // 💜 Indigo Night
  indigoNight: {
    bg: "bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950",
    text: "text-indigo-50",
    textSecondary: "text-indigo-300",
    border: "border-indigo-800",
    accent: "text-indigo-400",
    accentBg: "bg-gradient-to-r from-indigo-600 to-purple-700",
    accentLightBg: "bg-gradient-to-r from-indigo-900 to-purple-900",
    accentHover: "hover:from-indigo-500 hover:to-purple-700",

    cardBg: "bg-indigo-950/60 backdrop-blur",
    cardBorder: "border-indigo-800",
    inputBg: "bg-indigo-900",
    inputBorder: "border-indigo-800",
    buttonBg: "bg-indigo-600",
    buttonText: "text-white",
    shadow: "shadow-lg shadow-indigo-900/40",
  },

  // 🌲 Forest Green
  forestGreen: {
    bg: "bg-gradient-to-br from-green-950 via-emerald-950 to-green-900",
    text: "text-green-50",
    textSecondary: "text-green-300",
    border: "border-green-800",
    accent: "text-green-400",
    accentBg: "bg-gradient-to-r from-green-600 to-emerald-700",
    accentLightBg: "bg-gradient-to-r from-green-900 to-emerald-950",
    accentHover: "hover:from-green-500 hover:to-emerald-700",

    cardBg: "bg-green-900/60 backdrop-blur",
    cardBorder: "border-green-800",
    inputBg: "bg-green-950",
    inputBorder: "border-green-800",
    buttonBg: "bg-emerald-600",
    buttonText: "text-white",
    shadow: "shadow-xl shadow-green-900/40",
  },
};
