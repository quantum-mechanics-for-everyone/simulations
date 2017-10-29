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
// Tutorial 2.03: The Bell Experiment (Part 2: Quantum Mechanics)
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
		"Welcome to the second tutorial on the Bell experiment. In this tutorial we'll find out what are the predictions made by quantum mechanics for this experiment.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Random distant measurements in quantum mechanics</strong>",
		"Above we have two Bell analyzers in the Bell experiment setup. The analyzer on the left was placed a little bit closer to the source than the analyzer on the right, so it measures the state of its atom first.",
		"Recall that the Stern-Gerlach analyzers, inside the Bell analyzers, are rotated to a random orientation every time atoms are released. The orientations have angles 0°, 120° and 240° from the vertical +"+SGE.Symbols.Z+" direction.",
		"Given these circumstances, we wish to figure out the probability that the two Bell analyzers will flash <strong><em>different</em></strong> colors. Since the analyzer on the left will measure the atom first, let's take a closer look at this experiment starting from there.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"Let's assume, without loss of generality, that the Stern-Gerlach analyzer on the left will be upright, in the A orientation at 0°. (The following analysis would be the same for orientations B and C.)",
		"The incoming atom will be measured either in the "+SGE.Symbols.PLUS+" or "+SGE.Symbols.MINUS+" state in this direction with equal probability 1/2, which means the Bell analyzer will also flash either "+SGE.Symbols.RED+" or "+SGE.Symbols.BLUE+" with the same probabilities.",
		"Let's see which result we'll get. Press "+btGo.textVersion+" to release the atoms."
	],
	// '1-3': not used
	'1-3': [
		"The atom was measured in the "+SGE.Symbols.MINUS+" state and so we get the "+SGE.Symbols.BLUE+" lamp flashing on the Bell analyzer.",
		"This also means that this atom has a definite state in the direction given by current the orientation of the analyzer.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-4': [
		"From our previous experience with entangled pairs of atoms, we can also say that we <em>know</em> for certain the state of the other atom, moving to the right. It must be in the opposite state, the "+SGE.Symbols.PLUS+" state in that same direction.",
		"Since this analyzer is at a larger distance from the source than the other, the atom on the right hasn't been detected yet. It is about to enter the Bell analyzer on the right.",
		"However, this time we know the state of the atom before entering the analyzer. How will this affect the probabilities of the "+SGE.Symbols.RED+" lamp flashing on the right?",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-5': [
		"Let's open up this Bell analyzer and look at the possibilities. There are three orientations the Stern-Gerlach analyzer can be found in, each with probability 1/3.",
		"<b>Orientation A</b>: In this case we have the same situation as in the EPR experiment, and we have probability 1 that the atom will be found in the "+SGE.Symbols.PLUS+" state. We conclude the "+SGE.Symbols.RED+" lamp will flash on the Bell analyzer on the right with probability 1 whenever the analyzer is in orientation A, which happens 1/3 of the time.",
		"What about the other orientations?",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-6': [
		"<b>Orientation B</b>: In this case, we have to calculate the probability the atom will be found in the "+SGE.Symbols.PLUS+" state using the function we found previously:",
		"&emsp; P(&theta;) = cos<sup>2</sup>(&theta;/2)",
		"For &theta; = 120°, we find a probability 1/4 that the "+SGE.Symbols.RED+" lamp will flash whenever the analyzer is in orientation B, which happens 1/3 of the time.",
		"Now we check the case for orientation C. Press "+btNext.textVersion+" to continue."
	],
	'1-7': [
		"<b>Orientation C</b>: We once again calculate the probability the atom will be found in the "+SGE.Symbols.PLUS+" state using the function we found previously.",
		"For &theta; = 240°, we also find a probability 1/4 that the "+SGE.Symbols.RED+" lamp will flash whenever the analyzer is in orientation C, which happens 1/3 of the time.",
		"All we have to do now is collect these results.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-8': [
		"We found the following probabilities for each orientation:",
		"&emsp; A: 1/3 &times; 1 &emsp; B: 1/3 &times; 1/4 &emsp; C: 1/3 &times; 1/4",
		"Since either A <em>or</em> B <em>or</em> C happen, we add the probabilities to get the total probability of the Bell analyzer on the right flashing the "+SGE.Symbols.RED+" lamp after the Bell analyzer on the left flashed the "+SGE.Symbols.BLUE+" lamp:",
		"&emsp; (1/3 &times 1) + (1/3 &times 1/4) + (1/3 &times 1/4) = 1/2",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'end': [
		"<strong>Conclusion</strong>",
		"Our careful analysis has shown that:",
		"&emsp;<strong>Quantum mechanics predicts that the Bell analyzers will flash different colors with probability 50%.</strong>",
		"Notice that the original assumption that the Stern-Gerlach analyzer on the left was in orientation A doesn't matter. We would obtain the same probability for any orientation.",
		"This result would also be true if the Bell analyzer on the left flashed its "+SGE.Symbols.RED+" lamp instead, as we are only interested in the probability of the colors being different.",
		"In the next tutorial we'll look at the predictions that local determinism makes.",
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
camera.phi = SGE.TAU/4;
camera.rho = 30;
camera.fov = 30; // cut some perspective
camera.save();


// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback
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

// Canvases

// -------------------------------------------------------------------------------------------------
// Introduction
// We start with the whole setup as before
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Reassemble experiment
	viewport.addExperiment(experiment);
	source.attach(analyzerR, SGE.IO_RIGHT);
	analyzerR.attach(detectorR1, SGE.IO_TOP);
	analyzerR.attach(detectorR2, SGE.IO_BOTTOM);
	source.attach(analyzerL, SGE.IO_LEFT);
	analyzerL.attach(detectorL1, SGE.IO_TOP);
	analyzerL.attach(detectorL2, SGE.IO_BOTTOM);
	
	// Position objects
	analyzerR.spacing = analyzerDistance + analyzerOffset;
	analyzerL.spacing = analyzerDistance;
	detectorR1.spacing = SGE.BELL_DETECTOR_OFFSET;
	detectorR2.spacing = SGE.BELL_DETECTOR_OFFSET;
	detectorL1.spacing = SGE.BELL_DETECTOR_OFFSET;
	detectorL2.spacing = SGE.BELL_DETECTOR_OFFSET;
	
	// Add Bell analyzer drums
	experiment.add(drumR);
	experiment.add(drumL);
	drumR.directions.visible = false;
	drumL.directions.visible = false;
	drumR.setAnalyzer(analyzerR);
	drumL.setAnalyzer(analyzerL);
	
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

// Move closer to drumL
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// Move camera
	camera.tween({
		x: 2,
		y: 3,
		z: 14,
	}, drumL.position, 2);
	
	// Explode Bell analyzer
	TweenMax.to([drumL.bottom.position, drumL.back.position], 1, {
		y: -4,
		ease: Power4.easeInOut,
		delay: 2
	});
	TweenMax.to([drumL.top.position, drumL.front.position], 1, {
		y: 4,
		ease: Power4.easeInOut,
		delay: 2
	});
	
	// Prepare and fade in directions again
	drumL.directions.alwaysVisible = true;
	drumL.directions.visible = true;
	drumL.directions.opacity = 0;
	TweenMax.to([drumL.directions, analyzerL.angleMeter], 0.5, {
		opacity: 1,
		ease: Power4.easeInOut,
		delay: 2.5
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Fire particle
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.clear();
	
	
	// Mischievously move second analyzer further away (for narrative purposes)
	// When the state is detected on the left, the atom is already inside the analyzer on the right
	// We don't want this, as we want to be able to take a look at the second atom as well
	// We'll return it to the original position later
	analyzerR.spacing += 5;
	drumR.setAnalyzer(analyzerR); // make sure to reposition the Bell analyzer
	
	// Make sure we can see the states
	experiment.revealStates = true;
	
	// Force a (-) state for narrative 
	analyzerL.events.on(SGE.EVENT_ENTER, function(e){
		e.particle.spin = analyzerL.angle+SGE.TAU/2;
	});
	experiment.atomL.events.on(SGE.EVENT_DETECTED, tutorial.part1.step3);
	
	experiment.atomSpeed = 4;
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

// Talk about detection
tutorial.part1.step3 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	
	// Pause experiment
	experiment.pause();
	
	// Hide angle meter and direction
	TweenMax.to([drumL.directions, analyzerL.angleMeter], 0.5, {
		opacity: 0,
		ease: Power4.easeInOut,
		delay: 1.5
	});
	
	// Close Bell analyzer
	TweenMax.to([drumL.bottom.position, drumL.back.position], 1, {
		y: 0,
		ease: Power4.easeInOut,
		delay: 2
	});
	TweenMax.to([drumL.top.position, drumL.front.position], 1, {
		y: 0,
		ease: Power4.easeInOut,
		delay: 2
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step4);
}

// Atom entering the second analyzer
tutorial.part1.step4 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-4'], true);
	
	// Move camera
	camera.tween({
		x: 8,
		y: 3,
		z: 14,
	}, drumR.position, 2);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step5);
}

// Explode second analyzer
tutorial.part1.step5 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-5'], true);
	
	// Explode Bell analyzer (right)
	TweenMax.to([drumR.bottom.position, drumR.back.position], 1, {
		y: -4,
		ease: Power4.easeInOut
	});
	TweenMax.to([drumR.top.position, drumR.front.position], 1, {
		y: 4,
		ease: Power4.easeInOut
	});
	
	// Prepare and fade in directions again
	drumR.directions.alwaysVisible = true;
	drumR.directions.visible = true;
	drumR.directions.opacity = 0;
	TweenMax.to([drumR.directions, analyzerR.angleMeter], 0.5, {
		opacity: 1,
		ease: Power4.easeInOut,
		delay: 1.5
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step6);
}

// Rotate analyzer to orientation B
tutorial.part1.step6 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-6'], true);
	
	TweenMax.to(analyzerR, 1, {
		angle: SGE.TAU*1/3,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step7);
}


// Rotate analyzer to orientation C
tutorial.part1.step7 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-7'], true);
	
	TweenMax.to(analyzerR, 1, {
		angle: SGE.TAU*2/3,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step8);
}

// Rotate analyzer to orientation A and close Bell analyzer
tutorial.part1.step8 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-8'], true);
	
	// Rotate analyzer upright
	TweenMax.to(analyzerR, 1, {
		angle: 0,
		ease: Power4.easeInOut
	});
	
	// Hide angle meter and direction
	TweenMax.to([drumR.directions, analyzerR.angleMeter], 0.5, {
		opacity: 0,
		ease: Power4.easeInOut,
		delay: 1
	});
	
	// Close Bell analyzer
	TweenMax.to([drumR.bottom.position, drumR.back.position], 1, {
		y: 0,
		ease: Power4.easeInOut,
		delay: 2
	});
	TweenMax.to([drumR.top.position, drumR.front.position], 1, {
		y: 0,
		ease: Power4.easeInOut,
		delay: 2,
		onComplete: tutorial.part1.step8a
	});
	
	// ------------- For next step
	// Automatic
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step9);
}

// Continue
tutorial.part1.step8a = function() {
	experiment.events.on(SGE.EVENT_END_EXPERIMENT, tutorial.part1.step8b);
	experiment.resume();
	experiment.atomSpeed = 8;
}

// Move back
tutorial.part1.step8b = function() {
	// Mischievously move second analyzer back to original distance
	analyzerR.spacing -= 5;
	drumR.setAnalyzer(analyzerR); // make sure to reposition the Bell analyzer
	camera.focusOn(new THREE.Vector3(
		camera.focusOnVector.x - 5,
		camera.focusOnVector.y,
		camera.focusOnVector.z
	));
	camera.x -= 5;
	
	// Move camera back to original angle showing both analyzers
	camera.restore(2, 1, tutorial.part1.step8c);
}

// Enable button
tutorial.part1.step8c = function() {
	TweenMax.killAll(true);
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.conclusion);
}

// Conclusion
tutorial.conclusion = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['end'], true);
	
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


