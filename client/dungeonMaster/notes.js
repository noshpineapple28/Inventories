/**
 * Noah Manoucheri
 * 7/24/2022 4:43 PM
 * Program is designed to display any notes found
 * any given item found in-game
 */
//holds given text for an object
var displayText;
var startText = 0; //index to start displaying the text at
var noteLength;

function createNotes() {
  var notes = (s) => {
    let demns = dmns.writing; //holds deminsions (demns) set in main.js
    let clicked = false; //holds if mouse was clicked
    let typing = false; //holds whether player is typing a message or not
    let note = ""; //holds the note we are writing
    let sharing = false; //holds if a share request was sent

    s.setup = () => {
      s.cnv = s.createCanvas(demns.width, demns.height);
      s.cnv.position(demns.x, demns.y);
    };

    /**
     * itemName:
     * literally just displays the item name
     */
    s.itemName = () => {
      s.noStroke();
      s.fill(0);
      s.textSize(30);
      s.textAlign(s.LEFT, s.BASELINE);
      s.text(items[displayText.id].name, s.width * 0.01, s.height * 0.07);
      //border line
      s.stroke(0);
      s.line(0, s.height * 0.1, s.width * .8, s.height * 0.1);
    };

    /**
     * displayNotes:
     * all the code for displaying code on screen
     * FIRST: Split code up int individual words
     * SECOND: Add up text in lines, if a word goes off screen
     *         wrap around
     * THIRD: Add the seperated lines of text together
     * FOUR: Display text on the selected start line, if the
     *       text starts to go off, stop displaying
     */
    s.displayNotes = () => {
      let textToWrite = items[displayText.id].notes[0].split(" ");
      let notesToWrite = [];
      displayText.playerAdditions.forEach((note) =>
        notesToWrite.push(note.split(" "))
      );
      let notesLines = [""];
      let textLines = ["      "]; //divides up the text into lines based on size
      let size = 15;
      s.textSize(size);
      //set up the text to appear on screen
      for (let i = 0; i < textToWrite.length; i++) {
        if ((textToWrite[i] === "ENTER_LINE")) {
            textLines[textLines.length - 1] += "\n";
            textLines.push("      ");
        } else if (
          s.textWidth(textLines[textLines.length - 1] + textToWrite[i]) >=
          s.width * 0.85
        ) {
          textLines[textLines.length - 1] += "\n";
          textLines.push("");
          textLines[textLines.length - 1] += textToWrite[i] + " ";
        } else {
          textLines[textLines.length - 1] += textToWrite[i] + " ";
        }
      }
      //set up notes to appear on screen
      for (let j = 0; j < notesToWrite.length; j++) {
        notesLines[notesLines.length - 1] += "\n";
        notesLines.push("");
        notesLines[notesLines.length - 1] += "\n";
        notesLines.push("");
        for (let i = 0; i < notesToWrite[j].length; i++) {
          if (
            s.textWidth(
              notesLines[notesLines.length - 1] + notesToWrite[j][i]
            ) >=
            s.width * 0.85
          ) {
            notesLines[notesLines.length - 1] += "\n";
            notesLines.push("");
            notesLines[notesLines.length - 1] += notesToWrite[j][i] + " ";
          } else {
            notesLines[notesLines.length - 1] += notesToWrite[j][i] + " ";
          }
        }
      }
      //adds all notes to the base text file
      notesLines.forEach((text) => textLines.push(text));

      //display the text
      let finalText = "";
      let keepDisplaying = true; //once text off screen, stop
      let lineCount = 0;
      size *= 1.2; //resets the text size to how large it appears on screen
      for (let i = startText; i < textLines.length && keepDisplaying; i++) {
        if (size * (lineCount + 2) + s.height * 0.1 >= s.height * 0.85) {
          keepDisplaying = false;
        } else {
          finalText += textLines[i];
          //console.log(size * i, s.height * 0.85);
        }
        lineCount++;
      }
      //set max noteLength
      noteLength = textLines.length;
      //display text
      s.noStroke();
      s.fill(0);
      s.textAlign(s.LEFT, s.BASELINE);
      s.text(finalText, s.width * 0.02, s.height * 0.1 + size);
    };

    /**
     * scrollButtons:
     * used for scrolling text
     */
    s.scrollButtons = () => {
      //up button
      //check if mouse is inside
      if (
        s.isInside(
          s.width * 0.89,
          s.height * 0.11,
          s.width * 0.1,
          s.height * 0.1
        )
      ) {
        s.stroke(0);
        s.fill(0, 200);
        if (clicked) {
          clicked = false;
          //change the starting line of text display
          //change the starting line of text display
          if (startText < noteLength - 1) {
            startText++;
          } else {
            startText = noteLength - 1;
          }
        }
      } else {
        s.stroke(120);
        s.fill(0, 120);
      }

      //down button
      if (
        s.isInside(
          s.width * 0.89,
          s.height * 0.74,
          s.width * 0.1,
          s.height * 0.1
        )
      ) {
        s.stroke(0);
        s.fill(0, 200);
        if (clicked) {
          clicked = false;
          //change the starting line of text display
          if (startText > 0) {
            startText--;
          } else {
            startText = 0;
          }
        }
      } else {
        s.stroke(120);
        s.fill(0, 120);
      }
      //check if mouse is inside
    };

    /**
     * scrollbar:
     * adds scrollbar functionality for viewing notes
     */
    s.scrollBar = () => {
      //line for bar
      s.stroke(0);
      //s.strokeWeight(2.5);
      //s.line(s.width * 0.94, s.height * 0.23, s.width * 0.94, s.height * 0.72);
      //s.strokeWeight(1);

      //rectangle
      let percentage = startText / noteLength;
      let lineLength = s.height * 0.72 - s.height * 0.23;
      s.stroke(120);
      s.fill(120);
      s.rect(
        s.width * 0.945 - s.width * (0.03 / 2),
        s.height * 0.72 -
          lineLength * percentage -
          (1 / noteLength) * lineLength,
        s.width * 0.03,
        (1 / noteLength) * lineLength
      );
      //code for using the slider
      if (
        s.isInside(s.width * 0.92, s.height * 0.23, s.width * 0.04, lineLength)
      ) {
        if (s.mouseIsPressed) {
          //set slider position when selected
          startText = s.round(
            noteLength * (s.dist(0, s.mouseY, 0, s.height * 0.72) / lineLength)
          );
          //set min and max pos for slider
          if (startText < 0) {
            startText = 0;
          } else if (startText > noteLength - 1) {
            startText = noteLength - 1;
          }
        }
      }
    };

    /**
     * shows option buttons for the settings bar
     */
    s.toolBar = () => {
      if (!typing && !sharing) {
        //type in chat box
        if (
          s.isInside(
            s.width * 0.06,
            0.908 * s.height,
            s.width * 0.41,
            s.height * 0.08,
            5
          )
        ) {
          s.stroke(0);
          if (clicked) {
            clicked = false;
            sharing = false;
            typing = true;
          }
        } else {
          s.stroke(120);
        }
        s.fill(255);
        s.rect(
          s.width * 0.06,
          0.908 * s.height,
          s.width * 0.41,
          s.height * 0.08,
          5
        );
        s.noStroke();
        s.fill(0);
        s.textSize(15);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(
          "Add Note",
          s.width * 0.06 + s.width * (0.41 / 2),
          0.908 * s.height + s.height * (0.08 / 2)
        );
        //reset textAllign
        s.textAlign(s.LEFT, s.BASELINE);

        //sharing box
        if (
          s.isInside(
            s.width * 0.53,
            0.908 * s.height,
            s.width * 0.41,
            s.height * 0.08,
            5
          )
        ) {
          s.stroke(0);
          if (clicked) {
            clicked = false;
            sharing = true;
            typing = false;
          }
        } else {
          s.stroke(120);
        }
        s.fill(255);
        s.rect(
          s.width * 0.53,
          0.908 * s.height,
          s.width * 0.41,
          s.height * 0.08,
          5
        );
        s.noStroke();
        s.fill(0);
        s.textSize(15);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(
          "Share Item",
          s.width * 0.53 + s.width * (0.41 / 2),
          0.908 * s.height + s.height * (0.08 / 2)
        );
        //reset textAllign
        s.textAlign(s.LEFT, s.BASELINE);
      }
    };

    /**
     * addNote:
     * opens a text bar to type text from
     * when text string gets too long, continues to type, but
     * removes the begginig of the input
     *
     * You can BACKSPACE or DELETE characters
     * Hit ESCAPE to end
     * Hit ENTER or RETURN to submit
     */
    s.addNote = () => {
      //type box
      s.stroke(0);
      s.fill(255);
      s.rect(
        s.width * 0.05,
        s.height * 0.91,
        s.width * 0.9,
        s.height * 0.08,
        5
      );

      //display text
      s.textSize(15);
      if (s.textWidth(note) >= s.width * 0.9) {
        let displayText = "";
        let addText = true;
        for (let i = note.length - 1; i >= 0 && addText; i--) {
          if (s.textWidth(displayText + note[i]) >= s.width * 0.9) {
            addText = false;
          } else {
            displayText = note[i] + displayText;
          }
        }
        //display the text
        s.noStroke();
        s.fill(0);
        s.textAlign(s.RIGHT, s.CENTER);
        s.text(displayText, s.width * 0.95, s.height * 0.95);
        //typing line
        if (s.frameCount % 60 < 30) {
          s.stroke(0);
        } else {
          s.stroke(255);
        }
        //text typing line
        s.line(
          s.width * 0.96,
          s.height * 0.92,
          s.width * 0.96,
          s.height * 0.98
        );
        //reset settings
        s.textAlign(s.LEFT, s.BASELINE);
        s.stroke(255); //reset stroke
        s.textAlign(s.LEFT, s.BASELINE);
      } else {
        s.noStroke();
        s.fill(0);
        s.textAlign(s.LEFT, s.CENTER);
        s.text(note, s.width * 0.06, s.height * 0.95);
        //typing line
        if (s.frameCount % 60 < 30) {
          s.stroke(0);
        } else {
          s.stroke(255);
        }
        //text typing line
        s.line(
          s.width * 0.061 + s.textWidth(note),
          s.height * 0.92,
          s.width * 0.061 + s.textWidth(note),
          s.height * 0.98
        );
        //reset settings
        s.textAlign(s.LEFT, s.BASELINE);
        s.stroke(255); //reset stroke
      }
    };

    s.draw = () => {
      s.background(ui[1]);
      s.fill(49);
      s.noStroke();
      //s.rect(s.width * 0, s.height * 0, s.width, s.height * 0.85, 5);
      s.rect(0, s.height * 0.9, s.width, s.height * 0.1, 5);
      if (displayText != undefined) {
        //for notes section
        s.itemName();
        s.displayNotes();
        s.scrollButtons();
        s.scrollBar();
        //for notes interaction
        if (!typing && !sharing) {
          s.toolBar();
        } else if (typing) {
          s.addNote();
        } else if (sharing) {
          //TODO: add sharing functionality
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

    /**
     * keyPressed:
     * event listener for when the keyboard is used
     * adds characters to notes, and escapes from options
     * menu modes
     *
     * Is used to add the note when submitted
     */
    s.keyPressed = () => {
      //as long as a ASCII key is typed, add to the note
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
        note += s.key;
      }
      //removes the last letter from a string
      if (typing && (s.keyCode === s.BACKSPACE || s.keyCode === s.DELETE)) {
        note = note.slice(0, -1);
      }
      //exits menus
      if ((typing || sharing) && s.keyCode === s.ESCAPE) {
        typing = false;
        sharing = false;
        note = "";
      }
      //pushes the lates note to the list of notes for an item
      if (typing && (s.keyCode === s.ENTER || s.keyCode === s.RETURN)) {
        typing = false;
        socket.emit("add note", [displayText, note]);
        displayText.playerAdditions.push(
          `Note Added :  ` + note
        );
        note = "";
      }
    };
  };
  var notesTab = new p5(notes, "notes");
}
