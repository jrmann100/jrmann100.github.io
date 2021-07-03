const express = require("express");
const app = express();
const port = 3000;

app.use("static", express.static("static"));
app.use("/fragments", express.static("fragments"));
app.use(express.static("pages", { extensions: ["html"], index: "index.html" }));

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});
