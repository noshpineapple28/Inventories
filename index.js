// Setup basic express server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/****USER DATA STORAGE****/
let users = {};
let dm;

/****SERVER REQUEST RESOLVES****/
io.on("connection", (socket) => {
  //server alert message
  console.log("****USER CONNECTED****");

  //add user to array of users when recieved by server
  socket.on("add user", (data) => {
    if (data.userType === "DM") {
      dm = data;
      users["DM"] = data;
      socket.username = data.username; //adds username to socket
      console.log(`USER ADDED  :  ${socket.username}\n`);
    } else {
      if (users[data.username]) {
        io.to(data.userID).emit("retry username");
      } else {
        users[data.username] = data;
        socket.username = data.username; //adds username to socket
        console.log(`USER ADDED  :  ${socket.username}\n`);
      }
    }
  });

  socket.on("add npc", (npc) => {
    users[npc.username] = npc;
  });

  socket.on("delete npc", (npc) => {
    delete users[npc];
    socket.broadcast.emit("delete npc", npc);
  });

  //give inventory to DM
  socket.on("give inventory", (data) => {
    io.to(dm.userID).emit("update inventories", [data, socket.username]);
  });

  //remove an item from an inventory
  socket.on("remove item", (data) => {
    io.to(users[data[0]].userID).emit("remove item", data[1]);
  });

  //add an item
  socket.on("add item", (data) => {
    io.to(users[data[0]].userID).emit("add item", data[1]);
  });

  //handle share request, and send to the DM
  socket.on("share request", (data) => {
    io.to(dm.userID).emit("share request", data);
  });

  //allow share request
  socket.on("allow share request", (data) => {
    io.to(users[data[0]].userID).emit("delete shared item", data[2]);
    io.to(users[data[1]].userID).emit("add shared item", data[2]);
  });

  //handles denied request
  socket.on("deny share request", (user) => {
    io.to(users[user].userID).emit("deny share request");
  });

  //adds any notes made by DM to a player's notes
  socket.on("add note", (data) => {
    io.to(users[data[0].currentOwner].userID).emit("add note", [
      data[0],
      data[1],
    ]);
  });

  //takes chat messages
  socket.on("chat message", (data) => {
    socket.broadcast.emit("chat message", data);
  });
  //takes private messages
  socket.on("private message", (data) => {
    //fix bug with usernames
    if (data.note.recipient in users) {
      //data.note.username = users[data.note.sender].username;
      io.to(users[data.note.recipient].userID).emit("private message", data);
      if (
        data.note.recipient != "DM" &&
        users[data.note.recipient].userID != dm.userID
      )
        io.to(users["DM"].userID).emit("private message", data);
    } else {
      io.to(users["DM"].userID).emit("private message", data);
    }
  });

  //remove user once disconnected
  socket.on("disconnect", () => {
    delete users[socket.username];
    console.log(`${socket.username} disconnected\n****USER DISCONNECTED****\n`);
  });
});

//every few seconds update the online player base and update inventories
setInterval(() => {
  io.sockets.emit("update player list", users);
  for (let player in users) {
    io.to(users[player].userID).emit("take inventory");
  }
}, 2000);
