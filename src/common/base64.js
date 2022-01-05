// https://stackoverflow.com/questions/56647747/how-to-base64-encode-emojis-in-javascript
// Encode unicode to base64
function unicodeToBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
// Decode unicode from base64
function base64ToUnicode(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

export { unicodeToBase64, base64ToUnicode };
