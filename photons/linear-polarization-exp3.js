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

Linear Polarization Experiment 3:
---------------------------------
More on multiple polarizers

This program uses the PHOTON engine to
render an exercise which shows users how
photons do not "remember" what polarization
they had in the past

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
scene.placeCamera(-250, 100, 350, -50, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 2000,
  position: new THREE.Vector3(-150, 300, 50)
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

// Polarizer
var polarizers = [
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer()
]
polarizers[0].translate(-100, 300, 0);
polarizers[1].translate(0, 300, 0);
polarizers[1].orientToAngle(Math.PI/4);
polarizers[2].translate(100, 300, 0);
polarizers[2].orientToAngle(Math.PI/2);

// Screen
var screen = new PHOTON.Screen3D();
screen.putInXZPlane('-x');
screen.translate(250, 300, 0);

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
    "Welcome to the third exercise on photon polarization. Press the blue cyan "+
    "help button for more information on how to use the application. Press NEXT to continue.",
  'last-exercise-left-off':
    "This exercise begins where the second polarization exericse left off. Press "+
    "the green play button to send a photon into the two perpendicular polarizers.",
  'zero-probability':
    "Just like last time, if the photon travels through two perpendicular polarizers "+
    "it will never reach the screen. Press NEXT to continue. Press BACK if you would "+
    "like to see the animation again.",
  'added-third-polarizer':
    "Now we have added a third polarizer between the two others. This polarizer's "+
    "transmission axis is aligned 45&deg from the vertical. Press the green play "+
    "button to see how this third lens affects the probability that the photon "+
    "makes it to the screen.",
  'non-zero-probability':
    "After adding the third lens, there is a non-zero probability that the photon "+
    "will reach the screen. Press NEXT and we will examine why more carefully. Press "+
    "BACK if you would like to see the animation again.",
  'shoot-photon-third-time':
    "Press the green play button to send the photon through the polarizers again.",
  'polarized-vertically':
    "After the photon passes through the first lens, it becomes vertically polarized. "+
    "Press NEXT to continue.",
  'polarized-45-deg':
    "If the photon passes through the second polarizer, it will be polarized 45&deg from "+
    "the vertical. The probability that the photon makes it through the second polarizer "+
    "is given by"+
    "<br><br>"+
    "cos<sup>2</sup>(45&deg-0&deg) = cos<sup>2</sup>(45&deg) = 50%"+
    "<br><br>"+
    "Press NEXT to continue.",
  'polarized-horizontally':
    "If the photon passes through the third polarizer, it will be polarized horizontally. "+
    "The probability that the photon makes it through the third polarizer is given by"+
    "<br><br>"+
    "cos<sup>2</sup>(90&deg-45&deg) = cos<sup>2</sup>(45&deg) = 50%"+
    "<br><br>"+
    "Press NEXT to continue.",
  'conclusion':
    "Since the photon had a 50% chance of making it through the second polarizer and a "+
    "50% chance of making it through the third polarizer, it has a 25% chance of passing "+
    "through both and reaching the screen."+
    "<br><br>"+
    "This concludes this exercise. Press BACK if you want to see how the photon reaches "+
    "the screen again."
}

//== TUTORIAL SETUP ==//

var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce components for the experiment
tutorial.addStep(
  { // Introduce exercise
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Move in components from the last experiment
    animation: function(callback) {
      source.move(1, [0, -300, 0]);
      screen.move(1, [0, -300, 0]);
      polarizers[0].move(1, [0, -300, 0]);
      polarizers[2].move(1, [0, -300, 0], function() {
        photon.translate(0, -300, 0);
        var path = new PHOTON.LightPath3D(-250, 0, -240, 0);
        source.blink();
        path.animateLengthChange(0.5, 340, callback)
      });
    },
    skip: function() {
      source.translate(0, -300, 0);
      screen.translate(0, -300, 0);
      polarizers[0].translate(0, -300, 0);
      polarizers[2].translate(0, -300, 0);
      photon.translate(0, -300, 0);
      var path = new PHOTON.LightPath3D(-250, 0, 100, 0);
    }
  }
);

// Step 1: Repeat last animation from the second exercise
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['last-exercise-left-off'],
    labels: [
      {object: source, dx: -100, dy: 150},
      {object: screen, dx: -50, dy: 130},
      {object: polarizers[0], dx: -85, dy: 160},
      {object: polarizers[2], dx: -90, dy: 130}
    ],
    trigger: 'play'
  },
  { // Animate photon through the setup
    animation: function(callback) {
      source.blink();
      photon.shoot(3, 150, function() {
        photon.polarize(0);
        photon.shoot(4.2, 210, function() {
          screen.illuminate(0);
          photon.translate(-360, 0, 0);
          photon.polarize('random');
          callback();
        });
      });
    }
  },
  { // Zoom in on screen
    removeLabels: true,
    animation: function(callback) {
      scene.moveCamera(3, 110, 50, 0, 250, 0, 0, callback);
    }
  }
);

// Step 2: Explain zero probability
tutorial.addStep(
  { // Explain probability
    back: function() {
      screen.reset();
      scene.placeCamera(-250, 100, 350, -50, 0, 0);
    },
    msg: TEXT['zero-probability'],
    trigger: 'next'
  },
  { // Bring whole setup back into view
    animation: function(callback) {
      scene.moveCamera(3, -250, 100, 350, -50, 0, 0, function() {
        screen.reset();
        callback();
      });
    }
  }
);

// Step 3: Introduce third polarizer
tutorial.addStep(
  { // Animate in third polarizer
    animation: function(callback) {
      // PHOTON._DEVELOPER_MODE = false;
      polarizers[1].move(1, [0, -300, 0], function() {
        lightPaths[0].changeLength(150);
        callback();
      });
    },
    skip: function() {
      polarizers[1].translate(0, -300, 0);
      lightPaths[0].changeLength(150);
    }
  }
);

// Step 4: Animate photon through the 3 lenses
tutorial.addStep(
  { // Explain third polarizer
    labels: [
      {object: source, dx: -100, dy: 150},
      {object: screen, dx: -50, dy: 130},
      {object: polarizers[0], dx: -85, dy: 160},
      {object: polarizers[2], dx: -90, dy: 130},
      {object: polarizers[1], dx: -85, dy: 135}
    ],
    msg: TEXT['added-third-polarizer'],
    trigger: 'play'
  },
  { // Animating photon through setup
    animation: function(callback) {
      source.blink();
      photon.shoot(3, 150, function() {
        photon.polarize(0);
        photon.shoot(2, 100, function() {
          photon.polarize(Math.PI/4);
          photon.shoot(2, 100, function() {
            photon.polarize(Math.PI/2);
            photon.shoot(3.2, 160, function() {
              screen.illuminate(0.25);
              photon.polarize('random');
              photon.translate(-510, 0, 0);
              callback();
            })
          });
        });
      });
    }
  },
  { // Zooming in on the screen
    removeLabels: true,
    animation: function(callback) {
      scene.moveCamera(3, 110, 50, 0, 250, 0, 0, callback);
    }
  }
);

// Step 5: Explaining non-zero probability
tutorial.addStep(
  { // Examining screen
    back: function() {
      screen.reset();
      scene.placeCamera(-250, 100, 350, -50, 0, 0);
    },
    msg: TEXT['non-zero-probability'],
    trigger: 'next'
  },
  { // Bringing full setup back into view
    animation: function(callback) {
      scene.moveCamera(3, -250, 100, 350, -50, 0, 0, function() {
        screen.reset();
        callback();
      });
    }
  }
);

// Step 6: Animate photon through the polarizers one by one
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['shoot-photon-third-time'],
    trigger: 'play'
  },
  { // Send photon through the first polarizer
    animation: function(callback) {
      photon.shoot(1.5, 150, function() {
        photon.polarize(0);
        photon.shoot(0.5, 50, function() {
          scene.moveCamera(3, -50, 50, 150, -50, 0, 0, callback)
        })
      })
    }
  },
  { // Point out vertical polarization and prompt next part of the animation
    msg: TEXT['polarized-vertically'],
    trigger: 'next'
  },
  { // Sending the photon through the second polarizer
    animation: function(callback) {
      scene.moveCamera(3, 170, 100, 250, 50, 0, 0, function() {
        photon.shoot(0.5, 50, function() {
          photon.polarize(Math.PI/4);
          photon.shoot(0.5, 50, function() {
            scene.moveCamera(3, 90, 50, 150, 50, 0, 0, callback)
          });
        });
      });
    }
  },
  { // Point out 45 deg polarization and prompt next animation
    msg: TEXT['polarized-45-deg'],
    trigger: 'next'
  },
  { // Sending photon through the third polarizer
    animation: function(callback) {
      scene.moveCamera(3, 220, 100, 250, 100, 0, 0, function() {
        photon.shoot(0.5, 50, function() {
          photon.polarize(Math.PI/2);
          photon.shoot(0.5, 50, function() {
            scene.moveCamera(3, 190, 50, 150, 150, 0, 0, callback)
          });
        })
      })
    }
  },
  { // Point out horizontal polarization and prompt next animation
    msg: TEXT['polarized-horizontally'],
    trigger: 'next'
  },
  { // Sending photon into the screen
    animation: function(callback) {
      scene.moveCamera(3, 70, 100, 250, 200, 0, 0, function() {
        photon.shoot(1.1, 110, function() {
          screen.illuminate(0.25);
          photon.polarize('random');
          photon.translate(-510, 0, 0);
          scene.moveCamera(3, 110, 50, 0, 250, 0, 0, callback);
        });
      })
    }
  }
);

// Step 7: Explain final probability
tutorial.addStep({
  msg: TEXT['conclusion'],
  back: function() {
    scene.placeCamera(-250, 100, 350, -50, 0, 0);
    screen.reset();
  }
});

// Starting the experiment
setTimeout(function(){
  PHOTON.children['loading'].$.fadeOut({ duration: 300 });
  setTimeout(tutorial.start, 500);
}, 2000);

} // End of the definition of the exercise

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the third exercise on<br>"+
    "photon polarization.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
