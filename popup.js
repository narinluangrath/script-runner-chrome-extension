const form = document.getElementById("form");

form.onsubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const scriptFolder = `file://${formData.get("script-folder")}`;
  chrome.storage.local.set({ scriptFolder });
  chrome.runtime.sendMessage({
    type: "SCRIPT_FOLDER_SET",
    payload: scriptFolder,
  });
};
