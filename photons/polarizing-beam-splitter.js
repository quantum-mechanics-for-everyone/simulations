// PHOTON Engine Tutorials
// Copyright (C) 2015-2016 Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Dylan Cutler (https://github.com/DCtheTall)
//
// -------------------------------------- LICENSE --------------------------------------------------
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
//
// #################################################################################################



/*

Polarizing Beam Splitter Exercise:
---------------------------------
Introduction to photon polarization

This program uses the PHOTON engine to
render an exercise which introduces users
to a polarizing beam splitter.

Author: Dylan Cutler

*/

// Setting the PHOTON.experiment property to a function that starts
// the exercise.
PHOTON.experiment = function() {
  // Reference to the instance of the PHOTON app
  var app = PHOTON.instance
  // Adding a WebGL scene
  ,   scene = new PHOTON.SceneBox(10, 60, 980, 450);
  app.add(scene, true);
  // If WebGL is supported, the experiment begins
  if(PHOTON._WEB_GL_SUPPORT) beginExperiment();
}

// This function is called when the app knows it can use WebGL
// This part of the program defines the actual exercise
function beginExperiment() {

//== EXPERIMENT SETUP ==//

// Reference to the instance of the application
var app = PHOTON.instance;

// Reference to object that renders the 3D scene
var scene = PHOTON.children['SceneBox'];
scene.placeCamera(-200, 100, 250, -200, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 1000,
  position: new THREE.Vector3(-150, 300, 100)
});

//-- Adding message box and buttons --//

// Refresh button
var btRefresh = new PHOTON.ButtonRefresh();
app.add(btRefresh, true);

// New window button
var btWindow = new PHOTON.ButtonWindow();
app.add(btWindow, true);

// Play button
var btPlay = new PHOTON.ButtonPlay(720, 530, 100, 60);
btPlay.disable();
app.add(btPlay, true);

// Help button
var btHelp = new PHOTON.ButtonHelp(850, 530, 80, 60);
app.add(btHelp, true);

// NEXT button
var btNext = new PHOTON.ButtonNext(750, 620, 160, 50);
btNext.disable();
app.add(btNext, true);

// BACK button
var btBack = new PHOTON.ButtonBack(750, 700, 160, 50);
btBack.disable();
app.add(btBack, true);

// Message box
var msg = new PHOTON.MessageBox(10, 520, 650, 270);
app.add(msg, true);

// Photon counters are stored in this array and instantiated later
var totalCounter = new PHOTON.PhotonCounter('Total Photons', 130, 330)
,   reflCounter =  new PHOTON.PhotonCounter('Reflected Photons', 650, 80)
,   transCounter = new PHOTON.PhotonCounter('Transmitted Photons', 710, 370);

app.add(totalCounter);
totalCounter.hide();
app.add(reflCounter);
reflCounter.hide();
app.add(transCounter);
transCounter.hide();

//-- Help Layer setup --//

PHOTON.helpLayerSetup = function() {
  var helpLayer = PHOTON.children['help-layer'];

  with(helpLayer) {
    // Rendering a clone of the help button
    renderHelpClone(850, 530, 80, 60);

    // Rendering arrows to point to various graphics elements
    addArrow(950, 140, 10);
    addArrow(800, 40, 80);
    addArrow(690, 470, 150);
    addArrow(680, 670, 80);
    addArrow(680, 720, 100);

    // Adding text which provides information about the components of the app
    addText(790, 150, 200, 'Press this button to restart the exercise from the beginning.');
    addText(630, 10, 150, 'Press this button to open the exercise in another browser window.');
    addText(590, 390, 200, 'Press this button when prompted to start animations.');
    addText(485, 650, 200, 'Press these buttons when prompted to navigate through the exercise.');
    addText(200, 300, 200, 'The experiment is depicted in this window.');
    addText(200, 600, 200, 'This window provides helpful information about the experiment and how to navigate the exercise.');
  }
}

//-- Elements for the experiment --//

// Photon source
var source = new PHOTON.PhotonSource3D();
source.translate(-200, 200, 0);

// Polarizer (instantiated later)
var polarizer;

// LightPaths
var lightPaths = PHOTON.lightPaths;

// Photons (photon 2 is instantiated later)
var photon = new PHOTON.Photon3D()
,   photon2;
photon.setPoyntingVector(1, 0);
photon.polarize('random');
photon.translate(-200, 200, 0);

// Polarizing beam splitter
var splitter = new PHOTON.PolarizingBeamSplitter();
splitter.translate(0, 200, 0);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the exercise on the polarizing beam splitter. Press the cyan "+
    "help button for more information about how to use the application. Press "+
    "next to continue.",
  'added-photon-source':
    "In this exercise, we are going to be looking at photons leaving the photon "+
    "source above. Press NEXT to continue.",
  'added-polarizing-beam-splitter':
    "Now we have added an optical component called a polarizing beam splitter. "+
    "Press NEXT to continue.",
  'send-photon-into-splitter':
    "Press the green play button to send a photon from the source into the polarizing "+
    "beam splitter",
  'two-outcomes':
    "When the photon leaves the beam splitter, it can travel along two possible paths "+
    "(it is important to note that we are showing both paths at once above, and that "+
    "the photon did not split into two separate ones). Press NEXT to continue.",
  'horizontally-polarized':
    "The photon can be transmitted through the beam splitter and come out horizontally "+
    "polarized. Press NEXT to continue.",
  'vertically-polarized':
    "The photon could also be reflected by the beam splitter and come out vertically "+
    "polarized. Press NEXT to continue.",
  'can-go-back':
    "Press BACK if you want to see the animation again. Press NEXT to continue.",
  'send-into-vertical-polarizer':
    "Now we have added a vertical polarizer between the photon source and the polarizing "+
    "beam splitter. Press the green play button to send a photon into the setup.",
  'always-reflected':
    "If a vertically polarized photon enters the polarizing beam splitter, it will "+
    "always be reflected. Press BACK if you want to see the animation again. Press "+
    "NEXT to continue.",
  'send-into-horizontal-polarizer':
    "Now we have rotated the polarizer 90&deg. Press the green play button to send "+
    "a photon into the new setup.",
  'always-transmitted':
    "If a horizontally polarized photon enters the polarizing beam splitter, it "+
    "will always be transmitted. Press BACK if you want to see the animation again. "+
    "Press NEXT to continue.",
  'send-into-45-deg-polarizer':
    "Now we have rotated the polarizer so that its transmission axis is 45&deg from "+
    "the vertical. Press the green play button to send a photon into the new setup.",
  'transmitted-this-time':
    "This time, the photon was transmitted through the polarizer and polarized "+
    "horizontally. However, the outcome is actually random and the photon is equally "+
    "likely to leave the beam splitter either way. The probability of each outcome is "+
    "given by"+
    "<br><br>"+
    "P<sub>t</sub> = sin<sup>2</sup>(45&deg) = P<sub>r</sub> = cos<sup>2</sup>(45&deg) = 50%"+
    "<br><br>"+
    "Press NEXT to continue.",
  'reflected-this-time':
    "This time, the photon was reflected through the polarizer and polarized "+
    "vertically. However, the outcome is actually random and the photon is equally "+
    "likely to leave the beam splitter either way. The probability of each outcome is "+
    "given by"+
    "<br><br>"+
    "P<sub>t</sub> = sin<sup>2</sup>(45&deg) = P<sub>r</sub> = cos<sup>2</sup>(45&deg) = 50%"+
    "<br><br>"+
    "Press NEXT to continue.",
  'added-photon-counters':
    "Now we have added photon counters that keep track of how many photons have left "+
    "the source, how many photons have been transmitted through the splitter with "+
    "horizontal polarization, and how many photons have been reflected with vertical "+
    "polarization. Press NEXT to continue.",
  'press-to-send-photon':
    "Press the green play button to send a photon into the setup.",
  'press-to-send-again':
    "Press the green play button when it blinks to send another photon.",
  'conclusion':
    "If you are still not convinced that the outcome "+
    "is random, you can press the green play button when it blinks to send 10 photons "+
    "into the setup so that you can observe the outcome."+
    "<br><br>"+
    "This concludes this tutorial."
} // End of TEXT

//== TUTORIAL SETUP ==//

var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce experiment and components
tutorial.addStep(
  { // Introduction
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Move source into view
    animation: function(callback) {
      source.move(1, [0, -200, 0], function() {
        photon.translate(0, -200, 0);
        callback();
      });
    },
    skip: function() {
      photon.translate(0, -200, 0);
      source.translate(0, -200, 0);
    }
  },
  { // Introduce photon source
    msg: TEXT['added-photon-source'],
    labels: [
      {object: source, dx: -100, dy: 160}
    ],
    continuous: true,
    animation: function(callback) {
      source.animateToAngle(4, 2*Math.PI, callback);
    },
    endAnimation: function(callback) {
      source.animateToAngle(0.5, 2*Math.PI + source.theta, callback);
    },
    trigger: 'next'
  },
  { // Move beam splitter into view
    animation: function(callback) {
      scene.moveCamera(3, 20, 250, 300, -70, 0, 0, function() {
        splitter.move(1, [0, -200, 0], callback);
      });
    },
    skip: function() {
      scene.placeCamera(-20, 250, 300, -70, 0, 0);
      splitter.translate(0, -200, 0);
    }
  },
  { // Introduce polarizing beam splitter
    msg: TEXT['added-polarizing-beam-splitter'],
    labels: [{object: splitter, dx: -120, dy: 170}],
    continuous: true,
    animation: function(callback) {
      PHOTON._UPDATE_LABELS = false;
      splitter.animateToAngle(4, 2*Math.PI, callback);
    },
    endAnimation: function(callback) {
      splitter.animateToAngle(0.5, 2*Math.PI + splitter.theta, callback);
    },
    trigger: 'next'
  },
  { // Creating light paths
    animation: function(callback) {
      var path = new PHOTON.LightPath3D(-200, 0, -190, 0);
      source.blink();
      path.animateLengthChange(0.5, 190, function() {
        var path2 = new PHOTON.LightPath3D(0, 0, 0, -10);
        path.animateLengthChange(1, 500);
        path2.animateLengthChange(1, 490, callback);
      })
    },
    skip: function() {
      var path = new PHOTON.LightPath3D(-200, 0, 500, 0);
      var path2 = new PHOTON.LightPath3D(0, 0, 0, -500);
      source.addLabel(-100, 160);
      splitter.addLabel(-120, 170);
    }
  }
);

// Step 1: Send photon through the splitter without a polarizer in the way
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['send-photon-into-splitter'],
    trigger: 'play'
  },
  { // Send photon
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(4, 200, function() {
        photon.polarize(Math.PI/2);
        photon.shoot(2, 100);

        if(photon2 === undefined) {
          photon2 = new PHOTON.Photon3D();
          photon2.setPoyntingVector(0, -1);
          photon2.polarize(0);
        }
        else photon2.translate(0, -200, 0);
        photon2.shoot(2, 100, callback);
      });
    },
    skip: function() {
      photon2 = new PHOTON.Photon3D();
      photon2.setPoyntingVector(0, -1);
      photon2.polarize(0);
      photon2.translate(0, 200, 0);
    }
  },
  { // Explain we are showing two outcomes at once
    msg: TEXT['two-outcomes'],
    trigger: 'next'
  },
  { // Examine horizontal polarization
    animation: function(callback) {
      scene.moveCamera(3, 150, 80, 200, 100, 0, 0, function() {
        scene.addArrowLayer();
        scene.addArrow(300, 120, 135);
        callback();
      });
    }
  },
  { // Explain first path (horizontal polarization)
    msg: TEXT['horizontally-polarized'],
    trigger: 'next'
  },
  { // Examine vertical polarization
    animation: function(callback) {
      scene.removeArrows();
      scene.moveCamera(3, 200, 80, -150, 0, 0, -100, function() {
        scene.addArrow(460, 100, 210);
        callback();
      });
    }
  },
  { // Examine second path (vertical polarization)
    msg: TEXT['vertically-polarized'],
    trigger: 'next',
  },
  { // Panning out and completing photon animation
    animation: function(callback) {
      scene.removeArrows();
      scene.moveCamera(3, 30, 200, 250, -20, 0, 0, function() {
        photon.shoot(4, 400, function() {
          photon.polarize('random');
          photon.translate(-700, 0, 0);
        });
        photon2.shoot(4, 400, function() {
          photon2.translate(0, 200, 500);
          callback();
        });
      });
    },
    skip: function() {
      source.removeLabel();
      splitter.removeLabel();
      scene.placeCamera(30, 200, 250, -20, 0, 0);
    }
  }
);

// Step 2: Add a polarizer
tutorial.addStep(
  { // Giving option to go back and review animation
    back: function() {},
    msg: TEXT['can-go-back'],
    trigger: 'next'
  },
  { // Moving polarizer into view
    animation: function(callback) {
      polarizer = new PHOTON.Polarizer();
      polarizer.translate(-100, 200, 0);
      polarizer.move(1, [0, -200, 0], function() {
        lightPaths[0].changeLength(-500);
        polarizer.addLabel(-90, 160);
        callback();
      });
    },
    skip: function() {
      polarizer = new PHOTON.Polarizer();
      polarizer.translate(-100, 0, 0);
      lightPaths[0].changeLength(-500);
    }
  }
);

// Step 3: Send photon through vertical polarizer
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['send-into-vertical-polarizer'],
    trigger: 'play'
  },
  { // Animate photon through the setup
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(1, 100, function() {
        photon.polarize(0);
        photon.shoot(1, 100, function() {
          photon.setPoyntingVector(0, -1);
          photon.shoot(5, 500, function() {
            photon.setPoyntingVector(1, 0);
            photon.polarize('random');
            photon.translate(-200, 0, 500);
            callback();
          });
        })
      });
    }
  }
);

// Step 4: Explain that vertical polarization leads to photon always being
// reflected and rotate polarizer
tutorial.addStep(
  { // Discuss result of last animation
    back: function(){},
    msg: TEXT['always-reflected'],
    trigger: 'next'
  },
  { // Rotate polarizer
    animation: function(callback) {
      polarizer.addLabel(-90, 160);
      setTimeout(function() {
        lightPaths[0].changeLength(500);
        polarizer.animateToAngle(3, Math.PI/2, function() {
          lightPaths[1].changeLength(-499);
          callback();
        });
      }, 1000);
    },
    skip: function() {
      polarizer.orientToAngle(Math.PI/2);
      lightPaths[0].changeLength(500);
      lightPaths[1].changeLength(-499);
    }
  }
);

// Step 5: Send photon into horizontal polarizer then beam splitter
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['send-into-horizontal-polarizer'],
    trigger: 'play'
  },
  { // Animate photon into horizontal polarizer and beam splitter
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(1, 100, function() {
        photon.polarize(Math.PI/2);
        photon.shoot(5, 500, function() {
          photon.polarize('random');
          photon.translate(-600, 0, 0);
          callback();
        });
      });
    }
  }
);

// Step 6: Rotate polarizer 45 degrees
tutorial.addStep(
  { // Explain result of last animation
    back: function() {},
    msg: TEXT['always-transmitted'],
    trigger: 'next'
  },
  { // Rotate polarizer again
    animation: function(callback) {
      polarizer.addLabel(-90, 160);
      setTimeout(function() {
        lightPaths[1].changeLength(499);
        polarizer.animateToAngle(3, Math.PI/4, callback);
      }, 1000);
    },
    skip: function() {
      polarizer.orientToAngle(Math.PI/4);
      lightPaths[1].changeLength(499);
    }
  }
);

// Step 7: Send photon into 45 degree polarizer
var outcome = Math.random();
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['send-into-45-deg-polarizer'],
    trigger: 'play'
  },
  { // Send photon into the beam splitter with a random outcome
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(1, 100, function() {
        photon.polarize(Math.PI/4);
        photon.shoot(1, 100, function() {
          // Random outcome
          if(outcome < 0.5) {
            photon.polarize(Math.PI/2);
            photon.shoot(4, 400, function() {
              photon.polarize('random');
              photon.translate(-600, 0, 0);
              callback();
            });
          }
          else {
            photon.setPoyntingVector(0, -1);
            photon.polarize(0);
            photon.shoot(5, 500, function() {
              photon.setPoyntingVector(1, 0);
              photon.polarize('random');
              photon.translate(-200, 0, 500);
              callback();
            });
          }
        });
      });
    }
  }
);

// Step 8: Introduce beam splitters and allow users to send many photons into the
// setup
tutorial.addStep(
  { // Explain random outcome
    msg: outcome < 0.5? TEXT['transmitted-this-time'] : TEXT['reflected-this-time'],
    trigger: 'next'
  },
  { // Add photon counters
    animation: function(callback) {
      totalCounter.show(500);
      reflCounter.show(500);
      transCounter.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Explain photon counters
    blink: [
      {object: totalCounter, hold: true},
      {object: reflCounter, hold: true},
      {object: transCounter, hold: true}
    ],
    msg: TEXT['added-photon-counters'],
    trigger: 'next'
  },
  { // Send photons into splitter
    free: function(callback) {
      // This number keeps track of how many photons have been sent
      var photonsSent = 0;

      // Set message box
      msg.setMessage(TEXT['press-to-send-photon']);

      //-- Add event listener to the play button --//

      // Function executes when btPlay is pressed
      function sendPhoton() {
        // Remove event
        btPlay.offPress();
        if(btPlay.blinkHold) btPlay.blinkOff();

        // Increasing total photon count
        photonsSent++;
        totalCounter.increase();

        // Callback at the end depends on how many photons were sent
        function endCallback() {
          if(photonsSent < 5) {
            msg.setMessage(TEXT['press-to-send-again']);

            btPlay.blink();
            btPlay.onPress(sendPhoton);
          }
          else callback();
        }

        // This number determines the random outcome
        var outcome = Math.random();

        // Animation
        source.blink();
        photon.shoot(0.5, 100, function() {
          photon.polarize(Math.PI/4);
          photon.shoot(0.5, 100, function() {
            if(outcome < 0.5) {
              photon.polarize(Math.PI/2);
              photon.shoot(2, 400, function() {
                transCounter.increase();
                photon.polarize('random');
                photon.translate(-600, 0, 0);

                endCallback();
              });
            }
            else {
              photon.setPoyntingVector(0, -1);
              photon.polarize(0);
              photon.shoot(2.5, 500, function() {
                reflCounter.increase();
                photon.setPoyntingVector(1, 0);
                photon.polarize('random');
                photon.translate(-200, 0, 500);

                endCallback();
              });
            }
          });
        });
      }

      // Activating play button
      btPlay.enable();
      btPlay.blink(true);
      btPlay.onPress(sendPhoton);
    }
  }
);

// Step 9: Conclusion
tutorial.addStep(
  { // Conclusion
    msg: TEXT['conclusion'],
    free: function() {
      // Adding event listener to btPlay
      function send10Photons(count) {
        btPlay.offPress();

        // Increasing the count of the photons sent
        count++;

        // Callback that executes at the end of the animation
        function endCallback() {
          if(count < 10) send10Photons(count);
          else {
            btPlay.blink();
            btPlay.onPress(function() {
              send10Photons(0);
            });
          }
        }

        // Animation
        totalCounter.increase();
        source.blink();
        photon.shoot(0.25, 100, function() {
          photon.polarize(Math.PI/4);
          photon.shoot(0.25, 100, function() {
            if(Math.random() < 0.5) {
              photon.polarize(Math.PI/2);
              photon.shoot(1, 400, function() {
                photon.polarize('random');
                photon.translate(-600, 0, 0);

                transCounter.increase();
                endCallback();
              });
            }
            else {
              photon.setPoyntingVector(0, -1);
              photon.polarize(0);
              photon.shoot(1.25, 500, function() {
                photon.setPoyntingVector(1, 0);
                photon.polarize('random');
                photon.translate(-200, 0, 500);

                reflCounter.increase();
                endCallback();
              });
            }
          });
        });
      }
      btPlay.onPress(function() {
        send10Photons(0);
      })
    }
  }
);

// Starting the experiment
setTimeout(function(){
  PHOTON.children['loading'].$.fadeOut({ duration: 300 });
  setTimeout(tutorial.start, 500);
}, 2000);

} // End of the definition of the exercise

// PHOTON._DEVELOPER_MODE = true;

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the exercise on the<br>"+
    "polarizing beam splitter.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
