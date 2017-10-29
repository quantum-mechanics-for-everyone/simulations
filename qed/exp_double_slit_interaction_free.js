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

var graph = new Engine.GraphBox("graph", 120, 400, 16);
// var graph2 = new Engine.GraphBox("graph2", 120, 400, 4);
// var graph3 = new Engine.GraphBox("graph3", 120, 400, 4);
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
		"<p style=\"font-size:125%\">Welcome to the demonstration of\nan interaction-free measurement\nwith the double-slit experiment.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> on the right.</p>",
	'both_slits_open':
		"To start, let's revisit what the probability distribution looked like when both slits were open without detectors.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> on the right to shoot a photon through both slits.",
	'plot_first_graph':
		"Now press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/> to see the probability distribution when both slits are open.",
	'interference-patten':
		"If both slits are open, the probability distribution is an interference pattern.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to continue.",
	'drag-detector':
		"Now drag the detector to one of the places where the interference pattern is at a minimum.",
	'zero-probabilty':
		"As you can see in the window in the upper right, the probability of detecting a photon here is very small. "+
		"It is practically zero. If our detector was placed here, we would not expect to detect any photons. Even if "+
		"we shoot a large number of them.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to continue.",
	'slit-covered':
		"Now we are going to cover one of the slits.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> on the right to shoot a photon through the open slit.",
	'plot-at-detector-location':
		"Now press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/> on the right to see the probability of detecting a "+
		"photon at that location.",
	'no-longer-zero':
		"As you can see on the right, the probability of detecting a photon when we cover one slit is no longer zero at this location.\n\n"+
		"Why do you think this is the case?\n\n"+
		"If we shoot a large number of photons through the open slit, would we expect to detect a photon where the detector is now?\n\n"+
		"How frequently?\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to continue.",
	'screen-added':
		"We have added a screen to the experiment. We are going to see if we can detect a photon at the detector's current location.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> on the right to start shooting photons at the screen. The photon counter on "+
		"the left will keep track of how many photons have left the source.",
	'detected-photon':
		"We detected a photon at the detector's location!\n\n"+
		"We already know that if both slits were open, this would not happen. When we see a photon at the detector's location, we learn that one of the slits is blocked, "+
		"even though the photon never interacted with the wall covering the slit.\n\n"+
		"This type of measurement is called <i>quantum seeing in the dark</i>, or <i>interaction free measurement</i>. We are using the properties of quantum "+
		"systems to take measurements without interacting with what we are looking at.\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> again to shoot the photons at the screen again. That way you can verify "+
		"that the source shoots a random number of photons before we see one at the detector's location. You can try it as many times as you would like.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to continue on to the next step.",
	'not-very-accurate':
		"" // Written in step 11, I need to wait until I know how many photons were needed for the screen
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

// Walls
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

function setDefaultLabels() {
	app.labelManager.clearLabels();
	app.arrowManager.clearArrows();

	app.labelManager.addLabel({ at: {x: 10, y: 10}, align: [-1,-1] },
		"<p style=\"font-size:100%\">press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again to exit the help window.</p>");

	app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
		"Photon\nsource\nPress to\nchange color");

	app.labelManager.addLabel({ at: {x: exp.x + graph.x, y: exp.y + exp.height/2 }, align: [1,0] },
		"Detecting\nscreen");

	app.labelManager.addLabel({ at: {x: clocks.x + clocks.width/2, y: clocks.y + clocks.height/2 }, align: [0,0] },
		"Clock for each path\nMouse over or long tap to highlight an\nindividual path and its respective clock and arrow");

	app.labelManager.addLabel({ at: {x: btGoContainer.x + 15, y: btGoContainer.y+25 }, align: [1,1] },
		"Emit\nphoton");

	app.labelManager.addLabel({ at: {x: btNextContainer.x + 60, y: btNextContainer.y+25 }, align: [0,1] },
		"Go to\nnext step");

	app.labelManager.addLabel({ at: {x: graph.x+graph.width/2, y: graph.y }, align: [0,-1] },
		"Probability\ndistribution");

	app.labelManager.addLabel({ at: {x: amps.x+amps.width/2, y: amps.y+20 }, align: [0,-1] },
		"Computation\nwindow with\nprobability\namplitude\narrows");

	app.labelManager.addLabel({ at: {x: msg.x+msg.width/2, y: msg.y+msg.height/2 }, align: [0,0] },
		"Instruction box");

	app.labelManager.addLabel({ at: { x: exp.width/2, y: exp.height/2 }, align: [0,0] },
		"Double\nslit");
}

function intro() {

	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] }, TEXT['welcome']);

	app.showLabelLayer([btNextContainer]);

	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btGo.disable();
	btGraph.disable();
}
//--------------- Step 1 ---------------//

function step1() {
	app.hideLabelLayer();
	setDefaultLabels();
	btHelp.onPress(function(){ app.toggleLabelLayer([btHelpContainer]) });

	msg.setMessage( TEXT['both_slits_open'] );

	btNextContainer.blinkOff();
	btNext.offPress();

	btGoContainer.blinkOn(true);

	btNext.disable();
	btGo.enable();

	makePaths(true, true);

	detector.enableDrag();
	detector.setCursor("ns-resize");
	Engine.addEvent( { source: detector, node: detector.container.node }, "moved", evDrag);

	btGo.onPress(function() {
		btGo.disable();
		btGoContainer.blinkOff();
		lightLayer.shootAllPhotons(step2);
		detector.disableDrag();
		detector.setCursor("default");
	})
}

var usedPos = {};
function evDrag(ev) {
	if (lightLayer.lightPaths.length) {
		lightLayer.changePointAllPaths(2, detector);
	}
	if (usedPos[detector.y]) {
		btGo.disable();
		with(amps) {
			drawAmplitudes(lightLayer);
			showTotalAmplitudeArrow();
			clearProbabilityText();
			// drawProbabilityText();
		}
		// btGraph.enable();
		lightLayer.setFinalState();
	} else {
		btGo.enable();
		btGraph.disable();
	}
	if (checkDrag) {
		lightLayer.changePointAllPaths(2, detector);
		if (detector.y == detectorIndicator1.y || detector.y == detectorIndicator2.y) {
			step5();
			if(detector.y == detectorIndicator1.y) bottomMinimum = true;
			else topMinimum = true;
		}
	}
}

//--------------- Step 2 ---------------//

function step2() {
	btGo.offPress();
	btGo.disable();
	btGraph.enable();

	detector.blink();

	amps.drawAmplitudes(lightLayer);

	lightLayer.setFinalState();

	step2_enableBtGraph();

	msg.setMessage( TEXT['plot_first_graph'] );

	glowManager.enable();
}
function step2_enableBtGraph() {
	Engine.addEvent({ source: detector, node: detector.container.node }, "firstdrag", evFirstDrag);
	btGraph.onPress(step3);
}
function evFirstDrag() {
	Engine.removeEvent({ source: detector, node: detector.container.node }, "firstdrag");
	amps.clear();
	clocks.reset();
	btGraph.disable();
}

//--------------- Step 3 ---------------//

function step3() {
	amps.showTotalAmplitudeArrow();
	// amps.drawProbabilityText();
	plotProbability(graph);

	detector.enableDrag();
	detector.setCursor('ns-resize');

	msg.setMessage( TEXT['interference-patten'] );

	btGraph.disable();
	btNext.enable();
	btNext.onPress(step4);
}
function plotProbability(graph) {
	btGo.disable();
	btGraph.disable();
	graph.clear();
	var a, y;
	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		lightLayer.changePointAllPaths(2, { x: detector.x, y: y }, true);
		graph.drawBar(y - exp.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2), photonSource.color);
		usedPos[y] = 1;
	}
}

//--------------- Step 4 ---------------//

var detectorIndicator1 = new Engine.Detector("detectorIndicator");
detectorIndicator1.setTitle("Move detector here");

var detectorIndicator2 = new Engine.Detector("detectorIndicator");
detectorIndicator2 .setTitle("Move detector here");

var checkDrag = false;
function step4() {
	with(btNext) {
		offPress();
		disable();
	}

	exp.add(detectorIndicator1, 560, 290);
	with($(detectorIndicator1.container.node)) {
		hide();
		fadeTo(500, 0.5);
	}

	exp.add(detectorIndicator2, 560, 110);
	with($(detectorIndicator2.container.node)) {
		hide();
		fadeTo(500, 0.5);
	}

	exp.blinkOn(true);
	detector.onTop();
	detector.enableDrag();
	detector.setCursor("ns-resize");

	msg.setMessage( TEXT['drag-detector'] );

	checkDrag = true;
}

//--------------- Step 5 ---------------//

function step5() { // Called in function evDrag
	checkDrag = false;

	exp.blinkOff();
	$(detectorIndicator1.container.node).hide();
	$(detectorIndicator2.container.node).hide();
	exp.remove(detectorIndicator1); delete detectorIndicator1;
	exp.remove(detectorIndicator2); delete detectorIndicator2;

	detector.disableDrag();
	detector.setCursor('default');

	msg.setMessage( TEXT['zero-probabilty'] );

	amps.blinkOn(true);

	with(btNext) {
		enable();
		onPress(step6)
	}
}

//--------------- Step 6 ---------------//

var topMinimum = false;
var bottomMinimum = false;
function step6() {
	amps.blinkOff();
	amps.clear();
	amps.clearProbabilityText();

	graph.clear();

	lightLayer.clear();

	btNext.offPress();
	btNext.disable();

	if(topMinimum) {
		coverSlits(false, true);
		makePaths(true, false);
	}
	else if(bottomMinimum) {
		coverSlits(true, false);
		makePaths(false, true);
	}

	msg.setMessage( TEXT['slit-covered'] );

	btGo.enable();
	btGoContainer.blinkOn(true);
	btGo.onPress(function() {
		btGo.disable();
		btGoContainer.blinkOff();
		lightLayer.shootAllPhotons(step7);
	});
}

//--------------- Step 7 ---------------//

function step7() {
	detector.blink();

	msg.setMessage( TEXT['plot-at-detector-location'] );

	amps.drawAmplitudes(lightLayer);

	btGraph.enable();
	btGraph.onPress(function() {
		btGraph.disable();
		step8();
	})
}

//--------------- Step 8 ---------------//

function step8() {
	amps.showTotalAmplitudeArrow();
	// amps.drawProbabilityText();
	amps.blinkOn(true);

	var y = detector.y - exp.height/2;
	graph.drawBar(y, 0.91/4, photonSource.color);
	graph.blinkOn(true);

	msg.setMessage( TEXT['no-longer-zero'] );

	btNext.enable();
	btNext.onPress(step9);
}

//--------------- Step 9 ---------------//

var SCREEN_WIDTH = 50;
var screen = new Engine.ScreenBox("screen", SCREEN_WIDTH, graph.height);

var photoCounter = new Engine.PhotonCounter("counter", 70, 50);

function step9() {
	amps.blinkOff();
	graph.blinkOff();

	btNext.offPress();
	btNext.disable();

	app.add(screen, graph.x - SCREEN_WIDTH*app.scale + 122*app.scale, graph.y, 0);
	app.add(photoCounter, 30, 110, 0);
	app.add(photoCounter.label, 15, 82, 0);

	determineDistribution();

	lightLayer.clear();

	msg.setMessage( TEXT['screen-added'] );

	photoCounter.blinkOn(true);
	screen.blinkOn(true);

	btGo.enable();
	btGoContainer.blinkOn(true);
	btGo.onPress(function() {
		btGoContainer.blinkOff();
		btGo.offPress();

		screen.blinkOff();
		photoCounter.blinkOff();

		setTimeout(function() { shootPhoton(step10) }, 1000);
	});
}

// Sending the probability distribution info to the screen object
function determineDistribution() {
	graph.clear();
	plotProbability(graph);

	screen.setDistribution(graph.distribution);

	graph.clear();
	var y = detector.y - exp.height/2;
	graph.drawBar(y, 0.91/4, photonSource.color);
}

function shootPhoton(callback) { if(!callback) callback = function() {};
	photoCounter.inc();
	if(photoCounter.value > 75) {
		brightenDot({
			x: Math.random() * screen.width,
			y: Math.random() * screen.height
		});
		detector.blink();
		setTimeout(step10, 500);
		return;
	}
	var p = screen.detectParticle(true);
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: screen.x + p.x - 15,
		y: screen.y + p.y
	},180);
	app.arrowManager.show();
	app.arrowManager.onTop();

	if(p.y > (detector.y - 7.5) && p.y < (detector.y + 7.5)) {
		brightenDot(p);
		detector.blink();
		setTimeout(callback, 500);
	}
	else setTimeout(function() { shootPhoton(callback) }, 1000);
}

function brightenDot(p) {
	var x = p.x * screen.scale;
	var y = p.y * screen.scale;

	var context = screen.canvas.getContext('2d');
	with(context) {
		fillStyle = Engine.STYLE.BigDot;
		arc(x, y, Engine.STYLE.BigDotSize, 0, 2*Math.PI, false);
		fill();
	}
}

//--------------- Step 10 ---------------//

function step10() {
	msg.setMessage( TEXT['detected-photon'] );

	btNext.enable();
	btNext.onPress(step11);

	btGo.onPress(function() {
		photoCounter.reset();
		app.arrowManager.clearArrows();
		screen.clear();
		setTimeout(function() { shootPhoton() }, 1000);
	});
}

//--------------- Step 11 ---------------//

function step11() {
	btGo.disable();
	btNext.disable();
	btNext.offPress();

	/* Since all JS objects are passed by value, I need to define this part of the
	text in this step, so that photonCount does not return 0 (which is what it was assgined
	when it was initialized) */
	TEXT['not-very-accurate'] =
		"As you already noticed, it took multiple photons before we know whether both slits are open or not. The last time you shot photons at the screen, it took "+ photoCounter.value +", but it could take hundreds.\n\n"+
		"This is because even when one slit is covered, the probability of detecting a photon at the detector's location is still very small, as shown above.\n\n"+
		"Later on in the course, we will explore different ways we can achieve <i>quantum seeing in the dark</i> more efficiently.\n\n"+
		"This concludes this tutorial.";

	msg.setMessage( TEXT['not-very-accurate'] );

	amps.blinkOn(true);
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
