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
// Tutorial 1.04: Repeated measurements with the Stern-Gerlach Analyzer
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
		"Welcome to the fourth interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll start using the <em>Stern-Gerlach Analyzer</em> to explore a few experiments in quantum mechanics.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Using the Stern-Gerlach Analyzer</strong>",
		"Now that we have created the analyzer, we can use it to find out how quantum measurements work in more detail.",
		"We'll start by exploring how repeated measurements work with these analyzers.",
		"Press "+btNext.textVersion+" to bring another analyzer into the experiment."
	],
	'1-1': [
		"We now have two analyzers, A and B, placed side by side. We are interested in knowing how results of measurements done by analyzer A will affect the results of analyzer B. In other words, how <em>reproducible</em> are the results of a Stern-Gerlach analyzer measurement.",
		"In order to perform this experiment, we want atoms coming out of A to enter B. We have two options here, so we'll go for the "+SGE.Symbols.PLUS+" output of A.",
		"Press "+btNext.textVersion+" to place analyzer B in front of the "+SGE.Symbols.PLUS+" output of analyzer A."
	],
	'1-2': [
		"We are ready to have a few atoms go through our analyzers.",
		"We know that analyzer A will deflect some atoms to the "+SGE.Symbols.PLUS+" output, and some to the "+SGE.Symbols.MINUS+" output. Only atoms leaving "+SGE.Symbols.PLUS+" will enter analyzer B.",
		"Given this information, what fraction of atoms do you expect to come out of the "+SGE.Symbols.PLUS+" output of analyzer B? What about the "+SGE.Symbols.MINUS+" output?",
		"Make a prediction and press "+btGo.textVersion+" to see if you are right."
	],
	'1-3': [
		"The atoms are going through our analyzers. Can you spot a pattern in their behavior?",
		"It looks like every atom entering analyzer B now comes out of its "+SGE.Symbols.PLUS+" output. No atom ever comes out of the "+SGE.Symbols.MINUS+" output! Is this what you expected? This result shows that once we find the projection of +"+SGE.Symbols.Z+" for an atom, it remains +"+SGE.Symbols.Z+" if we measure it again.",
		"What do you think would happen if we placed analyzer B in front of the "+SGE.Symbols.MINUS+" output of A?",
		"Make a prediction, and press "+btNext.textVersion+" to see if you got it right."
	],
	'1-4': [
		"This time, every atom entering analyzer B comes out of its "+SGE.Symbols.MINUS+" output. Is this what you expected? It says when the atom is measured with -"+SGE.Symbols.Z+", it will be measured as -"+SGE.Symbols.Z+" again if we immediately repeat the experiment.",
		"Let's recap: all atoms coming from the source have a completely random direction for their effective magnetic arrow. But once these atoms go through analyzer A, the arrows have two choices: they can <em>only</em> be pointing upwards, leaving the "+SGE.Symbols.PLUS+" output, or pointing downwards, leaving the "+SGE.Symbols.MINUS+" output.",
		"In either case, after leaving analyzer A the direction is now completely known. Analyzer B will then measure the same direction that A measured, every time.",
		"The only conclusion is that analyzer A <em>defined</em> the state of the atom when it measured it!",
		"Let's explore this phenomenon a bit further. Press "+btNext.textVersion+" to go to the next part of the tutorial."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: Measurements and quantum states</strong>",
		"As we have just found out, when we measure the direction of an atom's effective magnetic arrow we are actually defining its state. Any future measurements of that state will always obtain the same result.",
		"It would be useful to illustrate this knowledge we have about the atoms in our experiment. We could use a blue and red arrow but, as we have seen in the first tutorial, effective magnetic arrows rotate (<em>precess</em>) around a cone.",
		"Any direction around that cone is just as valid as any other, as the projections on the axis of rotation are all the same, so they all would be deflected by the same amount.",
		"Since there's no way to tell these directions apart, we'll use a blue and red cone to represent the orientation of all these possible effective magnetic arrows.",
		"Press "+btNext.textVersion+" to restart the simulation, but now with these cones representing <em>our knowledge</em> of the effective magnetic arrows."
	],
	'2-1': [
		"We can now see the cones representing <em>our knowledge</em> of each atom's effective magnetic arrow orientation.",
		"Notice how there's no cone for atoms coming out of the source. This is because we have no way of knowing the orientation of the effective magnetic arrow before we measure it. It can be <em>any</em> direction with equal likelihood.",
		"However, as soon as the atom leaves analyzer A, we know exactly which state it is. If it leaves the "+SGE.Symbols.PLUS+" output, the red part of the cone points up. If it leaves the "+SGE.Symbols.MINUS+" output, the red part of the cone points down.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-2': [
		"But we must remember that these directions are all measured <em>relative to the magnets inside the analyzers</em>. If we rotate the analyzer, the direction in which we are doing the measurement will change.",
		"So what happens if we flip analyzer B upside down?",
		"Make a prediction and press "+btNext.textVersion+" to see if you got it right."
	],
	'2-3': [
		"We can now see that atoms coming out of A with a "+SGE.Symbols.MINUS+" state come out of B as if they had a "+SGE.Symbols.PLUS+" state. That is, flipping analyzer B upside-down reversed the roles of the two outputs.",
		"However, the deflection and the cones remain unchanged. The only change was in how we interpret the results of analyzer B. This means it is vital that we keep track of what, exactly, we are measuring and how.",
		"With this in mind, in the next tutorials we will explore what happens if we rotate analyzer B by different amounts.",
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
camera.x = 4.5;
camera.y = 3;
camera.z = 6;
camera.focusOn(new THREE.Vector3(4.5,0,0));

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
analyzer1.label.position.y = 2.5;
analyzer2.label.text = "B";
analyzer2.label.position.y = 2.5;

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
	analyzer1.spacing = 1.5;
	
	// Speed up atoms
	experiment.atomSpeed = 5;
	
	// Axes
	viewport.add(axes);
	axes.position.x = 8;
	// axes.opacity = 0;
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
	btNext.enabled = true;
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Chaining analyzers
tutorial.part1 = {};

// Show static analyzer with axes
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
	btNext.enabled = true;
}

// Move back camera and remove axes
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// Add a detached analyzer
	experiment.add(analyzer2);
	analyzer2.spacing = 1.5;
	analyzer2.position.x = 12; // 11.5
	analyzer2.position.y = 6;
	
	// Move camera further back
	camera.moveFocusTo(new THREE.Vector3(8,0,0), 2);
	TweenMax.to(camera, 2, {
		x: 8,
		z: 8,
		ease: Power2.easeInOut
	});
	
	// Slide in new analyzer from the top
	TweenMax.to(analyzer2.position, 1.5, {
		x: 13,
		y: 0,
		delay: 1,
		ease: Power4.easeInOut
	});
	
	// Fade in labels
	TweenMax.to(analyzer1.label, 1, {
		opacity: 1,
		delay: 2,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer2.label, 1, {
		opacity: 1,
		delay: 2,
		ease: Power4.easeInOut
	});
	
	// Remove axes
	TweenMax.to(axes, 1, {
		opacity: 0,
		ease: Power4.easeInOut,
		onComplete: function() {
			viewport.remove(axes);
		}
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Attach second analyzer (no joining yet)
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	// Slide in new analyzer from the top to the final position
	// It's still not attached!
	TweenMax.to(analyzer2.position, 1, {
		y: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to(analyzer2.position, 1, {
		x: 11.35,
		delay: 0.5,
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
	
	// Attach analyzers together for the actual simulation
	analyzer1.attach(analyzer2, SGE.IO_TOP);
	analyzer2.spacing = 2;
	
	// Speed up atoms so we can see more events
	experiment.atomSpeed = 8;
	
	// Use ignore targets far away to the left (so atoms go off screen)
	// (Soon we'll just let the auto-ignore happens)
	analyzer1.attach(ignore1, SGE.IO_BOTTOM);
	ignore1.spacing = 11;
	ignore1.visible = false;
	analyzer2.attach(ignore2, SGE.IO_TOP);
	ignore2.spacing = 5;
	ignore2.visible = false;
	analyzer2.attach(ignore3, SGE.IO_BOTTOM);
	ignore3.spacing = 5;
	ignore3.visible = false;
	
	// Run continuously
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 500);
	});
	experiment.run();
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step4);
}

// Switch to other output
tutorial.part1.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-4'], true);
	
	// Deatch analyzer 2 and the ignore target on analyzer 1
	analyzer2.detach();
	ignore1.detach();
	// Slide in new analyzer from the top to the bottom position
	TweenMax.to(analyzer2.position, 1.5, {
		y: -1,
		ease: Power4.easeInOut,
		onComplete: function() {
			// Re-attach
			analyzer1.attach(ignore1, SGE.IO_TOP);
			analyzer1.attach(analyzer2, SGE.IO_BOTTOM);
			// Run continuously
			experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
				clearTimeout(tutorial.timer);
				tutorial.timer = setTimeout(function(){
					experiment.run();
				}, 500);
			});
			experiment.run();
		}
	});
	// Push label upwards a bit more so it stays in the same place, and out of the way of atoms
	TweenMax.to(analyzer2.label.position, 1.5, {
		y: 3.5,
		ease: Power4.easeInOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 2 - Using the analyzer
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

// Mention predictions, get ready for experiment run
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	// Show state cones
	experiment.revealStates = true;
	
	// Make atom slower so cones can be seen more easily
	experiment.atomSpeed = 4;
	
	// Start experiment
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 500);
	});
	experiment.run();
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Prepare to flip analyzer B
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);

	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Flip analyzer B
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	// Flip analyzer 2 upside down
	// No need for angle meter in this case
	TweenMax.to(analyzer2, 1, {
		angle: SGE.TAU/2,
		ease: Power4.easeInOut,
		onComplete: function() {
			
			// Start experiment
			experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
				clearTimeout(tutorial.timer);
				tutorial.timer = setTimeout(function(){
					experiment.run();
				}, 500);
			});
			experiment.run();
			
		}
	});
	
	
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


