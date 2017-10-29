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
// Tutorial 1.06: Three analyzers
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
btGo.enabled = false;
app.add(btGo, messagebox.x + messagebox.width + 10, messagebox.y + 90); 

// #################################################################################################
// Tutorial constants

// All messages for this tutorial in one place, for ease of editing
var MESSAGES = {
	'intro': [
		"<strong>Introduction</strong>",
		"Welcome to the sixth interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll explore repeated measurements with three analyzers in order to verify our findings so far.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: A third analyzer</strong>",
		"Previously, we found that the result of measurements by a second analyzer were inconsistent with the idea that the atom has a definite state before being measured the first time.",
		"In the last tutorial, our experiments also showed that measuring the atom a second time in a perpendicular direction gave the same results as if the effective magnetic arrow was oriented completely at random.",
		"All of these results seem to imply that the very act of measuring is what defines the state of the atom in one direction, and the state in other directions become undefined once that measurement is made.",
		"In other words: the atom can have a definite state in only one direction. <em><strong>It cannot have a definite state in more than one direction at the same time.</strong></em> We can characterize the atoms as being \"stupid\"; they only remember the last axis their effective magnetic arrow was measured on.",
		"To explore this result, we'll now bring in a third analyzer into our experiment.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"We have brought a third analyzer, which we called analyzer C, and placed it in front of the "+SGE.Symbols.PLUS+" output of analyzer B. We also placed the two detectors D1 and D2 in front of the outputs of this new analyzer.",
		"In the following parts of this tutorial we will rotate the analyzers relative to each other and check the statistics of the experiments after several atoms have been detected.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Three analyzer experiments</strong>",
		"We'll start our experiments by rotating analyzer B by 90°, so it measures along the +"+SGE.Symbols.X+" direction. Analyzer C will remain upright, attached to analyzer B's "+SGE.Symbols.PLUS+" output.",
		"Press on analyzer B to rotate it."
	],
	'2-1': [
		"OK, good. We're now all set for our first experiment. We'll once again be releasing several atoms in rapid succession.",
		"As before, only a few of the atoms will make it through all the analyzers and reach our detectors. We'll stop the experiment once we have detected a total of 100 atoms.",
		"The bar at the bottom will give us a visual representation of the proportion of atoms detected by each of the detectors. The black vertical line indicates the center of the bar, where proportions are equal for each detector.",
		"Based on everything we know so far from previous experiments, what should these proportions be?",
		"If you believe the atoms emerge from A and B with a positive projection on the "+SGE.Symbols.Z+" direction and the "+SGE.Symbols.X+" direction, then all should go to D1. If you believe quantum particles only remember their last measurement, then the atoms have a positive projection on the "+SGE.Symbols.X+" direction only and some should go to each detector. (How many should go to each?)",
		"If you believe quantum processes are always random, then we cannot predict anything about how many will appear in each detector. Make a concrete prediction for what percentage of the atoms you think will enter each detector before proceeding.",
		"Make your prediction, then press "+btGo.textVersion+" to start the experiment."
	], 
	// '2-2': not used
	'2-3': [
		"The results are in. It is clear from observing the experiment that there's a lot of randomness involved, but overall each detector seems just as likely as the other to detect an atom. As the number of atoms increases, we would expect the proportions to be equal.",
		"Our hypothesis appears to be correct: the measurement performed by analyzer B effectively erased any trace of the measurements by analyzer A.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-4': [
		"It really seems these quantum objects can only remember the last state they were found at after being measured. Furthermore, they can only have a definite state in one direction at a time.",
		"Let's try a few more setups to verify this fact. We'll be repeating the experiment again, but this time with analyzer C in the same orientation as analyzer B.",
		"Press on analyzer C to rotate it."
	],
	'2-5': [
		"Now both analyzers B and C are perpendicular to analyzer A. Analyzer A is measuring in the +"+SGE.Symbols.Z+" direction, and both analyzer B and C are measuring in the +"+SGE.Symbols.X+" direction.",
		"In this setup, what proportion of atoms will be found at each detector?",
		"Make your prediction, then press "+btGo.textVersion+" to start the experiment."
	],
	// '2-6': not used
	'2-7': [
		"Now, we see that <em>all</em> atoms were detected by detector D1. This is in accord with our hypothesis, as analyzer B defined the state of the atom in the +"+SGE.Symbols.X+" direction.",
		"Any further measurement in that same direction will return the same result. In a sense, the atom has no memory of what happened when it went through analyzer A.",
		"So far, we have only placed analyzers perpendicular to each other. The question remains of how these probabilities change for other possible angles between the analyzers.", 
		"This concludes this tutorial. Please, proceed to the next section of the course."
		// "This concludes this tutorial, and you may proceed with the course. However, if you wish to test your understanding further, press "+btNext.textVersion+" to continue."
	]
	// ,
	// Part 3
	// '3-0': [
		// "<strong>Part 3: Test your understanding</strong>",
		// "In this optional part of this tutorial you are free to arrange the analyzers in any perpendicular direction to each other.",
		// "Just click on any of the three analyzers to rotate them by 90°. Once you are ready to run the experiment, press "+btGo.textVersion+" to start.",
		// "Be sure to make predictions before you try!"
	// ],
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment();

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_NORMAL; // throw unknown spin atoms

// Camera
var camera = viewport.camera;
camera.x = 7.5;
camera.y = 3;
camera.z = 8;
camera.focusOn(new THREE.Vector3(7.5,0,0));

// Custom "ignore" targets
var ignore1 = new SGE.Ignore();
var ignore2 = new SGE.Ignore();
var ignore3 = new SGE.Ignore();

// Axes
var axes = new SGE.Primitives.Axes();

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();
var analyzer3 = new SGE.Analyzer();

// Set labels
analyzer1.label.text = "A";
analyzer1.label.position.y = -3;
analyzer2.label.text = "B";
analyzer2.label.position.y = -3;
analyzer3.label.text = "C";
analyzer3.label.position.y = -3;

// Scale angle meters for analyzers
analyzer1.angleMeter.radius = 3;
analyzer2.angleMeter.radius = 3;
analyzer3.angleMeter.radius = 3;

// Detectors
var detector1 = new SGE.Detector();
var detector2 = new SGE.Detector();
detector1.label.text = "D1";
detector2.label.text = "D2";
detector1.label.position.y = 1.5;
detector2.label.position.y = -1.5;
detector1.counterLabel.position.x = 1.5;
detector2.counterLabel.position.x = 1.5;
detector1.counterLabel.size = 2/3;
detector2.counterLabel.size = 2/3;
detector1.counterLabel.color = SGE.GLOW_COLOR;
detector2.counterLabel.color = SGE.GLOW_COLOR;

// Stats bar
var stats = new SGE.Canvas2D(425, 75);
stats.shadow = 10;

function updateStats(d1, d2) {
	var f = "20px monospace";
	stats.clear(0xFFFFFF,1);
	
	var dt = d1+d2;
	var m = 20;
	var bw = stats.width - 2*m;
	var bh = 25;
	var bs = 35;
	var c1 = [0xed6229,0xf28444];
	var c2 = [0x0e88d1,0x0fa8e0];
	
	stats.text("Total: "+SGE.padString(d1+d2, 3, " ", -1), stats.width/2, 35/2, 0x000000, f, 0);
	
	stats.fillRect(m, 35, bw, 25, 0xE0E0E0, 1);
	
	if (dt) {
		stats.fillRect(m+bs, 35, (bw-2*bs)*(d1/(d1+d2)), bh, c1[0], 1);
		stats.fillRect(m+bs, 35, (bw-2*bs)*(d1/(d1+d2)), bh-10, c1[1], 1);
		stats.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), 35, (bw-2*bs)*(d2/(d1+d2)), bh, c2[0], 1);
		stats.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), 35, (bw-2*bs)*(d2/(d1+d2)), bh-10, c2[1], 1);
	}
	
	stats.fillRect(m, 35, bs, bh, c1[0], 1);
	stats.fillRect(m, 35, bs, bh-4, c1[1], 1);
	stats.rect(m, 35, bs, bh, 0, 1, 1);
	
	stats.fillRect(m+bw-bs, 35, bs, bh, c2[0], 1);
	stats.fillRect(m+bw-bs, 35, bs, bh-4, c2[1], 1);
	stats.rect(m+bw-bs, 35, bs, bh, 0, 1, 1);
	
	stats.line(m+bw/2, 30, m+bw/2, 65, 0x000000, 1, 1);
	stats.rect(m, 35, bw, bh, 0, 1, 1);
	stats.rect(m+bs, 35, bw-2*bs, bh, 0, 1, 1);
	
	stats.text("D1", m + bs / 2, bs + bh/2, 0x000000, f, 0);
	stats.text("D2", stats.width - m - bs / 2, bs + bh/2, 0x000000, f, 0);
}

updateStats(0, 0);


// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback

// Run experiment with N atoms, then go to callback function
tutorial.run = function(callback, N) {
	if (typeof(N) == "undefined") N = 100;
	// Reset counter
	tutorial.numAtoms = 0;
	SGE.AnimationManager.timeFactor = 2; // start faster
	experiment.ignoreSilently = false;
	var maxtf = 1000;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
			if (SGE.AnimationManager.timeFactor < maxtf) {
				SGE.AnimationManager.timeFactor *= 1.5; // speed up
				if (SGE.AnimationManager.timeFactor >= maxtf) {
					SGE.AnimationManager.timeFactor = maxtf;
					experiment.ignoreSilently = true;
				}
			}
			clearTimeout(tutorial.timer);
			
			// Stop after N atoms have been detected
			if (tutorial.numAtoms >= N) {
				callback();
				return;
			}
			
			// Keep releasing atoms
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, 1);
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	experiment.run();
}

// -------------------------------------------------------------------------------------------------
// Introduction
// We start with the same setup as we left
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Add experiment
	viewport.addExperiment(experiment);
	
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.attach(analyzer2, SGE.IO_TOP);
	analyzer1.spacing = 1;
	analyzer2.spacing = 1.5;
	analyzer1.label.opacity = 1;
	analyzer2.label.opacity = 1;
	
	// Speed up atoms
	experiment.atomSpeed = 5;
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
	btNext.enabled = true;
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Three analyzers
tutorial.part1 = {};

// Show two analyzers, recap
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
	btNext.enabled = true;
}

// More recap, talk about upcoming experiments
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	experiment.add(analyzer3);
	analyzer2.attach(analyzer3, SGE.IO_TOP);
	analyzer3.attach(detector1, SGE.IO_TOP);
	analyzer3.attach(detector2, SGE.IO_BOTTOM);
	
	camera.moveFocusTo(new THREE.Vector3(11,1,0), 1);
	TweenMax.to(camera, 1, {
		x: 11,
		y: 2,
		z: 11,
		ease: Power2.easeInOut
	});

	analyzer3.spacing = 13;
	TweenMax.to(analyzer3, 1, {
		spacing: 1.5,
		delay: 0.5,
		ease: Power4.easeInOut
	});
	
	detector1.spacing = 7;
	detector2.spacing = 7;
	TweenMax.to(detector1, 1, {
		spacing: 1.5,
		delay: 1.0,
		ease: Power4.easeInOut
	});
	TweenMax.to(detector2, 1, {
		spacing: 1.5,
		delay: 1.0,
		ease: Power4.easeInOut
	});
	
	var labels = [
		analyzer3.label, detector1.label, detector2.label,
		detector1.counterLabel, detector2.counterLabel
	];
	for (var i in labels) {
		TweenMax.to(labels[i], 0.5, {
			opacity: 1,
			delay: 2
		});
	}
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 2 - Three analyzer experiments
tutorial.part2 = {};

// Rotate 2nd analyzer
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	// Move camera away a bit and at a angle to better show the rotation
	camera.moveFocusTo(new THREE.Vector3(9,1,0), 1);
	TweenMax.to(camera, 1, {
		x: 6,
		y: 7,
		z: 9,
		ease: Power2.easeInOut
	});
	
	// Tweak label positions for new perspective
	TweenMax.to(detector1.counterLabel.position, 1, {
		x: 2,
		ease: Power2.easeInOut
	});
	TweenMax.to(detector2.counterLabel.position, 1, {
		x: 2,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer3.label.position, 1, {
		x: 1,
		ease: Power2.easeInOut
	});
	
	// Show angle meter
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 1,
		delay: 1,
		ease: Power2.easeInOut
	});
	
	// Glow analyzer B
	TweenMax.to(analyzer2, 0.5, {
		glow: 1,
		delay: 1,
		ease: Power2.easeInOut
	});
	
	// Show axes
	viewport.add(axes);
	axes.position.x = 2;
	axes.position.y = 3.7;
	axes.position.z = -0.5;
	axes.opacity = 0;
	TweenMax.to(axes, 1, {
		opacity: 1,
		delay: 1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	analyzer2.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
	analyzer2.cursor = "pointer";
}

// Get ready to release atoms
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	analyzer2.events.off(SGE.EVENT_PRESS);
	analyzer2.cursor = "default";
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	// Rotate analyzer B
	TweenMax.to(analyzer2, 1, {
		angle: SGE.TAU/4,
		glow: 0,
		ease: Power4.easeInOut
	});
	
	// Show stats bar
	stats.opacity = 0;
	app.add(stats, 365, 315);
	TweenMax.to(stats, 1, {
		opacity: 1,
		delay: 1
	});

	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Release atoms
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	// Hide angle meter
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	// Force 80% of the atoms to come spin up from the source
	// This is so the detections happen more quickly and the speed up animation works better
	source.events.on(SGE.EVENT_LEAVE,function(){
		if (Math.random() <= 0.8) experiment.atomR.spin = 0;
	});
	
	// Run continuously, speeding up
	detector1.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
		tutorial.numAtoms++;
		updateStats(detector1.counter, detector2.counter);
	});
	detector2.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
		tutorial.numAtoms++;
		updateStats(detector1.counter, detector2.counter);
	});
	
	
	tutorial.run(tutorial.part2.step3);
	
	// ------------- For next step
	// Automatic
}


// Talk about the results
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
}


// Second experiment
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-4'], true);
	
	// Hide stats
	TweenMax.to(stats, 1, {
		opacity: 0
	});
	
	// Show angle meter
	TweenMax.to(analyzer3.angleMeter, 0.5, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	
	// Glow analyzer B
	TweenMax.to(analyzer3, 0.5, {
		glow: 1,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	analyzer3.events.on(SGE.EVENT_PRESS, tutorial.part2.step5);
	analyzer3.cursor = "pointer";
}

// Get ready to release atoms
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	analyzer3.events.off(SGE.EVENT_PRESS);
	analyzer3.cursor = "default";
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	// Rotate analyzer C
	TweenMax.to(analyzer3, 1, {
		angle: SGE.TAU/4,
		glow: 0,
		ease: Power4.easeInOut
	});
	
	// Tweak labels
	TweenMax.to(detector1.label.position, 1, {
		x: -0.5,
		y: 1.5,
		z: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to(detector2.label.position, 1, {
		x: -0.5,
		y: 1.5,
		z: 0,
		ease: Power4.easeInOut
	});
	
	// Reset and show stats bar
	detector1.counter = 0;
	detector2.counter = 0;
	updateStats(detector1.counter, detector2.counter);
	
	TweenMax.to(stats, 1, {
		opacity: 1,
		delay: 1
	});

	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step6);
}

tutorial.part2.step6 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	// messagebox.setMessage(MESSAGES['2-6'], true);
	
	// Hide angle meter
	TweenMax.to(analyzer3.angleMeter, 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	
	tutorial.run(tutorial.part2.step7);
	
	// ------------- For next step
	// btGo.enabled = true;
	// btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step6);
}


// Talk about the results
tutorial.part2.step7 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-7'], true);
	
	// ------------- For next step
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.intro);
}

/*
TODO: 
This part was ignored until we figure out what to do in case of arrangements where no atoms
reach the detectors

Perhaps putting a custom ignore on analyzer B "+SGE.Symbols.MINUS+" and checking if after 50 atoms all hit it.
But then, how to reset? It would be good to have a message of sorts. That would require a message
every time.
*/
/*
// -------------------------------------------------------------------------------------------------
// Part 3 - Test your understanding
tutorial.part3 = {};
tutorial.part3.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-0'], true);
	
	// Reset
	detector1.counter = 0;
	detector2.counter = 0;
	updateStats(detector1.counter, detector2.counter);
	
	// ------------- For next step
	tutorial.part3.reset();
}

tutorial.part3.run = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	// Reset
	detector1.counter = 0;
	detector2.counter = 0;
	updateStats(detector1.counter, detector2.counter);
	
	// Hide angle meters
	TweenMax.to(analyzer1.angleMeter, 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer3.angleMeter, 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	// Un-glow analyzers
	TweenMax.to(analyzer1, 0.5, {
		glow: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer2, 0.5, {
		glow: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer3, 0.5, {
		glow: 0,
		ease: Power4.easeInOut
	});
	
	// Remove cursors and events
	analyzer1.events.off(SGE.EVENT_PRESS);
	analyzer3.events.off(SGE.EVENT_PRESS);
	analyzer2.events.off(SGE.EVENT_PRESS);
	analyzer1.cursor = "default";
	analyzer2.cursor = "default";
	analyzer3.cursor = "default";
	
	// Run experiment
	tutorial.run(tutorial.part3.reset);
	
	// ------------- For next step
	// Automatic
}

tutorial.part3.reset = function() {
	// ------------- Clean up previous step
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	TweenMax.killAll(true);
	// ------------- Current step
	
	// Show angle meters
	TweenMax.to(analyzer1.angleMeter, 0.5, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer3.angleMeter, 0.5, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	
	// Glow analyzers
	TweenMax.to(analyzer1, 1, {
		glow: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer2, 1, {
		glow: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer3, 1, {
		glow: 1,
		ease: Power4.easeInOut
	});
	
	// Add events
	tutorial.part3.rotating = [false, false, false];
	analyzer1.events.on(SGE.EVENT_PRESS, function(){
		if (tutorial.part3.rotating[0]) return;
		tutorial.part3.rotating[0] = true;
		TweenMax.to(analyzer1, 0.5, {
			angle: analyzer1.angle + SGE.TAU/4,
			ease: Power4.easeInOut,
			onComplete: function() { tutorial.part3.rotating[0] = false; }
		});
	});
	analyzer2.events.on(SGE.EVENT_PRESS, function(){
		if (tutorial.part3.rotating[1]) return;
		tutorial.part3.rotating[1] = true;
		TweenMax.to(analyzer2, 0.5, {
			angle: analyzer2.angle + SGE.TAU/4,
			ease: Power4.easeInOut,
			onComplete: function() { tutorial.part3.rotating[1] = false; }
		});
	});
	analyzer3.events.on(SGE.EVENT_PRESS, function(){
		if (tutorial.part3.rotating[2]) return;
		tutorial.part3.rotating[2] = true;
		TweenMax.to(analyzer3, 0.5, {
			angle: analyzer3.angle + SGE.TAU/4,
			ease: Power4.easeInOut,
			onComplete: function() { tutorial.part3.rotating[2] = false; }
		});
	});
	analyzer1.cursor = "pointer";
	analyzer2.cursor = "pointer";
	analyzer3.cursor = "pointer";
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part3.run);
}

*/


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


