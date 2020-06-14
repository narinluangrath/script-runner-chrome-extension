console.info = () => {};

class Storage {
  clear() {
    chrome.storage.local.clear();
  }

  updateRegexMapper(regexStr, filename) {
    console.info(`Updating regex mapper for ${regexStr}: ${filename}`);
    this.openRegexMapper((regexMapper) => {
      regexMapper = { ...regexMapper, [regexStr]: filename };
      chrome.storage.local.set({ REGEX_MAPPER: regexMapper });
    });
  }

  openRegexMapper(cb) {
    console.info(`Opening regex mapper`);
    chrome.storage.local.get(["REGEX_MAPPER"], ({ REGEX_MAPPER }) =>
      cb(REGEX_MAPPER || {})
    );
  }

  saveScriptFile(script, filename) {
    console.info(`Saving script for file ${filename}`);
    chrome.storage.local.set({ [filename]: script });
  }

  openScriptFile(filename, cb) {
    console.info(`Opening script file for file ${filename}`);
    chrome.storage.local.get([filename], (res) => cb(res[filename]));
  }

  getScriptFilesForUrl(url, cb) {
    console.info(`Getting script files for url ${url}`);
    this.openRegexMapper((regexMapper) => {
      console.info(`RegexMapper`, regexMapper);
      const filenames = Object.entries(regexMapper)
        .filter(([regex, filename]) => new RegExp(regex).test(url))
        .map(([_, filename]) => filename);
      cb(filenames);
    });
  }
}

const storage = new Storage();

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

function parseIndexFile(jsUrls) {
  console.info(`Parsing index file, got ${JSON.stringify(jsUrls)}`);
  storage.clear();
  jsUrls.forEach((url) => chrome.tabs.create({ url }));
}

function saveScriptFile(filename, code, tab) {
  console.info(`Saving script file: ${filename}`);
  // Parse regex from top of file
  const match = code.match(/\/\/ Matches:(?<regex>.*)/);
  const regex = match && match.groups && match.groups.regex;
  console.info(`Obtained regex ${regex}`);
  if (regex && regex.length) {
    storage.updateRegexMapper(regex.trim(), filename);
    storage.saveScriptFile(code, filename);
  }

  // TODO Add Date Modified
  chrome.tabs.remove([tab.id]);
}

function handleMessage(request, sender, sendResponse) {
  const { type, payload } = request;
  const { url, tab } = sender;
  console.info(`Handling message: type ${type} payload ${payload}`);

  switch (type) {
    case "INDEX_FILE":
      parseIndexFile(payload);
      break;
    case "SCRIPT_FILE":
      saveScriptFile(url, payload, tab);
      break;
    default:
      console.error(`No handler for type: ${type}`);
  }
}

Main();
