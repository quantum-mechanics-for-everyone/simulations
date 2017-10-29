/* STANDARD SETUP */
	var clocksBoxHeight = 150; // helps set up overall height

	// Main object definitions
	var app = Engine.create("experiment", 1000, 430 + clocksBoxHeight);
	$(document.body).append(app.div);

	var exp = new Engine.ExperimentBox("exp", 600, 400);
	app.add(exp, 10, 10);

	var graph = new Engine.GraphBox("graph", 120, 400);
	app.add(graph, 620, 10);
	graph.drawScale(0);

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

	//Added for the help feature, it is a clone of the help button that removes the help layer
	var btHelpContainer2 = new Engine.RaphaelPaper("btHelpContainer2", 50, 40);
	var btHelp2 = new Engine.ButtonHelp();
	btHelpContainer2.add(btHelp2, 0, 0);
	app.add(btHelpContainer2, 940, 260);
	app.hideLabelLayer([btHelpContainer]);

	var btGoContainer = new Engine.RaphaelPaper("btGoContainer", 50, 40);
	var btGo = new Engine.ButtonGo();
	btGoContainer.add(btGo, 0, 0);
	app.add(btGoContainer, 750, 260);

	var btResetContainer = new Engine.RaphaelPaper("btResetContainer", 50, 40);
	var btReset = new Engine.ButtonKill();
	btResetContainer.add(btReset, 0, 0);
	app.add(btResetContainer, 20, 360);
	btReset.setOpacity(0.5);

/* ------------------------------ BEGIN EXPERIMENT ------------------------------ */

// Source
var photonSource = new Engine.PhotonSource("source", 0);
photonSource.setTitle("Source");
exp.add(photonSource, 30, 200);
photonSource.setCursor("pointer");

// Detector rail
var rail = new Engine.Rail(10,360);
exp.add(rail, 560, 20);

// Detector
var detector = new Engine.Detector("detector");
detector.snap = 10;
detector.setTitle("Detector");
exp.add(detector, 560, 200);
detector.setDragBounds([560, 560], [30, 370]);
detector.enableDrag();
detector.setCursor("ns-resize");

var lightLayer = new Engine.LightLayer(
		Engine.STYLE.Colors[photonSource.color].color,
		Engine.STYLE.Colors[photonSource.color].frequency
);
exp.addLightLayer(lightLayer);
var glowManager = new Engine.GlowManager({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });

function startFreeMode() {

	resetFreeMode();

	msg.setMessage(
		"This is the free mode of the multislit experiment with light.\n\n"+
		"Create any collection of paths you wish by clicking on the wall on the midline and press the green button to see "+
		"the results of the simulation.\n\n"+
		"In this experiment, each path's arrow has a length of 0.05, implying a single hole creates a uniform pattern with probability 0.25% to enter a detector at the screen.\n\n"+
		"Move the detector to see how the arrows add at different locations on the screen.\n\n"+
		"Change the color of the light by clicking on the source.\n\n"+
		"Reset with the red X button."
	);

	Engine.addEvent({ source: exp, node: exp.div }, "click", function(e) {
		var p = Engine.getEventMousePos(e, e.data.source.div);
		Engine.snap(p, 10);
		var area = [300-20, 300+20];
		if (p.x >= area[0] && p.x <= area[1]) {
			createLightPath(p.y);
		}
	});

	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
	Engine.addEvent({ source: photonSource, node: photonSource.container.node }, "press", changeColor);

	btReset.enable();
	btReset.onPress(resetFreeMode);

	btGo.onPress(showResults);

	btHelp.onPress(setLabels);
	btHelp2.onPress(function(){
		app.hideLabelLayer([btHelpContainer])
	});

}

function showResults() {
	Engine.ANIMATION_SPEED = 1;
	buildWalls();
	lightLayer.shootAllPhotons(computeResults);
	btGo.disable();
	detector.disableDrag();
	btReset.disable();
	amps.clear();
}

var usedLocations = {};

function drawProbability(y) {
	if (usedLocations[y]) return;
	usedLocations[y] = 1;
	graph.drawBar(y - exp.height/2, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);
}

function resetFreeMode() {

	btGo.disable();

	clocks.clear();
	lightLayer.clear();
	amps.clear();
	graph.clear();

	detector.enableDrag();
	usedPaths = {total:0};
	usedProbs = {};

	photonsFired = 0;

	buildWalls();

	glowManager.active = 0;
	graph.drawScale(0);

	amps.clearProbabilityText();
}

var usedPaths = {total:0};
function createLightPath(y) {
	if (lightLayer.timer) return;
	if (y < 20 || y > 380) return;
	if (usedPaths[y]) return;
	// clearWalls();
	var path = new Engine.LightPath(0.05);
	path.addPoint({ x: photonSource.x, y: photonSource.y });
	path.addPoint({ x: 300, y: y });
	path.addPoint({ x: detector.x, y: detector.y });
	path.updateData(); // call this manually so the Engine knows when to compute the entire path, instead of computing every new point
	lightLayer.addPath(path);
	path.clock = clocks.addClock(photonSource.color);
	usedPaths[y] = 1;
	usedPaths.total++;
	graph.clear();
	usedLocations = {};
	// amps.viewportScale = 30 * (usedPaths.total * Engine.STYLE.AmplitudeArrowLength) / (Engine.STYLE.AmplitudeBoxUsefulArea * amps.width);
	if (usedPaths.total) {
		detector.enableDrag();
		btGo.enable();
	}
	buildWalls();
}

function changeColor() {
	//if (usedPaths.total) return;//
	if(lightLayer.timer) return;
	photonSource.setColor((photonSource.color+1)%3);
	lightLayer.setGlobalColor(Engine.STYLE.Colors[photonSource.color].color);
	lightLayer.setFrequency(Engine.STYLE.Colors[photonSource.color].frequency);
	lightLayer.drawAll();
	for(var i in lightLayer.lightPaths) {
		lightLayer.graphics[lightLayer.lightPaths[i].uid].photon.attr('fill',Engine.STYLE.Colors[photonSource.color].color);
	};
	for(var i in clocks.clockList) {
		clocks.clockList[i].setColor(photonSource.color);
	};

	if (photonsFired) {
		amps.clearProbabilityText();
		amps.drawAmplitudes(lightLayer);
		amps.showTotalAmplitudeArrow();
		lightLayer.setFinalState();
		plotProbability();
		glowManager.assign({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });
		glowManager.enable();
		amps.drawProbabilityText();
	};
}

var normConstant = 0;
function plotProbability() {
	graph.clear();
	var y;
	var probabilityScale;
	var probabilities = [];

	for(var i = 3; i < exp.height/10-2; i++) {
		y = i*10;
		lightLayer.changePointAllPaths(2, { x: detector.x, y: y }, true);
		probabilities.push(Math.pow(lightLayer.getTotalAmplitude().amplitude,2));

	}

	probabilityScale = Math.max.apply(null, probabilities);

	probabilityScale = Math.round(probabilityScale * 100) / 100;
	graph.probabilityScale = probabilityScale + 0.01;
	graph.drawScale(100 * probabilityScale + 1);

	amps.drawProbabilityText();

	for(var i = 0; i < probabilities.length; i++ ) {
		y = (i+3) * 10;
		lightLayer.changePointAllPaths(2, { x: detector.x, y: y }, true);
		graph.drawBar(y - exp.height/2, probabilities[i], photonSource.color);
	}
	lightLayer.changePointAllPaths(2, {x: detector.x, y: detector.y }, true);
}

var photonsFired = 0;
function computeResults() {
	amps.drawAmplitudes(lightLayer);
	detector.blink();
	glowManager.enable();
	detector.enableDrag();
	btReset.enable();
	amps.setTotalAmplitudeColor(photonSource.color);
	amps.toggleTotalAmplitudeArrow();
	plotProbability();
	photonsFired = 1;
}

function evDrag(ev) {
	if (lightLayer.lightPaths.length) {
		lightLayer.changePointAllPaths(2, detector);
	}
	if (photonsFired) {
		amps.clearProbabilityText();
		amps.drawAmplitudes(lightLayer);
		amps.showTotalAmplitudeArrow();
		lightLayer.setFinalState();
		glowManager.assign({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });
		glowManager.enable();
		amps.drawProbabilityText();
	};
}

var walls = [];
function buildWalls() {
	clearWalls();
	var start = NaN;
	var w;
	for(var y = -10; y <= 410; y += 10) {
		if (usedPaths[y] || y == 410) {
			if (!isNaN(start)) {
				w = new Engine.Wall(10, y-start-10, 0);
				exp.add(w, exp.width/2 - 5, start+5);
				walls.push(w)
				start = NaN;
			}
		}
		if (isNaN(start)) start = y;
	}
}

function clearWalls() {
	for(var i in walls) {
		exp.remove(walls[i]);
		delete walls[i];
	}
}

function setLabels() {
	app.labelManager.clearLabels();

	app.labelManager.addLabel({ at: photonSource, align: [-1,0] },
		"Photon\nsource\nPress to\nchange color");

	app.labelManager.addLabel({ at: {x: photonSource.x, y: photonSource.y+180}, align: [-1,0] },
		"Press to\nreset");

	app.labelManager.addLabel({ at: detector, align: [1,0] },
		"Photon\ndetector.\nDrag to\nchange\nposition");

	app.labelManager.addLabel({ at: {x: exp.x + exp.width/2, y: exp.y + exp.height*0.7}, align: [0,0] },
		"Press along the line\nbetween the\nbarriers to\ncreate paths");

	app.labelManager.addLabel({ at: {x: clocks.x + clocks.width/2, y: clocks.y + clocks.height/2 }, align: [0,0] },
		"Clock for each path\nMouse over or long tap to highlight an\nindividual path and its respective clock and arrow");

	app.labelManager.addLabel({ at: {x: btGoContainer.x + 75, y: btGoContainer.y+75 }, align: [1,1] },
		"Show\nresults");

	app.labelManager.addLabel({ at: {x: graph.x+graph.width/2, y: graph.y }, align: [0,-1] },
		"Probability\nof photon\ndetection\n(horizontal)\nvs.\nposition of\nthe detector\n(vertical)");

	app.labelManager.addLabel({ at: {x: amps.x+amps.width/2, y: amps.y+20 }, align: [0,-1] },
		"Computation\nwindow with\nprobability\namplitude\narrows");

	app.labelManager.addLabel({ at: {x: msg.x+msg.width/2, y: msg.y+msg.height/2 }, align: [0,0] },
		"Instruction box");

	app.showLabelLayer([btHelpContainer2]);
}

startFreeMode();
