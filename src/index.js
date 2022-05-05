const WebSocket = require("ws");
const gdCom = require("@gd-com/utils");

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

const pingheader = "P";
const chatheader = "C";

console.log(`Server started on port ${PORT}`);
wss.on("connection", (ws) => {
  console.log("client connected");

  // on message recieved
  ws.on("message", (message) => {
    var recieve = gdCom.getVar(Buffer.from(message)).value;
    if (recieve.header === pingheader) {
      // we got pinged
      console.log("ping recieved");
      return; // stop
    } else if (recieve.header === chatheader) {
      console.log(recieve.value); // print the message
      wss.clients.forEach((client) => {
        // for every client
        if (client.readyState !== WebSocket.OPEN) return; // if were ready
        client.send(gdCom.putVar(recieve)); // relay the message
      });
      return; // stop
    } else {
      console.log("unknown header: " + recieve.header);
      console.log(recieve);
      return; // stop
    }
  });
});
