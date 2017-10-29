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

	var btReset = new Engine.ButtonKill();
	exp.add(btReset, 10, 350);
	btReset.setOpacity(0.5);

	// var btUndo = new Engine.ButtonUndo();
	// app.add(btUndo, 940, 310);

	var btFast = new Engine.ButtonFast();
	app.add(btFast, 750, 310);


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

function startfreemode() {
	
	resetFreeMode();
	
	msg.setMessage("This is the free mode of the engine.\n\nCreate any collection of paths you wish and see the results of the simulation.");

	Engine.addEvent({ source: exp, node: exp.div }, "click", function(e) {
		var p = Engine.getEventMousePos(e, e.data.source.div);
		Engine.snap(p, 10);
		var area = [300-20, 300+20];
		if (p.x >= area[0] && p.x <= area[1]) {
			createLightPath(p.y);
		}
	});
	
	btGo.onPress(function(){
		buildWalls();
		lightLayer.shootAllPhotons(computeResults);
		btGo.disable();
		btFast.disable();
		detector.disableDrag();
	});	
	
	// Engine.addEvent({ source: detector, node: detector.container.node }, "firstdrag", evFirstDrag);
	Engine.addEvent({ source: detector, node: detector.container.node }, "moved", evDrag);
	Engine.addEvent({ source: photonSource, node: photonSource.container.node }, "press", changeColor);
	
	btReset.enable();
	btReset.onPress(resetFreeMode);
	
	btFast.onToggle(function(){
		btFast.state = !btFast.state;
		Engine.ANIMATION_SPEED = (btFast.state ? 10 : 1 );
		btFast.setSign(btFast.state);
	});
	
	btGraph.onPress(function(){
		amps.setTotalAmplitudeColor(photonSource.color);
		amps.toggleTotalAmplitudeArrow();
		drawProbability(detector.y);
	});
}

var usedLocations = {};
function drawProbability(y) {
	if (usedLocations[y]) return;
	usedLocations[y] = 1;
	graph.drawBar(y - exp.height/2, Math.pow(amps.getNormalizedTotalAmplitude(),2), photonSource.color);
}

function resetFreeMode() {
	
	btGraph.disable();
	btHelp.disable();
	btNext.disable();
	btGo.disable();
	btFast.disable();	
	
	clocks.clear();
	lightLayer.clear();
	amps.clear();
	graph.clear();

	detector.enableDrag();
	usedPaths = {total:0};
	usedProbs = {};
	
	glowManager.assign({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });
	
	buildWalls();
}

function changeColor() {
	if (usedPaths.total) return;
	photonSource.setColor((photonSource.color+1)%3);
	lightLayer.setGlobalColor(Engine.STYLE.Colors[photonSource.color].color);
}

function computeResults() {
	btFast.enable();
	amps.drawAmplitudes(lightLayer);
	detector.blink();
	glowManager.enable();
	btGraph.enable();
	detector.enableDrag();
}

var usedPaths = {total:0};
function createLightPath(y) {
	if (lightLayer.timer) return;
	if (y < 20 || y > 380) return;
	if (usedPaths[y]) return;
	// clearWalls();
	var path = new Engine.LightPath(1);
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
		btFast.enable();
	}
	buildWalls();
}

function evDrag(ev) {
	if (lightLayer.lightPaths.length) {
		lightLayer.changePointAllPaths(2, detector);
	}
	if (usedLocations[detector.y]) {
		btGo.disable();
		btGraph.enable();
		amps.drawAmplitudes(lightLayer);
		amps.showTotalAmplitudeArrow();
		lightLayer.setFinalState();
		glowManager.assign({ 'paths': lightLayer, 'clocks': clocks, 'amplitudes': amps });
		glowManager.enable();
	} else {
		clocks.reset();
		amps.clear();
		if (lightLayer.lightPaths.length) btGo.enable();
		btGraph.disable();
		glowManager.disable();
	}
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

startfreemode();