// #################################################################################################
// Birthday Problem graph
// Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Lucas Vieira (https://github.com/1ucasvb)
//
// This software is licensed CC BY-SA
// https://creativecommons.org/licenses/by-sa/2.0/
// 
// #################################################################################################

var BirthdayProblem = {};
BirthdayProblem.numSamples = 10;
BirthdayProblem.pad = 40;
BirthdayProblem.realProbs = [ 0,
	0.002740, 0.008204, 0.016356, 0.027136, 0.040462, 0.056236, 0.074335, 0.094624, 0.116948,
	0.141141, 0.167025, 0.194410, 0.223103, 0.252901, 0.283604, 0.315008, 0.346911, 0.379119,
	0.411438, 0.443688, 0.475695, 0.507297, 0.538344, 0.568700, 0.598241, 0.626859, 0.654461,
	0.680969, 0.706316, 0.730455, 0.753348, 0.774972, 0.795317, 0.814383, 0.832182, 0.848734, 
	0.864068, 0.878220, 0.891232, 0.903152, 0.914030, 0.923923, 0.932885, 0.940976, 0.948253,
	0.954774, 0.960598, 0.965780, 0.970374, 0.974432, 0.978005, 0.981138, 0.983877, 0.986262,
	0.988332, 0.990122, 0.991665, 0.992989, 0.994123, 0.995089, 0.995910, 0.996604, 0.997190,
	0.997683, 0.998096, 0.998440, 0.998726, 0.998964, 0.999160, 0.999321, 0.999453, 0.999561,
	0.999649, 0.999720, 0.999777, 0.999824, 0.999861, 0.999891, 0.999914, 0.999933, 0.999948,
	0.999960, 0.999969, 0.999976, 0.999982, 0.999986, 0.999989, 0.999992, 0.999994, 0.999995,
	0.999997, 0.999997, 0.999998, 0.999999, 0.999999, 0.999999, 0.999999
];
BirthdayProblem.init = function() {
	this.graph = document.getElementById("graph");
	this.graphContext = this.graph.getContext("2d");
	this.points = document.getElementById("points");
	this.pointsContext = this.points.getContext("2d");
	this.overlay = document.getElementById("overlay");
	this.overlayContext = this.overlay.getContext("2d");
	
	this.graphContext.translate(0.5, 0.5);
	this.pointsContext.translate(0.5, 0.5);
	this.overlayContext.translate(0.5, 0.5);
	
	// Text measurement
	this.__span = document.createElement("span");
	this.__span.style.position = "absolute";
	this.__span.style.top = "-9999px";
	this.__span.style.left = "-9999px";
	this.__span.style.visibility = "hidden";
	document.body.append(this.__span);
	
	this.btCompute = document.getElementById("bt_compute");
	this.btCompute.addEventListener("click", function(){ BirthdayProblem.computeProbability(); });
	
	this.btShow = document.getElementById("bt_show");
	this.btShow.addEventListener("click", function(){ BirthdayProblem.showProbability(); });
	this.btShow.style.display = "none";
	
	this.labelPeople = document.getElementById("numpeople_label");
	this.probability = document.getElementById("probability");
	
	this.sliderPeople = document.getElementById("numpeople_slider");
	this.valuePeople = document.getElementById("numpeople_value");
	this.sliderPeople.addEventListener("change", function(){ BirthdayProblem.updatevaluePeople(); });
	this.sliderPeople.addEventListener("input", function(){ BirthdayProblem.updatevaluePeople(); });
	this.valuePeople.addEventListener("change", function(){ BirthdayProblem.updatesliderPeople(); });
	this.valuePeople.addEventListener("input", function(){ BirthdayProblem.updatesliderPeople(); });
	
	this.w = this.graph.width;
	this.h = this.graph.height;
	
	this.probabilities = {};
	
	Object.defineProperty(this, 'numPeople', {
		get: function() {
			return this.valuePeople.value;
		}
	});
	
	this.reset();
	this.updateOverlay();
}
BirthdayProblem.getProbability = function(n) {
	if (n == 1) return 0;
	n -= 1;
	if (n < this.realProbs.length) {
		return this.realProbs[n];
	} else {
		return 1;
	}
}
BirthdayProblem.updatevaluePeople = function() {
	this.valuePeople.value = this.sliderPeople.value;
	this.labelPeople.innerHTML = (this.valuePeople.value == 1 ? "person" : "people"); 
	this.updateOverlay();
}
BirthdayProblem.updatesliderPeople = function() {
	this.sliderPeople.value = this.valuePeople.value;
	this.labelPeople.innerHTML = (this.valuePeople.value == 1 ? "person" : "people"); 
	this.updateOverlay();
}
BirthdayProblem.updateOverlay = function() {
	var x, y, px, py;
	
	x = this.pad + (this.w - 2*this.pad) * (this.numPeople/366);
	this.overlayContext.clearRect(0, 0, this.w, this.h);
	this.overlayContext.fillStyle = "rgba(255,0,0,0.25)";
	this.overlayContext.fillRect(x - 3, this.pad, 6, this.h - 2*this.pad);
	
	if (this.numPeople in this.probabilities) {
		var t = this.getProbability(this.numPeople);
		if (this.numPeople == 1 || this.numPeople == 366) {
			t = "p = "+(Math.round(t * 1e6)/1e4) + "%";
		} else {
			t = "p \u2248 "+(Math.round(t * 1e6)/1e4) + "%";
		}
		this.probability.innerHTML = t;
		this.btCompute.disabled = true;
	} else {
		this.probability.innerHTML = "";
		this.btCompute.disabled = false;
	}
	
}
BirthdayProblem.showProbability = function() {
	var ctx = this.pointsContext;
	
	//ctx.clearRect(0, 0, this.w, this.h);
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(255,0,0,1)";
	ctx.moveTo(this.pad, this.h - this.pad);
	
	var px, py, x, y;
	
	for(var i = 1; i <= 366; i++) {
		px = i / 366;
		py = this.getProbability(i);
		this.probabilities[i] = py;
		x = this.pad + (this.w - 2*this.pad) * px;
		y = this.pad + (this.h - 2*this.pad) * (1 - py);
		ctx.lineTo(x, y);
	}
	
	ctx.stroke();
	ctx.closePath();
	
	this.btShow.style.display = "none";
}
BirthdayProblem.computeProbability = function() {
	if (this.numPeople in this.probabilities) return;
	
	this.probabilities[this.numPeople] = this.getProbability(this.numPeople);
	
	var px = this.numPeople / 366;
	var py = this.getProbability(this.numPeople);
	var x = this.pad + (this.w - 2*this.pad) * px;
	var y = this.pad + (this.h - 2*this.pad) * (1 - py);
	
	this.pointsContext.beginPath();
	this.pointsContext.fillStyle = "rgba(255,0,0,1)";
	this.pointsContext.arc(x, y, 4, 0, 2*Math.PI);
	this.pointsContext.fill();
	
	if (Object.keys(this.probabilities).length == this.numSamples) {
		setTimeout(function(){ 
			BirthdayProblem.btShow.style.display = "block";
			BirthdayProblem.btCompute.style.display = "none";
		}, 500);
	}
	
	this.updateOverlay();
}
BirthdayProblem.reset = function() {
	var gw = this.w;
	var gh = this.h;
	// Clear
	this.overlayContext.clearRect(0, 0, gw, gh);
	this.pointsContext.clearRect(0, 0, gw, gh);
	
	var ctx = this.graphContext;
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect(0, 0, gw, gh);
	
	ctx.strokeWidth = 5;
	ctx.strokeStyle = "rgba(0,0,0,0.5)";
	ctx.beginPath();
	this.graphContext.rect(
		this.pad, this.pad,
		this.graph.width - 2*this.pad,
		this.graph.height  - 2*this.pad
	);
	ctx.closePath();
	ctx.stroke();
	
	var w = this.graph.width - 2*this.pad;
	var h = this.graph.height - 2*this.pad;
	
	
	// x ticks
	var x, y = this.pad + h;
	for(var i = 0; i <= 400; i += 50) {
		if (i == 350) continue;
		if (i > 366) i = 366;
		x = this.pad + w * (i/366);
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.1)";
		ctx.moveTo(x, this.pad);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.25)";
		ctx.moveTo(x, y - 5);
		ctx.lineTo(x, y + 5);
		ctx.stroke();
		ctx.closePath();
		
		this.drawText(
			ctx,
			i,
			x,
			y + this.pad/2,
			"rgba(0,0,0,0.75)",
			"15px sans-serif",
			0
		);
	}
	
	// y ticks
	x = this.pad;
	for(var i = 0; i <= 100; i += 10) {
		y = this.pad + h * (i/100);
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,"+(i == 50?0.25:0.1)+")";
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.25)";
		ctx.moveTo(x - 2, y);
		ctx.lineTo(x + 2, y);
		ctx.stroke();
		ctx.closePath();
		
		this.drawText(
			ctx,
			Math.round((1-i/100)*10)/10,
			x - this.pad/2 - 2,
			y,
			"rgba(0,0,0,0.75)",
			"15px sans-serif",
			0
		);
	}
	
	this.drawText(
		ctx,
		"Probability of at least two people sharing a birthday",
		this.pad + w / 2,
		this.pad / 2,
		"rgba(0,0,0,1)",
		"20px sans-serif",
		0
	);
}
BirthdayProblem.drawText = function(ctx, text, x, y, color, fontStyle, align) {
	ctx.font = fontStyle;
	this.__span.style.font = fontStyle;
	this.__span.innerHTML = text;
	var tw = ctx.measureText(text).width;
	var th = this.__span.offsetHeight;
	if (typeof(align) == "undefined") align = 0;
	if (align == 0) ox = - tw / 2;
	if (align == -1) ox = 0;
	ctx.save(); // Backup context
	ctx.translate(x, y); // Translate to desired position
	ctx.fillStyle = color;
	ctx.textBaseline = "top"; // Baseline to top makes text height predictable
	ctx.beginPath();
	ctx.fillText(text, ox, -th / 2 - 1); // offsets in rotated context
	ctx.closePath();
	ctx.restore(); // restore context
}
BirthdayProblem.init();