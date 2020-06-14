function Main() {
  chrome.runtime.onMessage.addListener(handleMessage);
}

function parseIndexFile(payload) {
  const jsUrls = payload;
  jsUrls.forEach((url) => chrome.tabs.create({ url }));
}

function saveScriptFile(url, payload) {
  // TODO Add Date Modified
  chrome.storage.sync.set({ [url]: payload });
}

function openScriptFile(url, cb) {
  chrome.storage.sync.get([url]);
}

function handleMessage(request, sender, sendResponse) {
  const { type, payload } = request;
  const { url } = sender;

  switch (type) {
    case "INDEX_FILE":
      parseIndexFile(payload);
      break;
    case "SCRIPT_FILE":
      saveScriptFile(url, payload);
    default:
      console.error(`No handler for type: ${type}`);
  }
}

Main();
