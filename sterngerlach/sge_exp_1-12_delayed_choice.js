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
// Tutorial 1.12: Delayed choice
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
		"Welcome to the interactive tutorial on the delayed choice experiment! In this tutorial we'll address an interesting argument against the results we have found so far.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1a
	'1a-0': [
		"<strong>Part 1: Watched and unwatched atoms</strong>",
		"In previous tutorials, we have seen how measuring the state of an atom seems to be what defines its state. It's impossible to assign it a state otherwise.",
		"We have also seen how any attempt at \"watching\" the atom in its path acts just like a measurement. By erasing this information, we can restore the quantum behavior.",
		"But the distinction between all of these cases was only possible because we had the analyzer loop and the trailing analyzer perpendicular to each other.",
		"To illustrate, let's review each case step-by-step.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1a-1': [
		"In the first scenario, we are not trying to watch the atoms, so we have no detectors in the middle of the analyzer loop.",
		"Let's try to understand how the probabilities are affected in this case.",
		"Press "+btGo.textVersion+" to step start the simulation."
	],
	'1a-leaveSource': [
		"The atom leaves the source with a definite "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1a-throughGate': [
		"The atom passes through the analyzer loop without detection. According to quantum mechanics, it's as if the atom goes through \"both branches at the same time\". This is behavior represented with a dashed line.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1a-leaveEraser': [
		"As predicted, the atom leaves the analyzer loop unchanged, still in the "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1a-interactAnalyzer2': [
		"Because the atom's state was unchanged, the trailing analyzer will find the atom in the "+SGE.Symbols.PLUS+" state with probability 1, and "+SGE.Symbols.MINUS+" with probability zero.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1a-atomDetected': [
		"Therefore, quantum mechanics predicts that if atoms go through the analyzer loop unwatched, D1 will detect all the atoms and D2 will detect none.",
		"This is shown in the proportional bar chart, where we labeled this scenario \"Unwatched (V)\". The (V) indicates the trailing analyzer is vertical.",
		"Now let us review the case when we attempt to watch the atoms.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 1b
	'1b-0': [
		"In the second scenario we are attempting to watch the atoms, so we have placed detectors in the analyzer loop.",
		"Let's try to understand how the probabilities are affected in this case.",
		"Press "+btGo.textVersion+" to step start the simulation."
	],
	// '1b-1': not used
	'1b-leaveSource': [
		"The atom leaves the source with a definite "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1b-throughGate': [
		"The atom passes through the analyzer loop and is found to be in one of the two branches, so we now know the atom couldn't have gone through both. We represented this with a solid line, instead of a dashed line.",
		"This means the atom has a definite state in the "+SGE.Symbols.X+" direction, and no longer has a definite state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1b-leaveEraser': [
		"As predicted, the atom leaves the analyzer loop with a different state, the definite state it was found at in the "+SGE.Symbols.X+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1b-interactAnalyzer2': [
		"Because the atom's state was changed to a state in the "+SGE.Symbols.X+" direction, the trailing analyzer will measure the atom in either "+SGE.Symbols.PLUS+" or "+SGE.Symbols.MINUS+" states with equal probability 1/2.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1b-atomDetected': [
		"Therefore, quantum mechanics predicts that if we attempt to watch the atoms as they go through the analyzer loop, then D1 will detect half of the atoms and D2 will detect the other half.",
		"This is shown in the proportional bar chart, where we labeled this scenario \"Watched (V)\".",
		"Now, what if the trailing analyzer was in the same orientation as the analyzer loop?",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2a
	'2a-0': [
		"<strong>Part 2: Analyzer aligned with analyzer loop</strong>",
		"We have rotated the trailing analyzer to the same orientation as the analyzer loop. How will watched and unwatched atoms behave in this setup?",
		"Make a prediction for <em>both</em> cases, then press "+btNext.textVersion+" to continue."
	],
	'2a-1': [
		"We'll begin by analyzing the case when the atoms are being watched as they go through the analyzer loop.",
		"Press "+btGo.textVersion+" to start the simulation."
	],
	'2a-leaveSource': [
		"The atom leaves the source with a definite "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2a-throughGate': [
		"The atom passes through the analyzer loop and is found to be in one of the two branches.",
		"This means the atom has a definite state in the "+SGE.Symbols.X+" direction, and no longer has a definite state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2a-leaveEraser': [
		"As predicted, the atom leaves the analyzer loop with a different state, the definite state it was found at in the "+SGE.Symbols.X+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2a-interactAnalyzer2': [
		"Because the atom's state was changed to a state in the "+SGE.Symbols.X+" direction, the trailing analyzer will measure the atom in that same state every time.",
		"Since the atom can be found in either branch of the analyzer loop with probability 1/2, each of the states in the "+SGE.Symbols.X+" direction is equally likely.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2a-atomDetected': [
		"Therefore, quantum mechanics predicts that if we attempt to watch the atoms as they go through the analyzer loop, then D1 will detect half of the atoms and D2 will detect the other half.",
		"This is shown in the proportional bar chart, where we labeled this scenario \"Watched (H)\". The (H) indicates the trailing analyzer is horizontal.",
		"Finally, let's look at the case where the atoms are not being watched.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2b
	'2b-0': [
		"We have removed the detectors from the analyzer loop once again. Let's repeat the analysis for the case of an horizontal trailing analyzer.",
		"Press "+btGo.textVersion+" to step start the simulation."
	],
	'2b-leaveSource': [
		"The atom leaves the source with a definite "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2b-throughGate': [
		"The atom passes through the analyzer loop without detection. According to quantum mechanics, it's as if the atom goes through \"both branches at the same time\".",
		"Press "+btNext.textVersion+" to continue."
	],
	'2b-leaveEraser': [
		"As predicted, the atom leaves the analyzer loop unchanged, still in the "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2b-interactAnalyzer2': [
		"Because the atom's state was unchanged from the original state, the trailing analyzer will randomly measure the atom in one of the two states in the "+SGE.Symbols.X+" direction with equal probability 1/2.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2b-atomDetected': [
		"Therefore, quantum mechanics predicts that if we don't watch the atoms as they go through the analyzer loop, then D1 will detect half of the atoms and D2 will detect the other half.",
		"This is shown in the proportional bar chart, where we labeled this scenario \"Unwatched (H)\".",
		"Press "+btNext.textVersion+" to continue."
	],
	'2b-conclusion': [
		"We have analyzed all four scenarios, which are shown above.",
		"The results we found for the horizontal trailing analyzer (at the bottom) suggest that watching the atom makes no difference in those cases.",
		"Could it be that the atom's behavior depends on the orientation of the trailing analyzer? This is what we'll explore next.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 3
	'3-0': [
		"<strong>Part 3: A conspiracy theory</strong>",
		"Since an atom detected on the "+SGE.Symbols.PLUS+" branch of the analyzer loop always emerges from the "+SGE.Symbols.PLUS+" output of the trailing analyzer (and similarly for the other state), it is tempting to say that by knowing the state of the atom at the trailing analyzer we can can also know for sure that the atom passed through one of the branches.", 
		"In fact, had we only performed this experiment, we would never have found necessary to come up with the idea of an atom \"going through both branches at the same time\", or that \"watching the atom changes its behavior\". The classical idea of the atom going through just one of the branches and having a definite state at all times would have been sufficient to explain these observations.",
		"Press "+btNext.textVersion+" to continue."
	],
	'3-1': [
		"This situation suggests the possibility that the atom <em>knows</em> in advance whether it is going to be measured by a trailing analyzer in the vertical or horizontal orientation, even before it passes through the analyzer loop!",
		"If the trailing analyzer is vertical, the atom goes through both branches at the same time, preserving its original state in the "+SGE.Symbols.Z+" direction. If the analyzer is horizontal, it goes through one branch and its state is changed to a state in the "+SGE.Symbols.X+" direction.",
		"This notion is called a \"conspiracy theory\", because the atom <em>conspires</em> against our efforts to measure it. In contrast, quantum mechanics predicts an unwatched atom simply goes through both branches at the same time in both cases, regardless of how we set up the experiment.",
		"Both possibilities seem weird to us, but only one of them can be correct. Let's find out which.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 4
	'4-0': [
		"<strong>Part 4: The delayed choice experiment</strong>",
		"It turns out we can develop an experiment to test the conspiracy theory against quantum mechanics. We can do this if we trick the atom by rotating the trailing analyzer after it has left the analyzer loop.",
		"This is called a <em>delayed choice</em> experiment, because we wait until after an interaction has happened before we change the conditions of the experiment. Let's see what this experiment would predict for the conspiracy theory and quantum mechanics.",
		"Press "+btGo.textVersion+" to continue."
	],
	'4-throughGate': [
		"The conspiracy theory says that as the atom passes through the analyzer loop, it will sense the trailing analyzer is horizontal. The atom then goes through only one of the branches, and by doing so picks either one of the definite states in the "+SGE.Symbols.X+" direction with probability 1/2.",
		"Quantum mechanics predicts that the atom simply goes through both branches at the same time, preserving its original state, regardless of the trailing analyzer.",
		"Press "+btNext.textVersion+" to continue."
	],
	'4-leaveEraser': [
		"After the atom leaves the analyzer loop, we quickly rotate the trailing analyzer to the vertical position.",
		"The conspiracy theory predicts the atom left the analyzer loop with a definite state in the "+SGE.Symbols.X+" direction.",
		"On the other hand, quantum mechanics predicts the state would have remained "+SGE.Symbols.PLUS+" in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	'4-interactAnalyzer2': [
		"The atom is measured by trailing analyzer.",
		"The conspiracy theory predicts the atom, in a definite state in the "+SGE.Symbols.X+" direction, will be forced into either one of the definite states in the "+SGE.Symbols.Z+" direction with probability 1/2.",
		"On the other hand, quantum mechanics predicts the atom will always be measured in the same "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'conclusion': [
		"<strong>Conclusion</strong>",
		"The predictions are:",
		"<ul>" + 
		"<li><strong>Conspiracy theory</strong>: half the atoms would go to D1, and half would go to D2.</li>" +
		"<li><strong>Quantum mechanics</strong>: all the atoms would go to D1, and none to D2.</li>" +
		"</ul>",
		"It turns out that every time this kind of experiment is performed in several different ways, each time with somewhat different details, quantum mechanics is <em>always</em> verified to be correct. Thus, there is no evidence of the existence such conspiracies.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
	
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment(); // main experiment
// Speed up atoms
var SIMULATION_SPEED = 4;
experiment.atomSpeed = SIMULATION_SPEED;

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_SPINUP;

// Camera
var camera = viewport.camera;
camera.focusOn(new THREE.Vector3(12, 0, 0));
camera.theta = SGE.TAU/4;
camera.phi = SGE.TAU/6;
camera.rho = 12;
camera.save();

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();
// Set labels
analyzer1.angle = SGE.TAU/4;
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
var statsUV = new SGE.Canvas2D(650, 45);
var statsWV = new SGE.Canvas2D(650, 45);
var statsUH = new SGE.Canvas2D(650, 45);
var statsWH = new SGE.Canvas2D(650, 45);
statsUV.shadow = 10;
statsWV.shadow = 10;
statsUH.shadow = 10;
statsWH.shadow = 10;

function updateStats(stats, d1, d2) {
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
	
	var label = "";
	switch (stats) {
		case statsUH: label = "Unwatched (H)"; break;
		case statsWH: label = "Watched (H)"; break;
		case statsUV: label = "Unwatched (V)"; break;
		case statsWV: label = "Watched (V)"; break;
		case statsCT: label = "Conspiracy"; break;
		case stats: label = "Experiment"; break;
	}
	
	stats.text(label, 2*m + bw, by + bh/2, 0x000000, "18px monospace", -1);
}

function addStats() {
	var px = app.width / 2 - statsUH.width / 2;
	var py = viewport.y + viewport.height - statsUH.height - 20;
	
	app.add(statsUV, px, py);
	app.add(statsWV, px, py);
	app.add(statsUH, px, py);
	app.add(statsWH, px, py);
	
	updateStats(statsUH, 1, 1);
	updateStats(statsUV, 1, 0);
	updateStats(statsWV, 1, 1);
	updateStats(statsWH, 1, 1);

	statsUV.opacity = 0;
	statsWV.opacity = 0;
	statsUH.opacity = 0;
	statsWH.opacity = 0;
}

addStats();

// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback
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
// We start with the whole setup as before
var path;
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	viewport.addExperiment(experiment);
	
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.attach(detectorGate);
	detectorGate.attach(eraser);
	
	// analyzer1.angle = SGE.TAU/4;
	analyzer1.spacing = 1.5;
	detectorGate.spacing = 0;
	
	eraser.attach(analyzer2);
	
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	
	detectorGate.topDetector.visible = false;
	detectorGate.bottomDetector.visible = false;
	detectorGate.topPipe.visible = true;
	detectorGate.bottomPipe.visible = true;
	
	detectorGate.spacing = 0;
	eraser.spacing = 0;
	
	// Generate path
	path = new SGE.Primitives.PathGroup();
	viewport.add(path);
	
	var c = SGE.GLOW_COLOR;
	var p, ps, d;
	
	o = 0;
	
	// Source-Analyzer A
	ps = [];
	ps.push( source.__position );
	ps.push(new THREE.Vector3(
		analyzer1.position.x - 1,
		analyzer1.position.y,
		analyzer1.position.z
	));
	p = new SGE.Primitives.Path(ps, SGE.LINE_SOLID, {
		color: c,
		scale: 6,
		offset: 0
	});
	path.addPath(p, "source-analyzer");
	
	// Analyzer Loop fork and merge
	for(var k = 0; k <= 1; k++) {
		ps = [];
		ps.push(new THREE.Vector3(
			analyzer1.position.x - 1,
			analyzer1.position.y,
			analyzer1.position.z
		));
		for (var i = 0; i <= 1.5; i += 0.1) {
			ps.push(new THREE.Vector3(
				analyzer1.position.x - 1 + i,
				analyzer1.position.y,
				analyzer1.position.z + Math.pow(Math.sin(i/1.5 * Math.PI/2),3)*(k?1:-1)
			));
		}
		ps.push(new THREE.Vector3(
			eraser.position.x - 1,
			eraser.position.y,
			eraser.position.z + 1*(k?1:-1)
		));
		for (var i = 0; i <= 1.6; i += 0.1) {
			ps.push(new THREE.Vector3(
				eraser.position.x - 1 + i,
				eraser.position.y,
				eraser.position.z + (1 - Math.pow(Math.sin(i/1.5 * Math.PI/2),3))*(k?1:-1)
			));
		}
		p = new SGE.Primitives.Path(ps, SGE.LINE_DASHED, {
			color: c,
			scale: 5,
			offset: analyzer1.position.x - 1
		});
		path.addPath(p, "loop-" + (k ? "plus" : "minus"));
	}
	
	// Eraser-Ananalyzer B
	var ps = [];
	ps.push(new THREE.Vector3(
		eraser.position.x + 0.5,
		eraser.position.y,
		eraser.position.z
	));
	ps.push(new THREE.Vector3(
		analyzer2.position.x - 0.5,
		analyzer2.position.y,
		analyzer2.position.z
	));
	p = new SGE.Primitives.Path(ps, SGE.LINE_SOLID, {
		color: c,
		scale: 6,
		offset: eraser.position.x + 0.5
	});
	path.addPath(p, "eraser-analyzer");
	
	// Analyzer-Detector
	// Analyzer-Detector fork and merge
	for(var k = 0; k <= 1; k++) {
		ps = [];
		ps.push(new THREE.Vector3(
			analyzer2.position.x - 0.5,
			analyzer2.position.y,
			analyzer2.position.z
		));
		for (var i = 0; i < 1.5; i += 0.1) {
			ps.push(new THREE.Vector3(
				analyzer2.position.x - 0.5 + i,
				analyzer2.position.y + Math.pow(Math.sin(i/1.5 * Math.PI/2),3)*(k?1:-1),
				analyzer2.position.z
			));
		}
		d = ( k ? detector1 : detector2 );
		ps.push(new THREE.Vector3(
			d.position.x,
			d.position.y,
			d.position.z
		));
		p = new SGE.Primitives.Path(ps, SGE.LINE_SOLID, {
			color: c,
			scale: 6,
			offset: analyzer2.position.x - 0.5
		});
		path.addPath(p, "analyzer-detector-"+(k?"plus":"minus"));
	}
	
	// Start truncated, with second path hidden
	path.getPath("analyzer-detector-minus").hidden = true;
	path.truncate(0);
	
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1a.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1a - Unwatched atoms
tutorial.part1a = {};

// Recap
tutorial.part1a.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1a-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1a.step1);
}

// Zoom in, ready to follow
tutorial.part1a.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1a-1'], true);
	
	camera.moveFocusTo(new THREE.Vector3(0,0,0), 2)
	TweenMax.to(camera, 2, {
		x: 0,
		y: 4,
		z: 5,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1a.step2);
}

// Release atom, start following
tutorial.part1a.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	tutorial.animate = function(t, delta) {
		tutorial.follow();
		path.truncate(experiment.atomR.position.x);
	}
	
	// Steps
	experiment.addTrigger(1.5, "leaveSource");
	experiment.addTrigger(14.35, "leaveEraser");
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part1a.triggerPoint);
	detectorGate.events.on(SGE.EVENT_INTERACT, tutorial.part1a.throughGate);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part1a.interactAnalyzer2);
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part1a.atomDetected);
	
	experiment.revealStates = true;
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part1a.triggerPoint = function(e) {
	if (e.trigger == "leaveSource") {
		tutorial.pause('1a-leaveSource');
	} else if (e.trigger == "leaveEraser") {
		tutorial.pause('1a-leaveEraser');
	}
	setTimeout(function(){ experiment.revealStates = true; },1);
}

tutorial.part1a.throughGate = function() {
	tutorial.pause('1a-throughGate');
}

tutorial.part1a.interactAnalyzer2 = function() {
	tutorial.pause('1a-interactAnalyzer2');
}

tutorial.part1a.atomDetected = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// Remove events
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	detectorGate.events.off(SGE.EVENT_INTERACT);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1a-atomDetected'], true);
	tutorial.animate = null;
	camera.restore(2, 1);
	path.truncate(path.distance);
	
	TweenMax.to(statsUV, 1, {
		opacity: 1,
		delay: 2
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1b.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 1b - Watched atoms
tutorial.part1b = {};

// Recap, swap detectors
tutorial.part1b.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1b-0'], true);
	
	TweenMax.to([statsUV, path], 0.5, {
		opacity: 0
	});
	
	TweenMax.to([eraser, detectorGate], 1.5, {
		spacing: 1,
		ease: Power4.easeInOut
	});
	
	detectorGate.bottomDetector.visible = true;
	detectorGate.topDetector.visible = true;
	detectorGate.bottomDetector.position.z = -7;
	detectorGate.topDetector.position.z = -7;
	
	TweenMax.to([detectorGate.topPipe.position, detectorGate.bottomPipe.position], 1.5, {
		z: 9,
		y: 4,
		delay: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to([detectorGate.topDetector.position, detectorGate.bottomDetector.position], 1.5, {
		z: 0,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() { tutorial.part1b.step1(); }
	});
	
	// ------------- For next step
	// Automatic
}

// Get ready
tutorial.part1b.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	TweenMax.to([eraser, detectorGate], 1.25, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	
	detectorGate.bottomPipe.visible = false;
	detectorGate.topPipe.visible = false;
	detectorGate.topPipe.position.set(0,0,0);
	detectorGate.bottomPipe.position.set(0,0,0);
	
	// Zoom in
	camera.moveFocusTo(new THREE.Vector3(0,0,0), 2, 1.5);
	TweenMax.to(camera, 2, {
		x: 0,
		y: 4,
		z: 5,
		delay: 1.5,
		ease: Power2.easeInOut,
		onComplete: function() {
			btGo.enabled = true;
		}
	});
	
	// ------------- For next step
	// btNext.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1b.step2);
}

// Release atom, start following
tutorial.part1b.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	path.truncate(0);
	path.opacity = 1;
	// Unhide detector paths
	path.getPath("analyzer-detector-plus").hidden = false;
	path.getPath("analyzer-detector-minus").hidden = false;
	tutorial.animate = function(t, delta) {
		tutorial.follow();
		path.truncate(experiment.atomR.position.x);
	}
	
	// Steps
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part1b.triggerPoint);
	detectorGate.events.on(SGE.EVENT_INTERACT, tutorial.part1b.throughGate);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part1b.interactAnalyzer2);
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part1b.atomDetected);
	
	experiment.revealStates = true;
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part1b.triggerPoint = function(e) {
	if (e.trigger == "leaveSource") {
		tutorial.pause('1b-leaveSource');
	} else if (e.trigger == "leaveEraser") {
		tutorial.pause('1b-leaveEraser');
	}
	setTimeout(function(){ experiment.revealStates = true; },1);
}

tutorial.part1b.throughGate = function() {
	tutorial.pause('1b-throughGate');
	var s = (experiment.atomR.position.z > 0); // state, true = +, false = -
	path.getPath("loop-"+(s?"plus":"minus")).style = SGE.LINE_SOLID;
	path.getPath("loop-"+(!s?"plus":"minus")).hidden = true;
}

tutorial.part1b.interactAnalyzer2 = function() {
	tutorial.pause('1b-interactAnalyzer2');
	var s = (Math.abs(experiment.atomR.spin) < SGE.TAU/4); // state, true = +, false = -
	path.getPath("analyzer-detector-"+(s?"plus":"minus")).hidden = false;
	path.getPath("analyzer-detector-"+(!s?"plus":"minus")).hidden = true;
}

tutorial.part1b.atomDetected = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// Remove events
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	detectorGate.events.off(SGE.EVENT_INTERACT);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1b-atomDetected'], true);
	tutorial.animate = null;
	camera.restore(2, 1);
	path.truncate(path.distance);
	
	TweenMax.to(statsWV, 1, {
		opacity: 1,
		delay: 2
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2a.intro);
}



// -------------------------------------------------------------------------------------------------
// Part 2a - Aligned analyzers, watched
tutorial.part2a = {};

tutorial.part2a.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2a-0'], true);
	
	TweenMax.to([statsWV, path], 0.5, {
		opacity: 0
	});
	
	TweenMax.to(analyzer2, 1.5, {
		angle: SGE.TAU/4,
		ease: Power4.easeInOut
	});
	// Rotate path segments
	TweenMax.to([
			path.getPath("analyzer-detector-plus").rotation,
			path.getPath("analyzer-detector-minus").rotation
		], 1.5, {
		x: SGE.TAU/4,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2a.step1);
}

// Get ready
tutorial.part2a.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2a-1'], true);
	
	// Zoom in
	camera.moveFocusTo(new THREE.Vector3(0,0,0), 2);
	TweenMax.to(camera, 2, {
		x: 0,
		y: 4,
		z: 5,
		ease: Power2.easeInOut,
		onComplete: function() {
			btGo.enabled = true;
		}
	});
	
	// ------------- For next step
	// btNext.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2a.step2);
}

// Release atom, start following
tutorial.part2a.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	path.truncate(0);
	path.opacity = 1;
	// Unhide detector paths
	path.getPath("analyzer-detector-plus").hidden = false;
	path.getPath("analyzer-detector-minus").hidden = false;
	path.getPath("loop-plus").hidden = false;
	path.getPath("loop-minus").hidden = false;
	path.getPath("loop-plus").style = SGE.LINE_DASHED;
	path.getPath("loop-minus").style = SGE.LINE_DASHED;
	tutorial.animate = function(t, delta) {
		tutorial.follow();
		path.truncate(experiment.atomR.position.x);
	}
	
	// Steps
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part2a.triggerPoint);
	detectorGate.events.on(SGE.EVENT_INTERACT, tutorial.part2a.throughGate);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part2a.interactAnalyzer2);
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part2a.atomDetected);
	
	experiment.revealStates = true;
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part2a.triggerPoint = function(e) {
	if (e.trigger == "leaveSource") {
		tutorial.pause('2a-leaveSource');
	} else if (e.trigger == "leaveEraser") {
		tutorial.pause('2a-leaveEraser');
	}
	setTimeout(function(){ experiment.revealStates = true; },1);
}

tutorial.part2a.throughGate = function() {
	tutorial.pause('2a-throughGate');
	var s = (experiment.atomR.spin < SGE.TAU/2); // state, true = +, false = -
	path.getPath("loop-"+(s?"plus":"minus")).style = SGE.LINE_SOLID;
	path.getPath("loop-"+(!s?"plus":"minus")).hidden = true;
}

tutorial.part2a.interactAnalyzer2 = function() {
	tutorial.pause('2a-interactAnalyzer2');
	var s = (Math.abs(experiment.atomR.spin) < SGE.TAU/2); // state, true = +, false = -
	path.getPath("analyzer-detector-"+(s?"plus":"minus")).hidden = false;
	path.getPath("analyzer-detector-"+(!s?"plus":"minus")).hidden = true;
}

tutorial.part2a.atomDetected = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// Remove events
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	detectorGate.events.off(SGE.EVENT_INTERACT);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2a-atomDetected'], true);
	tutorial.animate = null;
	camera.restore(2, 1);
	path.truncate(path.distance);
	
	TweenMax.to(statsWH, 1, {
		opacity: 1,
		delay: 2
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2b.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 2b - Aligned analyzers, unwatched
tutorial.part2b = {};

// Recap, swap detectors
tutorial.part2b.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2b-0'], true);
	
	TweenMax.to([statsWH, path], 0.5, {
		opacity: 0
	});
	
	TweenMax.to([eraser, detectorGate], 1.5, {
		spacing: 1,
		ease: Power4.easeInOut
	});
	
	detectorGate.bottomPipe.visible = true;
	detectorGate.topPipe.visible = true;
	detectorGate.bottomPipe.position.z = -7;
	detectorGate.topPipe.position.z = -7;
	
	TweenMax.to([detectorGate.topDetector.position, detectorGate.bottomDetector.position], 1.5, {
		z: 9,
		y: 4,
		delay: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to([detectorGate.topPipe.position, detectorGate.bottomPipe.position], 1.5, {
		z: 0,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() { tutorial.part2b.step1(); }
	});
	
	// ------------- For next step
	// Automatic
}

// Get ready
tutorial.part2b.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	TweenMax.to([eraser, detectorGate], 1.25, {
		spacing: 0,
		ease: Power4.easeInOut
	});
	
	detectorGate.bottomDetector.visible = false;
	detectorGate.topDetector.visible = false;
	detectorGate.bottomDetector.position.set(0,0,0);
	detectorGate.topDetector.position.set(0,0,0);
	
	// Zoom in
	camera.moveFocusTo(new THREE.Vector3(0,0,0), 2, 1.5);
	TweenMax.to(camera, 2, {
		x: 0,
		y: 4,
		z: 5,
		delay: 1.5,
		ease: Power2.easeInOut,
		onComplete: function() {
			btGo.enabled = true;
		}
	});
	
	// ------------- For next step
	// btNext.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2b.step2);
}

// Release atom, start following
tutorial.part2b.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	path.truncate(0);
	path.opacity = 1;
	// Unhide detector paths
	path.getPath("analyzer-detector-plus").hidden = false;
	path.getPath("analyzer-detector-minus").hidden = false;
	path.getPath("loop-plus").hidden = false;
	path.getPath("loop-minus").hidden = false;
	path.getPath("loop-plus").style = SGE.LINE_DASHED;
	path.getPath("loop-minus").style = SGE.LINE_DASHED;
	tutorial.animate = function(t, delta) {
		tutorial.follow();
		path.truncate(experiment.atomR.position.x);
	}
	
	// Steps
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part2b.triggerPoint);
	detectorGate.events.on(SGE.EVENT_INTERACT, tutorial.part2b.throughGate);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part2b.interactAnalyzer2);
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part2b.atomDetected);
	
	experiment.revealStates = true;
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part2b.triggerPoint = function(e) {
	if (e.trigger == "leaveSource") {
		tutorial.pause('2b-leaveSource');
	} else if (e.trigger == "leaveEraser") {
		tutorial.pause('2b-leaveEraser');
	}
	setTimeout(function(){ experiment.revealStates = true; },1);
}

tutorial.part2b.throughGate = function() {
	tutorial.pause('2b-throughGate');
}

tutorial.part2b.interactAnalyzer2 = function() {
	tutorial.pause('2b-interactAnalyzer2');
	var s = (experiment.atomR.spin < SGE.TAU/2); // state, true = +, false = -
	path.getPath("analyzer-detector-"+(s?"plus":"minus")).hidden = false;
	path.getPath("analyzer-detector-"+(!s?"plus":"minus")).hidden = true;
}

tutorial.part2b.atomDetected = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// Remove events
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	detectorGate.events.off(SGE.EVENT_INTERACT);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2b-atomDetected'], true);
	tutorial.animate = null;
	camera.restore(2, 1);
	path.truncate(path.distance);
	
	TweenMax.to(statsUH, 1, {
		opacity: 1,
		delay: 2
	});
	
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2b.conclusion);
}


tutorial.part2b.conclusion = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2b-conclusion'], true);
	
	TweenMax.to(path, 0.5, {
		opacity: 0
	});
	
	var l = [statsUV, statsWV, statsWH, statsUH];
	var ys = [30, 90, 285, 345];
	for (var i = 0; i < 4; i++) {
		TweenMax.to(l[i], 1, {
			opacity: 1,
			delay: 0.25 * i,
			ease: Power4.easeInOut
		});
		l[i].y = ys[i];
	}
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 3 - A conspiracy theory
tutorial.part3 = {};

// Talk about results
tutorial.part3.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-0'], true);
	
	TweenMax.to([statsUH, statsUV, statsWH, statsWV], 0.5, {
		opacity: 0,
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.step1);
}

// Explain conspiracy theory
tutorial.part3.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current steps
	messagebox.setMessage(MESSAGES['3-1'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part4.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 4 - The delayed choice experiment
tutorial.part4 = {};

// Intro
tutorial.part4.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['4-0'], true);
	
	// Zoom in
	camera.moveFocusTo(new THREE.Vector3(0,0,0), 2);
	TweenMax.to(camera, 2, {
		x: 0,
		y: 6.25,
		z: 8,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part4.step1a);
}

// Explain predictions
tutorial.part4.step1a = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.clear();
	
	experiment.revealStates = false;
	
	// Steps
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, tutorial.part4.triggerPoint);
	detectorGate.events.on(SGE.EVENT_INTERACT, tutorial.part4.throughGate);
	analyzer2.events.on(SGE.EVENT_INTERACT, tutorial.part4.interactAnalyzer2);
	experiment.atomR.events.on(SGE.EVENT_DETECTED, tutorial.part4.atomDetected);
	
	experiment.clearTriggers();
	experiment.addTrigger(14.35, "leaveEraser");
	
	tutorial.animate = function(t, delta) {
		if (experiment.isRunning && !experiment.isPaused) tutorial.follow();
	}
	
	experiment.run();
	
	// ------------- For next step
	// Automatic
}

tutorial.part4.triggerPoint = function(e) {
	if (e.trigger == "leaveEraser") {
		TweenMax.to( analyzer2, 1, {
			angle: 0,
			ease: Power4.easeInOut
		});
		tutorial.pause('4-leaveEraser');
	}
}

tutorial.part4.throughGate = function() {
	tutorial.pause('4-throughGate');
}

tutorial.part4.interactAnalyzer2 = function() {
	tutorial.pause('4-interactAnalyzer2');
	
}

tutorial.part4.atomDetected = function() {
	tutorial.part4.conclusion();
}

// Conclusion
tutorial.part4.conclusion = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// Remove events
	experiment.events.off(SGE.EVENT_TRIGGER_POINT);
	detectorGate.events.off(SGE.EVENT_INTERACT);
	analyzer2.events.off(SGE.EVENT_INTERACT);
	experiment.atomR.events.off(SGE.EVENT_DETECTED);
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

