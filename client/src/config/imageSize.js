export const IMAGE_CONFIG = {
  square: {
    aspect: 1,
    width: 800,
    height: 800,
    label: "Square (1:1)",
  },
  portrait: {
    aspect: 3 / 4,
    width: 800,
    height: 1067,
    label: "Portrait (3:4)",
  },
  landscape: {
    aspect: 16 / 9,
    width: 1000,
    height: 562,
    label: "Landscape (16:9)",
  },
  banner: {
    aspect: 1200 / 500,
    width: 1200,
    height: 500,
    label: "Banner (12:5)",
  },
};

export const IMAGE_TYPES = Object.keys(IMAGE_CONFIG);
