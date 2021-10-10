require("dotenv").config();
const { Transform, pipeline } = require("stream");
const fs = require("fs");

const { INPUT_FILE_PATH, OUTPUT_FILE_PATH, WORD_SEPARATOR, LINE_SEPARATOR } =
  process.env;
const VALID_LINE = "#EXTINF";

pipeline(
  fs.createReadStream(INPUT_FILE_PATH).setEncoding("utf8"),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.chunks = "";
      callback();
    },
    transform(chunk, encoding, callback) {
      this.chunks += chunk;
      callback();
    },
    flush(callback) {
      try {
        const lines = this.chunks.split("\n");
        const process = function (line) {
          try {
            const result = line.matchAll(new RegExp(/group-title="(.*?)"/g));
            const normalized = [...result];
            const [, tag] = normalized[0];
            const [tagInfo, title] = line.split(LINE_SEPARATOR);
            return `${tagInfo}${LINE_SEPARATOR}${tag} ${WORD_SEPARATOR} ${title}`;
          } catch (e) {
            console.error(e);
            return line;
          }
        };
        const m3uArray =[];
        lines.forEach((line) => {
          let temp = line;
          if (line.startsWith(VALID_LINE)) {
            temp = process(line);
          }
          m3uArray.push(temp);
        });
        this.push(Buffer.from(m3uArray.join("\n").replace('undefined','')));
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream(OUTPUT_FILE_PATH),
  (err) => {
    if (err) {
      console.error("failed", err);
    } else {
      console.log("completed");
    }
  }
);
