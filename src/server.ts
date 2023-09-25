// Express is a node module for building HTTP servers
import express from "express";
var app = express();

// Tell Express to look in the "public" folder for any files first
app.use(express.static("dist/public"));

// If the user just goes to the "route" / then run this function
app.get("/", function (req, res) {
  res.send("Hello World!");
});

// Here is the actual HTTP server
var http = require("http");

// We pass in the Express object
var httpServer = http.createServer(app);

// Listen on port provided by Glitch
httpServer.listen(5173);

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require("socket.io")(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  "connection",
  // We are given a websocket object in our function
  function (socket) {
    console.log("We have a new client: " + socket.id);

    socket.on("pin", (pin) => {
      console.log(
        `User ${pin.user} placed a pin at (${pin.coordinates.x}, ${pin.coordinates.y}}`,
      );
      io.emit("pin", pin);
    });

    socket.on("disconnect", function () {
      console.log("Client has disconnected " + socket.id);
    });
  },
);
