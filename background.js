console.log("Running background.js");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const jsUrls = request.jsUrls;
  jsUrls.forEach((url) => chrome.tabs.create({ url }));
});
