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

// app.glowManager.setGroup({
	// amplitudes: amps,
	// clocks: clocks,
	// experiment: exp
// });

/* ------------------------------ BEGIN EXPERIMENT ------------------------------ */

var TEXT = {
	'welcome':
		"<p style=\"font-size:125%\">Welcome to the interactive tutorial\non light traveling through one slit\n\n"+
		"To continue, please press"+
		" <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> at the\n"+
		"right side to open the help window.\n\n"+
		"When you are done, "+	"press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again.</p>"
	,
	'first_help':
		"<p style=\"font-size:125%\">Good.\n"+
		"You can return to the help\n"+
		"screen at any time by\n"+
		"pressing <img src=\""+Engine.assetURL("button_help.png")+"\"/> again.\n\n"+
		"Press the instruction\n"+
		"box to continue.</p>"
	,
	'instruction_box':
		"This is the instruction box. Instructions will be shown here, and the box will glow when there's a new instruction.\n\n"+
		"Press in this box to continue."
	,
	'press_source':
		"First, press"+
		" on the photon source twice to change the color of light from "+
		"<span style=\"color:#F00;font-weight:bold\">RED</span> to <span style=\"color:#00F;font-weight:bold\">BLUE</span>."
	,
	'add_paths':
		"Great! Now it is time for you to start making paths.\n\n"+
		"The area labeled \"Photon Paths\" has already indicated where you should make the first path.\n\n"+
		"Press along the line between the barriers to add a few light paths."
	,
	'shoot_photon':
		"Good job so far! We added all the remaining paths for your convenience.\n\n"+
		"Now that your paths are drawn, it is time to see how a photon propagates along them.\n\n"+
		"Press <img src=\""+Engine.assetURL("button_go.png")+"\" width=\"26\" height=\"21\"/> to send a photon across the multiple possible paths.\n\n"+
		"It will look like there are multiple photons, but what you are actually seeing is a single photon and the different ways one event can happen, all at once."
	,
	'press_graph':
		"If you look in the area labeled \"amplitude arrows\" above, you will notice that there are already individual arrows, joined together, but their total sum is not shown.\n\n"+
		"Press the graph button <img src=\""+Engine.assetURL("button_graph.png")+"\" width=\"26\" height=\"21\"/> to determine the final arrow, the sum of all the tiny arrows, and also graph the probability of the photon being found at the location of the detector.\n"
	,
	'explore_amplitudes':
		"Now you have your final arrow and probability!\n\n"+
		// "Some of the arrows contribute a great deal to the final arrow, whereas others contribute very little.\n\n"+
		"Mouse over or long tap over the paths, clocks or arrows to see how they relate.\n\n"+
		// "Try to find out how each path contributes to the final arrow.\n\n"+
		"Does each path contribute the same to the final arrow or differently? Try to explain your answer noting that all of the small arrows have the same size, and only their direction changes.\n\n"+
		"What do the paths that contribute the most have in common with each other? What about the ones that contribute the least?\n\n"+
		"Press <img width=\"63\" height=\"25\" src=\""+Engine.assetURL("button_next.png")+"\"/> when you are done."
	,
	'drag_detector':
		"Now we'll move the detector to a different position and see how the amplitude arrows change.\n\n"+
		"Drag the detector to the position indicated."
	,
	'shoot_photon_again':
		"Good!\n\n"+
		"Now press the emit photon button <img src=\""+Engine.assetURL("button_go.png")+"\" width=\"26\" height=\"21\"/> again to see the photon reaching the detector in this new position."
	,
	'press_graph_again':
		"Now press the graph button <img src=\""+Engine.assetURL("button_graph.png")+"\" width=\"26\" height=\"21\"/> again to find the final arrow and probability of photon detection."
	,
	'closing':
		"Great!\n\n"+
		"Mouse over or long tap the paths or clocks to determine how each path contributes to the final arrow.\n\n"+
		"Are they the same paths as before?\n\n"+
		"Can you describe in words which paths contribute the most to the final arrow this time?\n\n"+
		"Is the relation between the paths that contribute the least, or most, the same as before?\n\n"+
		"Feel free to move the detector and try other positions.\n\n"+
		"\nThat's it for this tutorial! Please, continue on to the next part of the course."
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
	app.arrowManager.addArrow({ x: btHelpContainer.x - 15, y: btHelpContainer - 15 }, 135 );
}

function setLabels2() {
	app.labelManager.clearLabels();
		
	app.labelManager.addLabel({ at: {x: 10, y: 10}, align: [-1,-1] },
		"<p style=\"font-size:100%\">press <img width=\"31\" height=\"25\" src=\""+Engine.assetURL("button_help.png")+"\"/> again to exit the help window.</p>");
	
	app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
		"Photon\nsource\nPress to\nchange color");
	
	app.labelManager.addLabel({ at: detector, align: [1,0] },
		"Photon\ndetector\nDrag to\nchange\nposition");

	app.labelManager.addLabel({ at: {x: exp.x + exp.width/2, y: exp.y + exp.height*0.7}, align: [0,0] },
		"Press along\nthe pink line\nbetween the\nbarriers to\ncreate paths");
	
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

function setLabels3() {
	app.labelManager.clearLabels();
	app.labelManager.addLabel({ at: {x: app.width/2-50, y: app.height/2}, align: [0,0] }, TEXT['first_help'] );
}



/* Steps */
/* ------- STEP 1 -------- */
function step1() {
	setLabels1();
	app.showLabelLayer([btHelpContainer]);
	app.arrowManager.show();
	// Go to step 2
	btHelp.onPress(step2);
	btHelpContainer.blinkOn(true);
	btNext.disable();
	btGraph.disable();
	btGo.disable();
}


/* ------- STEP 2 -------- */
function step2() {
	setLabels2();
	app.showLabelLayer([btHelpContainer]);
	app.arrowManager.hide();
	// Go to step 3
	btHelp.onPress(step3);
}


/* ------- STEP 3 -------- */
function step3() {
	btHelp.offPress();
	setLabels3();
	app.showLabelLayer([msg]);
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({x: msg.x - 10, y: msg.y - 10 },135);
	app.arrowManager.show();
	app.arrowManager.onTop();
	
	msg.setMessage( TEXT['instruction_box'] );
	
	btHelp.setState(false);
	btHelpContainer.blinkOff();
	// Go to step 4
	Engine.addEvent({ source: msg, node: msg.div }, "press", step4);

}


/* ------- STEP 4 -------- */
function step4() {
	Engine.log("step4");
	Engine.removeEvent({ source: msg, node: msg.div }, "press");
	photonSource.setCursor("pointer");
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: exp.x + photonSource.x + 20,
		y: exp.y + photonSource.y - 35
	},60);
	
	msg.setMessage( TEXT['press_source'] );
	
	setLabels2();
	app.hideLabelLayer();
	btHelp.onPress(function(){
		app.toggleLabelLayer([btHelpContainer]);
	});
	// Go to step 5
	Engine.addEvent({ source: photonSource, node: photonSource.container.node }, "press", step4_clickSource);
}

function step4_clickSource(e) {
	photonSource.color++;
	photonSource.setColor(photonSource.color);
	if (photonSource.color == 2) step5();
}


/* ------- STEP 5 -------- */
var markers = [];
function step5(e) {
	photonSource.setColor(2);
	Engine.removeEvent({ source: photonSource, node: photonSource.container.node }, "press");
	photonSource.setCursor("default");
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: exp.x + exp.width / 2 - 10,
		y: exp.y + exp.height / 2 - SLIT_SIZE*10/2 - 10
	},140);
	
	msg.setMessage( TEXT['add_paths'] );
	
	var m;
	m = new Engine.DotMarker(); exp.add(m, 300, 200 - SLIT_SIZE/2*10, true); markers.push(m);
	m = new Engine.Marker("Start here"); exp.add(m, 300, 200 - (SLIT_SIZE+4)/2*10, true); markers.push(m);
	
	m = new Engine.DotMarker(); exp.add(m, 300, 200 + SLIT_SIZE/2*10, true); markers.push(m);
	m = new Engine.Marker("End here"); exp.add(m, 300, 200 + (SLIT_SIZE/2+4)*10, true); markers.push(m);
	
	photonSource.setColor(2);
	lightLayer.setColor(Engine.STYLE.Colors[photonSource.color].color);
	
	// use click instead of press to get event on the div
	// this is necessary because the SVG object unfortunately captures the event and there's no event bubbling
	Engine.addEvent({ source: exp, node: exp.div }, "click", function(e) {
		var p = Engine.getEventMousePos(e, e.data.source.div);
		Engine.snap(p, 10);
		var area = [[300-20, 300+20], [200-SLIT_SIZE/2*10, 200+SLIT_SIZE/2*10]];
		if (p.x >= area[0][0] && p.x <= area[0][1] && p.y >= area[1][0] && p.y <= area[1][1]) {
			createLightPath(p.y);
			if (usedPaths.total == 5) {
				step6();
			}
		}
	});
}

// Object that determines if a path has been used already
// If the entry usedPaths[y] is set, path is used
var usedPaths = {'total':0};

// This function creates a path with a point on the slit
// It also creates the associated clock and the associations
function createLightPath(y) {
	if (usedPaths[y]) return;
	
	var path = new Engine.LightPath(1);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({ x: 300, y: y });
	path.addPoint({ x: detector.x, y: detector.y });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	path.clock = clocks.addClock(photonSource.color);
	
	usedPaths[y] = 1;
	usedPaths.total++;
}


/* ------- STEP 6 -------- */
function step6() {
	if (markers && markers.length) {
		for(var i in markers) {
			exp.remove(markers[i]);
		}
	}
	Engine.removeEvent({ source: exp, node: exp.div }, "click");
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: btGoContainer.x - 10,
		y: btGoContainer.y + 10
	},160);
	
	msg.setMessage( TEXT['shoot_photon'] );
	lightLayer.clear();
	btGoContainer.blinkOn(true);
	clocks.clear();
	
	// We reset the usePaths object so we can reuse the createLightPath command
	usedPaths = {'total':0};
	for (var i = -SLIT_SIZE/2;i <= SLIT_SIZE/2;i++) {
		createLightPath(200+10*i);
	}
	delete usedPaths;
	btGo.enable();
	btGo.onPress(function(){
		lightLayer.shootAllPhotons(step7);
		btGo.offPress();
		btGo.disable();
		app.arrowManager.clearArrows();
	});
}


/* ------- STEP 7 -------- */
function step7() {
	btGoContainer.blinkOff();
	amps.useTotalAmplitudeLengthText = true;
	// amps.drawAmplitudes(exp.getAmplitudes());
	// app.glowManager.enable();
	
	amps.drawAmplitudes(lightLayer);
	detector.blink();
	glowManager.enable();
	
	msg.setMessage( TEXT['press_graph'] );
	amps.onTop();
	
	app.arrowManager.addArrow({
		x: amps.x + btGraph.x + 25,
		y: amps.y + btGraph.y - 10
	},100);
	app.arrowManager.show();
	app.arrowManager.onTop();
	
	setTimeout(function(){ amps.blinkOn(true); }, 1500);
	btGraph.enable();
	btGraph.onPress(step8);
}


/* ------- STEP 8 -------- */
// This object works like the usedPaths, but for detection locations
var usedLocations = {};
function step8() {
	amps.blinkOff();
	amps.setTotalAmplitudeColor(photonSource.color);
	amps.showTotalAmplitudeArrow();
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: btNextContainer.x - 10,
		y: btNextContainer.y + 10
	},160);
	
	var y = detector.y - exp.height/2;
	// alert(amps.getMaxAmplitude());
	graph.drawBar(y, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);
	
	usedLocations[detector.y] = 1;
	btGraph.offPress();
	btGraph.disable();
	msg.setMessage( TEXT['explore_amplitudes'] );
	btNext.enable();
	btNextContainer.blinkOn(true);
	btNext.onPress(step9);
	// Engine.addEvent({ source: msg, node: msg.div }, "press", step9);
}


/* ------- STEP 9 -------- */
var detectorIndicator = new Engine.Detector("detectorIndicator");
detectorIndicator.setTitle("Move detector here");

function step9() {
	Engine.log("step9");
	btNext.offPress();
	btNext.disable();
	btNextContainer.blinkOff();
	
	// Engine.removeEvent({ source: msg, node: msg.div }, "press");
	amps.resetBlink();
	amps.clear();
	
	clocks.reset();
	
	msg.setMessage( TEXT['drag_detector'] );
	exp.add(detectorIndicator, 560, 290);
	$(detectorIndicator.container.node).hide();
	$(detectorIndicator.container.node).fadeTo(500, 0.5);
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: exp.x + detectorIndicator.x - 20,
		y: exp.y + detectorIndicator.y + 20
	},-140);
	
	exp.blinkOn(true);
	detector.onTop();
	detector.enableDrag();
	detector.setCursor("ns-resize");
	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
}

function evDrag(ev) {
	if (lightLayer.lightPaths.length) {
		lightLayer.changePointAllPaths(2, detector);
		if (detector.y == detectorIndicator.y) {
			step10();
		}
	}
}


/* ------- STEP 10 -------- */
function step10() {
	exp.blinkOff();
	amps.blinkOff();
	Engine.removeEvent({ source: detector, node: detector.container.node }, "moved");
	detector.disableDrag();
	detector.setCursor("default");
	detector.setPosition(detectorIndicator.x,detectorIndicator.y);
	exp.remove(detectorIndicator); delete detectorIndicator;
	
	app.arrowManager.clearArrows();
	app.arrowManager.addArrow({
		x: clocks.x + clocks.width / 2,
		y: clocks.y - 0
	},90);
	
	msg.setMessage( TEXT['shoot_photon_again'] );
	btGo.enable();
	btGo.onPress(function(){
		app.arrowManager.clearArrows();
		lightLayer.shootAllPhotons(step11);
		btGo.disable();
		btGo.offPress();
	});
}


/* ------- STEP 11 -------- */
function step11() {
	
	amps.drawAmplitudes(lightLayer);
	detector.blink();
	glowManager.enable();
	
	msg.setMessage( TEXT['press_graph_again'] );
	amps.onTop();
	setTimeout(function(){ amps.blinkOn(true); },1500);
	detector.setCursor("default");
	detector.disableDrag();
	btGraph.enable();
	btGraph.onPress(step12);
}


/* ------- STEP 12 -------- */
function evDrag2(ev) {
	if (lightLayer.lightPaths.length) {
		lightLayer.changePointAllPaths(2, detector);
	}
	if (usedLocations[detector.y]) {
		btGo.disable();
		btGraph.enable();
		amps.drawAmplitudes(lightLayer);
		amps.showTotalAmplitudeArrow();
		lightLayer.setFinalState();
		return;
	}
	clocks.reset();
	btGo.enable();
	btGraph.disable();
	amps.clear();
}

function step12() {
	computeResults();
	startfreemode();
	msg.setMessage( TEXT['closing'] );
	btGraph.onPress(function(){ amps.toggleTotalAmplitudeArrow(); });
	btGraph.disable();
	amps.blinkOff();
}

function computeResults() {
	usedLocations[detector.y] = 1;
	amps.drawAmplitudes(lightLayer);
	amps.setTotalAmplitudeColor(photonSource.color);
	amps.showTotalAmplitudeArrow();
	var y = detector.y - exp.height/2;
	graph.drawBar(y, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);
	btGraph.enable();
}

function startfreemode() {
	Engine.ANIMATION_SPEED = 3;
	btGo.onPress(function(){
		app.arrowManager.clearArrows();
		lightLayer.shootAllPhotons(computeResults);
		btGo.disable();
	});
	btGraph.setOpacity(0.5);
	btGraph.offPress();
	detector.onTop();
	detector.enableDrag();
	detector.setCursor("ns-resize");
	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag2);
}


/* ----------------------------------------- Start -------------------------------------------- */
amps.viewportScale = 2.5;
SLIT_SIZE = 6;
buildWalls();

Engine.C = 150;
Engine.ANIMATION_SPEED = 1;
Engine.FREQUENCY_ADJUST = 3;

var lightLayer = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
	);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });
step1();