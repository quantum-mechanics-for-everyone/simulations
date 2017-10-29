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
// Tutorial 2.01: The Einstein-Podolsky-Rosen Paradox
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
		"Welcome to the interactive tutorial on the EPR experiment. In this tutorial we'll explore an experiment with deep implications for our interpretation of quantum mechanics.",
		"To continue, press "+btNext.textVersion
	],
	
	// Part 1
	'1-0': [
		"<strong>Part 1: Pairs of Atoms</strong>",
		"The results we've seen so far forced us to make conclusions such as:",
		"<em style=\"margin:0 1em;display:block\">An atom with a definite state in the "+SGE.Symbols.Z+" direction doesn't have a definite state in the "+SGE.Symbols.X+" direction.</em>",
		"<em style=\"margin:0 1em;display:block\">All that can be said is that when the state in the "+SGE.Symbols.X+" direction is measured, there is an equal probability 1/2 of finding the atom in the "+SGE.Symbols.PLUS+" or "+SGE.Symbols.MINUS+" state.</em>",
		"However, we may still be tempted to adopt an alternative classical interpretation, such as:",
		"<em style=\"margin:0 1em;display:block\"><strong>Alternative 1</strong>: An atom with a definite state in the "+SGE.Symbols.Z+" direction also has a definite state in the "+SGE.Symbols.X+" direction, but the measurement in "+SGE.Symbols.Z+" disturbs the state in "+SGE.Symbols.X+".</em>",
		"or even",
		"<em style=\"margin:0 1em;display:block\"><strong>Alternative 2</strong>: An atom with a definite state in the "+SGE.Symbols.Z+" direction also has a definite state in the "+SGE.Symbols.X+" direction, but it changes so rapidly that no one can figure out what it is.</em>",
		"We will now show how these two alternatives cannot be correct.",
		"Press "+btNext.textVersion+" to continue."
	],
	'1-1': [
		"In order to test these alternative interpretations, we need to come up with an experiment that can tell us if they are incorrect.",
		"This is what Einstein, Podolsky and Rosen had in mind when they made the arguments we'll describe now.",
		"First, we'll need a new special type of source of atoms, a source that releases not one but <em>two</em> atoms simultaneously.",
		"Press "+btNext.textVersion+" to bring this new source into our experiment."
	],
	'1-2': [
		"This is a source of pairs of atoms. As you can see, the atoms always come out in pairs and go in opposite directions with the same speed.",
		"Just as with the normal source, we don't know in advance the state of these atoms. We must measure them first.",
		"However, we also know these pairs of atoms have a very special property: their magnetic arrows must <em>always</em> cancel out, that is, they always point in opposite directions.",
		"The details of how these pairs of atoms are produced are not important. Just keep in mind that something similar can be achieved in practice in several ways.",
		"Let's test this out. Press "+btNext.textVersion+" to bring two analyzers and a few detectors into the experiment."
	],
	'1-3': [
		"We're now measuring the states of both atoms at the same time. The "+SGE.Symbols.PLUS+" and "+SGE.Symbols.MINUS+" icons appearing above the source tell us the state in which each atom was found.",
		"As you can see, the result of the measurements are random, just as before, and each atom has an equal likelihood of being in either state.",
		"However, the <em>pair</em> of atoms can never be found in the same state at the same time. If one atom is found to be in the "+SGE.Symbols.PLUS+" state, the other must be in the "+SGE.Symbols.MINUS+" state.",
		"In this case, we say the atoms are <em>entangled</em>: they are not independent from each other.",
		"Now that we have seen how these atoms work, let us see how this challenges the classical interpretations we mentioned earlier.",
		//" We can say the <em>pair of atoms</em> has two possible states:","
		//"<span style=\"display:block;text-align:center\">("+SGE.Symbols.PLUS+SGE.Symbols.MINUS+") or ("+SGE.Symbols.MINUS+SGE.Symbols.PLUS+")</span>",
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Part 2
	'2-0': [
		"<strong>Part 2: The Einstein-Podolsky-Rosen (EPR) Argument</strong>",
		"The existence of pairs of particles behaving like we just saw led Einstein, Podolsky and Rosen to propose the following thought experiment. Let's suppose the first alternative we mentioned previously is correct. To recall:",
		"<em style=\"margin:0 1em;display:block\"><strong>Alternative 1</strong>: An atom with a definite state in the "+SGE.Symbols.Z+" direction also has a definite state in the "+SGE.Symbols.X+" direction, but the measurement in "+SGE.Symbols.Z+" disturbs the state in "+SGE.Symbols.X+".</em>",
		"If this is true, then we must conclude that measurement of one atom must also disturb the other atom, since they are always found in opposite states. Some form of influence at a distance must be occurring.",
		"Let us then imagine we have the same setup as above, but we now increase the distance between the analyzers and the source. We'll also move analyzer R to be just a little bit  further away from the source than analyzer L, so that both measurements occur almost at the same time.",
		"Press "+btNext.textVersion+" to move the analyzers away from the source."
	],
	'2-1': [
		"The analyzers are now a larger distance away from each other. In practice this distance can be many miles apart, and such experiments have been performed. Analyzer L a little bit closer than analyzer R, so it will detect its atom first.",
		"Now, according to Einstein's Special Theory of Relativity nothing can travel faster than the speed of light. This principle, called <em>locality</em>, tells us that the influence of one atom on the other cannot occur instantaneously, and must be delayed due to the distance between the analyzers.",
		"Since the analyzers are almost at the same distance from the source, there shouldn't be enough time for the atom on the left to influence the atom on the right.",
		"Given this fact and the alternative explanation for how these atoms work, what do you think would happen if we performed the same experiment as before?",
		"Make a prediction then press "+btGo.textVersion+" to test it."
	],
	'2-2': [
		"Even with a large distance separating the analyzers we see the same results as before: we always find one atom in the opposite state as the other. How can this be?",
		"If the measurement of one atom influences the other, then this result suggests some sort of information is being transferred between the atoms faster than the speed of light, violating <em>locality</em>!",
		"And remember, we could have made this distance as large as we wanted and the results would have been the same.",
		"Press "+btNext.textVersion+" to continue."
	],
	'2-3': [
		"We know we cannot predict the state of the atoms before measuring them. But the instant the state of the atom on the left is found, an observer on the left will know the state of the atom on the right, many miles away, even if it hasn't even been measured yet.",
		"This result seem to suggest a way of communicating faster than the speed of light. But a closer inspection shows us that this is not the case.",
		"The important thing consider is not whether \"the state of atom on the right is known\", but rather \"<em>who</em> knows the state of the atom on the right\".",
		"It is true, someone standing next to analyzer L has that information, but they cannot tell someone next to analyzer R unless they transmit that information along some traditional, slower-than-light method.", 
		"This result is certainly strange (Einstein called it \"spooky\"), but it does not allow for instantaneous communication.", 
		"Press "+btNext.textVersion+" to continue."
	],
	
	// Conclusion
	'end': [
		"<strong>Conclusion</strong>",
		"The results we've shown here have also been found by several real experiments. This means the first alternative explanation for quantum mechanics cannot be true, and atoms simply cannot have a definite state in two directions at the same time.",
		"But that's not the whole story. If we assume <em>locality</em> is true, as we have, then we could still explain these results if we assumed the atoms had some sort of \"secret plan\" as they left the source, a set of <em>hidden instructions</em> of what they should do in advance that makes their behavior unpredictable to us, but still coordinated.",
		"Is there a way to test this idea? It turns out there is, and this is what we'll cover in the next tutorial.",
		"This concludes this tutorial. Please, proceed to the next section of the course."
	]
}

// #################################################################################################
// Tutorial steps

// Experiment elements

// Experiment
var experiment = new SGE.Experiment(); // main experiment
// Speed up atoms
experiment.atomSpeed = 5;

// Source
var source = experiment.source;
source.sourceType = SGE.SOURCE_TYPE_ENTANGLED;

// Detectors
var detectorR1 = new SGE.Detector();
var detectorR2 = new SGE.Detector();
var detectorL1 = new SGE.Detector();
var detectorL2 = new SGE.Detector();
detectorR1.spacing = 2;
detectorR2.spacing = 2;
detectorL1.spacing = 2;
detectorL2.spacing = 2;

// Custom "ignore" targets
var ignoreR = new SGE.Ignore();
var ignoreL = new SGE.Ignore();
ignoreR.silent = true;
ignoreL.silent = true;

// Analyzers
var analyzerR = new SGE.Analyzer();
var analyzerL = new SGE.Analyzer();
analyzerL.spacing = 2;
analyzerR.spacing = 2;
analyzerL.label.position.set(-0.5, -3, 0);
analyzerR.label.position.set(+0.5, -3, 0);
analyzerL.label.text = "Analyzer L";
analyzerR.label.text = "Analyzer R";
analyzerL.label.size = 0.9;
analyzerR.label.size = 0.9;

// Dynamic sprites
var STATE_OFFSET = 0; // x offset of state sprites relative to analyzers
var stateL = new SGE.Primitives.DynamicSprite({
	'plus':  "sprite_plus.png",
	'minus': "sprite_minus.png"
});
var stateR = new SGE.Primitives.DynamicSprite({
	'plus':  "sprite_plus.png",
	'minus': "sprite_minus.png"
});

// Camera
var camera = viewport.camera;
camera.focusOn(new THREE.Vector3(0, 0, 0));
camera.z = 1;
camera.theta = SGE.TAU/4;
camera.phi = SGE.TAU*0.2;
camera.rho = 5;

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
	}, 2500);
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
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.intro);
}

// -------------------------------------------------------------------------------------------------
// Part 1 - Entanglement
tutorial.part1 = {};

// Recap, talk about alternatives
tutorial.part1.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	btNext.blinkOff();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step1);
}

// Mention entangled source
tutorial.part1.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-1'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step2);
}

// Bring entangled source
tutorial.part1.step2 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-2'], true);
	viewport.addExperiment(experiment);
	
	experiment.position.y = 4;
	TweenMax.to(experiment.position, 2, {
		y: 0,
		ease: Power4.easeInOut
	});
	
	ignoreR.spacing = 5;
	ignoreL.spacing = 5;
	source.attach(ignoreR, SGE.IO_RIGHT);
	source.attach(ignoreL, SGE.IO_LEFT);
	
	tutorial.timer = setTimeout( tutorial.startContinuousRun, 2000 );
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part1.step3);
}

// Bring in analyzers
tutorial.part1.step3 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['1-3'], true);
	viewport.addExperiment(experiment);
	
	ignoreR.detach();
	ignoreL.detach();
	source.attach(analyzerR, SGE.IO_RIGHT);
	source.attach(analyzerL, SGE.IO_LEFT);
	analyzerR.spacing = 12;
	analyzerL.spacing = 12;
	
	analyzerR.attach(detectorR1, SGE.IO_TOP);
	analyzerR.attach(detectorR2, SGE.IO_BOTTOM);
	analyzerL.attach(detectorL1, SGE.IO_TOP);
	analyzerL.attach(detectorL2, SGE.IO_BOTTOM);
	detectorR1.spacing = 6;
	detectorR2.spacing = 6;
	detectorL1.spacing = 6;
	detectorL2.spacing = 6;
	
	TweenMax.to([analyzerR, analyzerL], 2, {
		spacing: 2,
		ease: Power4.easeInOut,
		onComplete: function() {
			stateL.position.x = analyzerL.position.x + STATE_OFFSET;
			stateR.position.x = analyzerR.position.x - STATE_OFFSET;
		}
	});
	TweenMax.to([detectorR1, detectorR2, detectorL1, detectorL2], 2, {
		spacing: 1,
		delay: 1,
		ease: Power4.easeInOut
	});
	TweenMax.to(camera, 1, {
		rho: 10,
		ease: Power2.easeInOut
	});
	TweenMax.to(experiment.position, 1, {
		y: -1.5,
		ease: Power2.easeInOut
	});
	TweenMax.to([analyzerL.label, analyzerR.label], 1, {
		opacity: 1,
		delay: 2
	});
	
	viewport.add(stateL);
	viewport.add(stateR);
	stateL.position.y = 2;
	stateR.position.y = 2;
	stateL.size = 2.5;
	stateR.size = 2.5;
	
	detectorR1.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateR.state = "plus";
	});
	detectorR2.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateR.state = "minus";
	});
	detectorL1.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateL.state = "plus";
	});
	detectorL2.events.on(SGE.EVENT_DETECT_PARTICLE, function(){
		stateL.state = "minus";
	});
	
	experiment.events.on(SGE.EVENT_BEGIN_EXPERIMENT, function() {
		stateL.state = null;
		stateR.state = null;
	});
	
	tutorial.timer = setTimeout( tutorial.startContinuousRun, 3000 );
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.intro);
}


// -------------------------------------------------------------------------------------------------
// Part 2 - Entanglement
tutorial.part2 = {};

// Talk about far away analyzers
tutorial.part2.intro = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	stateL.state = null;
	stateR.state = null;
	tutorial.stopContinuousRun();
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-0'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step1);
}

// Move analyzers far away
// Distance markers
tutorial.part2.step1 = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-1'], true);
	
	var d1 = 10;
	var d2 = 12;
	
	var pos = {x: 1, y: 0, z: 18};
	TweenMax.to(camera, 2, {
		x: pos.x,
		y: pos.y,
		z: pos.z,
		ease: Power2.easeInOut
	});
	camera.moveFocusTo(new THREE.Vector3( pos.x, 0, 0 ), 2);
	TweenMax.to(analyzerL, 2, {
		spacing: d1,
		ease: Power2.easeInOut
	});
	TweenMax.to(analyzerR, 2, {
		spacing: d2,
		ease: Power2.easeInOut
	});
	
	// ------------- For next step
	btGo.enabled = true;
	btGo.events.on(SGE.EVENT_PRESS, tutorial.part2.step2);
}

// Start experiment
tutorial.part2.step2 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-2'], true);
	
	stateL.position.x = analyzerL.position.x + STATE_OFFSET;
	stateR.position.x = analyzerR.position.x - STATE_OFFSET;
	
	experiment.atomSpeed = 10;
	tutorial.startContinuousRun();
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.part2.step3);
}

// Analysis, leave it running
tutorial.part2.step3 = function() {
	// ------------- Clean up previous step
	btGo.enabled = false;
	btGo.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	// ------------- Current step
	messagebox.setMessage(MESSAGES['2-3'], true);
	
	// ------------- For next step
	btNext.enabled = true;
	btNext.events.on(SGE.EVENT_PRESS, tutorial.conclusion);
}


// End tutorial, conclusions
tutorial.conclusion = function() {
	// ------------- Clean up previous step
	btNext.enabled = false;
	btNext.events.off(SGE.EVENT_PRESS);
	TweenMax.killAll(true);
	tutorial.stopContinuousRun();
	stateL.state = null;
	stateR.state = null;
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


