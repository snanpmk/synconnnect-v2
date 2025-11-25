export const EVENT_TYPES = {
  VIEW: "view",
  CONTACT_CALL: "contact_call",
  CONTACT_WHATSAPP: "contact_whatsapp",
  CONTACT_EMAIL: "contact_email",
  CONTACT_LOCATION: "contact_location",
  SOCIAL: (platform) => `social_${platform}`,
  SAVE_CONTACT: "save_contact",
  CONNECT_FORM_OPEN: "connect_form_open",
  CONNECT_FORM_SUBMIT: "connect_form_submit",
  YOUTUBE_OPEN: "youtube_open",
  SERVICE_VIEW: "service_view",
};
