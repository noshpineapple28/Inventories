/**
 * Noah Manoucheri
 * 7/24/2022 1:47 PM
 * A 3D model viewer for items in player inventories
 */
//camera code
var easycam;
//holds what model to load
var displayModel;

function createViewer() {
  var viewer = (s) => {
    let dmns = layouts.viewer; //holds deminsions (dmns) set in main.js

    s.setup = () => {
      s.cnv = s.createCanvas(dmns.width, dmns.height, s.WEBGL);
      s.cnv.position(dmns.x, dmns.y);
      //disable right clicking so its easier to use the viewer
      document.addEventListener('contextmenu', event => event.preventDefault());

      easycam = s.createEasyCam();
    };

    s.draw = () => {
      s.background(49);
      //will only display and be interactable IF a non-sending stone item is procured
      if (displayModel != undefined && !messaging) {
        items[arrayOfItems[displayModel].id].display(s); //draws the selected model
      }
    };
  };
  let viewerDisplay = new p5(viewer, "model viewer");
}
