const express = require("express");
const app = express();
const port = 3000;

app.use("/static", express.static("static"));
app.use("/fragments", express.static("fragments", { extensions: ["html.inc"], index: "index.html.inc" }));
app.use(express.static("build", { extensions: ["html"], index: "index.html" }));

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});
