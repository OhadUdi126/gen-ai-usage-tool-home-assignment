const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../../logs/ai-usage.log");

function logToFile(message) {
  const timestamp = new Date();

  const logLine = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
    }
  });
}

module.exports = { logToFile };
