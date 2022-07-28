/**
 * Noah Manoucheri
 * 7/24/2022 1:07 AM
 * Adds a inventory on screen with around 15 item slots
 * The inventory functionality:
 *      - Players can select items to display
 *      - Players can hover an item to get more info on it
 */
"use strict"; //catch some common coding errors

/* Global variables */
/**
 * Every item has a designated ID, as well as a thumbnail,
 * a 3D model, and text about it. It also holds notes
 * Whenever a item is added to someones inventory, it is
 * created based off of the specification in the list of items
 * and then a new object is added to the array of items
 */
//TODO: make it so when the item is created it is given the value of the user holding it
var arrayOfItems = [
  {
    id: "giraffe",
    name: "Wooden Giraffe",
    originalOwner: username,
    currentOwner: username,
    playerAdditions: [],
  },
  {
    id: "sending stone",
    name: "Sending Stone",
    originalOwner: username,
    currentOwner: username,
    playerAdditions: [],
    chatLog: [],
  },
];

function createInventroy() {
  var inventory = (s) => {
    let dmns = layouts.inventory; //holds deminsions (dmns) set in main.js
    let clicked = false; //holds if mouse was clicked

    s.setup = () => {
      s.cnv = s.createCanvas(dmns.width, dmns.height);
      s.cnv.position(dmns.x, dmns.y);
      //TODO: REMOVE THIS CODE
      arrayOfItems.forEach((item) => {(item.originalOwner = username); item.currentOwner = username});
    };

    /**
     * displayItems:
     * is responsible for dislaying item boxes
     */
    s.displayItems = () => {
      //holds needed dimensions for all item boxes
      let itemDmns = {
        heightPad: s.height * 0.08,
        widthPad: s.width * 0.0667,
        width: s.height * 0.3,
      };
      //displays item boxes
      //index counter
      let i = 0;
      for (let y = 1; y <= 2; y++) {
        for (let x = 1; x <= 5; x++) {
          //sets if the mouse is inside a box
          let insideBox;
          if (
            s.isInside(
              itemDmns.widthPad * x + itemDmns.width * (x - 1),
              s.height * 0.15 +
                itemDmns.heightPad * y +
                itemDmns.width * (y - 1),
              itemDmns.width,
              itemDmns.width
            )
          ) {
            insideBox = true;
          }
          //set box borders
          s.noStroke();
          if (insideBox) {
            s.fill(0, 70);
          } else {
            s.fill(0, 20);
          }
          //checks if an item exists
          if (arrayOfItems[i]) {
            s.image(
              items[arrayOfItems[i].id].thumbnail,
              itemDmns.widthPad * x + itemDmns.width * (x - 1),
              s.height * 0.15 +
                itemDmns.heightPad * y +
                itemDmns.width * (y - 1)
            );
            //checks if item was selected
            if (insideBox && clicked) {
              clicked = false;
              displayModel = i;
              displayText = i;
              if (arrayOfItems[i].id === "sending stone") {
                messaging = true;
                chatDisplay.moveCanvas();
              } else {
                messaging = false;
                chatDisplay.moveCanvas();
              }
            }
          }
          //if item is already selected, turn outline dark
          if (displayModel === arrayOfItems[i] && displayModel != undefined) {
            s.stroke(0);
          }
          //display item box
          s.rect(
            itemDmns.widthPad * x + itemDmns.width * (x - 1),
            s.height * 0.15 + itemDmns.heightPad * y + itemDmns.width * (y - 1),
            itemDmns.width,
            itemDmns.width,
            5
          );
          i++;
        }
      }
    };

    s.displayOwner = () => {
      s.noStroke();
      s.fill(0);
      s.textSize(50);
      s.textAlign(s.CENTER, s.CENTER);
      s.text(`Property of ${username}`, s.width * 0.5, s.height * 0.1);
      s.textAlign(s.LEFT, s.BASELINE);
    };

    s.draw = () => {
      s.background(ui[0]);
      s.displayItems(); //display item boxes
      s.displayOwner(); //dislay owner
      clicked = false;
    };

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
  };
  var inventoryDisplay = new p5(inventory, "inventory");
}
