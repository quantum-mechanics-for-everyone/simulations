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

	var amps = new Engine.AmplitudeBox("amps", 240, 240);
	app.add(amps, 750, 10);

	var msg = new Engine.MessageBox("msg", 240, 60 + clocksBoxHeight);
	app.add(msg, 750, 360);

	var clocks = new Engine.ClockBox("clocks", 730, clocksBoxHeight);
	clocks.setRadius(30);
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

var TEXT = {
	'welcome':
		"<p style=\"font-size:125%\">Welcome to the first tutorial \non the double slit experiment.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> on the right.</p>"
	,
	'top_slit':
		"First, let's recall what happens when light goes through a single slit.\n\n"+
		"This time, the slit is shifted slightly upward in relation to the photon source. What should the pattern look like in this case?\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to simulate a photon going through the top slit to see what happens."
	,
	'top_probability':
		"Now press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" to see the probability for detecting the photon at this position."
	,
	'top_probability_2':
		"This is the probability of detecting the photon.\n\n"+
		"Try a few other positions, then press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to see the full graph."
	,
	'top_slit_full':
		"This is the probability distribution for the detection of the photon going through the top slit.\n\n"+
		"Drag the detector to see how the probability amplitudes change with position. Are the results what you expected, given what you know from the single slit experiment?\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to see what happens with the bottom slit only open."
	,
	'bottom_slit':
		"Let's try again, this time with the bottom slit unblocked. Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to simulate the photons again.\n\n"+
		"After examining a few more positions, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to plot the full probability distribution."
	,
	'bottom_slit_full':
		"This is the probability distribution for the detection of the photon going through the bottom slit.\n\n"+
		"Drag the detector to see how the probability amplitudes change with position. How are these results related to the top slit? Where is the maximum of the probability curve?\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to try the simulation with both slits open at the same time."
	,
	'two_slits':
		"Finally, we will now try both slits open at once.\n\n"+
		"As before, press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to simulate photons travelling through both slits, at the same time.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/> to find the probability of detection at that position.\n\n"+
		"Repeat until you can guess what the probability distribution looks like. Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to see if you are right."
	,
	'two_slits_full':
		"This is the probability distribution for the case where the photon has two slits to go through.\n\n"+
		"Note how with both slits open, the region behind the barrier in the center, has the highest probability!\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to compare all three distributions."
	,
	'compare':
		"Here are the three distributions you found.\n\n"+
		"Note how the probability curve with both slits open is NOT the sum of the two curves with just one slit open. In fact the maximum is four times larger than the single slit result! And there are regions where the probability goes to zero! The patterns on the left and center are called particle patterns and the one on the right is the wave pattern.\n\n"+
		"This concludes this tutorial."
}

function setDefaultLabels() {
	app.labelManager.clearLabels();
	app.arrowManager.clearArrows();
		
	app.labelManager.addLabel({ at: {x: 10, y: 10}, align: [-1,-1] },
		"<p style=\"font-size:100%\">press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again to exit the help window.</p>");
	
	app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
		"Photon\nsource\nPress to\nchange color");
		
	app.labelManager.addLabel({ at: {x: exp.x + graph1.x, y: exp.y + exp.height/2 }, align: [1,0] },
		"Detecting\nscreen");
		
	app.labelManager.addLabel({ at: {x: clocks.x + clocks.width/2, y: clocks.y + clocks.height/2 }, align: [0,0] },
		"Clock for each path\nMouse over or long tap to highlight an\nindividual path and its respective clock and arrow");
		
	app.labelManager.addLabel({ at: {x: btGoContainer.x + 15, y: btGoContainer.y+25 }, align: [1,1] },
		"Emit\nphoton");
		
	app.labelManager.addLabel({ at: {x: btNextContainer.x + 60, y: btNextContainer.y+25 }, align: [0,1] },
		"Go to\nnext step");
		
	app.labelManager.addLabel({ at: {x: graph1.x+graph1.width/2, y: graph1.y }, align: [0,-1] },
		"Probability\ndistribution");
		
	app.labelManager.addLabel({ at: {x: amps.x+amps.width/2, y: amps.y+20 }, align: [0,-1] },
		"Computation\nwindow with\nprobability\namplitude\narrows");
	
	app.labelManager.addLabel({ at: {x: msg.x+msg.width/2, y: msg.y+msg.height/2 }, align: [0,0] },
		"Instruction box");
		
	app.labelManager.addLabel({ at: { x: exp.width/2, y: exp.height/2 }, align: [0,0] },
		"Double\nslit");
}

// Source
var photonSource = new Engine.PhotonSource("source", 0);
photonSource.setTitle("Source");
exp.add(photonSource, 30, 200);

// Detector rail
var rail = new Engine.Rail(10,360);
exp.add(rail, 560, 20);

// Detector
var detector = new Engine.Detector("detector");
detector.snap = 10;
detector.setTitle("Detector");
exp.add(detector, 560, 200);
detector.setDragBounds([560, 560], [30, 370]);

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
	
	slitWallTop = new Engine.Wall(w, 10*(SLIT_SIZE+1));
	exp.add(slitWallTop, exp.width/2-w/2+w, exp.height/2 - (SLIT_SPACE/2+SLIT_SIZE+1/2)*10);
	
	slitWallBottom = new Engine.Wall(w, 10*(SLIT_SIZE+1));
	exp.add(slitWallBottom, exp.width/2-w/2+w, exp.height/2 + (SLIT_SPACE/2-1/2)*10);
	
	coverSlits(false, false);
}

function clearWalls() {
	exp.remove(wallTop); wallTop = null;
	exp.remove(wallCenter); wallCenter = null;
	exp.remove(wallBottom); wallBottom = null;
	exp.remove(slitWallTop); slitWallTop = null;
	exp.remove(slitWallBottom); slitWallBottom = null;
}

function coverSlits(top, bottom) {
	
	if (top) { slitWallTop.show(); } else { slitWallTop.hide(); }
	if (bottom) { slitWallBottom.show(); } else { slitWallBottom.hide(); }
	
}


function makePaths(top, bottom) {
	
	clocks.clear();
	lightLayer.clear();
	
	for(var i = 0; i < SLIT_SIZE; i++) {
			if (top) {
				path = new Engine.LightPath(1);
				path.addPoint(photonSource);
				path.addPoint({x: exp.width/2, y: exp.height/2 - 10*((SLIT_SPACE+1)/2+i) });
				path.addPoint(detector);
				path.updateData(); 
				lightLayer.addPath(path);
				path.clock = clocks.addClock(photonSource.color);
			}
			if (bottom) {
				path = new Engine.LightPath(1);
				path.addPoint(photonSource);
				path.addPoint({x: exp.width/2, y: exp.height/2 + 10*((SLIT_SPACE+1)/2+i) });
				path.addPoint(detector);
				path.updateData(); 
				lightLayer.addPath(path);
				path.clock = clocks.addClock(photonSource.color);
			}
	}
	
}

function intro() {
	
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] }, TEXT['welcome']);
	
	app.showLabelLayer([btNextContainer]);
	
	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btGo.disable();
	btGraph.disable();
}

function step1() {
	app.hideLabelLayer();
	//setLabels();
	setDefaultLabels();
	btHelp.onPress(function(){ app.toggleLabelLayer([btHelpContainer]) });
	
	msg.setMessage( TEXT['top_slit'] );
	
	btNextContainer.blinkOff();
	btNext.offPress();
	btGoContainer.blinkOn(true);
	
	btNext.disable();
	btGo.enable();
	
	coverSlits(false, true);
	makePaths(true, false);
	
	detector.enableDrag();
	detector.setCursor("ns-resize");
	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
	
	btGo.onPress(function(){
		btGo.disable();
		btGoContainer.blinkOff();
		lightLayer.shootAllPhotons(step2);
		detector.disableDrag();
	});
}

var usedPos = {};
function evDrag(ev) {
	if (lightLayer.lightPaths.length) {
		lightLayer.changePointAllPaths(2, detector);
	}
	if (usedPos[detector.y]) {
		btGo.disable();
		amps.drawAmplitudes(lightLayer);
		amps.showTotalAmplitudeArrow();
		btGraph.enable();
		lightLayer.setFinalState();
	} else {
		btGo.enable();
		btGraph.disable();
	}
}

var btGraphPressed = false;
function step2() {
	btGo.offPress();
	btGo.disable();
	btGraph.enable();
	
	amps.drawAmplitudes(lightLayer);
	
	lightLayer.setFinalState();
	
	btNext.onPress(step3);
	step2_enableBtGraph();
	
	// detector.enableDrag();
	
	msg.setMessage( TEXT['top_probability'] );
	
	
	glowManager.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step2_detect);
		detector.disableDrag();
	});
}
function step2_enableBtGraph() {
	Engine.addEvent({ source: detector, node: detector.container.node }, "firstdrag", evFirstDrag);
	btGraph.onPress(function(){
		if (!btGraphPressed) {
			msg.setMessage( TEXT['top_probability_2'] );
			btGraphPressed = true;
		}
		amps.showTotalAmplitudeArrow();
		graph1.drawBar(
			detector.y - graph1.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2), photonSource.color
		);
		btGraph.onPress(function(){ amps.toggleTotalAmplitudeArrow(); });
		
		detector.enableDrag();
		usedPos[detector.y] = 1;
		btNext.enable();
	});
}
function evFirstDrag() {
	Engine.removeEvent({ source: detector, node: detector.container.node }, "firstdrag");
	amps.clear();
	clocks.reset();
	btGraph.disable();
	btGo.enable();
}
function step2_detect() {
	amps.drawAmplitudes(lightLayer);
	btGraph.enable();
	step2_enableBtGraph();
	detector.enableDrag();
}


function plotProbability(graph) {
	btGo.disable();
	graph.clear();
	var a, y;
	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		lightLayer.changePointAllPaths(2, { x: detector.x, y: y }, true);
		graph.drawBar(y - exp.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2), photonSource.color);
		usedPos[y] = 1;
	}
}

function step3() {
	Engine.log("step3");
	plotProbability(graph1);
	btGraph.disable();
	Engine.removeEvent({ source: detector, node: detector.container.node }, "firstdrag");
	// Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
	btNext.disable();
	btNext.offPress();
	btNext.enable(1000);
	btNext.onPress(step4);
	
	msg.setMessage( TEXT['top_slit_full'] );
}


function step4_enableBtGraph() {
	Engine.addEvent({ source: detector, node: detector.container.node }, "firstdrag", evFirstDrag);
	btGraph.onPress(function(){
		amps.showTotalAmplitudeArrow();
		graph2.drawBar(
			detector.y - graph2.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2), photonSource.color
		);
		btGraph.onPress(function(){ amps.toggleTotalAmplitudeArrow(); });
		
		detector.enableDrag();
		usedPos[detector.y] = 1;
		btNext.enable();
	});
}
function step4_detect() {
	amps.drawAmplitudes(lightLayer);
	btGraph.enable();
	step4_enableBtGraph();
	detector.enableDrag();
}
function step4() {
	msg.setMessage( TEXT['bottom_slit'] );
	
	Engine.log("step4");
	usedPos = {};
	app.remove(graph1);
	app.add(graph2, graph1.x, graph1.y);
	amps.clear();
	makePaths(false,true);
	coverSlits(true,false);
	step4_enableBtGraph();
	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step4_detect);
		detector.disableDrag();
	});
	btNext.disable();
	btNext.offPress();
	btNext.enable(1000);
	btNext.onPress(step5);
}

function step5() {
	Engine.log("step5");
	plotProbability(graph2);
	btNext.disable();
	btNext.enable(1000);
	btNext.onPress(step6);
	msg.setMessage( TEXT['bottom_slit_full'] );
}

function step6_enableBtGraph() {
	Engine.addEvent({ source: detector, node: detector.container.node }, "firstdrag", evFirstDrag);
	btGraph.onPress(function(){
		amps.showTotalAmplitudeArrow();
		graph3.drawBar(
			detector.y - graph3.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2), photonSource.color
		);
		btGraph.onPress(function(){ amps.toggleTotalAmplitudeArrow(); });
		detector.enableDrag();
		usedPos[detector.y] = 1;
		btNext.enable();
	});
	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step6_detect);
		detector.disableDrag();
	});
}
function step6_detect() {
	amps.drawAmplitudes(lightLayer);
	btGraph.enable();
	step6_enableBtGraph();
	detector.enableDrag();
}
function step6() {
	Engine.log("step6");
	app.remove(graph2);
	app.add(graph3, graph1.x, graph1.y);
	step6_enableBtGraph()
	amps.clear();
	btGraph.disable();
	lightLayer.clear();
	makePaths(true,true);
	coverSlits(false,false);
	usedPos = {};
	btNext.disable();
	btNext.enable(1000);
	btNext.onPress(step7);
	msg.setMessage( TEXT['two_slits'] );
}

function step7() {
	msg.setMessage( TEXT['two_slits_full'] );
	plotProbability(graph3);
	btNext.onPress(step8);
}

function step8() {
	msg.setMessage( TEXT['compare'] );
	app.labelManager.clearLabels();
	
	app.add(graph1, app.width/2 - graph2.width/2 - graph2.width*1.75 - msg.width/2, app.height/2 - graph2.height/2, 0);
	app.add(graph2, app.width/2 - graph2.width/2 - msg.width/2, app.height/2 - graph2.height/2);
	$(graph3.div).animate({ left: (app.width/2 - graph2.width/2 + graph2.width*1.75 - msg.width/2)*app.scale, top: (app.height/2 - graph2.height/2)*app.scale });
	
	app.labelManager.addLabel({ at: {x: graph1.x+graph1.width/2, y: graph1.y + graph1.height+50 }, align: [0,0] }, "Top slit");
	app.labelManager.addLabel({ at: {x: graph2.x+graph2.width/2, y: graph2.y + graph2.height+50 }, align: [0,0] }, "Bottom slit");
	app.labelManager.addLabel({ at: {x: app.width/2 - graph2.width/2 + graph2.width*1.75 - msg.width/2 + graph3.width/2, y: graph2.y + graph2.height+50 }, align: [0,0] }, "Both slits");
	
	app.showLabelLayer([graph1,graph2,graph3,msg]);
	// app.add(graph3, app.width/2 + 1.5*graph2.width/2, app.height/2 - graph2.height/2, 0);
	
	graph1.blinkOn(true);
	graph2.blinkOn(true);
	graph3.blinkOn(true);
	msg.blinkOn(true);
}

/* ----------------------------------------- Start -------------------------------------------- */
amps.viewportScale = 2.5;
SLIT_SIZE = 2;
SLIT_SPACE = 1;
buildWalls();

Engine.C = 150;
Engine.ANIMATION_SPEED = 2;
Engine.FREQUENCY_ADJUST = 1.575;

var lightLayer = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });

intro();
// setTimeout(function() {
// step6();
// step8();
// },1000);
