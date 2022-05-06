const WebSocket = require("ws");
const gdCom = require("@gd-com/utils");

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

const pingheader = "P";
const chatheader = "C";

console.log(`[gd-chat-server]: started on port ${PORT}`);
wss.on("connection", (ws) => {
  console.log("[gd-chat-server]: client connected");

  // on message recieved
  ws.on("message", (message) => {
    var recieve = gdCom.getVar(Buffer.from(message)).value;
    if (recieve.header === pingheader) {
      // we got pinged
      ws.send(gdCom.putVar({ header: pingheader }));
      return; // stop
    } else if (recieve.header === chatheader) {
      console.log(`[gd-chat-server]: ${recieve.who}:${recieve.text}`); // print the message
      wss.clients.forEach((client) => {
        // for every client
        if (client.readyState !== WebSocket.OPEN) return; // if were ready
        client.send(gdCom.putVar(recieve)); // relay the message
      });
      return; // stop
    } else {
      console.log(`[gd-chat-server]: unknown header ${recieve.header}`);
      console.log(`[gd-chat-server]: ${recieve}`);
      return; // stop
    }
  });
});
