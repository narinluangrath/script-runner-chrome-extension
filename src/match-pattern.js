// https://developer.chrome.com/extensions/match_patterns
class MatchPattern {
  constructor(str) {
    Object.assign(this, parseString(str));
  }

  isMatch() {
    // TODO
  }
}

function parseString(str) {
  str = (str && str.trim()) || "";

  if (str === "<all_urls>") {
    return new MatchPattern({ allUrls: true });
  }

  const isFile = url.startsWith("file");

  // When using the contructor function (e.g. new RegExp("foo"))
  // instead of the literal notation (e.g. /foo/) you need to use
  // two slashes to escape a character instead of just one.
  // https://stackoverflow.com/a/17863171
  const _scheme = "(?<scheme>\\*|http|https|file|ftp)";
  // File URLs do not have hosts
  const _host = isFile ? "(?<host>\\*|\\*\\.[^\\/\\*]+|[^\\/\\*]+)" : "";
  const _path = "(?<path>\\/.*)";
  const urlPattern = new RegExp(`^${_scheme}:\\/\\/${_host}${_path}$`);

  const match = str.match(urlPattern);

  if (!match) {
    throw Error("Invalid match pattern string");
  }

  return match.groups;
}
