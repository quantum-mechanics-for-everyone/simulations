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

Mach-Zehnder Interferometer: First Exercise:
--------------------------------------------

This program uses the PHOTON engine to
render an exercise which demonstrates
the NMach-Zehnder interferometer

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
    addText(510, 500, 200, 'Press this button when prompted to start animations.');
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
  new PHOTON.LightPath(170, 180, 530, 180),
  // Index 6: Refracted part of sample path through the top beam splitter
  new PHOTON.LightPath(530, 180, 550, 190, true),
  // Index 7: Refracted through top beam splitter to dark detector
  new PHOTON.LightPath(550, 190, 540, 170, true),
  // Index 8: From top beam splitter to dark detector
  new PHOTON.LightPath(540, 170, 540, 50),
  // Index 9: From top beam splitter to bright detector
  new PHOTON.LightPath(550, 190, 670, 190)
];

// Labeling paths
exp.addLabel('Sample Path', 270, 125, true);
exp.addLabel('Reference Path', 270, 340, true);

// Photons

// Sample path
var photonS = new PHOTON.Photon(50, 380);

// Reference path
var photonR = new PHOTON.Photon(170, 380);
photonR.graphic.hide();


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

// Probability amplitude displays

// Sample path's arrow
var ampS = new PHOTON.AmplitudeBox(780, 70, 'Sample Path\'s Arrow');
ampS.hide();
app.add(ampS);

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
probD.hide();
app.add(probD);

// Bright detector
var probB = new PHOTON.ProbabilityDisplay(620, 300);
probB.hide();
app.add(probB);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Th experiment window above shows the setup for a Mach-Zehnder inteferometer. "+
    "Press the cyan help button (question mark) for more information on how to use the "+
    "application. Otherwise, press NEXT to continue.",
  'intro-source-and-detectors':
    "In this experiment, we are going to be examining a photon source "+
    "sending a photon to two detectors, the Dark Detector and the Bright "+
    "Detector. The windows next to them display the probability a photon "+
    "leaves the source and reaches the respective detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'send-to-dark-fist':
    "First we are going to look at the probability that the photon goes "+
    "to the Dark Detector. Press NEXT to continue.",
  'point-out-sample':
    "There are two possible paths a photon can take to the Dark Detector. "+
    "The first path the photon can take is highlighted above. "+
    "We will call this path the Sample Path."+
    "<br><br>"+
    "Press NEXT to continue.",
  'point-out-reference':
    "The other path the photon can take to the Dark Detector is now highlighted "+
    "above. We will call this path the Reference Path."+
    "<br><br>"+
    "Press NEXT to continue.",
  'intro-amp-boxes':
    "Since there are two paths the photon can take and an observer cannot tell which "+
    "path the photon takes, we need to determine the arrow for each of these alternative ways, add them, and then square"+
    " to determine the probability the photon goes to the Dark Detector. "+
    "<br><br>"+
    "Press NEXT to continue.",
  'intro-amp-boxes-bright':
    "Since there are two paths the photon can take and an observer cannot tell which "+
    "path the photon takes, we need to determine the arrow for each alternative way, add them, and then square "+
    " to determine the probability the photon goes to the Bright Detector."+
    "<br><br>"+
    "Press NEXT to continue",
  'shoot-to-dark':
    "Press the green play button to send a photon to the Dark Detector and "+
    "determine the probability that the photon reaches that detector.",
  'shoot-to-bright':
    "Press the green play button to send a photon to the Bright Detector and "+
    "determine the probability that the photon reaches that detector.",
  'photon-reaches-splitter':
    "Now the photon has reached the first 50-50 beam splitter. Press NEXT to continue.",
  'first-shrink-amp':
    "Since the photon is equally likely to take either path, we need to shrink "+
    "both arrows by a factor of 1/&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'first-sample-reflection':
    "If the photon takes the Sample Path, it will be reflected by glass in air. "+
    "So we need to add six hours to that path's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'sample-reaches-mirror':
    "If the photon takes the Sample Path, it will have reached a mirror. "+
    "Press NEXT to continue.",
  'second-sample-reflection':
    "If the photon takes the Sample Path, it will be reflected by the mirror. "+
    "So we need to add six hours to that path's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'reference-reaches-mirror':
    "If the photon takes the Reference Path, it will have reached a mirror. "+
    "Press NEXT to continue.",
  'first-reference-reflection':
    "If the photon takes the Reference Path, it will be reflected by the mirror. "+
    "So we need to add six hours to that path's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'photons-join':
    "In this experiment, it takes a photon the same amount of time to travel "+
    "on the Sample Path and Reference Path to the second 50-50 beam splitter. "+
    "Press NEXT to continue.",
  'second-shrink-amp':
    "Since the photon is equally likely to be reflected or transmitted by the "+
    "beam splitter, we need to shrink both arrows by a factor of "+
    "1/&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'second-reference-reflection':
    "If the photon traveled on the reference path, it would need to be reflected "+
    "by the beam splitter to reach the Bright Detector."+
    "<br><br>"+
    "Since the photon was reflected by glass in air, we need to add six hours to "+
    "that path's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'reached-dark-detector':
    "Now the photon has reached the Dark Detector. Press BACK to see the animation "+
    "again. Press NEXT to continue.",
  'reached-bright-detector':
    "Now the photon has reached the Bright Detector. Press BACK to see the animation "+
    "again. Press NEXT to continue.",
  'add-amplitudes-dark':
    "Now we are going to add the arrows from the windows on the right to determine "+
    "the probability that the photon goes to the Dark Detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'add-amplitudes-bright':
    "Now we are going to add the arrows from the windows on the right to determine "+
    "the probability that the photon goes to the Bright Detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'add-to-zero':
    "Since the arrows face opposite directions, they add to zero. So there "+
    "is a 0% chance the photon reaches the Dark Detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'add-to-one':
    "Since the arrows face the same direction, they add to one. So there is "+
    "100% chance the photon reaches the Bright Detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'send-to-bright':
    "Now we are going to determine the probability the photon goes to the Bright "+
    "Detector. Press NEXT to continue.",
  'conclusion':
    "As you can see, there is a 0% chance the photon will go to the Dark Detector "+
    "and a 100% chance the photon will go to the Bright Detector. So therefore "+
    "the photon will <i>always</i> go to the Bright Detector with the current "+
    "experimental setup."+
    " This is why the detectors are given the names they have."+
    "<br><br>"+
    "This is the end of the tutorial. Continue with the rest of the module."
} // End of text

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce exercise
tutorial.addStep(
  { // Welcome and introduce help button
    blink: [{object: btHelp, hold: true}],
    msg: TEXT['welcome'],
    trigger: 'next'
  },
  { // Add probability displays
    animation: function(callback) {
      probB.show(500);
      probD.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      probB.show(0);
      probD.show(0);
    }
  },
  { // Introduce sources and detectors
    blink: [
      {object: source, hold: true},
      {object: detectorD, hold: true},
      {object: detectorB, hold: true},
      {object: probD, hold: true},
      {object: probB, hold: true}
    ],
    msg: TEXT['intro-source-and-detectors'],
    trigger: 'next'
  }
);

// Step 1: Introduce paths and prompt to go to dark detector
tutorial.addStep(
  { // Show users we are considering dark detector first
    blink: [{object: detectorD, hold: true}],
    msg: TEXT['send-to-dark-fist'],
    trigger: 'next'
  },
  { // Point out sample paths
    blink: [
      {object: lightPaths[0], hold: true},
      {object: lightPaths[4], hold: true},
      {object: lightPaths[5], hold: true},
      {object: lightPaths[6], hold: true},
      {object: lightPaths[7], hold: true},
      {object: lightPaths[8], hold: true}
    ],
    msg: TEXT['point-out-sample'],
    trigger: 'next'
  },
  { // Point out reference path
    blink: [
      {object: lightPaths[0], hold: true},
      {object: lightPaths[1], hold: true},
      {object: lightPaths[2], hold: true},
      {object: lightPaths[3], hold: true},
      {object: lightPaths[7], hold: true},
      {object: lightPaths[8], hold: true}
    ],
    msg: TEXT['point-out-reference'],
    trigger: 'next'
  },
  { // Fade in amplitude windows
    animation: function(callback) {
      ampS.show(500);
      ampR.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      ampS.show(0);
      ampR.show(0);
    }
  },
  { // Introduce amplitude displays
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['intro-amp-boxes'],
    trigger: 'next'
  }
);

// Step 2: Send photon to dark detector
tutorial.addStep(
  { // Prompt animation
    blink: [{object: source, hold: true}],
    msg: TEXT['shoot-to-dark'],
    trigger: 'play'
  },
  { // Send photon to beam splitter
    animation: function(callback) {
      source.emit();
      ampS.animateRotation({
        time: 1.2,
        distance: 120
      });
      ampR.animateRotation({
        time: 1.2,
        distance: 120
      });
      photonS.shoot(1.2, 120, callback);
    }
  },
  { // Explain photon reaches beam splitter
    msg: TEXT['photon-reaches-splitter'],
    trigger: 'next'
  },
  { // Shrink amplitude
    animation: function(callback) {
      ampS.shrinkAmplitude();
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain shrinking amplitude
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['first-shrink-amp'],
    trigger: 'next'
  },
  { // Flip sample path arrow
    animation: function(callback) {
      ampR.removeShadow();
      ampS.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain reflection
    blink: [{object: ampS, hold: true}],
    msg: TEXT['first-sample-reflection'],
    trigger: 'next'
  },
  { // Send photons along until sample path reaches mirror
    animation: function(callback) {
      photonR.graphic.show();
      photonR.setPoyntingFromPath(1);
      photonS.setPoyntingFromPath(4);
      ampS.animateRotation({
        time: 2,
        distance: 200
      });
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonS.shoot(2, 200);
      photonR.shoot(0.25, lightPaths[1].length, function() {
        photonR.setPoyntingFromPath(2);
        photonR.shoot(1.75, 175, callback);
      });
    }
  },
  { // Sample path reaches mirror
    msg: TEXT['sample-reaches-mirror'],
    trigger: 'next'
  },
  { // Flip sample arrow
    animation: function(callback) {
      ampS.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain reflection
    blink: [{object: ampS, hold: true}],
    msg: TEXT['second-sample-reflection'],
    trigger: 'next'
  },
  { // Send photons until reference path reaches mirror
    animation: function(callback) {
      photonS.setPoyntingFromPath(5);
      ampS.animateRotation({
        time: 1.85,
        distance: 185
      });
      ampR.animateRotation({
        time: 1.85,
        distance: 185
      });
      photonS.shoot(1.85, 185);
      photonR.shoot(1.85, 185, callback);
    }
  },
  { // Explain reaching mirror
    msg: TEXT['reference-reaches-mirror'],
    trigger: 'next'
  },
  { // Flip reference path arrow
    animation: function(callback) {
      ampR.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain reflection
    blink: [{object: ampR, hold: true}],
    msg: TEXT['first-reference-reflection'],
    trigger: 'next'
  },
  { // Send photons to second beam splitter
    animation: function(callback) {
      photonR.setPoyntingFromPath(3);
      ampS.animateRotation({
        time: 2,
        distance: 200
      });
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonR.shoot(2, 200);
      photonS.shoot(1.75, 175, function() {
        photonS.setPoyntingFromPath(6);
        photonS.shoot(0.25, lightPaths[6].length, function() {
          photonR.translate(-380, 190);
          photonR.graphic.hide();
          callback();
        });
      })
    }
  },
  { // Explain photons rejoining
    msg: TEXT['photons-join'],
    trigger: 'next'
  },
  { // Shrink arrows again
    animation: function(callback) {
      ampS.shrinkAmplitude();
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain arrow shrink
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['second-shrink-amp'],
    trigger: 'next'
  },
  { // Send photon to dark detector
    animation: function(callback) {
      photonS.setPoyntingFromPath(7);
      ampS.animateRotation({
        time: 1.45,
        distance: 145
      });
      ampR.animateRotation({
        time: 1.45,
        distance: 145
      });
      photonS.shoot(0.25, lightPaths[7].length, function() {
        photonS.setPoyntingFromPath(8);
        photonS.shoot(1.2, 120, function() {
          detectorD.detect();
          photonS.translate(-490, 330);
          photonS.setPoyntingFromPath(0);
          setTimeout(callback, 1000);
        });
      });
    },
    skip: function() {
      ampS.setAmplitude(0.5);
      ampS.rotate(285);
      ampR.setAmplitude(0.5);
      ampR.rotate(105);
    }
  }
);

// Step 3: Add arrows for dark detector
tutorial.addStep(
  { // Give option to go back
    back: function() {
      ampS.setAmplitude(1);
      ampS.rotate(-ampS.theta);
      ampR.setAmplitude(1);
      ampR.rotate(-ampR.theta);
    },
    msg: TEXT['reached-dark-detector'],
    trigger: 'next'
  },
  { // Show amplitude addition window
    animation: function(callback) {
      addBox.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Introduce amplitude box
    blink: [{object: addBox, hold: true}],
    msg: TEXT['add-amplitudes-dark'],
    trigger: 'next'
  },
  { // Add amplitudes
    animation: function(callback) {
      addBox.addAmplitudes(ampS, ampR, function() {
        probD.set(0);
        callback();
      });
    }
  },
  { // Explain amplitude addition
    blink: [
      {object: addBox, hold: true},
      {object: probD, hold: true}
    ],
    msg: TEXT['add-to-zero'],
    trigger: 'next'
  },
  { // Hide amplitude windows and move on
    animation: function(callback) {
      ampS.hide(true);
      ampR.hide(true);
      addBox.hide(true);
      setTimeout(function() {
        addBox.reset();
        ampS.setAmplitude(1);
        ampR.setAmplitude(1);
        ampS.rotate(-ampS.theta);
        ampR.rotate(-ampR.theta);
        callback();
      }, 1000);
    },
    skip: function() {
      ampS.hide();
      ampS.setAmplitude(1);
      ampS.rotate(-ampS.theta);
      ampR.hide();
      ampR.setAmplitude(1);
      ampR.rotate(-ampR.theta);
      addBox.hide();
      addBox.reset();
      probD.set(0);
    }
  }
);

// Step 4: Prompt going to bright detector
tutorial.addStep(
  { // Point out other detector
    blink: [{object: detectorB, hold: true}],
    msg: TEXT['send-to-bright'],
    trigger: 'next'
  },
  { // Add in amplitude windows
    animation: function(callback) {
      ampS.show(500);
      ampR.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      ampS.show(0);
      ampR.show(0);
    }
  },
  { // Point out arrows
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['intro-amp-boxes-bright'],
    trigger: 'next'
  }
);

// Step 5: Shoot photon to bright detector
tutorial.addStep(
  { // Prompt animation
    blink: [{object: source, hold: true}],
    msg: TEXT['shoot-to-bright'],
    trigger: 'play'
  },
  { // Send photon to beam splitter
    animation: function(callback) {
      source.emit();
      ampS.animateRotation({
        time: 1.2,
        distance: 120
      });
      ampR.animateRotation({
        time: 1.2,
        distance: 120
      });
      photonS.shoot(1.2, 120, callback);
    }
  },
  { // Explain photon reaches beam splitter
    msg: TEXT['photon-reaches-splitter'],
    trigger: 'next'
  },
  { // Shrink amplitude
    animation: function(callback) {
      ampS.shrinkAmplitude();
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain shrinking amplitude
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['first-shrink-amp'],
    trigger: 'next'
  },
  { // Flip sample path arrow
    animation: function(callback) {
      ampR.removeShadow();
      ampS.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain reflection
    blink: [{object: ampS, hold: true}],
    msg: TEXT['first-sample-reflection'],
    trigger: 'next'
  },
  { // Send photons along until sample path reaches mirror
    animation: function(callback) {
      photonR.graphic.show();
      photonR.setPoyntingFromPath(1);
      photonS.setPoyntingFromPath(4);
      ampS.animateRotation({
        time: 2,
        distance: 200
      });
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonS.shoot(2, 200);
      photonR.shoot(0.25, lightPaths[1].length, function() {
        photonR.setPoyntingFromPath(2);
        photonR.shoot(1.75, 175, callback);
      });
    }
  },
  { // Sample path reaches mirror
    msg: TEXT['sample-reaches-mirror'],
    trigger: 'next'
  },
  { // Flip sample arrow
    animation: function(callback) {
      ampS.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain reflection
    blink: [{object: ampS, hold: true}],
    msg: TEXT['second-sample-reflection'],
    trigger: 'next'
  },
  { // Send photons until reference path reaches mirror
    animation: function(callback) {
      photonS.setPoyntingFromPath(5);
      ampS.animateRotation({
        time: 1.85,
        distance: 185
      });
      ampR.animateRotation({
        time: 1.85,
        distance: 185
      });
      photonS.shoot(1.85, 185);
      photonR.shoot(1.85, 185, callback);
    }
  },
  { // Explain reaching mirror
    msg: TEXT['reference-reaches-mirror'],
    trigger: 'next'
  },
  { // Flip reference path arrow
    animation: function(callback) {
      ampR.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain reflection
    blink: [{object: ampR, hold: true}],
    msg: TEXT['first-reference-reflection'],
    trigger: 'next'
  },
  { // Send photons to second beam splitter
    animation: function(callback) {
      photonR.setPoyntingFromPath(3);
      ampS.animateRotation({
        time: 2,
        distance: 200
      });
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonR.shoot(2, 200);
      photonS.shoot(1.75, 175, function() {
        photonS.setPoyntingFromPath(6);
        photonS.shoot(0.25, lightPaths[6].length, function() {
          photonR.translate(-380, 190);
          photonR.graphic.hide();
          callback();
        });
      })
    }
  },
  { // Explain photons rejoining
    msg: TEXT['photons-join'],
    trigger: 'next'
  },
  { // Shrink arrows again
    animation: function(callback) {
      ampS.shrinkAmplitude();
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain arrow shrink
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['second-shrink-amp'],
    trigger: 'next'
  },
  { // Flip rerefence arrow
    animation: function(callback) {
      ampS.removeShadow();
      ampR.addSixHours();
      setTimeout(callback, 1000);
    }
  },
  { // Point out reference arrow
    blink: [{object: ampR, hold: true}],
    msg: TEXT['second-reference-reflection'],
    trigger: 'next'
  },
  { // Send photon to detector
    animation: function(callback) {
      ampR.removeShadow();

      photonS.setPoyntingFromPath(9);

      ampS.animateRotation({
        time: 1.2,
        distance: 120
      });
      ampR.animateRotation({
        time: 1.2,
        distance: 120
      });
      photonS.shoot(1.2, 120, function() {
        detectorB.detect();
        photonS.translate(-620, 190);
        photonS.setPoyntingFromPath(0);
        setTimeout(callback, 1000);
      });
    },
    skip: function() {
      ampS.setAmplitude(0.5);
      ampR.setAmplitude(0.5);
      ampS.rotate(165);
      ampR.rotate(165);
    }
  }
);

// Step 6: Add arrows together for probability
// Step 3: Add arrows for dark detector
tutorial.addStep(
  { // Give option to go back
    back: function() {
      ampS.setAmplitude(1);
      ampS.rotate(-ampS.theta);
      ampR.setAmplitude(1);
      ampR.rotate(-ampR.theta);
    },
    msg: TEXT['reached-bright-detector'],
    trigger: 'next'
  },
  { // Show amplitude addition window
    animation: function(callback) {
      addBox.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Introduce amplitude box
    blink: [{object: addBox, hold: true}],
    msg: TEXT['add-amplitudes-bright'],
    trigger: 'next'
  },
  { // Add amplitudes
    animation: function(callback) {
      addBox.addAmplitudes(ampS, ampR, function() {
        probB.set(1);
        callback();
      });
    }
  },
  { // Explain amplitude addition
    blink: [
      {object: addBox, hold: true},
      {object: probB, hold: true}
    ],
    msg: TEXT['add-to-one'],
    trigger: 'next'
  },
  { // Hide amplitude windows and move on
    animation: function(callback) {
      ampS.hide(true);
      ampR.hide(true);
      addBox.hide(true);
      setTimeout(function() {
        addBox.reset();
        ampS.setAmplitude(1);
        ampR.setAmplitude(1);
        ampS.rotate(-ampS.theta);
        ampR.rotate(-ampR.theta);
        callback();
      }, 1000);
    },
    skip: function() {
      ampS.hide();
      ampS.setAmplitude(1);
      ampS.rotate(-ampS.theta);
      ampR.hide();
      ampR.setAmplitude(1);
      ampR.rotate(-ampR.theta);
      addBox.hide();
      addBox.reset();
      probD.set(0);
    }
  }
);

// Step 7: Conclusion
tutorial.addStep(
  { // Conclusion
    blink: [
      {object: probD, hold: true},
      {object: probB, hold: true}
    ],
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
  PHOTON._INTRO_MESSAGE = "Welcome to the introduction to<br>"+
    "the Mach-Zehnder inteferometer.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
