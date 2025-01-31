const fs = require("fs");
const readline = require("readline");
const path = require("path");

if (process.argv.length !== 3) {
  console.error("Usage: node extract_logs.js <YYYY-MM-DD>");
  process.exit(1);
}

const sampleLogFile = "sample_logs.log";
const farmartLogFile = "logs_2024.log";

const targetDate = process.argv[2];
const logFilePath = path.join(__dirname, farmartLogFile);
const outputDir = path.join(__dirname, "..", "output");
const outputFilePath = path.join(outputDir, `output_${targetDate}.txt`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const writeStream = fs.createWriteStream(outputFilePath, { encoding: "utf8" });

const readStream = fs.createReadStream(logFilePath, { encoding: "utf8" });
const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity });

const logPattern = new RegExp(
  `^${targetDate}T\\d{2}:\\d{2}:\\d{2}\\.\\d{4} - (INFO|WARN|ERROR) - .+`
);

console.log(`Extracting logs for date: ${targetDate}`);

let logFound = false;

rl.on("line", (line) => {
  if (logPattern.test(line)) {
    writeStream.write(line + "\n");
    logFound = true;
  }
});

rl.on("close", () => {
  if (!logFound) {
    console.log(`No logs found for ${targetDate}.`);
  } else {
    console.log(`Extraction complete. Logs saved to ${outputFilePath}`);
  }
  writeStream.end();
});

rl.on("error", (err) => {
  console.error("Error reading log file:", err);
  process.exit(1);
});

writeStream.on("error", (err) => {
  console.error("Error writing output file:", err);
  process.exit(1);
});
