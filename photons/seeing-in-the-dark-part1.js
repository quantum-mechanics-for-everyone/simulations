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

PHOTON Seeing In The Dark: Part 1
---------------------------------
Photon travels through setup without block

This program uses the PHOTON engine to
teach users how we can use photon polarization
to achieve interaction freee measurement.

This first part shows the photon travelling through
a Michelson interferometer with a polarizing beam splitter

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
scene.placeCamera(-300, 100, 250, -300, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 1000,
  position: new THREE.Vector3(-250, 300, 100)
});
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 1000,
  position: new THREE.Vector3(500, 300, -100)
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

// Polarization projection helper
var projHelper = new PHOTON.ProjectionHelper();
projHelper.hide();
app.add(projHelper);

// Polarization state indicator
var indicator = new PHOTON.PolarizationIndicator(80, 70);
indicator.hide();
app.add(indicator);

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
source.translate(-300, 300, 0);

// Polarizers
var polarizer = new PHOTON.Polarizer();
polarizer.orientToAngle(Math.PI/2);
polarizer.translate(-150, 1000, 0);

// Mirrors

// Switchable mirror
var sMirror = new PHOTON.Mirror3D();
sMirror.translate(0, 1000, 0);
sMirror.putInXZPlane('+x');

// Mirror for vertical part of the experiment
var vMirror = new PHOTON.Mirror3D();
vMirror.translate(350, 1000, -350);

// Mirror for horizontal part of the experiment
var hMirror = new PHOTON.Mirror3D();
hMirror.putInXZPlane('-x');
hMirror.translate(700, 1000, 0);

// Screens (second one instantiated later)
var screen = new PHOTON.Screen3D();
screen.putInXZPlane('+x');
screen.translate(-350, 1000, 0);

// LightPaths
var lightPaths = PHOTON.lightPaths;

// Photons (instantiated later)
var photon
,   photon2;

// Polarizing beam splitter
var splitter = new PHOTON.PolarizingBeamSplitter();
splitter.translate(350, 1000, 0);

// Polarization rotator
var rotator = new PHOTON.PolarizationRotator(7.5);
rotator.translate(152.5, 1000, 0);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the tutorial on PHOTON seeing in the dark. Press the cyan help "+
    "button for information about how to use the application. Press NEXT to continue.",
  'added-photon-source':
    "In this experiment, we will be looking at photons leaving the photon source "+
    "depicted above. Press NEXT to continue.",
  'added-splitter':
    "Now we have added a polarizing beam splitter to the experiment and two mirrors "+
    "that are an equal distance from the beam splitter. Press NEXT to continue.",
  'added-polarizer':
    "Now we have added a horizontal polarizer and a polarization rotator that rotates "+
    "the photon's polarization 7.5&deg."+
    "<br><br>"+
    "Press the green play button to send a photon into this setup.",
  'horizontally-polarized':
    "The photon leaves the source and travels through the polarizer. The photon exits "+
    "the polarizer with horizontal polarization (90&deg from vertical). Press NEXT "+
    "to continue.",
  'added-mirror':
    "As the photon goes forward, we add a final mirror behind the photon (there are "+
    "real setups which allow us to do this). Press NEXT to continue.",
  'rotated-to-82.5-deg':
    "After the photon passes through the polarization rotator, it is polarized to "+
    "82.5&deg from the vertical. Press NEXT to continue.",
  'photon-enters-beam-splitter':
    "The photon enters the polarizing beam splitter and can take two possible paths. "+
    "Press NEXT to determine the probability that the photon takes either path.",
  'introduce-projection-window':
    "First we will determine the probability that the photon gets transmitted through "+
    "the beam splitter and comes out with horizontal polarization."+
    "<br><br>"+
    "The window on the right will provide a visual aid for the process. Press NEXT "+
    "to continue.",
  'copy-polarization':
    "First, we copy the polarization state of the photon before it enters the "+
    "beam splitter. Press NEXT to continue.",
  'draw-h-line':
    "First we draw lines from the ends of the bar representing the photon's polarization "+
    "state to the horizontal axis. Press NEXT to continue.",
  'project-82.5-deg-to-horizontal':
    "The resulting horizontal bar represents the photon's "+
    "polarization state if it is transmitted through the polarizing beam splitter."+
    "<br><br>"+
    "The length of the bar represents the amplitude of the horizontal polarization "+
    "state, the probability the photon takes that path is 0.99<sup>2</sup> &#8776 98%. "+
    "Press NEXT to continue.",
  'project-75-deg-to-horizontal':
    "The resulting horizontal bar represents the photon's "+
    "polarization state if it is transmitted through the polarizing beam splitter."+
    "<br><br>"+
    "The length of the bar represents the amplitude of the horizontal polarization "+
    "state, the probability the photon takes that path is 0.97<sup>2</sup> &#8776 93%. "+
    "Press NEXT to continue.",
  'now-consider-vertical-path':
    "Now we are going to determine the probability that the photon gets reflected "+
    "by the polarizing beam splitter and exits with vertical polarization. Press "+
    "NEXT to continue.",
  'draw-v-line':
    "We draw lines from the ends of the bar representing the photon's polarization "+
    "state to the vertical axis. Press NEXT to continue.",
  'project-82.5-deg-to-vertical':
    "The resulting vertical bar represents the photon's "+
    "polarization state if it is reflected by the polarizing beam splitter."+
    "<br><br>"+
    "The length of the bar represents the amplitude of the vertical polarization "+
    "state, the probability the photon takes that path is 0.13<sup>2</sup> &#8776 2%. "+
    "Press NEXT to continue.",
  'project-75-deg-to-vertical':
    "The resulting vertical bar represents the photon's "+
    "polarization state if it is reflected by the polarizing beam splitter."+
    "<br><br>"+
    "The length of the bar represents the amplitude of the vertical polarization "+
    "state, the probability the photon takes that path is 0.26<sup>2</sup> &#8776 7%. "+
    "Press NEXT to continue.",
  'photon-recombines-prompt-window':
    "The photon travels along both legs of the interferometer and re-enters the beam "+
    "splitter. Press NEXT to determine the polarization of the photon after leaves "+
    "the beam splitter.",
  'recomined-states-to-82.5-deg':
    "Since these paths are indistinguishable to an observer (the legs of the interferometer "+
    "are the same length), we have to add the two states the photon would be in on either "+
    "path on the amplitude level."+
    "<br><br>"+
    "First we redraw the horizontal and vertical polarization states the photon would "+
    "be if it traveled on either leg of the interferometer that we determined earlier. "+
    "<br><br>"+
    "We then draw lines perpendicular to each bar. Next we draw the end points of "+
    "the bar which represents the combined polarization state at the point the "+
    "lines intersect."+
    "<br><br>"+
    "What we find is that the photon has the same polarization it had when it "+
    "first entered the beam splitter from the other side. We also find its amplitude "+
    "is 1 again, which means the photon will <i>always</i> recombine to its original "+
    "polarization state."+
    "<br><br>"+
    "Do you think the results would have been different if the photon had been "+
    "polarized to a different angle?"+
    "<br><br>"+
    "Press NEXT to continue.",
  'send-photon-through-again':
    "The photon passed through the polarization rotator once more and is now polarized "+
    "75&deg from the vertical. Press NEXT to send the photon through the interferometer "+
    "again.",
  'rotated-67.5-deg':
    "The photon was reflected by the mirror and the polarization rotator. When the photon "+
    "exits the rotator, it is polarized 67.5&deg from vertical. Press NEXT to continue.",
  'through-beam-splitter-again':
    "The photon enters the beam splitter again and can travel down either leg of the "+
    "interferometer. Press NEXT to continue.",
  'photon-recombines-67.5-deg':
    "Since the two legs of the interferometer are the same length, we do not know "+
    "which path the photon took. The photon re-entered the beam splitter and exits "+
    "polarized 67.5&deg from the vertical, just like it was before it entered. "+
    "Press NEXT to continue.",
  'polarized-60-deg':
    "The photon traveled through the polarization rotator and is now polarized 60&deg "+
    "from vertical. If you have not noticed yet, every time the photon travels through "+
    "the inteferometer, its polarization rotates 15&deg. The first time the photon went "+
    "through the interferometer, its polarization changed from 90&deg from vertical to "+
    "75&deg. The second time its polarization changed from 75&deg to 60&deg from vertical."+
    "<br><br>"+
    "Press BACK if you want to see how the photon passes through the interferometer "+
    "the second time again. Press NEXT to continue.",
  'intro-polarization-indicator':
    "Now we have added a window in the upper left to display the photon's polarization "+
    "state. Press the green play button to send the photon through the interferometer again.",
  'vertically-polarized':
    "Now the photon exited the polarization rotator vertically polarized."+
    "<br><br>"+
    "Press BACK if you would like to see how the photon's polarization changed from "+
    "60&deg from vertical to 0&deg from vertical. Press NEXT to continue.",
  'added-screen':
    "After the photon travels through the interferometer 6 times, we remove the mirror "+
    "we added earlier and the photon source. We put a screen where the photon source was "+
    "that will illuminate when photons hit it. Press NEXT to continue.",
  'photon-blocked':
    "Since the photon is polarized vertically, it will never make it through the polarizer "+
    "and the screen will not illuminate."+
    "<br><br>"+
    "This is the end of this exercise. Press BACK if you want to see the last animation again."
} // End of TEXT

//== TUTORIAL SETUP ==//

var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce initial components: source, mirrors on the legs of the
// interferometer, beam splitter, and rotator
var index = 0;
tutorial.addStep(
  { // Introduction
    msg: TEXT['welcome'],
    trigger: 'next',
    blink: [{object: btHelp, hold: true}]
  },
  { // Move source into view
    animation: function(callback) {
      source.move(2, [0, -300, 0], function() {
        photon = new PHOTON.Photon3D();
        photon.polarizeIndicator = false;
        photon.setPoyntingVector(1, 0);
        photon.polarize('random');
        photon.translate(-300, 0, 0);

        callback();
      });
    },
    skip: function() {
      photon = new PHOTON.Photon3D();
      photon.polarizeIndicator = false;
      photon.setPoyntingVector(1, 0);
      photon.polarize('random');
      photon.translate(-300, 0, 0);
      source.translate(0, -300, 0);
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
  { // Pan camera out and move mirrors and splitter into view
    removeLabels: true,
    animation: function(callback) {
      // Pan camera out
      scene.moveCamera(3, 200, 700, 200, 200, 0, -100, function() {
        // Move splitter and mirrors into view
        splitter.move(2, [0, -1000, 0]);
        vMirror.move(2, [0, -1000, 0]);
        hMirror.move(2, [0, -1000, 0], function() {
          // Animate light paths
          source.blink();
          var path = new PHOTON.LightPath3D(-300, 0, -290, 0);
          path.animateLengthChange(0.2, 290, function() {
            var path2 = new PHOTON.LightPath3D(0, 0, 10, 0);
            path2.animateLengthChange(0.2, 340, function() {
              var vPath = new PHOTON.LightPath3D(350, 0, 350, -10)
              ,   hPath = new PHOTON.LightPath3D(350, 0, 360, 0);
              vPath.animateLengthChange(0.2, 340);
              hPath.animateLengthChange(0.2, 340, callback);
            });
          });
        });
      });
    },
    skip: function() {
      scene.placeCamera(200, 700, 200, 200, 0, -100);
      splitter.translate(0, -1000, 0);
      vMirror.translate(0, -1000, 0);
      hMirror.translate(0, -1000, 0);
      var paths = [
        new PHOTON.LightPath3D(-300, 0, 0, 0),
        new PHOTON.LightPath3D(0, 0, 350, 0),
        new PHOTON.LightPath3D(350, 0, 350, -350),
        new PHOTON.LightPath3D(350, 0, 700, 0)
      ]
    }
  },
  { // Introduce splitter and mirrors
    msg: TEXT['added-splitter'],
    smallLabels: true,
    labels: [
      {object: source, dx: -100, dy: 100},
      {object: splitter, dx: -90, dy: 130},
      {object: vMirror, dx: -150, dy: 100},
      {object: hMirror, dx: -110, dy: 120}
    ],
    trigger: 'next'
  },
  { // Move polarizer and rotator into view
    animation: function(callback) {
      rotator.move(2, [0, -1000, 0]);
      polarizer.move(2, [0, -1000, 0], callback);
    },
    skip: function() {
      rotator.translate(0, -1000, 0);
      polarizer.translate(0, -1000, 0);
    }
  }
);

// Step 1: Shoot photon through interferometer the first time
tutorial.addStep(
  { // Introduce polarizer and polarization rotator then prompt animation
    msg: TEXT['added-polarizer'],
    smallLabels: true,
    labels: [
      {object: polarizer, dx: -90, dy: 125},
      {object: rotator, dx: -90, dy: 110}
    ],
    trigger: 'play'
  },
  { // Send photon through polarizer
    removeLabels: true,
    animation: function(callback) {
      // Zoom in on photon
      scene.moveCamera(3, -100, 100, 200, -150, 0, 0, function() {
        source.blink();
        photon.shoot(1.5, 150, function() {
          photon.polarize(Math.PI/2);
          photon.shoot(0.5, 50, callback);
        });
      });
    }
  },
  { // Point out polarization and prompt next part of the animation
    msg: TEXT['horizontally-polarized'],
    trigger: 'next'
  },
  { // Animate out photon and bring in the last mirror
    animation: function(callback) {
      scene.moveCamera(3, 200, 700, 200, 200, 0, -100, function() {
        photon.shoot(1.5, 150, function() {
          sMirror.move(2, [0, -1000, 0], function() {
            lightPaths[index].graphic.remove();
            callback();
          });
        });
      });
    },
    skip: function() {
      lightPaths[index].graphic.remove();
      sMirror.translate(0, -1000, 0);
    }
  },
  { // Introduce last mirror
    msg: TEXT['added-mirror'],
    trigger: 'next'
  },
  { // Send photon through polarization rotator
    animation: function(callback) {
      scene.moveCamera(3, 250, 100, 200, 150, 0, 0, function() {
        photon.shoot(0.95, 95, function() {
          photon.rotatePolarization(0.15, -Math.PI/24);
          photon.shoot(0.15, 15, function() {
            photon.shoot(0.4, 40, callback);
          })
        });
      });
    }
  },
  { // Explain polarization rotation
    msg: TEXT['rotated-to-82.5-deg'],
    trigger: 'next'
  },
  { // Send photon into polarizing beam splitter
    animation: function(callback) {
      scene.moveCamera(3, 300, 300, 200, 400, 0, 0, function() {
        photon.shoot(1.5, 150, function() {
          photon.polarize(Math.PI/2);
          photon.shoot(1, 100);

          if(photon2 === undefined) {
            photon2 = new PHOTON.Photon3D();
            photon2.polarizeIndicator = false;
            photon2.setPoyntingVector(0, -1);
            photon2.polarize(0);
            photon2.translate(350, 0, 0);
          }
          else photon2.translate(0, -1000, 0);
          photon2.shoot(1, 100, callback);
        });
      });
    },
    skip: function() {
      photon2 = new PHOTON.Photon3D();
      photon2.polarizeIndicator = false;
      photon2.setPoyntingVector(0, -1);
      photon2.polarize(0);
      photon2.translate(350, 1000, 0);
    }
  },
  { // Mention photon entering beam splitter and prompt explanation
    msg: TEXT['photon-enters-beam-splitter'],
    trigger: 'next'
  },
  { // Show polarization window
    animation: function(callback) {
      projHelper.hidePolarization();
      setTimeout(function() { projHelper.show(500); }, 200);

      scene.addArrowLayer();
      scene.addArrow(360, 110, 135);

      setTimeout(callback, 800);
    }
  },
  { // Introduce projection window and prompt first animation for horizontal polarization
    msg: TEXT['introduce-projection-window'],
    trigger: 'next',
    blink: [{object: projHelper, hold: true}]
  },
  { // Do horizontal projection
    animation: function(callback) {
      projHelper.polarize(11 * Math.PI / 24);
      projHelper.showPolarization();
      setTimeout(callback, 700);
    }
  },
  { // Explain copying polarization
    msg: TEXT['copy-polarization'],
    blink: [{object: projHelper, hold: true}],
    trigger: 'next'
  },
  { // Project horizontal polarization state
    animation: function(callback) {
      projHelper.drawLines('v', false, function() {
        projHelper.showBar('h');
        setTimeout(callback, 1000);
      });
    }
  },
  { // Explain horizontal projection
    msg: TEXT['draw-h-line'],
    trigger: 'next',
  },
  {
    animation: function(callback) {
      projHelper.hideLines('v');
      projHelper.changePolarization('h');
      setTimeout(callback, 1000);
    }
  },
  { // Explain first projection
    msg: TEXT['project-82.5-deg-to-horizontal'],
    blink: [{object: projHelper, hold: true}],
    trigger: 'next'
  },
  { // Reset polarization window
    animation: function(callback) {
      projHelper.reset();

      scene.removeArrows();
      scene.addArrow(170, 60, 135);

      setTimeout(callback, 600);
    }
  },
  { // Showing probability for vertical polarization
    msg: TEXT['now-consider-vertical-path'],
    trigger: 'next'
  },
  { // Copy polarization
    animation: function(callback) {
      projHelper.showPolarization();
      setTimeout(callback, 700);
    }
  },
  { // Explain copying polarization
    msg: TEXT['copy-polarization'],
    blink: [{object: projHelper, hold: true}],
    trigger: 'next'
  },
  { // Project vertical polarization state
    animation: function(callback) {
      projHelper.drawLines('h', false, function() {
        projHelper.showBar('v');
        setTimeout(callback, 1000);
      });
    }
  },
  { // Explain vertical bar
    msg: TEXT['draw-v-line'],
    trigger: 'next'
  },
  {
    animation: function(callback) {
      projHelper.hideLines('h');
      projHelper.changePolarization('v');
      setTimeout(callback, 1000);
    }
  },
  { // Explain vertical projection
    msg: TEXT['project-82.5-deg-to-vertical'],
    trigger: 'next',
    blink: [{object: projHelper, hold: true}]
  },
  { // Animate photons re-entering beam splitter
    animation: function(callback) {
      projHelper.hide(true);
      setTimeout(function() {
        projHelper.reset();
      }, 600);

      scene.removeArrows();
      scene.moveCamera(3, 200, 700, 200, 200, 0, -100, function() {
        photon.shoot(2.5, 250);
        photon2.shoot(2.5, 250, function() {
          photon.setPoyntingVector(-1, 0);
          photon.shoot(3.5, 350);

          photon2.setPoyntingVector(0, 1);
          photon2.shoot(3.5, 350, function() {
            photon2.translate(0, 1000, 0);

            photon.polarize(11 * Math.PI / 24);
            photon.shoot(1, 100, function() {
              scene.moveCamera(3, 200, 150, 200, 250, 0, 0, callback);
            });
          });
        });
      });
    }
  },
  { // Explain photon recombines and prompt determining polarization
    msg: TEXT['photon-recombines-prompt-window'],
    trigger: 'next'
  },
  { // Show polarization window
    animation: function(callback) {
      // Show window
      projHelper.show(400);
      // Show component graphics
      setTimeout(function() {
        projHelper.showBar('h');
        setTimeout(function() {
          projHelper.showBar('v');
        }, 400);
      }, 1000);
      // Draw lines
      setTimeout(function() {
        projHelper.drawLines('v', true, function() {
          projHelper.drawLines('h', true, function() {
            projHelper.showPolarization();
            setTimeout(callback, 1000);
          });
        });
      }, 2000)
    }
  },
  { // Explain polarization animation
    msg: TEXT['recomined-states-to-82.5-deg'],
    trigger: 'next',
    blink: [{object: projHelper, hold: true}]
  },
  { // Animate photon through the rotator again
    animation: function(callback) {
      // Hiding projection window
      projHelper.hide(true);
      setTimeout(function() { projHelper.reset(); }, 500);

      scene.moveCamera(3, 200, 150, 250, 150, 0, 0, function() {
        photon.shoot(0.9, 90, function() {
          photon.rotatePolarization(0.15, -Math.PI/24);
          photon.shoot(0.15, 15, function() {
            photon.shoot(0.55, 55, callback);
          });
        });
      });
    },
    skip: function() {
      scene.placeCamera(200, 150, 250, 150, 0, 0);
      photon.translate(390, 0, 0);
      photon.setPoyntingVector(-1, 0);
      photon.polarize(5 * Math.PI / 12);
    }
  }
);

// Step 2: Send photon through the interferometer again
tutorial.addStep(
  { // Allow option to go back, prompt next part of the animation
    back: function() {
      photon.translate(-390, 0, 0);
      photon.polarize('random');
      photon.setPoyntingVector(1, 0);

      photon2.setPoyntingVector(0, -1);

      scene.placeCamera(200, 700, 200, 200, 0, -100);

      PHOTON._SMALL_LABELS = true;
      source.addLabel(-100, 100);
      splitter.addLabel(-90, 130);
      vMirror.addLabel(-150, 100);
      hMirror.addLabel(-110, 120);

      sMirror.translate(0, 1000, 0);

      var path = new PHOTON.LightPath3D(-300, 0, 0, 0);
      index = lightPaths.indexOf(path);
    },
    msg: TEXT['send-photon-through-again'],
    trigger: 'next'
  },
  { // Animate photon through rotator again
    animation: function(callback) {
      scene.moveCamera(3, 400, 150, 200, 250, 0, 0, function() {
        photon.shoot(0.9, 90, function() {
          photon.setPoyntingVector(1, 0);
          photon.shoot(1.4, 145, function() {
            photon.rotatePolarization(0.15, -Math.PI/24);
            photon.shoot(0.15, 15, function() {
              photon.shoot(0.4, 40, callback);
            });
          });
        });
      });
    }
  },
  { // Explain further rotation
    msg: TEXT['rotated-67.5-deg'],
    trigger: 'next'
  },
  { // Send photon into beam splitter again
    animation: function(callback) {
      scene.moveCamera(3, 450, 250, 300, 450, 0, -100, function() {
        photon.shoot(1.5, 150, function() {
          photon2.translate(0, -1000, 0);
          photon2.setPoyntingVector(0, -1);
          photon2.shoot(2, 200);

          photon.polarize(Math.PI/2);
          photon.shoot(2, 200, callback);
        })
      });
    }
  },
  { // Went through beam splitter again
    msg: TEXT['through-beam-splitter-again'],
    trigger: 'next'
  },
  { // Send photons into mirrors then back into beam splitter
    animation: function(callback) {
      photon.shoot(1.5, 145);
      photon2.shoot(1.5, 145, function() {
        photon.setPoyntingVector(-1, 0);
        photon.shoot(3.5, 345);

        photon2.setPoyntingVector(0, 1);
        photon2.shoot(3.5, 345, function() {
          photon2.translate(0, 1000, 0);
          photon2.setPoyntingVector(0, -1);

          photon.polarize(9 * Math.PI / 24);
          photon.shoot(1, 100, function() {
            scene.moveCamera(3, 350, 100, 150, 250, 0, 0, callback);
          });
        });
      });
    }
  },
  { // Photon exits splitter again
    msg: TEXT['photon-recombines-67.5-deg'],
    trigger: 'next'
  },
  { // Send photon through rotator again
    animation: function(callback) {
      PHOTON._DEVELOPER_MODE = false;
      scene.moveCamera(3, 50, 100, 250, 200, 0, 0, function() {
        photon.shoot(0.9, 90, function() {
          photon.polarizeIndicator = true;
          photon.rotatePolarization(0.15, -Math.PI/24);
          photon.shoot(0.15, 15, function() {
            photon.shoot(0.55, 55, callback);
          });
        });
      });
    },
    skip: function() {
      scene.placeCamera(50, 100, 250, 200, 0, 0);
      photon.polarizeIndicator = true;
      photon.polarize(Math.PI / 3);
    }
  }
);

// Step 3: Send photon through the interferometer 4 times with polarization display
tutorial.addStep(
  { // Explain photon is polarized to 60 deg from vertical
    back: function() {
      photon.polarizeIndicator = false;
      scene.placeCamera(200, 150, 250, 150, 0, 0);
      photon.polarize(5 * Math.PI / 12);
    },
    msg: TEXT['polarized-60-deg'],
    trigger: 'next'
  },
  { // Pan camera out
    animation: function(callback) {
      scene.moveCamera(3, 200, 700, 200, 200, 0, -100, function() {
        indicator.show(400);
        setTimeout(callback, 1000);
      });
    }
  },
  { // Introduce indicator
    blink: [{object: indicator, hold: true}],
    msg: TEXT['intro-polarization-indicator'],
    trigger: 'play'
  },
  { // Animate photon through interferometer multiple times
    animation: function(callback) {
      // Count of how many times the photon has gone through the polarizer
      var count = 0;

      function sendPhotonThrough() {
        // Disabling play button and resetting message box
        btPlay.offPress();
        if(btPlay.blinkHold) btPlay.blinkOff();
        btPlay.disable();
        msg.setMessage('');

        // Animate photon through setup
        photon.shoot(0.9, 90, function() {
          photon.setPoyntingVector(1, 0);
          photon.shoot(1.4, 145, function() {
            photon.rotatePolarization(0.15, -Math.PI/24);
            photon.shoot(0.15, 15, function() {
              photon.shoot(1.9, 190, function() {
                photon.polarizeIndicator = false;
                indicator.showComponents();
                indicator.hidePolarization();

                photon.polarize(Math.PI/2);
                photon.shoot(3.5, 350);

                photon2.translate(0, -1000, 0);
                photon2.shoot(3.5, 350, function() {
                  photon.setPoyntingVector(-1, 0);
                  photon.shoot(3.5, 350);

                  photon2.setPoyntingVector(0, 1);
                  photon2.shoot(3.5, 350, function() {
                    indicator.hideComponents();
                    indicator.showPolarization();

                    photon2.translate(0, 1000, 0);
                    photon2.setPoyntingVector(0, -1);

                    photon.polarize(7*Math.PI/24 - (count * Math.PI/12));
                    photon.shoot(1.9, 190, function() {
                      photon.polarizeIndicator = true;
                      photon.rotatePolarization(0.15, -Math.PI/24);
                      photon.shoot(0.15, 15, function() {
                        photon.shoot(0.55, 55, prepareForNextRun);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }

      function prepareForNextRun() {
        count++;
        if(count < 4) {
          msg.setMessage(
            "Now the photon is polarized to "+ (60 - 15*count) +"&deg from "+
            "vertical. Press the green play button to send the photon through "+
            "the interferometer again."
          );
          btPlay.enable();
          btPlay.onPress(sendPhotonThrough);
          btPlay.blink(true);
        }
        else scene.moveCamera(3, 90, 50, 150, 90, 0, 0, callback);
      }

      sendPhotonThrough();
    },
    skip: function() {
      photon.polarize(0);
      indicator.show(0);
      scene.placeCamera(90, 50, 150, 90, 0, 0);
    }
  }
);

// Step 4: Sending photon to the screen the first time
tutorial.addStep(
  { // Point out vertical polarization
    back: function() {
      indicator.hide();
      indicator.blinkOff();

      photon.polarize(Math.PI/3);
    },
    msg: TEXT['vertically-polarized'],
    blink: [{object: indicator, hold: true}],
    trigger: 'next'
  },
  { // Pan camera out and remove mirror/photon source
    animation: function(callback) {
      indicator.hide(true);
      photon.polarizeIndicator = false;

      scene.moveCamera(3, 200, 700, 200, 200, 0, -100, function() {
        var path = new PHOTON.LightPath3D(0, 0, -150, 0);

        sMirror.move(2, [0, 1000, 0]);
        source.move(2, [0, 1000, 0], function() {
          screen.move(2, [0, -1000, 0], callback);
        });
      });
    }
  },
  { // Explain new screen
    smallLabels: true,
    labels: [{object: screen, dx: -80, dy: 120}],
    msg: TEXT['added-screen'],
    trigger: 'next'
  },
  { // Send photon into polarizer
    removeLabels: true,
    animation: function(callback) {
      PHOTON._DEVELOPER_MODE = false;
      setTimeout(function() { photon.shoot(1.5, 150); }, 1000);
      scene.moveCamera(3, 50, 150, 200, -150, 0, 0, function() {
        photon.shoot(1, 100, function() {
          photon.translate(-140, 1000, 0);
          screen.illuminate(0);
          callback();
        });
      });
    },
    skip: function() {
      photon.translate(-390, 1000, 0);
      photon.polarizeIndicator = false;
      screen.translate(0, -1000, 0);
      screen.illuminate(0);
      source.translate(0, 1000, 0);
      sMirror.translate(0, 1000, 0);
      var path = new PHOTON.LightPath3D(0, 0, -150, 0);
      scene.placeCamera(50, 150, 200, -150, 0, 0);
      indicator.hide();
    }
  }
);

// Step 5: End of first part
tutorial.addStep(
  { // Explain photon is blocked by polarizer
    back: function() {
      screen.reset();
      screen.translate(0, 1000, 0);
      source.translate(0, -1000, 0);
      sMirror.translate(0, -1000, 0);
      lightPaths[lightPaths.length - 1].graphic.remove();
      photon.translate(390, -1000, 0);
      lightPaths.pop();
      scene.placeCamera(90, 50, 150, 90, 0, 0);
    },
    msg: TEXT['photon-blocked']
  }
);

// Starting the experiment
setTimeout(function(){
  PHOTON.children['loading'].$.fadeOut({ duration: 300 });
  setTimeout(tutorial.start, 500);
}, 2000);

} // End of the definition of the exercise

// PHOTON._DEVELOPER_MODE = true;
// PHOTON._DEVELOPER_MODE = false;
// scene.placeCamera(200, 700, 200, 200, 0, -100);

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the first exercise on<br>"+
    "PHOTON seeing in the dark.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
