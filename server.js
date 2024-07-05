const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
// Signotec server will run on this port
const port = 3001;

// Added after changed of api routes
// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Before websocker
// app.listen(port, () => {
//   console.log(`Signotec server running at http://localhost:${port}`);
// });

// After adding websocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Added after changed of api routes
let signatureDataStore = null;

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("Received message:", message);

    // Example: Handle incoming messages if needed
    if (message === "hello") {
      ws.send("world"); // Example response
    }
  });

  // Example: Sending a message to the client
  ws.send("Welcome to WebSocket server");
});

// This would need to happen in Next.js api routes
// // Example route handling POST request
// app.post("/api/signature", (req, res) => {
//   // Process POST request and update signature data

//   // Notify clients via WebSocket
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send("newDataAvailable"); // Notify all connected clients
//     }
//   });

//   res.json({ message: "Signature data updated successfully" });
// });

// server.listen(port, () => {
//   console.log(`Signotec server running at http://localhost:${port}`);
// });

// Added after changed of api routes
// Endpoint to handle POST request and store signature data
app.post("/api/signature", (req, res) => {
  signatureDataStore = req.body.data;

  // Notify clients via WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("newDataAvailable"); // Notify all connected clients
    }
  });

  res.json({ message: "Signature data updated successfully" });
});

// Endpoint for Next.js app to fetch signature data
app.get("/api/signature", (req, res) => {
  if (signatureDataStore) {
    res.json({ signatureData: signatureDataStore });
  } else {
    res.status(404).json({ message: "No signature data available" });
  }
});

server.listen(port, () => {
  console.log(`Signotec server running at http://localhost:${port}`);
});
