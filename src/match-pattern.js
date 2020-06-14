// https://developer.chrome.com/extensions/match_patterns
class MatchPattern {
  constructor(str) {
    Object.assign(this, parseString(str));
  }

  isMatch(url) {
    if (this.allUrls) {
      return true;
    }

    const { protocol, host, pathname } = new URL(url);

    // Check protocol
    if (!(`${this.scheme}:` === protocol || protocol === "*")) {
      return false;
    }

    // Check host
    const hostAsRegExp = new RegExp(this.host.replace("*", ".*"));
    if (!hostAsRegExp.test(host)) {
      return false;
    }

    // Check pathname
    const pathAsRegExp = new RegExp(this.path.replace("*", ".*"));
    if (!pathAsRegExp.test(pathname)) {
      return false;
    }

    return true;
  }
}

function parseString(str) {
  str = (str && str.trim()) || "";

  if (str === "<all_urls>") {
    return { allUrls: true };
  }

  const isFile = str.startsWith("file");

  // When using the contructor function (e.g. new RegExp("foo"))
  // instead of the literal notation (e.g. /foo/) you need to use
  // two slashes to escape a character instead of just one.
  // https://stackoverflow.com/a/17863171
  const _scheme = "(?<scheme>\\*|http|https|file|ftp)";
  // File URLs do not have hosts
  const _host = isFile ? "" : "(?<host>\\*|\\*\\.[^\\/\\*]+|[^\\/\\*]+)";
  const _path = "(?<path>\\/.*)";
  const urlPattern = new RegExp(`^${_scheme}:\\/\\/${_host}${_path}$`);

  const match = str.match(urlPattern);

  if (!match) {
    throw Error("Invalid match pattern string");
  }

  return match.groups;
}

export { MatchPattern };
