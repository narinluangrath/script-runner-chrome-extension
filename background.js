function Main() {
  chrome.runtime.onMessage.addListener(handleMessage);
}

function parseIndexFile(payload) {
  const jsUrls = payload;
  jsUrls.forEach((url) => chrome.tabs.create({ url }));
}

function handleMessage(request, sender, sendResponse) {
  const { type, payload } = request;

  switch (type) {
    case "INDEX_FILE":
      parseIndexFile(payload);
      break;
    default:
      console.error(`No handler for type: ${type}`);
  }
}

Main();
