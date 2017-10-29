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
// Tutorial 1.08: Analyzer Loops (Part 1: Introduction)
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
		"Welcome to the eighth interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll begin our exploration on analyzer loops.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Analyzer loops</strong>",
		"In previous tutorials we explored the nature of measurements for quantum objects. It's time to explore another very important quantum phenomenon: interference.",
		"For this, we will introduce a new object we can use in our experiments, the analyzer loop, which is made out of an analyzer connected to a quantum eraser.",
		"Press "+btNext.textVersion+" to bring a quantum eraser into our experiment."
	],
	'1-1': [
		"This is a quantum eraser, which has two inputs and one output. As the front cover suggests, inside of the eraser we have two distinct input branches that merge into one output. The two branches are constructed so that they are <em>absolutely identical</em>.",
		"This is an important feature. If both branches are identical, then there is no way to tell which branch an atom took through the eraser, if we are only looking at its output.",
		"To see how this affects our experiments, and understand why we call it an \"eraser\", let us connect the eraser to the analyzer.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-2': [
		"We have connected the analyzer with the eraser, which together now act like a single object: the analyzer loop.",
		"Now that both objects are connected we have no way of knowing what's happening inside the analyzer loop. All we can know is that for any atom that enters the analyzer loop, an atom leaves.",
		"Since both paths the atom could possibly take are absolutely identical, we no longer have any information about the outgoing atom. We can't know its state. The analyzer loop seems to be doing nothing at all!",
		"But exactly how does this affect the measurements performed by analyzers? This is what we'll explore next.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Analyzer loops, gates and measurements</strong>",
		"As it is, the analyzer loop seems to be an useless object: an atom with an unknown state goes in, and the atom emerges with the same unknown state. So it appears as if the analyzer loop does nothing! However, we can actually use this device to reveal a very important property of quantum objects.",
		"Imagine, for instance that we had a way to control which branch the atom can go through. We could then use the analyzer loop as an \"adjustable analyzer\" that only lets through atoms with a given state.",
		"We need something to control the flow of atoms through each branch, some sort of gate for the branches. Press "+btNext.textVersion+" to add a gate to the analyzer loop."
	],
	// '2-1': not used,
	'2-2': [
		"We have added a gate between the analyzer and the eraser. With it, we can open and close each branch separately to change the behavior of the analyzer loop.",
		"The "+SGE.Symbols.OPEN+" symbol indicates that the "+SGE.Symbols.PLUS+" branch is currently open, while the "+SGE.Symbols.CLOSED+" symbol indicates that the "+SGE.Symbols.MINUS+" branch is currently closed.",
		"Since each branch can be either open or closed, there are four possible ways the analyzer loop can be set up. Let's see how each of these setups change the results of measurements.",
		"Press "+btNext.textVersion+" to bring in another analyzer along with two detectors."
	],
	'2-3': [
		"As before, we'll be releasing 100 atoms and keeping track of how many reach each of the detectors. We'll start by running an experiment with the "+SGE.Symbols.PLUS+" branch open and the "+SGE.Symbols.MINUS+" branch closed.",
		"In this configuration, what do you expect the results to be? Make a prediction and press "+btGo.textVersion+" to begin the experiment."
	],
	// '2-4': not used,
	'2-5': [
		"We find that all atoms went to detector D1, and none to D2. This makes sense, as we know any atom reaching analyzer B must have passed through the "+SGE.Symbols.PLUS+" branch, associated with the "+SGE.Symbols.PLUS+" state, because otherwise it would have been blocked by the gate.",
		"In other words, this analyzer loop setup is acting just like a regular analyzer.",
		"In this case, we also know that the atoms were blocked at the "+SGE.Symbols.MINUS+" branch, as was shown, and this is an extra bit of information available to us with the analyzer loop.",
		"What if the "+SGE.Symbols.MINUS+" branch was open instead? Press "+btGo.textVersion+" to try it out."
	],
	// '2-6': not used,
	'2-7': [
		"We now find all atoms going to detector D2 instead of D1. This analyzer loop is acting just like an upside down analyzer.",
		"As before, we also know that the "+SGE.Symbols.PLUS+" branch is the one where particles were being blocked.",
		"Now, what would happen if <em>both</em> branches were open? Make a prediction, and press "+btGo.textVersion+" to start the experiment."
	],
	// '2-8': not used,
	'2-9': [
		"We see that about half of the particles go to each detector. As predicted, the analyzer loop seems to be doing nothing at all in this case. As far as the results show, it's as if analyzer A didn't even exist!",
		"There's only one final setup we need to consider: when both branches are closed.",
		"What would happen then? Press "+btGo.textVersion+" to start the experiment."
	],
	'2-10': [
		"In this case, no detectors ever detect anything. All atoms are being blocked by the gate.",
		"However, notice that we cannot know which branch is blocking the atom. We know the gate blocked the atoms, but the information about which branch the particle went through is once again unavailable.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Conclusion
	'conclusion': [
		"<strong>Conclusion</strong>",
		"As we found out, when analyzers perform a measurement they define the state of the atom. We can tell the states apart because of their deflection by the non-uniform magnetic field, which leads them to different outputs.",
		"In other words, the states of the atoms became <em>correlated</em> with their position, and this is how we can tell the states apart. The eraser undoes this by <em>erasing</em> that correlation.",
		"These details may seem obvious, but they have subtle implications that are crucial in understanding the behavior of quantum objects, as we'll soon see.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
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
camera.x = 4;
camera.y = 3;
camera.z = 8;
camera.focusOn(new THREE.Vector3(camera.x,0,0));

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();
// Set labels
analyzer1.label.text = "ANALYZER";
analyzer1.label.position.y = 2.5;
analyzer1.label.size = 0.75;
analyzer1.spacing = 1.5;
analyzer1.label.opacity = 1;

// Custom "ignore" targets
var ignore1 = new SGE.Ignore();
var ignore2 = new SGE.Ignore();
ignore1.silent = true;
ignore2.silent = true;

// Scale angle meters for analyzers
// analyzer1.angleMeter.radius = 3;
// analyzer2.angleMeter.radius = 3;
// analyzer2.angleMeter.label.size = 0.75;
// analyzer2.angleMeter.symmetricAngleRange = false;

// Eraser
var eraser = new SGE.Eraser();
eraser.label.text = "QUANTUM\nERASER";
eraser.label.size = 0.75;
eraser.label.position.y = 2.5;

// Gate
var gate = new SGE.Gate();
gate.label.text = "ANALYZER LOOP";
gate.label.size = 0.75;
gate.label.position.y = 2.25;
gate.silent = false;
gate.topOpen	= true;
gate.bottomOpen	= false;

// Detectors
var detector1 = new SGE.Detector();
var detector2 = new SGE.Detector();
detector1.spacing = 2;
detector2.spacing = 2;
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
	
	// for(var i = 1; i < 4; i++) {
		// stats.line(
			// Math.floor(m+bs+(bw-2*bs)*i/4), by,
			// Math.floor(m+bs+(bw-2*bs)*i/4), by+bh,
			// 0x000000, 0.1, 1
		// );
	// }
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
// We start with a source and an analyzer running continuously
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Add experiment
	viewport.addExperiment(experiment);
	source.attach(analyzer1, SGE.IO_RIGHT);
	// analyzer1.attach(analyzer2, SGE.IO_TOP);
	analyzer1.attach(ignore1, SGE.IO_TOP);
	analyzer1.attach(ignore2, SGE.IO_BOTTOM);
	ignore1.spacing = 10;
	ignore2.spacing = 10;
	
	// Speed up atoms
	experiment.atomSpeed = 10;
	
	// Release atoms continuously
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){ tutorial.startContinuousRun(); },1000);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Analyzer loops
tutorial.part1 = {};

// Show source and analyzer still, change text
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
}

// Bring quantum eraser in
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// Move camera
	camera.moveFocusTo(new THREE.Vector3(8, 0, 0), 1);
	TweenMax.to(camera, 1, {
		x: 8,
		rho: 12,
		ease: Power2.easeInOut
	});
	
	// Add eraser
	ignore1.detach();
	ignore2.detach();
	analyzer1.attach(eraser);
	eraser.spacing = 15;
	TweenMax.to(eraser, 1, {
		spacing: 4,
		delay: 0.5,
		ease: Power4.easeInOut
	});
	TweenMax.to(eraser.label, 1, {
		opacity: 1,
		delay: 1.5,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Assemble analyzer loop
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	// Connect eraser
	TweenMax.to(eraser, 1.5, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	
	// Move camera slightly inwards
	camera.moveFocusTo(new THREE.Vector3(7, 0, 0), 1, 1.5);
	TweenMax.to(camera, 1, {
		x: 7,
		rho: 10,
		delay: 1.5,
		ease: Power2.easeInOut
	});
	
	TweenMax.to(eraser.label, 0.5, {
		opacity: 0,
		delay: 2,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer1.label, 0.5, {
		opacity: 0,
		delay: 2,
		ease: Power4.easeInOut,
		onComplete: function() {
			analyzer1.label.text = "ANALYZER LOOP";
			analyzer1.label.position.x = 2.25;
		}
	});
	TweenMax.to(analyzer1.label, 0.5, {
		opacity: 1,
		delay: 2.5,
		ease: Power4.easeInOut,
		onComplete: function() {
			tutorial.startContinuousRun();
		}
	});
	
	eraser.attach(ignore1);
	ignore1.spacing = 6;
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 2 - Analyzer loops, gates and measurements
tutorial.part2 = {};

// Talk about experiment
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Add gate
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	
	var spacing = 1.4;
	
	TweenMax.to(analyzer1.label, 0.5, {
		opacity: 0,
		ease: Power4.easeInOut
	});
	
	// Disconnect eraser
	eraser.detach();
	TweenMax.to(eraser.position, 1, {
		x: analyzer1.position.x + 6 + spacing*2,
		ease: Power4.easeInOut
	});
	
	// Add gate
	experiment.add(gate);
	gate.position.set(analyzer1.position.x + 3 + spacing, 7, 0);
	TweenMax.to(gate.position, 1.5, {
		y: 0,
		delay: 0.5,
		ease: Power4.easeInOut,
		onComplete: function() {
			gate.spacing = spacing;
			eraser.spacing = spacing;
			analyzer1.attach(gate);
			gate.attach(eraser);
			tutorial.part2.step2();
		}
	});
	
	// ------------- For next step
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Ready with gate
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	
	TweenMax.to(eraser, 1, {
		spacing: 0,
		ease: Power4.easeInOut,
	});
	TweenMax.to(gate, 1, {
		spacing: 0,
		ease: Power4.easeInOut,
	});
	
	TweenMax.to(gate.label, 1, {
		opacity: 1,
		delay: 1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Assemble experiment
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;

	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	tutorial.stopContinuousRun();
	
	// Camera
	camera.moveFocusTo(new THREE.Vector3(12, 0, 0), 1);
	TweenMax.to(camera, 1, {
		x: 12,
		rho: 12,
		ease: Power2.easeInOut
	});
	
	// Remove hidden ignore
	ignore1.detach();
	
	// Assemble experiment
	eraser.attach(analyzer2);
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	analyzer2.spacing = 14;
	TweenMax.to(analyzer2, 1.5, {
		spacing: 1.5,
		ease: Power2.easeInOut
	});
	
	// Detectors
	detector1.spacing = 4;
	detector2.spacing = 4;
	TweenMax.to(detector1, 1.5, {
		spacing: 1.5,
		delay: 0.5,
		ease: Power4.easeInOut
	});
	TweenMax.to(detector2, 1.5, {
		spacing: 1.5,
		delay: 0.5,
		ease: Power4.easeInOut
	});
	
	// Labels
	analyzer1.label.text = "A";
	analyzer2.label.text = "B";
	analyzer1.label.size = 1;
	analyzer2.label.size = 1;
	analyzer1.label.position.set(0,-3,0);
	analyzer2.label.position.set(0,-3,0);
	analyzer1.label.opacity = 0;
	analyzer2.label.opacity = 0;
	TweenMax.to(analyzer1.label, 0.5, {
		opacity: 1,
		delay: 2.5,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer2.label, 0.5, {
		opacity: 1,
		delay: 2.5,
		ease: Power2.easeInOut
	});
	
	// Add stats 
	app.add(stats);
	stats.opacity = 0;
	TweenMax.to(stats, 1, {
		opacity: 1,
		delay: 2,
		ease: Power2.easeInOut
	});
	stats.x = viewport.x + (viewport.width - stats.width)/2;
	stats.y = viewport.y + viewport.height - stats.height - 20;
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
}



// Run experiment: OPEN CLOSED
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){ tutorial.run(tutorial.part2.step5); },1000);
	
	// ------------- For next step
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
}

// End first run
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step6);
}




// Run experiment: CLOSED OPEN
tutorial.part2.step6 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	gate.blink();
	gate.topOpen = false;
	gate.bottomOpen = true;
	
	TweenMax.to(gate.label.position, 1, {
		y: 2.25 + 0.5,
		ease: Power4.easeInOut
	});
	
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){ tutorial.run(tutorial.part2.step7); },1000);
	
	// ------------- For next step
	// Automatic
}

// End second run
tutorial.part2.step7 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-7'], true);
	
	TweenMax.to(gate.label.position, 1, {
		y: 2.25,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step8);
}



// Run experiment: OPEN OPEN
tutorial.part2.step8 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	gate.blink();
	gate.topOpen = true;
	gate.bottomOpen = true;
	
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){ tutorial.run(tutorial.part2.step9); },1000);
	
	// ------------- For next step
	// Automatic
}

// End second run
tutorial.part2.step9 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-9'], true);
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step10);
}



// Run experiment: CLOSED CLOSED
tutorial.part2.step10 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-10'], true);
	
	resetStats();
	gate.blink();
	gate.topOpen = false;
	gate.bottomOpen = false;
	gate.silent = false;
	
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		// Keep releasing atoms
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 500);
	});
	
	SGE.AnimationManager.timeFactor = 2; // start faster
	
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){ experiment.run(); },1000);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.conclusion);
}


// Display conclusion text, end
tutorial.conclusion = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['conclusion'], true);
	
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


