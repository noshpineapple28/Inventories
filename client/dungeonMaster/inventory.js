/**
 * Noah Manoucheri
 * 7/26/2022 1:55 PM
 * Program to display everyones UI's
 */
function createInventory() {
  var inventory = (s) => {
    let dimen = dmns.inventory; //holds deminsions (dmns) set in main.js
    let clicked = false; //holds if mouse was clicked
    let inventories = []; //holds all inventories

    s.setup = () => {
      s.cnv = s.createCanvas(dimen.width, dimen.height);
      s.cnv.position(dimen.x, dimen.y);
      for (let i = 0; i < 6; i++) {
        inventories.push(
          new PlayerInventory([], "", s.width / 2, s)
        );
      }
    };

    s.draw = () => {
      s.background(49);
      let i = 0;
      for (let player in playerInventories) {
        inventories[i].isAssigned = true;
        inventories[i].inven = playerInventories[player];
        inventories[i].owner = player;
        i++
      }
      //counter variable
      i = 0;
      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 3; x++) {
          inventories[i].displayBackground(x * inventories[i].width, y * inventories[i].height);
          inventories[i].displayTitle(x * inventories[i].width, y * inventories[i].height);
          inventories[i].displayItems(x * inventories[i].width, y * inventories[i].height);
          i++
        }
      }
      clicked = false;
      inventories.forEach((item) => (item.clicked = false));
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
      inventories.forEach((item) => (item.clicked = true));
    };
  };
  var inventoryDisplay = new p5(inventory, "inventory");
}
