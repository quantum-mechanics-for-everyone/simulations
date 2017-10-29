// #################################################################################################
// QED Engine tutorials
// Copyright (C) 2015-2016 Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Lucas Vieira (https://github.com/1ucasvb)
//            Dylan Cutler (https://github.com/DCtheTall)
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


/* STANDARD SETUP */
	var clocksBoxHeight = 150; // helps set up overall height

	// Main object definitions
	var app = Engine.create("experiment", 1000, 430 + clocksBoxHeight);
	$(document.body).append(app.div);

	var exp = new Engine.ExperimentBox("exp", 600, 400);
	app.add(exp, 10, 10);

	var graph = new Engine.GraphBox("graph", 120, 400);
	app.add(graph, 620, 10);

	var amps = new Engine.AmplitudeBox("amps", 240, 240);
	var amps2 = new Engine.AmplitudeBox("amps2", 240, 240);
	app.add(amps, 750, 10);

	
	var msg = new Engine.MessageBox("msg", 240, 60 + clocksBoxHeight);
	app.add(msg, 750, 360);

	var clocks = new Engine.ClockBox("clocks", 730, clocksBoxHeight);
	clocks.setRadius(50);
	app.add(clocks, 10, 420);
	
	// Button in containers, necessary to make it above the label overlay
	var btHelpContainer = new Engine.RaphaelPaper("btHelpContainer", 50, 40);
	var btHelp = new Engine.ButtonHelp();
	btHelpContainer.add(btHelp, 0, 0);
	app.add(btHelpContainer, 940, 260);

	var btGoContainer = new Engine.RaphaelPaper("btGoContainer", 50, 40);
	var btGo = new Engine.ButtonGo();
	btGoContainer.add(btGo, 0, 0);
	app.add(btGoContainer, 750, 260);

	var btNextContainer = new Engine.RaphaelPaper("btNextContainer", 120, 40);
	var btNext = new Engine.ButtonNext();
	btNextContainer.add(btNext, 0, 0);
	app.add(btNextContainer, 810, 260);

	// var btGraph = new Engine.ButtonGraph();
	// amps.add(btGraph, amps.width-btGraph.width-5, amps.height-btGraph.height-5);

/* ------------------------------ BEGIN EXPERIMENT ------------------------------ */

var angle = -5;
var distance = 120;

amps.viewportScale = 5;
amps2.viewportScale = 5;

Engine.FREQUENCY_ADJUST = 0.7;

// Source
var photonSource = new Engine.PhotonSource("source", 0, true);

// Detector
var detector = new Engine.Detector("detector", false);

// photonSource.setOpacity(0.5);
// detector.setOpacity(0.5);

Engine.ANIMATION_SPEED = 1;
var spaceBelow = 40;
var glassWidth = 400;
var glassThickness = 10*16;
var glassIOR = 2;

function intro() {
	app.labelManager.addLabel({ at: {x: app.width/2-60, y: app.height/2}, align: [0,0] },
		"<p style=\"font-size:125%\">Welcome to the partial reflection tutorial.\n\n"+
		"Here, we will see what happens when\nlight passes through and reflects off a piece of glass.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/></p>");
	
	app.showLabelLayer([btNextContainer]);
	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btNext.enable();
	
	btHelp.disable();
	btGo.disable();
	
	app.arrowManager.addArrow({
		x: btNextContainer.x - 20,
		y: btNextContainer.y - 20
	},135);
	app.arrowManager.show();
	app.arrowManager.onTop();
}

function step1() {
	btNext.offPress();
	btNext.disable();
	btNextContainer.blinkOff();
	
	app.labelManager.clearLabels();
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] },
		"<p style=\"font-size:125%\">Instructions will be given\nin the instruction box,\non the bottom right."+
		""+
		"</p>"
		);
		
	app.showLabelLayer([msg]);
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: msg.x - 20,
		y: msg.y + msg.height/2
	},180);
	app.arrowManager.onTop();
	
	msg.setMessage(
		"This is the instruction box. Instructions will be shown here, and the box will glow when there's a new instruction.\n\n"+
		"Press in this box to continue.", true);
	
	Engine.addEvent({ source: msg, node: msg.div }, "press", step2);
}
function step2() {
	Engine.removeEvent({ source: msg, node: msg.div }, "press");
	
	msg.setMessage(
		"At the left, we see the experiment window, where the simulations will occur. Right now, it is empty.\n\n"+
		"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to add a source of photons and a detector.");
	
	app.arrowManager.clearArrows();
	app.arrowManager.hide();
	
	btNextContainer.blinkOn(true);
	
	app.hideLabelLayer();
	
	btNext.onPress(step3);
	btNext.enable();

}

function step3() {
	btNextContainer.blinkOff();
	
	exp.add(photonSource,
		exp.width/2 + distance*Math.sin(angle*Engine.DEG2RAD),
		exp.height/2 - distance*Math.cos(angle*Engine.DEG2RAD)
	);
	photonSource.setRotation(90+angle);

	exp.add(detector,
		exp.width/2 + distance*Math.sin((180+angle)*Engine.DEG2RAD),
		exp.height/2 - distance*Math.cos((180+angle)*Engine.DEG2RAD)
	);
	detector.setRotation(90+angle);
	
	msg.setMessage(
		"We re-examine the simplest possible experiment. The event is describes as follows: a photon leaves the source, moves in a straight line, and hits the detector. We consider only one alternative way for the event to occur. The path the photon will take is shown as a straight line.\n\n"+
		"For each path, there will be a clock and an amplitude arrow pointing in the same direction as the clock's hand. The hand starts at 12 o'clock.\n\n"+
		"When the photon is emitted, the arrow has unit length. As the photon moves through the path, the clock will rotate very rapidly according to the color of the light (36,000 revolutions per inch for red light). When the photon interacts with objects, the size of the amplitude arrow may shrink.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to begin the simulation.");
	
	var path = new Engine.LightPath(1);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({ x: detector.x, y: detector.y });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	clocks.setRadius(60);
	path.clock = clocks.addClock(photonSource.color);
	
	path.clock.mockAmplitudeBox = amps;
	amps.drawMockAmplitude(0);
	
	btGoContainer.blinkOn(true);
	
	btNext.disable();
	btGo.enable();
	btGo.onPress(step4);

	
}

function step4() {
	btGoContainer.blinkOff();
	btGo.disable();
	lightLayer.shootAllPhotons(step5);
}

function step5() {
	amps.drawAmplitudes(lightLayer);
	detector.blink();
	
	glowManager.assign({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });
	glowManager.enable();
	
	msg.setMessage(
		"The final position of the clock for this path is represented by an arrow in the amplitude arrows window, on the top right.\n\n"+
		"Pay close attention to the direction and size of this arrow.\n\n"+
		"Now, let's make things more interesting. Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to place the detector inside a thick piece of glass."
	);
	amps.blinkOn(true);
	
	btNext.enable();
	btNext.onPress(step6);
}

function step6() {
	exp.add(new Engine.Glass(glassWidth, glassThickness), exp.width/2-glassWidth/2, exp.height - glassThickness - spaceBelow, true);

	exp.add(new Engine.Marker("Air"), exp.width/2-glassWidth/2, exp.height/2 - 20);
	exp.add(new Engine.Marker("Glass"), exp.width/2-glassWidth/2, exp.height/2 + 20);
	
	amps.blinkOff();
	
	lightLayer.clear();
	clocks.clear();
	app.remove(amps);
	app.add(amps2, 750, 10);
	
	var path;
	path = new Engine.LightPath(1);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({ x: exp.width/2, y: exp.height/2, ior: 2, trigger: function() {
		msg.setMessage(
			"This path leads the photon to hit the surface of the glass before being transmitted through it.\n\n"+
			"Therefore, for this path, we must shrink the amplitude arrow by a factor representing the chance that it does get transmitted, instead of reflected.\n\n"+
			"The arrow shrinks slightly to 98% of its original size, since 0.98&sup2; &asymp; 96%, the chance of transmission. However, this is hard to see.\n\n"+
			"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to continue."
		);
		lightLayer.pauseAnimation();
		btGo.enable();
		btGo.onPress(function(){
			btGo.disable();
			lightLayer.resumeAnimation();
		});
	} });
	path.addPoint({ x: detector.x, y: detector.y });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	path.clock = clocks.addClock(photonSource.color);
	
	msg.setMessage(
		"The photon will take the same path, but inside the glass it will move more slowly. The clock, however, spins at the same rate.\n\n"+
		"How will this affect the final amplitude arrow? Find out by pressing "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" again."
	);
	
	amps2.drawMockAmplitude(0);
	path.clock.mockAmplitudeBox = amps2;
	
	btNext.disable();
	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step7);
	});
}

function step7() {
	amps2.drawAmplitudes(lightLayer);
	detector.blink();
	
	glowManager.assign({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps2 });
	glowManager.enable();
	
	amps2.blinkOn(true);
	msg.setMessage(
		"Now check the new amplitude arrow. How does it compare to the previous one?\n\n"+
		"Keep in mind what happens in the presence of the glass.\n\n"+
		"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to find out if you are right."
	);
	
	btNext.enable();
	btNext.onPress(step8);
}

function step8() {
	btNext.disable();
	
	amps.resetBlink();
	app.add(amps, amps.x, amps.y);
	amps.drawLabel("Without glass")
	app.add(amps, app.width/2 - amps.width/2 - amps.width/2*1.25, app.height/2 - amps.height );
	$(amps.div).hide().fadeIn();
	amps.onTop();
	amps.blinkOn(true);

	amps2.resetBlink();
	$(amps2.div).animate({ left: app.width/2 - amps.width/2 + amps.width/2*1.25, top: app.height/2 - amps.height });
	amps2.drawLabel("With glass");
	amps2.onTop();
	amps2.blinkOn(true);
	
	app.labelManager.clearLabels();
	app.showLabelLayer([amps,amps2,msg]);
	
	msg.setMessage(
		"Now compare both arrows. How are they similar and how are they different?\n\n"+
		"This concludes this tutorial. Please, proceed to the next section of the course."
	);
	
}

function step() { 
	app.labelManager.clearLabels();
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] },
		"<p style=\"font-size:125%\">Welcome to the first interactive tutorial.\n\n"+
		"Here, we will see what happens when\nlight passes through a piece of glass.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/></p>");
		
	exp.add(photonSource,
		exp.width/2 + distance*Math.sin(angle*Engine.DEG2RAD),
		exp.height/2 - distance*Math.cos(angle*Engine.DEG2RAD)
	);
	photonSource.setRotation(90+angle);

	exp.add(detector,
		exp.width/2 + distance*Math.sin((180+angle)*Engine.DEG2RAD),
		exp.height/2 - distance*Math.cos((180+angle)*Engine.DEG2RAD)
	);
	detector.setRotation(90+angle);
	
}

var lightLayer = new Engine.LightLayer(
	Engine.STYLE.Colors[photonSource.color].color,
	Engine.STYLE.Colors[photonSource.color].frequency
);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });


intro();
