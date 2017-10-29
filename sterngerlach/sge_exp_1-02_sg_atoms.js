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
// Tutorial 1.02: The Stern-Gerlach apparatus with atoms
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
btNext.enabled = false;
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
		"Welcome to the second interactive tutorial on the Stern-Gerlach experiment! In this tutorial we'll explore how quantum-mechanical atoms behave under the influence of a magnetic field that is not uniform.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Source of atoms</strong>",
		"As before, our experiment is currently empty and there's nothing to see in the viewport. We'll once again bring in a source of particles, but this time the particles are going to be atoms, and not the idealized current loops we've seen so far.",
		"Press "+btNext.textVersion+" to bring a source of atoms into the experiment."
	],
	'1-1': [
		"This is our source of atoms. Notice how it has no markings on its sides.",
		"In the real-life experiment, this source would be an oven heating up a small amount of silver, which evaporates and is ejected from a hole in the oven.",
		"Now let's see what we can do with these silver atoms. Press "+btGo.textVersion+" to have the source start releasing the atoms."
	],
	'1-2': [
		"The source has started releasing silver atoms, which are shown here as small balls. We know each of these silver atoms must have an effective magnetic arrow as well.",
		"In the previous tutorial, we already knew beforehand the orientation of magnetic arrows of the current loops coming out of the source. But now we are performing a \"real\" experiment, so we don't know anything about these atoms beforehand. In fact, we are trying to measure the orientation of those effective magnetic arrows by performing this experiment.",
		"We have no idea about the strength of the magnetic arrows or in which direction they are pointing at when they come out of the source, but from the results of the experiment with current loops we know how to figure these things out.",
		"So, once again, we will use a special arrangement of magnets to separate atoms based on the orientation of their effective magnetic arrow. The atoms will be deflected by the magnetic field, just like the current loops, and will hit a screen where we can observe the results.",
		"Press "+btNext.textVersion+" to bring the magnets and the screen into the experiment."
	],
	
	'1-3': [
		"We now have the same setup as before. The atoms will pass in between the magnets and their magnetic arrow will interact with the spatially non-uniform magnetic field between the two magnets. The atom will experience a force and be deflected, hitting the screen and leaving a mark.",
		"This means we can identify the direction of the effective magnetic arrow associated with these atoms using the same setup as before.",
		"Press "+btNext.textVersion+" to continue to the next part of the tutorial."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: The Stern-Gerlach experiment for silver atoms</strong>",
		"We are ready to perform the experiment, but now we'll be using atoms.",
		"Again, we don't know anything about the state of these atoms as they leave the source, so these magnetic arrows could be pointing in any direction relative to the source.",
		"Using this information, and what we have learned so far, make a prediction of what you expect to happen for each atom that goes through.",
		"When you are ready to continue, press "+btNext.textVersion+"."
	],
	'2-1': [
		"Now that you've made your prediction, we are ready to begin our experiment! Let's start by first observing what happens to just one atom.",
		"Press "+btGo.textVersion+" to make the source release one atom."
	],
	//'2-2': not used
	'2-3': [
		"We found that this atom was deflected upwards.",
		"From what we know about how magnetic arrows interact with non-uniform magnetic fields, what can we say about this atom's magnetic arrow and its direction?",
		"Keep in mind that we don't know the strength of the effective magnetic arrow. The amount of deflection depends on the mass of the atom and the strength of the force experienced by it, which in turn depends on both the orientation of the arrow and its size, as well as the strength of the magnetic field.",
		"Let's perform the experiment a few more times and gather more results. Press "+btGo.textVersion+" to have the source release some more atoms."
	],
	//'2-4': not used
	'2-5': [
		"A pattern is starting to emerge. Can you see what it is?",
		"Is this the result you predicted? How is it similar and how is it different from what we've seen before with the current loops?",
		"Once you thought about it enough, press "+btNext.textVersion+" to explore this situation further."
	],
	
	// Part 3
	'3-0': [
		"<strong>Part 3: The Conundrum of Projections</strong>",
		"As we just found out, it seems we can only get two possible orientations for the magnetic arrows of the atoms when we attempt to measure them. Could it be that these atoms are coming out of the source with their magnetic arrows always pointing exactly up or down?",
		"Let's repeat the experiment again, but this time we'll rotate the <em>magnets</em> 90°, instead of the source. We'll leave the results of the previous experiment on the screen so we can compare the two.",
		"What do you think will happen this time around?",
		"Make a prediction, and press "+btGo.textVersion+" when you are ready to test it out."
	],
	//'3-1': not used
	'3-2': [
		"Once again, we got two isolated spots! Notice that the separation between the two pairs of spots is also the same. This means the magnetic arrows are now pointing just as much to the sides as they did before, in the up-and-down direction.",
		"Is this the result you expected?",
		"Thinking in terms of the projection of the magnetic arrow, how do you reconcile it with the result of the experiment when the source was upright?",
		"Try coming up with a reasonable resolution for this conundrum.",
		"When you are done, press "+btNext.textVersion+" to continue." 
	],
	'3-3': [
		"To test our understanding, let's make one final experiment: we'll rotate the magnets by 45°.",
		"Now we'll be measuring the magnetic arrows in an intermediate direction between the the two previous experiments.",
		"After all we have discovered in these experiments so far, what pattern should we get this time?",
		"Press "+btGo.textVersion+" to test your prediction."
	],
	//'3-4': not used
	'3-5': [
		"We once again got two isolated spots, and even weirder, they are <em>still</em> the same distance apart as before!",
		"Is this the result you expected? How can all three results be true at the same time?",
		"Based on your knowledge of the projection of the magnet arrow, what conclusions can you make out of these results?",
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
camera.x = 4.8;
camera.y = 2;
camera.z = 3;

// Custom "ignore" target 
var ignore = new SGE.Ignore();

// Stern-Gerlach apparatus
var sterngerlach = new SGE.SternGerlach();

// Comparison diagrams
var cvComparison = new SGE.Canvas2D(600, 250);

// #################################################################################################
// Tutorial narrative (encapsulates steps and other things)
var tutorial = {};
tutorial.animate = null; // custom animation callback

// -------------------------------------------------------------------------------------------------
// Introduction
tutorial.intro = function() {
	// ------------- Current step
	messagebox.setMessage(MESSAGES['intro'], false);
	btNext.blinkOn();
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
	btNext.enabled = true;
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Source of silver atoms
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
	viewport.blinkOn();
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
	btNext.enabled = true;
}

// Add source, ask to press go
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	viewport.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// Add experiment
	viewport.addExperiment(experiment);
	
	// Add source and tween it into place
	experiment.position.y = 4;
	
	source.label.size = 1/3;
	source.label.text = "SOURCE OF\nSILVER ATOMS";
	source.label.position.y = 1.25;
	source.label.color = 0xFFFFFF;
	source.label.visible = true;
	source.label.opacity = 0;
	
	TweenMax.to(experiment.position, 2, {
		y: 0,
		ease: Power4.easeInOut,
		onComplete: function() {
			TweenMax.to(source.label, 1, {
				opacity: 1
			});
		}
	});
	
	// Spin camera around source slowly
	tutorial.animate = function(t, delta) {
		camera.theta += delta*0.5;
	}
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.blinkOn();
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Go pressed, keep firing particles
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	btGo.blinkOff();
	experiment.position.y = 0;
	tutorial.animate = null;
	
	TweenMax.to(camera, 1, {
		theta: SGE.TAU/4,
		ease: Power4.easeInOut
	});
	
	TweenMax.to(source.label, 0.5, {
		opacity: 0,
		onComplete: function() {
			source.label.visible = false;
		}
	});
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	
	// Add an invisible ignore object ahead of source
	// This prevents an ("x ignore") icon showing up automatically near the source
	// By manully adding one in front of the source off screen, we force the particle to move
	// all the way to the right
	ignore.spacing = 12;
	source.attach(ignore, SGE.IO_RIGHT);
	experiment.updatePositions();
	
	experiment.events.on(SGE.EVENT_END_EXPERIMENT, function(){
		// Run experiment again and again after 1 second wait
		setTimeout(function(){
			experiment.run();
		},1000);
	});
	
	// Move camera so we get a nice view of the atom traveling
	TweenMax.to(camera, 1, {
		delay: 1,
		x: 4.8,
		ease: Power4.easeInOut,
		onStart: function() { camera.focusOn(null); },
		onComplete: function() {
			experiment.run();
		}
	});
	
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step3);
}

// Bring in magnets and screen at the same time
tutorial.part1.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// Stop releasing atoms
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	
	// First, we detach the "ignore" block off screen to the right
	ignore.detach();
	experiment.remove(ignore);
	
	// Then, we replace object in front of source with the Stern-Gerlach apparatus
	sterngerlach.spacing = 1;
	source.attach(sterngerlach, SGE.IO_RIGHT);
	
	// Move magnets off screen
	sterngerlach.magnets.southMagnet.position.y = 4;
	sterngerlach.magnets.northMagnet.position.y = -4;
	sterngerlach.screen.position.x = 12;
	
	// We slide in the magnets and screen
	TweenMax.to(sterngerlach.magnets.southMagnet.position, 1, {
		y: 0, ease: Power4.easeOut
	});
	TweenMax.to(sterngerlach.magnets.northMagnet.position, 1, {
		y: 0, ease: Power4.easeOut
	});
	TweenMax.to(sterngerlach.screen.position, 1, {
		x: 0, ease: Power4.easeOut
	});
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 2 - The Stern-Gerlach experiment for silver atoms
tutorial.part2 = {};

// Intro, ask for predictions
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
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
	
	// ------------- For next step
	btGo.blinkOn();
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Shoot one atom
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	btGo.blinkOff();
	experiment.end();
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	// ------------- Current step
	// messagebox.setMessage(MESSAGES['2-2'], true);
	
	// Forced spin-up state (make sure it's hidden)
	source.forceSpinUp = true;
	experiment.atomSpeed = 2;
	experiment.revealStates = false;
	
	// Go to next step once atom hits
	experiment.events.on(SGE.EVENT_END_EXPERIMENT, tutorial.part2.step3);
	experiment.run();
	
	// ------------- For next step
	//btGo.enabled = true;
	//btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Inquire about the implications of the atom hitting the screen at the top
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step4)
}

// Shoot a few more atoms for comparison
tutorial.part2.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	// messagebox.setMessage(MESSAGES['2-4'], true);
	
	// Disable forced spin-up state
	// We want random states for the atoms now
	source.forceSpinUp = false;

	var count = 20; // shoot a few atoms
	// Shoot them continuously
	SGE.AnimationManager.timeFactor = 2;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		count--;
		if (count >= 0) {
			SGE.AnimationManager.timeFactor *= 1.5; // speed up
			if (SGE.AnimationManager.timeFactor > 25) SGE.AnimationManager.timeFactor = 25;
			clearTimeout(tutorial.timer);
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, 50);
			return;
		}
		// Go to next step automatically
		tutorial.part2.step5();
	});
	
	// Start experiment
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, 1000);
	
	// ------------- For next step
	//btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step5);
}

// Inquire about pattern
tutorial.part2.step5 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	clearTimeout(tutorial.timer);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	SGE.AnimationManager.timeFactor = 1; // restore animation time factor
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-5'], true);
	
	// ------------- For next step
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.intro);
	btNext.enabled = true;
}

// -------------------------------------------------------------------------------------------------
// Part 3 - The Conundrum of Projections
tutorial.part3 = {};

// Rotate to 90°
tutorial.part3.intro = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-0'], true);
	
	// save camera position for later
	tutorial.cameraLocation = camera.location;
	
	camera.focusOn(new THREE.Vector3(camera.x,0,0));
	TweenMax.to(camera, 1, {
		x: -2,
		y: 3,
		z: 4,
		ease: Power2.easeInOut
	});
	
	TweenMax.to(sterngerlach.angleMeter, 1, {
		opacity: 1,
		ease: Power4.easeInOut,
		delay: 1
	});
	
	TweenMax.to(sterngerlach, 2, {
		angle: SGE.TAU/4,
		ease: Power4.easeInOut,
		delay: 1.5
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part3.step1);
}

// Fire at 90°
tutorial.part3.step1 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	// messagebox.setMessage(MESSAGES['2-7'], true);
	
	
	// Restore camera position
	TweenMax.to(camera, 1, {
		x: tutorial.cameraLocation.x,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z,
		ease: Power2.easeInOut
	});
	
	camera.moveFocusTo(new THREE.Vector3(tutorial.cameraLocation.x,0,0), 1);
	
	// Fade out angle meter
	TweenMax.to(sterngerlach.angleMeter, 1, {
		opacity: 0,
		ease: Power4.easeInOut
	});
	
	var count = 20; // shoot a few atoms
	// Shoot them continuously
	SGE.AnimationManager.timeFactor = 2;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		count--;
		if (count >= 0) {
			SGE.AnimationManager.timeFactor *= 1.5; // speed up
			if (SGE.AnimationManager.timeFactor > 25) SGE.AnimationManager.timeFactor = 25;
			clearTimeout(tutorial.timer);
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, 50);
			return;
		}
		// Go to next step automatically
		tutorial.part3.step2();
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, 1000);
	
	// ------------- For next step
}

// The conundrum
tutorial.part3.step2 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	clearTimeout(tutorial.timer);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-2'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.step3);
}

// A final blow to classical thinking
tutorial.part3.step3 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-3'], true);
	
	// save camera position for later
	tutorial.cameraLocation = camera.location;
	
	camera.focusOn(new THREE.Vector3(camera.x,0,0));
	TweenMax.to(camera, 1, {
		x: -2,
		y: 3,
		z: 4,
		ease: Power2.easeInOut
	});
	
	TweenMax.to(sterngerlach.angleMeter, 1, {
		opacity: 1,
		ease: Power4.easeInOut,
		delay: 1
	});
	
	TweenMax.to(sterngerlach, 1, {
		angle: SGE.TAU/8,
		ease: Power4.easeInOut,
		delay: 1.5
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part3.step4);
}


// Experiment at 45°
tutorial.part3.step4 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btGo.events.off(SGE.EVENT_PRESS);
	btGo.enabled = false;
	// ------------- Current step
	// messagebox.setMessage(MESSAGES['3-3'], true);
	
	// Note: Virtually the same code as step 1
	// Except for the last few lines
	
	// Restore camera position
	TweenMax.to(camera, 1, {
		x: tutorial.cameraLocation.x,
		y: tutorial.cameraLocation.y,
		z: tutorial.cameraLocation.z,
		ease: Power2.easeInOut
	});
	
	camera.moveFocusTo(new THREE.Vector3(tutorial.cameraLocation.x,0,0), 1);
	
	// Fade out angle meter
	TweenMax.to(sterngerlach.angleMeter, 1, {
		opacity: 0,
		ease: Power4.easeInOut
	});
	
	var count = 20; // shoot a few atoms
	// Shoot them continuously
	SGE.AnimationManager.timeFactor = 2;
	experiment.events.on(SGE.EVENT_END_EXPERIMENT,function(){
		count--;
		if (count >= 0) {
			SGE.AnimationManager.timeFactor *= 1.5; // speed up
			if (SGE.AnimationManager.timeFactor > 25) SGE.AnimationManager.timeFactor = 25;
			clearTimeout(tutorial.timer);
			tutorial.timer = setTimeout(function(){
				experiment.run();
			}, 50);
			return;
		}
		// Go to next step automatically
		tutorial.part3.step5();
	});
	
	// Run the experiment
	clearTimeout(tutorial.timer);
	tutorial.timer = setTimeout(function(){
		experiment.run();
	}, 1000);
	
	// ------------- For next step
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.step5);
}

// 45° results
tutorial.part3.step5 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	experiment.events.off(SGE.EVENT_END_EXPERIMENT);
	experiment.end();
	clearTimeout(tutorial.timer);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-5'], true);
	
	// ------------- For next step
	// btNext.enabled = true;
	// btNext.events.on(SGE.EVENT_PRESS, tutorial.part3.step6);
}


// Final comparison
// ToDo: how to do thee diagrams? maybe leave it for the course text
tutorial.part3.step6 = function() {
	// ------------- Clean up previous step
	TweenMax.killAll(true);
	btNext.events.off(SGE.EVENT_PRESS);
	btNext.enabled = false;
	// ------------- Current step
	messagebox.setMessage(MESSAGES['3-6'], true);
	
	// Clear canvas overlay
	cvComparison.clear(255,255,255,1.0);
	cvComparison.opacity = 0;
	cvComparison.shadow = 10;
	// Add canvas component to application centered over viewport
	app.add(cvComparison, 10+(viewport.width - cvComparison.width)/2, 10+(viewport.height - cvComparison.height)/2);
	
	// ToDo: animated diagrams
	
	// Fade in opacity and shadow
	TweenMax.to(cvComparison, 1, {
		opacity: 1,
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


