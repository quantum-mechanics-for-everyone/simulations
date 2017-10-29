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
// Tutorial 1.03: The Stern-Gerlach Analyzer
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
		"Welcome to the third interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll develop a new tool to help us explore the strangeness of quantum measurements.",
		"Above we see the Stern-Gerlach apparatus deflecting atoms up or down, just like we saw in the previous tutorial.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Putting the Stern-Gerlach apparatus in a box</strong>",
		"Previously, we discovered that the atoms can only deflect up or down relative to the orientation of the magnets, in stark contrast with how the classical current loops behaved.",
		"Since we only have two possible outcomes when measuring the magnetic arrow of an atom, we can now turn our Stern-Gerlach apparatus into a measurement tool with two paths.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [ // ToDo: Needs text review
		"First we will remove the screen. This will allow us to do other things with the atoms after they travel past the magnets.",
		"We will also add some tubes to keep the two paths separated, and to make the atom's motion clear after it is deflected upward or downward. (Something similar can be achieved in practice.)",
		"We're almost done now. All we need to do is package all of this into a box. Press "+btNext.textVersion+" to continue."
	],
	'1-2': [
		"The box will have one hole for input, and two holes for outputs. As you can see, the atom comes out of the box moving straight forward, just as before entering the box.",
		"However, any atom that comes out will have a definite direction for its effective magnetic arrow due to the interaction between the atom and the nonuniform magnetic field between the magnets.",
		"We need a better way to talk about these directions. To do this, we'll define a system of coordinates.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'1-3': [
		"We'll define three directions: "+SGE.Symbols.X+" (in red), "+SGE.Symbols.Y+" (in green), and "+SGE.Symbols.Z+" (in blue), each at right angles to the other two. The atoms will always be moving along the "+SGE.Symbols.Y+" direction.",
		"When the box is upright, as is the case right now, we have that the magnetic arrows of atoms that go through the box will be pointing either up, in the +"+SGE.Symbols.Z+" direction, or down, in the -"+SGE.Symbols.Z+" direction.",
		"We'll call these two possibilities by the signs "+SGE.Symbols.PLUS+" and "+SGE.Symbols.MINUS+". Any atom coming out of the box from the top hole will be in a "+SGE.Symbols.PLUS+" state in the "+SGE.Symbols.Z+" direction.",
		"We have added a "+SGE.Symbols.PLUS+" symbol at the top of the box to remind us of this. There's a similar "+SGE.Symbols.MINUS+" symbol at the bottom.",
		"Press "+btNext.textVersion+" to continue."
	],
	
	'1-4': [
		"Finally, we'll add a front cover to remind us of what's inside the box. The fat arrow represents the non-uniform magnetic field between the magnets, and points in the same direction as the field. We also see how the tubes are arranged.",
		"Now the outside of the box tells us all we need to know about what's inside, and we can easily see which outputs correspond to the "+SGE.Symbols.PLUS+" and "+SGE.Symbols.MINUS+" states.",
		"We'll call this box a <strong><em>Stern-Gerlach Analyzer</em></strong>, and we'll now use it in several quantum experiments.",
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
camera.focusOn(SGE.ORIGIN);
camera.x = 0;
camera.y = 1;
camera.z = 3;

// Custom "ignore" targets
var ignore1 = new SGE.Ignore();
var ignore2 = new SGE.Ignore();

// Axes
var axes = new SGE.Primitives.Axes();

// Bare Stern-Gerlach apparatus
var sterngerlach = new SGE.SternGerlach();

// Exploded Stern-Gerlach
var explodedanalyzer = new SGE.ExplodedAnalyzer();

// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback


// -------------------------------------------------------------------------------------------------
// Introduction
// We start with the same setup as before
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// Add experiment
	viewport.addExperiment(experiment);
	
	camera.x = 4.8;
	camera.focusOn(new THREE.Vector3(4.8,0,0));
	camera.rho = 6;
	
	// Place Stern-Gerlach apparatus in front of source
	sterngerlach.spacing = 1;
	source.attach(sterngerlach, SGE.IO_RIGHT);
	
	// Speed up atoms
	experiment.atomSpeed = 4;
	// Shoot random atoms continuously
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 500);
	});
	
	// Start experiment
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, 1000);
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
	btNext.enabled = true;
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Boxing the SG apparatus
tutorial.part1 = {};

// Show empty viewport, ask to add source
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

// Remove screen, add tubing
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	clearTimeout(tutorial.timer); // make sure to stop timer!
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	TweenMax.to(sterngerlach.screen.position, 1, {
		x: 7,
		ease: Power4.easeInOut,
		onComplete: function() {
			// Remove Stern-Gerlach apparatus
			sterngerlach.detach();
			experiment.remove(sterngerlach);
			
			// Setup exploded analyzer
			explodedanalyzer.spacing = 1.5;
			explodedanalyzer.topTube.position.y = 5;
			explodedanalyzer.bottomTube.position.y = -5;
			explodedanalyzer.frontCover.visible = false; // no covers yet
			explodedanalyzer.boxFrame.visible = false;
			explodedanalyzer.backCover.visible = false;
			
			// Replace apparatus with exploded analyzer
			source.attach(explodedanalyzer, SGE.IO_RIGHT);
			
			// Add "ignore" objects to top and bottom plugs of exploded analyzer
			explodedanalyzer.attach(ignore1, SGE.IO_TOP);
			explodedanalyzer.attach(ignore2, SGE.IO_BOTTOM);
			// Push them forward so the atom goes off screen
			ignore1.spacing = 7;
			ignore2.spacing = 7;
			
			// Move in tubes
			TweenMax.to(explodedanalyzer.topTube.position, 1, {
				y: 0,
				ease: Power4.easeInOut
			});
			// We continue running the experiment after we're done with one of the tubes
			TweenMax.to(explodedanalyzer.bottomTube.position, 1, {
				y: 0,
				ease: Power4.easeInOut,
				onComplete: function() {
					
					experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
						clearTimeout(tutorial.timer);
						tutorial.timer = setTimeout(function(){
							experiment.run();
						}, 500);
					});
					
					// Restart atoms
					experiment.run();
				}
			});
			
		},
	});
	
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Bring back cover in
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	// Bring in back cover first
	explodedanalyzer.backCover.visible = true;
	explodedanalyzer.backCover.position.y = 7;
	explodedanalyzer.backCover.position.z = -2;
	explodedanalyzer.boxFrame.visible = true;
	explodedanalyzer.boxFrame.position.y = 7;
	explodedanalyzer.boxFrame.position.z = -2;
	
	
	TweenMax.to([
		explodedanalyzer.backCover.position,
		explodedanalyzer.boxFrame.position
		], 1.5, {
		y: 0,
		ease: Power4.easeInOut
	});
	TweenMax.to([
			explodedanalyzer.backCover.position,
			explodedanalyzer.boxFrame.position
		], 1, {
		z: 0,
		delay: 1,
		ease: Power4.easeInOut
	});
	

	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step3);
}

// Show axes
tutorial.part1.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	clearTimeout(experiment.timer);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	
	viewport.add(axes);
	axes.position.x = 8;
	camera.moveFocusTo(axes.position, 2);
	TweenMax.to(camera, 2, {
		x: 10,
		y: 3.5,
		z: 4,
		ease: Power4.easeInOut
	});
	
	axes.opacity = 0;
	TweenMax.to(axes, 1, {
		opacity: 1,
		delay: 1,
		ease: Power4.easeInOut,
		onComplete: function() {
			experiment.run(); // restart experiment after camera change
		}
	});
	
	// Run continuously
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		clearTimeout(tutorial.timer);
		tutorial.timer = setTimeout(function(){
			experiment.run();
		}, 500);
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step4);
}

// Close box with front cover
tutorial.part1.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-4'], true);
	
	// Place front cover
	explodedanalyzer.frontCover.position.y = 0;
	explodedanalyzer.frontCover.position.z = 5;
	explodedanalyzer.frontCover.visible = true;
	TweenMax.to(explodedanalyzer.frontCover.position, 2, {
		z: 0,
		ease: Power4.easeInOut
	});
	
	// Move focus to analyzer
	camera.moveFocusTo(new THREE.Vector3(4.5,0,0), 2);
	// View from the side
	TweenMax.to(camera, 2, {
		x: 4.5,
		y: 3,
		z: 6,
		delay: 2,
		ease: Power4.easeInOut
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


