const _ = require('lodash');
const os = require('os');

let URL = {
  normalize(url) {
    //for browser, just return the URL as it is
    if (process.env.BROWSER) return url;

    //for server, prefix it properly
    if (os.hostname().toLowerCase().startsWith('tadeass')) {
      return `http://czechmypixels/${url}`;
    } else {
      return `http://czechmypixels.com/${url}`;
    }
  }
}

module.exports = URL;
