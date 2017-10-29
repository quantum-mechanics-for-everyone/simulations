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
// Tutorial 1.11: Watching atoms
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
		"Welcome to the eleventh interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll test our understanding of the analyzer loop a bit further.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Watching for atoms</strong>",
		"In the previous tutorial we saw how the behavior of the analyzer loop forced us to depart from classical thinking.",
		"As covered in the course, when the information about the two possible outcomes is erased the analyzer loop acts as if it did not exist: the atoms go through completely undisturbed.",
		"We pointed out that the misconception was in thinking the atoms must have gone through one of the two branches. We proposed the odd notion of \"the atom going through both branches\" as an explanation.",
		"But this still feels unsatisfying to our intuition. After all, the atom can't be in two places at the same time, can it? It also seems the measurement by analyzer A must have changed the state of the atom, making it go through one of the two branches.",
		"In this tutorial, we'll attempt to test these notions.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"Let's try to find out exactly what the atom is doing when it goes through the analyzer loop.",
		"In order to do this, we'll attempt to measure the atom as it passes through either branch. We'll be using two special detectors that can detect an atom while still letting it pass through. The detectors will flash whenever they detect an atom.",
		"Press "+btNext.textVersion+" to replace the gate with the two pass-through detectors."
	],
	// '1-2': not used
	'1-3': [
		"Our pass-through detectors are now in place and we are ready to begin our first experiment. We'll start by testing the idea that the atom goes through both branches at the same time.",
		"If this is really true, what do you expect we  would see from the pass-through detectors once we start releasing atoms? What about detector D1 and D2?",
		"Make a prediction, then press "+btGo.textVersion+" to begin the experiment."
	],
	'1-4': [
		"If the atoms go through both branches at the same time, we could have expected that the pass-through detectors would both flash at the same time.",
		"But as we can see, this never happens! Whenever we detect the atom we always find it in only one of the branches.", 
		"Since the detectors reveal the position of the atom in either one of the branches, we know they must be in a definite state in the "+SGE.Symbols.X+" direction.", 
		"As a result we no longer have all atoms being detected by D1 and none by D2, but half of the atoms going to each of the two detectors. This is in a stark contrast with the results when we did not attempt to detect the atom!", 
		"Clearly, the presence of detectors \"watching\" for the atom changed the results of the experiment.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Watching for atoms at a single branch</strong>",
		"It seems that atoms are behaving differently depending on whether or not they are being \"watched\". This inspires us to try a different experiment.",
		"What if instead of having a detector at each branch we only had a single detector watching atoms in one branch? This way, it would be impossible for the detector have any effect on the atoms in the unwatched branch.",
		"Press "+btNext.textVersion+" to swap one of the detectors by a piece of piping."
	],
	// '2-1': not used
	'2-2': [
		"We have replaced one of the detectors with a straight piece of piping. This will let atoms go through completely undisturbed along the "+SGE.Symbols.MINUS+" branch.",
		"Atoms passing through the "+SGE.Symbols.PLUS+" branch are still going to be watched by the remaining pass-through detector.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-3': [
		"We are ready to begin the experiment.",
		"This time, only one branch is being watched while and the other is not. How will this change the results?",
		"Make a prediction, then press "+btGo.textVersion+" to begin the experiment."
	],
	'2-4': [
		"In this situation, whenever an atom is found by the pass-through detector to be on the "+SGE.Symbols.PLUS+" branch we <em>know</em> it has a definite state in the "+SGE.Symbols.X+" direction, so it <em>cannot</em> have a state in the "+SGE.Symbols.Z+" direction anymore.",
		"This means the atom will have an equal likelihood of going to either detector D1 and D2 after passing through analyzer B.",
		"However, if the pass-through detector does <em>not</em> detect an atom, we can just as well say we <em>know</em> the atom went through the "+SGE.Symbols.MINUS+" branch, which will also mean it has a definite state in the "+SGE.Symbols.X+" direction.",
		"In either case, the results are exactly the same as if we had two detectors watching each of the branches.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'conclusion': [
		"<strong>Conclusion</strong>",
		"So what should we take away from these results? Is measurement somehow \"magical\"? How could the atoms behave so differently just because we're watching them?",
		"The crucial idea behind these results is not the fact the atoms were being \"watched\", but whether or not, <em>in principle</em>, we could have determined which branch the atom went through.",
		"If this information can be extracted from the system in <em>any</em> way, then the atom must have been found on a definite state along the "+SGE.Symbols.X+" direction and, therefore, quantum interference cannot happen.",
		"This reveals exactly what the original analyzer loop was doing: by \"erasing\" this information and making it completely unavailable to us, it forced the atom to remain in the same state as when it entered.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment(); // main experiment
// Speed up atoms
experiment.atomSpeed = 15;

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_SPINUP;

// Camera
var camera = viewport.camera;
camera.focusOn(new THREE.Vector3(11.5, 0, 0));
camera.theta = SGE.TAU/4;
camera.phi = SGE.TAU/6;
camera.rho = 11.5;

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();
// Set labels
analyzer1.label.text = "A";
analyzer2.label.text = "B";
analyzer1.label.position.y = -2.75;
analyzer2.label.position.y = -2.75;
analyzer1.angleMeter.radius = 3;
analyzer2.angleMeter.radius = 3;
analyzer1.spacing = 1.5;
analyzer2.spacing = 1.5;

// Custom "ignore" targets
var ignore1 = new SGE.Ignore();
var ignore2 = new SGE.Ignore();
ignore1.silent = true;
ignore2.silent = true;

// Eraser
var eraser = new SGE.Eraser();

// Gate
var gate = new SGE.Gate();
var detectorGate = new SGE.DetectorGate();

// Detectors
var detector1 = new SGE.Detector();
var detector2 = new SGE.Detector();
detector1.spacing = 1.5;
detector2.spacing = 1.5;
detector1.label.text = "D1";
detector2.label.text = "D2";
detector1.label.position.x = 1.5;
detector2.label.position.x = 1.5;
detector1.label.opacity = 1;
detector2.label.opacity = 1;

// Stats bar
var stats = new SGE.Canvas2D(500, 45);
stats.shadow = 10;

function updateStats(d1, d2) {
	var f = "20px monospace";
	stats.clear(0xFFFFFF,1);
	
	var dt = d1+d2;
	var m = 10;
	var bw = 480;
	var bh = 25;
	var bs = 35;
	var by = 10;
	var c1 = [0xED6229,0xF28444];
	var c2 = [0x0E88D1,0x0FA8E0];
	
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
tutorial.cameraLocation = camera.location;
tutorial.cameraFocus    = camera.focusOnVector.clone();

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

// Run experiment with N atoms, then go to callback function
tutorial.numAtoms = 0;
tutorial.run = function(callback, N) {
	if (typeof(N) == "undefined") N = 100;
	SGE.AnimationManager.timeFactor = 1; // start faster
	experiment.ignoreSilently = false;
	gate.silent = false;
	var maxtf = 5000;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
			if (SGE.AnimationManager.timeFactor < maxtf) {
				SGE.AnimationManager.timeFactor *= 1.5; // speed up
				if (SGE.AnimationManager.timeFactor >= maxtf) {
					SGE.AnimationManager.timeFactor = maxtf;
					experiment.ignoreSilently = true;
					gate.silent = true;
				}
			}
			
			// Stop after N atoms have been detected
			if (tutorial.numAtoms >= N) {
				callback();
				return;
			}
			
			// Keep releasing atoms
			clearTimeout(tutorial.timer);
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, 1);
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	experiment.run();
}

tutorial.resume = function() {
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	experiment.resume();
}

tutorial.pause = function(step) {
	messagebox.setMessage(MESSAGES[step], true);
	experiment.pause();
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.resume);
}


// -------------------------------------------------------------------------------------------------
// Introduction
// We start with a source, an analyzer and a gate
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	viewport.addExperiment(experiment);
	
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.attach(gate);
	gate.attach(eraser);
	
	// analyzer1.angle = SGE.TAU/4;
	analyzer1.spacing = 1.5;
	gate.spacing = 0;
	
	eraser.attach(analyzer2);
	
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	
	gate.topOpen = true;
	gate.bottomOpen = true;
	analyzer1.label.opacity = 1;
	analyzer2.label.opacity = 1;
	
	gate.spacing = 0;
	eraser.spacing = 0;
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Watching for atoms
tutorial.part1 = {};

// Recap
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

// Talk about detector gate, unplug gate and eraser
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	var cx = 8;
	TweenMax.to(camera, 1.5, {
		x: cx,
		y: 3,
		z: 5,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3(cx,0,0), 1.5);
	
	TweenMax.to([gate, eraser], 1.5, {
		spacing: 1.5,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() {
			btNext.enabled = true;
			btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
		}
	});
	
	// ------------- For next step
	// allowed above
}

// Replace gate with detector gate
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.clear();
	
	// Detach objects
	gate.detach();
	eraser.detach();
	
	// Setup detectoGate to Detector+Detector
	detectorGate.topDetector.visible = true;
	detectorGate.bottomDetector.visible = true;
	detectorGate.topPipe.visible = false;
	detectorGate.bottomPipe.visible = false;
	
	// Add detectorGate
	experiment.add(detectorGate);
	// Align it with gate
	detectorGate.position.x = gate.position.x;
	// Place detectorGate offscreen (top)
	detectorGate.position.y = 5;
	
	// Replace
	TweenMax.to(detectorGate.position, 1.5, {
		y: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to(gate.position, 1.5, {
		y: -10,
		ease: Power4.easeInOut
	});
	
	tutorial.timer = setTimeout(tutorial.part1.step2a, 1500);
	
	// ------------- For next step
	// Automatic
}

// Re-attach
tutorial.part1.step2a = function() {
	TweenMax.killAll(true);
	// Remove gate
	experiment.remove(gate);
	
	// Attach detector gate
	analyzer1.attach(detectorGate);
	detectorGate.attach(eraser);
	
	// Fix spacings
	var s = gate.length - detectorGate.length; // spacing difference
	// equally distribute between eraser & detectorGate
	detectorGate.spacing = gate.spacing + s/2; 
	eraser.spacing += s/2;
	
	// Reconnect
	TweenMax.to([detectorGate, eraser], 1.5, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	
	TweenMax.to(analyzer1, 1.5, {
		angle: SGE.TAU/4,
		ease: Power4.easeInOut,
		delay: 1
	});
	
	TweenMax.to(camera, 1.5, {
		x: tutorial.cameraLocation.x + 0.5,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z + 0.5,
		ease: Power2.easeInOut,
		delay: 1,
		onComplete: tutorial.part1.step3
	});
	camera.moveFocusTo(new THREE.Vector3(tutorial.cameraLocation.x + 0.5, 0, 0), 1.5, 1);
}

// Get ready for first try
tutorial.part1.step3 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	
	app.add(stats);
	stats.x = viewport.x + (viewport.width - stats.width) / 2;
	stats.y = viewport.y + viewport.height - stats.height - 20;
	stats.opacity = 0;
	TweenMax.to(stats, 1, {
		opacity: 1
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1.step4);
}

// Start releasing atoms continuously
tutorial.part1.step4 = function() {
	// ------------- Clean up previous step
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-4'], true);
	
	tutorial.startContinuousRun();
	
	// Speed up
	SGE.AnimationManager.timeFactor = 1;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		if (SGE.AnimationManager.timeFactor < 5000) {
			SGE.AnimationManager.timeFactor *= 1.05;
		}
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 2 - Watching for atoms at a single branch
tutorial.part2 = {};

// Stop and hide stats
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT); // cancel speed up
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	TweenMax.to(stats, 1, {
		opacity: 0
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Move in closer again, then replace one detector with tube 
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	
	var cx = 8;
	TweenMax.to(camera, 1.5, {
		x: cx,
		y: 3,
		z: 5,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3(cx,0,0), 1.5);
	
	TweenMax.to([detectorGate, eraser], 1.5, {
		spacing: 1.5,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: tutorial.part2.step1a
	});
	
	messagebox.clear();
}

// Replace detector with tube
tutorial.part2.step1a = function() {
	TweenMax.killAll(true);
	detectorGate.bottomPipe.visible = true;
	detectorGate.bottomPipe.position.z = -4;
	TweenMax.to(detectorGate.bottomPipe.position, 1.5, {
		z: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to(detectorGate.bottomDetector.position, 1.5, {
		z: 9,
		ease: Power4.easeInOut,
		onComplete: tutorial.part2.step2
	});
}

// Reconnect parts
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	TweenMax.to([detectorGate, eraser], 1.5, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Move in closer again, then replace one detector with tube 
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	detectorGate.bottomDetector.visible = false;
	TweenMax.to(camera, 1.5, {
		x: tutorial.cameraLocation.x + 0.5,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z + 0.5,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3(tutorial.cameraLocation.x + 0.5, 0, 0), 1.5);
	
	resetStats();
	stats.opacity = 0;
	TweenMax.to(stats, 1, {
		opacity: 1,
		delay: 1
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
}

// Start releasing atoms continuously
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-4'], true);
	// Speed up
	SGE.AnimationManager.timeFactor = 1;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		if (SGE.AnimationManager.timeFactor < 5000) {
			SGE.AnimationManager.timeFactor *= 1.05;
		}
	});
	tutorial.startContinuousRun();
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.conclusion);
}

// Start releasing atoms continuously
tutorial.conclusion = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT); // cancel speed up
	tutorial.stopContinuousRun();
	// ------------- Current step
	TweenMax.to(stats, 1, {
		opacity: 0
	});
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


