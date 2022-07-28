/**
 * Noah Manoucheri
 * 7/26/2022 11:31 AM
 * Controls the flow of page layout
 */
//npcs are objects with username, id: DM, and a array holding who has their contact
var npcs = [];
//layout dimensions
var dmns = {
  inventory: {},
  writing: {},
  chat: {},
  lockers: {},
};
var items = {
  giraffe: {
    name: "Wooden Giraffe",
    thumbnail: "./media/woodenGiraffe/giraffe.png",
    model: "./media/woodenGiraffe/giraffe.stl",
    notes: "./media/woodenGiraffe/giraffe.txt",
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
    thumbnail: "./media/sendingStone/sendingStone.png",
    model: null,
    notes: "./media/sendingStone/sendingStone.txt",
    chatLog: [],
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
var lockerItems = [];
var shareRequests = [];
var playerInventories = {};

var layouts = (s) => {
  let windowPosition = []; //holds where on screen the canvas is
  let thumbnails = [];

  s.preload = () => {
    //giraffe
    lockerItems.push(s.loadImage(items.giraffe.thumbnail));
    items.giraffe.thumbnail = s.loadImage(items.giraffe.thumbnail);
    thumbnails.push(items.giraffe.thumbnail);
    items.giraffe.model = s.loadModel(items.giraffe.model, true);
    items.giraffe.notes = s.loadStrings(items.giraffe.notes);
    //sending stone
    lockerItems.push(s.loadImage(items["sending stone"].thumbnail));
    items["sending stone"].thumbnail = s.loadImage(
      items["sending stone"].thumbnail
    );
    thumbnails.push(items["sending stone"].thumbnail);
    items["sending stone"].notes = s.loadStrings(items["sending stone"].notes);
    //UI elements
    ui.push(s.loadImage("./media/ui/inventory.png"));
    ui.push(s.loadImage("./media/ui/notes.png"));
    ui.push(s.loadImage("./media/ui/chat.png"));
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
    dmns[item].x = x;
    dmns[item].y = y;
    dmns[item].width = width;
    dmns[item].height = height;
  };

  s.setup = () => {
    s.cnv = s.createCanvas(window.innerWidth * 0.99, window.innerHeight * 0.99);
    s.cnv.position(
      (window.innerWidth - s.width) / 2,
      (window.innerHeight - s.height) / 2
    );
    windowPosition.push(
      (window.innerWidth - s.width) / 2,
      (window.innerHeight - s.height) / 2
    );

    s.addElements(
      "inventory",
      windowPosition[0],
      windowPosition[1],
      s.width,
      ((s.width * 0.67) / 90) * 35
    );
    s.addElements(
      "writing",
      windowPosition[0],
      windowPosition[1] + ((s.width * 0.67) / 90) * 35,
      s.width * 0.27,
      s.height - ((s.width * 0.67) / 90) * 35
    );
    s.addElements(
      "chat",
      windowPosition[0] + s.width * 0.27,
      windowPosition[1] + ((s.width * 0.67) / 90) * 35,
      s.width * 0.27,
      s.height - ((s.width * 0.67) / 90) * 35
    );
    s.addElements(
      "lockers",
      windowPosition[0] + (s.width * 0.27 * 2),
      windowPosition[1] + ((s.width * 0.67) / 90) * 35,
      s.width * 0.46,
      s.height - ((s.width * 0.67) / 90) * 35
    );

    //resize thumbnails to fit boxes
    thumbnails.forEach((img) => {
      img = img.resize(
        dmns.inventory.height * 0.16,
        dmns.inventory.height * 0.16
      );
    });
    lockerItems.forEach((img) => {
      img = img.resize(
        dmns.inventory.height * 0.185,
        dmns.inventory.height * 0.185
      );
    });

    //turn on things
    createInventory();
    createNotes();
    createChat();
    createLocker();
  };

  s.draw = () => {
    s.stroke(255);
    s.noFill();
  };
};
var mainLayout = new p5(layouts, "layout");
