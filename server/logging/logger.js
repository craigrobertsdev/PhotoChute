const { createLogger, format, transports, config } = require("winston");
const path = require("path");

// for logging activity in photo upload operations
const photoLogger = createLogger({
  transports: [new transports.Console(), new transports.File({ filename: "photos.log" })],
});

// for logging activity  in database operations
const dbLogger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "db.log", dirname: path.join(__dirname, "/logFiles") }),
  ],
});

module.exports = { photoLogger, dbLogger };
