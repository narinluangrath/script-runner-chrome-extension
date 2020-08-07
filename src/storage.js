/**
 * Wrapper functions around Chrome Extension Storage API
 * https://developer.chrome.com/extensions/storage
 */

import { MatchPattern } from "./match-pattern";

// Check for runtime error
// https://developer.chrome.com/extensions/runtime#property-lastError
const getError = () => chrome.runtime.lastError;

const promisify = (fn) => (fnArgs) =>
  new Promise((resolve, reject) => {
    try {
      fn(...fnArgs, (result) => {
        const error = getError();
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });

// Promisify chrome.storage callback APIs
const get = promisify(chrome.storage.local.get);
const set = promisify(chrome.storage.local.set);
export const clear = promisify(chrome.storage.local.clear);

export const updatePatternMapper = async (patternStr, filename) => {
  console.info(`Updating pattern mapper for ${patternStr}: ${filename}`);
  let patternMapper = await openPatternMapper();
  patternMapper = { ...patternMapper, [patternStr]: filename };
  await set({ PATTERN_MAPPER: patternMapper });
};

export const openPatternMapper = async () => {
  console.info("Opening pattern mapper");
  const result = await get("PATTERN_MAPPER");
  return result["PATTERN_MAPPER"];
};

export const saveScriptFile = async (script, filename) => {
  console.info(`Saving script for file ${filename}`);
  await set({ [filename]: script });
};

export const openScriptFile = async (filename) => {
  console.info(`Opening script file for file ${filename}`);
  const result = await get(filename);
  return result[filename];
};

export const getScriptFilesForUrl = async (url) => {
  console.info(`Getting script files for url ${url}`);
  const patternMapper = await openPatternMapper();
  return Object.entries(patternMapper)
    .filter(([pattern]) => new MatchPattern(pattern).isMatch(url))
    .map(([, filename]) => filename);
};
