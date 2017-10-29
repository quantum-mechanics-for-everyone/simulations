// #################################################################################################
// QED Engine v1.60
// Copyright (C) 2015-2016 Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Lucas Vieira (https://github.com/1ucasvb)
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

// Main engine object
var Engine = {
	/* ------------ CONSTANTS ------------ */
	TAU: 2*Math.PI,
	DEG2RAD: Math.PI/180,
	RAD2DEG: 180/Math.PI,

	/* ------------ ASSETS ------------ */
	useRemoteAssets: false,
	IMAGES_REMOTE_BASEURL: "http://i.imgur.com/",
	IMAGES_REMOTE: {
		"loader.gif":				"PT8vZbB.gif",
		"grid.png":					"xU5gCNR.png",
		"label_photonpaths.png":	"DDmejSi.png",
		"probability_box.png":		"BG1r4f6.png",
		"button_down.png":			"tq9a1Ib.png",
		"bt_help.png":				"6EuV8Vf.png",
		"bt_go.png":				"Rkc6l2b.png",
		"bt_undo.png":				"eganAiX.png",
		"bt_fast.png":				"BscOnyD.png",
		"bt_fast_off.png":			"CP8xp2r.png",
		"bt_fast_on.png":			"PGjBsCV.png",
		"bt_kill.png":				"WZNYKtL.png",
		"bt_graph.png":				"iNPcqKa.png",
		"bt_next.png":				"xUSGjeK.png",
		"bt_slit_wide.png":			"YvNEgvc.png",
		"bt_slit_narrow.png":		"8jdHDQ5.png",
		"detector.png":				"11Ls0vH.png",
		"detector_nolabel.png":		"qFyqdVX.png",
		"source_red.png":			"Xp6o9ac.png",
		"source_green.png":			"b7eZtvf.png",
		"source_blue.png":			"ood0V8t.png",
		"source_red_nolabel.png":	"zT7PO8d.png",
		"source_green_nolabel.png":	"rdlyILQ.png",
		"source_blue_nolabel.png":	"slJb6JB.png",
		"button_help.png":			"tu6eGql.png",
		"button_go.png":			"aKBRNEJ.png",
		"button_graph.png":			"7KaP6g5.png",
		"button_next.png":			"fjFxDVW.png",
		"sqrt_0.96.png":			"yt2UIkn.png",
		"knob.png":					"Ehvqbs3.png",
		"bt_thin.png":				"Cv5XbFB.png",
		"bt_thick.png":				"10EvyUq.png",
		"bt_plot_all.png":			"tvg5SK5.png"
	},
	// Non-global assets (say, only one experiment uses it) should use this for simplicity
	addAsset: function(name, local, remote) {
		Engine.IMAGES_LOCAL[name] = local;
		Engine.IMAGES_REMOTE[name] = remote;
	},
	// Fetch asset URL by name
	assetURL: function(name) {
		if (Engine.useRemoteAssets) {
			return Engine.IMAGES_REMOTE_BASEURL + Engine.IMAGES_REMOTE[name];
		} else {
			return "./images/" + name;
		}
	},

	/* ------------ VISUAL STYLES ------------ */
	STYLE: {
		// default frequencies in units of 10^14 Hz for accurate simulation
		// the engine uses a scaling factor on them (FREQUENCY_ADJUST, defined below) to make them usable
		// it may be useful to change these manually (on the experiment file, not here) to accentuate certain features when needed
		AutoScale: true,
		Colors: [
			{ 'color': Raphael.hsb(0/3,1,0.85), 'frequency': 4.721 }, // red
			{ 'color': Raphael.hsb(1/3,1,0.5), 'frequency':  5.765 }, // green
			{ 'color': Raphael.hsb(2/3,1,0.85), 'frequency': 6.737 } // blue
		],
		AppBG: "135-#AAAAAA-#DDDDDD",
		ClockBoxBG: "90-#999999:60-#777777:100-#777777",
		BoxBorder: "1px solid #555555",
		GlowColor: "#FFFF00",
		GlowOpacity: "0.8",
		GlowWidth: 10,
		PhotonSize: 3,
		LightPathWidth: 1,
		MarkerColor: Raphael.hsb(0,0,1),
		MarkerOutline: Raphael.hsb(0,0,0),
		MarkerOutlineOpacity: 1.0,
		BlinkColor: "#FFFF00",
		AmplitudeBoxUsefulArea: 0.5,
		AmplitudeArrowLength: 10, // irrelevant if viewport scale is zero
		AmplitudeArrowColor: "#444444",
		AmplitudeArrowHighlight: "#FF7700",
		AmplitudeArrowWidth: 1.5,
		AmplitudeArrowHighlightWidth: 1.5*1.5,
		TotalAmplitudeArrowWidth: 3,
		ProbabilityBarWidth: 4,
		ProbabilityCurveWidth: 2,
		ScreenBG: "#333333",
		ScreenDot: "rgba(255,255,255,0.25)",
		ScreenDotSize: 2
	},

	/* ------------ ENGINE ATTRIBUTES ------------ */
	instance: null, // Application instance
	ready: false, // engine ready?
	debugMode: false, // used to create visual aids
	// Animation settings
	FPS: 30, // frames per second for animation
	C: 150, // speed of light (for the animation, only) in pixels / second
	ANIMATION_SPEED: 1, // animation speed factor
	FREQUENCY_ADJUST: 2.7323, // global frequency multiplier (for tweaks)

	/* ---------------- DEBUG HELPERS ------------------ */
	// Alert that prints out the structure of an object
	debugObject: function(o) {
		s = []; for (k in o) { s.push(k+": "+(typeof(o[k]) != "function"?o[k]:"f()")); }
		alert(s.join("\n"));
	},
	log:  function(t) { if (console) { console.log(t); } },

	// Data object must include:
	//	source: the abstract object that's triggering the event (eg. a Button instance)
	//	node: the HTML/SVG node that actually captures the event (usually Obj.container.node). This is a separate parameter since we
	//	      may want a parent object to handle an event (eg. mouseup/mousemove should be detected by the entire document)
	// It can also include "callback" specifying a function to be executed
	// The events receive this data object, and can be accessed by (event instance).data
	// References:
	// http://www.quirksmode.org/js/events_order.html (add bubbling setting?)
	// touch: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
	addEvent: function(data, e, f) {
		// One event only
		// ToDo: get rid of this hack by removing events manually in experiments
		if (e != "startdrag") this.removeEvent(data, e);

		// Note: Hammer, the JS Touch event library, fires touch events if a mouse is used
		// This way, we can add just the touch events to objects
		// Engine.log("+event "+e);
		switch(e) {
			// These event names (on the case statements) are "made out" for our application
			case "press":
				data.interval = 0;
				data.time = 0;
				$(data.node).hammer()
					.on("tap", data, function(e) { f(e); e.gesture.srcEvent.preventDefault(); }) // preventDefault() is a Hammer bugfix: avoids firing tap event twice for very short taps
					.remove("pan")
					.remove("multitap");
				break;
			case "drag":
				$(data.node)
					.hammer({'direction': Hammer.DIRECTION_ALL, 'threshold': 0, 'dragMinDistance': 0, 'dragLockMinDistance': 0 })
					.on("panmove", data, f)
					.data("hammer").get('pan').set({ direction: Hammer.DIRECTION_ALL });
				break;
			case "startdrag":
				$(data.node).hammer()
					.on("touchstart", data, f)
					.on("mousedown", data, f);
				break;
			case "enddrag":
				$(data.node).hammer()
					.on("touchend", data, f)
					.on("mouseup", data, f);
				break;
			default:
				$(data.node).on(e, data, f);
		}
	},
	removeEvent: function(data, e, f) {
		// Engine.log("-event "+e);
		// we always remove all event handlers for simplicity
		// we probably won't ever need more than one handler for the same event
		// and in such cases, we could just make a single handler execute two functions
		switch(e) {
			case "press":
				$(data.node).hammer()
					.off("tap");
				break;
			case "drag":
				$(data.node).hammer()
					.off("panmove");
				break;
			case "startdrag":
				$(data.node).hammer()
					.off("touchstart")
					.off("mousedown");
				break;
			case "enddrag":
				$(data.node).hammer()
					.off("touchend")
					.off("mouseup");
				break;
			default:
				$(data.node).off(e);
		}
	},

	// Get absolute/relative mouse pos depending on the relative context
	// Notice the "/ Engine.instance.scale" factor, which converts absolute screen pixels to relative scaled app pixels
	getEventMousePos: function(ev, rel) {
		if (rel) {
			if (ev.data.source.type == "object") {
				var bb = ev.data.source.container.getBBox();
				var o = {
					// Automatically accounts for scaling factor of main instance
					x: Math.floor((ev.pageX - $(rel).offset().left - bb.x) / Engine.instance.scale),
					y: Math.floor((ev.pageY - $(rel).offset().top - bb.y) / Engine.instance.scale)
				}
			} else if (ev.data.source.type == "paper") {
				var o = {
					// Automatically accounts for scaling factor of main instance
					x: Math.floor((ev.pageX - $(rel).offset().left) / Engine.instance.scale),
					y: Math.floor((ev.pageY - $(rel).offset().top) / Engine.instance.scale)
				}
			}
			return o;
		}
		return { x: ev.pageX, y: ev.pageY }
	},

	// Snap object o's coordinates to a grid of the given size
	// Object can be anything, as long as it uses .x and .y for coordinates
	snap: function(p, grid) {
		p.x = Math.round(p.x / grid)*grid;
		p.y = Math.round(p.y / grid)*grid;
	},

	// From: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
	colorBrightness: function(hex, lum) {
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		lum = lum || 0; var rgb = "#", c, i;
		for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i*2,2), 16); c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16); rgb += ("00"+c).substr(c.length); }
		return rgb;
	},

	getDegreesFromDistance: function(distance, color) {
		return 360 * ( distance / (Engine.STYLE.Colors[color].wavelength * Engine.LAMBDA) );
	},

	/* ------------ OPTIMIZERS ------------ */
	// sqrt, can be optimized by a root-finding algorithm
	// here, we use a highly optimized modification of Newton's method
	SQRT_CACHE: {},
	SQRT_PRECISION: 0.5,
	sqrt: function(a) {
		return Math.sqrt(a);
		a = Math.floor(a/Engine.SQRT_PRECISION)*Engine.SQRT_PRECISION;
		if (Engine.SQRT_CACHE[a]) return Engine.SQRT_CACHE[a];
		var x = 1;
		var lx = 2;
		var i = 1;
		while (1) {
			lx = x;
			x = (x*x*x + 3*a*x)/(3*x*x + a);
			// since we only need distance precision up to a pixel, this more than good enough
			if (Math.abs(lx - x) <= 1) {
				Engine.SQRT_CACHE[a] = x;
				return x;
			}
			i++;
		}
	},
	// We can greatly speed up trigonometric computations by caching sine and cosine into a lookup table
	// The number of samples defines our resolution. Setting it to 360 means we end up with 1 degree precision
	// This seems satisfactory. Larger values become impossible to notice, so we keep this as low as possible.
	SIN_CACHE_SAMPLES: 360,
	SIN_CACHE: null,
	sin: function(a) {
		alert("Don't use Engine.sin"); return
		// can Math.floor() be optimized?
		a = Math.floor(a/Engine.TAU*Math.sin_CACHE_SAMPLES) % Math.sin_CACHE_SAMPLES;
		// Make sure negative angles are properly shifted
		while (a < 0) a += Math.sin_CACHE_SAMPLES;
		if (Math.sin_CACHE) return Math.sin_CACHE[a];
		Math.sin_CACHE = [];
		for (i = 0;i < Math.sin_CACHE_SAMPLES;i++) {
			Math.sin_CACHE.push(Math.sin(i / Math.sin_CACHE_SAMPLES * Engine.TAU));
		}
		return Math.sin_CACHE[a];
	},
	// Cosine is just a shifted version of sine
	cos: function(a) {
		alert("Don't use Engine.cos"); return
		return Math.sin(a + Math.PI/2);
	},
	// Linear interpolation of array indices
	interpolate: function(array, i) {
		var il = Math.floor(i);
		var ir = Math.ceil(i);
		if (il < 0) il = 0;
		if (ir < 0) ir = 0;
		if (il >= (array.length-1)) il = (array.length-1);
		if (ir >= (array.length-1)) ir = (array.length-1);

		v = 0;

		v += array[il] * (1 - (i - Math.floor(i)))
		v += array[ir] *  (i - Math.floor(i))

		return v
	},

	/* ------------ ENGINE METHODS ------------ */
	init: function() {
		// $(window).resize(this.scaleEverything);
		$(document).ready(this.scaleEverything);
		this.scaleEverything();
	},

	// Applies new scaling factor to child objects
	scaleEverything: function() {
		if (!Engine.ready) return;
		if (!Engine.STYLE.AutoScale) return;
		var s,
			ww = window.innerWidth, wh = window.innerHeight,
			W = Engine.instance.width, H = Engine.instance.height;
		if (ww >= W && wh >= H) {
			s = 1;
		} else {
			s = Math.min(ww/W, wh/H);
		}
		Engine.instance.setScale(s);
	},

	// Initialize instance
	create: function(id, w, h) {
		if (this.ready) return;
		this.ready = true;
		this.instance = new Engine.Application(id, w, h);
		return this.instance;
	},



	/* ------------ BASE CLASSES ------------ */
	// RaphaelPaper is a Raphael container inside a <div>
	// It acts as canvas we can draw on and add virtual objects (RaphaelObjects)
	RaphaelPaper: function(n, w, h) {
		this.type = "paper";
		this.name = n;
		this.div = document.createElement("div");
		this.div.id = this.name;
		this.paper = new Raphael(this.div, w, h);
		this.width = w;
		this.height = h;
		this.scale = 1;
		this.children = {}
		this.x = null;
		this.y = null;

		with (this.div.style) {
			width = w + "px";
			height = h + "px";
			position = "relative";
			overflow = "hidden";
			borderRadius = "1px";
			webkitAppearance = "none";
		}

		// Remove child object
		this.remove = function(item) {
			if (!this.children[item.name]) return;
			var item = this.children[item.name].item;
			if (!item) return;
			delete this.children[item.name];
			if (item.type == "paper") {
				// todo: check this, it should work
				item.div.parentNode.removeChild(item.div);
			} else if (item.type == "object") {
				item.container.node.parentNode.removeChild(item.container.node);
			}
		}

		// Add child object
		this.add = function(item, px, py, fade) {
			this.children[item.name] = {
				item: item,
				x: px,
				y: py
			};
			if (item.type == "paper") {
				item.x = px;
				item.y = py;
				with (item.div) {
					style.position = "absolute";
					style.left = px + "px";
					style.top = py + "px";
				}
				this.div.appendChild(item.div);
			} else if (item.type == "object") {
				if (item.parent) {
					delete item.parent.children[item.name];
					// todo: consider objects within objects?
					item.container.node.parentNode.removeChild(item.container.node);
				}
				item.parent = this;
				item.init(px, py);
				item.updateAttributes();
				if (fade) {
					$(item.container.node).hide().fadeIn();
				}
			}
			this.setScale(this.scale, true);
		}

		this.onTop = function() {
			if (!this.div.parentNode) return;
			this.div.parentNode.appendChild(this.div);
		}

		this.showShadow = function() {
			$(this.div).css("box-shadow","10px 10px 5px #000000;");
		}
		this.hideShadow = function() {
			$(this.div).css("box-shadow","");
		}

		this.setScale = function(s, force) {
			if (this.scale == s && !force) return;
			this.scale = s;
			with(this.div.style) {
				width = Math.floor(this.width * s) + "px";
				height = Math.floor(this.height * s) + "px";
			}
			this.paper.setViewBox(0, 0, Math.floor(this.width / s), Math.floor(this.height / s), true);
			for(var n in this.children) {
				var c = this.children[n];
				var item = c.item;
				if (item.type == "paper") {
					var w = item.width, h = item.height;
					with(item.div.style) {
						left = Math.floor(c.x * s) + "px";
						top = Math.floor(c.y * s) + "px";
						width = Math.floor(w * s) + "px";
						height = Math.floor(h * s) + "px";
					}
					item.paper.setViewBox(0, 0, Math.floor(item.width / s), Math.floor(item.height / s), true);
					if (item.setScale) item.setScale(s);
				}
				if (item.type == "other") {
					var w = item.width, h = item.height;
					with(item.div.style) {
						left = Math.floor(c.x * s) + "px";
						top = Math.floor(c.y * s) + "px";
						width = Math.floor(w * s) + "px";
						height = Math.floor(h * s) + "px";
					}
					item.setScale(s);
				}
			}
		}

		this.setCursor = function(cursor) {
			this.cursor = cursor;
			this.updateCursor();
		}

		this.updateCursor = function() {
			if (!this.paper || !this.paper.canvas.style) return;
			this.paper.canvas.style.cursor = this.cursor;
		}


		// "Blink" is the flashing effect to catch the eye of the user
		// This is used around boxes where the user must click or interact with
		// This is not available for RaphaelObject entries, because Raphael's glow is
		// made out of dozens of copies of the object on top of each other, which is extremely slow
		this.k = 0; // blink animation clock
		this.kt = 20; // duration in clock ticks
		this.blinkTimer = 0; // timer ID for animation
		this.blinkHold = false; // should we hold the "glow"?

		// Force remove glow
		this.resetBlink = function() {
			clearInterval(this.blinkTimer);
			this.k = 0;
			this.kt = 20;
			this.blinkTimer = 0;
			this.blinkHold = false;
			$(this.div).css('box-shadow',"");
		}

		this.blink = function() {
			if (this.blinkTimer) return;
			this.blinkOn(false);
		}

		this.blinkOn = function(hold) {
			if (this.blinkTimer) return;
			this.k = 0;
			this.blinkTimer = setInterval(this.animateBlink.bind(this), 1000/this.kt);
			this.blinkHold = hold;
		}

		this.blinkOff = function() {
			if (this.blinkTimer) clearInterval(this.blinkTimer);
			if (!this.k) return;
			this.k = this.kt/2;
			this.blinkHold = false;
			this.blinkTimer = setInterval(this.animateBlink.bind(this), 1000/this.kt);
		}

		this.animateBlink = function() {
			this.k++;
			if (this.blinkHold && this.k >= this.kt/2) {
				clearInterval(this.blinkTimer);
				this.blinkTimer = 0;
				this.blinkHold = false;
				return;
			}
			if (this.k > this.kt) {
				clearInterval(this.blinkTimer);
				this.blinkTimer = 0;
				this.blinkHold = false;
				$(this.div).css('box-shadow',"");
				return;
			}
			var i = Math.pow(Math.sin(this.k/this.kt*Math.PI),2);
			$(this.div).css('box-shadow', "0 0 "+Math.floor(i*15)+"px "+Math.floor(i*5)+"px "+Engine.STYLE.BlinkColor);
		}

		this.hide = function() { this.div.style.display = "none"; }
		this.show = function() { this.div.style.display = ""; }

	},
	// RaphaelObject are children objects for a RaphaelPaper object
	// This is the base class definition. All other objects extend this class.
	// Example objects would be buttons, the detector, etc
	RaphaelObject: function(name) {
		this.type = "object";
		this.name = name;
		this.parent = null;
		this.container = null;
		this.x = null;
		this.y = null;
		this.ox = null;
		this.oy = null;
		this.rotation = 0;
		this.cursor = "default"; // mouse cursor to use when mouse is over object
		this.title = "";
		this.draggable = false;
		this.snap = 1; // grid snap size. 1 = no snapping
		this.dragBounds = null;
		this.dragFrom = null; // position where cursor is holding the object from. eg: {x:1,y:2}
		this.dragCount = 0;

		this.init = function(x, y) { }

		this.onTop = function() {
			if (!this.container.node || !this.container.node.parentNode) return;
			this.container.node.parentNode.appendChild(this.container.node);
		}

		this.setCursor = function(cursor) {
			this.cursor = cursor;
			this.updateCursor();
		}

		this.updateCursor = function() {
			if (!this.container || !this.container.node.style) return;
			this.container.node.style.cursor = this.cursor;
		}

		// When user puts the mouse on top of the object, a tooltip will show this
		this.setTitle = function(title) {
			this.title = title;
			this.updateTitle();
		}

		this.updateTitle = function() {
			if (!this.container || !this.container.node) return;
			this.container.node.setAttribute('title',this.title);
		}

		this.updateAttributes = function() {
			this.updateCursor();
			this.updateTitle();
		}

		this.setPosition = function(px, py) {
			// returns true/false if position was or was not changed
			if (this.x == px && this.y == py) return false;
			this.container.translate(px, py);
			this.x = px; this.y = py;
			return true;
		}

		this.setRotation = function(angle) {
			// returns true/false if position was or was not changed
			if (this.rotation == angle) return false;
			this.rotation = angle;
			if (this.container) {
				this.container.rotate(angle);
			}
			return true;
		}

		// ToDo: make this asynchronous from this.container
		this.enableDrag = function() {
			if (!this.container || typeof(this.container.node) == "undefined") {
				Engine.log("enableDrag invoked before object initialization");
				return;
			}
			this.draggable = true;
			var d = { source: this, node: this.container.node };
			Engine.addEvent(d, "startdrag", this.evStartDrag );
			Engine.addEvent(d, "drag", this.evDrag );
			// $(this.container.node)
				// .hammer({'direction': Hammer.DIRECTION_ALL, 'threshold': 0, 'dragMinDistance': 0, 'dragLockMinDistance': 0 })
				// .on("panmove", d, this.evDrag)
				// .on("touchstart", d, this.evStartDrag)
				// .on("mousedown", d, this.evStartDrag)
				// .data("hammer").get('pan').set({ direction: Hammer.DIRECTION_ALL });
		}

		this.evStartDrag = function(e) {
			var s = e.data.source;
			s.ox = s.x;
			s.oy = s.y;
			$(s.container.node).trigger("startdrag");
			s.dragCount = 0;
			e.preventDefault(); e.stopPropagation();
		}

		this.evDrag = function(e) {
			var s = e.data.source;
			var dx = e.gesture.deltaX / s.parent.scale;
			var dy = e.gesture.deltaY / s.parent.scale;
			// Engine.log("pan "+e.gesture.deltaX+" "+e.gesture.deltaY);

			var px = s.ox + dx;
			var py = s.oy + dy;

			px = Math.round(Math.min(s.dragBounds.x[1],Math.max(s.dragBounds.x[0], px)) / s.snap) * s.snap;
			py = Math.round(Math.min(s.dragBounds.y[1],Math.max(s.dragBounds.y[0], py)) / s.snap) * s.snap;

			// if position was truly changed, fire the change event
			if (s.setPosition(px, py)) {
				$(s.container.node).trigger("moved");
				s.dragCount++;
				if (s.dragCount == 1) {
					$(s.container.node).trigger("firstdrag");
				}
			}

			// s.setPosition(s.ox + dx, s.oy + dy);
		}

		this.disableDrag = function() {
			this.draggable = false;
			$(this.container.node)
				.hammer({'direction': Hammer.DIRECTION_ALL, 'threshold': 0, 'dragMinDistance': 0 })
				.off("panmove", this.evDrag)
				.off("touchstart", this.evStartDrag)
				.off("mousedown", this.evStartDrag);
		}

		// xRange = [min x, max x]
		// yRange = [min y, max y]
		// Set min and max equal to force a linear path
		this.setDragBounds = function(xRange, yRange) {
			this.dragBounds = { x: xRange, y: yRange };
		}

		this.setOpacity = function(opacity) {
			if (!this.container.node) return;
			this.container.node.style.opacity = opacity;
		}

	},

	/* ------------ RaphaelPaper CHILD CLASSES ------------ */
	Application: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);
		with (this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}
		// Initial drawing
		with(this.paper) {
			var r = rect(0, 0, w, h);
			r.attr({ stroke:"none", fill: Engine.STYLE.AppBG });
		}

		this.labelManager = new Engine.LabelManager(this);
		this.arrowManager = new Engine.ArrowManager(this);

		this.loaderLayer = document.createElement("div");
		this.loaderLayer.id = "loaderlayer";
		var lb = document.createElement("div");
		$(lb).attr('id',"loader")
			 .css('left',this.width/2-150).css('top',this.height/2-75)
			 .append(
				$("<p>").html("PLEASE WAIT").append(
					$("<img>")
						.attr('src',Engine.assetURL("loader.gif"))
						.attr('width',220)
						.attr('height',19)
					)
			 );
		$(this.loaderLayer).css('width',this.width).css('height',this.height).append(lb);

		// Controller for the layer with labels
		// The optional parameter ontop is an ARRAY of RaphaelPaper child classes
		// These are layered on top of the label layer in the order they show up in the array
		this.showLabelLayer = function(ontop) { this.labelManager.show(); this.labelLayerOntop(ontop); }
		this.hideLabelLayer = function(ontop) { this.labelManager.hide(); this.labelLayerOntop(ontop); }
		this.toggleLabelLayer = function(ontop) { this.labelManager.toggle(); this.labelLayerOntop(ontop); }

		this.labelLayerOntop = function(ontop) {
			if (ontop && ontop.length) {
				var o;
				for(var i in ontop) {
					o = ontop[i];
					if (o.type == "paper") {
						$(this.div).append($(o.div));
					}
				}
			}
		}


		// A "loading" screen
		// Originally was intended for waiting during computations, but it
		// turns out intense computations don't play well with this
		// This might be useful in the future
		this.showLoader = function() {
			$(this.div).append(this.loaderLayer);
			$(this.loaderLayer).hide();
			// $(this.loaderLayer).delay(2000).fadeIn();
			$(this.loaderLayer).fadeIn();
		}

		this.hideLoader = function() {
			$(this.loaderLayer).stop().clearQueue();
			$(this.loaderLayer).fadeOut();
		}

		this.add(this.labelManager, 0, 0);
		this.add(this.arrowManager, 0, 0);

	},

	// Experiment "table" with the grid, walls, etc
	ExperimentBox: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);
		with (this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		// Initial drawing
		with(this.paper) {
			var r = rect(0, 0, w, h);
			r.attr({stroke: "none",'fill':"url("+Engine.assetURL("grid.png")+")"});
			var l = image(Engine.assetURL("label_photonpaths.png"), 5, -1, 199, 43);
		}

		this.lightLayerContainer = this.paper.group();

		this.lightLayers = [];
		this.addLightLayer = function(lightLayer) {
			lightLayer.init(this);
			this.lightLayers.push(lightLayer);
			return this.lightLayers.length-1;
		}
		this.getLightLayer = function(i) {
			return this.lightLayers[i];
		}
		this.clearLightLayers = function() {
			for(var i in this.lightLayers) {
				this.lightLayers[i].clear();
				delete this.lightLayers[i];
			}
			delete this.lightLayer;
			this.lightLayers = [];
		}

		this.clearMarkers = function() {
			for(var i in this.children) {
				if (this.children[i].item.marker) this.remove(this.children[i].item);
			}
		}

	},

	// Probability distribution window
	// ToDo: continuous line, support for multiple curves?
	GraphBox: function(n, w, h, max) { Engine.RaphaelPaper.call(this, n, w, h);
		this.probabilityScale = 1;
		this.distribution = [];
		this.graphScale = [];
		this.barList = [];

		this.setProbabilityScale = function(pS) {
			this.probabilityScale = pS;
		}

		if (typeof(max) == "undefined") max = 100;

		with(this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		// Initial drawing
		with(this.paper) {
			rect(0, 0, w, h).attr({
				'fill': "url("+Engine.assetURL("probability_box.png")+")",
				'stroke': "none"});
			print(20, 13, "Probability", getFont("Roboto"), 16, "middle").attr({'stroke': "none", 'fill': "#606060"});
			// print(16, 30, "of detection", getFont("Roboto"), 16, "middle").attr({'stroke': "none", 'fill': "#606060"});
		}
		this.graph = this.paper.group();

		for(var i = 0; i < Math.ceil(h/10); i++) this.distribution.push(0);

		// y is relative to the CENTER of the graph box
		// p is the probability
		this.drawBar = function(y, p, color) {
			// probability is the square of the mod of amplitude
			p /= this.probabilityScale;
			if (p < 1e-3) return;
			var r = this.paper.rect(
				0,
				this.height/2 + (y - Engine.STYLE.ProbabilityBarWidth/2),
				this.width*p,
				Engine.STYLE.ProbabilityBarWidth
			).attr({
				'stroke': "none",
				'fill': Engine.STYLE.Colors[color].color
			});
			this.distribution[Math.floor(y/10)+Math.floor(this.height/2/10)] = p;
			this.graph.push(r);
			this.barList.push(r);
		}

		this.drawScale = function(max) {
			for(var i in this.graphScale) this.graphScale[i].remove();
			this.graphScale = [];
			for(var i = 1; i <= 3; i++) {
				var tn = Math.round(i/4*max*10)/10;
				if ((tn-Math.floor(tn)) == 0) {
					this.graphScale.push( this.paper.print(i*30-10, h-8, tn+"%", this.paper.getFont("Roboto"), 14, "middle").attr({'stroke': "none", 'fill': "#303030"}) );
				} else {
					this.graphScale.push( this.paper.print(i*30-12, h-8, tn+"%", this.paper.getFont("Roboto"), 14, "middle").attr({'stroke': "none", 'fill': "#303030"}) );
				}
			}
		}
		this.drawScale(max);

		this.clear = function() {
			// Engine.debugObject(this.graph);
			var n = this.graph.node;
			n.parentNode.removeChild(n);
			delete this.graph;
			this.graph = this.paper.group();
		}

		this.drawDistribution = function(data, color) {
			if (data.length <= 1) return
			this.distribution = [];
			var y, ps = "", k = 0, used = {};
			for(var i = 0;i < data.length;i++) {
				y = this.height * i/(data.length-1);
				if (used[Math.floor(y/10)]) continue;
				this.distribution[Math.floor(y/10)] = data[i];
				used[Math.floor(y/10)] = 1;
				if (y < 30 || y > this.height-30) continue;
				this.drawBar(y-this.height/2, data[i], color);
			}
		}

		this.coverTopHalf = function() {
			with(this.paper) {
				rect(0, 0, this.width, this.height/2 - 10).attr({
					'fill': "#000000",
					'opacity': 1/3,
					'stroke': "none"});
			}
		}

	},

	// Detection screen
	ScreenBox: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);

		this.distribution = null;

		with(this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		$(this.paper.canvas).hide();

		this.canvas = document.createElement('canvas');
		this.canvas.width = w;
		this.canvas.height = h;

		with(this.canvas.style) {
			position = "absolute";
			left = 0;
			top = 0
		}

		this.div.appendChild(this.canvas);

		this.clear = function() {
			var ctx = this.canvas.getContext("2d");
			ctx.fillStyle = Engine.STYLE.ScreenBG;
			ctx.fillRect(0,0, this.width, this.height);
		}

		this.drawDot = function(x, y) {
			var ctx = this.canvas.getContext("2d");

			ctx.fillStyle = Engine.STYLE.ScreenDot;
			var o = Engine.STYLE.ScreenDotSize/2;
			ctx.fillRect(x - o, y - o, Engine.STYLE.ScreenDotSize, Engine.STYLE.ScreenDotSize);

		}

		this.detectParticle = function(atLeastOne) {
			if (!this.distribution) return;
			var y, x, p;
			while(1) {
				y = Math.random();
				p = Engine.interpolate(this.distribution, y*this.distribution.length);
				if (p <= 0 && !atLeastOne) return { 'x': -1, 'y': -1 };
				if (Math.random() <= p) {
					x = Math.random();
					this.drawDot(
						x * this.width*this.scale,
						y * this.height*this.scale
					);
					return { 'x': x * this.width, 'y': y * this.height };
				}
				if (!atLeastOne) return { 'x': -1, 'y': -1 };
			}
		}

		this.setDistribution = function(data) {
			this.distribution = data;
		}

		this.clear();
	},

	// Photon counter -DC
	PhotonCounter: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);

		var paper = this.paper;

		// Graphics

		// metal container
		var container = paper.rect(1, 1, w-2, h-2).attr({
			'fill': '#aaaaaa',
			'stroke': '#555555',
			'stroke-width': 2
		});

		// Screen
		var screen = paper.rect(5, 5, w-10, h-10).attr({
			'stroke': '#999999',
			'fill': '135-#000-#333:45-#000'
		});

		// Count number

		var number = {
			'value': 0,
			'text':
				paper.text(35, 34, '0').attr({
					'fill': '#fff',
					'font-size': 24
				})
		}

		// Increase number
		this.inc = function() {
			number['value']++;
			number['text'].remove();
			number['text'] = paper.text(35, 24, number['value'].toString()).attr({
				'fill': '#fff',
				'font-size': 24
			});

			this.value = number['value'];
		}

		// Reset counter
		this.reset = function() {
			number['value'] = 0;
			number['text'].remove();
			number['text'] = paper.text(35, 24, number['value'].toString()).attr({
				'fill': '#fff',
				'font-size': 24
			});

			this.value = number['value'];
		}

		// Label

		var label = {};
		Engine.RaphaelPaper.call(label, "counter label", w+50, 30);

		var text = label.paper.print(0, 15, 'Photon Counter', this.paper.getFont('Roboto'), 16, 'middle').attr({
			'stroke': 'none',
			'fill': '#fff'
		})

		var stroke = text.clone().attr({
			'stroke': '#000',
			'stroke-width': 4,
			'stroke-opacity': 0.4
		});
		stroke.toBack();

		this.label = label;
	},

	// Detection screen
	ScreenBox: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);

		this.distribution = null;

		with(this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		$(this.paper.canvas).hide();

		this.canvas = document.createElement('canvas');
		this.canvas.width = w;
		this.canvas.height = h;

		with(this.canvas.style) {
			position = "absolute";
			left = 0;
			top = 0
		}

		this.div.appendChild(this.canvas);

		this.clear = function() {
			var ctx = this.canvas.getContext("2d");
			ctx.fillStyle = Engine.STYLE.ScreenBG;
			ctx.fillRect(0,0, this.width, this.height);
		}

		this.drawDot = function(x, y) {
			var ctx = this.canvas.getContext("2d");

			ctx.fillStyle = Engine.STYLE.ScreenDot;
			var o = Engine.STYLE.ScreenDotSize/2;
			ctx.fillRect(x - o, y - o, Engine.STYLE.ScreenDotSize, Engine.STYLE.ScreenDotSize);

		}

		this.detectParticle = function(atLeastOne) {
			if (!this.distribution) return;
			var y, x, p;
			while(1) {
				y = Math.random();
				p = Engine.interpolate(this.distribution, y*this.distribution.length);
				if (p <= 0 && !atLeastOne) return { 'x': -1, 'y': -1 };
				if (Math.random() <= p) {
					x = Math.random();
					this.drawDot(
						x * this.width*this.scale,
						y * this.height*this.scale
					);
					return { 'x': x * this.width, 'y': y * this.height };
				}
				if (!atLeastOne) return { 'x': -1, 'y': -1 };
			}
		}

		this.setDistribution = function(data) {
			this.distribution = data;
		}

		this.clear();
	},

	// Amplitude arrows
	AmplitudeBox: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);

		this.amplitudeArrows = [];
		this.viewport = null;
		this.viewportScale = 0;
		this.label = null;
		this.labelText = null;
		this.probabilityText = null;
		this.mockAmplitude = null;

		with(this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		// Initial drawing
		var r = this.paper.rect(0, 0, w, h);
		r.attr({stroke: "none", fill:"#EDE7DD"});
		// Axes
		this.paper.path("M "+w/2+" 0 L "+w/2+" "+h).attr({'stroke':"#BBB"});
		this.paper.path("M 0 "+h/2+" L "+w+" "+h/2).attr({'stroke':"#BBB"});

		this.drawLabel = function(labelText) {
			if (this.label) {
				this.label.remove();
			}
			this.labelText = labelText;
			this.label = this.paper.print(5, this.height-16*(this.labelText?3:2), "Amplitude\nArrow"+(this.amplitudeArrows.length != 1?"s":"")+(this.labelText?"\n"+this.labelText:""), this.paper.getFont("Roboto"), 16, "middle").attr({'stroke': "none", 'fill': "#606060"});
		}
		this.drawLabel();

		this.drawAmplitudes = function(lightLayer) {
			this.clear();
			// delete this.amplitudeArrows;
			// this.totalAmplitudeArrow = null;
			var p = this.paper;
			this.amplitudeArrows = [];
			var data = this.computeAmplitudeData(lightLayer.getAmplitudes());

			var s;
			if (this.viewportScale) {
				s = this.viewportScale;
			} else {
				s = Math.min(this.width/data.boundingbox.width, this.height/data.boundingbox.height)*Engine.STYLE.AmplitudeBoxUsefulArea;
			}
			var ps;
			for(var i in data.coords) {
				ps = "M " + data.coords[i][0]*s + " " + data.coords[i][1]*s + " L " + data.coords[i][2]*s + " " + data.coords[i][3]*s;
				a = p.path(ps)
					 .attr({"stroke": Engine.STYLE.AmplitudeArrowColor, "arrow-end": "block-wide-long", 'stroke-width': Engine.STYLE.AmplitudeArrowWidth});

				ah = p.path(ps)
					 .attr({"stroke": Engine.STYLE.AmplitudeArrowHighlight, "arrow-end": "block-wide-long", 'stroke-width': Engine.STYLE.AmplitudeArrowHighlightWidth});

				ag = ah.glow({width: 10, fill: true, opacity: Engine.STYLE.GlowOpacity, offsetx: 0, offsety: 0, color: Engine.STYLE.GlowColor});
				ag.hide();
				ah.hide();

				var ao = { 'arrow': a, 'highlight': ah, 'glow': ag, 'id': this.amplitudeArrows.length };

				this.viewport.push(ag);
				this.viewport.push(ah);
				this.amplitudeArrows.push(ao);
				this.viewport.push(a);
			}

			this.totalAmplitudeArrow = p.path("M 0 0 L " + data.total.x*s + " " + data.total.y*s)
										.attr({"stroke": lightLayer.color, "arrow-end": "block-long-long", 'stroke-width': Engine.STYLE.TotalAmplitudeArrowWidth});
			this.totalAmplitudeArrow.hide(); // hidden by default
			this.viewport.push(this.totalAmplitudeArrow);


			this.viewport.translate(
				this.width/2 - (data.boundingbox.minx + data.boundingbox.width/2)*s
				,
				this.height/2 - (data.boundingbox.miny + data.boundingbox.height/2)*s
			);

		}

		this.drawMockAmplitude = function(angleDeg) {

			var s = (this.viewportScale?this.viewportScale:1);
			var p = this.paper;
			coords = [];
			angle = (angleDeg*Engine.DEG2RAD)+Engine.TAU/4;

			coords[0] = this.width/2 + Math.cos(angle)*Engine.STYLE.AmplitudeArrowLength/2*s;
			coords[1] = this.height/2 + Math.sin(angle)*Engine.STYLE.AmplitudeArrowLength/2*s;
			coords[2] = this.width/2 - Math.cos(angle)*Engine.STYLE.AmplitudeArrowLength/2*s;
			coords[3] = this.height/2 - Math.sin(angle)*Engine.STYLE.AmplitudeArrowLength/2*s;

			ps = "M "+ coords[0] + " " + coords[1] +" L " + coords[2] + " " + coords[3];

			if (this.mockAmplitude) {

				this.mockAmplitude.arrow.attr('path',ps);
				// this.mockAmplitude.highlight.attr('path',ps);
				// for(var i in this.mockAmplitude.ag) {
					// this.mockAmplitude.glow[i].attr('path',ps);
				// }
			} else {
				var a = p.path(ps)
					 .attr({"stroke": Engine.STYLE.AmplitudeArrowColor, "arrow-end": "block-wide-long", 'stroke-width': Engine.STYLE.AmplitudeArrowWidth});

				var ah = p.path(ps)
					 .attr({"stroke": Engine.STYLE.AmplitudeArrowHighlight, "arrow-end": "block-wide-long", 'stroke-width': Engine.STYLE.AmplitudeArrowHighlightWidth});

				var ag = ah.glow({width: 10, fill: true, opacity: Engine.STYLE.GlowOpacity, offsetx: 0, offsety: 0, color: Engine.STYLE.GlowColor});
				ag.hide();
				ah.hide();

				var ao = { 'arrow': a, 'highlight': ah, 'glow': ag, 'id': this.amplitudeArrows.length };

				this.clear();
				this.mockAmplitude = ao;
				this.viewport.push(ag);
				this.viewport.push(ah);
				this.viewport.push(a);
			}
		}

		this.drawProbabilityText = function(scale) {
			if(!scale) scale = 1;
			if (this.probabilityText) return;
			this.probabilityText = this.paper.print(6, 15,
				"Final arrow: "+(Math.round(this.getTotalAmplitudeLength()*scale*100)/100)+"x unit arrow\n"+
				"Probability: "+Math.round(10000*Math.pow(this.getTotalAmplitudeLength()*scale,2))/100+"%"
				, this.paper.getFont("Roboto"), 16, "middle").attr({'stroke': "none", 'fill': "#606060"});
		}

		this.drawNormalizedText = function(pS) {
			var ampScale = Math.pow(pS,0.5);
			if (this.probabilityText) return;
			this.probabilityText = this.paper.print(6, 15,
				"Final arrow: "+(Math.round(this.getNormalizedTotalAmplitude()*ampScale*100)/100)+"x unit arrow\n"+
				"Probability: "+Math.round(10000*Math.pow(this.getNormalizedTotalAmplitude(),2)*pS)/100+"%"
				, this.paper.getFont("Roboto"), 16, "middle").attr({'stroke': "none", 'fill': "#606060"});
		}

		this.clearProbabilityText = function() {
			if (!this.probabilityText) return;
			this.probabilityText.remove();
			delete this.probabilityText;
			this.probabilityText = null;
		}

		this.computeAmplitudeData = function(amps) {

			this.totalAmplitudeLength = 0;
			var maxAmplitudeLength = 0;
			var x = 0, lx = 0, y = 0, ly = 0;
			var bb = { minx: 0, miny: 0, maxx: 0, maxy: 0, width: 1, height: 1 }
			var total = {};
			var coords = [];

			for(var i = 0;i < amps.length;i++) {
				x = lx + Engine.STYLE.AmplitudeArrowLength*amps[i].amplitude*Math.cos(amps[i].phase-Engine.TAU/4);
				y = ly + Engine.STYLE.AmplitudeArrowLength*amps[i].amplitude*Math.sin(amps[i].phase-Engine.TAU/4);
				coords.push([lx, ly, x, y]);
				if (x < bb.minx) bb.minx = x;
				if (y < bb.miny) bb.miny = y;
				if (x > bb.maxx) bb.maxx = x;
				if (y > bb.maxy) bb.maxy = y;
				lx = x;
				ly = y;
				maxAmplitudeLength += amps[i].amplitude;
			}
			total.x = x;
			total.y = y;

			// Don't normalize like this, or smaller single arrows
			// this.totalAmplitudeLength = Math.sqrt(
					// Math.pow(total.x,2) + Math.pow(total.y,2)
				// ) / (maxAmplitudeLength*Engine.STYLE.AmplitudeArrowLength);// this.totalAmplitudeLength = Math.sqrt(


			this.totalAmplitudeLength = Math.sqrt(
					Math.pow(total.x,2) + Math.pow(total.y,2)
				) / (Engine.STYLE.AmplitudeArrowLength);// this.totalAmplitudeLength = Math.sqrt(

			bb.width = Math.max(1, bb.maxx - bb.minx);
			bb.height = Math.max(1, bb.maxy - bb.miny);
			bb.x = bb.minx;

			return {'boundingbox': bb, 'coords': coords, 'total': total };
		}

		// Length in unit arrows
		this.getTotalAmplitudeLength = function() {
			return this.totalAmplitudeLength;
		}

		// Length in unit arrows divided by the number of arrows
		// Assuming all arrows are unit arrows at the same angle, this results in 1
		this.getNormalizedTotalAmplitude = function() {
			return this.totalAmplitudeLength / this.amplitudeArrows.length;
		}

		this.hideTotalAmplitudeArrow = function() {
			if (!this.totalAmplitudeArrow) return;
			if (this.totalAmplitudeArrow) this.totalAmplitudeArrow.hide();
			if (this.useTotalAmplitudeLengthText && this.totalAmplitudeLengthText) this.totalAmplitudeLengthText.hide();
		}

		this.showTotalAmplitudeArrow = function() {
			if (!this.totalAmplitudeArrow) return;
			this.totalAmplitudeArrow.show();
			if (this.useTotalAmplitudeLengthText && this.totalAmplitudeLengthText) this.totalAmplitudeLengthText.show();
		}

		this.toggleTotalAmplitudeArrow = function() {
			if (!this.totalAmplitudeArrow) return;
			// this.totalAmplitudeArrow.attr('display')
			if (this.totalAmplitudeArrow.node.style.display != "") {
				this.showTotalAmplitudeArrow();
			} else {
				this.hideTotalAmplitudeArrow();
			}
		}

		this.setTotalAmplitudeColor = function(color) {
			if (this.totalAmplitudeArrow) this.totalAmplitudeArrow.attr('stroke',Engine.STYLE.Colors[color].color);
		}

		this.clear = function() {
			if (this.viewport) {
				this.viewport.node.parentNode.removeChild(this.viewport.node);
				for(var i in this.viewport.node.childNodes) {
					delete this.viewport.node.childNodes[i];
				}
				delete this.viewport.node;
				delete this.viewport;
			}
			this.viewport = this.paper.group();
			if (this.totalAmplitudeArrow) this.totalAmplitudeArrow.remove();
			delete this.mockAmplitude;
			this.mockAmplitude = null;
		}

		this.setGlow = function(id, state) {
			if (!this.amplitudeArrows[id]) return;
			// this.amplitudeArrows[id].arrow.attr({ 'stroke': (state? Engine.AmplitudeArrowHighlight : Engine.STYLE.AmplitudeArrowColor ) });
			if (state) {
				this.amplitudeArrows[id].glow.toFront().show();
				this.amplitudeArrows[id].highlight.toFront().show();
				this.amplitudeArrows[id].arrow.attr({'opacity':0});
			} else {
				this.amplitudeArrows[id].glow.hide();
				this.amplitudeArrows[id].highlight.hide();
				this.amplitudeArrows[id].arrow.attr({'opacity':1});
			}
		}

		this.numArrows = function() { return this.amplitudeArrows.length; }

	},

	// MessageBox (now instruction box)
	// This is not a Raphael object. It's just a plain HTML div with HTML text
	// We leave the browser to manage scrollbars and rendering
	MessageBox: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);
		// Initial drawing

		with(this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		with(this.paper) {
			var r = rect(0, 0, w, h);
			r.attr({"fill": "90-#D0D0D0-#FFFFFF"});
			r.attr({stroke: "none"});
		}

		var b = 0;
		this.content = document.createElement('div');
		var c = $(this.content).addClass("messagebox")
			.css('left',0).css('top',0)
			.width(this.width-10).height(this.height);
		$(this.div).append(c);

		this.setMessage = function(text, holdblink) {
			text += "\n\n";
			$(this.content).fadeOut(200,function(){
				$(this)
					.css('display','').css('visibility','hidden') // jQuery uses display=none after fade, which makes scrollTop() not work
					.scrollTop(0).html(text.split("\n").join("<br/>"))
					.css('display','none').css('visibility','')
					.fadeIn(200);
			});
			this.resetBlink();
			if (holdblink) {
				this.blinkOn(true);
			} else {
				this.blink();
			}
		}

		this.setScale = function(s) {
			this.scale = s;
			$(this.content)
				.width(this.width*this.scale-10)
				.height(this.height*this.scale);
		}
	},

	// Container of the clocks
	ClockBox: function(n, w, h) { Engine.RaphaelPaper.call(this, n, w, h);
		with(this.div.style) {
			outline = Engine.STYLE.BoxBorder;
		}

		// Initial drawing
		with(this.paper) {
			var r = rect(0, 0, w, h);
			r.attr({stroke:'none', fill:Engine.STYLE.ClockBoxBG});
			// The label. I decided to remove as it just occupies space, and once explained it is not necessary anymore.
			//var l = rect(15,415,100,25);
			// l.attr('fill',"url('./images/clocks_label.png')");
			//l.attr({stroke:'none',opacity:1});
		}

		this.cid = 0;
		this.radius = 25;
		this.padding = 10;
		this.numColumns = Math.floor((this.width - this.padding) / (this.radius * 2 + this.padding));
		this.clockList = [];

		// Todo: clocks.clear() might not be working 100% right
		this.clear = function() {
			this.cid = 0;
			var c;
			for(var i in this.children) {
				c = this.children[i];
				this.remove(c);
				delete this.children[i];
				delete c;
			}
		}

		this.numClocks = function() { return this.clockList.length; }

		this.setPadding = function(p) {
			this.padding = p;
			this.updateNumCols();
		}

		this.setRadius = function(r) {
			this.radius = r;
			this.updateNumCols();
		}

		// Number of columns available given the given clock radius and padding
		this.updateNumCols = function() {
			this.numColumns = Math.floor((this.width - this.padding) / (this.radius * 2 + this.padding));
		}

		this.addClock = function(color) {
			var c = new Engine.Clock("clock" + this.cid, this.radius, color);
			this.cid++;
			var nc = this.clockList.length;
			this.add(c,
				this.padding + this.radius + (this.radius*2 + this.padding) * (nc % this.numColumns),
				this.padding + this.radius + (this.radius*2 + this.padding) * Math.floor(nc / this.numColumns)
			);
			this.clockList.push(c);
			return c;
		}

		this.reset = function() {
			for(var i in this.clockList) {
				this.clockList[i].setAngle(0);
			}
		}

		this.clear = function() {
			var c;
			while(this.clockList.length) {
				c = this.clockList.pop();
				c.container.node.parentNode.removeChild(c.container.node);
				delete c;
			}
			this.cid = 0;
			while (this.clockList.length) delete this.clockList.pop();
			delete this.clockList;
			this.clockList = [];
		}

		this.setGlow = function(id, state) {
			if (this.clockList[id]) this.clockList[id].setGlow(state);
		}

		this.setAllColor = function(color) {
			for(var i = 0;i < this.clockList.length;i++) {
				this.clockList[i].setColor(color);
			}
		}

	},




	/* ------------ RaphaelObject CHILD CLASSES ------------ */

	// Generic button with given dimensions and hue (0°-360°)
	// Specific buttons are instances of this class
	Button: function(n, width, height, hue) { Engine.RaphaelObject.call(this, n);

		this.width = width;
		this.height = height;
		this.iconPosition = [0,0];
		this.timer = 0;
		this.delayTimer = 0;
		this.enabled = true;

		this.buttonInit = function(x, y) {
			var p = this.parent.paper, cg = p.group();
			var h = hue/360;
			var r = p.rect(0, 0, width, height);
			r.attr({'stroke': Raphael.hsb(h,1,0.4), 'stroke-width': 1.5, 'fill': "270-"+Raphael.hsb(h,0.8,1)+"-"+Raphael.hsb(h,0.85,0.7)});
			cg.push(r);

			var o = p.image(Engine.assetURL("button_down.png"), 0, 0, width, height);
			o.hide();
			cg.push(o);

			this.container = cg;
			this.pressedOverlay = o;

			this.setPosition(x, y);
			this.setCursor("pointer");
		}

		this.setState = function(state) {
			this.pressed = state;
			if (state) {
				this.pressedOverlay.show();
				this.icon.attr('x', this.iconPosition[0]+2);
				this.icon.attr('y', this.iconPosition[1]+2);
			} else {
				this.pressedOverlay.hide();
				this.icon.attr('x', this.iconPosition[0]);
				this.icon.attr('y', this.iconPosition[1]);
			}
		}

		this.setIcon = function(url, iconWidth, iconHeight) {
			this.iconPosition = [this.width/2-iconWidth/2, this.height/2-iconHeight/2];
			this.icon = this.parent.paper.image(url, this.iconPosition[0], this.iconPosition[1], iconWidth, iconHeight);
			this.container.push(this.icon);
		}
		this.enable = function(delay) {
			if (this.delayTimer) clearTimeout(this.delayTimer);
			if (delay) {
				var t = this;
				this.delayTimer = setTimeout(function(){ t.enable(); }, delay);
			} else {
				this.enabled = true; this.setOpacity(1); this.setCursor("pointer");
			}
		}
		this.disable = function() { this.enabled = false; this.setOpacity(0.5); this.setCursor("default"); }

		//New method for hiding buttons -DC//
		this.hidden = function() { this.enabled = false; this.setOpacity(0); this.setCursor("default"); }

		// Human friendly versions
		this.press = function() { this.setState(true); }
		this.release = function() { this.setState(false); }

		this.evPress = function(e) {
			var s = e.data.source;
			if (!s.enabled) return;
			setTimeout(function(){ s.release(); }, 150);
			if (e.data.callback) e.data.callback(e);
			s.press();
			clearTimeout(s.timer);
		}

		this.evToggle = function(e) {
			var s = e.data.source;
			if (!s.enabled) return;
			s.setState(!s.pressed);
			if (e.data.callback) e.data.callback(e);
			clearTimeout(s.timer);
		}

		// Since buttons only respond to clicks, we use a general method to handle everything
		// There are two actions: press and toggle
		// - press: button responds to single clicks/taps
		// - toggle: button responds to clicks/taps and holds the pressed position. Use button.pressed for state. This acts as a checkbox.
		// Since we don't really deal with mouseups/touchend, the pressed state (when not in toggle) is an animation
		this.onPress = function(callback) {
			this.offPress();
			Engine.addEvent({ source: this, node: this.container.node, callback: callback }, "press", this.evPress);
		}

		this.offPress = function() {
			Engine.removeEvent({ source: this, node: this.container.node }, "press", this.evPress);
		}

		this.onToggle = function(callback) {
			this.offToggle();
			Engine.addEvent({ source: this, node: this.container.node, callback: callback }, "press", this.evToggle);
		}

		this.offToggle = function(callback) {
			Engine.removeEvent({ source: this, node: this.container.node, callback: callback }, "press", this.evToggle);
		}

	},

	/* Default buttons */
	ButtonHelp: function() { Engine.Button.call(this, "btHelp", 50, 40, 180);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_help.png"), 30, 30);
		}
	},
	ButtonGo: function() { Engine.Button.call(this, "btGo", 50, 40, 120);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_go.png"), 30, 30);
		}
	},
	ButtonUndo: function() { Engine.Button.call(this, "btUndo", 50, 40, 60);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_undo.png"), 30, 30);
		}
	},
	ButtonFast: function() { Engine.Button.call(this, "btFast", 50, 40, 30);
		this.signOn = null;
		this.signOff = null;
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_fast.png"), 30, 30);
			this.signOn = this.parent.paper.image(Engine.assetURL("bt_fast_on.png"), 50, 0, 100, 40);
			this.signOff = this.parent.paper.image(Engine.assetURL("bt_fast_off.png"), 50, 0, 100, 40);
			this.container.push(this.signOn);
			this.container.push(this.signOff);
			this.signOn.hide();
		}
		this.setSign = function(state) {
			if (state) {
				this.signOn.show();
				this.signOff.hide();
				this.pressedOverlay.show();
			} else {
				this.signOff.show();
				this.signOn.hide();
				this.pressedOverlay.hide();
			}
		}
	},
	ButtonKill: function() { Engine.Button.call(this, "btKill", 50, 40, 0);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_kill.png"), 30, 30);
		}
	},
	ButtonGraph: function() { Engine.Button.call(this, "btGraph", 50, 40, 60);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_graph.png"), 35, 30);
		}
	},
	ButtonNext: function() { Engine.Button.call(this, "btNext", 120, 40, 200);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_next.png"), 70, 30);
		}
	},
	ButtonSlitWide: function() { Engine.Button.call(this, "btNext", 50, 70, 50);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_slit_wide.png"), 25, 50);
		}
	},
	ButtonSlitNarrow: function() { Engine.Button.call(this, "btNext", 50, 70, 50);
		this.init = function(x, y) { this.buttonInit(x, y);
			this.setIcon(Engine.assetURL("bt_slit_narrow.png"), 25, 50);
		}
	},
//Adding new buttons for the partial reflection exercise -DC//

	ButtonGlassThin: function() { Engine.Button.call(this, "btThin", 40, 60, 180);
		this.init = function(x, y) { this.buttonInit(x,y)
			this.setIcon(Engine.assetURL("bt_thin.png"), 40, 60);
		}
	},

	ButtonGlassThick: function() { Engine.Button.call(this, "btThick", 40, 60, 180);
		this.init = function(x, y) { this.buttonInit(x,y)
			this.setIcon(Engine.assetURL("bt_thick.png"), 40, 60);
		}
	},

//----//

//Adding new button for the free mode exercise -DC//

	ButtonPlotAll: function() { Engine.Button.call(this, "btPlotAll", 80, 40, 80);
		this.init = function(x, y) { this.buttonInit(x,y)
			this.setIcon(Engine.assetURL("bt_plot_all.png"), 80, 40);
		}
	},

//----//


	/* ------------ MARKERS ------------ */
	// Todo: add align feature?
	DotMarker: function() { var n = "dotMarker"+Math.floor(Math.random()*1e6); Engine.RaphaelObject.call(this, n);
		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();

			var c = p.circle(0, 0, 3); c.attr({'stroke': "none", 'fill': Engine.STYLE.MarkerColor});
			var g = c.glow({width: 5, fill: true, opacity: 0.7, offsetx: 0, offsety: 0, color: Engine.STYLE.MarkerOutline});
			cg.push(g); cg.push(c);

			this.container = cg;
			this.setPosition(x, y);
		}
	},
	// Dot + text marker ("click here")
	Marker: function(n) { Engine.RaphaelObject.call(this, n);
		this.marker = true;
		this.text = n;
		this.init = function(x, y) {
			// If object is in another paper, remove it first
			if (this.container) {
				this.container.node.parentNode.removeChild(this.container.node);
			}

			var p = this.parent.paper;
			var cg = p.group();

			// var c = p.circle(0, 0, 3); c.attr({'stroke': "none", 'fill': "#FFFFFF"});
			// var g = c.glow({width: 5, fill: true, opacity: 0.7, offsetx: 0, offsety: 0, color: Raphael.hsb(2/3,1,1)});
			// cg.push(g); cg.push(c);

			var l = p.print(10, 0, this.text, p.getFont("Roboto"), 17, "middle").attr({'stroke': "none", 'fill': Engine.STYLE.MarkerColor});
			var g = l.glow({width: 2, fill: true, opacity: Engine.STYLE.MarkerOutlineOpacity, offsetx: 0, offsety: 0, color: Engine.STYLE.MarkerOutline});
			cg.push(g);
			cg.push(l);

			// var bb = l.getBBox();
			// var w = bb.width, h = bb.height;
			// For aligning, add l to another group and transform that instead

			this.container = cg;
			this.setPosition(x, y);

		}
	},


	/* ------------ OTHER OBJECTS ------------ */
	Clock: function(n, radius, color) { Engine.RaphaelObject.call(this, n);
		this.angle = 0;
		this.color = color;
		this.radius = radius;

		this.init = function(x, y) {
			// If object is in another paper, remove it first
			if (this.container) {
				this.container.node.parentNode.removeChild(this.container.node);
			}

			var HAND_THICKNESS = 4;

			var p = this.parent.paper;
			var cg = p.group();

			var c = p.circle(0, 0, this.radius)
			c.attr({'stroke': Engine.colorBrightness(Engine.STYLE.Colors[this.color].color, -0.4), 'stroke-width': 2, 'fill': "90-#B0B0B0-#E0E0E0"});
			cg.push(c);

			var ch = p.ellipse(0, -this.radius/3, this.radius*0.7, this.radius/2);
			ch.attr({stroke: "none", 'fill': "270-#FFFFFF-#FFFFFF", 'fill-opacity': 0});
			cg.push(ch);

			var s = c.glow({width: 5, fill: true, opacity: 0.3, offsetx: 0, offsety: 4, color: "#000000"});
			cg.push(s);
			s.toBack();

			var g = c.glow({width: 10, fill: true, opacity: Engine.STYLE.GlowOpacity, offsetx: 0, offsety: 0, color: Engine.STYLE.GlowColor});
			cg.push(g);
			g.hide();
			g.toBack();

			var arrRef = p.path("M "+(-this.radius*0.7)+","+(this.radius*0.5)+" L "+(this.radius*0.7)+","+(this.radius*0.5)).attr({'stroke-width': 2, 'stroke': "#888888","arrow-end": "block-medium-medium",});
			var arr = p.path("M "+(-this.radius*0.7)+","+(this.radius*0.5)+" L "+(-this.radius*0.7 + 2*this.radius*0.7 * 1)+","+(this.radius*0.5)).attr({'stroke-width': 2, 'stroke': "#444444","arrow-end": "block-medium-medium",});
			cg.push(arrRef);
			cg.push(arr);

			var h = p.path("M " + (-HAND_THICKNESS/2*0) + " " + (-HAND_THICKNESS/2) + " L " + this.radius*0.85 + " 0 L " + (-HAND_THICKNESS/2*0) + " " + (HAND_THICKNESS/2) + " L " + (-HAND_THICKNESS*2/4) + " 0 Z");
			h.attr({'stroke-width': 1, 'stroke': Engine.colorBrightness(Engine.STYLE.Colors[this.color].color, -0.4), 'fill': Engine.colorBrightness(Engine.STYLE.Colors[this.color].color, 0) });
			cg.push(h);

			this.rim = c;
			this.hand = h;
			this.shadow = s;
			this.glow = g;
			this.container = cg;
			this.glowing = false;
			this.arrowRef = arrRef;
			this.arrow = arr;

			// Clock hovers (keep only these)
			Engine.addEvent({ source: this, node: this.container.node }, "mouseover", function(e){ $(e.data.node).trigger("hover", e.data); });
			Engine.addEvent({ source: this, node: this.container.node }, "mouseout", function(e){ $(e.data.node).trigger("unhover", e.data); });
			Engine.addEvent({ source: this, node: this.container.node }, "press", function(e){ $(e.data.node).trigger("select", e.data); });

			this.hideArrow();
			this.setPosition(x, y);
			this.update();
		}

		this.setColor = function(c) {
			this.color = c;
			this.rim.attr({'stroke': Engine.colorBrightness(Engine.STYLE.Colors[this.color].color, -0.4)});
			this.hand.attr({'stroke': Engine.colorBrightness(Engine.STYLE.Colors[this.color].color, -0.4), 'fill': Engine.colorBrightness(Engine.STYLE.Colors[this.color].color, 0)});
		}


		this.setAngle = function(a) {
			this.angle = a;
			this.update();
			if (this.mockAmplitudeBox) {
				this.mockAmplitudeBox.drawMockAmplitude(a);
			}
		}

		this.update = function() {
			this.hand.transform("r" + (-90+this.angle) + ",0,0");
		}

		this.toggleGlow = function() {
			this.setGlow(!this.glowing);
		}

		this.setGlow = function(state) {
			this.glowing = state;
			if (state) {
				this.shadow.hide();
				this.glow.show();
			} else {
				this.shadow.show()
				this.glow.hide();
			}
		}

		this.updateArrow = function(amplitude) {
			this.arrow.attr("path","M "+(-this.radius*0.7)+","+(this.radius*0.5)+" L "+(-this.radius*0.7 + 2*this.radius*0.7 * amplitude)+","+(this.radius*0.5));
		}

		this.hideArrow = function() {
			this.arrow.hide();
			this.arrowRef.hide();
		}

		this.showArrow = function() {
			this.arrow.show();
			this.arrowRef.show();
		}

	},

	Detector: function(n, label) { Engine.RaphaelObject.call(this, n);
		if (typeof(label) == "undefined") label = true;
		label = !!label;

		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();

			var c = p.image(Engine.assetURL(label ? "detector.png" : "detector_nolabel.png"), -20, -20, (label?60:40), 40);
			cg.push(c);

			var fcg = p.group();
			var f = p.rect(-3, -11, 14, 22).attr({ 'stroke': "none", 'fill': Engine.STYLE.GlowColor, 'opacity': 0.5 });
			var fg = f.glow({width: 10, fill: true, opacity: Engine.STYLE.GlowOpacity, color: Engine.STYLE.GlowColor});
			fcg.push(f);
			fcg.push(fg);
			cg.push(fcg);

			if (Engine.debugMode) { c = p.circle(0, 0, 2); c.attr({ 'stroke': "none", 'fill': "#00FF00" }); cg.push(c); }

			$(fcg.node).hide();
			this.container = cg;
			this.flash = fcg;

			this.setPosition(x, y);
		}

		// Flash center part of the detector in yellow
		// This is to indicate "something was detected" for the double slit experiment
		this.blink = function() {
			$(this.flash.node).fadeIn({
				'duration': 200,
				'complete': function() {
					$(this).fadeOut(200);
				}
			});
		}

	},

	PhotonSource: function(n, color, label) { Engine.RaphaelObject.call(this, n);

		this.colorNames = ["red", "green", "blue"];
		this.color = color;
		this.hideLabel = label;

		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();

			// ToDo: use one image and sprites?
			var imgs = [];
			for(var i = 0;i < this.colorNames.length;i++) {
				imgs.push(new Image());
				imgs[i].src = Engine.assetURL("source_" + this.colorNames[i] + (!this.hideLabel ? "" : "_nolabel") + ".png");
			}

			c = p.image(Engine.assetURL("source_" + this.colorNames[this.color] + (!this.hideLabel ? "" : "_nolabel")+ ".png"), -20, -40, 40, 60);
			cg.push(c);
			this.image = c;

			if (Engine.debugMode) { c = p.circle(0, 0, 2); c.attr({ 'stroke': "none", 'fill': "#00FF00" }); cg.push(c); }

			this.container = cg;
			this.setPosition(x, y);
		}

		this.setColor = function(color) {
			this.color = color % this.colorNames.length;
			if (!this.image) return;
			this.image.attr({ 'src': Engine.assetURL("source_" + this.colorNames[this.color] + (!this.hideLabel ? "" : "_nolabel") + ".png") });
		}

	},

	Knob: function(n) { Engine.RaphaelObject.call(this, n);
		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();

			c = p.image(Engine.assetURL("knob.png"), -20, -20, 40, 40);
			cg.push(c);
			this.image = c;

			if (Engine.debugMode) { c = p.circle(0, 0, 2); c.attr({ 'stroke': "none", 'fill': "#00FF00" }); cg.push(c); }

			this.container = cg;
			this.setPosition(x, y);
		}
	},

	Rail: function(w, h) { var n = "rail"+Math.floor(Math.random()*1e6); Engine.RaphaelObject.call(this, n);

		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();

			cg.push(p.rect(0, 0, w, h).attr({ 'stroke': "#555555", 'stroke-width': 1/2, 'fill': "#505050" }));
			cg.push(p.rect(5-1, 5-1, w-5, h-5).attr({ 'stroke': "none", fill: "#FFFFFF", 'opacity': 0.3 }));

			this.container = cg;
			this.setPosition(x, y);
		}

	},

	PressTarget: function(n, w, h, show) { Engine.RaphaelObject.call(this, n);

		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();

			cg.push(p.rect(0, 0, w, h).attr({ 'stroke': "none", 'fill': "#00FF00", opacity: show ? 0.25 : 0 }));

			this.container = cg;
			this.setPosition(x, y);
		}

		this.evPress = function(e) {
			var s = e.data.source;
			if (e.data.callback) e.data.callback(e);
			clearTimeout(s.timer);
		}

		this.onPress = function(callback) {
			this.offPress();
			Engine.addEvent({ source: this, node: this.container.node, callback: callback }, "press", this.evPress);
		}

		this.offPress = function() {
			Engine.removeEvent({ source: this, node: this.container.node }, "press", this.evPress);
		}

	},


	// There are two ways to draw walls, based on wallheight
	// IF wallheight = 0, it is drawn as a rectangle in 2D
	// If wallheight > 0, we create a 3D effect
	// Note that if the walls have height, they have to be manually positioned in such a way that they occlude objects behind them
	// For a slit, this actually works well since the light paths are in an entire layer behind all other objects, and with careful
	// positioning the effect can be achieved naturally.
	Wall: function(w, h, wallheight) { var n = "wall"+Math.floor(Math.random()*1e6); Engine.RaphaelObject.call(this, n);

		this.wallheight = wallheight ? wallheight : 0;

		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();
			var wh = this.wallheight;
			if (!wh) {
				//2D
				cg.push(p.rect(0, 0, w, h).attr({ 'stroke': Raphael.hsb(0,0,0.2), 'fill': Raphael.hsb(0,0,0.5) }));
			} else {
				if (w != 0 && h != 0) {
					// 3D
					w = w + wh;
					h = h + wh;
					cg.push(p.rect(0, 0, w-wh, h-wh).attr({ 'stroke': Raphael.hsb(0,0,0.3), 'fill': Raphael.hsb(0,0,0.6) }));
					cg.push(p.path(
						"M"+(0)+","+(h-wh)+
						"L"+(wh)+","+(h+0)+""+
						"L"+(w)+","+(h+0)+""+
						"L"+(w-wh)+","+(h-wh)+""+
						"L"+(0)+","+(h-wh)
					).attr({ 'stroke': Raphael.hsb(0,0,0.3), 'fill': Raphael.hsb(0,0,0.5) }));
					cg.push(p.path(
						"M"+(w-wh)+","+(0)+
						"L"+(w)+","+(wh)+""+
						"L"+(w)+","+(h+0)+""+
						"L"+(w-wh)+","+(h-wh)+""+
						"L"+(w-wh)+","+(0)
					).attr({ 'stroke': Raphael.hsb(0,0,0.3), 'fill': Raphael.hsb(0,0,0.5) }));
				}
			}

			this.container = cg;
			this.setPosition(x, y);
		}

		this.setPosition = function(px, py) {
			// returns false if position was not changed
			if (this.x == px && this.y == py) return false;
			this.x = px; this.y = py;
			px = px - this.wallheight;
			py = py - this.wallheight;
			this.container.translate(px, py);
			return true;
		}

		this.hide = function() {
			$(this.container.node).hide();
		}

		this.show = function() {
			$(this.container.node).show();
		}

	},


	// Glass acts the same as walls
	Glass: function(w, h) { var n = "wall"+Math.floor(Math.random()*1e6); Engine.RaphaelObject.call(this, n);
		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();
			var r;

			r = p.rect(0, 0, w, h).attr({ 'stroke': "none", 'fill': "320-#43B6FF:0-#DAFFFE:45-#3488C3:75-#00798F:100" }); cg.push(r); $(r.node).css('opacity', 0.4);
			r = p.rect(0, 0, w, h).attr({ 'stroke': Raphael.hsb(0.6, 1, 1), 'opacity': 0.8, 'fill': "none" }); cg.push(r);

			this.container = cg;
			this.setPosition(x, y);
		}

		this.setPosition = function(px, py) {
			// returns false if position was not changed
			if (this.x == px && this.y == py) return false;
			this.x = px; this.y = py;
			this.container.translate(px, py);
			return true;
		}

	},

	// Glass acts the same as walls
	Lens: function(w, h) { var n = "wall"+Math.floor(Math.random()*1e6); Engine.RaphaelObject.call(this, n);
		this.init = function(x, y) {
			var p = this.parent.paper;
			var cg = p.group();
			var r;

			var ps =
				"M"+(0)+","+(-h/2)+
				"Q"+(w)+","+0+","+(0)+","+(+h/2)+
				"Q"+(-w)+","+0+","+(0)+","+(-h/2)+
				"Z";
			r = p.path(ps).attr({ 'stroke': "none", 'fill': "320-#43B6FF:0-#DAFFFE:45-#3488C3:75-#00798F:100" }); cg.push(r); $(r.node).css('opacity', 0.4);
			r = p.path(ps).attr({ 'stroke': Raphael.hsb(0.6, 1, 1), 'opacity': 0.8, 'fill': "none" }); cg.push(r);

			this.container = cg;
			this.setPosition(x, y);
		}

		this.setPosition = function(px, py) {
			// returns false if position was not changed
			if (this.x == px && this.y == py) return false;
			this.x = px; this.y = py;
			this.container.translate(px, py);
			return true;
		}

	},


	/* ------------ VISUAL MANAGERS ------------ */
	// Helper object to generate  generic arrows pointing to objects on the screen
	ArrowManager: function(app) {
		this.parent = app;
		this.name = "ArrowManager";
		this.type = "other";
		this.width = app.width;
		this.height = app.height;
		this.scale = 1;
		this.aid = 0;
		this.arrows = {};
		this.visible = false;

		this.div = document.createElement("div");
		$(this.div).addClass("arrowmanager"); // size irrelevant, arrows are positioned absolutely, div just for grouping
		// d.addClass("arrowmanager").width(this.parent.width).height(this.parent.height);

		this.show = function() {
			this.visible = true;
			this.parent.div.appendChild(this.div);
		}

		this.hide = function() {
			if (!this.visible) return;
			this.parent.div.removeChild(this.div);
		}

		this.toggle = function() {
			if (this.div.parentNode) {

				this.hide();
			} else {
				this.show();
			}
		}

		this.addArrow = function(at, angle) {

			var x = at.x*this.scale;
			var y = at.y*this.scale;

			var shadow = 10*this.scale;;
			var shadowDistance = shadow * 0.25;
			var shadowPadding = shadowDistance + 5 * this.scale;
			var arrowLength = ( 80 )*this.scale;
			var arrowWidth = arrowLength / 20;
			var arrowHeadWidth = arrowWidth * 3;
			var arrowHeadLength = arrowHeadWidth * 2;
			var arrowStyle = {'fill':"#FFFFFF", 'stroke': "#00000", 'stroke-width': 1};

			var ang = -angle*Engine.DEG2RAD;
			var adiv = document.createElement('div');
			var p = new Raphael(adiv, (arrowLength+shadowPadding)*2, (arrowLength+shadowPadding)*2);

			var g = p.group();
			g.translate(arrowLength+shadowPadding,arrowLength+shadowPadding);
			var t = {
				x: Math.cos(angle*Engine.DEG2RAD)*arrowLength,
				y: Math.sin(angle*Engine.DEG2RAD)*arrowLength
			}

			var dl = {x:Math.cos(ang),y:Math.sin(ang)};
			var dw = {x:-Math.sin(ang),y:Math.cos(ang)};
			var ppts = [];

			ppts.push({x:  dl.x*arrowHeadLength  +  dw.x*arrowHeadWidth  ,y:  dl.y*arrowHeadLength  +  dw.y*arrowHeadWidth  });
			ppts.push({x:  dl.x*arrowHeadLength  +  dw.x*arrowWidth      ,y:  dl.y*arrowHeadLength  +  dw.y*arrowWidth      });
			ppts.push({x:  dl.x*arrowLength      +  dw.x*arrowWidth      ,y:  dl.y*arrowLength      +  dw.y*arrowWidth      });
			ppts.push({x:  dl.x*arrowLength      -  dw.x*arrowWidth      ,y:  dl.y*arrowLength      -  dw.y*arrowWidth      });
			ppts.push({x:  dl.x*arrowHeadLength  -  dw.x*arrowWidth      ,y:  dl.y*arrowHeadLength  -  dw.y*arrowWidth      });
			ppts.push({x:  dl.x*arrowHeadLength  -  dw.x*arrowHeadWidth  ,y:  dl.y*arrowHeadLength  -  dw.y*arrowHeadWidth  });

			// Engine.debugObject(ppts[1]);

			var pstr = "M0,0";
			for(var i = 0; i < ppts.length; i++) {
				pstr += "L"+ppts[i].x+","+ppts[i].y;
			}
			pstr += "L0,0";
			var a = p.path(pstr).attr(arrowStyle);

			var ag = a.glow({ width: shadow, 'opacity': 0.4, 'fill': true, 'color': "#000000" });
			ag.translate(shadowDistance, shadowDistance);
			g.push(ag);
			g.push(a);

			var bb = g.getBBox();

			var ao = {
				'at': at,
				'angle': angle,
				'x': x + bb.x - shadowPadding,
				'y': y + bb.y - shadowPadding,
				'w': bb.width + 2 * shadowPadding,
				'h': bb.height + 2 * shadowPadding,
				'el': adiv
			}

			$(adiv).addClass("helparrow").css({
				'left': ao.x,
				'top': ao.y,
				'width': ao.w,
				'height': ao.h,
			});
			$(adiv).children('svg').css({ 'left': -(bb.x+arrowLength), 'top': -(bb.y+arrowLength) });

			$(this.div).append(adiv);

			this.arrows[this.aid] = ao;
			this.aid++;
		}

		this.setScale = function(s) {
			this.scale = s;
			this.updateArrows();
		}

		this.updateArrows = function() {
			// Redraw arrows
			var i, tmp = [];
			for(i in this.arrows) {
				tmp.push({ 'at': this.arrows[i].at, 'angle': this.arrows[i].angle });
			}
			this.clearArrows();
			for(var i in tmp) {
				this.addArrow(tmp[i].at, tmp[i].angle);
			}
		}

		this.clearArrows = function() {
			for (var i in this.arrows) {
				this.arrows[i].el.parentNode.removeChild(this.arrows[i].el);
				delete this.arrows[i].el;
				delete this.arrows[i];
			}
			this.lid = 0;
			delete this.arrows;
			this.arrows = {};
		}

		this.onTop = function() {
			if (!this.div.parentNode) return;
			this.div.parentNode.appendChild(this.div);
		}

	},

	// LabelsManager is the help layer with labels
	LabelManager: function(app) {
		this.parent = app;
		this.name = "LabelManager";
		this.type = "other";
		this.width = app.width;
		this.height = app.height;
		this.scale = 1;
		this.lid = 0;
		this.labels = {};
		this.visible = false;

		this.div = document.createElement("div");
		var d = $(this.div);
		d.addClass("labelmanager").width(this.parent.width).height(this.parent.height);

		this.background = document.createElement("div");
		d.append($(this.background).addClass("background").width(this.parent.width).height(this.parent.height));

		this.container = document.createElement("div");
		d.append($(this.container).addClass("container").width(this.parent.width).height(this.parent.height).css("font-size",(this.scale*13)+"pt"));

		this.show = function() {
			this.visible = true;
			this.parent.div.appendChild(this.div);
			this.updateLabels();
		}

		this.hide = function() {
			if (!this.visible) return;
			this.parent.div.removeChild(this.div);
		}

		this.toggle = function() {
			if (this.div.parentNode) {
				this.hide();
			} else {
				this.show();
			}
		}

		// pos = { at: POSITION, align: [0,0] }
		// The at parameter is ANY object with a x and y attribute: {x:0, y:0}
		// RaphaelObject instances have this, so you can say at: photonSource and the position of label will follow that object
		// Align is a relative to center position based on the width and height of the object
		// [0,0] = align to center of at object
		// [-1,-1] = align to top left
		// [0,-2] = align to twice the height of the object above the object
		this.addLabel = function(pos, text) {
			var s = $("<span>").addClass("label").css("visibility", "hidden").html(text.split("\n").join("<br/>"));
			$(this.container).append(s);
			var id = this.lid;
			this.labels[id] = { 'id': id, 'el': s.get(0), 'visible': true, 'pos': pos, 'type': "text" };
			this.lid++;
			return id;
		}

		// Instead of a text, an image
		this.addImageLabel = function(pos, url, width, height) {
			var s = $("<span>")
						.addClass("imagelabel")
						.css("visibility", "hidden")
						.width(width).height(height)
						.append($("<img>")
							.attr('src',url)
							.width(width).height(height)
						);
			$(this.container).append(s);
			var id = this.lid;
			this.labels[id] = { 'id': id, 'el': s.get(0), 'visible': true, 'pos': pos, 'type': "image" };
			this.lid++;
			return id;
		}

		this.setLabelVisibility = function(id, visible) {
			if (!this.labels[id]) return;
			this.labels[id].visible = visible;
			$(this.labels[id].el).css('visibility', (visible?"visible":"hidden"));
		}
		this.hideLabel = function(id) { this.setLabelVisibility(id, false); }
		this.showLabel = function(id) { this.setLabelVisibility(id, true); }
		this.toggleLabel = function(id) { this.setLabelVisibility(id, !this.labels[id].visible); }

		// Updates positions
		this.updateLabels = function() {
			for(var i in this.labels) {
				var l = this.labels[i],
					w = $(l.el).outerWidth(), h = $(l.el).outerHeight(),
					x = this.scale*(l.pos.at.x-(l.pos.align[0]+1)/2*w),
					y = this.scale*(l.pos.at.y-(l.pos.align[1]+1)/2*h);
				x = Math.max(0,x); y = Math.max(0,y);
				x = Math.min(this.width*this.scale-w,x); y = Math.min(this.width*this.scale-h,y); // this is wrong
				$(l.el).css('left', x+'px').css('top', y+'px')
					   .css('visibility', (l.visible?"visible":"hidden"));
			}
		}

		this.hideLabels = function(ids) {
			for(var i in this.labels) {
				if (typeof(ids) == "undefined"?true:(ids.indexOf(i) > -1)) this.labels[i].visible = false;
			}
			this.updateLabels();
		}

		this.showLabels = function(ids) {
			for(var i in this.labels) {
				if (typeof(ids) == "undefined"?true:(ids.indexOf(i) > -1)) this.labels[i].visible = true;
			}
			this.updateLabels();
		}

		this.setScale = function(s) {
			this.scale = s;
			this.updateLabels();
			$(this.container).css("font-size",(this.scale*13)+"pt");
		}

		this.clearLabels = function() {
			for (var i in this.labels) {
				// { 'id': id, 'el': s.get(0), 'visible': true, 'pos': pos, 'type': "image" };
				this.labels[i].el.parentNode.removeChild(this.labels[i].el);
				delete this.labels[i].el;
				delete this.labels[i];
			}
			this.lid = 0;
			delete this.labels;
			this.labels = {};
		}

	},

	// Manages the glow around clocks, arrows and paths
	// Basically, it keeps track of which should be associated with which, and toggles them together
	// Can only be enabled when paths, clocks AND amplitudes are all defined
	GlowManager: function(obj) {

		this.active = false; // if glow manager is active, we prevent double-adding events and such
		this.state = false; // array of booleans giving the glow state

		this.enable = function() {
			if (this.active) return;
			this.state = [];

			// The object with the minimum amount of entries defines how far the manager should go
			// A properly setup experiment would have all three numbers equal
			var max = Math.min(
				this.clocks.numClocks(),
				this.paths.numPaths(),
				this.amplitudes.numArrows()
			);
			// Engine.log(this.paths.numPaths());
			if (!max) return; // nothing to do
			for(var i = 0;i < max;i++) {
				this.state.push(false);
				// We don't use Engine.addEvent in this case because jQuery's events seem more reliable
				if (this.clocks) {
					$(this.clocks.clockList[i].container.node).on("hover", { 'manager': this, 'id': i, 'over': "clock" }, function(e){
						e.data.manager.setGlow(e.data.id, true);
					});
					$(this.clocks.clockList[i].container.node).on("unhover", { 'manager': this, 'id': i, 'over': "clock" }, function(e){
						e.data.manager.setGlow(e.data.id, false);
					});
					$(this.clocks.clockList[i].container.node).on("press", { 'manager': this, 'id': i, 'over': "clock" }, function(e){
						e.data.manager.toggleGlow(e.data.id);
					});
				}
			}

			this.active = true;
		}


		// ToDo: make sure all the glows are removed too
		this.disable = function() {
			if (!this.active) return;

			var max = Math.min(
				this.clocks.numClocks(),
				this.paths.numPaths(),
				this.amplitudes.numArrows()
			);
			if (!max) return; // nothing to do

			delete this.state;
			this.state = [];
			if (!max) return; // if nothing to do, stop here
			for(var i = 0; i < max; i++) {
				this.state.push(false);
				if (this.clocks) {
					$(this.clocks.clockList[i].container.node).off("hover");
					$(this.clocks.clockList[i].container.node).off("unhover");
					$(this.clocks.clockList[i].container.node).off("press");
				}

			}

			this.active = false; // if glow manager is active, we prevent double-adding events and such
			this.state = false; // array of booleans giving the glow state

		}

		this.assign = function(obj) {
			this.disable();
			this.clocks = obj.clocks;
			this.amplitudes = obj.amplitudes;
			this.paths = obj.paths;
			this.setGlowAll(false);
		}

		this.setGlow = function(id, state) {
			if (this.clocks) this.clocks.setGlow(id, state);
			if (this.amplitudes) this.amplitudes.setGlow(id, state);
			if (this.paths) this.paths.setGlow(id, state);
		}

		this.setGlowAll = function(state) {
			var max = Math.min(
				this.clocks.numClocks(),
				this.paths.numPaths(),
				this.amplitudes.numArrows()
			);
			if (!max) return; // nothing to do

			for(var i = 0;i < max;i++) {
				this.setGlow(i, state);
			}
		}

		this.assign(obj);

	},

	/* ------------ ABSTRACT OBJECTS ------------ */
	// LightLayer groups together paths, glows and photons
	// This means a single experiment box may have several light layers
	// The color parameter IS NOT the color index (red, green, blue), but
	//     the hexadecimal value of the color
	// The same is true for glowColor parameter
	// This allows us to create arbitrary path colors for highlighting paths
	// If  glow not specified, use default in Engine.STYLE
	LightLayer: function(color, frequency, glowColor) {
		this.timer = 0;
		this.frame = 0;
		this.totalFrames = 0;
		this.totalAnimationTime = 0;

		this.experiment = null; // defined by Experiment.addLightLayer

		// Holds LightPath objects
		this.lightPaths = [];

		// Holds Raphael graphic references indexed by path uid
		this.graphics = {};

		this.setFrequency = function(frequency) {
			this.frequency = frequency*Engine.FREQUENCY_ADJUST;
		}
		this.setFrequency(frequency);

		this.setColor = function(color) {
			this.color = color;
		}
		this.setColor(color);
		this.setGlobalColor = function(color) {
			this.setColor(color);
			for (var i in this.graphics) {
				this.graphics[i].path.attr({'stroke': color });
			}
		}

		this.setGlowColor = function(color) {
			this.glowColor = color;
		}
		this.setGlowColor(typeof(glowColor) != 'undefined' ? color : Engine.STYLE.GlowColor);

		// creates actual layers here (required since we need experiment.paper)
		// this is invoked when Experiment.addLightLayer is called
		this.init = function(experiment) {
			this.experiment = experiment;

			var p = this.experiment.paper;
			this.lightLayer = p.group(); // All sub layers are contained in a overall group
			this.glowLayer = p.group();
			this.pathLayer = p.group();
			this.photonLayer = p.group();

			// Following order is important
			this.lightLayer.push(this.glowLayer);
			this.lightLayer.push(this.pathLayer);
			this.lightLayer.push(this.photonLayer);
			this.experiment.lightLayerContainer.push(this.lightLayer);

			// Draw all currently defined paths
			this.drawAll();
		}

		this.drawAll = function() {
			for(var i in this.lightPaths) { this.drawPath(this.lightPaths[i]); }
		}


		this.drawPath = function(path) {
			if (path.hidden) return;
			if (this.experiment == null) { Engine.log("No experiment defined for LightLayer"); return; }
			var p = this.experiment.paper, pg;
			// If path graphics don't exist, create them
			if (!(path.uid in this.graphics)) {
				pg = { path: null, glow: null, photon: null };

				pg.path = p.path(path.getPathString()).attr({'stroke-width': Engine.STYLE.LightPathWidth, 'stroke': this.color});
				this.pathLayer.push(pg.path);

				pg.glow = pg.path.glow({ width: Engine.STYLE.GlowWidth, opacity: Engine.STYLE.GlowOpacity, color: this.glowColor });
				this.glowLayer.push(pg.glow);

				pg.photon = p.circle(path.path[1].x, path.path[1].y, Engine.STYLE.PhotonSize).attr({ 'fill': this.color, 'stroke': "none" });
				this.photonLayer.push(pg.photon);

				// hidden by default, shown only when needed
				pg.glow.hide();
				pg.photon.hide();

				this.graphics[path.uid] = pg;
			} else { // If they do, update them
				pg = this.graphics[path.uid];
				pg.path.attr('path', path.getPathString());
				pg.path.attr('stroke', this.color);
				if (pg.glow.length) {
					for(var i = 0; i < pg.glow.length; i++) pg.glow[i].attr('path',path.getPathString());
				}
			}
			path.pathObject = {
				'path': this.graphics[path.uid]
			}
		}

		// Adds a path, glow and photon to the appropriate layers
		this.addPath = function(path, defer) {
			this.lightPaths.push(path);
			if (this.experiment != null && !defer) this.drawPath(path);
			return this.lightPaths.length - 1;
		}
		this.getPath = function(id) {
			return this.lightPaths[id];
		}

		this.clear = function() {
			var i, o;
			for (i in this.graphics) {
				this.graphics[i].path.remove();
				this.graphics[i].photon.remove();
				this.graphics[i].photon.glow();
			}
			for (i in this.lightPaths) {
				delete this.lightPaths[i];
			}
			delete this.lightPaths;
			this.lightPaths = [];
			this.graphics = {};
			clearInterval(this.timer);
		}

		this.shootAllPhotons = function(callback) {
			if (this.timer) return;
			this.frame = 0;
			this.totalAnimationTime = this.getTotalTime();
			this.totalFrames = Math.ceil( Engine.FPS * this.totalAnimationTime / Engine.ANIMATION_SPEED);
			this.timer = setInterval(this.animatePhotons.bind(this), 1e3/Engine.FPS);
			this.animationCallback = callback;
			var p, pos;
			for (var i in this.lightPaths) {
				this.lightPaths[i].photonDetected = false;
				p = this.lightPaths[i];
				pos = p.positionAtTime(0);
				this.graphics[p.uid].photon.attr('cx',pos.x-1);
				this.graphics[p.uid].photon.attr('cy',pos.y-1);
				this.graphics[p.uid].photon.show();
				if (p.firstPoint().trigger) p.firstPoint().trigger();
			}
		}

		this.getAmplitudes = function() {
			var amps = [];
			for (var i in this.lightPaths) {
				p = this.lightPaths[i];
				amps.push({
					amplitude: p.amplitude,
					phase: Engine.TAU*p.totalTime*this.frequency+Engine.TAU/2*p.phaseOffset
				});
			}
			return amps;
		}

		// Non-normalized
		this.getTotalAmplitude = function() {
			var amps = this.getAmplitudes();
			var p = { x: 0, y: 0 };
			for (var i in amps) {
				p.x += Math.cos(amps[i].phase)*amps[i].amplitude;
				p.y += Math.sin(amps[i].phase)*amps[i].amplitude;
			}
			return {
				amplitude: Math.sqrt(p.x*p.x + p.y*p.y),
				phase: Math.atan2(p.y,p.x)
			}
		}

		this.pauseAnimation = function(e) {
			clearInterval(this.timer);
		}

		this.resumeAnimation = function(e) {
			clearInterval(this.timer);
			this.timer = setInterval(this.animatePhotons.bind(this), 1e3/Engine.FPS);
		}


		this.animatePhotons = function(e) {
			this.frame++;
			if (this.frame > this.totalFrames) {
				clearInterval(this.timer);
				for (var i in this.lightPaths) {
					p = this.lightPaths[i];
					p.photonDetected = true;
					pos = p.positionAtTime(p.totalTime);
					if (p.clock) p.clock.setAngle(360*p.totalTime*this.frequency+180*pos.phaseOffset);
					this.graphics[p.uid].photon.attr('cx',pos.x).attr('cy',pos.y);
					this.graphics[p.uid].photon.hide();
				}
				this.timer = 0;
				if (typeof(this.animationCallback) != "undefined") this.animationCallback();
				return;
			}
			var lt = ((this.frame-1) / this.totalFrames) * this.totalAnimationTime;
			var t = (this.frame / this.totalFrames) * this.totalAnimationTime;
			var pos, tt;

			var p, ptid0, ptid1;
			for(var i in this.lightPaths) {
				p = this.lightPaths[i];
				if (p.photonDetected) continue;
				if (t >= p.totalTime) {
					pos = p.positionAtTime(p.totalTime);
					p.photonDetected = true;
					if (p.lastPoint().trigger) p.lastPoint().trigger();
					if (p.clock) p.clock.setAngle(360*p.totalTime*this.frequency+180*pos.phaseOffset);
					// this.lightPaths[i].clock.setAngle( Engine.getDegreesFromDistance(md, this.lightPaths[i].color) );
					this.graphics[p.uid].photon.attr('cx',pos.x).attr('cy',pos.y).hide();
					continue;
				}
				pos = p.positionAtTime(lt);
				this.graphics[p.uid].photon.attr('cx',pos.x).attr('cy',pos.y);
				ptid0 = p.lastPointIdFrom(lt);
				ptid1 = p.lastPointIdFrom(t);
				if (ptid0 != ptid1) {
					if (p.getPoint(ptid1).trigger) p.getPoint(ptid1).trigger();
				}
				if (p.clock) p.clock.setAngle(360*t*this.frequency+180*pos.phaseOffset);
			}
		}

		this.getTotalTime = function() {
			var t = 0;
			for(var i in this.lightPaths) {
				if (t < this.lightPaths[i].totalTime) t = this.lightPaths[i].totalTime;
			}
			return t;
		}

		this.getMaxAmplitude = function() {
			var m = 0;
			for(var i in this.lightPaths) {
				m += this.lightPaths[i].amplitude;
			}
			return m;
		}

		this.numPaths = function() { return this.lightPaths.length; }

		this.setGlow = function(id, state) {
			if (state) {
				this.graphics[this.lightPaths[id].uid].glow.show();
				this.graphics[this.lightPaths[id].uid].path.attr({'stroke':Engine.STYLE.GlowColor,'stroke-width':Engine.STYLE.LightPathWidth*2});
				this.graphics[this.lightPaths[id].uid].photon.attr('fill',Engine.STYLE.GlowColor);
				this.graphics[this.lightPaths[id].uid].glow.toFront();
				this.graphics[this.lightPaths[id].uid].path.toFront();
				this.graphics[this.lightPaths[id].uid].photon.toFront();
			} else {
				this.graphics[this.lightPaths[id].uid].glow.hide();
				this.graphics[this.lightPaths[id].uid].path.attr({'stroke':this.color,'stroke-width':Engine.STYLE.LightPathWidth});
				this.graphics[this.lightPaths[id].uid].photon.attr('fill',this.color);
			}
		}

		this.hide = function() {
			$(this.lightLayer.node).hide();
		}

		this.show = function() {
			$(this.lightLayer.node).show();
		}

		this.setFinalState = function() {
			var p, pos;
			for(var i in this.lightPaths) {
				p = this.lightPaths[i];
				pos = p.positionAtTime(p.totalTime);
				if (p.clock) p.clock.setAngle(360*p.totalTime*this.frequency+180*pos.phaseOffset);

				this.graphics[p.uid].photon.attr('cx',pos.x).attr('cy',pos.y);
				this.graphics[p.uid].photon.hide();

			}
		}

		// Useful when we have to drag the detector
		// This is usually always the case, but who knows what else shows up
		this.changePointAllPaths = function(n, point, defer) {
			for(var i = 0;i < this.lightPaths.length;i++) {
				this.lightPaths[i].changePoint(n, point);
				this.lightPaths[i].updateData();
				if (!defer) this.drawPath(this.lightPaths[i]);
			}
		}

	},

	// Abstract definition of a light path, with no regard to colors
	// amplitude is the path's amplitude arrow (in terms of an unit length)
	LightPath: function(amplitude) {
		// Defaults
		this.amplitude = (typeof(amplitude) == 'undefined' ? 1.0 : amplitude);
		this.totalTime = 0; // total time along the path;
		this.photonDetected = false; // photon at the end of its path?
		this.path = []; // holds path entries
		this.clock = null;
		this.uid = Math.floor(Math.random()*1e15); // unique ID for a path helps identify if it exists
		this.pathObject = null;
		this.hidden = false;

		// Add path point. Format:
		// { x: (float), y: (float), ior: (float), invert: (boolean), trigger: (function) }
		// (optional) ior: the index of refraction starting at this point onwards (needs to be reset back to 1 as needed)
		// (optional) invert: if a hard reflection, this option makes the phase shift by pi at this point
		// (optional) trigger: if defined, when this point is reached by a photon the function will be called
		//            note that this is PER PATH, so be careful not to add the same exact trigger for several paths
		//            Usually, we define a trigger for the end of all photon animations on the LightLayer instead, on the shootAllPhotons method
		this.addPoint = function (point) {
			if (typeof(point) == 'undefined') return;
			if (typeof(point.ior) == 'undefined') point.ior = 0; // defaults to 0 if not specified (0 means "ignore", see updateData below)
			if (isNaN(point.x*point.y*point.ior)) return;
			this.path.push(point);
		}

		this.numPoints = function() { return this.path.length; }
		this.firstPoint = function() { return this.path[0]; }
		this.lastPoint = function() { return this.path[this.path.length-1]; }
		this.getPoint = function(i) {
			if (i < 0) return this.firstPoint();
			if (i >= this.path.length) return this.lastPoint();
			return this.path[i];
		}

		this.changePoint = function(n, point) {
			if (n < 0 || n >= this.path.length) return;

			// Alter a copy of the current point
			var cpt = this.path[n];
			var tmp = {};

			if (typeof(cpt.x) != "undefined") tmp.x = cpt.x;
			if (typeof(cpt.y) != "undefined") tmp.y = cpt.y;
			if (typeof(cpt.ior) != "undefined") tmp.ior = cpt.ior;
			if (typeof(cpt.invert) != "undefined") tmp.invert = cpt.invert;
			if (typeof(cpt.trigger) != "undefined") tmp.trigger = cpt.trigger;

			if (typeof(point.x) != 'undefined') tmp.x = point.x;
			if (typeof(point.y) != 'undefined') tmp.y = point.y;
			if (typeof(point.invert) != 'undefined') tmp.invert = point.invert;
			if (typeof(point.ior) != 'undefined') tmp.ior = point.ior;
			if (typeof(point.trigger) != 'undefined') tmp.trigger = point.trigger;

			this.path[n] = tmp;

			this.updateData();
		}

		// Creates the SVG path string from the structured path array
		this.getPathString = function() {
			var ps = "", p;
			for(var i in this.path) {
				p = this.path[i];
				ps += (i == 0 ? "M" : "L") + Math.floor(p.x) + "," + Math.floor(p.y); // integer pixels (avoids blurring)
			}
			return ps;
		}

		this.updateData = function() {
			this.totalTime = 0;
			this.phaseOffset = 0;
			var ior = 1.0;
			var x, y, lx, ly, p, d;
			// Engine.log(this.totalTime);
			for(var i = 0; i < this.path.length;i++) {
				p = this.path[i];
				x = p.x; y = p.y;
				if (p.invert) this.phaseOffset = 1 - this.phaseOffset;
				p.phaseOffset = this.phaseOffset;
				if (i == 0) { lx = x; ly = y; p.pointTime = 0; continue; } // if first point, we stop here
				d = Math.sqrt( Math.pow((x-lx),2) + Math.pow((y-ly),2) );
				// Since t = d/v, ior = c/v, we have t = d*ior/c
				this.totalTime += d * ior / Engine.C;
				p.pointTime = this.totalTime; // time until this point
				if (p.ior) ior = p.ior; // if p.ior is 0, we don't change the current segment's ior
				lx = x; ly = y;
				// Engine.log(this.totalTime);
			}
			// Engine.log(this.path);
		}

		this.lastPointIdFrom = function(t) {
			// n points means n-1 intervals
			if (t <= 0) return 0;
			if (t >= this.totalTime) return this.path.length - 1;
			for(var i = 0; i < this.path.length; i++) {
				if (this.path[i].pointTime >= t) break;
			}
			return i - 1; // subtract 1 to get the last point passed
		}

		this.positionAtTime = function(t) {
			// n points means n-1 intervals
			if (t <= 0) return {
				x: this.path[0].x,
				y: this.path[0].y,
				phaseOffset: this.path[0].phaseOffset
			};
			if (t >= this.totalTime) return {
				x: this.path[this.path.length-1].x,
				y: this.path[this.path.length-1].y,
				phaseOffset: this.path[this.path.length-1].phaseOffset
			};
			for(var i = 0; i < this.path.length; i++) {
				if (this.path[i].pointTime >= t) break;
			}
			i--; // subtract 1 to get the last point passed
			var lp = this.path[i];
			var np = this.path[i+1];
			k = (t - lp.pointTime) / (np.pointTime - lp.pointTime);
			return {
				x: lp.x*(1-k) + np.x*k,
				y: lp.y*(1-k) + np.y*k,
				phaseOffset: lp.phaseOffset
			};
		}

		this.clear = function() {
			delete this.path;
			this.path = [];
		}

		this.setOpacity = function(v) {
			this.pathObject.path.path.attr('opacity',v);
		}
	}

}
Engine.init();
