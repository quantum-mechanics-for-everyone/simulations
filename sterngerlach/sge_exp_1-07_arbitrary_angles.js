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
// Tutorial 1.07: Analyzers at arbitrary angles
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
		"Welcome to the seventh interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll explore how measurement probabilities depend on the angle between analyzers.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Analyzers at different angles</strong>",
		"So far, we have only explored the results of measurements when analyzers were 90° from each other. These cases are simpler to study and allowed us to understand the nature of quantum measurements.",
		"In previous tutorials, we have brought up the question of what would happen for other angles between analyzers. In this tutorial we will answer this question.",
		"Above is the setup we'll be using. Once again, we have two analyzers and two detectors. We'll rotate analyzer B by different amounts and see how that changes the ratio of atoms detected by the two detectors.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"Since we wish to keep track of the proportion of atoms that reach each detector, we are including the proportional bar chart as in the last tutorial.",
		"We are now also interested in how this proportion depends on the angle of the analyzers. For this, we are now including a graph where we'll keep track of our results for each angle.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-2': [
		"Like before, we will be releasing atoms until we have detected a total of 100. The proportional bar will show us the ratio of atoms that were detected by D1 and D2. The ratio detected by D1 will be the probability that atoms entering analyzer B are detected by D1.",
		"The vertical line moving in the graph marks us the current angle of analyzer B relative to the +"+SGE.Symbols.Z+" direction (upwards). It will also change as atoms are detected, showing us the position in the graph corresponding to the current estimate for the probability.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Measurements at different angles</strong>",
		"We are ready to begin our series of experiments. We'll revisit the results we already know: at 0°, 90° and 180°, starting with 90°. In that case, we know that the probability of detection by detector D1 will be 50%.",
		"Pay close attention to the marker in the graph during the experiment. A circle will move up and down showing the current estimate for the probability.",
		"Press "+btGo.textVersion+" to begin the experiment."
	],
	//'2-1': not used
	'2-2': [
		"The experiment is over. We added a red dot to the graph showing the probability estimate we got from the results obtained, which is near 50%. This is what we found out in previous tutorials. It is identical to asking \"how often will I obtain heads if I flip a fair coin many times?\"",
		"We'll be trying 0° next. Press "+btGo.textVersion+" to begin the experiment."
	],
	//'2-3': not used
	'2-4': [
		"For 0°, we have analyzer B measuring in the same direction as analyzer A, which is vertical, so all atoms went to detector D1. The probability is 100%. We once again add a red dot to the graph showing this result. This case is identical to flipping an unfair coin, which always lands on heads.​",
		"We'll try 180° next. Press "+btGo.textVersion+" to begin the experiment."
	],
	//'2-5': not used
	'2-6': [
		"For 180°, we have the opposite situation: all atoms are detected by D2. The probability of D1 measuring anything in this case is zero. This case is identical to flipping an unfair coin which always lands on tails.",
		"It's time to finally figure out what happens at intermediate angles. We'll be testing 45° next. Based on the results so far, what probability do you expect? Use the coin analogy for flipping an unfair coin. How unfair do you expect it to be based on the angle being halfway between 0° and 90°?", 
		"Make a prediction, and press "+btGo.textVersion+" to begin the experiment."
	],
	//'2-7': not used
	'2-8': [
		"For 45°, we have obtained a value somewhere between 100% and 50% for the probability. But how much is it, exactly? Is it just 75%? It seems to be a little more than that.",
		"Due to the randomness involved in these experiments, using only 100 atoms is not enough to make any exact claim about the probabilities.",
		"However, we can still improve our model by repeating the experiment for more angles. This should help us figure out the exact relationship between the probabilities and the angle between analyzers.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'3-0': [
		"<strong>Part 3: Collecting more measurements</strong>",
		"Let's measure the probability for a few more angles to find out what the whole curve looks like.",
		"Press on analyzer B, hold and drag around to rotate it to a different angle. Once you are ready to run the experiment, make a prediction for the results and press "+btGo.textVersion+" to start releasing atoms.",
		"Repeat the experiment for <em>at least</em> 4 more angles before proceeding to the next step. You may repeat the experiment as many times as you wish after that."
	],
	'3-1': [
		"We have now made enough measurements to figure out the relationship between the probability and the angle between the analyzers. This relationship can be expressed by the function:",
		"&emsp; P(&theta;) = cos<sup>2</sup>(&theta;/2)",
		"This function gives the probability that an atom, with a known state in a given direction (positive or negative projection), will be measured to be in the same state when sent through an analyzer oriented in a different direction at an angle &theta; relative to the first. Note that whenever we ask you for this result in a problem, you will be allowed to use a calculator to calculate it. All scientific calculators have a cosine function built in.",
		"<strong>Extra Question</strong>: The graph we plotted above shows the angle of analyzer B relative to the +"+SGE.Symbols.Z+" direction. Analyzer A has an angle of zero relative to this direction, since it is upright. How would the shape of this graph change if analyzer A was at 90°?",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	],
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
camera.x = 10;
camera.y = 3;
camera.z = 11;
camera.focusOn(new THREE.Vector3(10,0,0));

// Custom "ignore" targets
// var ignore1 = new SGE.Ignore();
// var ignore2 = new SGE.Ignore();
// var ignore3 = new SGE.Ignore();

// Axes
var axes = new SGE.Primitives.Axes();

// Stern-Gerlach Analyers
var analyzer1 = new SGE.Analyzer();
var analyzer2 = new SGE.Analyzer();

// Set labels
analyzer1.label.text = "A";
analyzer1.label.position.y = 2.5;
analyzer2.label.text = "B";
analyzer2.label.position.y = 2.5;

// Scale angle meters for analyzers
analyzer1.angleMeter.radius = 3;
analyzer2.angleMeter.radius = 3;
analyzer2.angleMeter.label.size = 0.75;
analyzer2.angleMeter.symmetricAngleRange = false;

// Detectors
var detector1 = new SGE.Detector();
var detector2 = new SGE.Detector();
detector1.label.text = "D1";
detector2.label.text = "D2";
detector1.label.position.x = 3.5;
detector2.label.position.x = 3.5;
detector1.label.opacity = 1;
detector2.label.opacity = 1;

detector1.counterLabel.position.x = 1.75;
detector2.counterLabel.position.x = 1.75;
detector1.counterLabel.color = SGE.GLOW_COLOR;
detector2.counterLabel.color = SGE.GLOW_COLOR;
detector1.counterLabel.opacity = 1;
detector2.counterLabel.opacity = 1;
detector1.counterLabel.size = 0.85;
detector2.counterLabel.size = 0.85;
detector1.counterLabel.alwaysVisible = true;
detector2.counterLabel.alwaysVisible = true;



// Stats bar
var stats = new SGE.Canvas2D(500, 45);
// stats.shadow = 10;
// app.add(stats,50,50);

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
	
	stats.line(m+bw/2, by-5, m+bw/2, by+bh+5, 0x000000, 1, 1);
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

// Graph as an ad-hoc class to handle multiple features
var graph = {
	width: 500, height: 150,
	marginTop: 25, marginLeft: 10, graphPadding: 10,
	graphWidth: 500 - 56, graphHeight: 150 - 46
};
graph.canvas2D = (function(){
	var c = new SGE.Canvas2D(graph.width, graph.height);
	c.addLayer("overlay");
	c.addLayer("data");
	// c.shadow = 5;
	return c;
})();
graph.init = function() {
	var c = this.canvas2D;
	var ml = this.marginLeft; 
	var mt = this.marginTop;
	var gw = this.graphWidth; 
	var gh = this.graphHeight;
	var gp = this.graphPadding;
	var x, y;
	with (c) {
		selectLayerByDepth(0); // draw on background
		clear(0xFFFFFF, 1);
		rect(ml, mt, gw, gh, 0, 1); // draw frame
		// Axis labels
		// text("Probability", 25/2, this.height/2, 0, "14px sans-serif", 0, SGE.TAU/4);
		text("Probability of detection by D1 for each angle of analyzer B", ml + gw/2, mt/2 + 1, 0, "16px sans-serif", 0, 0);
		// Vertical divs (percentages)
		for (var i = 0; i <= 4; i++) {
			y = mt + gp + (4-i)*(gh-2*gp)/4;
			text(
				// anchor != align - we left-pad string for right-aligned text
				SGE.padString(i*25, 3, " ", SGE.PAD_LEFT) + "%",
				ml + gw + 5, y,
				0x000000, "13px monospace",
				SGE.ALIGN_LEFT
			);
			// Lines
			line(ml, y, ml + gw, y, 0x000000, 0.1, 1);
			// Ticks
			line(ml + gw - 2, y, ml + gw + 2, y, 0x000000, 1, 1);
		}
		// Horizontal divs (angles)
		for (var i = 0; i <= 8; i++) {
			x = ml + gp + (gw - gp*2)*i/8;
			text(
				(i*45).toString() + "°",
				x + 4, mt + gh + 10,
				0x000000, "13px monospace",
				SGE.ALIGN_CENTER
			);
			// Lines
			line(x, mt, x, mt + gh, 0x000000, 0.1, 1);
			// Ticks
			line(x, mt + gh - 2, x, mt + gh + 2, 0x000000, 1, 1);
		}
	}
}
graph.plotCurve = function(curve) {
	var x1, x2;
	var gp = this.graphPadding, ml = this.marginLeft, gw = this.graphWidth,
	    mt = this.marginTop, gh = this.graphHeight;
	var it = gw / 10;
	this.canvas2D.selectLayer("data");
	for(var i = 0; i < it; i++) {
		x1 = i * SGE.TAU/it;
		x2 = (i+1) * SGE.TAU/it;
		this.canvas2D.line(
			ml + gp + x1/SGE.TAU*(gw - 2*gp),
			mt + gp + (gh - 2*gp)*(1 - curve(x1)),
			ml + gp + x2/SGE.TAU*(gw - 2*gp),
			mt + gp + (gh - 2*gp)*(1 - curve(x2)),
			0xFF0000, 2/3, 0.5
		);
	}
}

graph.clearData = function() {
	this.canvas2D.selectLayer("data");
	this.canvas2D.clear(0xFFFFFF, 0);
}
graph.dot = function(ang, prob) {
	this.canvas2D.selectLayer("data");
	var gp = this.graphPadding, ml = this.marginLeft, gw = this.graphWidth,
	    mt = this.marginTop, gh = this.graphHeight;
	this.canvas2D.fillCircle(
		ml + gp + ang/SGE.TAU*(gw - 2*gp),
		mt + gp + (1- prob)*(gh - 2*gp),
		3, 0xEE4400, 1
	);
}
graph.clearOverlay = function() {
	this.canvas2D.selectLayer("overlay");
	this.canvas2D.clear(0xFFFFFF, 0);
}
graph.marker = function(ang, prob) {
	if (typeof(prob) == "undefined") prob = null;
	graph.clearOverlay();
	this.canvas2D.selectLayer("overlay");
	var gp = this.graphPadding, ml = this.marginLeft, gw = this.graphWidth,
	    mt = this.marginTop, gh = this.graphHeight;
	
	if (prob === null) {
		this.canvas2D.line(
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt,
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt + gh,
			0x808080, 0.45, 5
		);
	} else {
		this.canvas2D.line(
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt,
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt + gp + (1- prob)*(gh - 2*gp) - 6,
			0x0080FF, 0.4, 5
		);
		this.canvas2D.line(
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt + gp + (1- prob)*(gh - 2*gp) + 6,
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt + gh,
			0xFF8000, 0.4, 5
		);
		
		this.canvas2D.circle(
			ml + gp + ang/SGE.TAU*(gw - 2*gp),
			mt + gp + (1- prob)*(gh - 2*gp),
			5, 0x808080, 0.5, 3
		);
	}
	
	this.canvas2D.fillRect(
		ml + gp + ang/SGE.TAU*(gw - 2*gp) - 4,
		mt - 1,
		8, 6, 0x0E88D1, 1
	);
	this.canvas2D.rect(
		ml + gp + ang/SGE.TAU*(gw - 2*gp) - 4,
		mt - 1,
		8, 6, 0x000000, 0.5, 1
	);
	
	this.canvas2D.fillRect(
		ml + gp + ang/SGE.TAU*(gw - 2*gp) - 4,
		mt + gh - 5,
		8, 6, 0xED6229, 1
	);
	this.canvas2D.rect(
		ml + gp + ang/SGE.TAU*(gw - 2*gp) - 4,
		mt + gh - 5,
		8, 6, 0x000000, 0.5, 1
	);
	
	
}
graph.init();

// Event handlers
detector1.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
	tutorial.numAtoms++;
	updateStats(detector1.counter, detector2.counter);
	graph.marker(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
});
detector2.events.on(SGE.EVENT_DETECT_PARTICLE,function(){
	tutorial.numAtoms++;
	updateStats(detector1.counter, detector2.counter);
	graph.marker(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
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
	
	btNext.enabled = false;
}

// -------------------------------------------------------------------------------------------------
// Introduction
// We start with two analyzers and detectors in place
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Add experiment
	viewport.addExperiment(experiment);
	source.attach(analyzer1, SGE.IO_RIGHT);
	analyzer1.attach(analyzer2, SGE.IO_TOP);
	analyzer2.attach(detector1, SGE.IO_TOP);
	analyzer2.attach(detector2, SGE.IO_BOTTOM);
	
	analyzer1.spacing = 1.5;
	analyzer2.spacing = 2;
	detector1.spacing = 2;
	detector2.spacing = 2;
	analyzer1.label.opacity = 1;
	analyzer2.label.opacity = 1;
	
	
	// Speed up atoms
	experiment.atomSpeed = 5;
	// Reveal states
	experiment.revealStates = true;
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Analyzers at different angles
tutorial.part1 = {};

// Show two analyzers, recap
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
	btNext.enabled = true;
}

// More recap, talk about upcoming experiments
// Change camera to proper setup, show graphs
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	camera.moveFocusTo(new THREE.Vector3(8, -1, 0), 1);
	TweenMax.to(camera, 1, {
		x: 5.85,
		y: -0.65,
		z: 12,
		ease: Power2.easeInOut
	});
	
	// Tweak experiment position to free up space in the viewport
	TweenMax.to(experiment.position, 1, {
		x: -0.5,
		y: 1.0,
		z: 0.5,
		ease: Power2.easeInOut
	});
	
	// Tweak position of label for new angle
	TweenMax.to(analyzer2.label.position, 1, {
		x: -1,
		y: 2.25,
		ease: Power2.easeInOut
	});
	
	// Add stats bar
	app.add(stats, 310, 215);
	stats.opacity = 0;
	TweenMax.to(stats, 0.5, {
		opacity: 1,
		delay: 1.0,
		ease: Power2.easeInOut
	});
	
	// Add graph
	app.add(
		graph.canvas2D,
		viewport.x + viewport.width - graph.width,
		viewport.y + viewport.height - graph.height
	);
	graph.canvas2D.opacity = 0;
	TweenMax.to(graph.canvas2D, 0.5, {
		opacity: 1,
		delay: 1.0,
		ease: Power2.easeInOut
	});
	
	// Add axes
	axes.opacity = 0;
	viewport.add(axes);
	axes.position.set(-0.5, -4.5, -0.5);
	axes.scale.set(1.25, 1.25, 1.25);
	TweenMax.to(axes, 0.5, {
		opacity: 1,
		delay: 1.5
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Explain graphs, get ready
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	TweenMax.to(analyzer2.angleMeter, 1, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	
	graph.canvas2D.selectLayer("overlay");
	graph.canvas2D.layerOpacity = 0;
	TweenMax.to(graph.canvas2D, 0.5, {
		layerOpacity: 1,
		ease: Power2.easeInOut
	});	
	
	tutorial.animate = function(t, delta) {
		var a = analyzer2.angle + SGE.TAU/360 * delta * 30;
		if (a > SGE.TAU) a -= SGE.TAU;
		analyzer2.angle = a;
		graph.clearOverlay();
		graph.marker(analyzer2.angle);
	}
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 2 - Three analyzer experiments
tutorial.part2 = {};

// 90°
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	tutorial.animate = null;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	TweenMax.to(analyzer2, 1, {
		angle: SGE.TAU/4,
		onUpdate: function() {
			graph.clearOverlay();
			graph.marker(analyzer2.angle);
		},
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Release atoms
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	// Force 80% of the atoms to come spin up from the source
	// This is so the detections happen more quickly and the speed up animation works better
	source.events.on(SGE.EVENT_LEAVE,function(){
		if (Math.random() <= 0.8) experiment.atomR.spin = 0;
	});
	
	// Run continuously, speeding up
	tutorial.run(tutorial.part2.step2);
	
	// ------------- For next step
	// Automatic
}

// Talk about the results
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	
	graph.dot(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// 0°
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	TweenMax.to(analyzer2, 1, {
		angle: 0,
		onUpdate: function() {
			graph.clearOverlay();
			graph.marker(analyzer2.angle);
		},
		onComplete: function() {
			tutorial.run(tutorial.part2.step4);
		},
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	// btGo.enabled = true;
	// btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Talk about the results
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-4'], true);
	
	graph.dot(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step5);
}

// 180°
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	TweenMax.to(analyzer2, 1, {
		angle: SGE.TAU/2,
		onUpdate: function() {
			graph.clearOverlay();
			graph.marker(analyzer2.angle);
		},
		onComplete: function() {
			tutorial.run(tutorial.part2.step6);
		},
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	// btGo.enabled = true;
	// btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Talk about the results
tutorial.part2.step6 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-6'], true);
	
	graph.dot(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step7);
}

// 45°
tutorial.part2.step7 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	resetStats();
	TweenMax.to(analyzer2, 1, {
		angle: SGE.TAU/8,
		onUpdate: function() {
			graph.clearOverlay();
			graph.marker(analyzer2.angle);
		},
		onComplete: function() {
			tutorial.run(tutorial.part2.step8);
		},
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	// btGo.enabled = true;
	// btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Talk about the results
tutorial.part2.step8 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-8'], true);
	
	graph.dot(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 3 - Filling out the curve
tutorial.part3 = {};

tutorial.part3.holding = null;
tutorial.part3.holdAnalyzer = function(e) {
	viewport.events.on(SGE.EVENT_MOUSE_UP, tutorial.part3.releaseAnalyzer);
	viewport.events.on(SGE.EVENT_MOUSE_MOVE, tutorial.part3.rotateAnalyzer);
	tutorial.part3.holding = {
		x: viewport.pointerCoords.x,
		y: viewport.pointerCoords.y,
		angle: analyzer2.angle
	};
}
tutorial.part3.releaseAnalyzer = function(e) {
	viewport.events.off(SGE.EVENT_MOUSE_UP, tutorial.part3.releaseAnalyzer);
	viewport.events.off(SGE.EVENT_MOUSE_MOVE, tutorial.part3.rotateAnalyzer);
	tutorial.part3.holding = null;
}
tutorial.part3.rotateAnalyzer = function(e) {
	var dx = viewport.pointerCoords.x - tutorial.part3.holding.x;
	var dy = viewport.pointerCoords.y - tutorial.part3.holding.y;
	// var d = (Math.abs(dx) > Math.abs(dy) ? dx : dy );
	d = dx / 100 + dy / 50;
	var ang = tutorial.part3.holding.angle + d * SGE.TAU/8;
	ang = Math.atan2(Math.sin(ang), Math.cos(ang));
	if (ang < 0) ang = SGE.TAU + ang;
	ang = Math.floor(ang * 360) / 360;
	analyzer2.angle = ang;
	graph.marker(analyzer2.angle);
}


// Free rotation
tutorial.part3.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-0'], true);
	
	tutorial.part3.reset();
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part3.run);
}

tutorial.part3.run = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	analyzer2.events.off(SGE.EVENT_MOUSE_DOWN);
	analyzer2.cursor = "default";
	// ------------- Current step
	
	TweenMax.to(analyzer2, 0.5, {
		glow: 0,
		ease: Power2.easeInOut
	});
	
	resetStats();
	tutorial.run(tutorial.part3.reset);
	
	// ------------- For next step
}

tutorial.part3.numRuns = -1;
tutorial.part3.reset = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	analyzer2.events.off(SGE.EVENT_MOUSE_DOWN);
	tutorial.part3.releaseAnalyzer();
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	
	// Add dot
	graph.dot(analyzer2.angle, detector1.counter / (detector1.counter + detector2.counter));
	
	// Show angle meter
	TweenMax.to(analyzer2.angleMeter, 0.5, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzer2, 0.5, {
		glow: 1,
		ease: Power2.easeInOut
	});
	
	analyzer2.events.on(SGE.EVENT_MOUSE_DOWN, tutorial.part3.holdAnalyzer);
	analyzer2.cursor = "move";
	
	tutorial.part3.numRuns++;
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part3.run);
	
	if (tutorial.part3.numRuns == 4) {
		btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.part1);
		btNext.blinkOn();
	}
	
	if (btNext.events.hasEvent(SGE.EVENT_PRESS)) btNext.enabled = true;
}

tutorial.part3.part1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	btNext.blinkOff();
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['3-1'], true);
	
	// Plot curve
	graph.plotCurve(function(x){ return Math.pow(Math.cos(x/2),2); })
	
	// ------------- For next step
	// End
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


