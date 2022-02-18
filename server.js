const dotenv = require('dotenv').config({path: __dirname + '//system.env'});
const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  console.log('listening on port ' + port);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, 
  {
    serveClient: true,
    pingInterval: 6000,
    pingTimeout: 30000,
    cors: {
      origin: "process.env.prodServer",
      methods: ["GET", "POST","PUT","PATCH", "DELETE"]
    }
});

io.on('connection', (socket) => {
  socket.on("test event", data => {
    socket.emit("test event", data);
  });
  //console.log('a user connected');
  global.socket = socket;
});

global.io = io;
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);




