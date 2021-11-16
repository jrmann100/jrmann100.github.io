const express = require("express");
const app = express();
const port = 3000;

// require("./render");

app.use("/", express.static("build", { extensions: ["html"], index: "index.html" }));

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
});
