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
// Tutorial 2.04: The Bell Experiment (Part 3: Local Determinism)
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

// Shorthand for all eight instructions for the texts below
var
	S_RRR = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.RED_SMALL+SGE.Symbols.RED_SMALL+SGE.Symbols.RED_SMALL+"</span>",
	S_BBB = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.BLUE_SMALL+SGE.Symbols.BLUE_SMALL+SGE.Symbols.BLUE_SMALL+"</span>",
	S_RBB = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.RED_SMALL+SGE.Symbols.BLUE_SMALL+SGE.Symbols.BLUE_SMALL+"</span>",
	S_BRR = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.BLUE_SMALL+SGE.Symbols.RED_SMALL+SGE.Symbols.RED_SMALL+"</span>",
	S_BRB = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.BLUE_SMALL+SGE.Symbols.RED_SMALL+SGE.Symbols.BLUE_SMALL+"</span>",
	S_RBR = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.RED_SMALL+SGE.Symbols.BLUE_SMALL+SGE.Symbols.RED_SMALL+"</span>",
	S_BBR = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.BLUE_SMALL+SGE.Symbols.BLUE_SMALL+SGE.Symbols.RED_SMALL+"</span>",
	S_RRB = "<span style=\"white-space:nowrap;\">"+SGE.Symbols.RED_SMALL+SGE.Symbols.RED_SMALL+SGE.Symbols.BLUE_SMALL+"</span>";

// All messages for this tutorial in one place, for ease of editing
var MESSAGES = {
	'intro': [
		"<strong>Introduction</strong>",
		"Welcome to the third tutorial on the Bell experiment. In this tutorial we'll find out what are the predictions made by local determinism for this experiment.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Local determinism and hidden variables</strong>",
		"Once again we have two Bell analyzers in the Bell experiment setup, with the analyzer on the left placed a little bit closer to the source than the analyzer on the right.",
		"Just as before, the Stern-Gerlach analyzers inside the Bell analyzers are rotated to a random orientation every time atoms are released.",
		"We will again work out the probability that the two Bell analyzers will flash different colors. This time, however, we'll look at this experiment from the perspective of local determinism.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"Recall the second alternative explanation for our observations so far:",
		"<em style=\"margin:0 1em;display:block\"><strong>Alternative 2</strong>: An atom with a definite state in the "+SGE.Symbols.Z+" direction also has a definite state in the "+SGE.Symbols.X+" direction, but it changes so rapidly that no one can figure out what it is.</em>",
		"This is equivalent to saying atoms carry some type of <em>hidden instructions</em> as they leave the source. These instructions are assumed to be unknown to us, making the behavior of atoms unpredictable yet coordinated over large distances.",
		"This notion is formally referred to as a <em>hidden variable theory</em>, in which the system is fundamentally deterministic but in a way that we cannot know all of the details, making it unpredictable.",
		"In addition to this we are also assuming there is no faster-than-light communication occurring, as we generally want locality to be true.",
		"We'll now see what predictions we get from these assumptions.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Random distant measurements in local determinism</strong>",
		"Let's suppose then that each atom really carries with it some \"hidden instructions\" as it leaves the source, and that we can never know the exact details of these instructions. That is, we don't know <em>how</em> the atoms choose which way to go as they pass through a Stern-Gerlach analyzer.",
		"However, we do know the <em>outcomes</em> of those instructions: we know each atom can only be in one of two states when we measure them, and that this result must somehow depend on the orientation of the analyzers.",
		"Surprisingly, this is enough for us to create an useful model of the hidden instructions.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-1': [
		"In our experiment, each Stern-Gerlach analyzer can be in one of three orientations: A, B or C. This means each atom must carry, at the very least, a set of hidden instructions that determines the outcomes of measurements in those three directions.",
		"In other words, the instructions for an atom in our experiment can be roughly represented by the three possible outcomes. For example, if the hidden instructions of an atom were such that",
		"&emsp; A = "+SGE.Symbols.RED_SMALL+", B = "+SGE.Symbols.BLUE_SMALL+", C = "+SGE.Symbols.RED_SMALL,
		"then if we measured this atom in the B direction with a Bell analyzer, the analyzer would flash "+SGE.Symbols.BLUE+".",
		"For simplicity, from now on we'll omit the labels for the directions and refer to these sets of instructions just by their outcome symbols, like so: "+S_RBR,
		"Press "+btNext.textVersion+" to continue."
	],
	'2-2': [
		"Since each of the three directions has two possible outcomes, there is a total of 2 &times; 2 &times; 2 = 8 different effective instructions an atom can carry:",
		"<span style=\"margin-top:-1em;line-height:30px;display:block;text-align:center\">"+
		S_BBB+"&emsp;"+S_BBR+"&emsp;"+S_BRR+"&emsp;"+S_RBR+"<br/>"+
		S_RRR+"&emsp;"+S_RRB+"&emsp;"+S_RBB+"&emsp;"+S_BRB+"</span>",
		"We don't know how often atoms will follow any of these instructions, but we know for certain that the source in our Bell experiment can only release atoms of one of these 8 types.",
		"For now let's just assume all possibilities are equally likely. Let's see how that would work in practice. Press "+btGo.textVersion+" to begin a simulated experiment."
	],
	'2-3': [
		"The source released two atoms with instructions "+S_RBB+" on the left and "+S_BRR+" on the right. Notice that these two instructions are opposites of each other. This will always be the case since the atoms are entangled, and must have opposite states in each of the three directions.",
		"Therefore, we only need to specify the instructions for one of the atoms, since we'll immediately know the instructions for the other. We'll be using this observation soon.",
		"Now, given these instructions, what is the probability that the Bell analyzers will flash different colors? Let's find out.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-4': [
		"If the Stern-Gerlach analyzer on the left is in orientation A, we only need to look at the first instruction, which in this case is "+SGE.Symbols.RED_SMALL+".",
		"This means a "+SGE.Symbols.PLUS+" state will be measured by the Stern-Gerlach analyzer, and so the Bell analyzer on the left will flash the "+SGE.Symbols.RED+" lamp.",
		"Let's look at what happens on the other side.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-5': [
		"If the Bell analyzer on the left flashes "+SGE.Symbols.RED+", we still have three possibilities on the right, one for each orientation of the Stern-Gerlach analyzer. The instructions allow us to find the exact probability of the Bell analyzer on the right flashing "+SGE.Symbols.BLUE+".",
		"Here, we can see that when the analyzer on the left is in orientation A, the probability is 1/3. What about the total probability for this particular pair of instructions?",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-6': [
		"To find the probability that the Bell analyzers will flash different colors, we can construct a table with all the 9 possible combinations of orientations for the left and right analyzers. We marked every combination where the instructions don't match.",
		"The table shows that there are 5 ways in which the Bell analyzers can flash different colors, giving a probability of 5/9.",
		"But this is for the "+S_RBB+" and "+S_BRR+" instructions, and there are 8 in total. What about the others? Let's find out.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-7': [
		"It's obvious that the probability of different lights flashing will be 1 whenever the instructions are "+S_RRR+" or "+S_BBB+", since in that case the orientations do not matter. This is shown on the leftmost table.",
		"For the other possibilities, it's not difficult to see that the probability is also going to be 5/9, as the instruction for one of the directions will always be different than the other two. Since the order we write down the directions is arbitrary these are all equivalent.",
		"Above we see 4 tables which show what all the possible combinations look like between the 8 possible types of instructions. Remember that we only need to define the instructions for one atom, as the other is always the opposite.",
		"Given this, what's the <em>total probability</em> of the Bell analyzers flashing different colors?",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-8': [
		"The answer is that we don't know for sure. Since these instructions are, by definition, hidden and unknown, we cannot claim to know the probability precisely. This is because we don't know what is the probability that the source will release atoms carrying each type of instruction.",
		"But we still can make an useful estimate.",
		"If the source only released "+S_RRR+" and "+S_BBB+" atoms, then the total probability of the Bell analyzers flashing different colors would be 1.",
		"If the source only released "+S_RBB+" and "+S_BRR+" atoms, or other mixed instructions, then the total probability of the Bell analyzers flashing different colors would be 5/9.",
		"However, if the source releases a mix of all types of atoms, then the total probability would be somewhere between 5/9 and 1, that is, between 55% and 100%.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'end': [
		"<strong>Conclusion</strong>",
		"Our careful analysis has shown that:",
		"&emsp;<strong>Local determinism predicts that the Bell analyzers will flash different colors with probability 55% <em>or more</em>.</strong>",
		"With this result we can now test for the existence of local hidden instructions, even if we cannot access them directly. In the next tutorial, we'll do just that.",
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

// Canvas
// Ad-hoc object to deal with the state table
var table = {
	iconSize: 16, pad: 5, margin: 5, offset: 15, spacing: 20
}
table.width = (2*table.pad + table.iconSize)*5 + table.margin*2 + table.offset;
table.height = (2*table.pad + table.iconSize)*5 + table.margin*3 + table.offset*2;
table.widthFull = table.spacing + (table.width + table.spacing)*4;
table.heightFull = table.height;
table.canvas2D = new SGE.Canvas2D(table.width+table.spacing*2, table.height+table.spacing*2);
table.canvas2DFull = new SGE.Canvas2D(table.widthFull, table.heightFull);
table.canvas2D.shadow = 10;
table.canvas2DFull.shadow = 10;
table.canvas2D.clear();
table.canvas2DFull.clear();

// Preload symbols
table.canvas2D.image(SGE.asset("symbols.png"), { x: -100, y: -100 });

table.drawTable = function(c, x, y, state, compact) {
	var c, px, py, o, s, l = (this.iconSize + 2*this.pad);
	o = this.offset;
	
	compact = ifdef(compact, true);
	
	if (compact) {
		c.text(
			"RIGHT",
			x + o*0.75,
			y + o + l*3.5,
			0, (l*0.65)+"px monospace",
			SGE.ALIGN_CENTER, SGE.TAU/4
		);
		
		c.text(
			"LEFT",
			x + o + l*3.5,
			y + o*0.75,
			0, (l*0.65)+"px monospace",
			SGE.ALIGN_CENTER, 0
		);
	}
	
	c.text(
		"Probability: "+(state[0] == state[1] && state[1] == state[2]?"  1":"5/9"),
		x + this.margin,
		y + o + l*5.5 + this.margin*0.6,
		0, (l*0.6)+"px monospace",
		SGE.ALIGN_LEFT, 0
	);
	
	for(var i = 0; i < 5; i++) {
		for(var j = 0; j < 5; j++) {
			if ((i+j) < 2) continue;
			if (i == 1 && j == 1) continue;
			px = o + x + i*l;
			py = o + y + j*l;
			if (i == 0) {
				c.text(
					String.fromCharCode(65+j-2),
					px + l/2, py+l/2+1,
					0, (l*0.75)+"px monospace",
					SGE.ALIGN_CENTER, 0
				);
			}
			if (j == 0) {
				c.text(
					String.fromCharCode(65+i-2),
					px + l/2, py+l/2+1,
					0, (l*0.75)+"px monospace",
					SGE.ALIGN_CENTER, 0
				);
			}
			if (i == 0 || j == 0) continue;
			if (i == 1) {
				s = (state[j-2] == SGE.PLUS?1:0);
				c.image(
					SGE.asset("symbols.png"), {
						x: px + this.pad,
						y: py + this.pad,
						w: this.iconSize, h: this.iconSize
					}, { x: 25*(4 + s), y: 0, w: 25, h: 25 }
				);
			}
			if (j == 1) {
				s = (state[i-2] == SGE.PLUS?0:1);
				c.image(
					SGE.asset("symbols.png"), {
						x: px + this.pad,
						y: py + this.pad,
						w: this.iconSize, h: this.iconSize
					}, { x: 25*(4 + s), y: 0, w: 25, h: 25 }
				);
			}
			if (i >= 2 && j >= 2) {
				if (state[i-2] == state[j-2]) {
					c.fillRect(
						px, py,
						l, l, 0x00CC00, 0.2
					);
					c.lines([
							[px + l*0.2, py + l*0.55],
							[px + l*0.4, py + l*0.75],
							[px + l*0.8, py + l*0.25]
						],
						0x00AA00, 1, 3
					);
				}
			}
			c.rect(
				px,
				py,
				l, l, 0, 0.2, 1
			);
		}
	}
}


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

// Recap, talk about hidden variables
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 1 - Local determinism revisited
tutorial.part2 = {};

// Recap
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Recap, talk about instructions
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Talk about possible instructions, show table
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Talk about possible instructions, show table
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	experiment.atomL.instructions.state = [SGE.PLUS, SGE.MINUS, SGE.MINUS];
	experiment.atomR.instructions.state = [SGE.MINUS, SGE.PLUS, SGE.PLUS];
	
	experiment.addTrigger(analyzerL.spacing*0.75);
	experiment.events.on(SGE.EVENT_TRIGGER_POINT, function(d){
		if (d.particle == experiment.atomL) {
			experiment.pause();
			camera.tween(
				[-5,0,12],
				[0,0,0],
				1.5
			);
			btNext.enabled = true;
			btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step4);
		}
	});
	
	experiment.run();
	
	// ------------- For next step
	// Wait
}

// Talk about state on the left
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// remove trigger
	experiment.events.off(SGE.EVENT_TRIGGER_POINT); 
	experiment.removeTrigger(analyzerL.spacing/2);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-4'], true);
	
	camera.tween([-3,0,14], analyzerL, 2);
	
	// Explode Bell analyzers
	TweenMax.to([drumL.bottom.position, drumL.back.position, drumR.bottom.position, drumR.back.position], 1, {
		y: -3.5,
		delay: 2,
		ease: Power4.easeInOut
	});
	TweenMax.to([drumL.top.position, drumL.front.position, drumR.top.position, drumR.front.position], 1, {
		y: 3.5,
		delay: 2,
		ease: Power4.easeInOut
	});
	
	// Show directions
	drumL.directions.visible = true;
	drumL.directions.opacity = 0;
	drumR.directions.visible = true;
	drumR.directions.opacity = 0;
	// drumL.directions.alwaysVisible = true; // better without
	// drumR.directions.alwaysVisible = true;
	TweenMax.to([drumL.directions, analyzerL.angleMeter, drumR.directions, analyzerR.angleMeter], 0.5, {
		opacity: 1,
		delay: 3,
		ease: Power4.easeInOut
	});
	TweenMax.to(experiment.atomL.instructions, 0.5, {
		opacityA: 1,
		opacityB: 0.3,
		opacityC: 0.3,
		delay: 3,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step5);
}

// Talk about states on the right
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	camera.tween([-1,0,13], analyzerR, 2);
	
	tutorial.n = 0;
	TweenMax.to(experiment.atomR.instructions, 0.5, {
		opacityA: (tutorial.n == 0? 1 : 0.3),
		opacityB: (tutorial.n == 1? 1 : 0.3),
		opacityC: (tutorial.n == 2? 1 : 0.3),
		ease: Power4.easeInOut
	});
	
	tutorial.timer = setInterval(function(){
		tutorial.n++;
		TweenMax.to(analyzerR, 0.5, {
			angle: tutorial.n*SGE.TAU/3+1e-6,
			ease: Power4.easeInOut,
			onComplete: function() {
				if (tutorial.n == 3) {
					tutorial.n = 0;
					analyzerR.angle = 0;
				}
			}
		});
		TweenMax.to(experiment.atomR.instructions, 0.5, {
			opacityA: ((tutorial.n % 3) == 0? 1 : 0.3),
			opacityB: ((tutorial.n % 3) == 1? 1 : 0.3),
			opacityC: ((tutorial.n % 3) == 2? 1 : 0.3),
			ease: Power4.easeInOut
		});
	}, 3000);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step6);
}

// Show table for 1 combination
tutorial.part2.step6 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	clearInterval(tutorial.timer);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-6'], true);
	
	camera.restore(2);
	
	// Revert analyzers
	TweenMax.to([experiment.atomL.instructions, experiment.atomR.instructions], 0.5, {
		opacityA: 1,
		opacityB: 1,
		opacityC: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to([drumL.directions, analyzerL.angleMeter, drumR.directions, analyzerR.angleMeter], 0.5, {
		opacity: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to([analyzerR, analyzerR], 0.5, {
		angle: 0,
		ease: Power4.easeInOut,
		delay: 1
	});
	TweenMax.to([drumL.bottom.position, drumL.back.position, drumR.bottom.position, drumR.back.position], 1, {
		y: 0,
		delay: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to([drumL.top.position, drumL.front.position, drumR.top.position, drumR.front.position], 1, {
		y: 0,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() {
			experiment.atomSpeed = 8;
			experiment.resume();
		}
	});
	
	app.add(table.canvas2D, viewport.x + (viewport.width - table.width)/2, viewport.y + (viewport.height - table.height)/2);
	table.drawTable(table.canvas2D, table.spacing, table.spacing, experiment.atomL.instructions.state);
	table.canvas2D.opacity = 0;
	TweenMax.to(table.canvas2D, 1, {
		opacity: 1,
		ease: Power4.easeInOut,
		delay: 4,
		onComplete: function(){ btNext.enabled = true; }
	});
	
	
	// ------------- For next step
	// btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step7);
}

// Hide table
tutorial.part2.step7 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.clear();
	
	TweenMax.to(table.canvas2D, 1, {
		opacity: 0,
		ease: Power4.easeInOut,
		onComplete: function(){ tutorial.part2.step7b(); }
	});
	
	// ------------- For next step
	// Automatic
}

// Show new table, talk about other stats
tutorial.part2.step7b = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-7'], true);
	
	// app.remove(table.canvas2D);
	app.add(table.canvas2DFull,
		viewport.x + (viewport.width - table.widthFull)/2,
		viewport.y + (viewport.height - table.heightFull)/2
	);
	table.canvas2DFull.opacity = 0;
	var cs = [
			[SGE.MINUS,SGE.MINUS,SGE.MINUS], [SGE.MINUS,SGE.MINUS,SGE.PLUS],
			[SGE.MINUS,SGE.PLUS,SGE.PLUS], [SGE.PLUS,SGE.MINUS,SGE.PLUS]
		];
	for(var i = 0; i < 4; i++) {
		table.drawTable(table.canvas2DFull,
			table.spacing + i * (table.width + table.spacing), 0,
			cs[i], false
		);
	}
	TweenMax.to(table.canvas2DFull, 1, {
		opacity: 1,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step8);
}

// Combinations
tutorial.part2.step8 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	
	messagebox.setMessage(MESSAGES['2-8'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.conclusion);
}

// Combinations
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


