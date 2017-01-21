require('babel-core/register')({});

// make sure the working directory is correct
process.chdir(__dirname);

// this is the server side, delete the `BROWSER` variable (set in webpack configuration)
// necessary in order for the stylesheets not to be loaded in the `./client/index.jsx`
delete process.env.BROWSER;

console.log(`CzechMyPixels [Blog] running in ${process.env.NODE_ENV} environment.`); // eslint-disable-line no-console
const server = require('./server').default.listen(process.env.PORT || 3002, () => {
  console.log(`Czech My Pixels [Blog] listening at http://${server.address().address}:${server.address().port}`);  // eslint-disable-line no-console
});
