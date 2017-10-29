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


/* STfANDARD SETUP */
	var clocksBoxHeight = 150; // helps set up overall height

	// Main object definitions
	var app = Engine.create("experiment", 1000, 430 + clocksBoxHeight);
	$(document.body).append(app.div);

	var exp = new Engine.ExperimentBox("exp", 600, 400);
	app.add(exp, 10, 10);

	var graph = new Engine.GraphBox("graph", 120, 400, 40);
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
		"<p style=\"font-size:125%\">This interactive tutorial on\nthe concept of normalization\n\n"+
		"To continue, press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/></p>"
	,
	'lens':
		"This tutorial is on the concept of lenses.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to see how a lens works.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL('button_graph.png')+"\"/> to plot the resulting probability distribution.\n\n"+
		"Move the detector to see how the arrows cancel nearly everywhere else. Recall the glass retards the arrows by just the right amount for all clocks to align. This is how the lens focuses."
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

	// app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
	// 	"Photon\nsource\nPress to\nchange color");

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

/* ------ INTRO ---------- */

function intro() {
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] },
		"<p style=\"font-size:125%\">Welcome to the tutorial on converging lenses.\n\n"+
		"We will explore how\na lens focuses light\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/></p>");

	app.showLabelLayer([btNextContainer]);
	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btNext.enable();

	btGraph.disable();

	app.arrowManager.addArrow({
		x: btNextContainer.x - 20,
		y: btNextContainer.y - 20
	},135);
	app.arrowManager.show();
	app.arrowManager.onTop();
}

/* ------- STEP 1 -------- */
function step1() {
	btNextContainer.blinkOff();

	setLabels1();
	app.showLabelLayer([btHelpContainer]);

	// app.arrowManager.addArrow({ x: btHelpContainer.x - 15, y: btHelpContainer - 15 }, 135 );
	// app.arrowManager.show();

	// Go to step 2
	// btHelp.onPress(step2);
	// btHelpContainer.blinkOn(true);

	for (var i = -SLIT_SIZE/2;i <= SLIT_SIZE/2;i+=1) {
		createLightPath(exp.height/2 + 10*i);
	}

	detector.setPosition(560, exp.height/2);
	lightLayer.changePointAllPaths(3, { x: detector.x, y: detector.y }, true);

	glowManager.enable();
	// btGo.disable();
	btGraph.onPress(function(){
		amps.toggleTotalAmplitudeArrow();
		plotProbability();
	});

	step2();
}
// This function creates a path with a point on the slit
// It also creates the associated clock and the associations
function createLightPath(y) {
	//x = h - y² / w²
	var ior = IOR;
	var path = new Engine.LightPath(1);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({
		x: exp.width/2 - LENS_WIDTH/2 + Math.pow((y - exp.height/2)/(SLIT_SIZE+2),2)
		,
		y: y,
		ior: ior
	});
	path.addPoint({
		x: exp.width/2 + LENS_WIDTH/2 - Math.pow((y - exp.height/2)/(SLIT_SIZE+2),2)
		,
		y: y,
		ior: 1
	});
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
		lightLayer.changePointAllPaths(3, { x: detector.x, y: y }, true);
		graph.drawBar(y - exp.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / lightLayer.numPaths(),2), photonSource.color);
	}
	lightLayer.changePointAllPaths(3, detector);
}

/* ------- STEP 2 -------- */
function step2() {
	setDefaultLabels();
	btHelpContainer.blinkOff();
	// btNextContainer.blinkOn(true);
	btNext.disable();
	app.hideLabelLayer();
	btHelp.onPress(function(){
		app.toggleLabelLayer([btHelpContainer]);
	});
	msg.setMessage( TEXT['lens'] );

	// exp.blinkOn(true);
	detector.onTop();
	detector.enableDrag();
	detector.setCursor("ns-resize");
	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
	btGo.enable();
	btGo.onPress(function(){
		detector.disableDrag();
		graph.clear();
		amps.clear();
		lightLayer.shootAllPhotons(function(){
			detector.blink();
			detector.enableDrag();
			amps.drawAmplitudes(lightLayer);
			btGraph.enable();
			// amps.showTotalAmplitudeArrow();
		});
	});
}
function evDrag(ev) {
	lightLayer.changePointAllPaths(3, detector);
	amps.drawAmplitudes(lightLayer);
	amps.showTotalAmplitudeArrow();
	lightLayer.setFinalState();
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
amps.viewportScale = 1;
SLIT_SIZE = 15;
IOR = 1.55;
LENS_WIDTH = 60;
LENS_HEIGHT = (SLIT_SIZE+4)*10

// buildWalls();

Engine.C = 150;
Engine.ANIMATION_SPEED = 0.85;
Engine.FREQUENCY_ADJUST = 2;

var lens = new Engine.Lens(LENS_WIDTH, LENS_HEIGHT);
exp.add(lens, exp.width/2, exp.height/2);

photonSource.setColor(0);
var lightLayer = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });

intro();
