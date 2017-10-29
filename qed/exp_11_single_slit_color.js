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

	var graph = new Engine.GraphBox("graph", 120, 400, 2);
	app.add(graph, 620, 10);

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
		"<p style=\"font-size:125%\">This interactive tutorial is on changing\nthe color of light that\ntravels through a single slit!\n\n"+
		"This time, we explore in a little more\ndetail what happens when light passes\nthrough a large slit, "+
		"and how changing\nthe color of light affects the results\nof the experiment.\n\n"+
		"To continue, press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/></p>"
	,
	'move_detector':
		"We start from a slit with seven alternative ways the photon can go through it.\n\n"+
		"We have filled the entire probability graph for all positions of the detector.\n\n"+
		"Move the detector and study how the probability amplitudes change with the position of the detector.\n\n"+
		"Can you describe in words what happens at the center position and at the ends?\n\n"+
		"When you are done, press <img width=\"63\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"
	,
	'change_color':
		"Now, click on the photon source to change its color.\n\n"+
		"How does the color of the photon affect the shape of the probability distribution?\n\n"+
		"Knowing that the wavelengths &lambda; (Greek letter lambda) of light of each color follow the relation:\n&emsp;<div style=\"text-align:center;font-style:italic;font-size:1em\">&lambda;<sub style=\"color:#F00;font-weight:bold\">RED</sub> > &lambda;<sub style=\"color:#080;font-weight:bold;\">GREEN</sub> > &lambda;<sub style=\"color:#00F;font-weight:bold\">BLUE</sub></div>\n"+
		"Explain in words how the width of the central peak of the probability curve is related to the wavelength of the light.\n\n"+
		//“Recalling the results of the previous tutorial, could you find the same pattern by changing the width of the slit instead of the color of the light?\n\n"+
		"That's it for this tutorial! Please, continue on to the next part of the course."
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

function buildWalls() {
	var a = (SLIT_SIZE+1)*10;
	var h = exp.height/2 - a/2;
	var w = 10;
	exp.add(new Engine.Wall(w,h,5), exp.width/2-w/2, 0);
	exp.add(new Engine.Wall(w,h,5), exp.width/2-w/2, exp.height - h);
}

/* Labels */

function setLabels1() {
	app.labelManager.clearLabels();
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] }, TEXT['welcome'] );
}

function setDefaultLabels() {
	app.labelManager.clearLabels();
	app.arrowManager.clearArrows();
		
	app.labelManager.addLabel({ at: {x: 10, y: 10}, align: [-1,-1] },
		"<p style=\"font-size:100%\">press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again to exit the help window.</p>");
	
	app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
		"Photon\nsource\nPress to\nchange color");
		
	app.labelManager.addLabel({ at: detector, align: [1,0] },
		"Photon\ndetector\nDrag to\nchange\nposition");
		
	app.labelManager.addLabel({ at: {x: clocks.x + clocks.width/2, y: clocks.y + clocks.height/2 }, align: [0,0] },
		"Clock for each path\nMouse over or long tap to highlight an\nindividual path and its respective clock and arrow");
		
	app.labelManager.addLabel({ at: {x: btGoContainer.x + 15, y: btGoContainer.y+25 }, align: [1,1] },
		"Emit\nphoton");
		
	app.labelManager.addLabel({ at: {x: btNextContainer.x + 60, y: btNextContainer.y+25 }, align: [0,1] },
		"Go to\nnext step");
		
	app.labelManager.addLabel({ at: {x: graph.x+graph.width/2, y: graph.y }, align: [0,-1] },
		"Probability\nof photon\ndetection\n(horizontal)\nvs.\nposition of\nthe detector\n(vertical)");
		
	app.labelManager.addLabel({ at: {x: amps.x+amps.width/2, y: amps.y+20 }, align: [0,-1] },
		"Computation\nwindow with\nprobability\namplitude\narrows");
	
	app.labelManager.addLabel({ at: {x: msg.x+msg.width/2, y: msg.y+msg.height/2 }, align: [0,0] },
		"Instruction box");
}

/* Steps */
/* ------- STEP 1 -------- */
function step1() {
	setLabels1();
	app.showLabelLayer([btHelpContainer]);
	
	app.arrowManager.addArrow({ x: btHelpContainer.x - 15, y: btHelpContainer - 15 }, 135 );
	app.arrowManager.show();
	
	// Go to step 2
	btHelp.onPress(step2);
	btHelpContainer.blinkOn(true);
	
	for (var i = -SLIT_SIZE/2;i <= SLIT_SIZE/2;i+=1) {
		createLightPath(exp.height/2 + 10*i);
	}
	plotProbability();
	
	detector.setPosition(560, exp.height/2);
	lightLayer.changePointAllPaths(2, { x: detector.x, y: detector.y }, true);
	
	amps.drawAmplitudes(lightLayer);
	amps.showTotalAmplitudeArrow();
	
	glowManager.enable();
	btGo.disable();
	btGraph.onPress(function(){ amps.toggleTotalAmplitudeArrow(); });
}
// This function creates a path with a point on the slit
// It also creates the associated clock and the associations
function createLightPath(y) {
	var path = new Engine.LightPath(1);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({ x: 300, y: y });
	path.addPoint({ x: detector.x, y: detector.y });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	path.clock = clocks.addClock(photonSource.color);
}

function plotProbability() {
	graph.clear();
	var a, y;
	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		lightLayer.changePointAllPaths(2, { x: detector.x, y: y }, true);
		graph.drawBar(y - exp.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / lightLayer.numPaths(),2), photonSource.color);
	}
	lightLayer.changePointAllPaths(2, detector);
}

/* ------- STEP 2 -------- */
function step2() {
	setDefaultLabels();
	btHelpContainer.blinkOff();
	btNextContainer.blinkOn(true);
	btNext.onPress(step3);
	app.hideLabelLayer();
	btHelp.onPress(function(){
		app.toggleLabelLayer([btHelpContainer]);
	});
	msg.setMessage( TEXT['move_detector'] );
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: detector.x - 10, 
		y: detector.y - 10 
	}, 145);
	
	// exp.blinkOn(true);
	detector.onTop();
	detector.enableDrag();
	detector.setCursor("ns-resize");
	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
	Engine.addEvent({ source: detector, node: detector.container.node }, "startdrag", function(){
		app.arrowManager.clearArrows();
		amps.useTotalAmplitudeLengthText = false;
		if (amps.totalAmplitudeLengthText) amps.totalAmplitudeLengthText.hide();
		// Engine.addEvent({ source: detector, node: document.body }, "enddrag", updateTotalAmplitude);
	});
}
function evDrag(ev) {
	lightLayer.changePointAllPaths(2, detector);
	amps.drawAmplitudes(lightLayer);
	amps.showTotalAmplitudeArrow();
	lightLayer.setFinalState();
}


/* ------- STEP 3 -------- */
function step3() {
	btNextContainer.blinkOff();
	btNext.disable();
	btNext.offPress();
	msg.setMessage( TEXT['change_color'] );
	photonSource.setCursor("pointer");
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: exp.x + photonSource.x + 20,
		y: exp.y + photonSource.y - 35
	},60);
	
	Engine.addEvent({ source: photonSource, node: photonSource.container.node }, "press", changeColor);
}


function changeColor(e) {
	photonSource.setColor(photonSource.color+1);
	lightLayer.setColor(Engine.STYLE.Colors[photonSource.color].color);
	lightLayer.setFrequency(Engine.STYLE.Colors[photonSource.color].frequency);
	lightLayer.drawAll();
	plotProbability();
	clocks.setAllColor(photonSource.color);
	amps.drawAmplitudes(lightLayer);
	amps.showTotalAmplitudeArrow();
	// amps.setTotalAmplitudeColor(photonSource.color);
	lightLayer.setFinalState();
}

/* ----------------------------------------- Start -------------------------------------------- */
amps.viewportScale = 2.5;
SLIT_SIZE = 6;
buildWalls();

Engine.C = 150;
Engine.ANIMATION_SPEED = 1;
Engine.FREQUENCY_ADJUST = 1.2;

photonSource.setColor(2);
var lightLayer = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });

step1();
