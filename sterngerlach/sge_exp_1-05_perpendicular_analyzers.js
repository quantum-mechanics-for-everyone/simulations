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
// Tutorial 1.05: Perpendicular analyzers
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
		"Welcome to the fifth interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll explore a bit more how repeated measurements work with the Stern-Gerlach analyzers.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Perpendicular analyzers</strong>",
		"From the \"conundrum of projections\", in the second tutorial, we have found that we can only get two different results when we try to measure the direction of the effective magnetic arrow of silver atoms. We also saw that this is true no matter in which direction we perform the measurement.", 
		"All of these measurements also produce the same magnitude for the effective arrows, a result that is completely at odds with the notion that these effective magnetic arrows have a definite direction <em>before</em> we measure them.",
		"In the previous tutorial, we confirmed this fact by repeating the measurement along a given direction. We found that in that case the results remain consistent across analyzers.",
		"What this all means is that the very act of measuring the direction of an effective magnetic arrow defines what that direction is.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"But we still have another issue here. Once we measure an atom as having a effective magnetic arrow pointing up or down along the "+SGE.Symbols.Z+" direction, what happens if we attempt to measure it along the "+SGE.Symbols.X+" direction?",
		"Let's find out! We'll rotate analyzer B by 90° and repeat the experiment with two analyzers.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-2': [
		"Analyzer B is now rotated by 90°. This means it will be measuring the projection of the effective magnetic arrow of the atoms along the "+SGE.Symbols.X+" axis, with the "+SGE.Symbols.PLUS+" output towards the +"+SGE.Symbols.X+" direction.",
		"We are ready to perform our experiment. What results could we obtain this time? They must be consistent with what we have found so far. Think about it for a while and make a prediction.",
		"Once you have made a prediction, press "+btGo.textVersion+" to begin the experiment. Be sure to watch it long enough to see all possibilities for the outcomes."
	],
	'1-3': [
		"Before, when analyzer B was upright, all atoms were leaving from the same output of analyzer B. Now we have atoms leaving <em>both</em> outputs!",
		"As we know, analyzer A is measuring the projection of the effective magnetic arrow of the atoms along the "+SGE.Symbols.Z+" direction. Analyzer B then measures the projection of <em>that</em> along the "+SGE.Symbols.X+" direction. Since both directions are at right angles from one another, the projections should be zero.",
		"But everything we have seen so far tells us that the projection is <em>never</em> zero, it's either positive or negative with the same magnitude.",
		"It seems that to resolve this conflict, the atoms going through analyzer B simply pick a direction at random!",
		"But just how random is all of this? We'll have to perform more careful experiments from now on.",
		"Press "+btNext.textVersion+" to continue to the next part once you have seen enough atoms."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Detectors and statistics</strong>",
		"It seems that there's some randomness involved in quantum measurements. We have seen hints of this in previous experiments, but we could usually explain it away by saying we did not have enough information about the atoms.",
		"But now, the measurements with perpendicular analyzers have forced us to take a closer look at this odd behavior. This time, we <em>know</em> the state of the atom, but it still acted in a seemingly random way.",
		"To better understand these results, we'll start to keep count of how many atoms leave each output of analyzer B.",
		"For that we'll need a new type of object for our experiment, the detector. Press "+btNext.textVersion+" to continue."
	],
	'2-1': [
		"We'll set our experiment aside for now. On the right, we now have a detector in front of a source of atoms. The number near the detector is its counter, currently at zero.",
		"Detectors will be useful because they will let us keep exact count of how many particles reach them. However, a detector can't tell apart different types of particles, or how their effective magnetic arrows are oriented. It can only tell us if a particle was detected.",
		"Press "+btGo.textVersion+" to test it out.",
	],
	'2-2': [
		"The detector is now registering all the atoms that reach it.",
		"Each time the detector registers an atom, it briefly glows yellow and its counter goes up by one.",
		"Now that we have seen how detectors work, let's add a couple of them to our original experiment.",
		"Press "+btNext.textVersion+" to go back to our previous experiment and add the detectors.",
	],
	'2-3': [
		"Back to our original experiment, we now have two detectors, D1 and D2, in front of the outputs of analyzer B.",
		"We are interested in finding out what ratio of atoms make it to each detector. Any atom coming out of the "+SGE.Symbols.MINUS+" output of analyzer A will not reach analyzer B, so we will ignore these.",
		"We'll release several atoms in total. What fraction do you think will reach each of the detectors?",
		"Make a prediction, and press "+btGo.textVersion+" when you are ready to begin the experiment."
	],
	// '2-4': not used
	'2-5': [
		"Let's compile our results in a table. They will get more and more accurate as more atoms are accounted for.",
		"As you can see, about 50% of the atoms are ignored. This means atoms coming from the source have an equal likelihood of leaving either output of analyzer A.",
		"Only atoms leaving output "+SGE.Symbols.PLUS+" of analyzer A enter analyzer B. These atoms have a definite state: we <em>know</em> their effective magnetic arrows point, in a way, upwards towards the +"+SGE.Symbols.Z+" direction.",
		"But now we see that these atoms have an equal likelihood of coming out either output of analyzer B, which is doing measurements in the "+SGE.Symbols.X+" direction.",
		"What these results show us is that an atom with a known state in the "+SGE.Symbols.Z+" direction doesn't seem to have a definite state in the "+SGE.Symbols.X+" direction. What conclusions can you take based on the findings so far?",
		"One conclusion is that for a random event we can never say what the next event will be, but we can try to predict what the probability is for the event to occur if it is repeated many times.",
		"In a future tutorial we'll see what happens if analyzer B is at an angle of 45°, or any other angle. But for now, try to ponder about all of these results.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment();
var experiment2 = new SGE.Experiment();

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_NORMAL; // throw unknown spin atoms

// Camera
var camera = viewport.camera;
camera.x = 8;
camera.y = 3;
camera.z = 8;
camera.focusOn(new THREE.Vector3(8,0,0));

// Custom "ignore" targets
var ignore1 = new SGE.Ignore();
var ignore2 = new SGE.Ignore();
var ignore3 = new SGE.Ignore();

// Axes
var axes = new SGE.Primitives.Axes();

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();

// Set labels
analyzer1.label.text = "A";
analyzer1.label.position.y = -2.5;
analyzer2.label.text = "B";
analyzer2.label.position.y =- 3.5;

// Detectors
var detector1 = new SGE.Detector();
var detector2 = new SGE.Detector();
detector1.spacing = 2.5;
detector2.spacing = 2.5;
detector1.label.text = "D1";
detector2.label.text = "D2";

var detector3 = new SGE.Detector();
detector3.spacing = 4;
detector3.label.text = "DETECTOR";
detector3.label.position.x = -0.5;
detector3.label.position.y = 1.5;
detector3.label.size = 0.5;
detector3.label.opacity = 0;

var stats = new SGE.Canvas2D(290, 145);
stats.shadow = 10;

function updateStats(total, d1, d2) {
	var f = "20px monospace";
	if (total == 0) {
		stats.clear(0xFFFFFF,1);
		stats.text("Ignored", 10, 25, 0x000000, f);
		stats.text("Detector 1", 10, 50, 0x000000, f);
		stats.text("Detector 2", 10, 75, 0x000000, f);
		stats.text("Total", 10, 130, 0x000000, f);
	}
	
	stats.fillRect(145, 0, 60, stats.height, 0xFFFFFF, 1);
	stats.text(SGE.padString(total-d1-d2, 5, " ", -1), 145, 25, 0x000000, f);
	stats.text(SGE.padString(d1, 5, " ", -1), 145, 50, 0x000000, f);
	stats.text(SGE.padString(d2, 5, " ", -1), 145, 75, 0x000000, f);
	stats.text(SGE.padString(total, 5, " ", -1), 145, 130, 0x000000, f);
	
	// Percentages
	if (total > 0) {
		stats.fillRect(225, 0, 60, stats.height, 0xFFFFFF, 1);
		var p1 = SGE.round(100*d1/total);
		var p2 = SGE.round(100*d2/total);
		stats.text(SGE.padString(100-p1-p2, 3, " ", -1) + "%", 235, 25, 0x000000, f);
		stats.text(SGE.padString(p1, 3, " ", -1) + "%", 235, 50, 0x000000, f);
		stats.text(SGE.padString(p2, 3, " ", -1) + "%", 235, 75, 0x000000, f);
		stats.text("100%", 235, 130, 0x000000, f);
	}
}

updateStats(0, 0, 0);

// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback


// -------------------------------------------------------------------------------------------------
// Introduction
// We start with the same setup as left
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Add experiment
	viewport.addExperiment(experiment);
	
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.attach(analyzer2, SGE.IO_TOP);
	analyzer1.spacing = 1.5;
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
// Part 1 - Chaining analyzers
tutorial.part1 = {};

// Show static analyzers, recap
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

// More recap, talk about repeated measurements at 90 degrees
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// Show axes
	viewport.add(axes);
	axes.position.x = 14;
	axes.position.y = 1;
	axes.opacity = 0;
	TweenMax.to(axes, 1, {
		opacity: 1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Rotate analyzer B, show axes
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	// Move camera
	TweenMax.to(camera, 1, {
		y: 6,
		z: 7,
		ease: Power4.easeInOut
	});
	// Push labels foward a bit as well
	TweenMax.to(analyzer1.label.position, 1, {
		z: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer2.label.position, 1, {
		z: 1,
		ease: Power4.easeInOut
	});
	
	// Fade in angle meter
	analyzer2.angleMeter.radius = 3;
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 1,
		delay: 1,
		ease: Power4.easeInOut
	});
	
	// Rotate analyzer B
	TweenMax.to(analyzer2, 1, {
		angle: SGE.TAU/4,
		delay: 1.5,
		ease: Power4.easeInOut
	});	
	

	
	// ------------- For next step
	btGo.enabled = true;
	btGo.blinkOn();
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1.step3);
}

// Start firing atoms
tutorial.part1.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	btGo.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	
	// Fade out angle meter
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to(axes, 0.5, {
		opacity: 0,
		ease: Power4.easeInOut
	});
	
	// Speed up atoms so we can see more events
	experiment.atomSpeed = 6;
	
	// Reveal states
	experiment.revealStates = true;
	
	// Ignore targets off screen
	ignore1.spacing = 12;
	ignore1.visible = false;
	ignore2.spacing = 7;
	ignore2.visible = false;
	ignore3.spacing = 7;
	ignore3.visible = false;
	
	// Attach ignore targets
	analyzer1.attach(ignore1, SGE.IO_BOTTOM);
	analyzer2.attach(ignore2, SGE.IO_TOP);
	analyzer2.attach(ignore3, SGE.IO_BOTTOM);
	
	// Run continuously
	tutorial.numAtoms = 0;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.numAtoms++;
		if (tutorial.numAtoms == 5) {
			btNext.enabled = true;
			btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
		}
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 500);
	});
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, 500);
	
	// ------------- For next step
	// btNext.enabled = false;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 2 - Detectors and statistics
tutorial.part2 = {};

// Intro, ask for predictions
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Focus on a detector for now
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	TweenMax.to(experiment.position, 1, {
		y: 8,
		ease: Power4.easeIn
	});
	
	tutorial.cameraLocation = camera.location;
	TweenMax.to(camera, 1, {
		rho: 6,
		delay: 1,
		ease: Power4.easeOut
	});
	
	viewport.addExperiment(experiment2);
	experiment2.position.x = 5;
	experiment2.position.z = 5;
	experiment2.position.y = -10;
	TweenMax.to(experiment2.position, 1, {
		x: 5,
		z: 0,
		y: 0,
		delay: 1,
		ease: Power4.easeOut
	});
	
	experiment2.source.attach(detector3, SGE.IO_RIGHT);
	TweenMax.to(detector3.label, 1, {
		opacity: 1,
		delay: 2,
		ease: Power4.easeInOut
	});
	
	detector3.counterLabel.position.x = 1.5;
	detector3.counterLabel.size = 2/3;
	detector3.counterLabel.color = SGE.GLOW_COLOR;
	TweenMax.to(detector3.counterLabel, 1, {
		opacity: 1,
		delay: 3,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Start testing out detector
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	
	// Run continuously
	experiment2.atomSpeed = 5;
	experiment2.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.timer = setTimeout(function(){
			experiment2.run();
		}, 500);
	});
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){
		experiment2.run();
	}, 500);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Bring back original experiment, setup detectors
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	clearTimeout(tutorial.timer);
	experiment2.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment2.end();
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	// Restore position and camera in reverse order as before
	TweenMax.to(experiment2.position, 1, {
		x: 5,
		z: 5,
		y: -10,
		ease: Power4.easeIn,
		onComplete: function() {
			viewport.removeExperiment(experiment2);
		}
	});
	
	TweenMax.to(camera, 1, {
		x: tutorial.cameraLocation.x,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z,
		delay: 1,
		ease: Power4.easeOut
	});
	
	TweenMax.to(experiment.position, 1, {
		y: 0,
		delay: 1,
		ease: Power4.easeOut
	});
	
	// Remove ignore targets
	// ignore1.detach();
	ignore2.detach();
	ignore3.detach();
	// experiment.remove(ignore1);
	experiment.remove(ignore2);
	experiment.remove(ignore3);
	
	// Keep ignore1 target at analyzer A
	// But tweak it for aesthetics
	ignore1.spacing = 1.5;
	ignore1.visible = true;
	ignore1.label.position.x = 0.1;
	ignore1.label.position.y *= -1.5
	
	// We can hide the labels for the analyzer at this point
	// TweenMax.to(analyzer1.label, 0.5, {
		// opacity: 0,
		// ease: Power4.easeInOut
	// });
	// TweenMax.to(analyzer2.label, 0.5, {
		// opacity: 0,
		// ease: Power4.easeInOut,
	// });
	
	// Move camera to a new position
	camera.moveFocusTo(new THREE.Vector3(7,0,0), 1, 2);
	TweenMax.to(camera, 1, {
		rho: 9.5,
		phi: 0.7,
		theta: 2.0,
		delay: 2,
		ease: Power2.easeInOut
	});
	// Move label of analyzer B a bit to accommodate new camera
	TweenMax.to(analyzer2.label.position, 1, {
		x: 2,
		y: -2.5,
		z: 1.5,
		delay: 2,
		ease: Power2.easeInOut
	});
	
	// Attach detectors
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	
	// Slide in detectors
	detector1.spacing = 15;
	detector2.spacing = 15;
	TweenMax.to(detector1, 1, {
		spacing: 2.5,
		delay: 3,
		ease: Power4.easeInOut
	});
	TweenMax.to(detector2, 1, {
		spacing: 2.5,
		delay: 3,
		ease: Power4.easeInOut
	});
	
	// Detector labels
	detector1.counterLabel.color = SGE.GLOW_COLOR;
	detector1.label.position.x = -0.5;
	detector1.label.position.z = 1.5;
	TweenMax.to(detector1.label, 1, {
		opacity: 1,
		delay: 3.5,
		ease: Power4.easeInOut
	});
	detector2.counterLabel.color = SGE.GLOW_COLOR;
	detector2.label.position.x = 0.5;
	detector2.label.position.z = -2;
	TweenMax.to(detector2.label, 1, {
		opacity: 1,
		delay: 3.5,
		ease: Power4.easeInOut
	});
	
	// Counter labels
	detector1.counterLabel.position.x = 2.6;
	TweenMax.to(detector1.counterLabel, 1, {
		opacity: 1,
		delay: 3.5,
		ease: Power4.easeInOut
	});
	detector2.counterLabel.position.x = 2.6;
	TweenMax.to(detector2.counterLabel, 1, {
		opacity: 1,
		delay: 3.5,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
	btGo.enabled = true;
}

// Release atoms in rapid succession
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	tutorial.numAtoms = 0;
	
	// messagebox.setMessage(MESSAGES['2-4'], true);
	
	// Run continuously, speeding up
	experiment.atomSpeed = 5;
	SGE.AnimationManager.timeFactor = 1;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		tutorial.numAtoms++;
		updateStats(tutorial.numAtoms, detector1.counter, detector2.counter);
		if (tutorial.numAtoms < 200) {
			SGE.AnimationManager.timeFactor *= 1.5; // speed up
			if (SGE.AnimationManager.timeFactor > 1e3) SGE.AnimationManager.timeFactor = 1e3;
			// if (SGE.AnimationManager.timeFactor > 31) SGE.AnimationManager.timeFactor = 31;
			clearTimeout(tutorial.timer);
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, 1);
			return;
		}
		// Go to next step automatically
		tutorial.part2.step5();
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	experiment.run();
	
	// ------------- For next step
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step5);
}

// Show table
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	// TweenMax.killAll(true);
	
	clearTimeout(tutorial.timer);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// SGE.AnimationManager.timeFactor = 1;
	// ------------- Current step
	ignore1.visible = false;
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	stats.opacity = 0;
	app.add(stats, 500, 245);
	TweenMax.to(stats, 1, {
		opacity: 1
	});
	
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.numAtoms++;
		updateStats(tutorial.numAtoms, detector1.counter, detector2.counter);
		if (tutorial.numAtoms == 5000) {
			return;
		}
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 1);
	});
	clearTimeout(tutorial.timer);
	experiment.run();
	
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


