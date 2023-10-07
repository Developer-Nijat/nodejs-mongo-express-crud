const express = require("express");
const json2csv = require("json2csv").parse;
const fs = require("fs");
const readline = require("readline");

const router = express.Router();

const logFilePath = "./logs/access.log";
const headers = [
  "IP",
  "DATE",
  "METHOD",
  "URL",
  "QUERY",
  "PARAMS",
  "BODY",
  "HTTP",
  "STATUS",
  "REFERRER",
  "USER_AGENT",
];

router.get("/list", async (req, res, next) => {
  try {
    if (fs.existsSync(logFilePath)) {
      const logs = [];

      const rl = readline.createInterface({
        input: fs.createReadStream(logFilePath),
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        if (headers.length === 0) {
          // First line is assumed to contain headers
          headers = line.split(" | ");
        } else {
          const logEntry = line.split(" | ");
          const logObject = {};
          for (let i = 0; i < headers.length; i++) {
            logObject[headers[i]] = logEntry[i] || ""; // Ensure all columns are present
          }
          logs.push(logObject);
        }
      });

      rl.on("close", () => {
        res.json({ headers, logs });
      });
    } else {
      res.status(404).json("Log file path not found");
    }
  } catch (err) {
    console.error("logs list error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.get("/export-csv", async (req, res, next) => {
  try {
    if (fs.existsSync(logFilePath)) {
      const logs = [];

      const rl = readline.createInterface({
        input: fs.createReadStream(logFilePath),
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        if (headers.length === 0) {
          headers = line.split(" | ");
        } else {
          const logEntry = line.split(" | ");
          const logObject = {};
          for (let i = 0; i < headers.length; i++) {
            logObject[headers[i]] = logEntry[i] || "";
          }
          logs.push(logObject);
        }
      });

      rl.on("close", () => {
        // Convert logs array to CSV format
        const csv = json2csv(logs, { fields: headers });

        // Set response headers to trigger file download
        res.setHeader("Content-Disposition", "attachment; filename=logs.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
      });
    } else {
      res.status(404).json("Log file path not found");
    }
  } catch (err) {
    console.error("logs export-csv error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
