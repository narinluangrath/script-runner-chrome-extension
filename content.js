function SendJSFilesFromIndexFile() {
  const anchorEls = Array.from(document.getElementsByTagName("a"));
  const fileUrls = anchorEls.map((anchorEl) => anchorEl.getAttribute("href"));
  const jsUrls = fileUrls
    .filter((url) => url.endsWith("sr.js"))
    .map((url) => `file://${url}`);
  chrome.runtime.sendMessage({ type: "INDEX_FILE", payload: jsUrls });
}

function Main() {
  const url = document.URL;
  const isScriptRunnerDir = url.endsWith("script-runner-scripts/");
  const isScriptRunnerScript = url.endsWith("sr.js");

  if (isScriptRunnerDir) {
    SendJSFilesFromIndexFile();
  } else if (isScriptRunnerScript) {
    // Parse the file, save it to storage, close the file
  } else {
    // Normal HTML Document. Check to see if scripts match.
  }
}

Main();
