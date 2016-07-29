'use strict';
require('babel-core/register')({});

//this is the server side, delete the `BROWSER` variable (set in webpack configuration)
//necessary in order for the stylesheets not to be loaded in the `./client/index.jsx`
delete process.env.BROWSER;

//start up the server
var server = require('./server').default;
server.listen(process.env.PORT || 3002, function () {
  console.log(`Czech My Pixels's Blog listening at http://${server.address().address}:${server.address().port}`);
});
