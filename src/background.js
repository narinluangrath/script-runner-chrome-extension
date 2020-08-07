import * as storage from "./storage";

console.info = () => {};

function Main() {
  chrome.runtime.onMessage.addListener(handleMessage);
  chrome.tabs.onUpdated.addListener(handleUpdatedTab);
}

async function handleUpdatedTab(tabId, changeInfo, tab) {
  const ready = changeInfo.status === "complete";
  if (!ready) {
    return;
  }
  const url = changeInfo.url || tab.url || tab.pendingUrl;
  if (!url) {
    throw Error("Could not get URL");
  }
  console.info(`Updated tab for url ${url} with id ${tabId}`);
  const filenames = await storage.getScriptFilesForUrl(url);
  const scriptPromises = filenames.map((f) => storage.openScriptFile(f));
  const scripts = await Promise.all(scriptPromises);
  scripts.forEach((script) =>
    chrome.tabs.executeScript(tabId, {
      code: script,
      runAt: "document_end",
    })
  );
}

async function parseScriptFolder(jsUrls, tab) {
  console.info(`Parsing index file, got ${JSON.stringify(jsUrls)}`);
  await storage.clear();
  jsUrls.forEach((url) => chrome.tabs.create({ url, windowId: tab.windowId }));
  chrome.tabs.remove([tab.id]);
}

async function saveScriptFile(filename, code, tab) {
  console.info(`Saving script file: ${filename}`);
  // Parse pattern from top of file
  const match = code.match(/\/\/ Pattern:(?<pattern>.*)/);
  const pattern = match && match.groups && match.groups.pattern;
  console.info(`Obtained pattern ${pattern}`);
  if (pattern && pattern.length) {
    await storage.updatePatternMapper(pattern.trim(), filename);
    await storage.saveScriptFile(code, filename);
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
