//connects to the server
var socket = io("https://dnd-inventories.herokuapp.com/", {
  transports: ["websocket"],
});
var username;
var id;

//upon connection, add user
//    TODO: impliment user name customization
socket.on("connect", () => {
  username = prompt("Please input your name :  ");
  id = socket.id;
  //set browser tilte
  document.getElementById(
    "inventory name"
  ).innerHTML = `${username}'s Inventory`;

  socket.emit("add user", {
    userID: socket.id,
    userType: "PC",
    username: username,
    inventory: [],
  });

  socket.on("retry username", () => {
    socket.emit("add user", {
      userID: socket.id,
      userType: "PC",
      username: prompt("Please Input Your Name :  "),
      inventory: [],
    });
  });

  //when asked to take inventory, report what the inventory is
  socket.on("take inventory", () => {
    socket.emit("give inventory", arrayOfItems);
  });

  //remove an item
  socket.on("remove item", (data) => {
    arrayOfItems.splice(data, 1);
  });

  //add an item
  socket.on("add item", (item) => {
    arrayOfItems.push(item);
  });

  //delete a shared item on allowance of a share request
  socket.on("delete shared item", (data) => {
    let deleteIndex;
    arrayOfItems.forEach((item) => {
      if (
        item.id === data.id &&
        item.originalOwner === data.originalOwner &&
        data.currentOwner === item.currentOwner
      ) {
        if (item.id === "sending stone") {
          messaging = false;
        }
        displayText = undefined;
        displayModel = undefined;
        deleteIndex = arrayOfItems.indexOf(item); //finds index of item to delete
      }
    });
    //delete item
    shareRequestSent = false;
    arrayOfItems.splice(deleteIndex, 1);
  });

  //add a shared item on allowance of a share request
  socket.on("add shared item", (data) => {
    data.currentOwner = username;
    arrayOfItems.push(data);
  });

  //handles denied share request
  socket.on("deny share request", () => {
    shareRequestSent = false;
  });

  //adds any notes made by DM
  socket.on("add note", (data) => {
    for (let i = 0; i < arrayOfItems.length; i++) {
      if (
        arrayOfItems[i].id === data[0].id &&
        arrayOfItems[i].originalOwner === data[0].originalOwner
      ) {
        arrayOfItems[i].playerAdditions.push(`Note Added :  ` + data[1]);
      }
    }
  });

  socket.on("delete npc", (npc) => {
    delete items["sending stone"].members[npc];
  });

  //recieve public chat messages
  socket.on("chat message", (data) => {
    //prevents user from getting a repeat message
    if (
      data.note.sender != socket.username &&
      data.note.senderID != socket.id
    ) {
      let stoneIndex;
      for (let i = 0; i < arrayOfItems.length; i++) {
        if (arrayOfItems[i].id === "sending stone") {
          stoneIndex = i;
        }
      }
      arrayOfItems[stoneIndex].chatLog.push(data.note);
    }
  });
  //recieve private messages
  socket.on("private message", (data) => {
    let stoneIndex;
    for (let i = 0; i < arrayOfItems.length; i++) {
      if (arrayOfItems[i].id === "sending stone") {
        stoneIndex = i;
      }
    }
    arrayOfItems[stoneIndex].chatLog.push(data.note);
  });

  //recieve new players for the members object
  socket.on("update player list", (users) => {
    items["sending stone"].members = users;
  });
});
