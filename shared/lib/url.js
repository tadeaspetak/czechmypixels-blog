const _ = require('lodash');

let URL = {
  //prefix the URL with a host if this runs on the server (necessary as relative URLs naturally cannot suffice)
  normalize(url) {
    return process.env.BROWSER ? url : `http://${process.env.HOST}/${url}`;
  }
}

module.exports = URL;
