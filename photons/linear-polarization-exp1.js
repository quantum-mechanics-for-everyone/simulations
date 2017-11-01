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

Linear Polarization Experiment 1:
---------------------------------
Introduction to photon polarization

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
scene.placeCamera(-200, 50, 250, -200, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 2000,
  position: new THREE.Vector3(-100, 300, 50)
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
var polarizer = new PHOTON.Polarizer();
polarizer.translate(0, 300, 0);

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
		"Welcome to our first 3D interactive tutorial. This experiment demonstrates "+
    "how individual photons travel through a polarizer onto a screen. Press the cyan "+
    "help button on the right for information on how to use the simulation, press "+
    "NEXT to continue.",
  'introduce-photon-source':
    "In this experiment, we are going to be observing photons leaving a source "+
    "depicted above. Press NEXT to continue.",
  'introduce-screen':
    "The photon source emits photons onto the screen depicted above. Press NEXT "+
    "to continue.",
	'added-polarizer':
		"We have now added a polarizer in front of the photon source. This polarizer "+
    "will polarize a photon to 0&deg from the vertical, and is labeled following "+
    "this convention. Press the green play button to shoot the photon.",
	'random-polarization':
		"When the photon leaves the source, we do not know the photon's polarization. "+
    "The ring around the photon represents that the photon could have any possible "+
    "polarization when it leaves the photon source. Press NEXT to continue.",
	'know-polarization':
		"If the photon passes through the polarizer, we know that the photon "+
    "is polarized to 0&deg from the vertical. The photon graphic has changed "+
    "because now we know the photon's polarization. Press NEXT to continue.",
	'conclusion':
		"The photon reaches the screen. The probability displayed on the right is "+
    "the probability that a photon that passes through this first polarizer will "+
    "and reach the screen."+
    "<br><br>"+
    "If we shoot a large number of photons at the screen "+
    "through this setup, the screen illuminates. The brightness of the screen is "+
    "related directly to the probability that each individual photon will go through."+
    "<br><br>"+
    "This is the end of this tutorial, press BACK if you would like to "+
    "see how photons go through this setup again."
}

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: introduce exercise and the photon source
tutorial.addStep(
  { // Introduce exercise
    msg: TEXT['welcome'],
    blink: [
      {object: btHelp, hold: true}
    ],
    trigger: 'next'
  },
  { // Animate source into view
    animation: function(callback) {
      source.move(1, [0, -300, 0], function() {
        photon.translate(0, -300, 0);
        callback();
      })
    }
  },
  { // Rotate source continuously
    msg: TEXT['introduce-photon-source'],
    continuous: true,
    labels: [
      {object: source, dx: -100, dy: 160}
    ],
    animation: function(callback) {
      source.animateToAngle(4, 2*Math.PI, callback);
    },
    endAnimation: function(callback) {
      source.animateToAngle(0.5, 2*Math.PI + source.theta, callback);
    },
    trigger: 'next'
  }
);

// Step 1: Introduce polarizer
tutorial.addStep(
  { // Move camera
    // removeLabels: true,
    animation: function(callback) {
      scene.moveCamera(3, -130, 50, 300, -30, 0, 0, callback);
    }
  },
  { // Introducing the screen
    animation: function(callback) {
      screen.move(1, [0, -300, 0], function() {
        var path = new PHOTON.LightPath3D(-200, 0, -190, 0);
        callback();
      });
    }
  },
  { // Labeling screen and adding text
    animation: function(callback) {
      source.blink();
      lightPaths[0].animateLengthChange(0.25, 390, callback);
    }
  },
  { // Explain screen
    labels: [
      {object: screen, dx: -100, dy: 160}
    ],
    msg: TEXT['introduce-screen'],
    trigger: 'next'
  }
);

// Step 2: Introduce polarizer
tutorial.addStep(
  { // Moving the polarizer into view
    animation: function(callback) {
      polarizer.move(1, [0, -300, 0], callback);
    }
  }
)

// Step 3: Shoot photon into screen
tutorial.addStep(
  { // Explaining the polarizer
    labels: [
      {object: polarizer, dx: -90, dy: 175}
    ],
    msg: TEXT['added-polarizer'],
    trigger: 'play'
  },
  { // Shoot photon with random polarization and zoom in on photon
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(1.2, 120, function() {
        scene.moveCamera(3, -60, 50, 150, -60, 0, 0, callback);
      });
    }
  },
  { // Explain random polarization
    msg: TEXT['random-polarization'],
    trigger: 'next'
  },
  { // Zoom out then shoot the photon again through the polarizer then zoom in again
    animation: function(callback) {
      scene.moveCamera(3, 130, 50, 300, 30, 0, 0, function() {
        photon.shoot(0.8, 80, function() {
          photon.polarize(0);
          photon.shoot(0.8, 80, function() {
            scene.moveCamera(3, 60, 50, 150, 60, 0, 0, callback);
          })
        })
      });
    }
  },
  { // Explain the vertical polarization
    msg: TEXT['know-polarization'],
    trigger: 'next'
  },
  { // Shoot photon into the screen
    animation: function(callback) {
      scene.moveCamera(3, 0, 50, 250, 200, 0, 0, function() {
        photon.shoot(1.3, 130, function() {
          screen.illuminate(1);
          scene.moveCamera(3, 50, 50, 0, 200, 0, 0, callback)
        })
      });
    }
  }
);

// Step 4: Conclude the exercise and give users the opportunity to go back
tutorial.addStep(
  { // Final part
    msg: TEXT['conclusion'],
    back: function() {
      screen.reset()
      photon.translate(-410, 0, 0);
      photon.polarize('random');
      scene.placeCamera(-130, 50, 300, -30, 0, 0);
      source.addLabel(-100, 160);
      screen.addLabel(-100, 160);
    }
  }
);

// Starting the experiment
setTimeout(function(){
  PHOTON.children['loading'].$.fadeOut({ duration: 300 });
  setTimeout(tutorial.start, 500);
}, 2000);

} // End of the definition of the exercise

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the first exercise on<br>"+
    "photon polarization.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
