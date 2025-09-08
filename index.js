const express = require("express");
const serveStatic = require("serve-static");
const cors = require("cors");
const path = require("path");

let hostname = "localhost";
let port = 3001;

const app = express();

app.use(cors());
app.options(/(.*)/, cors());

app.use(cors({
  origin: "https://global-self-learning.netlify.app",
  credentials: true
}));

// Serve static files
app.use(serveStatic(path.join(__dirname, "views"))); // for .html files
app.use(express.static(path.join(__dirname, "public"))); // for css, js, img

// Serve individual .html files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/header", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "header.html"));
});

app.get("/footer", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "footer.html"));
});

app.get("/form-fields", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supplier", "supplier-form-fields.html"));
});

app.listen(port, hostname, function () {
  console.log(`Frontend Server hosted at http://${hostname}:${port}`);
});
