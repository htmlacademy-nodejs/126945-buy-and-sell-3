`use strict`;

const http = require(`http`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const FILENAME = `mocks.json`;
const DEFAULT_PORT = 3000;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

const sendResponse = (res, statusCode, message) => {
  const template = `
  <!Doctype html>
  <html lang="ru">
  <head>
      <title>With love from Node</title>
  </head>
  <body>${message}</body>
  </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

module.exports = {
  name: `--server`,
  run(customPort) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, (err) => {
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    })
    .on(`error`, ({message}) => {
      console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
    });
  }
};
