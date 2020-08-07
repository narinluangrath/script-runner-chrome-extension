import * as storage from "./storage";

console.info = () => {};

function Main() {
  chrome.runtime.onMessage.addListener(handleMessage);
  chrome.tabs.onUpdated.addListener(handleUpdatedTab);
}

function handleUpdatedTab(tabId, changeInfo, tab) {
  const ready = changeInfo.status === "complete";
  if (!ready) {
    return;
  }
  const url = changeInfo.url || tab.url || tab.pendingUrl;
  if (!url) {
    throw Error("Could not get URL");
  }
  console.info(`Updated tab for url ${url} with id ${tabId}`);
  storage.getScriptFilesForUrl(url, (filenames) => {
    filenames.forEach((filename) => {
      storage.openScriptFile(filename, (script) => {
        console.info(`Executing script on tab ${tabId} with content ${script}`);
        chrome.tabs.executeScript(tabId, {
          code: script,
          runAt: "document_end",
        });
      });
    });
  });
}

function parseScriptFolder(jsUrls, tab) {
  console.info(`Parsing index file, got ${JSON.stringify(jsUrls)}`);
  storage.clear();
  jsUrls.forEach((url) => chrome.tabs.create({ url, windowId: tab.windowId }));
  chrome.tabs.remove([tab.id]);
}

function saveScriptFile(filename, code, tab) {
  console.info(`Saving script file: ${filename}`);
  // Parse pattern from top of file
  const match = code.match(/\/\/ Pattern:(?<pattern>.*)/);
  const pattern = match && match.groups && match.groups.pattern;
  console.info(`Obtained pattern ${pattern}`);
  if (pattern && pattern.length) {
    storage.updatePatternMapper(pattern.trim(), filename);
    storage.saveScriptFile(code, filename);
  }

  // TODO Add Date Modified
  chrome.tabs.remove([tab.id]);
}

function openScriptFolder(folderUrl) {
  chrome.windows.create({
    url: folderUrl,
    focused: false,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
}

function handleMessage(request, sender) {
  const { type, payload } = request;
  const { url, tab } = sender;
  console.info(`Handling message: type ${type} payload ${payload}`);

  switch (type) {
    case "SCRIPT_FOLDER_SET":
      openScriptFolder(payload);
      break;
    case "SCRIPT_FILE_URLS":
      parseScriptFolder(payload, tab);
      break;
    case "SCRIPT_FILE":
      saveScriptFile(url, payload, tab);
      break;
    default:
      console.error(`No handler for type: ${type}`);
  }
}

Main();
