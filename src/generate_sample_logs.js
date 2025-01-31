const fs = require("fs");
const path = require("path");

function getRandomLogLevel() {
  const logLevels = ["INFO", "WARN", "ERROR"];
  return logLevels[Math.floor(Math.random() * logLevels.length)];
}

function getRandomLogMessage() {
  const messages = [
    "User logged in",
    "Failed to connect to the database",
    "Disk space running low",
    "User logged out",
    "File not found",
    "Connection lost",
    "Database query successful",
    "Memory usage high",
    "Server started",
    "User updated profile",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function generateLogFile(filePath, numEntries) {
  const writeStream = fs.createWriteStream(filePath, { flags: "w" });

  for (let i = 0; i < numEntries; i++) {
    const timestamp = new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    );

    const formattedDate = timestamp.toISOString().slice(0, 23);

    const logLevel = getRandomLogLevel();
    const logMessage = getRandomLogMessage();

    writeStream.write(`${formattedDate} - ${logLevel} - ${logMessage}\n`);
  }

  writeStream.end();
  console.log(`Log file created at ${filePath}`);
}

const logFilePath = path.join(__dirname, "sample_logs.log");
generateLogFile(logFilePath, 100000);
