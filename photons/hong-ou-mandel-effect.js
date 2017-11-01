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
render an exercise which demonstrates
the Hong-Ou-Mandel effect as an example
of PHOTON entanglement.

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
var btPlay = new PHOTON.ButtonPlay(590, 360, 70, 50);
btPlay.disable();
app.add(btPlay, true);

// BACK button
var btBack = new PHOTON.ButtonBack(680, 360, 140, 50);
btBack.disable();
app.add(btBack, true);

// NEXT button
var btNext = new PHOTON.ButtonNext(840, 360, 140, 50);
btNext.disable();
app.add(btNext, true);

// Help button
var btHelp = new PHOTON.ButtonHelp(1000, 360, 70, 50);
app.add(btHelp, true);

// Message box
var msg = new PHOTON.MessageBox(600, 70, 460, 250);
app.add(msg, true);

//-- Help Layer setup --//

PHOTON.helpLayerSetup = function() {
  var helpLayer = PHOTON.children['help-layer'];

  with(helpLayer) {
    // Rendering a clone of the help button
    renderHelpClone(1000, 360, 70, 50);

    // Rendering arrows to point to various graphics elements
    addArrow(1050, 140, 10);
    addArrow(900, 40, 80);
    addArrow(810, 470, 325);
    addArrow(860, 470, 35);
    addArrow(540, 460, 50);

    // Adding text which provides information about the components of the app
    addText(890, 150, 200, 'Press this button to restart the exercise from the beginning.');
    addText(730, 10, 150, 'Press this button to open the exercise in another browser window.');
    addText(740, 485, 200, 'Press these buttons when prompted to navigate through the exercise.');
    addText(250, 200, 200, 'The experiment is depicted in here.');
    addText(650, 160, 200, 'This window provides helpful information about the experiment and how to navigate the exercise.');
    addText(440, 480, 200, 'Press this button when prompeted to start animations.');
  }
}

//-- Elements for the experiment --//

// Experiment window
var exp = new PHOTON.ExperimentBox(50, 70, 520, 360);
app.add(exp, true);

// Light paths
var lightPaths = [
  // Index 0: From Source A to splitter
  new PHOTON.LightPath(130, 70, 250, 160),
  // Index 1: From end of path 0 to bottom of beam splitter
  new PHOTON.LightPath(250, 160, 260, 180, true),
  // Index 2: From Source B to splitter
  new PHOTON.LightPath(120, 285, 260, 180),
  // Index 3: From middle of beam splitter to mirror interface
  new PHOTON.LightPath(260, 180, 270, 160, true),
  // Index 4: From beam splitter to detector C
  new PHOTON.LightPath(270, 160, 390, 70),
  // Index 5: From beam splitter to detector D
  new PHOTON.LightPath(260, 180, 400, 285)
];

// Photon A
var photonA = new PHOTON.Photon(130, 70);
photonA.setPoyntingFromPath(0);

// Photon B
var photonB = new PHOTON.Photon(120, 285);
photonB.setPoyntingFromPath(2);

// Photon source A
var sourceA = new PHOTON.PhotonSource(130, 70);
sourceA.rotate(180 * Math.atan(3/4) / Math.PI);
exp.addLabel('Photon<br>Source A', 20, 20);

var sourceB = new PHOTON.PhotonSource(120, 285);
sourceB.rotate(-180 * Math.atan(3/4) / Math.PI);
exp.addLabel('Photon<br>Source B', 20, 290);

// Detector C
var detectorC = new PHOTON.PhotonDetector(390, 70);
detectorC.rotate(-180 * Math.atan(3/4) / Math.PI);
exp.addLabel('Detector C', 410, 20);

var detectorD = new PHOTON.PhotonDetector(400, 285);
detectorD.rotate(180 * Math.atan(3/4) / Math.PI);
exp.addLabel('Detector D', 410, 315);

// Beam splitter
var splitter = new PHOTON.BeamSplitter(260, 180);
splitter.rotate(180);
exp.addLabel('Beam<br>Splitter', 320, 150)

// Probability amplitude displays

var ampA = new PHOTON.AmplitudeBox(45, 470, 'Photon A\'s Arrow');
ampA.setArrowColor('#888');
ampA.hide();
app.add(ampA);

var ampB = new PHOTON.AmplitudeBox(305, 470, 'Photon B\'s Arrow');
ampB.setArrowColor('#888');
ampB.hide();
app.add(ampB);

var amp1 = new PHOTON.AmplitudeBox(565, 470, 'Photons Get Reflected');
amp1.hide();
amp1.clearAmplitude();
app.add(amp1);
// Needs to animate to 825, 450

var amp2 = new PHOTON.AmplitudeBox(565, 470);
amp2.setLabel('Photons Get Transmitted', 16);
amp2.hide();
amp2.clearAmplitude();
app.add(amp2);

// Applitude addition window
var addBox = new PHOTON.AmplitudeAdditionBox(190, 105);
app.add(addBox);
addBox.hide();

// Amplitude multiplier object
var multiplier = new PHOTON.AmplitudeMultiplier();

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the exercise on the Hong-Ou-Mandel effect. Press the cyan "+
    "help button for more information about the application. Press NEXT to "+
    "continue.",
  'sources-and-detectors':
    "In this tutorial, we start with two photon sources, Source A and "+
    "Source B, which simultaneously send photons into a 50-50 beam splitter. These photons, photon A "+
    "and photon B, then move to two photon detectors, Detector C and Detector D. Both "+
    "Photon A and Photon B are identical."+
    "<br><br>"+
    "Press NEXT to continue.",
  'see-3-events':
    "If we send a photon from each source to each detector, an observer may see "+
    "three distinct outcomes."+
    "<br><br>"+
    "Press the green play button to see the first possible outcome.",
  'go-to-different-detectors':
    "The first possibility is that the photons go to different detectors. Since "+
    "Photon A and Photon B are identical, we do not know which photon went to which "+
    "detector."+
    "<br><br>"+
    "Press the green play button to see the second possible outcome.",
  'both-go-to-C':
    "The second possible outcome is that both photons go to Detector C."+
    "<br><br>"+
    "Press the green play button to see the third possibility",
  'both-go-to-D':
    "The third possible outcome is that both photons go to Detector D."+
    "<br><br>"+
    "Press BACK if you would like to see the three possible outcomes again. "+
    "Press NEXT to continue.",
  'two-ways-event-1':
    "There are two possible ways that the photons can go to two different detectors. "+
    "Press the green play button to see the first one.",
  'first-way-both-reflected':
    "The first way the photons can go to different detectors is if both photons "+
    "are reflected by the beam splitter."+
    "<br><br>"+
    "Press the green play button to see the next way each photon can go to different "+
    "detectors.",
  "second-way-both-transmitted":
    "The second way each photon can go to different detectors is if both photons "+
    "are transmitted through the beam splitter."+
    "<br><br>"+
    "Press BACK if you would like to see the two ways the photons can go to different "+
    "detectors again. Press NEXT to continue.",
  'intro-amp-boxes':
    "In order to determine the probability that the photons go to each detector, "+
    "we need to determine the arrow for each path. We will start by determining "+
    "the arrow for the case that both photons get reflected."+
    "<br><br>"+
    "Press NEXT to continue.",
  'determine-amplitde-both-transmitted':
    "Now we are going to determine the arrow for the case that both photons "+
    "are transmitted."+
    "<br><br>"+
    "Press NEXT to continue.",
  'determine-amp-A':
    "We will begin by determining the arrow for Photon A."+
    "<br><br>"+
    "Press the green play button to send Photon A into the setup.",
  'photon-A-reaches-center':
    "Now Photon A has reached the center of the beam splitter. Press NEXT to "+
    "continue.",
  'shrink-amp':
    "Since Photon A is equally likely to be reflected by or transmit through "+
    "the beam splitter, we shrink it's amplitude by a factor of 1/"+
    "&radic;<span style=\"text-decoration: overline\">2</span>."+
    "<br><br>"+
    "Press NEXT to continue.",
  'determine-amp-B':
    "We will now determine the amplitude for Photon B."+
    "<br><br>"+
    "Press BACK to see the last animation again. Press the "+
    "green play button to send Photon B into the setup.",
  'photon-B-reaches-center':
    "Now Photon B has reached the center of the beam splitter. Press NEXT to "+
    "continue.",
  'know-photon-B-goes-to-D':
    "Since Photon A went to Detector C and we are only considering the case when "+
    "the photons go to different detectors, we know Photon B must go to Detector D. "+
    "Therefore we do not shrink Photon B's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'know-photon-B-goes-to-C':
    "Since Photon A went to Detector D and we are only considering the case when "+
    "the photons go to different detectors, we know Photon B must go to Detector C. "+
    "Therefore we do not shrink Photon B's arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'know-both-photons-B-goes-to-C':
    "Since Photon A went to Detector C and we are only considering the case when "+
    "the photons are going to the same detectors, we know Photon B must go to "+
    "Detector C."+
    "<br><br>"+
    "Press NEXT to continue.",
  'reflected-outside-glass':
    "Since Photon B needs to be reflected by glass in air to reach Detector D, "+
    "we add six hours to its arrow's clock time."+
    "<br><br>"+
    "Press NEXT to continue.",
  'now-multiply-reflection':
    "Now we need to multiply the photons' arrows in order to determine the arrow "+
    "for the case that both photons get reflected."+
    "<br><br>"+
    "Press BACK to see the last animation again. Press NEXT to continue.",
  'now-multiply-both-go-to-C':
    "Now we need to multiply the photons' arrows in order to determine the arrow "+
    "for the case that both photons go to Detector C."+
    "<br><br>"+
    "Press BACK to see the last animation again. Press NEXT to continue.",
  'now-multiply-both-go-to-D':
    "Now we need to multiply the photons' arrows in order to determine the arrow "+
    "for the case that both photons go to Detector D."+
    "<br><br>"+
    "Press BACK to see the last animation again. Press NEXT to continue.",
  'copy-arrow':
    "First we begin by copying Photon A's arrow. Press NEXT to continue.",
  'add-to-2-30':
    "Next we add the photon arrows' clock times. The arrows' clock times "+
    "add to 10:15 + 4:15 = 2:30."+
    "<br><br>"+
    "Press NEXT to continue.",
  'add-to-8-30':
    "Next we add the photon arrows' clock times. The arrows' clock times "+
    "add to 10:15 + 10:15 = 8:30."+
    "<br><br>"+
    "Press NEXT to continue.",
  'multiply-amps':
    "Next we scale the final arrow so that its amplitude is the product of "+
    "the photons amplitudes. Since Photon B's amplitude is 1, we do not need "+
    "to change the amplitude of the final arrow."+
    "<br><br>"+
    "Press NEXT to continue.",
  'determined-amplitude-both-reflected':
    "Now we have determined the arrow for the case that both photons are reflected "+
    "by the beam splitter and go to different detectors."+
    "<br><br>"+
    "Press BACK if you would like to see the multiplication process again. Press NEXT "+
    "to continue.",
  'determined-amplitude-both-transmitted':
    "Now we have determined the arrow for the case that both photons are transmitted "+
    "through the beam splitter and go to different detectors."+
    "<br><br>"+
    "Press BACK if you would like to see the multiplication process again. Press NEXT "+
    "to continue.",
  'intro-add-box':
    "Now we are going to add the arrows for each way the photons can go to different "+
    "detectors to determine the probability that the that event occurs."+
    "<br><br>"+
    "Press NEXT to add the arrows.",
  'zero-probability':
    "Since the arrows face the opposite direction, they cancel one another out and "+
    "add to zero. So there is a zero percent chance that the photons will go to "+
    "different detectors."+
    "<br><br>"+
    "Press BACK if you want to see the arrow addition process again. Press NEXT to continue.",
  'determine-both-going-to-C':
    "Now we are going to determine the probability that both photons go to the same "+
    "detector. First, we are going to determine the arrow for both photons going to "+
    "Detector C."+
    "<br><br>"+
    "Press NEXT to continue.",
  'determined-amplitude-both-at-C':
    "Now we have determined the arrow for the case that both photons go to Detector C."+
    "<br><br>"+
    "Press NEXT to continue.",
  'determine-amplitde-both-go-to-D':
    "Now we are going to determine the arrow for the case that both photons go to "+
    "Detector D."+
    "<br><br>"+
    "Press NEXT to continue.",
  'conclusion':
    "Since an observer can distinguish when both photons go to Detector C or Detector "+
    "D, we can determine the probability of both events occurring by squaring the "+
    "amplitude of their arrows."+
    "<br><br>"+
    "Since both arrows have a length of 1/&radic;<span style=\"text-decoration: overline\">2</span> "+
    "or 0.707, there is a 50% chance that both photons will go to Detector C or Detector D."+
    "<br><br>"+
    "This is the end of this tutorial."
} // End of text

//== TUTORIAL SETUP ==//

// Instance of the tutorial object
var tutorial = new PHOTON.Tutorial();

// Step 0: introduce exercise
tutorial.addStep(
  { // Welcome and help button
    msg: TEXT['welcome'],
    blink: [{object: btHelp, hold: true}],
    trigger: 'next'
  },
  { // Introduce sources and detectors
    blink: [
      {object: sourceA, hold: true},
      {object: sourceB, hold: true},
      {object: detectorC, hold: true},
      {object: detectorD, hold: true}
    ],
    msg: TEXT['sources-and-detectors'],
    trigger: 'next'
  }
);

// Step 1: Animate the 3 possible events
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['see-3-events'],
    trigger: 'play'
  },
  { // First event, both photons go to different detectors
    animation: function(callback) {
      sourceA.emit();
      sourceB.emit();
      // Send photon A to center
      photonA.shoot(1.5, 150, function() {
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, function() {
          // Send photon A to detector
          photonA.setPoyntingFromPath(3);
          photonA.shoot(0.25, lightPaths[3].length, function() {
            photonA.setPoyntingFromPath(4);
            photonA.shoot(1.5, 150);
          });
        });
      });
      // Send photon B to center
      photonB.shoot(1.75, 175, function() {
        // Send photon B to detector
        photonB.setPoyntingFromPath(5);
        photonB.shoot(1.75, 175, function() {
          // Detectors blink
          detectorC.detect();
          detectorD.detect();

          photonA.translate(-260, 0);
          photonA.setPoyntingFromPath(0);
          photonB.translate(-280, 0);
          photonB.setPoyntingFromPath(2);

          setTimeout(callback, 100);
        });
      });
    }
  },
  { // Explain first event
    msg: TEXT['go-to-different-detectors'],
    trigger: 'play'
  },
  { // Send event: both go to detector C
    animation: function(callback) {
      sourceA.emit();
      sourceB.emit();
      // Send photon A to center
      photonA.shoot(1.5, 150, function() {
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, function() {
          // Send photon A to detector
          photonA.setPoyntingFromPath(3);
          photonA.shoot(0.25, lightPaths[3].length, function() {
            photonA.setPoyntingFromPath(4);
            photonA.shoot(1.5, 150, function() {
              detectorC.detect(true);

              photonA.translate(-260, 0);
              photonA.setPoyntingFromPath(0);

              setTimeout(callback, 1000);
            });
          });
        });
      });
      // Send photon B to center
      photonB.shoot(1.75, 175, function() {
        // Hide graphic (easier)
        photonB.translate(-140, 105)
      });
    }
  },
  { // Explain second event
    msg: TEXT['both-go-to-C'],
    trigger: 'play'
  },
  { // Third event: both photons go to Detector D
    animation: function(callback) {
      sourceA.emit();
      sourceB.emit();
      // Send photon A to center
      photonA.shoot(1.5, 150, function() {
        // Send photon A to middle of beam splitter
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, function() {
          photonA.translate(-130, -110);
          photonA.setPoyntingFromPath(0);
        });
      });
      // Send photon B to center
      photonB.shoot(1.75, 175, function() {
        photonB.setPoyntingFromPath(5);
        photonB.shoot(1.75, 175, function() {
          detectorD.detect(true);

          photonB.translate(-280, 0);
          photonB.setPoyntingFromPath(2);

          setTimeout(callback, 1000);
        })
      })
    }
  }
);

// Step 2: Give option to go back
tutorial.addStep(
  { // Explain third event from previous step
    back: function() {},
    msg: TEXT['both-go-to-D'],
    trigger: 'next'
  }
);

// Step 3: Explain there are two options event 1 can occur
tutorial.addStep(
  { // Explain there are two ways event 1 can happen
    msg: TEXT['two-ways-event-1'],
    trigger: 'play'
  },
  { // Show first path: both photons get reflected
    animation: function(callback) {
      sourceA.emit();
      // Sending photon A to the center
      photonA.shoot(1.5, 150, function() {
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, function() {
          // Sending photon A to detector C
          photonA.setPoyntingFromPath(3);
          photonA.shoot(0.25, lightPaths[3].length, function() {
            photonA.setPoyntingFromPath(4);
            photonA.shoot(1.5, 150, function() {
              detectorC.detect();

              photonA.translate(-260, 0);
              photonA.setPoyntingFromPath(0);
              setTimeout(sendPhotonB, 1000);
            });
          });
        });
      });
      // Sending photon B
      function sendPhotonB() {
        sourceB.emit();
        // Sending photon B to center
        photonB.shoot(1.75, 175, function() {
          // Sending photon B to detector
          photonB.setPoyntingFromPath(5);
          photonB.shoot(1.75, 175, function() {
            detectorD.detect();

            photonB.translate(-280, 0);
            photonB.setPoyntingFromPath(2);
            setTimeout(callback, 1000);
          });
        });
      }
    }
  },
  { // Explain first path
    msg: TEXT['first-way-both-reflected'],
    trigger: 'play'
  },
  { // Show second path, both photons are transmitted
    animation: function(callback) {
      sourceA.emit();
      // Send Photon A to center
      photonA.shoot(1.5, 150, function() {
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, function() {
          // Send photon A to detector D
          photonA.setPoyntingFromPath(5);
          photonA.shoot(1.75, 175, function() {
            detectorD.detect();

            photonA.translate(-270, -215);
            photonA.setPoyntingFromPath(0);

            setTimeout(sendPhotonB, 1000);
          });
        });
      });
      // Send Photon B
      function sendPhotonB() {
        sourceB.emit();
        // Send Photon B to center
        photonB.shoot(1.75, 175, function() {
          // Send photon B to Detector C
          photonB.setPoyntingFromPath(3);
          photonB.shoot(0.25, lightPaths[3].length, function() {
            photonB.setPoyntingFromPath(4);
            photonB.shoot(1.5, 150, function() {
              detectorC.detect();

              photonB.translate(-270, 215);
              photonB.setPoyntingFromPath(2);

              setTimeout(callback, 1000);
            })
          });
        });
      }
    }
  }
);

// Step 4: Introduce amplitude windows
tutorial.addStep(
  { // Explain last animation and give option to go back
    back: function() {},
    msg: TEXT['second-way-both-transmitted'],
    trigger: 'next'
  },
  { // Introduce amplitude windows
    animation: function(callback) {
      ampA.show(500);
      ampB.show(500);
      amp1.show(500);
      setTimeout(callback, 1000);
    },
    skip: function() {
      ampA.show(0);
      ampB.show(0);
      amp1.show(0);
    }
  },
  { // Introduce amplitude boxes
    msg: TEXT['intro-amp-boxes'],
    blink: [
      {object: ampA, hold: true},
      {object: ampB, hold: true},
      {object: amp1, hold: true}
    ],
    trigger: 'next'
  }
);

// Step 5: Determine first amplitude for photon A
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['determine-amp-A'],
    blink: [
      {object: ampA, hold: true},
      {object: sourceA, hold: true}
    ],
    trigger: 'play'
  },
  { // Send Photon A to the beam splitter
    animation: function(callback) {
      sourceA.emit();
      ampA.animateRotation({
        time: 1.5,
        distance: 150
      });
      photonA.shoot(1.5, 150, function() {
        ampA.animateRotation({
          time: 0.25,
          distance: 25
        })
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, callback);
      });
    }
  },
  { // Explain photon A is at beam splitter
    msg: TEXT['photon-A-reaches-center'],
    trigger: 'next'
  },
  { // Shrink amplitude of Photon A's arrow
    animation: function(callback) {
      ampA.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude change
    msg: TEXT['shrink-amp'],
    trigger: 'next',
    blink: [{object: ampA, hold: true}]
  },
  { // Send Photon A to detector C
    animation: function(callback) {
      ampA.animateRotation({
        time: 0.25,
        distance: 25
      });
      photonA.setPoyntingFromPath(3);
      photonA.shoot(0.25, lightPaths[3].length, function() {
        ampA.animateRotation({
          time: 1.5,
          distance: 150
        });
        photonA.setPoyntingFromPath(4);
        photonA.shoot(1.5, 150, function() {
          detectorC.detect();

          photonA.translate(-260, 0);
          photonA.setPoyntingFromPath(0);

          setTimeout(callback, 1000);
        });
      });
    },
    skip: function() {
      ampA.setAmplitude(Math.pow(0.5, 0.5));
      ampA.rotate(310);
    }
  }
);

// Step 6: Determine arrow for Photon B
tutorial.addStep(
  { // Prompt animation
    back: function() {
      ampA.rotate(-ampA.theta);
      ampA.setAmplitude(1);
      sourceB.blinkOff();
      ampB.blinkOff();
    },
    blink: [
      {object: ampB, hold: true},
      {object: sourceB, hold: true}
    ],
    msg: TEXT['determine-amp-B'],
    trigger: 'play'
  },
  { // Send photon B to center
    animation: function(callback) {
      sourceB.emit();
      ampB.animateRotation({
        time: 1.75,
        distance: 175
      });
      photonB.shoot(1.75, 175, callback)
    }
  },
  { // Explain Photon B reaches center
    msg: TEXT['photon-B-reaches-center'],
    trigger: 'next'
  },
  { // Explain we know which detector it will go to
    blink: [
      {object: detectorD, hold: true},
      {object: ampB, hold: true}
    ],
    msg: TEXT['know-photon-B-goes-to-D'],
    trigger: 'next'
  },
  { // Rotate Photon B's arrow for reflection
    animation: function(callback) {
      ampB.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain arrow rotation
    blink: [{object: ampB, hold: true}],
    msg: TEXT['reflected-outside-glass'],
    trigger: 'next'
  },
  { // Send Photon B to Detector D
    animation: function(callback) {
      ampB.animateRotation({
        time: 1.75,
        distance: 175
      })
      photonB.setPoyntingFromPath(5);
      photonB.shoot(1.75, 175, function() {
        detectorD.detect();

        photonB.translate(-280, 0);
        photonB.setPoyntingFromPath(2);

        setTimeout(callback, 1000);
      });
    },
    skip: function() {
      ampB.rotate(130);
    }
  }
);

// Step 7: Multiply arrows to determine arrow for path
tutorial.addStep(
  { // Prompt multiplication
    back: function() {
      ampB.rotate(-ampB.theta);
    },
    msg: TEXT['now-multiply-reflection'],
    trigger: 'next'
  },
  { // Addition of clock times
    animation: function(callback) {
      // Creating multiplication layer
      multiplier.createMultiplicationLayer(ampA, ampB, amp1);
      // Copying Photon A's amplitude
      amp1.copyAmplitude(ampA, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain copying the arrow
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Animate addition of clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain addition of clock times
    msg: TEXT['add-to-2-30'],
    trigger: 'next'
  },
  { // Animate multiplication of amplitudes
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain multiplication
    msg: TEXT['multiply-amps'],
    trigger: 'next',
    skip: function() {
      amp1.setAmplitude(Math.pow(0.5, 0.5));
      amp1.rotate(80);
    }
  }
);

// Step 8: Introduce arrow for both photons getting transmitted
tutorial.addStep(
  { // Prompt animation and give option to go back
    back: function() {
      amp1.clearAmplitude();
      amp1.blinkOff();
      multiplier.removeMultiplicationLayer();
    },
    blink: [{object: amp1, hold: true}],
    msg: TEXT['determined-amplitude-both-reflected'],
    trigger: 'next'
  },
  { // Move window over
    animation: function(callback) {
      ampA.clearAmplitude();
      ampB.clearAmplitude();

      multiplier.removeMultiplicationLayer();

      amp1.animateTo(3, 825, 470);

      setTimeout(function() { amp2.show(500); }, 4000);
      setTimeout(function() {
        ampA.setAmplitude(1);
        ampB.setAmplitude(1);
        callback();
      }, 5000);
    }
  },
  { // Highlight
    blink: [{object: amp2, hold: true}],
    msg: TEXT['determine-amplitde-both-transmitted'],
    trigger: 'next',
    skip: function() {
      amp1.animateTo(0, 825, 470);
      amp2.show(0);
      ampA.setAmplitude(1);
      ampA.rotate(-ampA.theta);
      ampB.rotate(-ampB.theta);
    }
  }
);

// Step 9: Determine amplitude for photon A
tutorial.addStep(
  { // Prompt animation
    blink: [
      {object: sourceA, hold: true},
      {object: ampA, hold: true}
    ],
    msg: TEXT['determine-amp-A'],
    trigger: 'play'
  },
  { // Send photon A to splitter
    animation: function(callback) {
      sourceA.emit();
      ampA.animateRotation({
        time: 1.5,
        distance: 150
      });
      photonA.shoot(1.5, 150, function() {
        ampA.animateRotation({
          time: 0.25,
          distance: 25
        });
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, callback);
      });
    }
  },
  { // Point out photon is in center
    msg: TEXT['photon-A-reaches-center'],
    trigger: 'next'
  },
  { // Shrink amplitude
    animation: function(callback) {
      ampA.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude change
    blink: [{object: ampA, hold: true}],
    msg: TEXT['shrink-amp'],
    trigger: 'next'
  },
  { // Send Photon A to Detector D
    animation: function(callback) {
      ampA.animateRotation({
        time: 1.75,
        distance: 175
      });
      photonA.setPoyntingFromPath(5);
      photonA.shoot(1.75, 175, function() {
        detectorD.detect();

        photonA.translate(-270, -215);
        photonA.setPoyntingFromPath(0);

        setTimeout(callback, 1000);
      });
    },
    skip: function() {
      ampA.setAmplitude(Math.pow(0.5, 0.5));
      ampA.rotate(310);
    }
  }
);

// Step 10: Determine Photon B's arrow
tutorial.addStep(
  { // Prompt animation
    back: function() {
      ampA.rotate(-ampA.theta);
      ampA.setAmplitude(1);
      ampB.blinkOff();
      sourceB.blinkOff();
    },
    blink: [
      {object: ampB, hold: true},
      {object: sourceB, hold: true}
    ],
    msg: TEXT['determine-amp-B'],
    trigger: 'play'
  },
  { // Send photon B to center
    animation: function(callback) {
      sourceB.emit();
      ampB.animateRotation({
        time: 1.75,
        distance: 175
      });
      photonB.shoot(1.75, 175, callback)
    }
  },
  { // Explain Photon B reaches center
    msg: TEXT['photon-B-reaches-center'],
    trigger: 'next'
  },
  { // Explain we know which detector it will go to
    blink: [
      {object: detectorC, hold: true},
      {object: ampB, hold: true}
    ],
    msg: TEXT['know-photon-B-goes-to-C'],
    trigger: 'next'
  },
  { // Send Photon B to Detector C
    animation: function(callback) {
      ampB.animateRotation({
        time: 0.25,
        distance: 25
      });
      photonB.setPoyntingFromPath(3);
      photonB.shoot(0.25, lightPaths[3].length, function() {
        ampB.animateRotation({
          time: 1.5,
          distance: 150
        });
        photonB.setPoyntingFromPath(4);
        photonB.shoot(1.5, 150, function() {
          detectorC.detect();

          photonB.translate(-270, 215);
          photonB.setPoyntingFromPath(2);

          setTimeout(callback, 1000);
        })
      });
    },
    skip: function() {
      ampB.rotate(310);
    }
  }
);

// Step 11: Determine amplitude for both photons getting transmitted
tutorial.addStep(
  { // Prompt multiplication
    back: function() {
      ampB.rotate(-ampB.theta);
    },
    msg: TEXT['now-multiply-reflection'],
    trigger: 'next'
  },
  { // Addition of clock times
    animation: function(callback) {
      // Creating multiplication layer
      multiplier.createMultiplicationLayer(ampA, ampB, amp2);
      // Copying Photon A's amplitude
      amp2.copyAmplitude(ampA, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain copying the arrow
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Animate addition of clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain addition of clock times
    msg: TEXT['add-to-8-30'],
    trigger: 'next'
  },
  { // Animate multiplication of amplitudes
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain multiplication
    msg: TEXT['multiply-amps'],
    trigger: 'next',
    skip: function() {
      amp2.setAmplitude(Math.pow(0.5, 0.5));
      amp2.rotate(260);
    }
  }
);

// Step 12: Add amplitudes
tutorial.addStep(
  { // Prompt animation and give option to go back
    back: function() {
      amp2.clearAmplitude();
      amp2.blinkOff();
      multiplier.removeMultiplicationLayer();
    },
    blink: [{object: amp2, hold: true}],
    msg: TEXT['determined-amplitude-both-transmitted'],
    trigger: 'next'
  },
  { // Show addition window
    animation: function(callback) {
      ampA.hide(true);
      ampB.hide(true);

      addBox.show(500);
      setTimeout(callback, 1000);
    }
  },
  { // Explain addition box
    blink: [
      {object: addBox, hold: true},
      {object: amp1, hold: true},
      {object: amp2, hold: true}
    ],
    msg: TEXT['intro-add-box'],
    trigger: 'next'
  },
  { // Add amplitudes
    animation: function(callback) {
      addBox.addAmplitudes(amp2, amp1, callback);
    },
    skip: function() {
      ampA.hide();
      ampA.setAmplitude(1);
      ampA.rotate(-ampA.theta);

      ampB.hide();
      ampB.setAmplitude(1);
      ampB.rotate(-ampB.theta);
    }
  }
);

// Step 13: Reset for next part of the exercise
tutorial.addStep(
  { // Explain zero probability
    back: function() {
      ampA.show(0);
      ampB.show(0);

      addBox.reset();
      addBox.hide();
      addBox.resetBlink();
    },
    blink: [{object: addBox, hold: true}],
    msg: TEXT['zero-probability'],
    trigger: 'next'
  },
  { // Hide add box
    animation: function(callback) {
      addBox.hide(true);
      amp1.hide(true);
      amp2.hide(true);

      setTimeout(function() {
        ampA.setAmplitude(1);
        ampA.rotate(-ampA.theta);

        ampB.rotate(-ampB.theta);

        amp1.resetPosition();
        amp1.clearAmplitude();
        amp1.setLabel('Photons go to C', 18);

        amp2.clearAmplitude();
        amp2.setLabel('Photons go to D', 18);
      }, 1000);

      setTimeout(function() {
        ampA.show(500);
        ampB.show(500);
        amp1.show(500);
      }, 1500);

      setTimeout(callback, 2500);
    },
    skip: function() {
      ampA.show(0);
      ampB.show(0);

      amp1.resetPosition();
      amp1.clearAmplitude();
      amp1.setLabel('Photons go to C', 18);
      amp1.show(0);

      amp2.clearAmplitude();
      amp2.setLabel('Photons go to D', 18);
      amp2.hide();
    }
  },
  { // Prompt animation
    blink: [
      {object: amp1, hold: true},
      {object: detectorC, hold: true}
    ],
    msg: TEXT['determine-both-going-to-C'],
    trigger: 'next'
  }
);

// Step 14: Send Photon A to Detector C
tutorial.addStep(
  { // Prompt animation
    blink: [
      {object: sourceA, hold: true},
      {object: ampA, hold: true}
    ],
    msg: TEXT['determine-amp-A'],
    trigger: 'play'
  },
  { // Send Photon A to the beam splitter
    animation: function(callback) {
      sourceA.emit();
      ampA.animateRotation({
        time: 1.5,
        distance: 150
      });
      photonA.shoot(1.5, 150, function() {
        ampA.animateRotation({
          time: 0.25,
          distance: 25
        })
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, callback);
      });
    }
  },
  { // Explain photon A is at beam splitter
    msg: TEXT['photon-A-reaches-center'],
    trigger: 'next'
  },
  { // Shrink amplitude of Photon A's arrow
    animation: function(callback) {
      ampA.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude change
    msg: TEXT['shrink-amp'],
    trigger: 'next',
    blink: [{object: ampA, hold: true}]
  },
  { // Send Photon A to detector C
    animation: function(callback) {
      ampA.animateRotation({
        time: 0.25,
        distance: 25
      });
      photonA.setPoyntingFromPath(3);
      photonA.shoot(0.25, lightPaths[3].length, function() {
        ampA.animateRotation({
          time: 1.5,
          distance: 150
        });
        photonA.setPoyntingFromPath(4);
        photonA.shoot(1.5, 150, function() {
          detectorC.detect();

          photonA.translate(-260, 0);
          photonA.setPoyntingFromPath(0);

          setTimeout(callback, 1000);
        });
      });
    },
    skip: function() {
      ampA.setAmplitude(Math.pow(0.5, 0.5));
      ampA.rotate(310);
    }
  }
);

// Step 15: Send Photon B to Detector C
tutorial.addStep(
  { // Prompt animation
    back: function() {
      ampA.rotate(-ampA.theta);
      ampA.setAmplitude(1);
      ampB.blinkOff();
      sourceB.blinkOff();
    },
    blink: [
      {object: ampB, hold: true},
      {object: sourceB, hold: true}
    ],
    msg: TEXT['determine-amp-B'],
    trigger: 'play'
  },
  { // Send photon B to center
    animation: function(callback) {
      sourceB.emit();
      ampB.animateRotation({
        time: 1.75,
        distance: 175
      });
      photonB.shoot(1.75, 175, callback)
    }
  },
  { // Explain Photon B reaches center
    msg: TEXT['photon-B-reaches-center'],
    trigger: 'next'
  },
  { // Explain we know which detector it will go to
    blink: [
      {object: detectorC, hold: true},
      {object: ampB, hold: true}
    ],
    msg: TEXT['know-both-photons-B-goes-to-C'],
    trigger: 'next'
  },
  { // Send Photon B to Detector C
    animation: function(callback) {
      ampB.animateRotation({
        time: 0.25,
        distance: 25
      });
      photonB.setPoyntingFromPath(3);
      photonB.shoot(0.25, lightPaths[3].length, function() {
        ampB.animateRotation({
          time: 1.5,
          distance: 150
        });
        photonB.setPoyntingFromPath(4);
        photonB.shoot(1.5, 150, function() {
          detectorC.detect();

          photonB.translate(-270, 215);
          photonB.setPoyntingFromPath(2);

          setTimeout(callback, 1000);
        })
      });
    },
    skip: function() {
      ampB.rotate(310);
    }
  }
);

// Step 16: Multiply arrows to determine arrow for both going to C
tutorial.addStep(
  { // Prompt multiplication
    back: function() {
      ampB.rotate(-ampB.theta);
    },
    msg: TEXT['now-multiply-both-go-to-C'],
    trigger: 'next'
  },
  { // Addition of clock times
    animation: function(callback) {
      // Creating multiplication layer
      multiplier.createMultiplicationLayer(ampA, ampB, amp1);
      // Copying Photon A's amplitude
      amp1.copyAmplitude(ampA, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain copying the arrow
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Animate addition of clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain addition of clock times
    msg: TEXT['add-to-8-30'],
    trigger: 'next'
  },
  { // Animate multiplication of amplitudes
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain multiplication
    msg: TEXT['multiply-amps'],
    trigger: 'next',
    skip: function() {
      amp1.setAmplitude(Math.pow(0.5, 0.5));
      amp1.rotate(260);
    }
  }
);

// Step 17: Introduce arrow for both photons getting transmitted
tutorial.addStep(
  { // Prompt animation and give option to go back
    back: function() {
      amp1.clearAmplitude();
      amp1.blinkOff();
      multiplier.removeMultiplicationLayer();
    },
    blink: [{object: amp1, hold: true}],
    msg: TEXT['determined-amplitude-both-at-C'],
    trigger: 'next'
  },
  { // Move window over
    animation: function(callback) {
      ampA.clearAmplitude();
      ampB.clearAmplitude();

      multiplier.removeMultiplicationLayer();

      amp1.animateTo(3, 825, 470);

      setTimeout(function() { amp2.show(500); }, 4000);
      setTimeout(function() {
        ampA.setAmplitude(1);
        ampB.setAmplitude(1);
        callback();
      }, 5000);
    }
  },
  { // Highlight
    blink: [
      {object: amp2, hold: true},
      {object: detectorD, hold: true}
    ],
    msg: TEXT['determine-amplitde-both-go-to-D'],
    trigger: 'next',
    skip: function() {
      amp1.animateTo(0, 825, 470);
      amp2.show(0);
      ampA.setAmplitude(1);
      ampA.rotate(-ampA.theta);
      ampB.rotate(-ampB.theta);
    }
  }
);

// Step 18: Determine amplitude for photon A
tutorial.addStep(
  { // Prompt animation
    blink: [
      {object: sourceA, hold: true},
      {object: ampA, hold: true}
    ],
    msg: TEXT['determine-amp-A'],
    trigger: 'play'
  },
  { // Send photon A to splitter
    animation: function(callback) {
      sourceA.emit();
      ampA.animateRotation({
        time: 1.5,
        distance: 150
      });
      photonA.shoot(1.5, 150, function() {
        ampA.animateRotation({
          time: 0.25,
          distance: 25
        });
        photonA.setPoyntingFromPath(1);
        photonA.shoot(0.25, lightPaths[1].length, callback);
      });
    }
  },
  { // Point out photon is in center
    msg: TEXT['photon-A-reaches-center'],
    trigger: 'next'
  },
  { // Shrink amplitude
    animation: function(callback) {
      ampA.shrinkAmplitude();
      setTimeout(callback, 500);
    }
  },
  { // Explain amplitude change
    blink: [{object: ampA, hold: true}],
    msg: TEXT['shrink-amp'],
    trigger: 'next'
  },
  { // Send Photon A to Detector D
    animation: function(callback) {
      ampA.animateRotation({
        time: 1.75,
        distance: 175
      });
      photonA.setPoyntingFromPath(5);
      photonA.shoot(1.75, 175, function() {
        detectorD.detect();

        photonA.translate(-270, -215);
        photonA.setPoyntingFromPath(0);

        setTimeout(callback, 1000);
      });
    },
    skip: function() {
      ampA.setAmplitude(Math.pow(0.5, 0.5));
      ampA.rotate(310);
    }
  }
);

// Step 19: Determine arrow for Photon B
tutorial.addStep(
  { // Prompt animation
    back: function() {
      ampA.rotate(-ampA.theta);
      ampA.setAmplitude(1);
      sourceB.blinkOff();
      ampB.blinkOff();
    },
    blink: [
      {object: ampB, hold: true},
      {object: sourceB, hold: true}
    ],
    msg: TEXT['determine-amp-B'],
    trigger: 'play'
  },
  { // Send photon B to center
    animation: function(callback) {
      sourceB.emit();
      ampB.animateRotation({
        time: 1.75,
        distance: 175
      });
      photonB.shoot(1.75, 175, callback)
    }
  },
  { // Explain Photon B reaches center
    msg: TEXT['photon-B-reaches-center'],
    trigger: 'next'
  },
  { // Explain we know which detector it will go to
    blink: [
      {object: detectorD, hold: true},
      {object: ampB, hold: true}
    ],
    msg: TEXT['know-photon-B-goes-to-D'],
    trigger: 'next'
  },
  { // Rotate Photon B's arrow for reflection
    animation: function(callback) {
      ampB.addSixHours();
      setTimeout(callback, 500);
    }
  },
  { // Explain arrow rotation
    blink: [{object: ampB, hold: true}],
    msg: TEXT['reflected-outside-glass'],
    trigger: 'next'
  },
  { // Send Photon B to Detector D
    animation: function(callback) {
      ampB.animateRotation({
        time: 1.75,
        distance: 175
      })
      photonB.setPoyntingFromPath(5);
      photonB.shoot(1.75, 175, function() {
        detectorD.detect();

        photonB.translate(-280, 0);
        photonB.setPoyntingFromPath(2);

        setTimeout(callback, 1000);
      });
    },
    skip: function() {
      ampB.rotate(130);
    }
  }
);

// Step 20: Multiply arrows to determine arrow for path
tutorial.addStep(
  { // Prompt multiplication
    back: function() {
      ampB.rotate(-ampB.theta);
    },
    msg: TEXT['now-multiply-both-go-to-D'],
    trigger: 'next'
  },
  { // Addition of clock times
    animation: function(callback) {
      // Creating multiplication layer
      multiplier.createMultiplicationLayer(ampA, ampB, amp2);
      // Copying Photon A's amplitude
      amp2.copyAmplitude(ampA, true);
      setTimeout(callback, 1000);
    }
  },
  { // Explain copying the arrow
    msg: TEXT['copy-arrow'],
    trigger: 'next'
  },
  { // Animate addition of clock times
    animation: function(callback) {
      multiplier.animateOperation('addition', callback);
    }
  },
  { // Explain addition of clock times
    msg: TEXT['add-to-2-30'],
    trigger: 'next'
  },
  { // Animate multiplication of amplitudes
    animation: function(callback) {
      multiplier.animateOperation('multiplication', callback);
    }
  },
  { // Explain multiplication
    msg: TEXT['multiply-amps'],
    trigger: 'next',
    skip: function() {
      amp2.setAmplitude(Math.pow(0.5, 0.5));
      amp2.rotate(80);
    }
  }
);

// Step 21: Conclusion
tutorial.addStep(
  { // Fade out A's and B's arrow
    animation: function(callback) {
      ampA.hide(true);
      ampB.hide(true);
      setTimeout(callback, 1000);
    }
  },
  { // Conclusion
    blink: [
      {object: amp1, hold: true},
      {object: amp2, hold: true}
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
  PHOTON._INTRO_MESSAGE = "Welcome to the exercise on<br>"+
    "the Hong-Ou-Mandel effect.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1100, 750);
});
