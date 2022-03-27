/**
 * @file Sample server for static pre-rendered site.
 * @author Jordan Mann
 */

import express from 'express';
const app = express();
const port = 3000;

// require("./render");

app.use('/', express.static('build', { extensions: ['html'], index: 'index.html' }));

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
