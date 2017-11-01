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

Linear Polarization Free Mode:
---------------------------------

This program uses the PHOTON engine to
render an exercise which introduces users
to photon polarization.

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
scene.placeCamera(-70, 80, 400, 0, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 1200,
  position: new THREE.Vector3(-200, 300, 50)
});
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 1000,
  position: new THREE.Vector3(200, 300, 50)
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

// Polarizer switches
var switches = [
  new PHOTON.PolarizerSwitch(0),
  new PHOTON.PolarizerSwitch(1),
  new PHOTON.PolarizerSwitch(2)
];
for(i in switches) {
  app.add(switches[i]);
  switches[i].hide();
}

// Message box
var msg = new PHOTON.MessageBox(10, 520, 650, 270);
app.add(msg, true);

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
source.translate(-250, 300, 0);

// Polarizers
var polarizers = [
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer()
];
polarizers[0].translate(-50, 0, 0);
for(i in polarizers)
  polarizers[i].translate(-100 + 100 * i, 300, 0);

// Screen
var screen = new PHOTON.Screen3D();
screen.putInXZPlane('-x');
screen.translate(350, 300, 0);

// LightPaths
var lightPaths = PHOTON.lightPaths;

// Photon
var photon = new PHOTON.Photon3D();
photon.setPoyntingVector(1, 0);
photon.polarize('random');
photon.translate(-250, 300, 0);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the free exploration mode on photon polarization. Press the cyan "+
    "help button for more information on how to use the application. Press NEXT "+
    "to continue.",
  'initial-setup':
    "In the free expolaration mode, you will be sending photons from a photon source "+
    "through a vertical polarizer to a screen. Press NEXT to continue.",
  'added-switch':
    "Now we have added a button which adds a polarizer in the path of the photon. "+
    "Press the button to add a polarizer to the setup.",
  'enter-number':
    "Enter the angle you want the transmission axis of the polarizer to make with "+
    "the vertical in the window above then press ENTER (or RETURN) on your keyboard to rotate "+
    "the polarizer. Press the green play button to send a photon into the setup.",
  'random-outcome':
    "The photon will continue to the screen unless it is blocked by perpendicular "+
    "polarizers. The probability that each individual photon makes it to the "+
    "screen is displayed on the right. Press NEXT to continue.",
  'free-mode':
    "We have now added two more switches that can add or remove polarizers. Press the "+
    "switches when they turn red to remove a polarizer from the experiment."+
    "<br><br>"+
    "Enter what angle you want the transmission axis of each polarizer to make with the vertical "+
    "in the windows below them and press ENTER (or RETURN) to rotate the polarizer."+
    "<br><br>"+
    "Press the green play button to send a photon into your setup and see whether "+
    "it makes it to the screen."+
    "<br><br>"+
    "This is the end of the exercise. Press the red refresh button on the upper right "+
    "if you wish to view the instructions for this exercise again."
} // End of text

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce setup
tutorial.addStep(
  { // Welcome message
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Move in source, screen, and first polarizer
    animation: function(callback) {
      source.move(1, [0, -300, 0]);
      screen.move(1, [0, -300, 0]);
      polarizers[0].move(1, [0, -300, 0], function() {
        polarizers[0].inView = true;
        photon.translate(0, -300, 0);
        source.blink();
        var path = new PHOTON.LightPath3D(-250, 0, -240, 0);
        path.animateLengthChange(0.5, 590, function() {
          screen.illuminate(1);
          callback();
        });
      });
    },
    skip: function() {
      source.translate(0, -300, 0);
      screen.translate(0, -300, 0);
      polarizers[0].translate(0, -300, 0);
      polarizers[0].inView = true;
      photon.translate(0, -300, 0);
      var path = new PHOTON.LightPath3D(-250, 0, 350, 0);
    }
  },
  { // Explain setup
    msg: TEXT['initial-setup'],
    trigger: 'next',
    labels: [
      {object: source, dx: -100, dy: 150},
      {object: screen, dx: -100, dy: 160},
      {object: polarizers[0], dx: -80, dy: 170}
    ]
  }
);

// Step 1: Introduce polarizer switch
tutorial.addStep(
  { // Introduce polarizer switch
    msg: TEXT['added-switch'],
    free: function(callback) {
      // Show one of the polarizer switches
      switches[1].offPress();
      switches[1].show(500);
      setTimeout(function() { switches[1].blink(true); }, 500);
      setTimeout(function() { switches[1].addEvent(); }, 1000);

      // Switch moves the exercise along
      switches[1].callback = function() {
        switches[1].disable();

        msg.setMessage('');

        setTimeout(function() {
          switches[1].offPress();
          callback();
        }, 3000);

        switches[1].callback = function() {};
      }
    },
    skip: function() {
      switches[1].show();
    }
  }
);

// Step 2: Send a photon into the setup
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['enter-number'],
    trigger: 'play'
  },
  { // Animation with random outcome
    animation: function(callback) {
      // Adding label to polarizer
      polarizers[2].removeInput();
      polarizers[2].addLabel(-90, 160);

      source.blink();
      photon.shoot(1, 100, function() {
        photon.polarize(0);
        photon.shoot(2.5, 250, function() {
          if(PHOTON.polarizers[2].theta !== Math.PI/2) {
            // Photon goes through polarizer to screen
            photon.polarize(PHOTON.polarizers[2].theta);
            photon.shoot(2.6, 260, function() {
              photon.translate(-610, 0, 0);
              photon.polarize('random');
              callback();

              polarizers[2].removeLabel();
              polarizers[2].addInput();
            });
          }
          else {
            // Photon gets blocked by polarizer
            photon.translate(-350, 0, 0);
            photon.polarize('random');
            callback();

            polarizers[2].removeLabel();
            polarizers[2].addInput();
          }
        });
      });
    }
  }
);

// Step 3: Add other switches and allow free exploration
tutorial.addStep(
  { // Add message about random outcome
    msg: TEXT['random-outcome'],
    trigger: 'next'
  },
  { // Free exploration
    free: function() {
      PHOTON._UPDATE_LABELS = false;

      // Showing other switches
      switches[0].show(500);
      switches[2].show(500);
      switches[1].enable();
      switches[1].addEvent();

      // This function executes when the user presses the green button to
      // send photon into setup
      function sendPhoton() {
        btPlay.offPress();
        btPlay.disable();

        for(i in switches) {
          switches[i].offPress();
          switches[i].disable();
        }

        // Polarizers in view (needs to be defined in the function scope)
        var polarizersInView = polarizers.filter(function(current) {
          return current.inView;
        });
        for(var i = 0; i < polarizersInView.length; i++) {
          polarizersInView[i].removeInput();
          polarizersInView[i].addLabel(i === 0? -80 : -90, 170);
        }

        // Begin animation
        source.blink();
        photon.shoot(1, 100, function() {
          // Enter first polarizer
          photon.polarize(0);

          // Either sending the photon to the screen
          if(polarizersInView.length === 1)
            photon.shoot(5.1, 510, function() {
              photon.polarize('random');
              photon.translate(-610, 0, 0);

              for(i in switches) {
                switches[i].addEvent();
                switches[i].enable();
              }

              for(var i = 0; i < polarizersInView.length; i++) {
                if(i === 0) continue;
                polarizersInView[i].addInput();
                polarizersInView[i].removeLabel();
              }

              btPlay.enable();
              btPlay.onPress(sendPhoton);
              btPlay.blink();
            })
          else {
            // Or sending the photon to the next polarizer
            var index = polarizers.indexOf(polarizersInView[1])
            ,   dx = 50 + 100 * index;

            photon.shoot(dx/100, dx, function() {
              sendPhotonThroughPolarizer(1);
            });
          }
        });
      }

      // Callback for when the photon enters a new polarizer
      function sendPhotonThroughPolarizer(j) {
        var polarizersInView = polarizers.filter(function(current) {
          return current.inView;
        });

        // Enter the second polarizer
        photon.polarize(polarizersInView[j].theta);

        // Random outcome
        if(Math.abs(polarizersInView[j].theta - polarizersInView[j-1].theta) !== Math.PI/2) {
          // Photon passes through the polarizer

          // Either goes to screen (if there are no more polarizers)
          if(polarizersInView.length === j + 1) {
            var index = polarizers.indexOf(polarizersInView[j])
            ,   dx = 360 - 100 * (index - 1);

            photon.shoot(dx/100, dx, function() {
              photon.polarize('random');
              photon.translate(-610, 0, 0);

              for(i in switches) {
                switches[i].addEvent();
                switches[i].enable();
              }

              for(var i = 0; i < polarizersInView.length; i++) {
                if(i === 0) continue;
                polarizersInView[i].addInput();
                polarizersInView[i].removeLabel();
              }

              btPlay.enable();
              btPlay.blink();
              btPlay.onPress(sendPhoton);
            });
          }
          else {
            // Or the photon goes onto the next lens
            var index1 = polarizers.indexOf(polarizersInView[j])
            ,   index2 = polarizers.indexOf(polarizersInView[j+1])
            ,   dx = 100 * (index2 - index1);

            photon.shoot(dx/100, dx, function() {
              sendPhotonThroughPolarizer(j + 1);
            });
          }
        }
        else {
          // Photon does not pass through the polarizer
          photon.polarize('random');

          for(var i = 0; i < polarizersInView.length; i++) {
            if(i === 0) continue;
            polarizersInView[i].addInput();
            polarizersInView[i].removeLabel();
          }

          for(i in switches) {
            switches[i].addEvent();
            switches[i].enable();
          }

          var index = polarizers.indexOf(polarizersInView[j]);
          console.log(index);
          photon.translate(-250 - 100 * (index - 1), 0, 0);

          btPlay.enable();
          btPlay.onPress(sendPhoton);
          btPlay.blink();
        }
      }

      // Set message and add event listener to the play button
      setTimeout(function() {
        msg.setMessage(TEXT['free-mode']);
        btPlay.enable();
        btPlay.onPress(sendPhoton);
      }, 500);

      // Disable play button when photon fires
      switches.map(function(current) {
        current.callback = function() {
          btPlay.disable();
          btPlay.offPress();
          setTimeout(function() {
            btPlay.enable();
            btPlay.onPress(sendPhoton);
          }, 1200);
        }
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
  PHOTON._INTRO_MESSAGE = "Welcome to the free exploration<br>"+
    "mode on photon polarization.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
