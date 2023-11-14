if (typeof self === 'undefined') {
  global.self = {};
}
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(
  path.join(__dirname, '../dist/search.html'),
  'utf-8'
);

const server = (port) => {
  const app = express();
  app.use(express.static('dist'));
  app.get('/search', (req, res) => {
    const html = renderMarkup(renderToString(SSR));
    res.status(200).send(html);
  });
  app.listen(port, () => {
    console.log('Server is running on port:' + port);
  });
};

server(process.env, PORT || 3000);

const renderMarkup = (str) => {
  const dataStr = JSON.stringify({});
  return template
    .replace('<!--HTML_PLACEHOLDER-->', str)
    .replace(
      '<!--INITIAL_PLACEHOLDER-->',
      `<script>window.__initial_data = ${dataStr}</script>`
    );
};
