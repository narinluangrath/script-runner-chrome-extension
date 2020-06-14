console.log("Running content.js");
const anchorEls = Array.from(document.getElementsByTagName("a"));
const fileUrls = anchorEls.map((anchorEl) => anchorEl.getAttribute("href"));
const jsUrls = fileUrls
  .filter((url) => url.endsWith(".js"))
  .map((url) => `file://${url}`);
chrome.runtime.sendMessage({ jsUrls });
