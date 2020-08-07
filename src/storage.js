/**
 * Wrapper functions around Chrome Extension Storage API
 */

import { MatchPattern } from "./match-pattern";

export const clear = () => {
  chrome.storage.local.clear();
};

export const updatePatternMapper = (patternStr, filename) => {
  console.info(`Updating pattern mapper for ${patternStr}: ${filename}`);
  openPatternMapper((patternMapper) => {
    patternMapper = { ...patternMapper, [patternStr]: filename };
    chrome.storage.local.set({ PATTERN_MAPPER: patternMapper });
  });
};

export const openPatternMapper = (cb) => {
  console.info("Opening pattern mapper");
  chrome.storage.local.get(["PATTERN_MAPPER"], ({ PATTERN_MAPPER }) =>
    cb(PATTERN_MAPPER || {})
  );
};

export const saveScriptFile = (script, filename) => {
  console.info(`Saving script for file ${filename}`);
  chrome.storage.local.set({ [filename]: script });
};

export const openScriptFile = (filename, cb) => {
  console.info(`Opening script file for file ${filename}`);
  chrome.storage.local.get([filename], (res) => cb(res[filename]));
};

export const getScriptFilesForUrl = (url, cb) => {
  console.info(`Getting script files for url ${url}`);
  openPatternMapper((patternMapper) => {
    console.info("PatternMapper", patternMapper);
    const filenames = Object.entries(patternMapper)
      .filter(([pattern]) => new MatchPattern(pattern).isMatch(url))
      .map(([, filename]) => filename);
    cb(filenames);
  });
};
