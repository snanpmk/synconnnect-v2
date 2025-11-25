// write a js fn that fetch country by location and set default country code


export const defaultPhoneState = {
  dialCode: "+91",
  countryCode: "IN",
  phoneNumber: "",
};

export const INITIAL_FORM_STATE = {
  // Step 1: Core Info
  fullName: "",
  businessName: "",
  businessCategory: "",
  tagline: "",
  detailedAbout: ``,
  designation: "",
  companyName: "",

  // Step 2: Contact
  phone: { ...defaultPhoneState },
  whatsapp: { ...defaultPhoneState },
  email: "",
  location: "",
  useSameNumberForWhatsapp: true,

  // Step 3: Media & Reviews
  coverPhoto: "",
  existingCoverPhoto: {
    url: "",
    fullPath: "",
  },
  profilePhoto: "",
  existingProfilePhoto: {
    url: "",
    fullPath: "",
  },

  // youtubeId: "",
  googleReviewLink: "",
  youtubeVideoUrl: "",

  // Step 4: Socials (useFieldArray)
  socialLinks: [], // Start empty

  // Step 5: Services & Offerings (useFieldArray)
  servicesHeading: "Services",
  services: [],
};
