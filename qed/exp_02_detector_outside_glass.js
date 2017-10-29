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

	var graph = new Engine.GraphBox("graph", 120, 400, 20);
	app.add(graph, 620, 10);

	var amps = new Engine.AmplitudeBox("amps", 240, 240);
	app.add(amps, 750, 10);
	amps.drawLabel("Detector A");

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

//New buttons to replace the knob//

	var btThinContainer = new Engine.RaphaelPaper("btThinContainer", 40, 60);
	var btThin = new Engine.ButtonGlassThin();
	btThinContainer.add(btThin, 0, 0);
	app.add(btThinContainer, 540, 220);

	var btThickContainer = new Engine.RaphaelPaper("btThickContainer", 40, 60);
	var btThick = new Engine.ButtonGlassThick();
	btThickContainer.add(btThick, 0, 0);
	app.add(btThickContainer, 540, 340);

	btThick.hidden(); btThin.hidden();


//—//

/* ------------------------------ BEGIN EXPERIMENT ------------------------------ */

var TEXT = {
	'welcome':
		"<p style=\"font-size:125%\">In this next interactive tutorial,\n"+
		"We will explore how to compute\nthe probability for detecting\nlight reflecting off of a piece of glass.\n\n"+
		"To begin, press <img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/></p>"
	,
	'intro_instructions':
		"Begin with a photon detector outside the glass. The event we will consider is that a photon leaves the monochromatic source and is detected in the detector. Again, a path must be created for each way this event can occur.\n\n"+
		"For now, we will consider only the path where the photon is reflected from the top surface of the glass. Note that this is not the only way the event can occur, but we consider only this one path first.\n\n"+
		"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to create this path."
	,
	'we_will_consider':
		"This one path is shown as a red line reflecting off the top surface.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to simulate the event. Follow the quantum rules carefully for each step the photon takes along the path."
	,
	'first_surface':
		"The photon has reached the top surface of the glass.\n\n"+
			"At this point, it can be either reflected or transmitted. We shrink the amplitude arrow based on the probability of reflection which is 4%, so we shrink by 0.2 (since 0.2<sup>2</sup>=0.04).\n\n"+
			"By our rules, we must also rotate the clock hand by 180 degrees when the photon is reflected from the outside of the glass.\n\n"+
			"Pay close attention to the clock on the left to see this happening once you continue.\n\n"+
			"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to resume the animation."
	,
	'first_detection':
		"The photon is detected. The length of the amplitude arrow for this event is much smaller than the unit arrow (it is equal to 0.2), since most photons transmit through the glass.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" to see the total probability of the event occurring."
	,
	'first_probability':
		"The probability is the square of the size of the final arrow.\n\n"+
			"This value of 4% is recorded in the graph area on the left. What happens if we consider another path?\n\n"+
			"Press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to continue."
	,
	'top_surface':
		"The photon has reached the top surface of the glass.\n\n"+
		"At this point, it can be either reflected or transmitted. For the first path, we shrink the amplitude arrow by 0.2.\n\n"+
		"By our rules, we must also rotate the clock hand by 180 degrees if the photon is reflected from the outside of the glass.\n\n"+
		"But now, we also have an arrow for the transmitted photon; it is shrunk by 0.98.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to resume the animation."
	,
	'bottom_surface':
		"The photon has reached the bottom surface of the glass.\n\n"+
		"At this point, it can be either reflected or transmitted. If it is transmitted, it does not reach the detector, so we ignore that path.\n\n"+
		"We shrink the amplitude arrow by 0.2 for reflection.\n\n"+
		"By our rules, we do NOT rotate the clock hand by 180 degrees this time, as the photon is reflected from the inside the glass.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to resume the animation."
	,
	'top_surface_again':
		"The photon has reached the top surface of the glass again.\n\n"+
			"It can again be either reflected or transmitted. We will only consider the transmission right now.\n\n"+
			"The transmission will shrink the arrow by 0.98 again.\n\n"+
			"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to resume the animation."
	,
	'reflected_bottom':
		"We now consider the additional path that reflects off the bottom surface of the glass. These are the two alternative ways a photon can reach Detector A. These two paths are sufficient to fully describe the reflection off the glass.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to run the simulation again."
	,
	'arrows_enlarged':
		"The amplitude arrows were enlarged by a factor of two so they are easier to see.\n\n"+
		"As in our rules for adding arrows, we place them head to tail, one arrow for each alternative way the event can occur.\n\n"+
		"Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" to see the final probability."
	,
	'probability_again':
		"The probability depends on the different directions of the arrows. How do the arrows (and hence the probability) change as we vary the thickness of the glass?\n\n"+
		"See if you can predict the overall trend for the probability versus the thickness, and then press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to try it."
	,
	'explore':
		"You change the thickness by pressing the arrow buttons. Press "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_go.png")+"\"/>"+" to run the simulation and then "+"<img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_graph.png")+"\"/>"+" to view the total probability.\n\n"+
		"Look at hand on the left clock. Does it ever point in a different direction when the first photon reaches the detector?\n\n"+
		"Repeat this a number of times until you think you understand what is going on.\n\n"+
		"Then press "+"<img width=\"75\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/>"+" to see the full graph."
	,
	'closing':
		"This is what the full probability curve looks like. Now press on the photon source to change the color of the photon.\n\n"+
		"Are these the results you expected? Think about the following questions, which we will examine in detail next.\n\n"+
		"Can you explain why the curve oscillates between a minimum and a maximum?\n\n"+
		"Can you explain why the curve changes as it does based on your knowledge of the frequency of the colors?\n\n"+
		"What is the minimum and what is the maximum value of this curve?\n\n"+
		"What happens as the thickness approaches zero?\n\n"+
		"This concludes this tutorial."
}

var angle = -15;
var distance = 120;

amps.viewportScale = 20;
graph.probabilityScale = 0.2;

Engine.STYLE.Colors[0].frequency = 5
Engine.STYLE.Colors[1].frequency = 6.5
Engine.STYLE.Colors[2].frequency = 8

Engine.FREQUENCY_ADJUST = 0.1;

// Source
var photonSource = new Engine.PhotonSource("source", 0, true);

// Detector
var detectorA = new Engine.Detector("detectorA", false);
var markerA;

var detectorB = new Engine.Detector("detectorB", false);
var markerB;
var glass;
var thicknessMarker;

// photonSource.setOpacity(0.5);
// detector.setOpacity(0.5);

var spaceBelow = 0;
var glassWidth = 400;
var glassThickness = 19*10;
var glassIOR = 1.5;

function intro() {
	app.labelManager.addLabel({ at: {x: app.width/2-20, y: app.height/2}, align: [0,0] }, TEXT['welcome'] );

	app.showLabelLayer([btNextContainer]);
	btNextContainer.blinkOn(true);
	btNext.onPress(step1);
	btNext.enable();

	graph.coverTopHalf();

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
		exp.width/2 + distance*Math.sin(angle*Engine.DEG2RAD),
		exp.height/2 - distance*Math.cos(angle*Engine.DEG2RAD)
	);
	photonSource.setRotation(90+angle);
	exp.add(new Engine.Marker("Photon\nsource"), photonSource.x-100, photonSource.y-10);

	exp.add(detectorA,
		exp.width/2 + (distance-4)*Math.sin((180+angle)*Engine.DEG2RAD),
		exp.height/2 - (distance-4)*Math.cos(Engine.DEG2RAD)
	);
	exp.add(new Engine.Marker("Detector A"), detectorA.x+25, detectorA.y);
	detectorA.setRotation(-90-angle);

	// exp.add(detectorB,
		// exp.width/2 + 170*Math.sin((180+angle)*Engine.DEG2RAD),
		// exp.height/2 - 170*Math.cos((180+angle)*Engine.DEG2RAD)
	// );
	// markerB = new Engine.Marker("Detector B");
	// detectorB.setRotation(90+angle);
	glass = new Engine.Glass(glassWidth, glassThickness);
	exp.add(glass, exp.width/2-glassWidth/2, exp.height/2);
	// exp.add(markerB, detectorB.x+25, detectorB.y);

	exp.add(new Engine.Marker("Air"), exp.width/2-glassWidth/2-40, exp.height/2 - 15);
	exp.add(new Engine.Marker("Glass"), exp.width/2-glassWidth/2-60, exp.height - 15);

	msg.setMessage( TEXT['intro_instructions'] );

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


	// Reflected from top
	path = new Engine.LightPath(Math.sqrt(0.04));
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({
		x: exp.width/2,
		y: exp.height - 10 - glassThickness,
		invert: true,
		trigger: function() {
		lightLayer.pauseAnimation();
		btGo.enable();
		btGo.onPress(function(){ lightLayer.resumeAnimation(); btGo.disable(); });

		msg.setMessage( TEXT['first_surface'] );
	} });
	path.addPoint({ x: detectorA.x, y: detectorA.y, trigger: function() { detectorA.blink(); } });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	clocks.setRadius(60);
	path.clock = clocks.addClock(photonSource.color);
	exp.add(new Engine.Marker("Reflected path\n(top surface)"), exp.width/2+20, exp.height/3+10);

	msg.setMessage( TEXT['we_will_consider'] );

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

	msg.setMessage( TEXT['first_detection'] );

	btGraph.enable();
	btGraph.onPress(function(){
		amps.toggleTotalAmplitudeArrow();
		amps.drawProbabilityText();
		msg.setMessage( TEXT['first_probability'] );
		btGraph.disable();
		btNext.enable();
		btNext.onPress(step4);
		btNextContainer.blinkOn(true);
		var y = exp.height/2 - glassThickness - 10;
		graph.drawBar(y, Math.pow(amps.getTotalAmplitudeLength(),2), photonSource.color);
	});
}
function step4() {
	btGraph.disable();
	btNext.disable();
	btNextContainer.blinkOff();

	amps.clearProbabilityText();
	amps.clear();
	clocks.clear();
	lightLayer.clear();
	// Reflected from top
	path = new Engine.LightPath(0.2);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({
		x: exp.width/2-20,
		y: exp.height - 10 - glassThickness,
		invert: true,
		trigger: function() {
		lightLayer.pauseAnimation();
		btGo.enable();
		btGo.onPress(function(){ lightLayer.resumeAnimation(); btGo.disable(); });

		msg.setMessage( TEXT['top_surface'] );
	} });
	path.addPoint({ x: detectorA.x, y: detectorA.y, trigger: function() { detectorA.blink(); } });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	clocks.setRadius(60);
	path.clock = clocks.addClock(photonSource.color);
	exp.clearMarkers();
	exp.add(new Engine.Marker("Reflected paths\n(top and bottom surfaces)"), exp.width/2+30, exp.height/3+10);
	exp.add(new Engine.Marker("Photon\nsource"), photonSource.x-100, photonSource.y-10);
	exp.add(new Engine.Marker("Detector A"), detectorA.x+25, detectorA.y);

	// Reflected from bottom
	path = new Engine.LightPath(0.98*0.2*0.98);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({
		x: exp.width/2-20,
		y: exp.height - 10 - glassThickness,
		invert: false
	});
	path.addPoint({
		x: exp.width/2,
		y: exp.height - 10,
		invert: false,
		trigger: function() {
		lightLayer.pauseAnimation();
		btGo.enable();
		btGo.onPress(function(){ lightLayer.resumeAnimation(); btGo.disable(); });

		msg.setMessage( TEXT['bottom_surface'] );
	} });
	path.addPoint({
		x: exp.width/2+20,
		y: exp.height - 10 - glassThickness,
		invert: false,
		trigger: function() {
		lightLayer.pauseAnimation();
		btGo.enable();
		btGo.onPress(function(){ lightLayer.resumeAnimation(); btGo.disable(); });

		msg.setMessage( TEXT['top_surface_again'] );
	}
	});
	path.addPoint({ x: detectorA.x, y: detectorA.y, trigger: function() { detectorA.blink(); } });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	clocks.setRadius(60);
	path.clock = clocks.addClock(photonSource.color);

	graph.clear();

	msg.setMessage( TEXT['reflected_bottom'] );
	btGo.enable();
	btGo.onPress(function(){
		btGo.disable();
		lightLayer.shootAllPhotons(step5);
	});
}

function step5() {
	amps.viewportScale = 20;

	msg.setMessage( TEXT['arrows_enlarged'] );

	amps.drawAmplitudes(lightLayer);
	btGraph.enable();
	btGraph.onPress(step6);

}
function step6() {

	amps.toggleTotalAmplitudeArrow();
	amps.drawProbabilityText();
	btGraph.disable();

//Updated the graph to draw the bars in line with the bottom//
//edge of the glass -DC//

	var y = glassThickness;
	graph.drawBar(y, Math.pow(amps.getTotalAmplitudeLength(),2), photonSource.color);

//—//

	msg.setMessage( TEXT['probability_again'] );

	btNext.enable();
	btNext.onPress(step7);

}
minThickness = 10;
//var knob = new Engine.Knob("knob");
var usedProbs = {total:0}
function step7() {
	Engine.ANIMATION_SPEED = 3;

	btNext.disable();
	btNext.onPress(step8);
	btNext.enable(1000);

	var px = exp.width/2 + glassWidth/2 + 50;
	//var rail = new Engine.Rail(10, exp.height/2-minThickness-10);
	//exp.add(rail, px-5, exp.height/2);

	msg.setMessage( TEXT['explore'] );

	//knob.setCursor("ns-resize");
	//knob.snap = 10;
	//knob.setTitle("Adjust glass thickness");
	//knob.setDragBounds([px, px], [exp.height/2, exp.height-minThickness-10]);
	//exp.add(knob,px,exp.height-minThickness-10);
	//knob.enableDrag();
	//Engine.addEvent({ source: knob, node: knob.container.node }, "moved", evDrag);
	//Engine.addEvent({ source: knob, node: knob.container.node }, "enddrag", evEndDrag);
	//Engine.addEvent({ source: knob, node: knob.container.node }, "firstdrag", evStartDrag);
	//changeGlassThickness();
	btGo.enable();
	btGraph.onPress(function(){
		amps.toggleTotalAmplitudeArrow();
//Updated with new knob -DC//
		var y = glassThickness;
//--//
		amps.drawProbabilityText();
		// if (usedProbs[y]) return;
		usedProbs[y] = 1;
		usedProbs.total++;
		graph.drawBar(y, Math.pow(amps.getTotalAmplitudeLength(),2), photonSource.color);
		btGo.enable();
		btGraph.disable();
		//knob.enableDrag();
		//knob.setOpacity(1);
	});
	btGo.onPress(function(){
		btGo.disable();
		//knob.disableDrag();
		//knob.setOpacity(0.5);
		lightLayer.shootAllPhotons(function(){
			amps.drawAmplitudes(lightLayer);
			btGraph.enable();
			//knob.disableDrag();
			//knob.setOpacity(0.5);
		});;
	});

	lightLayer.getPath(1).changePoint(2,{
		x: exp.width/2,
		y: exp.height - 10,
		trigger: null
	});

	//-- Enabling the buttons --//
	btThin.enable();
	btThick.disable();
	btThinContainer.blinkOn(false);
	btThickContainer.blinkOn(false);
}

function step8() {
	btGo.disable();
	btNext.disable();
	btGraph.disable();

	//exp.remove(knob);

	amps.clear();
	amps.clearProbabilityText();
	clocks.clear();

	photonSource.setCursor("pointer");
	Engine.addEvent({ source: photonSource, node: photonSource.container.node }, "press", changeSourceColor);

	fillProbabilityGraph();

	msg.setMessage( TEXT['closing'] );

}

function changeSourceColor() {
	photonSource.setColor(photonSource.color+1);

	lightLayer.setColor(Engine.STYLE.Colors[photonSource.color].color);
	lightLayer.setFrequency(Engine.STYLE.Colors[photonSource.color].frequency);
	//lightLayer.drawAll();
	updatePaths();

	fillProbabilityGraph();
}

function fillProbabilityGraph() {
	graph.clear();

	var a, g, y;
	for (g = 0; g <= (exp.height/2-minThickness); g+=10) {
		lightLayer.getPath(0).changePoint(1,{

//Updated so that this path does not change - DC//

			x: exp.width/2 - 20,
			y: exp.height/2,
			invert: true,
			trigger: null
		});

//Updated so that the position of the graph//
//is in line with the bottom edge of the//
//glass - DC//

		lightLayer.getPath(1).changePoint(1,{
			x: exp.width/2 - 20 + g/10,
			y: exp.height/2 + g,
			trigger: null
		});
		lightLayer.getPath(1).changePoint(2,{
			x: exp.width/2 - 20 + g/10,
			y: exp.height/2 + g ,
			trigger: null
		});
		lightLayer.getPath(1).changePoint(3,{
			x: exp.width/2 - 20 + g/10,
			y: exp.height/2 + g,
			trigger: null
		});

//--//
		lightLayer.getPath(0).updateData();
		lightLayer.getPath(1).updateData();
		//lightLayer.drawPath(lightLayer.getPath(0));
		//lightLayer.drawPath(lightLayer.getPath(1));

		a = lightLayer.getTotalAmplitude();

		y = exp.height/2 - g - 10;
//Also updated for the new way we are graphing -DC//
		graph.drawBar(g, Math.pow(a.amplitude,2), photonSource.color);
//--//

	}

//-- Updated for the buttons --//
	btThin.disable();
	btThick.disable();
}

function evDrag(ev) {
	clocks.reset();
	amps.clear();
	amps.clearProbabilityText();
	changeGlassThickness();
}

function evStartDrag() {
	amps.clearProbabilityText();
	amps.clear();
	clocks.reset();
}
function evEndDrag() {
	lightLayer.getPath(0).updateData();
	lightLayer.getPath(1).updateData();
}

function changeGlassThickness() {

//Updated the function so that the knob changes the thickness//
//by moving the bottom edge of the glass - DC //

	glassThickness = knob.y - exp.height/2 + 10;
	if (glass) exp.remove(glass);
	glass = new Engine.Glass(glassWidth, glassThickness);
	exp.add(glass, exp.width/2-glassWidth/2, exp.height/2 );
	updatePaths();

//--//
}

function updatePaths() {

//Updated the function so that the top path does not move - DC //

	lightLayer.getPath(0).changePoint(1,{
		x: exp.width/2 - 20,
		y: exp.height/2,
		invert: true,
		trigger: null
	});

//Updated the function so that the bottom path changes //
//when you change the thickness of the glass - DC //

	lightLayer.getPath(1).changePoint(1,{
		x: exp.width/2 - 20 + glassThickness/10,
		y: exp.height/2 + glassThickness,
		trigger: null
	});
	lightLayer.getPath(1).changePoint(2,{
		x: exp.width/2 - 20 + glassThickness/10,
		y: exp.height/2 + glassThickness,
		trigger: null
	});
	lightLayer.getPath(1).changePoint(3,{
		x: exp.width/2 - 20 + glassThickness/10,
		y: exp.height/2 + glassThickness,
		trigger: null
	});
	lightLayer.getPath(0).updateData();
	lightLayer.getPath(1).updateData();
	lightLayer.drawPath(lightLayer.getPath(0));
	lightLayer.drawPath(lightLayer.getPath(1));
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
// step1(); step2(); step3(); step4(); step5(); step6(); step7();

//Engine.ANIMATION_SPEED = 1e6;

//---------------BUTTONS WHICH REPLACE KNOBS--------//

function glassThin() {
	if(glassThickness == 10) return;

	glassThickness = glassThickness-10;
	if (glass) exp.remove(glass);
	glass = new Engine.Glass(glassWidth, glassThickness);
	exp.add(glass, exp.width/2-glassWidth/2, exp.height/2 );
	updatePaths();
	clocks.reset();
	amps.clear();
	amps.clearProbabilityText();
	btGo.enable();

	if(glassThickness == 10) btThin.disable();

	btThick.enable();

}

function thinPress(){
	glassThin();
};

function glassThick() {
	if(glassThickness == 190) return;

	glassThickness = glassThickness+10;
	if (glass) exp.remove(glass);
	glass = new Engine.Glass(glassWidth, glassThickness);
	exp.add(glass, exp.width/2-glassWidth/2, exp.height/2 );
	updatePaths();
	clocks.reset();
	amps.clear();
	amps.clearProbabilityText();
	btGo.enable();

	if(glassThickness == 190) btThick.disable();

	btThin.enable();

}

function thickPress(){
	glassThick();
};

btThin.onPress(thinPress); btThick.onPress(thickPress);
