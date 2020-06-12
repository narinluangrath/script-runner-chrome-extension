const fileSystemConfig = {
  type: "openDirectory",
  suggestedName: "~/dev/script-runner-scripts",
  accepts: ["js"],
};

chrome.fileSystem.chooseEntry(fileSystemConfig, console.log);
