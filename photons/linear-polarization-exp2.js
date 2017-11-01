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

Linear Polarization Experiment 2:
---------------------------------
Mutliple polarizers

This program uses the PHOTON engine to
render an exercise which shows how photons
travel through multiple polarizers

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
scene.placeCamera(-200, 100, 350, -20, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 2000,
  position: new THREE.Vector3(-200, 300, 50)
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
source.translate(-200, 300, 0);

// Polarizer
var polarizers = [
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer()
]
polarizers[0].translate(-50, 300, 0);
polarizers[1].translate(50, 300, 0);
polarizers[1].orientToAngle(Math.PI/4);

// Screen
var screen = new PHOTON.Screen3D();
screen.putInXZPlane('-x');
screen.translate(200, 300, 0);

// LightPaths
var lightPaths = PHOTON.lightPaths;

// Photon
var photon = new PHOTON.Photon3D();
photon.setPoyntingVector(1, 0);
photon.polarize('random');
photon.translate(-200, 300, 0);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
	'welcome':
		"Welcome to the second 3D interactive tutorial. This experiment demonstrates "+
    "how individual photons pass through two polarizers onto a screen. Press the "+
    "cyan button for instructions on how to use the application. Press NEXT to continue.",
  'introduce-components':
    "We are going to start this exercise with the same components as the first exercise: "+
    "a photon source, a polarizer, and a screen for detecting the photons. "+
    "Press NEXT to continue.",
	'added-second-polarizer':
		"Now we have added a second polarizer to the setup. This polarizer's transmission "+
    "axis is aligned 45&deg from the vertical."+
    "<br><br>"+
    "Press the play button to see how this polarizer affects the probability of the "+
    "photon reaching the screen.",
  'random-polarization':
    "When the photon leaves the source, it has a random polarization. This is represented "+
    "above with a ring graphic. Press NEXT to continue.",
	'know-first-polarization':
		"If the photon travels through the first polarizer, we know that it is "+
    "polarized to 0&deg from the vertical. Press NEXT to continue.",
	'know-second-polarization':
		"If the photon travels through the second polarizer, we know that it is polarized "+
    "to 45&deg from the vertical. Press NEXT to continue.",
	'photon-hits-screen':
		"The photon continues to the screen. If the photon goes through both of the polarizers "+
    "to the screen, it would have had to change its polarization angle by 45&deg. "+
    "The probability that the photon reaches the screen is given by"+
    "<br><br>"+
    "cos<sup>2</sup>(&#916&#952) = cos<sup>2</sup>(45&deg- 0&deg) "+
    "= cos<sup>2</sup>(45&deg) = 50%"+
    "<br><br>"+
    "So if we shoot a large number of photons out of our source, the screen would "+
    "only be partially bright. Press NEXT to continue. Press BACK if you want to see "+
    "the animation again.",
	'rotated-polarizer':
		"Now we have rotated the second polarizer so that it polarizes photons "+
    "to 90&deg from the vertical. Press NEXT to continue.",
  'shoot-photon-again':
    "Press the green play button to send a from the source into the polarizers.",
	'conclusion':
		"The photon does not make it through the second polarizer. The probability "+
    "the photon makes it through the polarizers to the screen is 0%. This is "+
    "consistent with our rule. Since cos<sup>2</sup>(90&deg) = 0. So if we were "+
    "to shoot a large number of photons at the screen, it would not illuminate at all."+
    "<br><br>"+
    "This concludes this exercise. Press BACK if you want to see the animation again."
}

//== TUTORIAL SETUP ==//

var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce exercise with components from first experiment
tutorial.addStep(
  { // Introduce exercise
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Move components into view
    animation: function(callback) {
      source.move(1, [0, -300, 0], function() {
        photon.translate(0, -300, 0);
      });
      screen.move(1, [0, -300, 0]);
      polarizers[0].move(1, [0, -300, 0], function() {
        source.blink();
        var path = new PHOTON.LightPath3D(-200, 0, -190, 0);
        path.animateLengthChange(0.5, 390, callback);
      });
    },
    skip: function() {
      source.translate(0, -300, 0);
      photon.translate(0, -300, 0);
      screen.translate(0, -300, 0);
      polarizers[0].translate(0, -300, 0);
      var path = new PHOTON.LightPath3D(-200, 0, 200, 0);
    }
  },
  {
    labels: [
      {object: source, dx: -100, dy: 140},
      {object: polarizers[0], dx: -80, dy: 160},
      {object: screen, dx: -100, dy: 140}
    ],
    msg: TEXT['introduce-components'],
    trigger: 'next'
  }
);

// Step 1: Add second polarizer
tutorial.addStep(
  { // Animate second polarizer into view
    animation: function(callback) {
      polarizers[1].move(1, [0, -300, 0], callback)
    },
    skip: function() {
      polarizers[1].translate(0, -300, 0);
    }
  }
);

// Step 2: Shoot photon into two lenses
tutorial.addStep(
  { // Explaining second lens and prompting animation
    labels: [{object: polarizers[1], dx: -90, dy: 140}],
    msg: TEXT['added-second-polarizer'],
    trigger: 'play'
  },
  { // Shooting photon from the source
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(1, 100, function() {
        scene.moveCamera(3, -80, 50, 150, -100, 0, 0, callback);
      });
    }
  },
  { // Explaining random polarization
    msg: TEXT['random-polarization'],
    trigger: 'next'
  },
  { // Shooting photon through the first polarizer
    animation: function(callback) {
      scene.moveCamera(3, 0, 100, 300, -50, 0, 0, function() {
        photon.shoot(0.5, 50, function() {
          photon.polarize(0);
          photon.shoot(0.5, 50, function() {
            scene.moveCamera(3, 0, 50, 150, 0, 0, 0, callback);
          })
        })
      });
    }
  },
  { // Explaining vertical polarization
    msg: TEXT['know-first-polarization'],
    trigger: 'next'
  },
  { // Shooting photon through the second polarizer
    animation: function(callback) {
      scene.moveCamera(3, 150, 100, 250, 30, 0, 0, function() {
        photon.shoot(0.5, 50, function() {
          photon.polarize(Math.PI/4);
          photon.shoot(0.5, 50, function() {
            scene.moveCamera(3, 150, 50, 100, 100, 0, 0, callback)
          });
        });
      });
    }
  },
  { // Explaining 45 degree polarization
    msg: TEXT['know-second-polarization'],
    trigger: 'next'
  },
  { // Shooting photon into screen
    animation: function(callback) {
      scene.moveCamera(3, 0, 50, 250, 200, 0, 0, function() {
        photon.shoot(1.1, 110, function() {
          screen.illuminate(0.5);
          photon.translate(-410, 0, 0);
          photon.polarize('random');
          scene.moveCamera(3, 60, 50, 0, 200, 0, 0, callback);
        });
      });
    },
    skip: function() {
      screen.illuminate(0.5);
      scene.placeCamera(60, 50, 0, 200, 0, 0);
    }
  }
);

// Step 3: Explain probability and prepare next animation
tutorial.addStep(
  { // Explain probability
    back: function() {
      screen.reset();
      scene.placeCamera(-200, 100, 350, -20, 0, 0);
    },
    msg: TEXT['photon-hits-screen'],
    trigger: 'next'
  },
  { // Move polarizer into view
    animation: function(callback) {
      scene.moveCamera(3, 200, 100, 250, 20, 0, 0, function() {
        screen.reset();
        callback();
      });
    }
  },
  { // Rotate second polarizer to 90 deg
    labels: [
      {object: source, dx: -100, dy: 120},
      {object: polarizers[0], dx: -80, dy: 165},
      {object: polarizers[1], dx: -90, dy: 155},
      {object: screen, dx: -200, dy: 100}
    ],
    animation: function(callback) {
      polarizers[1].animateToAngle(3, Math.PI/2, function() {
        lightPaths[0].changeLength(-150);
        scene.addArrowLayer();
        scene.addArrow(560, 80, 225);
        callback();
      });
    },
    skip: function() {
      screen.reset();
      polarizers[1].orientToAngle(Math.PI/2);
      lightPaths[0].changeLength(-150);
    }
  },
  { // Explain polarizer rotation
    msg: TEXT['rotated-polarizer'],
    trigger: 'next'
  },
  { // Prepare for next animation
    removeLabels: true,
    animation: function(callback) {
      scene.removeArrows();
      setTimeout(function() {
        scene.moveCamera(3, -160, 100, 350, -20, 0, 0, callback);
      }, 500);
    },
    skip: function() {
      scene.placeCamera(-160, 100, 350, -20, 0, 0);
    }
  }
);

// Step 4: Shoot photon into perpendicular polarizers
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['shoot-photon-again'],
    trigger: 'play'
  },
  { // Shoot photon from source
    animation: function(callback) {
      source.blink();
      photon.shoot(3, 150, function() {
        photon.polarize(0);
        photon.shoot(2.2, 110, function() {
          screen.illuminate(0);
          photon.translate(-260, 0, 0);
          photon.polarize('random');
          scene.moveCamera(3, 60, 50, 0, 200, 0, 0, callback);
        })
      })
    }
  }
);

// Step 5: Conclude exercise
tutorial.addStep(
  {
    back: function() {
      screen.reset();
      scene.placeCamera(-160, 100, 350, -20, 0, 0);
    },
    msg: TEXT['conclusion']
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
  PHOTON._INTRO_MESSAGE = "Welcome to the second exercise on<br>"+
    "photon polarization.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
