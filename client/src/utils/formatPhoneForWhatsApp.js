export const formatPhoneForWhatsApp = (raw) => {
  if (!raw) return "";
  if (typeof raw === "object") {
    const dial = raw?.dialCode ?? "";
    const num = raw?.phoneNumber ?? "";
    return `${dial}${num}`.replace(/\D/g, "");
  }
  return String(raw).replace(/\D/g, "").replace(/^0+/, "");
};
