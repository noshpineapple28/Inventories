/**
 * Noah Manoucheri
 * 7/24/2022 11:30 PM
 * This will be a chat messaging system, where two
 * players can use the sending stone item to procure
 * messages
 */
var messaging = false; //holds whether it is time for messaging
var chatDisplay; //holds canvas instructions
let startLine = 0; //message line to start displaying on
let messagesLength = 0; //holds length of messages

//TODO: create a function to be called whenever the messages are displayed that creates/deletes a dropdown DOM element
function createChat() {
  var chat = (s) => {
    let dmns = layouts.viewer; //holds deminsions (dmns) set in main.js
    let clicked = false; //holds if mouse was clicked
    let users = items["sending stone"].members;
    let selectRecipient = false; //holds if we are taking users
    let recipient = "everyone";
    let typing = false; //holds if we are typing
    let note = ""; //holds the note we are writing

    s.setup = () => {
      s.cnv = s.createCanvas(dmns.width, dmns.height);
      s.cnv.position(dmns.x, dmns.y);
    };

    /**
     * setRecipient:
     * used for a dropdown involved in setting a recipient for
     * a message
     * uses selectRecipient for its state machine
     */
    s.setRecipient = () => {
      //text
      s.noStroke();
      s.fill(255);
      s.textAlign(s.LEFT, s.CENTER);
      s.textSize(20);
      s.text("send to ", s.width * 0.03, s.height * 0.82);
      //dropdown box
      //TODO: add dropdown box
      if (!selectRecipient) {
        s.stroke(0);
        s.fill(255);
        s.rect(
          s.width * 0.02 + s.textWidth("send to "),
          s.height * 0.78,
          s.width * 0.3,
          s.height * 0.08,
          5
        );
        //add recipient name
        s.noStroke();
        s.fill(0);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(
          recipient,
          s.width * 0.02 + s.textWidth("send to ") + s.width * (0.3 / 2),
          s.height * 0.78 + s.height * (0.08 / 2)
        );
        s.textAlign(s.LEFT, s.BASELINE);
        //if box is clicked, turn on recipient select mode
        if (
          s.isInside(
            s.width * 0.02 + s.textWidth("send to "),
            s.height * 0.78,
            s.width * 0.3,
            s.height * 0.08
          ) &&
          clicked
        ) {
          clicked = false;
          typing = false;
          selectRecipient = true;
        }
        //else, choose recipient
      } else {
        let userCount = 0; //holds which member we are checking
        //add box for EVERYONE setting
        s.stroke(0);
        s.fill(255);
        s.rect(
          s.width * 0.02 + s.textWidth("send to "),
          s.height * 0.78 - s.height * 0.08 * userCount,
          s.width * 0.3,
          s.height * 0.08,
          5
        );
        //add recipient name
        s.noStroke();
        s.fill(0);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(
          "everyone",
          s.width * 0.02 + s.textWidth("send to ") + s.width * (0.3 / 2),
          s.height * 0.78 + s.height * (0.08 / 2) - s.height * 0.08 * userCount
        );
        //if everyone is chosen choose everyone
        if (
          s.isInside(
            s.width * 0.02 + s.textWidth("send to "),
            s.height * 0.78 - s.height * 0.08 * userCount,
            s.width * 0.3,
            s.height * 0.08
          ) &&
          clicked
        ) {
          clicked = false;
          selectRecipient = false;
          recipient = "everyone";
        }
        s.textAlign(s.LEFT, s.BASELINE);
        userCount++;
        //add recipients for every other online player
        for (let member in items["sending stone"].members) {
          if (member != username) {
            s.stroke(0);
            s.fill(255);
            s.rect(
              s.width * 0.02 + s.textWidth("send to "),
              s.height * 0.78 - s.height * 0.08 * userCount,
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
              s.width * 0.02 + s.textWidth("send to ") + s.width * (0.3 / 2),
              s.height * 0.78 +
                s.height * (0.08 / 2) -
                s.height * 0.08 * userCount
            );
            s.textAlign(s.LEFT, s.BASELINE);
            //if this one is selected choose this recipient
            if (
              s.isInside(
                s.width * 0.02 + s.textWidth("send to "),
                s.height * 0.78 - s.height * 0.08 * userCount,
                s.width * 0.3,
                s.height * 0.08
              ) &&
              clicked
            ) {
              clicked = false;
              selectRecipient = false;
              recipient = member;
            }
            userCount++;
          }
        }
      }
    };

    /**
     * textInput:
     * used for the implimenting the text bar
     */
    s.textInput = () => {
      //type box
      s.stroke(0);
      s.fill(255);
      s.rect(
        s.width * 0.02,
        s.height * 0.89,
        s.width * 0.8,
        s.height * 0.08,
        5
      );
      //set typing mode
      if (
        s.isInside(
          s.width * 0.02,
          s.height * 0.89,
          s.width * 0.8,
          s.height * 0.08
        ) &&
        clicked
      ) {
        typing = true;
        selectRecipient = false;
        clicked = false;
      }

      //display text
      s.textSize(15);
      if (s.textWidth(note) >= s.width * 0.74) {
        let displayText = "";
        let addText = true;
        for (let i = note.length - 1; i >= 0 && addText; i--) {
          if (s.textWidth(displayText + note[i]) >= s.width * 0.72) {
            addText = false;
          } else {
            displayText = note[i] + displayText;
          }
        }
        //display the text
        s.noStroke();
        s.fill(0);
        s.textAlign(s.RIGHT, s.CENTER);
        s.text(displayText, s.width * 0.76, s.height * 0.93);
        //typing line
        if (s.frameCount % 60 < 30) {
          s.stroke(0);
        } else {
          s.stroke(255);
        }
        //text typing line
        s.line(s.width * 0.76, s.height * 0.9, s.width * 0.76, s.height * 0.96);
        //reset settings
        s.textAlign(s.LEFT, s.BASELINE);
        s.stroke(255); //reset stroke
        s.textAlign(s.LEFT, s.BASELINE);
      } else {
        s.noStroke();
        s.fill(0);
        s.textAlign(s.LEFT, s.CENTER);
        s.text(note, s.width * 0.06, s.height * 0.93);
        //typing line
        if (s.frameCount % 60 < 30 && typing) {
          s.stroke(0);
        } else if (typing) {
          s.stroke(255);
        }
        //text typing line
        s.line(
          s.width * 0.061 + s.textWidth(note),
          s.height * 0.9,
          s.width * 0.061 + s.textWidth(note),
          s.height * 0.96
        );
        //reset settings
        s.textAlign(s.LEFT, s.BASELINE);
        s.stroke(255); //reset stroke
      }
    };

    /**
     * textSubmit:
     * button for submitting text input
     */
    s.textSubmit = () => {
      if (
        s.isInside(
          s.width * 0.91 - s.width * 0.04,
          s.height * 0.93 - s.width * 0.04,
          s.width * 0.08,
          s.width * 0.08
        )
      ) {
        s.stroke(0);
        if (clicked && note != "") {
          if (recipient === "everyone") {
            note = {
              sender: username,
              senderID: id,
              recipient: recipient,
              recipientID: recipient,
              msg: note,
            };
            arrayOfItems[displayText].chatLog.push(note);
            socket.emit("chat message", { note });
          } else {
            note = {
              sender: username,
              senderID: id,
              recipient: recipient,
              msg: note,
            };
            arrayOfItems[displayText].chatLog.push(note);
            socket.emit("private message", { note });
          }
          note = "";
        }
      } else {
        s.stroke(150);
      }
      s.noFill();
      //circular button
      s.ellipse(s.width * 0.91, s.height * 0.93, s.width * 0.08);
      s.textAlign(s.CENTER, s.CENTER);
      s.text("=>", s.width * 0.91, s.height * 0.93);
      s.textAlign(s.LEFT, s.BASELINE);
      s.stroke(255);
    };

    /**
     * wrapText:
     * function wraps the text for me based on my specifications
     */
    s.wrapText = () => {
      let chatLogs = arrayOfItems[displayText].chatLog;
      let messages = [];
      messagesLength = 0;
      //break up chat blocks into lines of text
      chatLogs.forEach((chat) => {
        let messageBlock = [];
        if (chat.sender === username) {
          messageBlock.push(`Sent by You to ${chat.recipient} : `); //sent text
          messageBlock.push(""); //holds message we are wrapping
          let textToWrap = chat.msg.split(" ");
          for (let i = 0; i < textToWrap.length; i++) {
            if (
              s.textWidth(
                messageBlock[messageBlock.length - 1] + textToWrap[i]
              ) >=
              s.width * 0.85
            ) {
              messageBlock.push("");
              messageBlock[messageBlock.length - 1] += textToWrap[i] + " ";
            } else {
              messageBlock[messageBlock.length - 1] += textToWrap[i] + " ";
            }
          }
        } else {
          messageBlock.push(`Sent by "${chat.sender}" : `); //sent text
          messageBlock.push(""); //holds message we are wrapping
          let textToWrap = chat.msg.split(" ");
          for (let i = 0; i < textToWrap.length; i++) {
            if (
              s.textWidth(
                messageBlock[messageBlock.length - 1] + textToWrap[i]
              ) >=
              s.width * 0.85
            ) {
              messageBlock.push("");
              messageBlock[messageBlock.length - 1] += textToWrap[i] + " ";
            } else {
              messageBlock[messageBlock.length - 1] += textToWrap[i] + " ";
            }
          }
        }
        messageBlock.push("\n");
        messages.push([messageBlock, messageBlock.length]);
      });

      //set max message length
      messages.forEach((item) => (messagesLength += item[1]));
      //return organized messages
      return messages;
    };

    /**
     * displayMessages:
     * displays the stored messages and displays them in chat
     */
    s.displayMessages = () => {
      let messageBlocks = s.wrapText();
      let size = 15;
      s.textSize(size);
      size *= 1.2;
      let lineCount = 0; //counts how many lines have passed
      let localZero = startLine * size; //holds where the start position of text is
      for (let j = messageBlocks.length - 1; j >= 0; j--) {
        let block = messageBlocks[j][0]; //block of text
        let numOfLines = messageBlocks[j][1]; //holds how many lines a block is

        //seperate messages with blocks
        if (j % 2 === 0) {
          s.fill(180, 130);
        } else {
          s.fill(255, 130);
        }
        //draw rectangle
        s.rectMode(s.CORNERS);
        s.rect(
          1,
          s.height * 0.75 - (lineCount - startLine) * size,
          s.width * 0.88,
          s.height * 0.75 - (lineCount + numOfLines - startLine) * size
        );
        s.rectMode(s.CORNER);
        for (let i = block.length - 1; i >= 0; i--) {
          //write text
          s.noStroke();
          s.fill(0);
          s.textAlign(s.LEFT, s.CENTER);
          s.text(block[i], 3, s.height * 0.75 - (lineCount - startLine) * size);
          s.textAlign(s.LEFT, s.BASELINE);
          lineCount++;
        }
      }
    };

    /**
     * scrollButtons:
     * display buttons for the scroll bar
     */
    s.scrollButtons = () => {
      //up button
      //check if mouse is inside
      if (
        s.isInside(
          s.width * 0.89,
          s.height * 0.01,
          s.width * 0.1,
          s.height * 0.1
        )
      ) {
        s.stroke(0);
        s.fill(0, 200);
        if (clicked) {
          clicked = false;
          //change the starting line of text display
          if (startLine < messagesLength - 1) {
            startLine++;
          } else {
            startLine = messagesLength - 1;
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
          s.height * 0.64,
          s.width * 0.1,
          s.height * 0.1
        )
      ) {
        s.stroke(0);
        s.fill(0, 200);
        if (clicked) {
          clicked = false;
          //change the starting line of text display
          if (startLine > 0) {
            startLine--;
          } else {
            startLine = 0;
          }
        }
      } else {
        s.stroke(120);
        s.fill(0, 120);
      }
    };

    /**
     * scrollBar:
     * create a scrolling bar
     */
    s.scrollBar = () => {
      //rectangle
      let percentage = startLine / messagesLength;
      let lineLength = s.height * 0.72 - s.height * 0.23;
      s.stroke(120);
      s.fill(120);
      s.rect(
        s.width * 0.945 - s.width * (0.03 / 2),
        s.height * 0.635 -
          lineLength * percentage -
          (1 / messagesLength) * lineLength,
        s.width * 0.03,
        (1 / messagesLength) * lineLength
      );
      //code for using the slider
      if (
        s.isInside(s.width * 0.92, s.height * 0.13, s.width * 0.04, lineLength)
      ) {
        if (s.mouseIsPressed) {
          //set slider position when selected
          startLine = s.round(
            messagesLength *
              (s.dist(0, s.mouseY, 0, s.height * 0.62) / lineLength)
          );
          //set min and max pos for slider
          if (startLine < 0) {
            startLine = 0;
          } else if (startLine > messagesLength - 1) {
            startLine = messagesLength - 1;
          }
        }
      }
    };

    s.draw = () => {
      //only ever display the messaging app when messaging is true
      if (messaging) {
        s.background(ui[2]);
        //chat messages
        s.displayMessages();
        //scrolling interactions
        s.scrollButtons();
        s.scrollBar();

        //chat text bar
        s.stroke(255);
        s.fill(49);
        s.rect(1, s.height * 0.75, s.width - 2, s.height * 0.25 - 1);
        s.setRecipient();
        s.textInput();
        s.textSubmit();

        //reset clicks
        clicked = false;
      }
    };

    s.mouseClicked = () => {
      if (messaging) {
        clicked = true;
      }
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
          note += s.key;
        }
        //removes the last letter from a string
        if (typing && (s.keyCode === s.BACKSPACE || s.keyCode === s.DELETE)) {
          note = note.slice(0, -1);
        }
        //exits menus
        if (typing && s.keyCode === s.ESCAPE) {
          typing = false;
          selectRecipient = false;
          note = "";
        }
        //pushes the lates note to the list of notes for an item
        if (
          typing &&
          note != "" &&
          (s.keyCode === s.ENTER || s.keyCode === s.RETURN)
        ) {
          if (recipient === "everyone") {
            note = {
              sender: username,
              senderID: id,
              recipient: recipient,
              recipientID: recipient,
              msg: note,
            };
            arrayOfItems[displayText].chatLog.push(note);
            socket.emit("chat message", { note });
          } else {
            note = {
              sender: username,
              senderID: id,
              recipient: recipient,
              msg: note,
            };
            arrayOfItems[displayText].chatLog.push(note);
            socket.emit("private message", { note });
          }
          note = "";
        }
      }
    };

    /**
     * moveCanvas:
     * moves the canvas in and out of position dependent on
     * the state of whether messaging is taking place
     */
    s.moveCanvas = () => {
      if (messaging) {
        s.cnv.position(dmns.x, dmns.y);
      } else {
        s.cnv.position(0 - dmns.width, 0);
      }
    };
  };
  chatDisplay = new p5(chat, "chat");
}
