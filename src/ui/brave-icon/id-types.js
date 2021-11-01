/* eslint-disable */
/* Pickup from public/js/brave-font.min.js */
export const BRAVE_FONT_IDS = ["brave-link","brave-gear","brave-download","brave-qrcode","brave-ninja","brave-android","brave-ios"];
export const checkBraveFontId = (id) => {
  let _key = id.startsWith('brave-') ? id : `brave-${id.toLowerCase()}`;  return BRAVE_FONT_IDS.find((i) => i === _key);
};
