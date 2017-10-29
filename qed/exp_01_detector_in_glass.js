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

	var graph = new Engine.GraphBox("graph", 120, 400, 100);
	app.add(graph, 620, 10);

	var amps = new Engine.AmplitudeBox("amps", 240, 240);
	app.add(amps, 750, 10);
	amps.drawLabel("Detector B");

	var msg = new Engine.MessageBox("msg", 240, 60 + clocksBoxHeight + 50);
	app.add(msg, 750, 360-50);

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

	var btGraph = new Engine.ButtonGraph();
	amps.add(btGraph, amps.width-btGraph.width-5, amps.height-btGraph.height-5);

/* ------------------------------ BEGIN EXPERIMENT ------------------------------ */

var angle = -10;

amps.viewportScale = 8;

Engine.FREQUENCY_ADJUST = 0.7;

// Source
var photonSource = new Engine.PhotonSource("source", 0, true);

// Detector
var detectorA = new Engine.Detector("detectorA", false);
var markerA;

var detectorB = new Engine.Detector("detectorB", false);

var markerB;
var glass;
var markerGlass;

// photonSource.setOpacity(0.5);
// detector.setOpacity(0.5);

Engine.ANIMATION_SPEED = 1;
var spaceBelow = 0;
var glassWidth = 400;
var glassThickness = 20*10;
var glassIOR = 1.5;

function intro() {
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] },
		"<p style=\"font-size:125%\">Welcome to the next partial reflection tutorial.\n\n"+
		"We will explore how to compute\nthe probability of detecting\nlight inside a piece of glass.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/></p>");

	graph.coverTopHalf();

	app.showLabelLayer([btNextContainer]);
	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btNext.enable();

	btHelp.disable();
	btGo.disable();
	btGraph.disable();

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

	exp.add(photonSource,
		exp.width/2 + 120*Math.sin(angle*Engine.DEG2RAD),
		exp.height/2 - 120*Math.cos(angle*Engine.DEG2RAD)
	);
	photonSource.setRotation(90+angle);
	exp.add(new Engine.Marker("Photon\nsource"), photonSource.x-100, photonSource.y-10);

	// exp.add(detectorA,
		// exp.width/2 + distance*Math.sin((180+angle)*Engine.DEG2RAD) + 4,
		// exp.height/2 - distance*Math.cos(Engine.DEG2RAD) + 4
	// );
	// detectorA.setRotation(-90-angle);
	// exp.add(new Engine.Marker("Detector A"), detectorA.x+25, detectorA.y);

	exp.add(detectorB,
		exp.width/2 + 170*Math.sin((180+angle)*Engine.DEG2RAD),
		exp.height/2 - 170*Math.cos((180+angle)*Engine.DEG2RAD)
	);

	detectorB.setRotation(90+angle);
	glass = new Engine.Glass(glassWidth, glassThickness);
	markerB = new Engine.Marker("Detector B");

	exp.add(glass, exp.width/2-glassWidth/2, exp.height - glassThickness);
	exp.add(markerB, detectorB.x+25, detectorB.y);

	exp.add(new Engine.Marker("Air"), exp.width/2-glassWidth/2, exp.height/2 - 20);

	markerGlass = new Engine.Marker("Glass");
	exp.add(markerGlass, exp.width/2-glassWidth/2, exp.height - 20);

	msg.setMessage(
		"Let us consider a detector inside the glass. A path must be created for each way an event can occur.\n\n"+
		"For the event of the photon reaching detector B, we consider the path when light is transmitted through the glass.\n\n"+
		"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to create this path.");

	app.arrowManager.clearArrows();
	app.arrowManager.hide();
	app.hideLabelLayer();

	helpLabels();
	btHelp.enable()
	btHelp.onPress(function(){ app.toggleLabelLayer([btHelpContainer]); });
	btNext.onPress(step2);
	btNext.enable(500);
}
function step2() {
	var path;

	// Reflected
	// path = new Engine.LightPath(0.25);
	// path.addPoint({ x: photonSource.x, y: photonSource.y });
	// path.addPoint({ x: exp.width/2, y: exp.height/2, invert: true });
	// path.addPoint({ x: detectorA.x, y: detectorA.y, trigger: function() { detectorA.blink(); } });
	// path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	// lightLayer.addPath(path);
	// clocks.setRadius(60);
	// path.clock = clocks.addClock(photonSource.color);
	// exp.add(new Engine.Marker("Reflected\npath"), exp.width/2+20, exp.height/2 - 50);

	// Transmitted
	path = new Engine.LightPath(Math.sqrt(0.96));
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({
		x: exp.width/2 + (exp.height/2 - glassThickness)*Math.sin(-Engine.DEG2RAD*angle),
		y: exp.height - glassThickness,
		// x: exp.width/2,
		// y: exp.height/2,
		ior: glassIOR, trigger: function() {
		lightLayer.pauseAnimation();
		btGo.enable();
		btGo.onPress(function(){ lightLayer.resumeAnimation(); btGo.disable(); });

		msg.setMessage(
			"The photon has reached the surface of the glass.\n\n"+
			"At this point, it can be either reflected or transmitted. Recall that the probability of being transmitted into glass is 96%. This means we shrink the amplitude arrow to "+"<img src=\""+Engine.assetURL("sqrt_0.96.png")+"\"/>"+" its original size. (Remember, the probability is the <i>square</i> of the amplitude arrow's length!)\n\n"+
			"By our rules, we do not flip the arrow if the photon is transmitted.\n\n"+
			"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to resume the animation.");


	} });
	path.addPoint({ x: detectorB.x, y: detectorB.y, trigger: function() { detectorB.blink(); } });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	clocks.setRadius(60);
	path.clock = clocks.addClock(photonSource.color);
	exp.add(new Engine.Marker("Transmitted\npath"), exp.width/2+10, exp.height/2);

	msg.setMessage(
		"We will consider one path for now, shown as a red line.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to simulate the event.");

	btNext.offPress();
	btNext.disable();
	btNextContainer.blinkOff();
	btGoContainer.blinkOn(true);
	btGo.onPress(function(){
		btGo.disable();
		btGoContainer.blinkOff();
		lightLayer.shootAllPhotons(step3);
	});
	btGo.enable();
}

function step3() {
	amps.drawAmplitudes(lightLayer);
	glowManager.enable();

	msg.setMessage(
		"The photon was detected. The length of the amplitude arrow for this event is slightly smaller than the unit arrow due to the shrinkage, and points in a given direction.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" to see the total probability of the event occurring."
	);

	btGraph.enable();
	btGraph.onPress(function(){
		amps.toggleTotalAmplitudeArrow();
		amps.drawProbabilityText();
		msg.setMessage(
			"The probability is the square of the size of the final arrow. Since there's only one arrow, the total probability is simply the same arrow again.\n\n"+
			"This value of 96% is recorded in the graph area on the left. What happens if we change the thickness of the glass?\n\n"+
			"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to continue."
		);
		btNext.enable();
		btGraph.disable();
		btNext.onPress(step4);
		btNextContainer.blinkOn(true);
		var y = exp.height/2 - glassThickness;
		graph.drawBar(y, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);
	});
}
function step4() {
	btGraph.disable();
	btNext.disable();
	btNextContainer.blinkOff();
	amps.clearProbabilityText();
	amps.clear();

	glassThickness = 10*10;
	exp.remove(glass);
	glass = new Engine.Glass(glassWidth, glassThickness);
	exp.add(glass, exp.width/2-glassWidth/2, exp.height - glassThickness);
	markerB.onTop();
	markerGlass.onTop();

	lightLayer.getPath(0).changePoint(1,{
		x: exp.width/2 + (exp.height/2 - glassThickness)*Math.sin(-Engine.DEG2RAD*angle),
		y: exp.height - glassThickness
	});

	msg.setMessage(
		"We changed the thickness to half the previous size. Can you predict what will happen?\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to run the simulation again."
	);

	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step5);
	});
}
function step5() {
	amps.drawAmplitudes(lightLayer);

	msg.setMessage(
		"Now press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" again to find the total amplitude arrow and probability."
	);

	btGraph.enable();
	btGraph.onPress(function(){
		amps.toggleTotalAmplitudeArrow();
		amps.drawProbabilityText();
		btGraph.disable();
		var y = exp.height/2 - glassThickness;
		graph.drawBar(y, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);

		msg.setMessage(
			"The probability remains unchanged in this case. Let us try changing the thickness again.\n\n"+
			"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to continue."
		);

		btNext.enable();
		btNext.onPress(step6);
	});

}
function step6() {
	btGraph.disable();
	btNext.disable();
	btNextContainer.blinkOff();
	amps.clearProbabilityText();
	amps.clear();

	glassThickness = 10*6;
	exp.remove(glass);
	glass = new Engine.Glass(glassWidth, glassThickness);
	exp.add(glass, exp.width/2-glassWidth/2, exp.height - glassThickness);
	markerB.onTop();
	markerGlass.onTop();

	lightLayer.getPath(0).changePoint(1,{
		x: exp.width/2 + (exp.height/2 - glassThickness)*Math.sin(-Engine.DEG2RAD*angle),
		y: exp.height - glassThickness
	});

	msg.setMessage(
		"We once again changed the thickness of the glass. Will the probability remain the same or change?\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to run the simulation again."
	);
	btNext.disable();
	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step7);
	});
}
function step7() {
	amps.drawAmplitudes(lightLayer);
	msg.setMessage(
		"Now press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" again to find the total amplitude arrow and probability."
	);
	btGraph.enable();
	btGraph.onPress(function(){
		amps.toggleTotalAmplitudeArrow();
		amps.drawProbabilityText();


		for(var y = exp.height/2-200;y <= (exp.height/2-60);y+=10) {
			//var y = exp.height/2 - glassThickness;
			graph.drawBar(y, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);
		}

		msg.setMessage(
			"The probability is the same for <i>any</i> thickness of the glass, as shown on the left.\n\n"+
			"The only thing that has changed is the direction of the arrows due to different times for the photon to reach the detector.\n\n"+
			"This concludes this tutorial. Please, continue with the next element of the module."
		);

		btGraph.onPress(function(){ amps.toggleTotalAmplitudeArrow(); });
	});



	btNext.disable();
	btGo.disable();
}

function helpLabels() {
	app.labelManager.clearLabels();

	app.labelManager.addLabel({ at: {x: exp.x+exp.width/2, y: exp.y+exp.height/2}, align: [0,0] },
		"Experiment window");


	app.labelManager.addLabel({ at: {x: 10, y: 10}, align: [-1,-1] },
		"<p style=\"font-size:100%\">press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again to exit the help window.</p>");

	app.labelManager.addLabel({ at: {x: clocks.x + clocks.width/2, y: clocks.y + clocks.height/2 }, align: [0,0] },
		"Clock for each path\nMouse over or long tap to highlight an\nindividual path and its respective clock and arrow");

	app.labelManager.addLabel({ at: {x: btGoContainer.x + 15, y: btGoContainer.y+25 }, align: [1,1] },
		"Emit\nphoton");

	app.labelManager.addLabel({ at: {x: btNextContainer.x + 60, y: btNextContainer.y+25 }, align: [0,0] },
		"Go to\nnext step");

	app.labelManager.addLabel({ at: {x: amps.x + btGraph.x + 60, y: amps.y + btGraph.y+25 }, align: [0,1] },
		"View final\narrow");

	app.labelManager.addLabel({ at: {x: amps.x+amps.width/2, y: amps.y+20 }, align: [0,-1] },
		"Computation\nwindow with\nprobability\namplitude\narrows");

	app.labelManager.addLabel({ at: {x: msg.x+msg.width/2, y: msg.y+msg.height/2 }, align: [0,0] },
		"Instruction box");
}

var lightLayer = new Engine.LightLayer(
	Engine.STYLE.Colors[photonSource.color].color,
	Engine.STYLE.Colors[photonSource.color].frequency
);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });

intro();
