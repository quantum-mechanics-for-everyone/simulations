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
// Tutorial 1.10: Analyzer Loops (Part 3: Classical vs Quantum)
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
		"Welcome to the tenth interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll see how analyzer loops force us to depart from classical physics and embrace the quantum world.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Following an atom with classical probabilities</strong>",
		"It's time to study the case when both branches of the analyzer loop are open. As we've seen in previous tutorials, atoms have an undefined state before we measure them, and once measured they can only have a definite state in one direction at a time.",
		"We've also seen that analyzer loops can act as if the results of these measurements were erased, that is, the fully open analyzer loop seems to leave the atom untouched.",
		"But how true is this last claim? To investigate, let's attempt to understand what the atom is doing at every step of the way in our experiments.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"There are two different ways we can attempt to understand this experiment: the classical way and the quantum way.",
		"Let's start with an analysis based on classical probability laws, which we'll call <em>Analysis A</em>.",
		"We'll be following the atom at every step along the way, while keeping track of its current known state and the probabilities of different outcomes.",
		"Ready? Press "+btGo.textVersion+" to begin."
	],
	'1-leaveSource': [
		"We start with the atom leaving the source in the "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-enterAnalyzer1': [
		"The atom enters the analyzer loop through analyzer A. Let's see what happens inside.",
		"The atom will interact with the non-uniform magnetic field. This forces it to pick either one of two possible states in the "+SGE.Symbols.X+" direction, each with probability 1/2.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-leaveAnalyzer1': [
		"Having taken one of the branches, the atom now has a definite state in the "+SGE.Symbols.X+" direction, but no longer a state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-throughGate': [
		"The atom enters the gate. Since both branches are open, it goes through undisturbed.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-enterEraser': [
		"The atom, still with a definite state in the "+SGE.Symbols.X+" direction, enters the eraser through one of its outputs.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-leaveEraser': [
		"Since the eraser simply redirects the atoms, the atom leaves the eraser with the same state as it entered, and heads towards analyzer B.",
		"All atoms will reach this point regardless of which branch they took through analyzer A.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-enterAnalyzer2': [
		"The atom, still with the state in the "+SGE.Symbols.X+" direction defined by analyzer A, now enters analyzer B, which will attempt to measure it in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-interactAnalyzer2': [
		"Inside analyzer B, the atom is forced to pick a state in the "+SGE.Symbols.Z+" direction, perpendicular to its current state.",
		"Both possibilities are equally likely, so the probability of either state is 1/2.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-leaveAnalyzer2': [
		"The atom leaves analyzer B in the new state, now in the "+SGE.Symbols.Z+" direction.",
		"There's an equal probability 1/2 for the atom to be detected by D1 or D2.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-atomDetected': [
		"The atom is detected by one of the detectors.",
		"Since both detectors have an equal probability of detecting atoms, we expect that half of the atoms will go to D1 and the other half to D2.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-conclusion': [
		"From our analysis using classical laws of probability, we have reached the conclusion that both detectors should, on average, detect the same number of atoms.",
		"We'll keep track of this prediction with a bar chart labeled <em>Analysis A</em>, showing equal proportions for D1 and D2.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Following an atom with quantum mechanics</strong>",
		"In our previous analysis, we have used the classical probability laws to figure out what proportion of atoms will reach each of the detectors.",
		"However, as we've seen before, the analyzer loop is built in such a way that it's impossible to know which branch the atom took inside of it.",
		"Therefore, we can say the analyzer loop lets all atoms pass through it unchanged: the outgoing state should be the same as the incoming state, regardless of state or the orientation of the analyzer loop.",
		"If this were not the case, we would be able to know which branch was taken by the atom.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-1': [
		"With this in mind, let us perform another analysis in which we take into account this behavior of the analyzer loop. We'll call this <em>Analysis B</em>.",
		"As before, we'll be following the atom at every step along the way, while keeping track of its current known state and the probabilities of different outcomes.",
		"Ready? Press "+btGo.textVersion+" to begin."
	],
	'2-leaveSource': [
		"As before, we start with the atom leaving the source in the "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-enterAnalyzer1': [
		"The atom enters the analyzer loop through analyzer A.",
		"However, we are now treating the analyzer loop quantum mechanically.",
		"We cannot know what happens inside of it, so we'll have to wait for the atom to come out in the other end.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-leaveEraser': [
		"The atom leaves the analyzer loop in the "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction, the same state it had when it entered. The analyzer loop did nothing.",
		"If this was not the case, we would be able to know which branch the atom went through inside the analyzer loop.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-enterAnalyzer2': [
		"The atom now enters analyzer B, which will attempt to measure it in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-interactAnalyzer2': [
		"Since the atom has a definite "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction, it will simply be found to be in this state every time.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-leaveAnalyzer2': [
		"The atom leaves analyzer B, still in the same "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction as it started.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-atomDetected': [
		"The atom is detected by D1, and never by D2.",
		"Since the analyzer loop has left the atom unchanged, we found it in the same state as it started, when it left the source.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-conclusion': [
		"From this analysis, we find that <em>all</em> atoms are detected by D1, and <em>none</em> by D2!",
		"We'll keep track of this result with a bar chart labeled <em>Analysis B</em>, showing all of detection being made by D1 and none by D2.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 3
	'3-0': [
		"<strong>Part 3: The experiment</strong>",
		"Our two analyses resulted in a monumental disagreement! Clearly, one of them must be wrong. But how do we know which is which?",
		"We'll need to perform the experiment and see what we'll get. Which analysis do you think makes the most sense? Do you think it is the correct one?",
		"Make a prediction, then press "+btGo.textVersion+" to begin the experiment."
	],
	
	// Part 4
	'4-0': [
		"<strong>Conclusion</strong>",
		"The results are in. It looks like Analysis B, based on quantum mechanics, was the correct one.",
		"Is this the result you expected? Does this result make sense to you?",
		"What incorrect assumptions were made in Analysis A, based on classical physics and probability?",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	],
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
source.sourceType = SGE.SOURCE_TYPE_SPINUP;

// Camera
var camera = viewport.camera;
camera.focusOn(new THREE.Vector3(11.5, 0, 0));
camera.theta = SGE.TAU/4;
camera.phi = SGE.TAU*0.18;
camera.rho = 12;

// Stern-Gerlach Analyers
var analyzer1 = new SGE.ExplodedAnalyzer();
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
detector1.label.position.x = 1.75;
detector2.label.position.x = 1.75;
detector1.label.opacity = 1;
detector2.label.opacity = 1;

// Stats bar
var stats = {
	'A': new SGE.Canvas2D(500, 45),
	'B': new SGE.Canvas2D(500, 45),
	'E': new SGE.Canvas2D(500, 45)
};
stats['A'].shadow = 10;
stats['B'].shadow = 10;
stats['E'].shadow = 10;

function updateStats(d1, d2) {
	var index = tutorial.experimentLabel;
	
	var f = "20px monospace";
	var s = stats[index];
	
	s.clear(0xFFFFFF,1);
	
	var dt = d1+d2;
	var mr = 10;
	var m = mr;
	var bw = 360;
	var bh = 25;
	var bs = 35;
	var by = 10;
	var c1 = [0xed6229,0xf28444];
	var c2 = [0x0e88d1,0x0fa8e0];
	
	s.text(
		(index == "E" ? "Experiment" : "Analysis "+index ),
		m + bw + mr, by + bh/2,
		0x000000, "18px monospace", SGE.PAD_LEFT
	);
	
	s.fillRect(m, by, bw, bh, 0xE0E0E0, 1);
	
	if (dt) {
		s.fillRect(m+bs, by, (bw-2*bs)*(d1/(d1+d2)), bh, c1[0], 1);
		s.fillRect(m+bs, by, (bw-2*bs)*(d1/(d1+d2)), bh-10, c1[1], 1);
		s.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), by, (bw-2*bs)*(d2/(d1+d2)), bh, c2[0], 1);
		s.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), by, (bw-2*bs)*(d2/(d1+d2)), bh-10, c2[1], 1);
	}
	
	s.fillRect(m, by, bs, bh, c1[0], 1);
	s.fillRect(m, by, bs, bh-4, c1[1], 1);
	s.rect(m, by, bs, bh, 0, 1, 1);
	
	s.fillRect(m+bw-bs, by, bs, bh, c2[0], 1);
	s.fillRect(m+bw-bs, by, bs, bh-4, c2[1], 1);
	s.rect(m+bw-bs, by, bs, bh, 0, 1, 1);
	
	s.line(m+bs+(bw-2*bs)/2, by-5, m+bs+(bw-2*bs)/2, by+bh+5, 0x000000, 1, 1);
	
	s.rect(m, by, bw, bh, 0, 1, 1);
	s.rect(m+bs, by, bw-2*bs, bh, 0, 1, 1);
	
	s.text("D1", m + bs / 2, by + bh/2, 0x000000, f, 0);
	s.text("D2", m + bw - bs / 2, by + bh/2, 0x000000, f, 0);
	
	// s.text("("+index+")", m / 2, by + bh / 2, 0x000000, f, 0);
}

// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback
tutorial.experimentLabel = "A";
tutorial.cameraLocation = camera.location;
tutorial.cameraFocus    = camera.focusOnVector.clone();

tutorial.follow = function() {
	camera.x += (experiment.atomR.position.x - camera.x) / 10;
	camera.focusOn(new THREE.Vector3(
		camera.focusOnVector.x + (experiment.atomR.position.x - camera.focusOnVector.x) / 10,
		camera.focusOnVector.y,
		camera.focusOnVector.z
	));
}

// Run experiment with N atoms, then go to callback function
tutorial.numAtoms = 0;
tutorial.run = function(callback, N) {
	if (typeof(N) == "undefined") N = 100;
	SGE.AnimationManager.timeFactor = 2; // start faster
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
	
	ignore1.detach();
	analyzer1.attach(gate);
	gate.attach(eraser);
	eraser.attach(analyzer2);
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	
	analyzer1.angle = SGE.TAU/4;
	
	// Assemble as we left
	gate.topOpen = true;
	gate.bottomOpen = true;
	
	// Fade in labels
	gate.label.text = "ANALYZER LOOP";
	gate.label.position.x = 1;
	gate.label.opacity = 1;
	analyzer1.label.opacity = 1;
	analyzer2.label.opacity = 1;
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Following an atom with classical probabilities
tutorial.part1 = {};

// Recap
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

// Recap, get ready
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	TweenMax.to(camera, 1.5, {
		x: 0,
		y: 6.45,
		z: 4.75,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3(0,0,0),1.5);
	
	// Reposition labels
	TweenMax.to([analyzer1.label, analyzer2.label, gate.label], 0.5, {
		opacity: 0,
		ease: Power2.easeInOut,
		onComplete: function() {
			analyzer1.label.size = 0.75;
			analyzer2.label.size = 0.75;
			analyzer1.label.position.set(0,0,2.25);
			analyzer2.label.position.set(0,0,2.25);
		}
	});
	TweenMax.to([analyzer1.label, analyzer2.label], 0.5, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 1
	});
	
	TweenMax.to([gate, eraser], 1, {
		spacing: 2,
		delay: 1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1.run);
}

tutorial.part1.run = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	// ------------- Current step
	
	tutorial.animate = function(t, delta) {
		tutorial.follow();
		experiment.isClassical = true;
	}
	
	// Steps
	experiment.addTrigger(1.5, "leaveSource");
	experiment.addTrigger(17.85, "leaveEraserSpaced");
	experiment.addTrigger(24.1, "leaveAnalyzer2Spaced");
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part1.triggerPoint);
	analyzer1.events.on(SGE.EVENT_ENTER, tutorial.part1.enterAnalyzer1);
	analyzer1.events.on(SGE.EVENT_LEAVE, tutorial.part1.leaveAnalyzer1);
	gate.events.on(SGE.EVENT_INTERACT, tutorial.part1.throughGate);
	eraser.events.on(SGE.EVENT_ENTER, tutorial.part1.enterEraser);
	analyzer2.events.on(SGE.EVENT_ENTER, tutorial.part1.enterAnalyzer2);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part1.interactAnalyzer2);
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part1.atomDetected);
	
	tutorial.numAtoms = 0; // reset manually in this tutorial
	experiment.revealStates = true;
	experiment.atomSpeed = 4; // run slowly
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part1.triggerPoint = function(e) {
	if (e.trigger == "leaveSource") {
		tutorial.pause('1-leaveSource');
	}
	if (e.trigger == "leaveEraserSpaced") {
		tutorial.pause('1-leaveEraser');
	}
	if (e.trigger == "leaveAnalyzer2Spaced") {
		tutorial.pause('1-leaveAnalyzer2');
	}
}

tutorial.part1.enterAnalyzer1 = function() {
	tutorial.pause('1-enterAnalyzer1');
	TweenMax.to(analyzer1.backCover.position, 1, {
		y: -3.5,
		ease: Power4.easeInOut
	});
}

tutorial.part1.leaveAnalyzer1 = function() {
	TweenMax.killAll(true);
	tutorial.pause('1-leaveAnalyzer1');
	TweenMax.to(analyzer1.backCover.position, 1, {
		y: 0,
		ease: Power4.easeInOut
	});
}

tutorial.part1.throughGate = function() {
	TweenMax.killAll(true);
	tutorial.pause('1-throughGate');
}

tutorial.part1.enterEraser = function() {
	tutorial.pause('1-enterEraser');
}

tutorial.part1.enterAnalyzer2 = function() {
	tutorial.pause('1-enterAnalyzer2');
}

tutorial.part1.interactAnalyzer2 = function() {
	tutorial.pause('1-interactAnalyzer2');
}

tutorial.part1.atomDetected = function() {
	messagebox.setMessage(MESSAGES['1-atomDetected'], true);
	experiment.pause();
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.continueExperiment);
}

tutorial.part1.continueExperiment = function() {
	
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	
	// Remove follow & events
	tutorial.animate = null;
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	analyzer1.events.off(SGE.EVENT_ENTER);
	analyzer1.events.off(SGE.EVENT_LEAVE);
	gate.events.off(SGE.EVENT_INTERACT);
	eraser.events.off(SGE.EVENT_ENTER);
	analyzer2.events.off(SGE.EVENT_ENTER);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	experiment.clearTriggers();
	
	// Reset labels
	TweenMax.to([analyzer1.label, analyzer2.label], 0.5, {
		opacity: 0,
		ease: Power2.easeInOut,
		onComplete: function() {
			analyzer1.label.size = 1;
			analyzer2.label.size = 1;
			analyzer1.label.position.set(0,-2.75,0);
			analyzer2.label.position.set(0,-2.75,0);
		}
	});
	TweenMax.to([analyzer1.label, analyzer2.label, gate.label], 0.5, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 1.5
	});
	
	TweenMax.to([gate, eraser], 2, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	
	// Restore camera, but a bit farther and to the left since
	// we spaced out gate and eraser
	camera.moveFocusTo(new THREE.Vector3(
		tutorial.cameraFocus.x + 2*0,
		tutorial.cameraFocus.y,
		tutorial.cameraFocus.z
	), 2);
	
	TweenMax.to(camera, 2, {
		x: tutorial.cameraLocation.x + 2*0,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z + 2*0,
		ease: Power2.easeInOut,
		onComplete: function() {
			tutorial.part1.conclusion();
		}
	});
	
}

tutorial.part1.conclusion = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-conclusion'], true);
	
	// Add stats 
	tutorial.experimentLabel = 'A';
	updateStats(50,50);
	app.add(stats['A']);
	stats['A'].opacity = 0;
	stats['A'].x = viewport.x + (viewport.width - stats['A'].width)/2;
	stats['A'].y = viewport.y + viewport.height - stats['A'].height - 20;
	TweenMax.to(stats['A'], 1, {
		opacity: 1,
		ease: Power2.easeInOut
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
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	TweenMax.to(stats['A'], 1, {
		opacity: 0,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	TweenMax.to(camera, 1.5, {
		x: 0,
		y: 6.45,
		z: 4.75,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3(0,0,0),1.5);
	
	// Reposition labels
	TweenMax.to([analyzer1.label, analyzer2.label, gate.label], 0.5, {
		opacity: 0,
		ease: Power2.easeInOut,
		onComplete: function() {
			analyzer1.label.size = 0.75;
			analyzer2.label.size = 0.75;
			analyzer1.label.position.set(0,0,2.25);
			analyzer2.label.position.set(0,0,2.25);
		}
	});
	TweenMax.to([analyzer1.label, analyzer2.label], 0.5, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 1
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.run);
}

tutorial.part2.run = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	// ------------- Current step
	
	tutorial.animate = function(t, delta) {
		tutorial.follow();
		experiment.isClassical = false; // make it quantum this time
	}
	
	// Steps
	
	experiment.addTrigger(1.5, "leaveSource");
	experiment.addTrigger(13.85, "leaveEraser");
	experiment.addTrigger(20.1, "leaveAnalyzer2");
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part2.triggerPoint);
	
	// source.events.on(SGE.EVENT_LEAVE, tutorial.part2.leaveSource);
	analyzer1.events.on(SGE.EVENT_ENTER, tutorial.part2.enterAnalyzer1);
	// eraser.events.on(SGE.EVENT_LEAVE, tutorial.part2.leaveEraser);
	analyzer2.events.on(SGE.EVENT_ENTER, tutorial.part2.enterAnalyzer2);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part2.interactAnalyzer2);
	// analyzer2.events.on(SGE.EVENT_LEAVE, tutorial.part2.leaveAnalyzer2);
	
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part2.atomDetected);
	
	tutorial.numAtoms = 0; // reset manually in this tutorial
	experiment.revealStates = true;
	experiment.atomSpeed = 4; // run slowly
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part2.triggerPoint = function(e) {
	if (e.trigger == "leaveSource") {
		tutorial.pause('2-leaveSource');
	}
	if (e.trigger == "leaveEraser") {
		tutorial.pause('2-leaveEraser');
	}
	if (e.trigger == "leaveAnalyzer2") {
		tutorial.pause('2-leaveAnalyzer2');
	}
}

tutorial.part2.enterAnalyzer1 = function() {
	tutorial.pause('2-enterAnalyzer1');
}

tutorial.part2.enterAnalyzer2 = function() {
	tutorial.pause('2-enterAnalyzer2');
}

tutorial.part2.interactAnalyzer2 = function() {
	tutorial.pause('2-interactAnalyzer2');
}

tutorial.part2.atomDetected = function() {
	messagebox.setMessage(MESSAGES['2-atomDetected'], true);
	experiment.pause();
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.continueExperiment);
}

tutorial.part2.continueExperiment = function() {
	
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	
	// Remove follow & events
	tutorial.animate = null;
	source.events.off(SGE.EVENT_LEAVE);
	analyzer1.events.off(SGE.EVENT_ENTER);
	analyzer1.events.off(SGE.EVENT_LEAVE);
	gate.events.off(SGE.EVENT_INTERACT);
	eraser.events.off(SGE.EVENT_ENTER);
	eraser.events.off(SGE.EVENT_LEAVE);
	analyzer2.events.off(SGE.EVENT_ENTER);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	analyzer2.events.off(SGE.EVENT_LEAVE);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	
	// Reset labels
	TweenMax.to([analyzer1.label, analyzer2.label], 0.5, {
		opacity: 0,
		ease: Power2.easeInOut,
		onComplete: function() {
			analyzer1.label.size = 1;
			analyzer2.label.size = 1;
			analyzer1.label.position.set(0,-2.75,0);
			analyzer2.label.position.set(0,-2.75,0);
		}
	});
	TweenMax.to([analyzer1.label, analyzer2.label, gate.label], 0.5, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 1.5
	});
	
	// Restore camera, but a bit farther and to the left since
	// we spaced out gate and eraser
	camera.moveFocusTo(new THREE.Vector3(
		tutorial.cameraFocus.x,
		tutorial.cameraFocus.y,
		tutorial.cameraFocus.z
	), 2);
	
	TweenMax.to(camera, 2, {
		x: tutorial.cameraLocation.x,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z,
		ease: Power2.easeInOut,
		onComplete: function() {
			tutorial.part2.conclusion();
		}
	});
	
}

tutorial.part2.conclusion = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-conclusion'], true);
	
	// Add stats
	tutorial.experimentLabel = 'B';
	updateStats(100,0);
	app.add(stats['B']);
	stats['B'].opacity = 0;
	stats['B'].x = viewport.x + (viewport.width - stats['B'].width)/2;
	stats['B'].y = viewport.y + viewport.height - stats['B'].height - 20;
	TweenMax.to(stats['B'], 1, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 3 - Run experiment
tutorial.part3 = {};

// Prepare experiment
tutorial.part3.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-0'], true);
	
	// Remove follow & events
	tutorial.animate = null;
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	analyzer1.events.off(SGE.EVENT_ENTER);
	analyzer1.events.off(SGE.EVENT_LEAVE);
	gate.events.off(SGE.EVENT_INTERACT);
	eraser.events.off(SGE.EVENT_ENTER);
	analyzer2.events.off(SGE.EVENT_ENTER);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	experiment.clearTriggers();
	
	// Add detector events
	// Event handlers
	detector1.counter = 0;
	detector2.counter = 0;
	detector1.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
		tutorial.numAtoms++;
		updateStats(detector1.counter, detector2.counter);
	});
	detector2.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
		tutorial.numAtoms++;
		updateStats(detector1.counter, detector2.counter);
	});

	
	stats['A'].y = 25;
	TweenMax.to(stats['A'], 0.5, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	TweenMax.to(stats['B'], 1, {
		y: 80,
		ease: Power4.easeInOut
	});
	
	// Add stats
	tutorial.experimentLabel = 'E';
	updateStats(0,0);
	app.add(stats['E']);
	stats['E'].opacity = 0;
	stats['E'].x = viewport.x + (viewport.width - stats['E'].width)/2;
	stats['E'].y = viewport.y + viewport.height - stats['E'].height - 20;
	TweenMax.to(stats['E'], 1, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 1
	});
	
	
	detector1.counterLabel.position.x = 3.5;
	detector2.counterLabel.position.x = 3.5;
	detector1.counterLabel.color = SGE.GLOW_COLOR;
	detector2.counterLabel.color = SGE.GLOW_COLOR;
	detector1.counterLabel.opacity = 0;
	detector2.counterLabel.opacity = 0
	detector1.counterLabel.size = 0.85;
	detector2.counterLabel.size = 0.85;
	detector1.counterLabel.alwaysVisible = true;
	detector2.counterLabel.alwaysVisible = true;
	
	TweenMax.to([detector1.counterLabel, detector2.counterLabel], 0.5, {
		opacity: 1
	});
	
	TweenMax.to(experiment.position, 2, {
		x: -1,
		y: -1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part3.step1);
}

tutorial.part3.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	messagebox.clear();
	tutorial.run(tutorial.part4.intro);
	// ------------- For next step
	// Automatic
}

// -------------------------------------------------------------------------------------------------
// Part 4 - Wrap up and compare
tutorial.part4 = {};

// Resume where we left
tutorial.part4.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['4-0'], true);
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

// SGE.AnimationManager.timeFactor = 10; SGE.BUTTON_TRIGGER_THRESHOLD /= 10;
