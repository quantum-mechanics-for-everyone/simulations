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
	clocks.setRadius(60);
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
		"<p style=\"font-size:125%\">Welcome to the second tutorial \non the double slit experiment.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> on the right.</p>"
	,
	'intro':
		"We revisit the previous tutorial, but now include what an experimental image would look like.\n\n"+
		"We begin with the top slit only open. You already know what the probability distribution looks like for this case. But what would a real experiment show?\n\n"+
		"We replace the detector from the previous tutorial with a screen. When photons hit that screen, they show up as discrete bright spots.\n\n"+
		"How does the probability distribution we found relate to the distribution of these points?\n\n"+
		"Press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> to shoot a single photon at the screen."
	,
	'first_photon':
		"In real experiments, light comes in discrete packages. The photon acts as a particle.\n\n"+
		"Therefore, in our screen it shows as a single dot, being pointed to by the arrow for clarity.\n\n"+
		"Continue simulating a few more photons by repeatedly pressing the <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> button again."
	,
	'more_photons':
		"The photons appear to be randomly distributed. But let's see what happens when even more photons hit the screen so a pattern will emerge.\n\n"+
		"Repeatedly press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> again to shoot an additional 100 photons."
	,
	'pattern':
		"A pattern emerges!\n\n"+
		"Where the probability distribution is large, more photons hit the screen.\n\n"+
		"Press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to redo the simulation for the case with the bottom slit only being open."
	,
	'other_slit':
		"The same pattern appears for the bottom slit, except shifted downwards. Click on the slits in the center of the wall to compare the two patterns.\n\n"+
		"We'll now investigate the pattern for the double slit. Press <img width=\"76\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to continue."
	,
	'double_slit':
		"Now let's check what the screen looks like for the double slit.\n\n"+
		"Repeatedly press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/> again to shoot an additional 100 photons."
	,
	'compare':
		"The pattern for the double slit emerges in the same way, but has interference fringes in it.  Note how the larger peak at the center results in more photons than the sum of the two peaks for each single slit.\n\n"+
		"Press <img width=\"76\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> to compare all three patterns"
	,
	'complete':
		"To conclude, this tutorial illustrates for you how the photon acts like a particle, but shows wave-like properties when it passes through a screen with two slits. When you combine this with the quantum calculations in the previous tutorial, it provides a rather complete description of this behavior.\n\nThis concludes the tutorial."
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
photonSource.setColor(2);
photonSource.setTitle("Source");
exp.add(photonSource, 30, 200);

var screen1, screen2, screen3;


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
				path.addPoint({x:560, y: exp.height });
				path.updateData(); 
				lightLayer.addPath(path, true);
				// path.clock = clocks.addClock(photonSource.color);
			}
			if (bottom) {
				path = new Engine.LightPath(1);
				path.addPoint(photonSource);
				path.addPoint({x: exp.width/2, y: exp.height/2 + 10*((SLIT_SPACE+1)/2+i) });
				path.addPoint({x:560, y: exp.height });
				path.updateData(); 
				lightLayer.addPath(path, true);
				// path.clock = clocks.addClock(photonSource.color);
			}
	}
	
}

function intro() {
	
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] }, TEXT['welcome']);
	
	
	screen1 = new Engine.ScreenBox("screen1", SCREEN_WIDTH, graph1.height);
	screen2 = new Engine.ScreenBox("screen2", SCREEN_WIDTH, graph1.height);
	screen3 = new Engine.ScreenBox("screen3", SCREEN_WIDTH, graph1.height);
	
	app.add(screen1, exp.x + exp.width-SCREEN_WIDTH, exp.y);
	
	app.showLabelLayer([btNextContainer]);
	
	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btGo.disable();
	btGraph.disable();
}

var photonCount = 0;
function step1() {
	
	app.hideLabelLayer();
	setDefaultLabels();
	btHelp.onPress(function(){ app.toggleLabelLayer([btHelpContainer]) });
	
	msg.setMessage( TEXT['intro'] );
	
	btNextContainer.blinkOff();
	btNext.offPress();
	btGoContainer.blinkOn(true);
	
	btNext.disable();
	btGo.enable();
	
	coverSlits(false, true);
	makePaths(true, false);

	plotProbability(graph1);
	screen1.setDistribution(graph1.distribution);
	
	btGo.onPress(function(){
		shootOnePhoton();
		photonCount++;
		if (photonCount == 1) {
			msg.setMessage( TEXT['first_photon'] );
		}
		if (photonCount == 5) step2();
	});
	
	screen1.blinkOn(true);
	
	plotProbability(graph1);
}

function shootOnePhoton() {
	var p = screen1.detectParticle(true);
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: screen1.x + p.x - 15,
		y: screen1.y + p.y
	},180);
	app.arrowManager.show();
	app.arrowManager.onTop();
}

function shootMorePhotons(screen) {
	var p;
	for(var i = 0; i < 2000; i++) {
		p = screen.detectParticle();
		// if (p.x < 0) i--;
	}
}

function step2() {
	btGo.offPress();
	btGo.disable();
	btGoContainer.blinkOff();
	
	app.arrowManager.clearArrows();
	app.arrowManager.hide();
	
	photonCount = 0;
	btGo.enable(1500);
	setTimeout(function(){ btGoContainer.blinkOn(true); }, 1500);
	
	btGo.onPress(function(){
		shootMorePhotons(screen1);
		photonCount++;
		if (photonCount == 5) step3();
	});
	
	msg.setMessage( TEXT['more_photons'] );
}

function step3() {
	
	btGo.offPress();
	btGo.disable();
	btGoContainer.blinkOff();
	
	msg.setMessage( TEXT['pattern'] );
	
	btNext.enable();
	btNext.onPress(step4);
	btNextContainer.blinkOn(true);
}

var pressTarget, patternToggle = true;
function step4() {
	
	btNextContainer.blinkOff();
	btNext.disable();
	btNext.enable(1500);
	btNext.onPress(step5);
	setTimeout(function(){ btNextContainer.blinkOn(true); },1500);
	
	coverSlits(true, false);
	makePaths(false, true);
	
	graph1.hide();
	screen1.hide();
	screen1.resetBlink();
	
	app.add(graph2, graph1.x, graph1.y);
	app.add(screen2, screen1.x, screen1.y);
	
	plotProbability(graph2);
	screen2.setDistribution(graph2.distribution);
	
	for(var i = 0; i < 5; i++) shootMorePhotons(screen2);
	
	msg.setMessage( TEXT['other_slit'] );
	
	pressTarget = new Engine.PressTarget("slits", 100, 100);
	exp.add(pressTarget, exp.width/2-50, exp.height/2-50);
	pressTarget.setCursor("pointer");
	pressTarget.onPress(togglePatterns);
	
}

function togglePatterns() {
	patternToggle = !patternToggle;
	if (patternToggle) {
		graph1.hide();
		screen1.hide();
		graph2.show();
		screen2.show();
		coverSlits(true, false);
		makePaths(false, true);
	} else {
		graph2.hide();
		screen2.hide();
		graph1.show();
		screen1.show();
		coverSlits(false, true);
		makePaths(true, false);
	}
}

function step5() {
	btNext.disable();
	btNextContainer.blinkOff();
	
	exp.remove(pressTarget);
	
	coverSlits(false, false);
	makePaths(true, true);
	
	graph2.hide();
	screen2.hide();
	screen2.resetBlink();
	
	app.add(graph3, graph2.x, graph2.y);
	app.add(screen3, screen2.x, screen2.y);
	
	plotProbability(graph3);
	screen3.setDistribution(graph3.distribution);
	
	msg.setMessage( TEXT['double_slit'] );
	
	btGo.enable();
	btGoContainer.blinkOn(true);
	photonCount = 0;
	btGo.onPress(function(){
		shootMorePhotons(screen3);
		photonCount++;
		if (photonCount == 5) step6();
	});
	
}

function step6() {
	btGo.offPress();
	btGo.disable();
	btGoContainer.blinkOff();
	
	msg.setMessage( TEXT['compare'] );
	
	btNext.enable();
	btNext.onPress(step7);
	btNextContainer.blinkOn(true);
}

function step7() {
	btNext.offPress();
	btNextContainer.blinkOff();
	
	graph1.show(); screen1.show();
	graph2.show(); screen2.show();
	
	app.add(graph1, app.width/2 - graph2.width/2 - graph2.width*1.8 - msg.width/2, app.height/2 - graph2.height/2, 0);
	app.add(screen1, graph1.x - SCREEN_WIDTH*app.scale, graph1.y, 0);
	
	app.add(graph2, app.width/2 - graph2.width/2 - msg.width/2, app.height/2 - graph2.height/2);
	app.add(screen2, graph2.x - SCREEN_WIDTH*app.scale, graph1.y, 0);
	
	$(graph3.div).animate({ left: (app.width/2 - graph2.width/2 + graph2.width*1.8 - msg.width/2)*app.scale, top: (app.height/2 - graph2.height/2)*app.scale });
	$(screen3.div).animate({ left: (app.width/2 - graph2.width/2 + graph2.width*1.8 - msg.width/2 - SCREEN_WIDTH)*app.scale, top: (app.height/2 - graph2.height/2)*app.scale });
	
	// $(graph3.div).animate({ left: (app.width/2 - graph2.width/2 + graph2.width*1.75 - msg.width/2)*app.scale, top: (app.height/2 - graph2.height/2)*app.scale });
	
	msg.setMessage( TEXT['complete'] );
	
	app.labelManager.clearLabels();
	app.labelManager.addLabel({ at: {x: graph1.x+graph1.width/2 - SCREEN_WIDTH/2, y: graph1.y + graph1.height+50 }, align: [0,0] }, "Top slit");
	app.labelManager.addLabel({ at: {x: graph2.x+graph2.width/2 - SCREEN_WIDTH/2, y: graph2.y + graph2.height+50 }, align: [0,0] }, "Bottom slit");
	app.labelManager.addLabel({ at: {x: app.width/2 - graph2.width/2 + graph2.width*1.75 - msg.width/2 + graph3.width/2 - SCREEN_WIDTH/2, y: graph2.y + graph2.height+50 }, align: [0,0] }, "Both slits");
	app.showLabelLayer([graph1,screen1,graph2,screen2,graph3,screen3,msg]);

}



var usedPos = {};
function plotProbability(graph) {
	graph.clear();
	var a, y;
	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		lightLayer.changePointAllPaths(2, { x: 560, y: y }, true);
		graph.drawBar(y - exp.height/2, Math.pow(lightLayer.getTotalAmplitude().amplitude / (SLIT_SIZE*2),2), photonSource.color);
		usedPos[y] = 1;
	}
}

/* ----------------------------------------- Start -------------------------------------------- */
amps.viewportScale = 2.5;
var SLIT_SIZE = 2;
var SLIT_SPACE = 1;
var SCREEN_WIDTH = 50;
buildWalls();

Engine.C = 150;
Engine.ANIMATION_SPEED = 2.41312;
Engine.FREQUENCY_ADJUST = 1.575;

var lightLayer = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });

intro();
// step1();
// step2();
// step3();
// step4();
// step5();
// step6();
