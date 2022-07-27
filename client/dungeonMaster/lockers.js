/**
 * Noah Manoucheri
 * 7/26/2022 8:24 PM
 * A program that stores all items in game, as well as
 * share requests, and items that have been replaced
 */
//states for machine and menus
var menus = [
  {
    menu: "Edit Items",
    selected: false,
    selectedItem: undefined,
  },
  {
    menu: "Share Requests",
    selected: true,
    requests: [],
    selectedRequest: undefined,
  },
  {
    menu: "Create NPC",
    selected: false,
    npcName: "",
    selectedNPC: "",
    selecting: false,
  },
];
let selectedInventory; //will hold the currently selected inventory
let selectedItem;

function createLocker() {
  var locker = (s) => {
    let clicked = false; //holds if mouse was clicked
    let typing = false; //typing true if typing

    let dimens = dmns.lockers; //layout of area

    s.setup = () => {
      s.cnv = s.createCanvas(dimens.width, dimens.height);
      s.cnv.position(dimens.x, dimens.y);
    };

    /**
     * menuSelection:
     * used to display all menus available in the lockers
     */
    s.menuSelection = () => {
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].selected) {
          s.stroke(0);
        } else {
          s.noStroke();
        }
        s.fill("beige");
        s.rect(s.width * 0.2 * i, 0, s.width * 0.2, s.height * 0.05, 8);
        s.textAlign(s.CENTER, s.CENTER);
        s.noStroke();
        s.fill(0);
        s.text(
          menus[i].menu,
          s.width * 0.2 * i + (s.width * 0.2) / 2,
          s.height * 0.025
        );
        s.textAlign(s.LEFT, s.BASELINE);
        if (
          s.isInside(s.width * 0.2 * i, 0, s.width * 0.2, s.height * 0.05, 8) &&
          clicked
        ) {
          clicked = false;
          menus.forEach((menu) => (menu.selected = false)); //turn all menus off
          menus[i].selected = true;
        }
      }
    };

    s.editNPC = () => {
      //dividing line
      s.stroke(0);
      s.line(s.width / 2, s.height * 0.05, s.width / 2, s.height);

      s.createNPC();
      s.deleteNPC();
    };

    /**
     * deleteNPC:
     * in control of deleting npc's
     */
    s.deleteNPC = () => {
      //title
      s.noStroke();
      s.fill(0);
      s.text("Delete NPC Contact", s.width * 0.53, s.height * 0.2); //text
      //dropdown box
      if (!menus[2].selecting) {
        s.stroke(0);
        s.fill(255);
        s.rect(
          s.width * 0.53,
          s.height * 0.8,
          s.width * 0.3,
          s.height * 0.08,
          5
        );
        //add recipient name
        s.noStroke();
        s.fill(0);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(
          menus[2].selectedNPC,
          s.width * 0.53 + s.width * (0.3 / 2),
          s.height * 0.8 + s.height * (0.08 / 2)
        );
        s.textAlign(s.LEFT, s.BASELINE);
        //if box is clicked, turn on recipient select mode
        if (
          s.isInside(
            s.width * 0.53,
            s.height * 0.8,
            s.width * 0.3,
            s.height * 0.08
          )
        ) {
          if (clicked) {
            menus[2].selecting = true;
          }
          clicked = false;
          typing = false;
        }
        //else, choose recipient
      } else {
        let userCount = 0; //holds which member we are checking
        //add recipients for every other online player AND NPCS
        for (let member in items["sending stone"].members) {
          if (
            member != "DM" &&
            items["sending stone"].members[member].userType != "PC"
          ) {
            s.stroke(0);
            s.fill(255);
            s.rect(
              s.width * 0.53,
              s.height * 0.8 - s.height * 0.08 * userCount,
              s.width * 0.3,
              s.height * 0.08,
              5
            );
            //add recipient name
            s.noStroke();
            s.fill(0);
            s.textAlign(s.CENTER, s.CENTER);
            s.text(
              member,
              s.width * 0.53 + s.width * (0.3 / 2),
              s.height * 0.8 +
                s.height * (0.08 / 2) -
                s.height * 0.08 * userCount
            );
            s.textAlign(s.LEFT, s.BASELINE);
            //if this one is selected choose this recipient
            if (
              s.isInside(
                s.width * 0.53,
                s.height * 0.8 - s.height * 0.08 * userCount,
                s.width * 0.3,
                s.height * 0.08
              ) &&
              clicked
            ) {
              clicked = false;
              menus[2].selecting = false;
              menus[2].selectedNPC = member;
            }
            userCount++;
          }
        }
      }

      //submit button
      if (
        s.isInside(
          s.width * 0.88 - s.height * 0.04,
          s.height * 0.84 - s.height * 0.04,
          s.height * 0.08,
          s.height * 0.08
        )
      ) {
        s.stroke(0);
        if (!menus[2].selecting && clicked) {
          //TODO add submissions
          socket.emit("delete npc", menus[2].selectedNPC);
          delete items["sending stone"].members[menus[2].selectedNPC];
          menus[2].selectedNPC = "";
          clicked = false;
        }
      } else {
        s.stroke(180);
      }
      s.noFill();
      //submit button render
      s.ellipse(s.width * 0.88, s.height * 0.84, s.height * 0.08);
      s.textAlign(s.CENTER, s.CENTER);
      s.text("=>", s.width * 0.88, s.height * 0.84);
      s.textAlign(s.LEFT, s.BASELINE);
    };

    /**
     * menu to create/delete NPCs
     */
    s.createNPC = () => {
      //create NPC
      s.noStroke();
      s.fill(0);
      s.text("Add NPC Contact", 0, s.height * 0.1);
      //type box
      s.stroke(0);
      s.fill(255);
      s.rect(s.width * 0.02, s.height * 0.2, s.width * 0.4, s.height * 0.08, 5);
      //set typing mode
      if (
        s.isInside(
          s.width * 0.02,
          s.height * 0.2,
          s.width * 0.3,
          s.height * 0.08
        )
      ) {
        if (clicked) {
          typing = true;
          clicked = false;
        }
      } else {
        if (clicked && typing) {
          clicked = false;
          typing = false;
        }
      }

      //display text
      s.textSize(15);
      if (s.textWidth(menus[2].npcName) >= s.width * 0.44) {
        let displayText = "";
        let addText = true;
        for (let i = menus[2].npcName.length - 1; i >= 0 && addText; i--) {
          if (
            s.textWidth(displayText + menus[2].npcName[i]) >=
            s.width * 0.42
          ) {
            addText = false;
          } else {
            displayText = menus[2].npcName[i] + displayText;
          }
        }
        //display the text
        s.noStroke();
        s.fill(0);
        s.textAlign(s.RIGHT, s.CENTER);
        s.text(displayText, s.width * 0.46, s.height * 0.2);
        //typing line
        if (s.frameCount % 60 < 30) {
          s.stroke(0);
        } else {
          s.stroke(255);
        }
        //text typing line
        s.line(s.width * 0.46, s.height * 0.2, s.width * 0.46, s.height * 0.26);
        //reset settings
        s.textAlign(s.LEFT, s.BASELINE);
        s.stroke(255); //reset stroke
        s.textAlign(s.LEFT, s.BASELINE);
      } else {
        s.noStroke();
        s.fill(0);
        s.textAlign(s.LEFT, s.CENTER);
        s.text(menus[2].npcName, s.width * 0.06, s.height * 0.23);
        //typing line
        if (s.frameCount % 60 < 30 && typing) {
          s.stroke(0);
        } else if (typing) {
          s.stroke(255);
        }
        //text typing line
        s.line(
          s.width * 0.061 + s.textWidth(menus[2].npcName),
          s.height * 0.2,
          s.width * 0.061 + s.textWidth(menus[2].npcName),
          s.height * 0.26
        );
        //reset settings
        s.textAlign(s.LEFT, s.BASELINE);
        s.stroke(255); //reset stroke
      }
    };

    //draws items on screen
    s.displayItems = () => {
      let i = 0;
      //draw squares across the board using object items
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
          if (lockerItems[i]) {
            if (
              s.isInside(
                s.width * 0.08 * (x + 1) + s.width * 0.1 * x,
                s.height * 0.1 * (y + 1) + s.width * 0.1 * y,
                s.width * 0.1,
                s.width * 0.1
              )
            ) {
              s.stroke(0);
              if (clicked) {
                clicked = false;
                menus[0].selectedItem = i;
              }
            } else {
              s.stroke(150);
            }
            if (menus[0].selectedItem === i) {
              s.stroke(0);
            }
            s.noFill();
            s.rect(
              s.width * 0.08 * (x + 1) + s.width * 0.1 * x,
              s.height * 0.1 * (y + 1) + s.width * 0.1 * y,
              s.width * 0.1,
              s.width * 0.1
            );
            s.image(
              lockerItems[i],
              s.width * 0.08 * (x + 1) + s.width * 0.1 * x,
              s.height * 0.1 * (y + 1) + s.width * 0.1 * y
            );
          }
          i++; //incriment counter
        }
      }
    };

    //used to edit items
    s.editItems = () => {
      s.displayItems(); //draws items
      //draw menu options bar
      s.stroke(0);
      s.fill("beige");
      s.rect(0, s.height * 0.9, s.width, s.height * 0.1, 10);
      //if item exists have the option of deleting it
      if (selectedInventory[0][selectedItem] != undefined) {
        if (
          s.isInside(
            s.width * 0.01,
            s.height * 0.91,
            s.width * 0.3,
            s.height * 0.08
          )
        ) {
          s.stroke(0);
          if (clicked) {
            socket.emit("remove item", [selectedInventory[1], selectedItem]);
            menus[0].selectedItem = undefined;
            selectedInventory = undefined;
            selectedItem = undefined;
            menus[0].selected = false;
            menus[1].selected = true;
            //TODO: add code to add an item
          }
        } else {
          s.stroke(150);
        }
        s.rect(
          s.width * 0.01,
          s.height * 0.91,
          s.width * 0.3,
          s.height * 0.08,
          5
        );
        s.noStroke();
        s.fill(0);
        s.textSize(15);
        s.textAlign(s.CENTER, s.CENTER);
        s.text("REMOVE?", s.width * 0.16, s.height * 0.95);
        s.textAlign(s.LEFT, s.CENTER);
        try {
          s.text(
            `Remove from ${selectedInventory[1]}'s inventory?`,
            s.width * 0.33,
            s.height * 0.95
          );
        } catch {}
        s.textAlign(s.LEFT, s.BASELINE);

        //else add an item!
      } else {
        if (menus[0].selectedItem != undefined) {
          if (
            s.isInside(
              s.width * 0.01,
              s.height * 0.91,
              s.width * 0.3,
              s.height * 0.08
            )
          ) {
            s.stroke(0);
            if (clicked) {
              s.sendItem(menus[0].selectedItem); //send the item ove
              menus[0].selectedItem = undefined;
              selectedInventory = undefined;
              selectedItem = undefined;
              menus[0].selected = false;
              menus[1].selected = true;
            }
          } else {
            s.stroke(150);
          }
          s.rect(
            s.width * 0.01,
            s.height * 0.91,
            s.width * 0.3,
            s.height * 0.08,
            5
          );
          s.textAlign(s.LEFT, s.CENTER);
          s.noStroke();
          s.fill(0);
          s.textSize(15);
          s.textAlign(s.CENTER, s.CENTER);
          s.text("ADD?", s.width * 0.16, s.height * 0.95);
          s.textAlign(s.LEFT, s.CENTER);
          try {
            s.text(
              `Give to ${selectedInventory[1]}?`,
              s.width * 0.33,
              s.height * 0.95
            );
          } catch {}
          s.textAlign(s.LEFT, s.BASELINE);
        }
      }
    };

    //TODO: ADD THE REST OF THE ITEMS
    s.sendItem = (i) => {
      let item;
      switch (i) {
        case 0: //giraffe
          item = {
            id: "giraffe",
            name: "Wooden Giraffe",
            originalOwner: selectedInventory[1],
            currentOwner: selectedInventory[1],
            playerAdditions: [],
          };
          break;
        case 1: //sending stone
          item = {
            id: "sending stone",
            name: "Sending Stone",
            originalOwner: selectedInventory[1],
            currentOwner: selectedInventory[1],
            playerAdditions: [],
            chatLog: [],
          };
          break;
      }
      socket.emit("add item", [selectedInventory[1], item]);
    };

    s.displayRequests = () => {
      let i = 0;
      //draw squares across the board using object items
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
          if (menus[1].requests[i]) {
            if (
              s.isInside(
                s.width * 0.08 * (x + 1) + s.width * 0.1 * x,
                s.height * 0.1 * (y + 1) + s.width * 0.1 * y,
                s.width * 0.1,
                s.width * 0.1
              )
            ) {
              s.stroke(0);
              if (clicked) {
                clicked = false;
                menus[1].selectedRequest = i;
              }
            } else {
              s.stroke(150);
            }
            if (menus[1].selectedRequest === i) {
              s.stroke(0);
            }
            s.noFill();
            s.rect(
              s.width * 0.08 * (x + 1) + s.width * 0.1 * x,
              s.height * 0.1 * (y + 1) + s.width * 0.1 * y,
              s.width * 0.1,
              s.width * 0.1
            );
            s.image(
              items[menus[1].requests[i][0].id].thumbnail,
              s.width * 0.08 * (x + 1) + s.width * 0.1 * x,
              s.height * 0.1 * (y + 1) + s.width * 0.1 * y
            );
          }
          i++; //incriment counter
        }
      }
    };

    s.shareRequests = () => {
      s.displayRequests(); //draws requests on screen
      //used to admit requests
      //draw menu options bar
      s.stroke(0);
      s.fill("beige");
      s.rect(0, s.height * 0.9, s.width, s.height * 0.1, 10);
      if (menus[1].selectedRequest != undefined) {
        s.textSize(15);
        s.noStroke();
        s.fill(0);
        s.textAlign(s.LEFT, s.CENTER);
        let message = `Pass ${
          menus[1].requests[menus[1].selectedRequest][0].currentOwner
        }'s ${menus[1].requests[menus[1].selectedRequest][0].id} to ${
          menus[1].requests[menus[1].selectedRequest][1]
        }`;
        s.text(message, s.width * 0.01, s.height * 0.95);
        s.textAlign(s.LEFT, s.BASELINE);
        //draw buttons
        //allow
        if (
          s.isInside(
            s.textWidth(message) + s.width * 0.02,
            s.height * 0.91,
            s.width * 0.2,
            s.height * 0.08
          )
        ) {
          if (clicked) {
            clicked = false;
            socket.emit("allow share request", [menus[1].requests[menus[1].selectedRequest][0].currentOwner, menus[1].requests[menus[1].selectedRequest][1], menus[1].requests[menus[1].selectedRequest][0]]);
            menus[1].requests.splice(menus[1].selectedRequest, 1);
            menus[1].selectedRequest = undefined;
          }
          s.stroke(0);
        } else {
          s.stroke(150);
        }
        s.noFill();
        s.rect(
          s.textWidth(message) + s.width * 0.02,
          s.height * 0.91,
          s.width * 0.2,
          s.height * 0.08,
          5
        );
        s.textSize(15);
        s.noStroke();
        s.fill(0);
        s.textAlign(s.CENTER, s.CENTER);
        s.text("ALLOW", s.textWidth(message) + s.width * 0.12, s.height * 0.95);
        s.textAlign(s.LEFT, s.BASELINE);
        //deny
        if (
          s.isInside(
            s.textWidth(message) + s.width * 0.03 + s.width * 0.2,
            s.height * 0.91,
            s.width * 0.2,
            s.height * 0.08
          )
        ) {
          if (clicked) {
            clicked = false;socket.emit(
              "deny share request",
              menus[1].requests[menus[1].selectedRequest][0].currentOwner
            ); //send a deny to the sender of the request
            menus[1].requests.splice(menus[1].selectedRequest, 1);
            menus[1].selectedRequest = undefined;
          }
          s.stroke(0);
        } else {
          s.stroke(150);
        }
        s.noFill();
        s.rect(
          s.textWidth(message) + s.width * 0.03 + s.width * 0.2,
          s.height * 0.91,
          s.width * 0.2,
          s.height * 0.08,
          5
        );
        s.textSize(15);
        s.noStroke();
        s.fill(0);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(
          "DENY",
          s.textWidth(message) + s.width * 0.03 + s.width * 0.3,
          s.height * 0.95
        );
        s.textAlign(s.LEFT, s.BASELINE);
      }
    };

    s.draw = () => {
      s.background("#ADEFD1FF"); //teal
      s.menuSelection(); //draw menu bars at the top
      //select which menu to display based on selected variable
      switch (true) {
        case menus[0].selected && selectedInventory != undefined: {
          s.editItems();
          break;
        }
        case menus[1].selected: {
          s.shareRequests();
          break;
        }
        case menus[2].selected: {
          s.editNPC();
          break;
        }
      }
      clicked = false;
    };

    /**
     * isInside:
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @returns bool
     * tells whether the mouse is inside of something
     */
    s.isInside = (x, y, width, height) => {
      if (
        s.mouseX > x &&
        s.mouseX < x + width &&
        s.mouseY > y &&
        s.mouseY < y + height
      ) {
        return true;
      }
    };

    s.mouseClicked = () => {
      clicked = true;
    };

    s.keyPressed = () => {
      if (messaging) {
        if (
          s.keyCode != s.LEFT_ARROW &&
          s.keyCode != s.RIGHT_ARROW &&
          s.keyCode != s.DOWN_ARROW &&
          s.keyCode != s.UP_ARROW &&
          s.keyCode != s.TAB &&
          s.keyCode != s.DELETE &&
          s.keyCode != s.RETURN &&
          s.keyCode != s.BACKSPACE &&
          s.keyCode != s.ENTER &&
          s.keyCode != s.ESCAPE &&
          s.keyCode != s.CONTROL &&
          s.keyCode != s.SHIFT &&
          s.keyCode != s.OPTION &&
          s.keyCode != s.ALT &&
          typing
        ) {
          menus[2].npcName += s.key;
        }
        //removes the last letter from a string
        if (typing && (s.keyCode === s.BACKSPACE || s.keyCode === s.DELETE)) {
          menus[2].npcName = menus[2].npcName.slice(0, -1);
        }
        //pushes the lates note to the list of notes for an item
        if (
          typing &&
          menus[2].npcName != "" &&
          (s.keyCode === s.ENTER || s.keyCode === s.RETURN)
        ) {
          socket.emit("add npc", {
            username: menus[2].npcName,
            userType: "DM",
            userID: id,
          });
          menus[2].npcName = "";
          typing = false;
        }
      }
    };
  };
  var lockerDisplay = new p5(locker, "lockers");
}
