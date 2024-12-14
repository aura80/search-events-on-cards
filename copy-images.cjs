const fs = require("fs-extra");
const path = require("path");

const source = path.join(__dirname, "images");
const destination = path.join(__dirname, "dist", "images");

fs.copy(source, destination, (err) => {
  if (err) {
    console.error("Error copying images:", err);
  } else {
    console.log("Images copied successfully!");
  }
});
