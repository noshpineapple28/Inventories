//connects to the server
var socket = io("http://localhost:3000", {
  transports: ["websocket"],
});
var username;
var id;

//upon connection, add user
//    TODO: impliment user name customization
socket.on("connect", () => {
  username = "Dungeon Master";
  id = socket.id;
  //set browser tilte
  document.getElementById(
    "inventory name"
  ).innerHTML = `${username}'s Inventory`;

  socket.emit("add user", {
    userID: socket.id,
    userType: "DM",
    username: username,
  });

  //take share request
  socket.on("share request", data => {
    menus[1].requests.push(data); //add new request to queue
  })

  //updates the list of each player's inventories
  socket.on("update inventories", (data) => {
    playerInventories[data[1]] = data[0];
  });

  //recieve public chat messages
  socket.on("chat message", (data) => {
    items["sending stone"].chatLog.push(data.note);
  });
  //recieve private messages
  socket.on("private message", (data) => {
    items["sending stone"].chatLog.push(data.note);
  });

  //recieve new players for the members object
  socket.on("update player list", (users) => {
    items["sending stone"].members = users;
  });
});
