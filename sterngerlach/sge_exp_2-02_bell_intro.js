// #################################################################################################
// Stern-Gerlach Tutorials
// Copyright (C) 2015-2016 Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Lucas Vieira (https://github.com/1ucasvb)
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
// 
// Tutorial 2.02: The Bell Experiment (Part 1: Introduction)
//
// #################################################################################################

// #################################################################################################
// Setup application

// Create an SGE Application with given name and dimensions
var app = SGE.createApp("SGEApplication", 820, 600);

// Add its container to the document body
$("body").append(app.div);

// Creates a Viewport3D component and adds it to the app
var viewport = new SGE.Viewport3D(800, 400);
app.add(viewport, 10, 10);

// Add some lights
// Two opposing lights are good for creating volume highlights
viewport.addLight(-50, 80, 200, 0x010101*200);
viewport.addLight(50, -80, -200, 0x010101*200);

// Create a message box for instructions and add it
var messagebox = new SGE.MessageBox(600, 170);
app.add(messagebox, 10, 420);

var btNext = new SGE.Button(190, 80, "NEXT", 0x6699FF);
app.add(btNext, messagebox.x + messagebox.width + 10, messagebox.y); 

var btGo = new SGE.Button(190, 80, "GO", 0x22CC88);
app.add(btGo, messagebox.x + messagebox.width + 10, messagebox.y + 90); 

// #################################################################################################
// Tutorial constants

// All messages for this tutorial in one place, for ease of editing
var MESSAGES = {
	'intro': [
		"<strong>Introduction</strong>",
		"Welcome to the first interactive tutorial on the Bell experiment. In this tutorial we'll see how random distant measurements can help us verify whether or not quantum mechanics is the correct interpretation.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Local determinism and quantum mechanics</strong>",
		"In the previous tutorial we explored the EPR experiment, which showed us that if we assume <em>locality</em> is true then the following alternative explanation for quantum mechanics cannot be correct: ",
		"<em style=\"margin:0 1em;display:block\"><strong>Alternative 1</strong>: An atom with a definite state in the "+SGE.Symbols.Z+" direction also has a definite state in the "+SGE.Symbols.X+" direction, but the measurement in "+SGE.Symbols.Z+" disturbs the state in "+SGE.Symbols.X+".</em>",
		"But, still assuming <em>locality</em> is true, we have also proposed the following alternative explanation:",
		"<em style=\"margin:0 1em;display:block\"><strong>Alternative 2</strong>: An atom with a definite state in the "+SGE.Symbols.Z+" direction also has a definite state in the "+SGE.Symbols.X+" direction, but it changes so rapidly that no one can figure out what it is.</em>",
		"This suggests that atoms carry some set of \"hidden properties\" that determine the results of measurements. Since we don't know what these properties are, the atoms behave in a seemingly random and unpredictable way, but which is still coordinated over large distances.",
		"This notion, called <em>local determinism</em>, is what we'll be addressing in this tutorial.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"In order to test whether <em>local determinism</em> is correct we need an experiment that can test its predictions. The experiment we'll describe now is based on an important theoretical result by John Stewart Bell.",
		"The idea is to measure the states of the entangled atoms in random directions with two analyzers. After many such measurements, we can compare the results obtained with the predictions of local determinism and quantum mechanics.",
		"This experiment is more complicated than the ones we've seen so far, but do not worry: we'll explain it very carefully, step by step. Make sure you understand each step before moving on.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Preparing the Bell experiment</strong>",
		"Above we have a similar experimental setup as in the previous tutorial: an entangled atom source, two analyzers, and one detector on each of their outputs.",
		"Just as before, the analyzer on the left is slightly closer to the source than the analyzer on the right. The distance between analyzers is assumed to be large enough so there is no time for the measurement on the left to influence the measurement on the right.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-1': [
		"This time, the analyzers will also be able to rotate independently.",
		"The analyzers can rotate to three possible orientations: A at 0° from vertical, B at 120°, and C at 240°.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-2': [
		"Each time atoms are released, both analyzers will independently pick one of the three orientations at random with probability 1/3.",
		"This means the orientation of the analyzers may or may not change for each pair of atoms released. We also expect the orientations to occasionally be the same. In these cases, the measurements will behave just as in the previous tutorial on the EPR experiment.",
		"As before, the icon appearing above the analyzers show which state they measured in whatever orientation they were randomly set to.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-3': [
		"As you have probably noticed, if the analyzers are in different orientations there is the possibility of both analyzers measuring a "+SGE.Symbols.PLUS+" or a "+SGE.Symbols.MINUS+" state in their respective directions. This can not happen if the analyzers have the same orientation.",
		"We are interested in finding out how often these measured states turn out to be the same for both analyzers, and how often they turn out to be different. The direction associated with each state will not be important to us.",
		"In order to simplify these results we'll place these analyzers and detectors inside a single object.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-4': [
		"We have packed our rotating analyzers and their detectors inside a cylindrical drum, which we'll call a <strong><em>Bell analyzer</em></strong> from now on.",
		"At the top of each Bell analyzer we see two lamps, one red and one blue. The red lamp will flash if the analyzer detects a "+SGE.Symbols.PLUS+" state, and the blue lamp will flash if the analyzer detects a "+SGE.Symbols.MINUS+" state. We don't know the orientation of the analyzers, but this does not matter to us anymore.",
		"Press "+btGo.textVersion+" to try it out."
	],
	'2-5': [
		"As you can see, each time a particle goes into a Bell analyzer one of the lamps will flash.",
		"We'll denote these results by the "+SGE.Symbols.RED+" and "+SGE.Symbols.BLUE+" symbols.",
		"In the next tutorials we'll look at how often both analyzers flash the same colors, as predicted by quantum mechanics and local determinism. It turns out both theories make different predictions, which means we can run experiments to see which is right.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment(); // main experiment
// Speed up atoms
experiment.atomSpeed = 8;

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_ENTANGLED;

// Analyzers
var analyzerDistance = 5;
var analyzerOffset = 3;
var analyzerR = new SGE.Analyzer();
var analyzerL = new SGE.Analyzer();
analyzerR.angleMeter.radius = 3;
analyzerL.angleMeter.radius = 3;
analyzerR.angleMeter.label.size = 0.6;
analyzerL.angleMeter.label.size = 0.6;

// Dynamic sprites
var STATE_OFFSET = 0; // x offset of state sprites relative to analyzers
var stateL = new SGE.Primitives.DynamicSprite({
	'plus':  "sprite_plus.png",
	'minus': "sprite_minus.png"
});
var stateR = new SGE.Primitives.DynamicSprite({
	'plus':  "sprite_plus.png",
	'minus': "sprite_minus.png"
});

// Detectors
var detectorR1 = new SGE.Detector();
var detectorR2 = new SGE.Detector();
var detectorL1 = new SGE.Detector();
var detectorL2 = new SGE.Detector();

// Bell Analyzer drums
var drumR = new SGE.Primitives.BellAnalyzerDrum();
var drumL = new SGE.Primitives.BellAnalyzerDrum();

// Camera
var camera = viewport.camera;
camera.focusOn(new THREE.Vector3(analyzerOffset / 2, 0, 0));
camera.z = 1;
camera.theta = SGE.TAU/4;
// camera.phi = SGE.TAU*0.2;
camera.rho = 14;

// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback
tutorial.cameraLocation = camera.location;
tutorial.cameraFocus    = camera.focusOnVector.clone();
tutorial.pause          = 2500; // milliseconds between experimental runs

tutorial.continuousRun = function() {
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, tutorial.pause / SGE.AnimationManager.timeFactor);
}
tutorial.startContinuousRun = function() {
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.events.on(SGE.EVENT_END_EXPERIMENT, tutorial.continuousRun);
	clearTimeout(tutorial.timer);
	experiment.run();
}
tutorial.stopContinuousRun = function() {
	clearTimeout(tutorial.timer);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
}

// -------------------------------------------------------------------------------------------------
// Introduction
// We start with the whole setup as before
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Move camera slightly up
	camera.phi = SGE.TAU*0.2;
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Local determinism vs quantum mechanics
tutorial.part1 = {};

// Recap, talk about alternatives
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
}

// Mention previous experimental setup
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 2 - 
tutorial.part2 = {};

// Reassemble last setup
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	viewport.addExperiment(experiment);
	source.attach(analyzerR, SGE.IO_RIGHT);
	analyzerR.attach(detectorR1, SGE.IO_TOP);
	analyzerR.attach(detectorR2, SGE.IO_BOTTOM);
	source.attach(analyzerL, SGE.IO_LEFT);
	analyzerL.attach(detectorL1, SGE.IO_TOP);
	analyzerL.attach(detectorL2, SGE.IO_BOTTOM);
	
	experiment.position.y = 4;
	TweenMax.to(experiment.position, 2, {
		y: 0,
		ease: Power4.easeInOut
	});
	
	// Position objects
	analyzerR.spacing = analyzerDistance + analyzerOffset;
	analyzerL.spacing = analyzerDistance;
	detectorR1.spacing = SGE.BELL_DETECTOR_OFFSET;
	detectorR2.spacing = SGE.BELL_DETECTOR_OFFSET;
	detectorL1.spacing = SGE.BELL_DETECTOR_OFFSET;
	detectorL2.spacing = SGE.BELL_DETECTOR_OFFSET;
	
	// Focus on source
	camera.focusOn(source.__position);
	camera.theta = SGE.TAU/4;
	camera.rho = 4;
	TweenMax.to(camera, 2, {
		x: tutorial.cameraLocation.x,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z,
		ease: Power2.easeInOut,
		delay: 1.5
	});
	camera.moveFocusTo(tutorial.cameraFocus, 2, 1.5);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Analyzer rotations
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	// Add state sprites 
	viewport.add(stateL);
	viewport.add(stateR);
	stateL.position.x = analyzerL.position.x + STATE_OFFSET;
	stateR.position.x = analyzerR.position.x - STATE_OFFSET;
	stateL.position.y = 3.5;
	stateR.position.y = 3.5;
	stateL.size = 2.5;
	stateR.size = 2.5;
	detectorR1.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateR.state = "plus";
	});
	detectorR2.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateR.state = "minus";
	});
	detectorL1.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateL.state = "plus";
	});
	detectorL2.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateL.state = "minus";
	});
	
	// Add Bell drums, hide everything first
	// Right
	experiment.add(drumR);
	drumR.setAnalyzer(analyzerR);
	drumR.top.visible = false;
	drumR.bottom.visible = false;
	drumR.front.visible = false;
	drumR.back.visible = false;
	drumR.directions.opacity = 0;
	
	// Left
	experiment.add(drumL);
	drumL.setAnalyzer(analyzerL);
	drumL.top.visible = false;
	drumL.bottom.visible = false;
	drumL.front.visible = false;
	drumL.back.visible = false;
	drumL.directions.visible = false;
	
	var d = 4;
	var pos = {x: analyzerR.position.x + 2*d, y: 0, z: 3.5};
	TweenMax.to(camera, 2, {
		x: pos.x,
		y: pos.y,
		z: pos.z,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3(analyzerR.position.x + d,0,0), 2);
	
	TweenMax.to([drumR.directions, analyzerR.angleMeter], 0.5, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 1,
		onComplete: function() {
			tutorial.timer = setInterval(function() {
				TweenMax.to(analyzerR, 0.75, {
					angle: analyzerR.angle + SGE.TAU/3 + 1e-5,
					ease: Power4.easeInOut,
					onComplete: function() {
						analyzerR.angle = (Math.floor(3 * analyzerR.angle / SGE.TAU) % 3) * SGE.TAU/3;
					}
				});
			}, 2000);
		}
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Analyzer rotating randomly
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	clearInterval(tutorial.timer);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	
	// Restore camera
	TweenMax.to(camera, 1.5, {
		x: tutorial.cameraLocation.x,
		y: 0,
		z: tutorial.cameraLocation.z,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(tutorial.cameraFocus, 1.5);
	
	TweenMax.to([drumR.directions,analyzerR.angleMeter], 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	source.events.on(SGE.EVENT_RELEASE_PARTICLE, function(){
		TweenMax.to(analyzerR, 0.5, {
			angle: SGE.TAU/3 * (Math.floor(Math.random() * 3)-1),
			ease: Power4.easeInOut
		});
		TweenMax.to(analyzerL, 0.5, {
			angle: SGE.TAU/3 * (Math.floor(Math.random() * 3)-1),
			ease: Power4.easeInOut
		});
	});
	
	tutorial.timer = setTimeout(function() {
		tutorial.startContinuousRun();
	}, 2500);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Talking about states being the same
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
}

// Assemble Bell Analyzer
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	tutorial.stopContinuousRun();
	// Clear events on source
	source.events.off(SGE.EVENT_RELEASE_PARTICLE);
	
	// Hide state markers, not used anymore
	stateR.state = null;
	stateL.state = null;
	// ------------- Current step
	messagebox.clear();
	
	TweenMax.to([analyzerR, analyzerL], 0.5, {
		angle: 0,
		ease: Power4.easeInOut
	});
	
	// Bring in drums
	drumR.top.position.y = 8;
	drumR.bottom.position.y = -8;
	drumR.front.position.x = -10;
	drumR.back.position.x = 10;
	drumR.front.position.y = -5;
	
	// Reset lights
	drumL.flash(0);
	drumR.flash(0);
	
	// Add events
	experiment.events.on(SGE.EVENT_BEGIN_EXPERIMENT, function(e){
		analyzerR.angle = SGE.TAU/3 * (Math.floor(Math.random() * 3)-1);
		analyzerL.angle = SGE.TAU/3 * (Math.floor(Math.random() * 3)-1);
		drumL.flash(0);
		drumR.flash(0);
	});
	
	// Get camera closer to analyzer
	camera.moveFocusTo(drumR, 1.5);
	TweenMax.to(camera, 1.5, {
		x: drumR.position.x,
		y: drumR.position.y + 1,
		z: drumR.position.z + 8,
		ease: Power2.easeInOut,
		onComplete: function() {
			// Reveal parts only when camera is closer
			drumR.top.visible = true;
			drumR.bottom.visible = true;
			drumR.front.visible = true;
			drumR.back.visible = true;
		}
	}),
	
	// Assemble
	TweenMax.to([
			drumR.top.position, drumR.bottom.position,
			drumR.front.position, drumR.back.position
		], 3, {
		x: 0, y: 0,
		ease: Power4.easeInOut,
		delay: 1,
		onComplete: tutorial.part2.step4b
	});
	
	// ------------- For next step
	// Automatic
}

tutorial.part2.step4b = function() {
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-4'], true);
	
	// Magically assemble the left Bell analyzer offscreen
	drumL.top.visible = true;
	drumL.bottom.visible = true;
	drumL.front.visible = true;
	drumL.back.visible = true;
	
	// Restore camera
	TweenMax.to(camera, 1.5, {
		x: tutorial.cameraLocation.x,
		y: 0,
		z: 30,
		fov: 30,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(tutorial.cameraFocus, 1.5);
	
	// Hide state sprites
	viewport.remove(stateL);
	viewport.remove(stateR);
	
	// ------------- For next step
	// Automatic
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step5);
}

// Talking about lamps and future tutorials
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);

	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	experiment.atomSpeed = 15;
	tutorial.startContinuousRun();
	
	// Resume atoms and let things happen
	tutorial.startContinuousRun();
	
	// ------------- For next step
	// End of tutorial
}

// -------------------------------------------------------------------------------------------------
// Animation handler

function animate(t, delta) {
	if (tutorial.animate) tutorial.animate(t, delta);
	experiment.updatePositions();
	viewport.render();
}
SGE.startAnimation(animate);

// Start tutorial
tutorial.intro();


