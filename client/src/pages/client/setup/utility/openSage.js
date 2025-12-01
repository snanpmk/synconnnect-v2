export const openSafe = (url) => {
  const safeURL = url.startsWith("http") ? url : `https://${url}`;

  // If app-based links, use href
  if (
    safeURL.startsWith("tel:") ||
    safeURL.startsWith("mailto:") ||
    safeURL.includes("wa.me")
  ) {
    window.location.href = safeURL;
    return;
  }

  // detect if in-app browser (Instagram, Facebook, LinkedIn)
  const ua = navigator.userAgent || navigator.vendor;

  const isInAppBrowser =
    ua.includes("FBAN") ||
    ua.includes("FBAV") ||
    ua.includes("Instagram") ||
    ua.includes("Line") ||
    ua.includes("MiuiBrowser") ||
    ua.includes("HeyTapBrowser") ||
    ua.includes("VivoBrowser") ||
    ua.includes("QQBrowser") ||
    ua.includes("QQ/Browser") ||
    ua.includes("WeChat") ||
    ua.includes("UCBrowser") ||
    ua.includes("LinkedIn");

  if (isInAppBrowser) {
    // open in same tab → avoids blank screen
    window.location.href = safeURL;
  } else {
    // normal browsers can use _blank
    window.open(safeURL, "_blank");
  }
};
