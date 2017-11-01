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

Arrow Multiplication Exercise:
---------------------------------
How to multiply amplitudes

This program uses the PHOTON engine to
render an exercise which uses the example
of partial reflection to teach a geometric
interpretation of complex multiplication for
finding the probablity amplitude of
compound events.

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

// Help button
var btHelp = new PHOTON.ButtonHelp(760, 280, 70, 50);
app.add(btHelp, true);

// NEXT button
var btNext = new PHOTON.ButtonNext(600, 280, 140, 50);
btNext.disable();
app.add(btNext, true);

// BACK button
var btBack = new PHOTON.ButtonBack(440, 280, 140, 50);
btBack.disable();
app.add(btBack, true);

// Message box
var msg = new PHOTON.MessageBox(440, 70, 390, 190);
app.add(msg, true);

//-- Help Layer setup --//

PHOTON.helpLayerSetup = function() {
  var helpLayer = PHOTON.children['help-layer'];

  with(helpLayer) {
    // Rendering a clone of the help button
    renderHelpClone(760, 280, 70, 50);

    // Rendering arrows to point to various graphics elements
    addArrow(800, 140, 10);
    addArrow(650, 40, 80);
    addArrow(450, 250, 55);
    addArrow(565, 400, 325);
    addArrow(615, 400, 35);

    // Adding text which provides information about the components of the app
    addText(610, 150, 200, 'Press this button to restart the exercise from the beginning.');
    addText(480, 10, 150, 'Press this button to open the exercise in another browser window.');
    addText(485, 410, 200, 'Press these buttons when prompted to navigate through the exercise.');
    addText(100, 100, 200, 'The experiment is depicted in here.');
    addText(250, 200, 200, 'This window provides helpful information about the experiment and how to navigate the exercise.');
  }
}

//-- Elements for the experiment --//

// Experiment window
var exp = new PHOTON.ExperimentBox(10, 70, 410, 260);
app.add(exp, true);

// Light paths
var lightPaths = [
  // Index 0: Path from source to glass
  new PHOTON.LightPath(60, 70, 140, 130),
  // Index 1: Path from glass interface to detector
  new PHOTON.LightPath(140, 130, 340, 70),
  // Index 2: From interface to other edge of glass
  new PHOTON.LightPath(140, 130, 200, 210, true),
  // Index 3: From bottom edge of glass to the top edge
  new PHOTON.LightPath(200, 210, 260, 130, true),
  // Index 4: From top edge of glass to detector
  new PHOTON.LightPath(260, 130, 340, 70)
];

// Photon
var photon = new PHOTON.Photon(60, 70);
photon.setPoyntingFromPath(0);

// Photon source
var source = new PHOTON.PhotonSource(60, 70);
source.rotate(180 * Math.atan(3/4) / Math.PI);
exp.addLabel('Photon<br>Source', 90, 20);

// Detector
var detector = new PHOTON.PhotonDetector(340, 70);
detector.rotate(-30);
exp.addLabel('Detector', 260, 20);

// Glass
var glass = new PHOTON.Glass(30, 130, 340, 80);
exp.addLabel('Glass', 40, 135);
exp.addLabel('Air', 40, 105);

// Probability amplitude displays

var currentAmp = new PHOTON.AmplitudeBox(60, 360, 'Photon\'s Current Arrow');
currentAmp.hide();
app.add(currentAmp);

var eventAmp = new PHOTON.AmplitudeBox(320, 360);
eventAmp.setLabel('Reflects off Glass in Air', 16);
eventAmp.setAmplitude(0.2);
eventAmp.rotate(180);
eventAmp.hide();
app.add(eventAmp);

var compoundAmp = new PHOTON.AmplitudeBox(580, 360, 'New Photon Arrow');
compoundAmp.clearAmplitude();
compoundAmp.hide();
app.add(compoundAmp);

var multiplier = new PHOTON.AmplitudeMultiplier();
multiplier.createMultiplicationLayer(currentAmp, eventAmp, compoundAmp);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the exercise on arrow multiplication. Press the cyan help button "+
    "for more information on how to use the application. Press NEXT to continue.",
  'intro-s-and-d':
    "Just like the last time we looked at partial reflection, we will be looking "+
    "at a photon traveling from the photon "+
    "source getting reflected by glass to the detector. Press NEXT to continue.",
  'intro-first-path':
    "The first way the photon can reach the detector is by being reflected off of "+
    "the top surface of the glass. Press NEXT to continue.",
  'intro-second-path':
    "The second way the photon can reach the detector is by being reflected inside "+
    "the glass off the bottom surface. Press NEXT to continue.",
  'first-animation-prompt':
    "We have introduced the photon arrow for the first path below. Click on the "+
    "photon source to send a photon along that path.",
  'second-animation-prompt':
    "We have introduced the photon arrow for the second path. Click on the photon "+
    "source to send a photon along that path.",
  'first-photon-reaches-top-interface':
    "In order for the photon to reach the detector, the photon needs to be reflected "+
    "off of the top surface of the glass."+
    "<br><br>"+
    "In previous exercises, when the photon reached a glass interface we "+
    "changed the arrow when it was reflected. Our rules already incorporated the compound arrow "+
    "that arises from multiplication. We suppressed the details and let our simulation do "+
    "it for you automatically."+
    "<br><br>"+
    "Now we are going to perform the multiplication. Press NEXT to continue.",
  'second-photon-reaches-top-interface':
    "In order for the photon to reach the detector along this path, the photon "+
    "needs to be transmitted through the glass."+
    "<br><br>"+
    "In previous exercises, when the photon was transmitted through glass we "+
    "changed the arrow for you. We avoided the details to contruct the compound "+
    "amplitude arrow and had our simulation do it for you automatically."+
    "<br><br>"+
    "Now we are going to explicitly construct the compound arrows. Press NEXT to continue.",
  'second-photon-reaches-bottom-interface':
    "Now the photon has reached the bottom surface of the glass. In order for the "+
    "photon to reach the detector, it needs to reflect off of the bottom surface "+
    "of the glass."+
    "<br><br>"+
    "In the previous exercise, when the photon was reflected inside glass, we "+
    "suppressed the details. Now we are going to show how to contruct the compound arrow. "+
    "Press NEXT to continue.",
  'first-compound-event':
    "In order to compute the compound arrow for the photon getting reflected off this interface, "+
    "we need to multiply the photon's current arrow with the arrow for reflection off "+
    "of glass from air."+
    "<br><br>"+
    "Since the photon has a 4% chance of being reflected, the amplitude of the arrow "+
    "is 0.2. Since the arrow is for reflection off of glass in air, its clock time is "+
    "6 o'clock."+
    "<br><br>"+
    "Press NEXT to begin multiplying the arrows.",
  'arrow-for-glass-transmission':
    "In order to find the arrow for the photon refracting into glass we need to "+
    "multiply the photon's current arrow with the arrow for transmission from air "+
    "to glass."+
    "<br><br>"+
    "Since the photon has a 96% chance of refracting through the glass, the amplitude "+
    "of the arrow is 0.98. Since the arrow is for transmission, its clock time is "+
    "12 o'clock."+
    "<br><br>"+
    "Press NEXT to begin multiplying the arrows.",
  'arrow-for-glass-transmission2':
    "In order to find the arrow for the photon transmitting out of glass we need to "+
    "multiply the photon's current arrow with the arrow for transmission from glass "+
    "to air."+
    "<br><br>"+
    "Since the photon has a 96% chance of transmitting through the glass, the amplitude "+
    "of the arrow is 0.98. Since the arrow is for transmission, its clock time is "+
    "12 o'clock."+
    "<br><br>"+
    "Press NEXT to begin multiplying the arrows.",
  'arrow-for-reflection-in-glass':
    "In order to find the arrow for the photon getting reflected off of the bottom "+
    "surface of the glass we need to multiply the photon's current arrow with the arrow "+
    "for reflection off of glass from inside glass."+
    "<br><br>"+
    "Since the photon has a 4% chance of getting reflected by glass, the amplitude "+
    "of the arrow is 0.2. Since the arrow is for reflection off glass inside glass, "+
    "its clock time is 12 o'clock."+
    "<br><br>"+
    "Press NEXT to begin multiplying the arrows.",
  'copy-arrow':
    "We start by copying the current photon's arrow. Press NEXT to continue.",
  'rotate-arrow-reflection':
    "Next we rotate the new arrow so that its clock time is the sum of the "+
    "clock times of the photon's current arrow and the arrow for reflection."+
    "<br><br>"+
    "Press NEXT to continue.",
  'rotate-arrow-transmission':
    "Next we rotate the new arrow so that its clock time is the sum of the "+
    "clock times of the photon's current arrow and the arrow for transmission."+
    "<br><br>"+
    "Press NEXT to continue.",
  'scale-arrow-reflection':
    "Finally we scale the new arrow so that its amplitude is the product of the "+
    "amplitudes of the photon's current arrow and the arrow for reflection."+
    "<br><br>"+
    "Press NEXT to continue.",
  'scale-arrow-transmission':
    "Finally we scale the new arrow so that its amplitude is the product of the "+
    "amplitudes of the photon's current arrow and the arrow for transmission."+
    "<br><br>"+
    "Press NEXT to continue.",
  'replace-arrow':
    "We replace the photon's current arrow with the new arrow. This arrow is now the "+
    "PHOTON arrow for the path the photon is on. Press NEXT to continue.",
  'photon-reaches-detector':
    "Finally the photon continues onto the detector."+
    "<br><br>"+
    "Press BACK to see the last animation again. Press NEXT to continue.",
  'conclusion':
    "Finally the photon continues onto the detector. Below we show the final "+
    "arrows for the two paths. In order to determine the probability the photon "+
    "reaches the detector, we add the two arrows together and square the "+
    "length of the resulting arrow."+
    "<br><br>"+
    "This is the end of the tutorial. Press BACK if you want to see the last "+
    "animation again."
}

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: Introduce setup
tutorial.addStep(
  { // Introduce application
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Introduce source and detector
    msg: TEXT['intro-s-and-d'],
    blink: [
      {object: detector, hold: true},
      {object: source, hold: true}
    ],
    trigger: 'next'
  },
  { // Introduce first path
    msg: TEXT['intro-first-path'],
    blink: [
      {object: lightPaths[0], hold: true},
      {object: lightPaths[1], hold: true}
    ],
    trigger: 'next'
  },
  { // Fade in current amplitude
    animation: function(callback) {
      currentAmp.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      currentAmp.show(0);
    }
  }
);

// Step 1: Send photon on first path
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['first-animation-prompt'],
    trigger: 'source',
    blink: [{object: currentAmp, hold: true}]
  },
  { // Photon animates to top interface of the glass and introduce other amplitude windows
    animation: function(callback) {
      source.emit();
      photon.shoot(2, 100);
      currentAmp.animateRotation({
        time: 2,
        distance: 100,
        callback: callback
      });
    }
  },
  { // Photon reaches top of the glass
    msg: TEXT['first-photon-reaches-top-interface'],
    trigger: 'next'
  },
  { // Fade in other windows
    animation: function(callback) {
      eventAmp.show(500);
      compoundAmp.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Explain first compound event
    msg: TEXT['first-compound-event'],
    trigger: 'next',
    blink: [
      {object: eventAmp, hold: true},
      {object: compoundAmp, hold: true}
    ]
  },
  { // Copy current arrow
    animation: function(callback) {
      compoundAmp.copyAmplitude(currentAmp, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain arrow copy
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Add clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain arrow rotation
    msg: TEXT['rotate-arrow-reflection'],
    trigger: 'next'
  },
  { // Animate scaling
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain scaling
    msg: TEXT['scale-arrow-reflection'],
    trigger: 'next'
  },
  { // Replacing old arrow with the new one
    animation: function(callback) {
      currentAmp.hide(true);
      eventAmp.hide(true);
      compoundAmp.animateTo(3, 60, 360);
      setTimeout(function() {
        currentAmp.copyAmplitude(compoundAmp, false);
        currentAmp.show(100);
        compoundAmp.hide(true);
      }, 3000);
      setTimeout(function() {
        compoundAmp.resetPosition();
        callback();
      }, 5000);
    }
  },
  { // Explain arrow replacement
    msg: TEXT['replace-arrow'],
    blink: [{object: currentAmp, hold: true}],
    trigger: 'next'
  },
  { // Send photon to detector
    animation: function(callback) {
      photon.setPoyntingFromPath(1);
      photon.shoot(3, lightPaths[1].length);
      currentAmp.animateRotation({
        time: 3,
        distance: lightPaths[1].length,
        callback: function() {
          compoundAmp.clearAmplitude();

          photon.translate(-280, 0);
          photon.setPoyntingFromPath(0);

          detector.detect();

          currentAmp.hide(true);
          setTimeout(function() {
            currentAmp.rotate(-currentAmp.theta);
            currentAmp.setAmplitude(1);

            callback();
          }, 1000);
        }
      })
    },
    skip: function() {
      currentAmp.hide();
    }
  }
);

// Step 2: Introduce second path
tutorial.addStep(
  { // Photon reaches detector, give option to go back
    back: function() {
      currentAmp.show(400);
      compoundAmp.clearAmplitude();
      eventAmp.setLabel('Reflects off Glass in Air');
      eventAmp.setAmplitude(0.2);
      eventAmp.rotate(180 - eventAmp.theta);
    },
    msg: TEXT['photon-reaches-detector'],
    trigger: 'next'
  },
  { // Introduce second path
    msg: TEXT['intro-second-path'],
    trigger: 'next',
    blink: [
      {object: lightPaths[0], hold: true},
      {object: lightPaths[2], hold: true},
      {object: lightPaths[3], hold: true},
      {object: lightPaths[4], hold: true}
    ]
  },
  { // Fade in current amplitude
    animation: function(callback) {
      currentAmp.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      currentAmp.show(0);
    }
  }
);

// Step 3: Send photon on second path
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['second-animation-prompt'],
    trigger: 'source',
    blink: [{object: currentAmp, hold: true}]
  },
  { // Photon animates to top interface of the glass and introduce other amplitude windows
    animation: function(callback) {
      source.emit();
      photon.shoot(2, 100);
      currentAmp.animateRotation({
        time: 2,
        distance: 100,
        callback: function() {
          eventAmp.setAmplitude(0.98);
          eventAmp.rotate(-eventAmp.theta);
          eventAmp.setLabel('Refracts from Air into Glass')
          callback();
        }
      });
    }
  },
  { // Photon reaches top of the glass
    msg: TEXT['second-photon-reaches-top-interface'],
    trigger: 'next'
  },
  { // Fade in other windows
    animation: function(callback) {
      eventAmp.show(500);
      compoundAmp.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Explain first compound event
    msg: TEXT['arrow-for-glass-transmission'],
    trigger: 'next',
    blink: [
      {object: eventAmp, hold: true},
      {object: compoundAmp, hold: true}
    ]
  },
  { // Copy current arrow
    animation: function(callback) {
      compoundAmp.copyAmplitude(currentAmp, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain arrow copy
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Add clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain arrow rotation
    msg: TEXT['rotate-arrow-transmission'],
    trigger: 'next'
  },
  { // Animate scaling
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain scaling
    msg: TEXT['scale-arrow-transmission'],
    trigger: 'next'
  },
  { // Replacing old arrow with the new one
    animation: function(callback) {
      currentAmp.hide(true);
      eventAmp.hide(true);
      compoundAmp.animateTo(3, 60, 360);
      setTimeout(function() {
        currentAmp.copyAmplitude(compoundAmp, false);
        currentAmp.show(100);
        compoundAmp.hide(true);
      }, 3000);
      setTimeout(function() {
        compoundAmp.resetPosition();
        callback();
      }, 5000);
    }
  },
  { // Explain arrow replacement
    msg: TEXT['replace-arrow'],
    blink: [{object: currentAmp, hold: true}],
    trigger: 'next'
  },
  { // Animate photon to bottom surface
    animation: function(callback) {
      photon.setPoyntingFromPath(2);
      photon.shoot(2, 100);
      currentAmp.animateRotation({
        time: 2,
        distance: 100,
        callback: function() {
          compoundAmp.clearAmplitude();
          eventAmp.setLabel('Reflects off Glass in Glass');
          eventAmp.setAmplitude(0.2);
          compoundAmp.clearAmplitude();
          callback();
        }
      })
    }
  },
  { // Photon reaches top of the glass
    msg: TEXT['second-photon-reaches-bottom-interface'],
    trigger: 'next'
  },
  { // Fade in other windows
    animation: function(callback) {
      eventAmp.show(500);
      compoundAmp.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Explain first compound event
    msg: TEXT['arrow-for-reflection-in-glass'],
    trigger: 'next',
    blink: [
      {object: eventAmp, hold: true},
      {object: compoundAmp, hold: true}
    ]
  },
  { // Copy current arrow
    animation: function(callback) {
      compoundAmp.copyAmplitude(currentAmp, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain arrow copy
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Add clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain arrow rotation
    msg: TEXT['rotate-arrow-reflection'],
    trigger: 'next'
  },
  { // Animate scaling
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain scaling
    msg: TEXT['scale-arrow-reflection'],
    trigger: 'next'
  },
  { // Replacing old arrow with the new one
    animation: function(callback) {
      currentAmp.hide(true);
      eventAmp.hide(true);
      compoundAmp.animateTo(3, 60, 360);
      setTimeout(function() {
        currentAmp.copyAmplitude(compoundAmp, false);
        currentAmp.show(100);
        compoundAmp.hide(true);
      }, 3000);
      setTimeout(function() {
        compoundAmp.resetPosition();
        callback();
      }, 5000);
    }
  },
  { // Explain arrow replacement
    msg: TEXT['replace-arrow'],
    blink: [{object: currentAmp, hold: true}],
    trigger: 'next'
  },
  { // Send photon along path
    animation: function(callback) {
      photon.setPoyntingFromPath(3);
      photon.shoot(2.8, 100);
      currentAmp.animateRotation({
        time: 2.8,
        distance: 140,
        callback: function() {
          compoundAmp.clearAmplitude();
          eventAmp.setLabel('Refracts from Glass to Air');
          eventAmp.setAmplitude(0.98);
          callback();
        }
      })
    }
  },
  { // Photon reaches top of the glass
    msg: TEXT['second-photon-reaches-top-interface'],
    trigger: 'next'
  },
  { // Fade in other windows
    animation: function(callback) {
      eventAmp.show(500);
      compoundAmp.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Explain first compound event
    msg: TEXT['arrow-for-glass-transmission2'],
    trigger: 'next',
    blink: [
      {object: eventAmp, hold: true},
      {object: compoundAmp, hold: true}
    ]
  },
  { // Copy current arrow
    animation: function(callback) {
      compoundAmp.copyAmplitude(currentAmp, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain arrow copy
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Add clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain arrow rotation
    msg: TEXT['rotate-arrow-transmission'],
    trigger: 'next'
  },
  { // Animate scaling
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain scaling
    msg: TEXT['scale-arrow-transmission'],
    trigger: 'next'
  },
  { // Replacing old arrow with the new one
    animation: function(callback) {
      currentAmp.hide(true);
      eventAmp.hide(true);
      compoundAmp.animateTo(3, 60, 360);
      setTimeout(function() {
        currentAmp.copyAmplitude(compoundAmp, false);
        currentAmp.show(100);
        compoundAmp.hide(true);
      }, 3000);
      setTimeout(function() {
        compoundAmp.resetPosition();
        callback();
      }, 5000);
    }
  },
  { // Explain arrow replacement
    msg: TEXT['replace-arrow'],
    blink: [{object: currentAmp, hold: true}],
    trigger: 'next'
  },
  { // Send photon to detector
    animation: function(callback) {
      photon.setPoyntingFromPath(4);
      photon.shoot(2.8, 100);
      currentAmp.animateRotation({
        time: 2.8,
        distance: 140,
        callback: function() {
          photon.translate(-280, 0);
          photon.setPoyntingFromPath(0);

          detector.detect();

          setTimeout(callback, 1000);
        }
      });
    }
  }
);

// Step 4: Conclusion
tutorial.addStep(
  { // Animation shows final amplitudes
    animation: function(callback) {
      // Hide current amp
      currentAmp.hide(true);

      // Replace current window with one with a different label
      compoundAmp.animateTo(0, 60, 360);
      compoundAmp.setLabel('Reflected Off Bottom Surface', 16);
      compoundAmp.setAmplitude(0.192);
      compoundAmp.rotate(currentAmp.theta);
      compoundAmp.show(100);

      // Show other window
      eventAmp.setAmplitude(0.2);
      eventAmp.rotate(275);
      eventAmp.setLabel('Reflected Off Top Surface', 16);
      eventAmp.show(400);

      setTimeout(callback, 1000);
    }
  },
  { // Conclusion
    back: function() {
      // Reset event amplitude
      eventAmp.hide();
      eventAmp.setAmplitude(0.98);
      eventAmp.rotate(-eventAmp.theta);

      // Reset current amplitude
      currentAmp.show();
      currentAmp.setAmplitude(1);
      currentAmp.rotate(-currentAmp.theta);

      // Reset compound amplitude arrow
      compoundAmp.resetPosition();
      compoundAmp.clearAmplitude();
      compoundAmp.hide();
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

function dev(x) { PHOTON._DEVELOPER_MODE = x }
// dev(true)

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the exercise on<br>"+
    "PHOTON arrow multiplication.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(850, 650);
});
