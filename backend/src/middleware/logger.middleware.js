const morgan = require("morgan");
const rfs = require("rotating-file-stream");

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: "./logs",
});

morgan.token("body", (req, res) => JSON.stringify(req.body));
morgan.token("reqUrl", (req, res) =>
  req.url ? req.url.split("?")[0] : req.url
);
morgan.token("reqParams", (req, res) => JSON.stringify(req.params));
morgan.token("reqQuery", (req, res) => JSON.stringify(req.query));

module.exports = morgan(
  ":remote-addr | :date[iso] | :method | ':reqUrl' | ':reqQuery' | :reqParams | :body | HTTP/:http-version | :status | :referrer | ':user-agent'",
  { stream: accessLogStream }
);
