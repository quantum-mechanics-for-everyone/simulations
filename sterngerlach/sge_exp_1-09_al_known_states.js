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
// Tutorial 1.09: Analyzer Loops (Part 2: Atoms with a known state)
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
		"Welcome to the ninth interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll explore a bit more the effects of analyzer loops.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: A new type of atom source</strong>",
		"Before we continue, it would be useful to introduce a new type of source of atoms. This will greatly simplify the following experiments.",
		"What we need is a source that always releases atoms with a known state. We can achieve this by chaining a few familiar objects.",
		"Above, we see a source, an analyzer and a half-open gate connected together. By combining these objects we can be sure that any outgoing atom will be at the "+SGE.Symbols.PLUS+" state.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"We will represent these three objects put together as a new object: the source of atoms with a known state.",
		"This source will be marked on its sides by an arrow. The arrow points in the direction where an analyzer would measure a "+SGE.Symbols.PLUS+" state.",
		"Press "+btNext.textVersion+" to try it out."
	],
	'1-2': [
		"As you can see, the analyzer always finds these atoms to be in the "+SGE.Symbols.PLUS+" state. This is just as we've seen in previous experiments. If we rotated the source upside down, all atoms would leave the analyzer from the "+SGE.Symbols.MINUS+" output instead.",
		"Now that you're familiar with this new type of source, we can continue our exploration of analyzer loops.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: More analyzer loop experiments</strong>",
		"We are now ready to continue our exploration on analyzer loops. We'll resume from where we left, with the analyzer loop followed by an analyzer and two detectors.",
		"Notice that this is exactly the same setup as before. We only changed the source of atoms to a source with atoms with a known state.",
		"But how will this change anything? Press "+btNext.textVersion+" to continue."
	],
	'2-1': [
		"Here's how we'll perform the next experiments: we'll rotate the analyzer loop by 90° this time.",
		"We have also opened the gate along the "+SGE.Symbols.PLUS+" branch, but left the "+SGE.Symbols.MINUS+" branch closed.",
		"As before, we'll be detecting 100 atoms in total. Given the current setup, what do you think the results will be?",
		"Make a prediction, then press "+btGo.textVersion+" to begin the experiment."
	],
	// '2-2': not used,
	'2-3': [
		"In this case, we find that about half of the atoms are detected by D1 and half by D2.",
		"All atoms reaching analyzer B must have passed through the "+SGE.Symbols.PLUS+" branch, otherwise they would have been blocked by the gate. This means all of these atoms were in the "+SGE.Symbols.PLUS+" state along the +"+SGE.Symbols.X+" direction, in which the analyzer loop is oriented.",
		"As we've seen before, in this case the analyzer loop is acting just like a regular analyzer at 90&deg;, so there's an equal likelihood of the atom going either way through analyzer B.",
		"With this in mind, what if we closed the "+SGE.Symbols.PLUS+" branch, but left the "+SGE.Symbols.MINUS+" branch open instead?",
		"Make a prediction, then press "+btGo.textVersion+" to begin the experiment."
	],
	// '2-4': not used,
	'2-5': [
		"The results are the same as before, since we have just reversed the situation. The analyzer loop acts just like an analyzer with its "+SGE.Symbols.PLUS+" state along the -"+SGE.Symbols.X+" direction now, the opposite of before.",
		"Since both directions are perpendicular to analyzer B, the results are the same. This is what we have learned in previous tutorials.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-6': [
		"So far, there were no surprises. All we have seen here has matched the results of previous experiments.",
		"But there's one configuration for the gate remaining: when both branches are open. What would happen in that case? We'll address this question next.",
		"This concludes this tutorial. Make sure to give the above question some thought before proceeding with the course."
	]
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment(); // main experiment
// Speed up atoms
experiment.atomSpeed = 6;

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_NORMAL; // throw unknown spin atoms (for now)

// Camera
var camera = viewport.camera;
camera.x = 4;
camera.y = 3;
camera.z = 8;
camera.lookAt(new THREE.Vector3(camera.x,0,0)); // look at, not focus

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();
// Set labels
analyzer1.label.text = "A";
analyzer2.label.text = "B";
analyzer1.label.position.y = -2.75;
analyzer2.label.position.y = -2.75;

// Custom "ignore" targets
var ignore1 = new SGE.Ignore();
var ignore2 = new SGE.Ignore();
ignore1.silent = true;
ignore2.silent = true;

// Scale angle meters for analyzers
analyzer1.angleMeter.radius = 3;
analyzer2.angleMeter.radius = 3;

// Eraser
var eraser = new SGE.Eraser();
eraser.label.text = "QUANTUM\nERASER";
eraser.label.size = 0.75;
eraser.label.position.y = 2.5;

// Gate
var gate = new SGE.Gate();
gate.label.size = 0.75;
gate.label.position.y = 2.5;
gate.silent = false;
gate.topOpen	= true;
gate.bottomOpen	= false;

// Detectors
var detector1 = new SGE.Detector();
var detector2 = new SGE.Detector();
detector1.spacing = 1.5;
detector2.spacing = 1.5;
detector1.label.text = "D1";
detector2.label.text = "D2";
detector1.label.position.x = 2.75;
detector2.label.position.x = 2.75;
detector1.label.opacity = 1;
detector2.label.opacity = 1;
detector1.counterLabel.position.x = 1.35;
detector2.counterLabel.position.x = 1.35;
detector1.counterLabel.color = SGE.GLOW_COLOR;
detector2.counterLabel.color = SGE.GLOW_COLOR;
detector1.counterLabel.opacity = 1;
detector2.counterLabel.opacity = 1;
detector1.counterLabel.size = 0.65;
detector2.counterLabel.size = 0.65;
detector1.counterLabel.alwaysVisible = true;
detector2.counterLabel.alwaysVisible = true;

// Stats bar
var stats = new SGE.Canvas2D(500, 45);
stats.shadow = 10;

function updateStats(d1, d2) {
	var f = "20px monospace";
	stats.clear(0xFFFFFF,1);
	
	var dt = d1+d2;
	var m = 10;
	var bw = 360;
	var bh = 25;
	var bs = 35;
	var by = 10;
	var c1 = [0xed6229,0xf28444];
	var c2 = [0x0e88d1,0x0fa8e0];
	
	stats.text(
		"Total: " + SGE.padString(d1+d2, 3, " ", -1),
		m + bw + m, by + bh/2,
		0x000000, f, SGE.PAD_LEFT
	);
	
	stats.fillRect(m, by, bw, bh, 0xE0E0E0, 1);
	
	if (dt) {
		stats.fillRect(m+bs, by, (bw-2*bs)*(d1/(d1+d2)), bh, c1[0], 1);
		stats.fillRect(m+bs, by, (bw-2*bs)*(d1/(d1+d2)), bh-10, c1[1], 1);
		stats.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), by, (bw-2*bs)*(d2/(d1+d2)), bh, c2[0], 1);
		stats.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), by, (bw-2*bs)*(d2/(d1+d2)), bh-10, c2[1], 1);
	}
	
	stats.fillRect(m, by, bs, bh, c1[0], 1);
	stats.fillRect(m, by, bs, bh-4, c1[1], 1);
	stats.rect(m, by, bs, bh, 0, 1, 1);
	
	stats.fillRect(m+bw-bs, by, bs, bh, c2[0], 1);
	stats.fillRect(m+bw-bs, by, bs, bh-4, c2[1], 1);
	stats.rect(m+bw-bs, by, bs, bh, 0, 1, 1);
	
	stats.line(m+bs+(bw-2*bs)/2, by-5, m+bs+(bw-2*bs)/2, by+bh+5, 0x000000, 1, 1);
	
	stats.rect(m, by, bw, bh, 0, 1, 1);
	stats.rect(m+bs, by, bw-2*bs, bh, 0, 1, 1);
	
	stats.text("D1", m + bs / 2, by + bh/2, 0x000000, f, 0);
	stats.text("D2", m + bw - bs / 2, by + bh/2, 0x000000, f, 0);
}

function resetStats() {
	detector1.counter = 0;
	detector2.counter = 0;
	updateStats(0, 0);
}

resetStats();

// Event handlers
detector1.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
	tutorial.numAtoms++;
	updateStats(detector1.counter, detector2.counter);
});
detector2.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
	tutorial.numAtoms++;
	updateStats(detector1.counter, detector2.counter);
});

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
	gate.silent = false;
	var maxtf = 1000;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		if (SGE.AnimationManager.timeFactor < maxtf) {
			SGE.AnimationManager.timeFactor *= 1.2; // speed up
			if (SGE.AnimationManager.timeFactor >= maxtf) {
				SGE.AnimationManager.timeFactor = maxtf;
				experiment.ignoreSilently = true;
				gate.silent = true;
			}
		}
		clearTimeout(tutorial.timer);
		
		// Stop after N atoms have been detected
		if (tutorial.numAtoms == N) {
			callback();
			return;
		}
		
		// Keep releasing atoms
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 10);
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	experiment.run();
	
	btNext.enabled = false;
}

tutorial.continuousRun = function() {
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, 50);
}
tutorial.startContinuousRun = function() {
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.events.on(SGE.EVENT_END_EXPERIMENT, tutorial.continuousRun);
	tutorial.continuousRun();
}
tutorial.stopContinuousRun = function() {
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	clearTimeout(tutorial.timer);
}

// -------------------------------------------------------------------------------------------------
// Introduction
// We start with a source, an analyzer and a gate
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - analyzer loops
tutorial.part1 = {};

// Show source+analyzer+gate and connect them
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// Add experiment
	viewport.addExperiment(experiment);
	experiment.position.y = 6;
	
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.attach(gate);
	
	gate.attach(ignore1, SGE.IO_TOP);
	gate.attach(ignore2, SGE.IO_BOTTOM);
	ignore1.spacing = 6;
	ignore2.spacing = 6;
	
	TweenMax.to(experiment.position, 1.5, {
		y: 0,
		ease: Power4.easeInOut
	});
	
	// Spacing forces XYZ positions, so we set it up first
	analyzer1.spacing = 1.5;
	gate.spacing = 2;
	
	camera.x = 5;
	
	// Force source to always emit spin-up atoms
	source.events.on(SGE.EVENT_RELEASE_PARTICLE, function(e) {
		e.particle.spin = source.angle;
	});
	
	experiment.revealStates = true;
	
	TweenMax.to([analyzer1, gate], 1, {
		spacing: 0,
		ease: Power4.easeInOut,
		delay: 1,
		onComplete: function() {
			tutorial.startContinuousRun();
		}
	});
	
	TweenMax.to(camera, 1, {
		x: 3.5,
		delay: 1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1a);
}

// Replace them with a spin-up source of atoms
tutorial.part1.step1a = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	tutorial.stopContinuousRun();
	
	// Begin swap
	TweenMax.to(experiment.position, 1, {
		y: 7,
		ease: Power4.easeIn,
		onComplete: tutorial.part1.step1b
	});
}

tutorial.part1.step1b = function() {
	
	// Deatach objects
	ignore1.detach();
	ignore2.detach();
	analyzer1.detach();
	gate.detach();
	
	// Remove them
	experiment.remove(ignore1);
	experiment.remove(ignore2);
	experiment.remove(analyzer1);
	experiment.remove(gate);
	experiment.position.y = -10;
	
	// Set to spin-up source
	source.sourceType = SGE.SOURCE_TYPE_SPINUP;
	source.events.off(SGE.EVENT_RELEASE_PARTICLE);
	
	// Attach ignore
	source.attach(ignore1, SGE.IO_RIGHT);
	ignore1.spacing = 7;
	
	camera.x = 0;
	
	// Finish swap
	TweenMax.to(experiment.position, 1, {
		y: 0,
		ease: Power4.easeOut
	});
	
	// Close up on new source
	camera.focusOn(new THREE.Vector3());
	TweenMax.to(camera, 1, {
		rho: 5,
		ease: Power4.easeOut,
		delay: 0
	});
	
	// Fade in label
	source.label.text = "KNOWN STATE\nATOM SOURCE";
	source.label.size = 1/3;
	source.label.position.y = 1.25;
	source.label.opacity = 0;
	TweenMax.to(source.label, 1, {
		opacity: 1,
		delay: 1,
		onComplete: function() {
			tutorial.startContinuousRun(); // release atoms
		}
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Bring in analyzer
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	tutorial.stopContinuousRun(); // stop experiment
	
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	// Get rid of ignore target
	ignore1.detach();
	experiment.remove(ignore1);
	
	// Attach analyzer
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.spacing = 13;
	analyzer1.attach(ignore1, SGE.IO_TOP);
	
	// Fade out label
	TweenMax.to(source.label, 0.5, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	// Move camera
	camera.focusOn(new THREE.Vector3(0,0,0));
	camera.moveFocusTo(new THREE.Vector3(3,0,0), 1, 0.5);
	TweenMax.to(camera, 1, {
		x: 3,
		rho: 8,
		delay: 0.5,
		ease: Power2.easeInOut
	});
	
	TweenMax.to(analyzer1, 2, {
		spacing: 2,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() {
			tutorial.startContinuousRun();
		}
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 2 - More analyzer loop experiments
tutorial.part2 = {};

// Resume where we left
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	gate.topOpen = false;
	gate.bottomOpen = false;
	
	ignore1.detach();
	analyzer1.attach(gate);
	gate.attach(eraser);
	eraser.attach(analyzer2);
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	
	camera.moveFocusTo(new THREE.Vector3(12, 0, 0), 2);
	TweenMax.to(camera, 2, {
		theta: SGE.TAU/4,
		phi: SGE.TAU/6,
		rho: 12,
		ease: Power2.easeInOut
	});
	
	gate.spacing = 15;
	analyzer2.spacing = 10;
	
	TweenMax.to(gate, 2, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to([analyzer1, analyzer2], 2, {
		spacing: 1.5,
		ease: Power4.easeInOut
	});
	
	detector1.label.position.x = 2.75;
	detector2.label.position.x = 2.75;
	detector1.counterLabel.position.x = 1.35;
	detector2.counterLabel.position.x = 1.35;
	detector1.counterLabel.size = 0.65;
	detector2.counterLabel.size = 0.65;
	
	// Add stats 
	app.add(stats);
	stats.opacity = 0;
	stats.x = viewport.x + (viewport.width - stats.width)/2;
	stats.y = viewport.y + viewport.height - stats.height - 20;
	
	// Fade in stats & labels
	gate.label.text = "ANALYZER LOOP";
	gate.label.position.x = 1;
	TweenMax.to([stats, gate.label, analyzer1.label, analyzer2.label], 1, {
		opacity: 1,
		delay: 2,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Talk more about analyzer
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	analyzer1.angleMeter.opacity = 0;
	TweenMax.to(analyzer1.angleMeter, 1, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	
	// Rotate analyzer loop
	TweenMax.to(analyzer1, 1, {
		angle: SGE.TAU/4,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() {
			gate.blink();
			gate.topOpen = true;
			gate.bottomOpen = false;
		}
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Run experiment OPEN CLOSED
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	tutorial.run(tutorial.part2.step3);
	
	TweenMax.to(analyzer1.angleMeter, 1, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	// Automatic
}

// Talk about results
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	tutorial.stopContinuousRun();
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	gate.blink();
	gate.topOpen = false;
	gate.bottomOpen = true;
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
}

// Run experiment CLOSED OPEN
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	tutorial.run(tutorial.part2.step5);
	
	// ------------- For next step
	// Automatic
}

// Talk about results
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	tutorial.stopContinuousRun();
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step6);
}

// Conclusion, teaser for next
tutorial.part2.step6 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-6'], true);
	
	gate.blink();
	gate.topOpen = true;
	gate.bottomOpen = true;
	
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


