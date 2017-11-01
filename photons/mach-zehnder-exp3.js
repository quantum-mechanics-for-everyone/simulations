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

Mach-Zehnder Interferometer: Third Exercise:
--------------------------------------------

This program uses the PHOTON engine to
render an exercise which demonstrates
the NMach-Zehnder interferometer. This
exercise shows how it is possible to
achieve interaction free measurement with
the setup.

Author: Dylan Cutler

*/

// Setting the PHOTON.experiment property to a function that starts
// the exercise.
PHOTON.experiment = function() {
  // Reference to the instance of the PHOTON app
  var app = PHOTON.instance;
  // If WebGL is supported, the experiment begins
  beginExperiment();
}

// This function is called when the app knows it can use WebGL
// This part of the program defines the actual exercise
function beginExperiment() {

//== EXPERIMENT SETUP ==//

// Reference to the instance of the application
var app = PHOTON.instance;

//-- Adding message box and buttons --//

// Refresh button
var btRefresh = new PHOTON.ButtonRefresh();
app.add(btRefresh, true);

// New window button
var btWindow = new PHOTON.ButtonWindow();
app.add(btWindow, true);

// Play button
var btPlay = new PHOTON.ButtonPlay(720, 600, 70, 50);
btPlay.disable();
app.add(btPlay, true);

// BACK button
var btBack = new PHOTON.ButtonBack(650, 670, 140, 50);
btBack.disable();
app.add(btBack, true);

// NEXT button
var btNext = new PHOTON.ButtonNext(810, 670, 140, 50);
btNext.disable();
app.add(btNext, true);

// Help button
var btHelp = new PHOTON.ButtonHelp(810, 600, 70, 50);
app.add(btHelp, true);

// Message box
var msg = new PHOTON.MessageBox(20, 570, 580, 210);
app.add(msg, true);

//-- Help Layer setup --//

PHOTON.helpLayerSetup = function() {
  var helpLayer = PHOTON.children['help-layer'];

  with(helpLayer) {
    // Rendering a clone of the help button
    renderHelpClone(810, 600, 70, 50);

    // Rendering arrows to point to various graphics elements
    addArrow(950, 140, 10);
    addArrow(800, 40, 80);
    addArrow(670, 570, 120);

    // Adding text which provides information about the components of the app
    addText(790, 150, 200, 'Press this button to restart the exercise from the beginning.');
    addText(630, 10, 150, 'Press this button to open the exercise in another browser window.');
    addText(700, 680, 200, 'Press these buttons when prompted to navigate through the exercise.');
    addText(250, 300, 200, 'Experimental window. This is where the main part of the simulation takes place.');
    addText(200, 620, 200, 'Instruction window. Provides information and directions for the simulation.');
    addText(510, 500, 200, 'Press this button when prompeted to start animations.');
  }
}

//-- Elements for the experiment --//

// Experiment window
var exp = new PHOTON.ExperimentBox(20, 70, 740, 480);
app.add(exp, true);

// Light paths
var lightPaths = [
  // Index 0: from source to beam splitter
  new PHOTON.LightPath(50, 380, 170, 380),
  // Index 1: through bottom beam splitter
  new PHOTON.LightPath(170, 380, 190, 390, true),
  // Index 2: From bottom beam splitter to bottom mirror
  new PHOTON.LightPath(190, 390, 550, 390),
  // Index 3: From bottom mirror to top beam splitter
  new PHOTON.LightPath(550, 390, 550, 190),
  // Index 4: from bottom beam splitter to top mirror
  new PHOTON.LightPath(170, 380, 170, 180),
  // Index 5: From top mirror to top beam splitter
  new PHOTON.LightPath(170, 180, 320, 180),
  // Index 6: Refracted through top beam splitter to dark detector
  new PHOTON.LightPath(550, 190, 540, 170, true),
  // Index 7: From top beam splitter to dark detector
  new PHOTON.LightPath(540, 170, 540, 50),
  // Index 8: From top beam splitter to bright detector
  new PHOTON.LightPath(550, 190, 670, 190)
];

// Labeling paths
exp.addLabel('Sample Path', 270, 125, true);
exp.addLabel('Reference Path', 270, 340, true);

// Photons

// Sample path
var photonS = new PHOTON.Photon(50, 380);
photonS.setPoyntingFromPath(0);

// Reference path
var photonR = new PHOTON.Photon(50, 380);
photonR.setPoyntingFromPath(0);


// Photon source
var source = new PHOTON.PhotonSource(50, 380);
exp.addLabel('Photon<br>Source', 30, 410);

// Beam splitters

// Lower beam splitter
var splitter1 = new PHOTON.BeamSplitter(170, 380);
splitter1.rotate(-45);
exp.addLabel('50-50 Beam<br>Splitter', 180, 410);

// Top beam splitter
var splitter2 = new PHOTON.BeamSplitter(550, 190);
splitter2.rotate(135);
exp.addLabel('50-50 Beam<br>Splitter', 450, 220);

// Mirrors

// Upper mirror
var mirror1 = new PHOTON.Mirror(170, 180);
mirror1.rotate(135);
exp.addLabel('Mirror', 110, 140);

// Bottom mirror
var mirror2 = new PHOTON.Mirror(550, 390);
mirror2.rotate(-45);
exp.addLabel('Mirror', 570, 400);

// Detectors

// Dark detector
var detectorD = new PHOTON.PhotonDetector(540, 50);
detectorD.rotate(-90);
exp.addLabel('Dark<br>Detector', 570, 30);

// Bright detector
var detectorB = new PHOTON.PhotonDetector(670, 190);
exp.addLabel('Bright<br>Detector', 650, 120);

// Sample path detector
var detectorS = new PHOTON.PhotonDetector(340, 180);

// Probability amplitude displays

// Reference path's arrow
var ampR = new PHOTON.AmplitudeBox(780, 320, 'Reference Path\'s Arrow');
ampR.hide();
app.add(ampR);

// Amplitde addition box
var addBox = new PHOTON.AmplitudeAdditionBox(250, 200);
addBox.hide();
app.add(addBox);

// Probability displays for detectors

// Dark detector
var probD = new PHOTON.ProbabilityDisplay(400, 90);
app.add(probD, true);

// Bright detector
var probB = new PHOTON.ProbabilityDisplay(620, 300);
app.add(probB, true);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to our first exploration of <i>PHOTON seeing in the dark</i> with an interferometer. "+
    "Press the cyan help button (question mark) for more information on how to use the application. "+
    "Press NEXT to continue.",
  'added-block':
    "As you can see in the window above, we have added another detector which "+
    "blocks light from traveling to the detectors on the Sample Path."+
    "<br><br>"+
    "Press NEXT to continue.",
  'send-along-sample-path':
    "Press the green play button to see what happens if light were to travel "+
    "along the Sample Path.",
  'sample-path-blocked':
    "If a photon goes down the Sample Path, it will be detected by the new detector "+
    "and will not make it to either the Bright Detector or the Dark Detector."+
    "<br><br>"+
    "Press BACK if you would like to see the animation again. Press NEXT to continue.",
  'examining-dark-detector':
    "Now we are going to be examining how blocking the Sample Path "+
    "affects the probability of detecting the photon at the Dark Detector."+
    "<br><br>"+
    "Recall that when there was nothing blocking the Sample Path, the probability "+
    "that the photon goes to the Dark Detector was 0%."+
    "<br><br>"+
    "Press NEXT to continue.",
  'intro-amp-window':
    "Since the photon can only take the Reference Path to the Dark Detector, we "+
    "only need to consider one arrow for one alternative way."+
    "<br><br>"+
    "Press NEXT to continue.",
  'send-reference-path':
    "Press the green play button to send a photon along the Reference Path to the "+
    "Dark Detector.",
  'reached-first-splitter':
    "The photon has reached the first 50-50 beam splitter. Press NEXT to continue.",
  'first-shrink-amp':
    "Since the photon is equally likely to travel along either path, we need to "+
    "shrink its arrow by a factor of 1/"+
    "&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'reached-mirror':
    "The photon has reached the mirror in the Reference Path. Press NEXT to continue.",
  'add-six-hours':
    "Since the photon needs to be reflected by glass in air in order to continue "+
    "to the Dark Detector, we need to add six hours to the photon's arrow.",
  'reached-second-splitter':
    "The photon has reached the second 50-50 beam splitter. Press NEXT to continue.",
  'second-shrink-amp':
    "Since the photon is equally likely to go to either Detector, we need to "+
    "shrink its arrow by a factor of 1/"+
    "&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'photon-detected':
    "The photon continues onto the Dark Detector."+
    "<br><br>"+
    "Since there is only one path the photon can take to the Dark Detector, the "+
    "probability of the photon reaching the Dark Detector is just the length of "+
    "that path's arrow squared. In this case, the photon has a 0.5<sup>2</sup>=25% "+
    "chance of reaching the Dark Detector."+
    "<br><br>"+
    "Press BACK if you would like to see the animation again. Press NEXT to continue.",
  'conclusion':
    "Before we added a detector in the Sample Path. There was a 0% chance the photon "+
    "would make it to the Dark Detector."+
    "<br><br>"+
    "That means if a photon is detected at the Dark Detector, we know one of the paths "+
    "must be blocked. Also the photon got detected at the Dark Detector, so we know it "+
    "did not interact with the detector in the Sample Path."+
    "<br><br>"+
    "This is an example of <i>interaction free measurement.</i> By detecting a photon "+
    "at the Dark Detector, we are effectively measuring the presence of a detector "+
    "in the Sample Path even though the photon never interacted with that detector."+
    "<br><br>"+
    "This method of interaction free measurement is only 25% efficient. We "+
    "will discuss more efficient ways to achieve interaction free measurement "+
    "later in the course. This concludes this tutorial."
} // End of text

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce exercise
tutorial.addStep(
  { // Welcome message
    blink: [{object: btHelp, hold: true}],
    msg: TEXT['welcome'],
    trigger: 'next'
  },
  { // Point out block
    blink: [{object: detectorS, hold: true}],
    msg: TEXT['added-block'],
    trigger: 'next'
  }
);

// Step 1: Send
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['send-along-sample-path'],
    blink: [{object: source, hold: true}],
    trigger: 'play'
  },
  { // Send photon to sample detector
    animation: function(callback) {
      function first() {
        source.emit();
        photonS.shoot(1.2, 120, second);
      }
      function second() {
        photonS.setPoyntingFromPath(4);
        photonS.shoot(2, 200, third);
      }
      function third() {
        photonS.setPoyntingFromPath(5);
        photonS.shoot(1.5, 150, fourth);
      }
      function fourth() {
        detectorS.detect();
        photonS.translate(-270, 200);
        photonS.setPoyntingFromPath(0);
        setTimeout(callback, 1000);
      }
      first();
    }
  }
);

// Step 2: Introducing arrow
tutorial.addStep(
  { // Explain result of animation
    back: function() {},
    msg: TEXT['sample-path-blocked'],
    trigger: 'next'
  },
  { // Explain we are examining dark detector
    msg: TEXT['examining-dark-detector'],
    blink: [
      {object: detectorD, hold: true},
      {object: probD, hold: true}
    ],
    trigger: 'next'
  },
  { // Introduce amplitude window
    animation: function(callback) {
      ampR.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      ampR.show(0);
    }
  },
  { // Introduce amplitude window
    msg: TEXT['intro-amp-window'],
    blink: [{object: ampR, hold: true}],
    trigger: 'next'
  }
);

// Step 3: Send photon to dark detector
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['send-reference-path'],
    blink: [{object: source, hold: true}],
    trigger: 'play'
  },
  { // Send photon to beam splitter
    animation: function(callback) {
      source.emit();
      ampR.animateRotation({
        time: 1.2,
        distance: 120
      });
      photonR.shoot(1.2, 120, callback);
    }
  },
  { // Explain reaching beam splitter
    msg: TEXT['reached-first-splitter'],
    trigger: 'next'
  },
  { // Shrink arrow
    animation: function(callback) {
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Point out shrink amplitude
    msg: TEXT['first-shrink-amp'],
    blink: [{object: ampR, hold: true}],
    trigger: 'next'
  },
  { // Send photon to mirror
    animation: function(callback) {
      photonR.setPoyntingFromPath(1);
      ampR.animateRotation({
        time: 0.25,
        distance: 25
      });
      photonR.shoot(0.25, lightPaths[1].length, second);
      function second() {
        photonR.setPoyntingFromPath(2);
        ampR.animateRotation({
          time: 3.6,
          distance: 360
        })
        photonR.shoot(3.6, 360, callback);
      }
    }
  },
  { // Explain reaching mirror
    msg: TEXT['reached-mirror'],
    trigger: 'next'
  },
  { // Add six hours to photon's arrow
    animation: function(callback) {
      ampR.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain arrow flip
    msg: TEXT['add-six-hours'],
    blink: [{object: ampR, hold: true}],
    trigger: 'next'
  },
  { // Send photon to second beam splitter
    animation: function(callback) {
      photonR.setPoyntingFromPath(3);
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonR.shoot(2, 200, callback);
    }
  },
  { // Explain reaching beam splitter
    msg: TEXT['reached-second-splitter'],
    trigger: 'next'
  },
  { // Shrink arrow
    animation: function(callback) {
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Point out shrink amplitude
    msg: TEXT['second-shrink-amp'],
    blink: [{object: ampR, hold: true}],
    trigger: 'next'
  },
  { // Send photon to the detector
    animation: function(callback) {
      photonR.setPoyntingFromPath(6);
      ampR.animateRotation({
        time: 0.25,
        distance: 25
      });
      photonR.shoot(0.25, lightPaths[6].length, second);
      function second() {
        photonR.setPoyntingFromPath(7);
        ampR.animateRotation({
          time: 1.2,
          distance: 120
        });
        photonR.shoot(1.2, 120, third);
      }
      function third() {
        detectorD.detect();
        probD.set(0.25);
        photonR.translate(-490, 330);
        photonR.setPoyntingFromPath(0);
        setTimeout(callback, 1000);
      }
    }
  }
);

// Step 4: Conclusion
tutorial.addStep(
  { // Explaining detection
    back: function() {
      ampR.setAmplitude(1);
      ampR.rotate(-ampR.theta);
      probD.reset();
    },
    msg: TEXT['photon-detected'],
    trigger: 'next'
  },
  { // Conclusion
    msg: TEXT['conclusion']
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
  PHOTON._INTRO_MESSAGE = "Welcome to an interaction-free<br>"+
    "measurement with the<br>"+
    "Mach-Zehnder inteferometer.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
