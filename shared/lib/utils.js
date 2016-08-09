let utils = {
  getViewport() {
    return {
      width: process.env.BROWSER ? window.innerWidth : 0,
      height: process.env.BROWSER ? window.innerHeight : 0
    };
  },
  getDimensions(){
    return {
      width: process.env.BROWSER ? document.body.clientWidth : 0,
      height: process.env.BROWSER ? document.body.clientHeight : 0
    };
  },
  truncate(string, max) {
    let trimmed = string.substring(0, max);
    return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
  }
};

module.exports = utils;
