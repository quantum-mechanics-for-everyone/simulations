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

Linear Polarization Experiment 4:
---------------------------------
Introduction to the polarization rotator

This program uses the PHOTON engine to
render an exercise which introduces users
to a polarization rotator

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
scene.placeCamera(-150, 100, 400, -50, 0, 0);
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 1000,
  position: new THREE.Vector3(-300, 300, 100)
});
scene.addPointLight({
  name: 'scene-light',
  color: 0xffff99,
  decay: 800,
  position: new THREE.Vector3(200, 300, 100)
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
var msg = new PHOTON.MessageBox(10, 520, 450, 270);
app.add(msg, true);

// Polarization indicator
var indicator = new PHOTON.PolarizationIndicator(490, 530);
app.add(indicator, true);

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

// Polarizer
var polarizers = [
  new PHOTON.Polarizer(),
  new PHOTON.Polarizer()
];
polarizers[0].translate(-200, 300, 0);
polarizers[1].translate(200, 300, 0);

// Screen
var screen = new PHOTON.Screen3D();
screen.putInXZPlane('-x');
screen.translate(300, 300, 0);

// LightPaths
var lightPaths = PHOTON.lightPaths;

// Photon
var photon = new PHOTON.Photon3D();
photon.setPoyntingVector(1, 0);
photon.polarize('random');
photon.translate(-300, 300, 0);

// Polarization rotator
var rotators = [
  new PHOTON.PolarizationRotator(90)
];
rotators[0].translate(0, 300, 0);

//== TEXT FOR EXPERIMENT ==//

var TEXT = {
  'welcome':
    "Welcome to the fourth exercise on photon polarization. Press the cyan help "+
    "button for more information about how to use the application. Press NEXT "+
    "to continue.",
  'polarization-indicator':
    "For this exercise, we have included a window to the right which displays the "+
    "photon's polarization. Press NEXT to continue.",
  'initial-components':
    "We will begin with a photon source will send photons through two polarizers "+
    "onto a screen. Press NEXT to continue.",
  'introduce-rotator':
    "In the photon will also travel through an optical component called a polarization "+
    "rotator. This component will rotate the photon's polarization 90&deg. Press the green "+
    "play button to send a photon from the source towards the screen.",
  'vertical-polarization':
    "After the photon passes through the first polarizer, it becomes vertically polarized. "+
    "Press NEXT to coninue",
  'horizontal-polarization':
    "As the photon passes through the polarization rotator, its polarization rotates "+
    "90 degrees. So now the photon is horizontally polarized. Press NEXT to continue.",
  'photon-blocked':
    "The horizontally blocked photon is blocked by the vertical polarizer and does "+
    "not reach the screen. Press BACK if you would like to see the animation again. "+
    "Press NEXT to continue.",
  'split-rotator':
    "Now we have split the polarization rotator into two parts. Press the green "+
    "play button to send another photon into the rotator.",
  'polarized-45-deg':
    "After the photon passes through half of the rotator, it is polarized 45&deg "+
    "from the vertical. This is due to the fact that the angle the photon's polarization "+
    "rotates is directly proportional to the length of the polarization rotator. Press "+
    "NEXT to continue.",
  'photon-blocked-again':
    "Once again, the photon comes out of the polarization rotator with horizontal "+
    "polarization and is blocked by the vertical polarizer. Press BACK if you want to "+
    "see the animation again. Press NEXT to continue.",
  'added-polarizer':
    "Now we have added a third vertical polarizer in between the two halves of the "+
    "polarization rotator. Press the green play button to send the photon into the "+
    "new setup.",
  'non-zero-probability':
    "As you can see above, after we place a polarizer between the two halves of the "+
    "polarization rotator, there is a non-zero probability that the photon will make "+
    "it to the screen."+
    "<br><br>"+
    "This is due to the fact that once the middle polarizer gets added, the photon is no longer "+
    "horizontally polarized when it reaches the third polarizer."+
    "<br><br>"+
    "Press BACK if you would like to see the animation again. Press NEXT to continue.",
  'split-rotators-again':
    "Now we have removed the middle polarizer and split the polarization rotator into "+
    "four separate pieces. Press the green play button to shoot a photon through this "+
    "setup.",
  'added-polarizers':
    "Now we have added polarizers in between each part of the polarization rotator. "+
    "Press the green play button to send a photon through the setup and see the result.",
  'conclusion':
    "Since we added polarizers between the parts of the polarization rotator, there "+
    "is a non-zero probability the photon makes it to the screen. The more parts we "+
    "divide the polarization rotator into, the higher the probability the photon will "+
    "make it to the screen."+
    "<br><br>"+
    "This concludes this exercise. Press BACK if you want to see the last "+
    "animation again."
}

//== TUTORIAL SETUP ==//

var tutorial = new PHOTON.Tutorial();

// Introduce components for exercise
tutorial.addStep(
  { // Welcome message
    blink: [{object: btHelp, hold: true}],
    msg: TEXT['welcome'],
    trigger: 'next'
  },
  { // Introduce polarization indicator
    msg: TEXT['polarization-indicator'],
    trigger: 'next',
    blink: [{object: indicator, hold: true}]
  },
  { // Move in source and screen
    animation: function(callback) {
      source.move(1, [0, -300, 0]);
      screen.move(1, [0, -300, 0]);
      polarizers[0].move(1, [0, -300, 0]);
      polarizers[1].move(1, [0, -300, 0], function() {
        photon.translate(0, -300, 0);
        var path = new PHOTON.LightPath3D(-300, 0, -290, 0);
        source.blink();
        path.animateLengthChange(0.5, 590, callback);
      });
    },
    skip: function() {
      photon.translate(0, -300, 0);
      source.translate(0, -300, 0);
      screen.translate(0, -300, 0);
      polarizers[0].translate(0, -300, 0);
      polarizers[1].translate(0, -300, 0);
      var path = new PHOTON.LightPath3D(-300, 0, 300, 0);
    }
  },
  { // Explain source and screen
    labels: [
      {object: source, dx: -90, dy: 150},
      {object: screen, dx: -70, dy: 140},
      {object: polarizers[0], dx: -80, dy: 160},
      {object: polarizers[1], dx: -90, dy: 140}
    ],
    msg: TEXT['initial-components'],
    trigger: 'next'
  },
  { // Move in polarization rotator
    animation: function(callback) {
      rotators[0].move(1, [0, -300, 0], function() {
        lightPaths[0].changeLength(-100);
        callback();
      });
    },
    skip: function() {
      rotators[0].translate(0, -300, 0);
      lightPaths[0].changeLength(-100);
    }
  }
);

// Step 1: Send photon through polarization rotator for the first time
tutorial.addStep(
  { // Introduce polarizer
    labels: [
      {object: rotators[0], dx: -100, dy: 125}
    ],
    msg: TEXT['introduce-rotator'],
    trigger: 'play'
  },
  { // Send photon through first polarizer
    removeLabels: true,
    animation: function(callback) {
      source.blink();
      photon.shoot(2, 100, function() {
        photon.polarize(0);
        photon.shoot(1, 50, function() {
          scene.moveCamera(3, -150, 50, 150, -150, 0, 0, callback);
        })
      })
    }
  },
  { // Point out vertical polarization
    blink: [{object: indicator, hold: true}],
    msg: TEXT['vertical-polarization'],
    trigger: 'next'
  },
  { // Send photon through rotator
    animation: function(callback) {
      scene.moveCamera(3, 0, 100, 300, 0, 0, 0, function() {
        photon.shoot(1.2, 60, function() {
          photon.rotatePolarization(3.6, Math.PI/2);
          photon.shoot(3.6, 180, function() {
            photon.shoot(1.2, 60, function() {
              scene.moveCamera(3, 120, 50, 150, 150, 0, 0, callback)
            });
          });
        })
      })
    }
  },
  { // Point out horizontal polarization
    blink: [{object: indicator, hold: true}],
    msg: TEXT['horizontal-polarization'],
    trigger: 'next'
  },
  { // Animate photon into polarizer
    animation: function(callback) {
      scene.moveCamera(3, 120, 100, 250, 200, 0, 0, function() {
        photon.shoot(1.2, 60, function() {
          photon.polarize('random');
          photon.translate(-510, 0, 0);
          screen.illuminate(0);
          callback();
        });
      });
    },
    skip: function() {
      scene.placeCamera(120, 100, 250, 200, 0, 0);
    }
  }
);

// Step 2: Divide polarizer in two
tutorial.addStep(
  { // Explain photon got blocked and give option to go back
    back: function() {
      scene.placeCamera(-150, 100, 400, -50, 0, 0);
      source.addLabel(-90, 150);
      screen.addLabel(-70, 140);
      polarizers[0].addLabel(-80, 160);
      polarizers[1].addLabel(-90, 140);
    },
    msg: TEXT['photon-blocked'],
    trigger: 'next'
  },
  { // Move components back into view then split rotator
    animation: function(callback) {
      scene.moveCamera(3, -150, 100, 400, -50, 0, 0, function() {
        screen.reset();
        rotators[0].remove();
        rotators = [
          new PHOTON.PolarizationRotator(45),
          new PHOTON.PolarizationRotator(45)
        ];
        rotators[0].translate(-45, 0, 0);
        rotators[1].translate(45, 0, 0);
        rotators[0].move(2, [-50, 0, 0]);
        rotators[1].move(2, [50, 0, 0], callback);
      });
    },
    skip: function() {
      scene.placeCamera(-150, 100, 400, -50, 0, 0);
      rotators[0].remove();
      rotators = [
        new PHOTON.PolarizationRotator(45),
        new PHOTON.PolarizationRotator(45)
      ];
      rotators[0].translate(-95, 0, 0);
      rotators[1].translate(95, 0, 0);
    }
  }
);

// Step 3: Shoot photon into split polarizer
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['split-rotator'],
    trigger: 'play'
  },
  { // Send photon halfway through the rotator
    animation: function(callback) {
      source.blink();
      photon.shoot(2, 100, function() {
        photon.polarize(0);
        photon.shoot(1.2, 60, function() {
          photon.rotatePolarization(1.8, Math.PI/4);
          photon.shoot(2.8, 140, function() {
            scene.moveCamera(3, -50, 50, 150, 0, 0, 0, callback);
          });
        });
      });
    }
  },
  { // Explain 45 deg polarization
    msg: TEXT['polarized-45-deg'],
    blink: [{object: indicator, hold: true}],
    trigger: 'next'
  },
  { // Sending photon into polarizer again
    animation: function(callback) {
      scene.moveCamera(3, -150, 100, 400, -50, 0, 0, function() {
        photon.shoot(1, 50, function() {
          photon.rotatePolarization(1.8, Math.PI/4);
          photon.shoot(3.2, 160, function() {
            photon.polarize('random');
            photon.translate(-510, 0, 0);
            screen.illuminate(0);
            callback();
          });
        });
      });
    }
  }
);

// Step 4: Introduce new polarizer
tutorial.addStep(
  { // Explain photon is blocked again
    back: function(){ screen.reset(); },
    msg: TEXT['photon-blocked-again'],
    trigger: 'next'
  },
  { // Introduce polarizer
    animation: function(callback) {
      screen.reset();
      polarizers.push(new PHOTON.Polarizer());
      polarizers[2].translate(0, 300, 0);
      polarizers[2].move(1, [0, -300, 0], function() {
        lightPaths[0].changeLength(100);
        callback();
      });
    },
    skip: function() {
      polarizers.push(new PHOTON.Polarizer());
      lightPaths[0].changeLength(100);
    }
  }
);

// Step 5: Send photon through setup with 3 polarizers
tutorial.addStep(
  { // Explain polarizer and prompt animation
    msg: TEXT['added-polarizer'],
    trigger: 'play'
  },
  { // Send photon through setup
    animation: function(callback) {
      photon.shoot(2, 100, function() {
        photon.polarize(0);
        photon.shoot(1.2, 60, function() {
          photon.rotatePolarization(1.8, Math.PI/4);
          photon.shoot(2.8, 140, function() {
            photon.polarize(0);
            photon.shoot(1, 50, function() {
              photon.rotatePolarization(1.8, Math.PI/4);
              photon.shoot(3, 150, function() {
                photon.polarize(0);
                photon.shoot(2.2, 110, function() {
                  screen.illuminate(0.25);
                  photon.polarize('random');
                  photon.translate(-610, 0, 0);
                  scene.moveCamera(3, 210, 10, 100, 350, 0, 0, callback);
                })
              });
            });
          });
        });
      });
    },
    skip: function() {
      screen.illuminate(0.25);
      scene.placeCamera(210, 10, 100, 350, 0, 0);
    }
  }
);

// Step 6: Explain non-zero probability and split rotator again
tutorial.addStep(
  { // Explain non-zero probability
    back: function() {
      screen.reset();
      scene.placeCamera(-150, 100, 400, -50, 0, 0);
    },
    msg: TEXT['non-zero-probability'],
    trigger: 'next'
  },
  { // Split the rotator again
    animation: function(callback) {
      scene.moveCamera(3, -40, 100, 400, -15, 0, 0, function() {
        screen.reset();
        lightPaths[0].changeLength(-100);
        // Removing polarizer
        polarizers[2].move(1, [0, 300, 0]);
        // Splitting rotators
        rotators[0].remove();
        rotators[1].remove();
        rotators = [];
        for(var i = 0; i < 4; i++)
          rotators.push(new PHOTON.PolarizationRotator(22.5));
        rotators[0].translate(-117.5, 0, 0);
        rotators[1].translate(-72.5, 0, 0);
        rotators[2].translate(72.5, 0, 0);
        rotators[3].translate(117.5, 0, 0);
        rotators[0].move(2, [-25, 0, 0]);
        rotators[1].move(2, [25, 0, 0]);
        rotators[2].move(2, [-25, 0, 0]);
        rotators[3].move(2, [25, 0, 0], callback);
      });
    },
    skip: function() {
      screen.reset();
      lightPaths[0].changeLength(-100);
      scene.placeCamera(-40, 100, 400, -15, 0, 0);
      polarizers[2].translate(0, 300, 0);
      rotators[0].remove();
      rotators[1].remove();
      rotators = [];
      for(var i = 0; i < 4; i++)
        rotators.push(new PHOTON.PolarizationRotator(22.5));
      rotators[0].translate(-142.5, 0, 0);
      rotators[1].translate(-47.5, 0, 0);
      rotators[2].translate(47.5, 0, 0);
      rotators[3].translate(142.5, 0, 0);
    }
  }
);

// Step 7: Shoot photon through 4 rotators without polarizers between them
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['split-rotators-again'],
    trigger: 'play'
  },
  { // Animate photon
    animation: function(callback) {
      source.blink();
      photon.shoot(2, 100, function() {
        photon.polarize(0);
        photon.shoot(0.7, 35, function() {
          photon.rotatePolarization(0.9, Math.PI/8);
          photon.shoot(1.9, 95, function() {
            photon.rotatePolarization(0.9, Math.PI/8);
            photon.shoot(1.9, 95, function() {
              photon.rotatePolarization(0.9, Math.PI/8);
              photon.shoot(1.9, 95, function() {
                photon.rotatePolarization(0.9, Math.PI/8);
                photon.shoot(1.8, 90, function() {
                  photon.polarize('random');
                  photon.translate(-510, 0, 0);
                  screen.illuminate(0);
                  callback();
                });
              });
            });
          });
        });
      });
    }
  }
);

// Step 8: Add polarizers between each rotator
tutorial.addStep(
  { // Explain zero probability
    back: function() { screen.reset(); },
    msg: TEXT['photon-blocked-again'],
    trigger: 'next'
  },
  { // Introduce new polarizers
    animation: function(callback) {
      screen.reset();
      polarizers.push(new PHOTON.Polarizer());
      polarizers.push(new PHOTON.Polarizer());
      polarizers[3].translate(-100, 300, 0);
      polarizers[4].translate(100, 300, 0);
      polarizers[2].move(1, [0, -300, 0]);
      polarizers[3].move(1, [0, -300, 0]);
      polarizers[4].move(1, [0, -300, 0], function() {
        lightPaths[0].changeLength(100);
        callback();
      });
    },
    skip: function() {
      lightPaths[0].changeLength(100);
      screen.reset();
      polarizers.push(new PHOTON.Polarizer());
      polarizers.push(new PHOTON.Polarizer());
      polarizers[2].translate(0, -300, 0);
      polarizers[3].translate(-100, 0, 0);
      polarizers[4].translate(100, 0, 0);
    }
  }
);

// Step 9: Send photon through polarizers
tutorial.addStep(
  { // Prompt animation
    msg: TEXT['added-polarizers'],
    trigger: 'play'
  },
  { // Send photon through setup
    animation: function(callback) {
      source.blink();
      photon.shoot(2, 100, function() {
        photon.polarize(0);
        photon.shoot(0.7, 35, function() {
          photon.rotatePolarization(0.9, Math.PI/8);
          photon.shoot(1.3, 65, function() {
            photon.polarize(0);
            photon.shoot(0.7, 35, function() {
              photon.rotatePolarization(0.9, Math.PI/8);
              photon.shoot(1.3, 65, function() {
                photon.polarize(0);
                photon.shoot(0.7, 35, function() {
                  photon.rotatePolarization(0.9, Math.PI/8);
                  photon.shoot(1.3, 65, function() {
                    photon.polarize(0);
                    photon.shoot(0.7, 35, function() {
                      photon.rotatePolarization(0.9, Math.PI/8);
                      photon.shoot(1.3, 65, function() {
                        photon.polarize(0);
                        photon.shoot(2.2, 110, function() {
                          photon.polarize('random');
                          photon.translate(-610, 0, 0);
                          screen.illuminate(0.53);
                          callback();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }
  },
  { // Zoom in on screen
    animation: function(callback) {
      scene.moveCamera(3, 210, 10, 100, 350, 0, 0, callback);
    }
  }
);

// Step 10: conclusion
tutorial.addStep(
  {
    back: function() {
      scene.placeCamera(-40, 100, 400, -15, 0, 0);
      screen.reset();
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
// scene.placeCamera(-150, 100, 400, -50, 0, 0);

// Initializing the application when the HTML document is ready
$(document).ready(function() {
  // Setting the intro
  PHOTON._INTRO_MESSAGE = "Welcome to the fourth exercise on<br>"+
    "photon polarization.<br>"+
    "Press START to begin the exercise.";

  // Initializating the PHOTON object
  PHOTON.init(1000, 800);
});
