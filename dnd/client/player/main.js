/**
 * Noah Manoucheri
 * 7/24/2022 1:07 AM
 * Controls the layout of all canvases
 */

"use strict"; //catch some common coding errors

/* Global variables */
//holds the future x coords for all inventories
//    as well as dimensions
var username = "";
const layouts = {
  inventory: {},
  viewer: {},
  notes: {},
};
var items = {
  giraffe: {
    name: "Wooden Giraffe",
    thumbnail: "../../media/woodenGiraffe/giraffe.png",
    model: "../../media/woodenGiraffe/giraffe.stl",
    notes: "../../media/woodenGiraffe/giraffe.txt",
    display: (s) => {
      s.ambientMaterial(207, 185, 151);
      s.ambientLight(200);
      s.noStroke();
      s.directionalLight(150, 100, 100, -100, -100, -100);
      s.model(items.giraffe.model);
    },
  },
  "sending stone": {
    name: "Sending Stone",
    thumbnail: "../../media/sendingStone/sendingStone.png",
    model: null,
    notes: "../../media/sendingStone/sendingStone.txt",
    //logs are object stored in a array like this setup:
    //{ sender: senderName, senderID: senderID, recipient: recipient, recipientID: recipientID, msg: message }
    //holds all chat logs
    //whenever a new member is added they get added to this
    /** user: { 
     *        sender: username,
              senderID: id,
              recipient: recipient,
              recipientID: recipient,
              msg: note, }
    */
    //TODO: impliment chat functionality
    members: {}, //holds all members
  },
};
var ui = [];

//used to add inventory to the html document
var layout = (s) => {
  let windowPosition = []; //holds where on screen the canvas is
  let padding; //space between UI elements
  let thumbnails = [];

  s.preload = () => {
    //giraffe
    items.giraffe.thumbnail = s.loadImage(items.giraffe.thumbnail);
    thumbnails.push(items.giraffe.thumbnail);
    items.giraffe.model = s.loadModel(items.giraffe.model, true);
    items.giraffe.notes = s.loadStrings(items.giraffe.notes);
    //sending stone
    items["sending stone"].thumbnail = s.loadImage(
      items["sending stone"].thumbnail
    );
    thumbnails.push(items["sending stone"].thumbnail);
    items["sending stone"].notes = s.loadStrings(items["sending stone"].notes);
    //UI elements
    ui.push(s.loadImage("../../media/ui/inventory.png"));
    ui.push(s.loadImage("../../media/ui/notes.png"));
    ui.push(s.loadImage("../../media/ui/chat.png"));
  };

  /**
   * addElements:
   * @param {string} item
   * @param {int} x
   * @param {int} y
   * @param {int} width
   * @param {int} height
   * adds dimensions for a UI elements to the layouts object
   */
  s.addElements = (item, x, y, width, height) => {
    layouts[item].x = x;
    layouts[item].y = y;
    layouts[item].width = width;
    layouts[item].height = height;
  };

  /**
   * setup :
   */
  s.setup = () => {
    //set up canvas position and size
    s.cnv = s.createCanvas(
      window.innerHeight * 0.979,
      window.innerHeight * 0.979
    );
    s.cnv.position(
      (window.innerWidth - s.width) / 2,
      (window.innerHeight - s.height) / 2
    );
    windowPosition.push(
      (window.innerWidth - s.width) / 2,
      (window.innerHeight - s.height) / 2
    );
    padding = s.width * 0.05;

    /*****ADDS LAYOUT DIMENSIONS*****/
    s.addElements(
      "inventory",
      windowPosition[0] + padding,
      windowPosition[1] + padding,
      s.width * 0.9,
      s.height * 0.35
    );
    s.addElements(
      "viewer",
      windowPosition[0] + padding,
      windowPosition[1] + s.height * 0.45,
      s.width * 0.44,
      s.height * 0.5
    );
    s.addElements(
      "notes",
      windowPosition[0] + s.width * 0.51,
      windowPosition[1] + s.height * 0.45,
      s.width * 0.44,
      s.height * 0.5
    );

    //resize thumbnails to fit boxes
    thumbnails.forEach((img) => {
      img = img.resize(
        layouts.inventory.height * 0.3,
        layouts.inventory.height * 0.3
      );
    });

    //afterwards start other programs
    createInventroy();
    createViewer();
    createNotes();
    createChat();
  };

  /**
   * draw :
   */
  s.draw = () => {
    //draws border
    s.background(49)
    s.stroke(255);
    s.noFill();
    //outlines
    //chat/viewer
    if (!messaging) {
      s.rect(0 + padding, 0 + s.height * 0.45, s.width * 0.44, s.height * 0.5);
    }
  };
};
//switches variable into a new p5 element
var programLayout = new p5(layout, "layout");
