class PlayerInventory {
  constructor(inven, owner, width, s) {
    //holds this player's inventory
    this.myInven = inven;
    this.owner = owner;
    this.width = width * 0.67;
    this.height = (this.width / 90) * 35;
    this.isAssigned = false;
    this.s = s;
    this.clicked = false;
    ui[0].resize(this.width, this.height);
  }

  /**
   * draws the background
   * @param {int} x
   * @param {int} y
   */
  displayBackground(x, y) {
    if (this.isAssigned) {
      this.s.image(ui[0], x, y);
    } else {
      this.s.noFill();
      if (this.s.isInside(x, y, this.width, this.height)) {
        this.s.stroke(120);
      } else {
        this.s.stroke(255);
      }
      this.s.rect(x, y, this.width, this.height, 15);
      this.s.rectMode(this.s.CENTER);
      this.s.rect(
        x + this.width / 2,
        y + this.height / 2,
        this.width * 0.15,
        this.height * 0.3,
        15
      );
      this.s.rectMode(this.s.CORNER);
      this.s.textAlign(this.s.CENTER, this.s.CENTER);
      this.s.noFill();
      this.s.textSize(15);
      this.s.text("+", x + this.width / 2, y + this.height / 2);
      this.s.textAlign(this.s.LEFT, this.s.BASELINE);
    }
  }

  /**
   * displayTitle:
   * displays the owner of the inventory
   */
  displayTitle(x, y) {
    if (this.isAssigned) {
      this.s.noStroke();
      this.s.fill(0);
      this.s.textAlign(this.s.CENTER, this.s.CENTER);
      this.s.textSize(20);
      this.s.text(
        `Property of ${this.owner}`,
        x + this.width / 2,
        y + this.height * 0.1
      );
      this.s.textAlign(this.s.LEFT, this.s.BASELINE);
    }
  }

  displayItems(x, y) {
    //holds needed dimensions for all item boxes
    let itemDmns = {
      heightPad: this.height * 0.08,
      widthPad: this.width * 0.0667,
      width: this.height * 0.3,
    };
    if (this.isAssigned) {
      let i = 0;
      for (let ypos = 0; ypos < 2; ypos++) {
        for (let xpos = 0; xpos < 5; xpos++) {
          let insideBox;
          if (
            this.s.isInside(
              x + itemDmns.widthPad * (xpos + 1) + itemDmns.width * (xpos),
              y +
                this.height * 0.15 +
                itemDmns.heightPad * ypos +
                itemDmns.width * (ypos),
              itemDmns.width,
              itemDmns.width
            )
          ) {
            insideBox = true;
          }
          //set box borders
          this.s.noStroke();
          if (insideBox) {
            this.s.fill(0, 70);
          } else {
            this.s.fill(0, 20);
          }
          //draw rectangle
          this.s.rect(
            x + itemDmns.widthPad * (xpos + 1) + itemDmns.width * (xpos),
            y +
              this.height * 0.2 +
              itemDmns.heightPad * ypos +
              itemDmns.width * (ypos),
            itemDmns.width,
            itemDmns.width
          );
          if (insideBox && this.clicked) {
            selectedInventory = [this.inven, this.owner];
            selectedItem = i;
          }
          if (this.inven[i]) {
            this.s.image(
              items[this.inven[i].id].thumbnail,
              x + itemDmns.widthPad * (xpos + 1) + itemDmns.width * (xpos),
              y +
                this.height * 0.2 +
                itemDmns.heightPad * ypos +
                itemDmns.width * (ypos)
            );
            if (insideBox && this.clicked) {
              displayText = this.inven[i];
              selectedInventory = [this.inven, this.owner];
              selectedItem = i;
            }
          }
          i++;
        }
      }
    }
  }
}
