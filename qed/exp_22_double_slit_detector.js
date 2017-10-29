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

	var graph1 = new Engine.GraphBox("graph1", 120, 400, 4);
	var graph2 = new Engine.GraphBox("graph2", 120, 400, 4);
	var graph3 = new Engine.GraphBox("graph3", 120, 400, 4);
	app.add(graph1, 620, 10);

	var amps1 = new Engine.AmplitudeBox("amps1", 240, 120);
	app.add(amps1, 750, 10);
	amps1.drawLabel("A and D go off");

	var amps2 = new Engine.AmplitudeBox("amps2", 240, 120);
	app.add(amps2, 750, 10+120);
	amps2.drawLabel("B and D go off");

	var msg = new Engine.MessageBox("msg", 240, 60 + clocksBoxHeight);
	app.add(msg, 750, 360);

	var clocks1 = new Engine.ClockBox("clocks1", 730/2-5, clocksBoxHeight);
	clocks1.setRadius(60);
	app.add(clocks1, 10, 420);

	var clocks2 = new Engine.ClockBox("clocks2", 730/2-5, clocksBoxHeight);
	clocks2.setRadius(60);
	app.add(clocks2, 10+730/2+10, 420);

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
	amps2.add(btGraph, amps2.width-btGraph.width-5, amps2.height-btGraph.height-5);

/* ------------------------------ BEGIN EXPERIMENT ------------------------------ */

var TEXT = {
	'welcome':
		"<p style=\"font-size:125%\">Welcome to the third tutorial \non the double slit experiment.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> on the right.</p>"
	,
	'intro':
		"We placed two more detectors, one at each slit. These detectors are perfect: a photon never passes by them undetected. This completely changes the situation!\n\n"+
		"Now, we have two events:\n\n"+
			"1. A <b>and</b> D go off (register a photon)\n"+
			"2. B <b>and</b> D go off (register a photon)\n\n"+
		"Experimentally, one finds that detectors A and B <b>never</b> go off (register a photon) at the same time, so we only have these two events.\n\n"+
		"We need to determine the alternative ways each event can occur. We will describe the experiments with two alternative ways for each event.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to create these paths that show the alternative ways for each event."
	,
	'paths':
		"We have created partial paths that go towards each slit. The two possible events share this part of the calculation.\n\n"+
		"Notice that we have two sets of clocks and amplitude arrows this time, one for each of the events.\n\n"+
		"But let's see what happens if we shoot a photon.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to shoot the photon."
	,
	'detected_top':
		"The photon was detected at the top slit. This must mean the paths that go through the bottom slit have to be ignored, as the photon is definitely at the top.\n\n"+
		"Therefore, we remove the bottom slit paths from our computation of this event.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to continue."
	,
	'event_top':
		"The photon is detected by detector D. So this is our complete event: detectors A and D go off.\n\n"+
		"All the possible paths for this event must be considered, and we must add all the amplitude arrows for each path, as before. This is shown in the topmost amplitude arrow box.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/> to see the probability distribution for this event."
	,
	'probability_top':
		"The probability distribution for the event \"A and D go off\" is the same as if the bottom slit was covered, as in the previous tutorials.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to see the same for the other event."
	,
	'probability_bottom':
		"The probability for the event \"B and D go off\" is the same as if the top slit was covered.\n\n"+
		"In general, we do not know which event will occur <i>a priori</i>. So what would we see if we assume both events are equally likely?\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to find out."
	,
	'total_probability':
		"The total probability of detector D going off, from either event, is the sum of the probabilities (and <b>not</b> total amplitudes) of either event. You can see how the different arrows evolve by sliding the detector as before, except now there are two events to see.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to compare these probability distributions."
	,
	'conclusion':
		"As you can see, the interference pattern seen in the previous double slit experiment is completely gone!\n\n"+
		"The photons are now acting like a particle, and the different paths don't interact, instead, we simply sum the particle patterns together to get the total probability.\n\n"+
		"This concludes this tutorial."
}

function setDefaultLabels() {
	app.labelManager.clearLabels();
	app.arrowManager.clearArrows();

	app.labelManager.addLabel({ at: {x: 10, y: 10}, align: [-1,-1] },
		"<p style=\"font-size:100%\">press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again to exit the help window.</p>");

	app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
		"Photon\nsource\nPress to\nchange color");

	app.labelManager.addLabel({ at: detectorA, align: [1,0] },
		"Detector A");

	app.labelManager.addLabel({ at: detectorB, align: [1,0] },
		"Detector B");

	app.labelManager.addLabel({ at: detector, align: [1,0] },
		"Detector D");

	app.labelManager.addLabel({ at: {x: clocks1.x + clocks1.width/2, y: clocks1.y + clocks1.height/2 }, align: [0,0] },
		"Clocks for top paths\n (Detectors A and D)");
	app.labelManager.addLabel({ at: {x: clocks2.x + clocks2.width/2, y: clocks2.y + clocks2.height/2 }, align: [0,0] },
		"Clocks for bottom paths\n (Detectors B and D)");

	app.labelManager.addLabel({ at: {x: btGoContainer.x + 15, y: btGoContainer.y+25 }, align: [1,1] },
		"Emit\nphoton");

	app.labelManager.addLabel({ at: {x: btNextContainer.x + 60, y: btNextContainer.y+25 }, align: [0,1] },
		"Go to\nnext step");

	app.labelManager.addLabel({ at: {x: graph1.x+graph1.width/2, y: graph1.y }, align: [0,-1] },
		"Probability\ndistribution");

	app.labelManager.addLabel({ at: {x: amps1.x+amps1.width/2, y: amps1.y+20 }, align: [0,-1] },
		"Computation\nwindow with\nprobability\namplitude\narrows");

	app.labelManager.addLabel({ at: {x: msg.x+msg.width/2, y: msg.y+msg.height/2 }, align: [0,0] },
		"Instruction box");

	app.labelManager.addLabel({ at: { x: exp.width/2, y: exp.height/2 }, align: [0,0] },
		"Double\nslit");
}

var wallTop, wallCenter, wallBottom;
var slitWallTop, slitWallBottom;
function buildWalls() {
	var a = (SLIT_SIZE+1)*10;
	var w = 10;

	wallTop = new Engine.Wall(w, (20-(SLIT_SPACE+1)/2-SLIT_SIZE)*10 + 5, 0);
	exp.add(wallTop, exp.width/2-w/2, 0);

	wallCenter = new Engine.Wall(w,10*(SLIT_SPACE),0);
	exp.add(wallCenter, exp.width/2-w/2, exp.height/2 - 10*(SLIT_SPACE)/2);

	wallBottom = new Engine.Wall(w, (20-(SLIT_SPACE+1)/2-SLIT_SIZE+1)*10 , 0);
	exp.add(wallBottom, exp.width/2-w/2, exp.height/2 + (SLIT_SIZE+(SLIT_SPACE+1)/2)*10 - 5);
}

function clearWalls() {
	exp.remove(wallTop); wallTop = null;
	exp.remove(wallCenter); wallCenter = null;
	exp.remove(wallBottom); wallBottom = null;
}



function makePaths() {

	clocks1.clear();
	clocks2.clear();
	lightLayerSlits.clear();
	lightLayerTop.clear();
	lightLayerBottom.clear();

	for(var i = 0; i < SLIT_SIZE; i++) {
		path = new Engine.LightPath(1);
		path.addPoint(photonSource);
		path.addPoint({x: exp.width/2, y: exp.height/2 - 10*((SLIT_SPACE+1)/2+i), trigger: function() { lightLayerTop.pauseAnimation(); } });
		path.addPoint(detector);
		path.updateData();
		lightLayerTop.addPath(path);
		path.clock = clocks1.addClock(photonSource.color);

		path = new Engine.LightPath(1);
		path.addPoint(photonSource);
		path.addPoint({x: exp.width/2, y: exp.height/2 + 10*((SLIT_SPACE+1)/2+i), trigger: function() { lightLayerBottom.pauseAnimation(); } });
		path.addPoint(detector);
		path.updateData();
		lightLayerBottom.addPath(path);
		path.clock = clocks2.addClock(photonSource.color);

		// To the slits
		path = new Engine.LightPath(1);
		path.addPoint(photonSource);
		path.addPoint({x: exp.width/2, y: exp.height/2 - 10*((SLIT_SPACE+1)/2+i) });
		path.updateData();
		lightLayerSlits.addPath(path);

		path = new Engine.LightPath(1);
		path.addPoint(photonSource);
		path.addPoint({x: exp.width/2, y: exp.height/2 + 10*((SLIT_SPACE+1)/2+i) });
		path.updateData();
		lightLayerSlits.addPath(path);

	}

}

var usedPos = {};
function plotTotalProbability() {
	graph3.clear();
	var a, y;
	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		lightLayerTop.changePointAllPaths(2, { x: 560, y: y }, true);
		lightLayerBottom.changePointAllPaths(2, { x: 560, y: y }, true);
		graph3.drawBar(y - exp.height/2,
			Math.pow(lightLayerTop.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2)
			+
			Math.pow(lightLayerBottom.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2)
		, photonSource.color);
		usedPos[y] = 1;
	}
}


function plotProbability(layer, graph) {
	graph.clear();
	var a, y;
	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		layer.changePointAllPaths(2, { x: 560, y: y }, true);
		graph.drawBar(y - exp.height/2, Math.pow(
			(layer.getTotalAmplitude().amplitude) / (SLIT_SIZE*2),2), photonSource.color);
		usedPos[y] = 1;
	}
}

function intro() {

	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] }, TEXT['welcome']);

	app.showLabelLayer([btNextContainer]);

	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btGo.disable();
	btGraph.disable();

	// plotProbability(graph1);
}

function step1() {
	btGo.disable();
	btGraph.disable();

	app.hideLabelLayer();
	setDefaultLabels();
	btHelp.onPress(function(){ app.toggleLabelLayer([btHelpContainer]) });

	// setLabels();

	msg.setMessage( TEXT['intro'] );

	btNext.disable();
	btNextContainer.blinkOff();
	btNext.enable(1000);
	btNext.onPress(step2);

	setTimeout(function(){ btNextContainer.blinkOn(true); }, 1000);
}


function step2() {
	makePaths();
	msg.setMessage( TEXT['paths'] );
	btNextContainer.blinkOff();

	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);

	btNext.disable();
	btGoContainer.blinkOn(true);
	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		btGoContainer.blinkOff();
		detector.disableDrag();
		detector.setCursor("default");
		lightLayerSlits.show();
		lightLayerBottom.hide();
		lightLayerTop.hide();
		amps1.clear();
		amps2.clear();
		lightLayerSlits.shootAllPhotons(step3);
		lightLayerTop.shootAllPhotons(step4);
		lightLayerBottom.shootAllPhotons();
	});
}

function step3() {
	detectAtSlits(0);
	msg.setMessage( TEXT['detected_top'] );
	btGo.enable();
	btGoContainer.blinkOn(true);
	btGo.onPress(function() {
		btGo.disable();
		btGoContainer.blinkOff();
		lightLayerTop.resumeAnimation();
	});
}

function step4() {
	detector.blink();
	amps1.drawAmplitudes(lightLayerTop);
	msg.setMessage( TEXT['event_top'] );
	glowManager1.enable();
	btGraph.enable();

	btGraph.onPress(function(){
		plotProbability(lightLayerTop, graph1);
		amps1.showTotalAmplitudeArrow();
		btGraph.onPress(function(){
			amps1.toggleTotalAmplitudeArrow();
		});
		step5();
	});
}

function step5() {
	msg.setMessage( TEXT["probability_top"] );
	detector.enableDrag();
	detector.setCursor("ns-resize");
	showAmplitudes.top = true;
	showAmplitudes.bottom = false;

	btNextContainer.blinkOn(true);
	btNext.onPress(step6);
	btNext.enable();
}

function step6() {
	showAmplitudes.top = false;
	showAmplitudes.bottom = true;
	btNext.disable();
	btNextContainer.blinkOff();
	clocks1.blinkOff();
	clocks2.blinkOn(true);
	amps1.blinkOff();
	amps2.blinkOn(true);
	clocks1.clear();
	for(var i = 0; i < lightLayerBottom.numPaths(); i++) lightLayerBottom.getPath(i).clock = clocks2.addClock(photonSource.color);
	amps2.onTop();
	lightLayerBottom.setFinalState();
	lightLayerTop.hide();
	lightLayerBottom.show();
	amps2.drawAmplitudes(lightLayerBottom);
	amps1.clear();
	amps2.showTotalAmplitudeArrow();
	glowManager2.enable();
	app.add(graph2, graph1.x, graph1.y);
	graph1.hide();
	plotProbability(lightLayerBottom, graph2);
	btGraph.onPress(function(){
		amps2.toggleTotalAmplitudeArrow();
	});
	msg.setMessage( TEXT['probability_bottom'] );

	btNext.enable(1000);
	setTimeout(function(){ btNextContainer.blinkOn(true); }, 1000);

	btNext.onPress(step7);
}

function step7() {
	btNext.disable();
	btNextContainer.blinkOff();
	amps1.showTotalAmplitudeArrow();
	amps2.showTotalAmplitudeArrow();
	btGraph.onPress(function(){
		amps1.toggleTotalAmplitudeArrow();
		amps2.toggleTotalAmplitudeArrow();
	});
	clocks1.blinkOff();
	clocks2.blinkOff();
	amps1.blinkOff();
	amps2.blinkOff();
	showAmplitudes.top = true;
	showAmplitudes.bottom = true;
	clocks1.clear();
	clocks2.clear();
	for(var i = 0; i < lightLayerBottom.numPaths(); i++) {
		lightLayerTop.getPath(i).clock = clocks1.addClock(photonSource.color);
		lightLayerBottom.getPath(i).clock = clocks2.addClock(photonSource.color);
	}
	amps1.clear();
	amps2.clear();
	amps1.drawAmplitudes(lightLayerTop);
	amps2.drawAmplitudes(lightLayerBottom);
	amps1.toggleTotalAmplitudeArrow();
	amps2.toggleTotalAmplitudeArrow();
	lightLayerTop.setFinalState();
	lightLayerBottom.setFinalState();
	glowManager1.enable();
	glowManager2.enable();
	lightLayerTop.show();
	lightLayerBottom.show();
	plotTotalProbability();
	app.add(graph3, graph1.x, graph1.y);
	graph2.hide();
	msg.setMessage( TEXT['total_probability'] );
	btNext.onPress(step8)
	btNext.enable(1000);
	setTimeout(function(){ btNextContainer.blinkOn(true); }, 1000);
	btNextContainer.blinkOn(true);
}

function step8() {
	btGraph.disable();
	btGoContainer.blinkOff();
	btGraph.disable();

	graph1.show();
	graph2.show();

	app.add(graph1, app.width/2 - graph2.width/2 - graph2.width*1.8 - msg.width/2, app.height/2 - graph2.height/2, 0);
	app.add(graph2, app.width/2 - graph2.width/2 - msg.width/2, app.height/2 - graph2.height/2);
	$(graph3.div).animate({ left: (app.width/2 - graph2.width/2 + graph2.width*1.8 - msg.width/2)*app.scale, top: (app.height/2 - graph2.height/2)*app.scale });

	app.labelManager.clearLabels();
	app.labelManager.addLabel({ at: {x: graph1.x+graph1.width/2, y: graph1.y + graph1.height+50 }, align: [0,0] }, "A and D");
	app.labelManager.addLabel({ at: {x: graph2.x+graph2.width/2, y: graph2.y + graph2.height+50 }, align: [0,0] }, "B and D");
	app.labelManager.addLabel({ at: {x: app.width/2 - graph2.width/2 + graph2.width*1.75 - msg.width/2 + graph3.width/2, y: graph2.y + graph2.height+50 }, align: [0,0] }, "A and D\nor\nB and D");
	app.showLabelLayer([graph1,graph2,graph3,msg]);

	msg.setMessage( TEXT['conclusion'] );
}

function detectAtSlits(s) {
	if (!s) {
		lightLayerSlits.hide();
		lightLayerBottom.hide();
		lightLayerTop.show();
		detectorA.blink();
		clocks2.clear();
		clocks1.blinkOn(true);
		clocks2.blinkOff();
		amps1.blinkOn(true);
		amps2.blinkOff();
		amps1.onTop();
	} else {
		lightLayerSlits.hide();
		lightLayerTop.hide();
		lightLayerBottom.show();
		detectorB.blink();
		clocks1.clear();
		clocks2.blinkOn(true);
		clocks1.blinkOff();
		amps2.blinkOn(true);
		amps1.blinkOff();
		amps2.onTop();
	}
}

var showAmplitudes = {top: false, bottom: false};
function evDrag(ev) {
	if (lightLayerTop.numPaths() && lightLayerBottom.numPaths()) {
		lightLayerTop.changePointAllPaths(2, detector);
		lightLayerBottom.changePointAllPaths(2, detector);
	}

	if (showAmplitudes.top) {
		lightLayerTop.setFinalState();
		amps1.drawAmplitudes(lightLayerTop);
		amps1.toggleTotalAmplitudeArrow();
		lightLayerTop.setFinalState();
	}
	if (showAmplitudes.bottom) {
		lightLayerBottom.setFinalState();
		amps2.drawAmplitudes(lightLayerBottom);
		amps2.toggleTotalAmplitudeArrow();
		lightLayerBottom.setFinalState();
	}

		// btGraph.enable();


}


/* ----------------------------------------- Start -------------------------------------------- */
amps1.viewportScale = 2.5;
amps2.viewportScale = 2.5;
var SLIT_SIZE = 2;
var SLIT_SPACE = 1;
var SCREEN_WIDTH = 50;
buildWalls();

// Source
var photonSource = new Engine.PhotonSource("source", 0);
photonSource.setColor(2);
photonSource.setTitle("Source");
exp.add(photonSource, 30, 200);

var screen1, screen2, screen3;

// Detectors
var detectorA = new Engine.Detector("detectorA", false);
var markerA = new Engine.Marker("A");

var detectorB = new Engine.Detector("detectorB", false);
var markerB = new Engine.Marker("B");

// Detector rail
var rail = new Engine.Rail(10,360);
exp.add(rail, 560, 20);

// Main detector
var detector = new Engine.Detector("detector");
detector.snap = 10;
detector.setTitle("detector");
exp.add(detector, 560, 200);
detector.setDragBounds([560, 560], [30, 370]);
// var markerD = new Engine.Marker("D");


exp.add(detectorA, exp.width/2, exp.height/2-50);
exp.add(detectorB, exp.width/2, exp.height/2+50);
detectorA.setRotation(-80);
detectorB.setRotation(80);
exp.add(markerA, detectorA.x-50, detectorA.y-10);
exp.add(markerB, detectorB.x-50, detectorB.y+10);
// exp.add(markerD, detector.x-30, detector.y-35);

Engine.C = 150;
Engine.ANIMATION_SPEED = 2.11312;
Engine.FREQUENCY_ADJUST = 1.575;

var lightLayerSlits = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
var lightLayerTop = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
var lightLayerBottom = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
exp.addLightLayer(lightLayerSlits);

// Initialize light layers but hide them
exp.addLightLayer(lightLayerTop);
lightLayerTop.hide();
exp.addLightLayer(lightLayerBottom);
lightLayerBottom.hide();

var glowManager1 = new Engine.GlowManager({ 'paths': lightLayerTop, 'clocks': clocks1, 'amplitudes': amps1 });
var glowManager2 = new Engine.GlowManager({ 'paths': lightLayerBottom, 'clocks': clocks2, 'amplitudes': amps2 });

intro();
// step1();
// step2();
// step3();
// step4();
// step5();
// step6();
// },1000);
