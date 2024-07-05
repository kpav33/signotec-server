const express = require("express");
const path = require("path");

const app = express();
// Signotec server will run on this port
const port = 3001;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Signotec server running at http://localhost:${port}`);
});
