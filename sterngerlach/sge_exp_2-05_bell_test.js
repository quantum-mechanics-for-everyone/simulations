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
// Tutorial 2.05: The Bell Experiment (Part 4: Testing the predictions)
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
		"Welcome to the fourth and final tutorial on the Bell experiment. In this tutorial we'll find out which theory makes the right predictions: quantum mechanics or local determinism.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Local Determinism <em>vs</em> Quantum Mechanics</strong>",
		"For the Bell experiment we have set up, we are interested in figuring out the probability that the two Bell analyzers will flash different colors, either "+SGE.Symbols.RED+SGE.Symbols.BLUE+" or "+SGE.Symbols.BLUE+SGE.Symbols.RED+". As we've seen in previous tutorials, quantum mechanics and local determinism make two distinct predictions about this:",
		"&emsp; Quantum mechanics says the probability is <strong>50%</strong>",
		"&emsp; Local determinism says the probability is <strong>55% or more</strong>",
		"It's time to find out which is right by performing a virtual version of the real physical experiment.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"As before, we'll release several pairs of atoms in succession and keep track of the results. The bar above will give us the current estimate in probability.",
		"On the left, in red, we'll have the proportion of times the Bell analyzers flashed different colors: "+SGE.Symbols.RED+SGE.Symbols.BLUE+" or "+SGE.Symbols.BLUE+SGE.Symbols.RED+".",
		"On the right, in blue, we'll have the proportion of times the Bell analyzers flashed the same colors: "+SGE.Symbols.RED+SGE.Symbols.RED+" or "+SGE.Symbols.BLUE+SGE.Symbols.BLUE+".",
		"The two vertical lines indicate the predictions made by quantum mechanics and local determinism.",
		"To get a good estimate of this probability, we'll repeat the experiment 1000 times. It should be enough to give us a good confidence in our results.",
		"Press "+btGo.textVersion+" to begin the experiment."
	],
	'1-2': [
		"Please wait while the experiment is performed...",
	],
	'1-3': [
		"The results are in!",
		"It looks like the probability is closer to 50% than to some value above 55%, which agrees with the prediction made by quantum mechanics.",
		"The prediction of local determinism has been invalidated by our experiment, so local determinism cannot be correct!",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'end': [
		"<strong>Conclusion</strong>",
		"While the experiment we performed here was merely a simulation, several real-life experiments similar to the one we've done have been performed over the last decades. All the results have agreed with the predictions of quantum mechanics.",
		"Does this mean that Nature is non-deterministic? Not quite.",
		"What the results of the Bell experiment show us is that quantum mechanics and local determinism are <em>incompatible theories</em>, that is, if we assume locality is true, then we <em>cannot</em> have a deterministic theory with \"hidden variables\", no matter what form they take. We simply can't have both.",
		"Physicists have never observed any phenomenon violating locality. But if we give up on the notion of locality, allowing for faster-than-light communication of some sort, then a theory involving \"hidden variables\" <em>can</em> work. Such theories have been proposed, but never verified experimentally.",
		"Quantum mechanics remains as one of the most rigorously tested theories ever devised, and the Bell experiment one of the deepest results in all of physics.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment(); // main experiment
// Speed up atoms
experiment.atomSpeed = 2;

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

// Stats bar
var stats = {
	pad: 10, barw: 600, iconSize: 15, edge: 2, rowSpace: 2, labelSize: 15
}
stats.barh = 2*stats.iconSize + stats.rowSpace + 2*stats.edge;
stats.canvas2D = new SGE.Canvas2D(
	stats.barw + 2*stats.pad,
	stats.barh + 2*stats.pad + stats.labelSize*2
);

var statsCounter = { left: null, right: null };
stats.shadow = 10;

function updateStats(d1, d2) {
	var dt = d1+d2;
	var c = stats.canvas2D;
	c.clear(0xFFFFFF,1);
	
	var f = (stats.labelSize)+"px monospace";
	
	var iw = 2*stats.iconSize + 2*stats.edge;
	var ih = 2*stats.iconSize + stats.rowPad + 2*stats.edge;
	var cdiffd = 0xBB88BB;
	var cdiffl = 0xDD99DD;
	// var csamed = 0xBB88BB;
	// var csamel = 0xDD99DD;
	
	var m = 10;
	var md = m + stats.edge;
	var bw = stats.barw;
	var bh = stats.barh;
	var bs = iw;
	var by = 10 + stats.labelSize;
	var c1 = [0xed6229,0xf28444];
	var c2 = [0x0e88d1,0x0fa8e0];
	

	
	c.fillRect(m, by, bw, bh, 0xE0E0E0, 1);
	
	if (dt) {
		c.fillRect(m+bs, by, (bw-2*bs)*(d1/(d1+d2)), bh, c1[0], 1);
		c.fillRect(m+bs, by, (bw-2*bs)*(d1/(d1+d2)), bh-10, c1[1], 1);
		c.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), by, (bw-2*bs)*(d2/(d1+d2)), bh, c2[0], 1);
		c.fillRect(m+bs+(bw-2*bs)*(1 - d2/(d1+d2)), by, (bw-2*bs)*(d2/(d1+d2)), bh-10, c2[1], 1);
	}
	
	c.fillRect(m, by, bs, bh, c1[0], 1);
	c.fillRect(m, by, bs, bh-4, c1[1], 1);
	c.rect(m, by, bs, bh, 0, 1, 1);
	
	c.fillRect(m+bw-bs, by, bs, bh, c2[0], 1);
	c.fillRect(m+bw-bs, by, bs, bh-4, c2[1], 1);
	c.rect(m+bw-bs, by, bs, bh, 0, 1, 1);
	
	c.text(
		"Total: "+dt,
		m, by-5-stats.labelSize*0.5,
		0x000000, f, SGE.ALIGN_LEFT
	);
	
	c.line(m+bs+(bw-2*bs)*0.5, by, m+bs+(bw-2*bs)*0.5, by+bh+20, 0x000000, 1, 1);
	c.text(
		"Quantum mechanics (50%)",
		m+bs+(bw-2*bs)*0.5 - 5, by+bh+5+stats.labelSize*0.5,
		0x000000, f, SGE.ALIGN_RIGHT
	);
	
	c.line(Math.round(m+bs+(bw-2*bs)*5/9), by-20, Math.round(m+bs+(bw-2*bs)*5/9), by+bh, 0x000000, 1, 1);
	c.text(
		"Local determinism (55% or more)",
		Math.round(m+bs+(bw-2*bs)*5/9) + 5, by-5-stats.labelSize*0.5,
		0x000000, f, SGE.ALIGN_LEFT
	);
	
	c.rect(m, by, bw, bh, 0, 1, 1);
	c.rect(m+bs, by, bw-2*bs, bh, 0, 1, 1);
	
	for(var i = 0; i < 2; i++) {
		c.image(
			SGE.asset("symbols.png"), {
				x: md, y: md + (stats.iconSize + stats.rowSpace) * i + stats.labelSize,
				w: stats.iconSize, h: stats.iconSize
			}, { x: 25*(4 + (i)%2), y: 0, w: 25, h: 25 }
		);
		c.image(
			SGE.asset("symbols.png"), {
				x: md + stats.iconSize, y: md + (stats.iconSize + stats.rowSpace) * i + stats.labelSize,
				w: stats.iconSize, h: stats.iconSize
			}, { x: 25*(4 + (i+1)%2), y: 0, w: 25, h: 25 }
		);
	}
	for(var i = 0; i < 2; i++) {
		c.image(
			SGE.asset("symbols.png"), {
				x: bw - iw + md, y: md + (stats.iconSize + stats.rowSpace) * i + stats.labelSize,
				w: stats.iconSize, h: stats.iconSize
			}, { x: 25*(4 + i), y: 0, w: 25, h: 25 }
		);
		c.image(
			SGE.asset("symbols.png"), {
				x: bw - iw + md + stats.iconSize, y: md + (stats.iconSize + stats.rowSpace) * i + stats.labelSize,
				w: stats.iconSize, h: stats.iconSize
			}, { x: 25*(4 + i), y: 0, w: 25, h: 25 }
		);
	}
	
}

function resetStats() {
	statsCounter.same = 0;
	statsCounter.diff = 0;
	updateStats(0, 0);
}

resetStats();


// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback
tutorial.pause = 1000; // milliseconds between experimental runs

// Run experiment with N atoms, then go to callback function
tutorial.numAtoms = 0;
tutorial.run = function(callback, N) {
	if (typeof(N) == "undefined") N = 100;
	SGE.AnimationManager.timeFactor = 1;
	var maxtf = 5000;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
			
			// SGE.Animation.TimeCurve = function(n, total, rampup, rampdown, power, max) {
				
			// if (SGE.AnimationManager.timeFactor < maxtf) {
				// SGE.AnimationManager.timeFactor *= 1.1; // speed up
				// if (SGE.AnimationManager.timeFactor >= maxtf) {
					// SGE.AnimationManager.timeFactor = maxtf;
					// experiment.ignoreSilently = true;
				// }
			// }
			
			tutorial.numAtoms++;
			SGE.AnimationManager.timeFactor = SGE.Animation.TimeCurve(
				tutorial.numAtoms, 1000,
				100, 50, 3, 5000
			);
			
			// Stop after N atoms have been detected
			if (tutorial.numAtoms >= N) {
				callback();
				return;
			}
			
			// Keep releasing atoms
			clearTimeout(tutorial.timer);
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, Math.ceil(1 + tutorial.pause / SGE.AnimationManager.timeFactor));
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	experiment.run();
}

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
	
	// Events
	experiment.atomSpeed = 10;
	drumR.events.on(SGE.EVENT_DETECT_PARTICLE, function(e){ statsCounter.right = e.state; });
	drumL.events.on(SGE.EVENT_DETECT_PARTICLE, function(e){ statsCounter.left = e.state; });
	experiment.events.on(SGE.EVENT_BEGIN_EXPERIMENT, function(e){
		analyzerR.angle = SGE.TAU/3 * Math.floor(Math.random()*3);
		analyzerL.angle = SGE.TAU/3 * Math.floor(Math.random()*3);
		drumR.flash(null);
		drumL.flash(null);
	});
	experiment.events.on(SGE.EVENT_END_EXPERIMENT, function(e){
		if (statsCounter.right === statsCounter.left) {
			statsCounter.same++;
		} else {
			statsCounter.diff++;
		}
		updateStats(statsCounter.diff, statsCounter.same);
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Local determinism revisited (just some preamble)
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

// Show bar, get ready
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// Add stats 
	app.add(stats.canvas2D);
	stats.canvas2D.x = viewport.x + (viewport.width - stats.canvas2D.width)/2;
	stats.canvas2D.y = viewport.y + viewport.height - stats.canvas2D.height - 20;
	stats.canvas2D.opacity = 0;
	TweenMax.to(stats.canvas2D, 1, {
		opacity: 1,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Begin experiment
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	tutorial.run(tutorial.part1.step3, 1000);
	
	// ------------- For next step
	// Automatic
}

// Talk about results
tutorial.part1.step3 = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	
	SGE.AnimationManager.timeFactor = 1;
	setTimeout(function(){ 
		drumR.flash(null);
		drumL.flash(null);
	}, 1000);
	
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
	// End of experiment
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


