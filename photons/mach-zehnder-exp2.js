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

Mach-Zehnder Interferometer: Second Exercise:
--------------------------------------------

This program uses the PHOTON engine to
render an exercise which demonstrates
the Mach-Zehnder interferometer. This
exercise explores what happens when we
add a phase shift between the two paths

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

// These buttons change the length of the glass in this experiment

// Makes glass shorter
var btShort = new PHOTON.ButtonShort();
btShort.hide();
app.add(btShort);

// Makes glass longer
var btLong = new PHOTON.ButtonLong();
btLong.hide();
app.add(btLong);

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
  // Index 5: From top mirror to left edge of glass
  new PHOTON.LightPath(170, 180, 270, 180),
  // Index 6: Through the glass
  new PHOTON.LightPath(270, 180, 410, 180, true),
  // Index 7: From right edge of glass to the mirror
  new PHOTON.LightPath(410, 180, 530, 180),
  // Index 8: Refracted part of sample path through the top beam splitter
  new PHOTON.LightPath(530, 180, 550, 190, true),
  // Index 9: Refracted through top beam splitter to dark detector
  new PHOTON.LightPath(550, 190, 540, 170, true),
  // Index 10: From top beam splitter to dark detector
  new PHOTON.LightPath(540, 170, 540, 50),
  // Index 11: From top beam splitter to bright detector
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

// Glass
var glass = new PHOTON.Glass(270, 160, 140, 40);

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
app.add(probD, true);

// Bright detector
var probB = new PHOTON.ProbabilityDisplay(620, 300);
app.add(probB, true);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the second exercise on the Mach-Zehnder interferometer. In this exercise, we illustrate what happens when one path is made longer than the other path. Press "+
    "the cyan help button (question mark) for more information on how to use the application. "+
    "Press NEXT to continue.",
  'intro-glass':
    "Just like in the last experiment, we are going to send a photon from a source "+
    "and determine the probability of the photon reaching each of the two detectors."+
    "<br><br>"+
    "However, in this experiment, we have added a piece of glass in the Sample Path. "+
    "Press NEXT to continue.",
  'send-to-dark-first':
    "First we are going to determine the probability that the photon goes to the Dark "+
    "Detector. Press NEXT to continue.",
  'intro-amp-windows-dark':
    "Since there are two paths a photon could take to the Dark Detector, and an "+
    "observer cannot discern which path the photon took, we have to determine the "+
    "arrow for each path and add them."+
    "<br><br>"+
    "Press NEXT to continue.",
  'now-send-to-bright':
    "Now we are going to determine the probability that the photon goes to the Bright "+
    "Detector. Press NEXT to continue.",
  'intro-amp-windows-bright':
    "Since there are two paths a photon could take to the Bright Detector, and an "+
    "observer cannot discern which path the photon took, we have to determine the "+
    "arrow for each path and add them."+
    "<br><br>"+
    "Press NEXT to continue.",
  'send-to-dark':
    "Press the green play button to send a photon to the Dark Detector.",
  'send-to-bright':
    "Press the green play button to send a photon to the Bright Detector.",
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
  'reference-reaches-splitter':
    "If the photon takes the Reference Path, it will have now reached the second "+
    "50-50 beam splitter. Press NEXT to continue.",
  'shrink-amp-reference':
    "Since the photon is equally likely to travel to either detector, we need "+
    "to shrink the Reference Path's arrow by a factor of "+
    "1/&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'second-reference-reflection':
    "In order for the photon to take the Reference Path to the Bright Detector "+
    "the photon needs to be reflected by glass in air. So therefore we need to add "+
    "six hours to the Reference Path's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'sample-reaches-splitter':
    "If the photon takes the Sample Path, it will have now reached the second "+
    "50-50 beam splitter. Press NEXT to continue.",
  'shrink-amp-sample':
    "Since the photon is equally likely to travel to either detector, we need "+
    "to shrink the Sample Path's arrow by a factor of "+
    "1/&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'reached-dark-detector':
    "The photon has reached the Dark Detector. Press BACK if you would like to "+
    "see the animation again. Press NEXT to continue.",
  'reached-bright-detector':
    "The photon has reached the Bright Detector. Press BACK if you would like to "+
    "see the animation again. Press NEXT to continue.",
  'add-amplitudes-dark':
    "Now we are going to add the arrows in the windows on the left to determine "+
    "the probability that the photon goes to the Dark Detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'add-amplitudes-bright':
    "Now we are going to add the arrows in the windows on the left to determine "+
    "the probability that the photon goes to the Bright Detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'dark-probability':
    "Because of the glass, it does not take the photons the same amount of time "+
    "to reach the Dark Detector. As a result, the probability of the photon going "+
    "to the Dark Detector is no longer zero."+
    "<br><br>"+
    "Press NEXT to continue.",
  'bright-probability':
    "Because of the glass, it does not take the photons the same amount of time "+
    "to reach the Bright Detector. As a result, the probability of the photon going "+
    "to the Bright Detector is no longer 100%."+
    "<br><br>"+
    "Press NEXT to continue.",
  'intro-sum-windows':
    "Now the windows on the left will add the arrows for each path and show the "+
    "probability that the photon will go to either detector."+
    "<br><br>"+
    "Press NEXT to continue.",
  'length-change-buttons':
    "Now we have introduced buttons that change the length of the glass."+
    "<br><br>"+
    "When you press either of the buttons to change the length of the glass, "+
    "and the windows on the right will display the probability that the photon "+
    "goes to either detector and how the arrows are added.",
  'now-change-color':
    "You can also click on the Photon Source to change the color of the light.",
  'color-changes-probability':
    "When the light changes color, the arrows for each path spin at different rates."+
    "When different colors of light travel through the same block of glass in the Sample "+
    "Path, it can result in different probabilities of detection."+
    "<br><br>"+
    "What is the probability of detection at each detector when the length of the "+
    "glass is zero? Is it the same for all colors? What does the result tell you "+
    "about the length of the paths?"+
    "<br><br>"+
    "This concludes this tutorial, feel free to continue exploring the setup, by varying the color of the source or the width of the glass. When done, continue with the module."

} // End of text

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce exercise and help button
tutorial.addStep(
  { // Introduce exercise
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Introduce glass
    msg: TEXT['intro-glass'],
    blink: [
      {object: source, hold: true},
      {object: detectorD, hold: true},
      {object: detectorB, hold: true}
    ],
    trigger: 'next'
  },
  { // Dark Detector first
    blink: [
      {object: detectorD, hold: true},
      {object: probD, hold: true}
    ],
    msg: TEXT['send-to-dark-first'],
    trigger: 'next'
  },
  { // Show amplitude displays
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
  { // Introduce amplitude windows
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['intro-amp-windows-dark'],
    trigger: 'next'
  }
);

// Step 1: Send photon to Dark Detector
tutorial.addStep(
  { // Prompt animation
    blink: [{object: source, hold: true}],
    msg: TEXT['send-to-dark'],
    trigger: 'play'
  },
  { // Move photon to beam splitter
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
  { // Shrink amplitudes
    animation: function(callback) {
      ampS.shrinkAmplitude();
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude shrink
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
      photonS.shoot(1, 100, function() {
        photonS.shoot(0.85, 85/1.2);
      });
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
  { // Send Reference Photon to beam splitter
    animation: function(callback) {
      // Sample photon
      ampS.animateRotation({
        time: 0.85,
        distance: 83
      });
      photonS.shoot(0.85, 140-85/1.2, function() {
        ampS.animateRotation({
          time: 1.15,
          distance: 117
        });
        photonS.shoot(1.15, 117);
      });

      // Reference photon
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonR.setPoyntingFromPath(3);
      photonR.shoot(2, 200, callback);
    }
  },
  { // Explain Reference path photon reaches the splitter
    msg: TEXT['reference-reaches-splitter'],
    trigger: 'next'
  },
  { // Shrink Reference arrow
    animation: function(callback) {
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude shrink
    blink: [{object: ampR, hold: true}],
    msg: TEXT['shrink-amp-reference'],
    trigger: 'next'
  },
  { // Send Sample Photon to beam splitter
    animation: function(callback) {
      // Reference photon
      ampR.animateRotation({
        time: 0.25 + 1/30,
        distance: 28
      });
      photonR.setPoyntingFromPath(9);
      photonR.shoot(0.25, lightPaths[9].length, function() {
        photonR.setPoyntingFromPath(10);
        photonR.shoot(1/30, 3);
      });

      // Sample photon
      ampS.animateRotation({
        time: 0.25 + 1/30,
        distance: 28
      });
      photonS.shoot(1/30, 3, function() {
        photonS.setPoyntingFromPath(8);
        photonS.shoot(0.25, lightPaths[8].length, callback);
      });
    }
  },
  { // Explain Reference path photon reaches the splitter
    msg: TEXT['sample-reaches-splitter'],
    trigger: 'next'
  },
  { // Shrink Reference arrow
    animation: function(callback) {
      ampS.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude shrink
    blink: [{object: ampS, hold: true}],
    msg: TEXT['shrink-amp-sample'],
    trigger: 'next'
  },
  { // Send photons to Dark Detector
    animation: function(callback) {
      // Reference photon
      ampR.animateRotation({
        time: 1.15,
        distance: 117
      });
      photonR.shoot(1.15, 117);

      // Sample photon
      ampS.animateRotation({
        time: 1.45,
        distance: 145
      });
      photonS.setPoyntingFromPath(9);
      photonS.shoot(0.25, lightPaths[9].length, function() {
        photonS.setPoyntingFromPath(10);
        photonS.shoot(1.2, 120, function() {
          detectorD.detect();
          photonS.translate(-490, 330);
          photonS.setPoyntingFromPath(0);
          photonR.translate(-370, 330);
          photonR.graphic.hide();
          setTimeout(callback, 1000);
        });
      });
    },
    skip: function() {
      ampS.setAmplitude(0.5);
      ampS.rotate(70);
      ampR.setAmplitude(0.5);
      ampR.rotate(105);
    }
  }
);

// Step 2: Add amplitudes at Dark Detector
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
        probD.set(0.883);
        callback();
      });
    }
  },
  { // Explain amplitude addition
    blink: [
      {object: addBox, hold: true},
      {object: probD, hold: true}
    ],
    msg: TEXT['dark-probability'],
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
      probD.set(0.883);
    }
  }
);

// Step 3: Prepare to send photon to bright detector
tutorial.addStep(
  { // Explain we are looking at Bright Detector
    blink: [
      {object: detectorB, hold: true},
      {object: probB, hold: true}
    ],
    msg: TEXT['now-send-to-bright'],
    trigger: 'next'
  },
  { // Reintroduce amplitude windows
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
  { // Introduce amplitude windows again
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['intro-amp-windows-bright'],
    trigger: 'next'
  }
);

// Step 4: Send photon to Bright Detector
tutorial.addStep(
  { // Prompt animation
    blink: [{object: source, hold: true}],
    msg: TEXT['send-to-bright'],
    trigger: 'play'
  },
  { // Move photon to beam splitter
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
  { // Shrink amplitudes
    animation: function(callback) {
      ampS.shrinkAmplitude();
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude shrink
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
      photonS.shoot(1, 100, function() {
        photonS.shoot(0.85, 85/1.2);
      });
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
  { // Send Reference Photon to beam splitter
    animation: function(callback) {
      // Sample photon
      ampS.animateRotation({
        time: 0.85,
        distance: 83
      });
      photonS.shoot(0.85, 140-85/1.2, function() {
        ampS.animateRotation({
          time: 1.15,
          distance: 117
        });
        photonS.shoot(1.15, 117);
      });

      // Reference photon
      ampR.animateRotation({
        time: 2,
        distance: 200
      });
      photonR.setPoyntingFromPath(3);
      photonR.shoot(2, 200, callback);
    }
  },
  { // Explain Reference path photon reaches the splitter
    msg: TEXT['reference-reaches-splitter'],
    trigger: 'next'
  },
  { // Shrink Reference arrow
    animation: function(callback) {
      ampR.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude shrink
    blink: [{object: ampR, hold: true}],
    msg: TEXT['shrink-amp-reference'],
    trigger: 'next'
  },
  { // Flip Reference arrow
    animation: function(callback) {
      ampR.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain arrow flip
    blink: [{object: ampR, hold: true}],
    msg: TEXT['second-reference-reflection'],
    trigger: 'next'
  },
  { // Send Sample photon to splitter
    animation: function(callback) {
      // Sample photon
      ampS.animateRotation({
        time: 1/30,
        distance: 3
      });
      photonS.shoot(1/30, 3, function() {
        ampS.animateRotation({
          time: 0.25,
          distance: 25
        });
        photonS.setPoyntingFromPath(8);
        photonS.shoot(0.25, lightPaths[8].length);
      });

      // Reference photon
      ampR.animateRotation({
        time: 0.25 + 1/30,
        distance: 28
      });
      photonR.setPoyntingFromPath(11);
      photonR.shoot(0.25+1/30, 28, callback);
    }
  },
  { // Explain Reference path photon reaches the splitter
    msg: TEXT['sample-reaches-splitter'],
    trigger: 'next'
  },
  { // Shrink Reference arrow
    animation: function(callback) {
      ampS.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude shrink
    blink: [{object: ampS, hold: true}],
    msg: TEXT['shrink-amp-sample'],
    trigger: 'next'
  },
  { // Send photon to detector
    animation: function(callback) {
      // Reference photon
      ampR.animateRotation({
        time: 0.95 - 1/30,
        distance: 92
      });
      photonR.shoot(0.95-1/30, 92);

      // Sample photon
      ampS.animateRotation({
        time: 1.2,
        distance: 120
      });
      photonS.setPoyntingFromPath(11);
      photonS.shoot(1.2, 120, function() {
        detectorB.detect();
        photonS.translate(-620, 190);
        photonS.setPoyntingFromPath(0);
        photonR.translate(-500, 190);
        photonR.graphic.hide();
        callback();
      });
    }
  }
);

// Step 5: Add amplitudes for bright detector
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
        probB.set(0.117);
        callback();
      });
    }
  },
  { // Explain amplitude addition
    blink: [
      {object: addBox, hold: true},
      {object: probB, hold: true}
    ],
    msg: TEXT['bright-probability'],
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
      probB.set(0.117);
    }
  }
);

// Step 6: Introduce buttons to change glass length
tutorial.addStep(
  { // Show buttons and amplitude addition windows
    animation: function(callback) {
      ampS.setLabel('Dark Detector');
      ampR.setLabel('Bright Detector');
      ampS.drawAmplitudeAddition(true, glass.getDelta());
      ampR.drawAmplitudeAddition(false, glass.getDelta());
      ampS.show(500);
      ampR.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Introduce new windows
    blink: [
      {object: ampS, hold: true},
      {object: ampR, hold: true}
    ],
    msg: TEXT['intro-sum-windows'],
    trigger: 'next'
  },
  { // Show buttons to change the glass length
    animation: function(callback) {
      btShort.show(500);
      btLong.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Change glass length without changing color
    free: function(callback) {
      // Set message box
      msg.setMessage(TEXT['length-change-buttons']);

      // Make the buttons glow
      btShort.blink(true);
      btLong.blink(true);

      // Add events to buttons
      var pressed = false
      ,   count = 0;
      // Event
      function changeLengthEvent(shortOrLong) {
        // On first press the buttons glow turns off
        if(!pressed) {
          pressed = true;
          btLong.blinkOff();
          btShort.blinkOff();
        }
        // Change glass length and probabilities
        changeLength(shortOrLong, count, callback);
      }
      btShort.onPress(function() { changeLengthEvent(true); });
      btLong.onPress(function() { changeLengthEvent(false); });
    }
  },
  { // Give option to change the color of the photon source
    free: function() {
      // Add color label and make source glow
      source.addColorLabel();
      source.blink(true);

      // Set message
      msg.setMessage(TEXT['now-change-color']);

      // Boolean that changes first time source is pressed
      var pressed = false;
      setTimeout(function() {
        // Adding event listener to the photon source
        source.onPress(function() {
          if(!pressed) {
            msg.setMessage(TEXT['color-changes-probability']);
            pressed = true;
            source.blinkOff();
          }
          changeColor();
        })
        // Adding event listener to the length change buttons
        btShort.onPress(function() {
          changeLength(true);
        })
        btLong.onPress(function() {
          changeLength(false);
        });
      }, 500);
    }
  }
);

// Starting the experiment
setTimeout(function(){
  PHOTON.children['loading'].$.fadeOut({ duration: 300 });
  setTimeout(tutorial.start, 500);
}, 2000);

//== Functions used in exploration part of the experiment ==//

// Change length of the glass
// inputs are:
// - shorten: a boolean, true if btShort is pressed, false if btLong is pressed
// - count (optional): a number for the first part of step 6
// - callback (optional): a function that executes to end the first part of step 6
function changeLength(shorten, count, callback) {
  // Increase count, when it reaches 3, step 6 moves on to suggest users
  // change the color of the light
  if(count !== undefined) {
    count++;
    if(count === 3) callback();
  }
  // Change length of the glass
  glass.changeLength(shorten? -20 : 20);

  // Changing light path lengths
  var s = PHOTON._SCALE_FACTOR;
  // Path left of the glass
  lightPaths[5].graphic.attr(
    'path',
    'M'+ (170 * s) +' '+ (180 * s) +' L '+ ((340 - glass.length / 2) * s) +' '+ (180 * s)
  );
  // Path through glass
  lightPaths[6].graphic.attr(
    'path',
    'M'+ ((340 - glass.length / 2) * s) +' '+ (180 * s) +' L '+ ((340 + glass.length / 2) * s) +' '+ (180 * s)
  );
  // Path right of the glass
  lightPaths[7].graphic.attr(
    'path',
    'M'+ ((340 + glass.length / 2) * s) +' '+ (180 * s) +' L '+ (530 * s) +' '+ (180 * s)
  );

  // Drawing amplitude addition
  ampS.drawAmplitudeAddition(true, glass.getDelta());
  ampR.drawAmplitudeAddition(false, glass.getDelta());

  // Setting the probability displays
  probD.set(
    1/4 * Math.pow(1 + Math.cos(Math.PI * (glass.getDelta() + 180) / 180), 2)
    + 1/4 * Math.pow(Math.sin(Math.PI * (glass.getDelta() + 180) / 180), 2)
  );
  probB.set(
    1/4 * Math.pow(1 + Math.cos(Math.PI * glass.getDelta() / 180), 2)
    + 1/4 * Math.pow(Math.sin(Math.PI * glass.getDelta() / 180), 2)
  );

  // Add event listeners to the buttons
  if(glass.length === 0) btShort.disable()
  else {
    btShort.enable();
    btShort.onPress(function() {
      changeLength(true, count, callback);
    });
  }
  if (glass.length === 200) btLong.disable()
  else {
    btLong.enable();
    btLong.onPress(function() {
      changeLength(false, count, callback);
    });
  }
}

// Change color of the photons
function changeColor() {
  var colorHex;
  switch(PHOTON._PHOTON_COLOR) {
    // Changing the color
    case 'RED':
      PHOTON._PHOTON_COLOR = 'GREEN';
      colorHex = '#3f0';
      break;
    case 'GREEN':
      PHOTON._PHOTON_COLOR = 'BLUE';
      colorHex = '#66f';
      break;
    case 'BLUE':
      PHOTON._PHOTON_COLOR = 'RED';
      colorHex = '#f00';
      break;
  }

  // Changing the color of the photon source
  source.changeColor();

  // Changing the color of the light paths
  for(i in lightPaths) lightPaths[i].graphic.attr('stroke', colorHex);

  // Drawing amplitude addition
  ampS.drawAmplitudeAddition(true, glass.getDelta());
  ampR.drawAmplitudeAddition(false, glass.getDelta());

  // Setting the probability displays
  probD.set(
    1/4 * Math.pow(1 + Math.cos(Math.PI * (glass.getDelta() + 180) / 180), 2)
    + 1/4 * Math.pow(Math.sin(Math.PI * (glass.getDelta() + 180) / 180), 2)
  );
  probB.set(
    1/4 * Math.pow(1 + Math.cos(Math.PI * glass.getDelta() / 180), 2)
    + 1/4 * Math.pow(Math.sin(Math.PI * glass.getDelta() / 180), 2)
  );
}

} // End of the definition of the exercise

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the second exercise on<br>"+
    "the Mach-Zehnder inteferometer.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
