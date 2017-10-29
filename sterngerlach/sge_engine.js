// #################################################################################################
// Stern-Gerlach Engine (SGE) v1.10
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

//   The Stern-Gerlach Engine (SGE) is used to create
// instances of a Stern-Gerlach application.
//   Only one instance of the engine should exist, but the engine object
// can handle multiple applications in the same page.
//   The engine only handles the inner-workings of the abstract objects used
// to construct an experiment or exercise. It's up to the user to assemble these
// components into a final application, which will show up on a web page.
//   The first step is always to initialize a new application instance, which will be
// a blank space in which to place further components after they are created and set up.
//   The application instances are given a user-assigned id, which is also used for
// the container DIV that holds the application. They will also be assigned the class
// "SGE_Application" in case CSS rules need to be applied. 
//   The Engine will only return an instance for an application. It's up to the user
// to insert its DIV in the DOM at the appropriate location. The DIV node can be
// retrieved using the "div" property of an SGE.Application instance.

// Throughout the source, any property prefixed by two underlines are meant to be internal to the
// engine and in practice never touched during creation of specific applications.

// -------------------------------------------------------------------------------------------------
// Main engine object (one instance per page)
var SGE = {};

// #################################################################################################
// General constants
SGE.TAU							=	6.2831853071; // tau > pi!
SGE.EPSILON						=	1e-2; // how much to nudge surfaces so they don't intersect
SGE.DEFAULT_CAMERA_FOV			=	60; // field of view for camera
SGE.CAMERA_Z_NEAR				=	0.1; // camera frustum z-near distance
SGE.CAMERA_Z_FAR				=	1000; // camera frustum z-far distance
SGE.SKY_RADIUS					=	500; // radius for the sky-sphere (half of z-far is max)
SGE.ANTIALIAS					=	true; // request antialiasing on the WebGL renderer
SGE.AXIS_SIZE					=	1;
SGE.TOO_FAR						=	1e3;
SGE.ORIGIN						=	new THREE.Vector3(0,0,0);

// -------------------------------------------------------------------------------------------------
// Asset paths
SGE.LOCAL_ASSETS_PATH			=	"img/";
SGE.REMOTE_ASSETS_PATH			=	""; // ToDo: remote asset loader?
SGE.USE_REMOTE_ASSETS			=	false;

// -------------------------------------------------------------------------------------------------
// Polygon detail levels
SGE.MESH_ROUND_SEGMENTS			=	16; // for cylinders and cones
SGE.MESH_SPHERE_SEGMENTS		=	12; // for sphere; both latitude and longitude

// -------------------------------------------------------------------------------------------------
// Material properties
SGE.USE_PHONG_MATERIAL			=	true; // use shiny surfaces (looks better, but slower)

// -------------------------------------------------------------------------------------------------
// Colors
SGE.DEFAULT_BACKGROUND_COLOR	=	0x445566; // dark blue
SGE.SKY_COLOR					=	0x445566; // base color for the sky sphere (dark teal)
SGE.AMBIENT_LIGHT				=	0x505050; // softens shadows
// Base color for components
// SGE.BASE_COLOR					=	0xCCCCCC; // gray
SGE.BASE_COLOR					=	0xB0BBDD; // bluish-gray
// SGE.BASE_COLOR					=	0xEEE0DD; // silver-gold
SGE.GLOW_COLOR					=	0xFFCC00;
SGE.NORTH_COLOR					=	0xCC6040;
SGE.SOUTH_COLOR					=	0x4080CC;
SGE.MAGNETIC_FIELD_COLOR		=	0xAD1EC0;
SGE.ANALYZER_TUBE_COLOR			=	0xA0D0FF;
SGE.LABEL_DEFAULT_COLOR			=	0xFFFFFF;
SGE.COMPONENT_GLOW_COLOR		=	0xFFFF00;

// Glow-related
SGE.COMPONENT_GLOW_SIZE			=	15;

// -------------------------------------------------------------------------------------------------
// Angle meter object (defaults, may be changed on an individual basis)
SGE.ANGLE_METER_COLOR			=	0xFFFF00;
SGE.ANGLE_METER_RADIUS			=	2;
SGE.ANGLE_METER_WEDGE_SIZE		=	3/4; // wedge radius is the meter radius times this value
SGE.ANGLE_METER_WEDGE_OPACITY	=	0.5; // wedge opacity multiplier

// -------------------------------------------------------------------------------------------------
// Ignore object
SGE.SPACING_FOR_IGNORE			=	2; // how far particles should travel before being ignored
SGE.IGNORED_LABEL				=	"IGNORED";
SGE.BLOCKED_LABEL				=	"BLOCKED";

// -------------------------------------------------------------------------------------------------
// Source parameters
SGE.SOURCE_CONE_LENGTH			=	0.35;
SGE.SOURCE_CONE_RADIUS			=	0.5;
SGE.SOURCE_HOLE_RADIUS			=	0.25;

// -------------------------------------------------------------------------------------------------
// Stern-Gerlach parameters
SGE.SG_LENGTH					=	6;
SGE.SG_SCREEN_THICKNESS			=	1/40;
SGE.SG_SCREEN_TEXTURE_SIZE		=	128;
SGE.SG_SCREEN_COLOR				=	0xFFFFFF;
SGE.SG_SCREEN_DOT_SIZE			=	0.025;
SGE.SG_SCREEN_DOT_ALPHA			=	1/4;
SGE.SG_SCREEN_DOT_SPREAD		=	0.025;

// -------------------------------------------------------------------------------------------------
// Detector parameters
SGE.DETECTOR_RADIUS				=	0.5; // radius of the sphere at the center of detector
SGE.DETECTOR_CONE_LENGTH		=	0.3;
SGE.DETECTOR_CONE_RADIUS		=	0.5;
SGE.DETECTOR_HOLE_RADIUS		=	0.25;
// The following factors fine-tune the overlap between the cone and the sphere of the detector
// The first factor indicates that the last 1 - 0.85 = 15% of the sphere cap is absent
// This creates a sphere with a cap removed, leaving a hole.
SGE.DETECTOR_OVERLAP_FACTOR1	=	0.85;
// The second factor is a multiplier for how much the cone base (with the hole into the detector)
// should be moved closer to the center of the detector.
// A value of 1 places the base of the cone +tangent to the sphere, which means the cone touches
// the sphere at a single point. A value of zero places the center of the cone at the surface
// of the sphere, which is too much in.
SGE.DETECTOR_OVERLAP_FACTOR2	=	0.35;

// -------------------------------------------------------------------------------------------------
// Atom parameters
SGE.ATOM_RADIUS					=	1/6;
SGE.ATOM_COLOR					=	0xCCCCCC;
SGE.ATOM_CONE_LENGTH			=	0.4;
SGE.ATOM_CONE_ANGLE				=	SGE.TAU/360*60;
SGE.ATOM_CONE_OPEN				=	true;
// As the atom with visible cones (known state, classical mode) leaves/enters objects,
// for aesthetics the cone smoothly expands/shrinks so the geometry doesn't overlap and things
// look weird.
// This value gives us how many units it takes for the cone to shrink/expand outside the main
// body of objects. Ideally, around same size as SGE.PLUG_LENGTH
SGE.ATOM_CONE_SHRINK_DISTANCE	=	0.6;

// -------------------------------------------------------------------------------------------------
// Current loop parameters
SGE.LOOP_ARROW_THICKNESS		=	0.075;
SGE.LOOP_ARROW_HEAD_THICKNESS	=	SGE.LOOP_ARROW_THICKNESS*2.5;
SGE.LOOP_ARROW_LENGTH			=	0.6;
SGE.LOOP_ARROW_HEAD_LENGTH		=	SGE.LOOP_ARROW_LENGTH/3;

// Current loop as a spinning charge
SGE.LOOP_COLOR					=	0x78D0F8;
SGE.LOOP_RADIUS					=	0.4;
SGE.LOOP_CHARGE_COLOR			=	SGE.LOOP_COLOR;
SGE.LOOP_CHARGE_RADIUS			=	0.075;

// Curved arrow representation for the current loop
// If true, current is represented by a curved arrow rotating around a circle
// If false, the current is represented as a spinning charge around a circle (faster to render)
SGE.LOOP_USE_I_ARROW			=	true; 
SGE.LOOP_I_ARROW_COLOR			=	SGE.LOOP_COLOR;
SGE.LOOP_I_ARROW_RADIUS			=	SGE.LOOP_RADIUS; // radius the arrow curves around
SGE.LOOP_I_ARROW_TUBE_RADIUS	=	0.02;
SGE.LOOP_I_ARROW_HEAD_RADIUS	=	0.06;
SGE.LOOP_I_ARROW_CURVE_DETAIL	=	SGE.MESH_ROUND_SEGMENTS; // number of segments to create arrow
SGE.LOOP_I_ARROW_TUBE_DETAIL	=	6; // number of segments to create tube
SGE.LOOP_I_ARROW_MAX_ANGLE		=	SGE.TAU/360*300; // angle covered by the arrow (tail to tip) 
SGE.LOOP_I_ARROW_HEAD_ANGLE		=	SGE.TAU/360*20; // angle covered by the head

// Field axis
SGE.LOOP_FIELD_AXIS_COLOR		=	0xFFFF00;
SGE.LOOP_FIELD_AXIS_OPACITY		=	0.75;
SGE.LOOP_FIELD_CONE_OPACITY		=	0.3;
SGE.LOOP_FIELD_AXIS_SIZE		=	1; // length of the magnetic field axis that shows up

// Animation settings
SGE.LOOP_SPIN_FREQUENCY			=	2; // how fast the charge spins around
// This is the precession frequency for the current loop when under influence of the magnets
// Please note that this precession is not a physical simulation, but only an aesthetical
// reproduction of the actual behavior.
SGE.LOOP_PRECESSION_FREQUENCY	=	2.5;

// -------------------------------------------------------------------------------------------------
// For analyzers, sources and detectors
SGE.WALL_THICKNESS				=	0.075;
// For analyzers, gates and analyzer loops
SGE.PLUG_LENGTH					=	0.5;
// Exploded analyzer / bare Stern-Gerlach experiment
SGE.MAGNET_SPACING				=	1.5;

// -------------------------------------------------------------------------------------------------
// Bell Analyzer Drum parameters
SGE.BELL_THICKNESS				=	SGE.WALL_THICKNESS*2;
SGE.BELL_DRUM_LENGTH			=	7.5;
SGE.BELL_DRUM_OUTER_RADIUS		=	2
SGE.BELL_DRUM_INNER_RADIUS		=	2 - SGE.BELL_THICKNESS;
SGE.BELL_BULB_SPACING			=	2.5; // space between bulbs
SGE.BELL_SOCKET_HEIGHT			=	0.5;
SGE.BELL_SOCKET_RADIUS			=	0.5; // base size, sizes below are multipliers for this
SGE.BELL_BULB_RADIUS			=	1.25; // multiplier for the socket radius
SGE.BELL_BULB_SQUASH			=	0.75; // multiplier factor to squash bulb
SGE.BELL_BULB_STEM_RADIUS		=	0.5; // multiplier for stem radius of bulb
SGE.BELL_BULB_STEM_HEIGHT		=	0.4; // multiplier for stem radius of bulb
SGE.BELL_BULB_SIGN_THICKNESS	=	0.15; // thickness of line drawing the + and - signs
SGE.BELL_SIGN_SIZE				=	0.2; // size of signs in fractions of a full turn
SGE.BELL_OFFSET					=	0.75; // offset around analyzer
SGE.BELL_DETECTOR_OFFSET		=	0.5; // bell analyzer detector offset
SGE.BELL_DIRECTIONS_LABEL_SIZE	=	0.5; // size of direction labels
SGE.BELL_DIRECTIONS_COLOR		=	0xFFFFFF; // color for 3 direction axes

// -------------------------------------------------------------------------------------------------
// Instruction set over atoms
SGE.INSTRUCTIONS_SIZE			=	0.5;
SGE.INSTRUCTIONS_Y_OFFSET		=	0.5;

// -------------------------------------------------------------------------------------------------
// Axes
SGE.AXES_ROUND_SEGMENTS			=	6;
SGE.AXES_COLOR_X				=	0xDD2211;
SGE.AXES_COLOR_Y				=	0x00BB00;
SGE.AXES_COLOR_Z				=	0x2244CC;
SGE.AXES_THICKNESS				=	0.075;
SGE.AXES_LENGTH					=	2.0;
SGE.AXES_HEAD_LENGTH			=	0.25;
SGE.HEAD_THICKNESS				=	0.2;
SGE.AXES_LABEL_SIZE				=	0.4;
SGE.AXES_LABEL_OFFSET			=	0.5;

// -------------------------------------------------------------------------------------------------
// Label parameters
// Height of one line in the texture. Higher values mean crisper text
SGE.LABEL_TEXTURE_LINE_SIZE		=	64;
SGE.LABEL_FONT_FAMILY			=	"'Open Sans', sans-serif";
SGE.LABEL_FONT_BOLD				=	true;

// -------------------------------------------------------------------------------------------------
// Human-readability constants
// Source types
SGE.SOURCE_TYPE_NORMAL			=	0;
SGE.SOURCE_TYPE_SPINUP			=	1;
SGE.SOURCE_TYPE_ENTANGLED		=	2;
SGE.SOURCE_TYPE_CURRENT_LOOP	=	3;

// Directions for atoms to flow (orientation for objects)
SGE.NO_DIRECTION				= 0;
SGE.RIGHT						= +1;
SGE.LEFT						= -1;

// Padding & alignment
SGE.PAD_LEFT					= -1;
SGE.PAD_RIGHT					= +1;
SGE.ALIGN_LEFT					= -1;
SGE.ALIGN_CENTER				= 0;
SGE.ALIGN_RIGHT					= +1;

// Standard input/output names
SGE.IO_ALL						=	"all"; // reserved for when all inputs/outputs are used
SGE.IO_DEFAULT					=	"default"; // default input/output
SGE.IO_TOP						=	"top";
SGE.IO_BOTTOM					=	"bottom";
SGE.IO_RIGHT					=	"right";
SGE.IO_LEFT						=	"left";

// States
SGE.PLUS						=	"plus";
SGE.MINUS						=	"minus";

// Status icon
SGE.STATUS_RUNNING				=	"running";
SGE.STATUS_PAUSED				=	"paused";
SGE.STATUS_IDLE					=	"idle";

// -------------------------------------------------------------------------------------------------
// Events
SGE.BUTTON_TRIGGER_THRESHOLD	=	1500; // how fast (in ms) we can click buttons

// Simulation events
SGE.EVENT_BEGIN_EXPERIMENT		=	"beginExperiment";
SGE.EVENT_END_EXPERIMENT		=	"endExperiment";
SGE.EVENT_PAUSE_EXPERIMENT		=	"pauseExperiment";
SGE.EVENT_RESUME_EXPERIMENT		=	"resumeExperiment";
SGE.EVENT_ENTER					=	"enter"; // particle moves into an object
SGE.EVENT_MOVE_INSIDE			=	"moveInside"; // particle moves inside an object
SGE.EVENT_INTERACT				=	"interact"; // particle interacts with the object
SGE.EVENT_TRIGGER_POINT			=	"triggerPoint"; // particle passes through trigger point
SGE.EVENT_LEAVE					=	"leave"; // particle leaves the object
SGE.EVENT_RELEASE_PARTICLE		=	"release"; // source releases a particle
SGE.EVENT_DETECT_PARTICLE		=	"detect"; // detector detects particle
SGE.EVENT_DETECTED				=	"detected"; // particle was detected
SGE.EVENT_NOT_DETECTED			=	"notDetected"; // particle is not detected (when ignored)

// Interaction events
SGE.EVENT_MOUSE_OVER			=	"mouseOver";
SGE.EVENT_MOUSE_OUT				=	"mouseOut";
SGE.EVENT_MOUSE_DOWN			=	"mouseDown";
SGE.EVENT_MOUSE_UP				=	"mouseUp";
SGE.EVENT_MOUSE_MOVE			=	"mouseMove";
SGE.EVENT_PRESS					=	"press";
SGE.EVENT_RELEASE				=	"release";

// Line styles
SGE.LINE_SOLID					=	"solid";
SGE.LINE_DASHED					=	"dashed";

// #################################################################################################
// Toggle debugging features
SGE.debug = false;

// Very common undefined check
function isUndefined(a) {
	return (typeof(a) == "undefined");
}

// "If ... Default" function
// If a is not undefined, return a, else return the default b
// Shorthand for setting default values everywhere
// This is superior to using a || b, because that checks if a is FALSE, not UNDEFINED
function ifdef(a, b) {
	if (typeof(a) === "undefined") return b; // use native for avoiding overhead
	return a;
}

// Generates a unique ID (not following any UUID/GUID standard)
// These are just 64 random hexadecimal characters
// Used as an internal ID for all objects throughout the engine
// These will always be assigned immediately after object creation
SGE.getUID = function() {
	var s = "";
	while (s.length < 64) s += Math.floor(Math.random() * 16).toString(16);
	return s;
}

// Asset paths
// ToDo: remotes
SGE.asset = function(f) {
	return (SGE.USE_REMOTE_ASSETS ? SGE.REMOTE_ASSETS_PATH : SGE.LOCAL_ASSETS_PATH) + f;
}

// Initialize SGE
SGE.init = function() {
	
	// Wait for jQuery, Three.js and TweenMax
	if (isUndefined(jQuery) || isUndefined(THREE) || isUndefined(TweenMax)) {
		window.setTimeout(function(){ SGE.init(); }, 100);
		return;
	}
	
	// Handle resize
	// Disabled for the time being until proper event coordinate scaling is addressed
	
	// window.addEventListener('resize', SGE.resize, true);
	// s = 1;
	// app.div.style.transform = "translate("+(-app.width/2)+"px,"+(-app.height/2)+"px) scale("+s+","+s+") translate("+(app.width/2)+"px,"+(app.height/2)+"px)";
	
	// ToDo: preload assets, splash screen?
	
}

// -------------------------------------------------------------------------------------------------
// Animation frame handler
SGE.__requestFrame = null; // id of request
SGE.__requestFrameCallback = null; // custom callback
SGE.__stopRequest = false; // request for stop
SGE.__lastTime = 0; // time at last frame
// Start animation frame handler
SGE.startAnimation = function(callback) {
	// Cancel any previous callback
	if (this.__requestFrame) window.cancelAnimationFrame(this.__requestFrame);
	// Reset stop request
	this.__stopRequest = false;
	// Define new callbacks and start running the requests
	this.__requestFrameCallback = callback;
	this.__animationFrame(0);
}
// Stop active request
SGE.stopAnimation = function() {
	this.__stopRequest = true; // marks a stop request
	window.cancelAnimationFrame(this.__requestFrame); // cancel existing requests
}
// Default handler for animations
SGE.__animationFrame = function(t) {
	// t is converted to seconds so it makes more sense everywhere
	t *= 1e-3;
	// Animate objects
	SGE.AnimationManager.animate(t, t - SGE.__lastTime);
	// Call user callback, if any
	if (SGE.__requestFrameCallback) SGE.__requestFrameCallback(t, t - SGE.__lastTime);
	// Request a new frame
	if (!SGE.__stopRequest) {
		SGE.__requestFrame = window.requestAnimationFrame(SGE.__animationFrame);
	}
	SGE.__lastTime = t;
}

// Default material for objects (shiny or not)
SGE.DefaultMaterial = function(params) {
	if (SGE.USE_PHONG_MATERIAL) {
		return new THREE.MeshPhongMaterial(params);
	} else {
		return new THREE.MeshLambertMaterial(params);
	}
};

//--------------------------------------------------------------------------------------------------
// General useful functions

// Custom logger
SGE.log = function(t) { if (console) { console.log("[SGE] " + t); } } // logger
SGE.error = function(t) { throw "[SGE] ERROR: " + t; } // exception thrower
SGE.stack = function() { console.log(new Error().stack); } // print stack trace
// Debug objects
SGE.debugObject = function(o) {
	var s = []; for (k in o) { s.push(k+": "+(typeof(o[k]) != "function"?o[k]:"f()")); }
	alert(s.join("\n"));
}

// Proper human-friendly rounding of number n to l decimal digits
SGE.round = function(n,l) { 
	l = ifdef(l, 0);
	n = n*Math.pow(10,l);
	return (
		(
			Math.abs(n-Math.ceil(n)) < Math.abs(n-Math.floor(n))
			?
			Math.ceil(n) : Math.floor(n)
		)
		/
		Math.pow(10,l)
	);
};

// Easing function for internal animations
SGE.ease = function(x) {
	if (x <= 0) { return 0; }
	if (x <= 0.5) { return 2*x*x; }
	if (x <= 1) { x = (1-x); return 1 - 2*x*x; }
	return 1;
}

// Accurate timestamp if possible
// Otherwise, fallback to something else
SGE.getTime = (function(){
	var f = function() { return window.performance.now(); };
	if (!window.performance.now) {
		if (window.performance.webkitNow) {
			f = function() { return window.performance.webkitNow(); };
		} else {
			f = function() { return new Date().getTime(); };
		}
	}
	return f;
})();

// Get HTML color string
SGE.hex2html = function(c, a) {
	c = [(c >> 16) & 255, (c >> 8) & 255, c & 255];
	if (isUndefined(a)) {
		return "rgb("+c[0]+","+c[1]+","+c[2]+")";
	} else {
		return "rgba("+c[0]+","+c[1]+","+c[2]+","+a+")";
	}
}

// String padding
// Use SGE.PAD_LEFT and SGE.PAD_RIGHT for side
SGE.padString = function(str, len, chr, side) {
	str = str.toString();
	while (str.length < len) {
		if (side == SGE.PAD_LEFT) { 
			str = chr + str;
		} else {
			str = str + chr;
		}
	}
	return str;
}

// Linearly interpolate between two hexadecimal colors
// color1*(1-t) + color2*t
// t in the range [0,1]
SGE.blendColors = function(c1, c2, t) {
	c1 = [(c1 >> 16) & 255, (c1 >> 8) & 255, c1 & 255];
	c2 = [(c2 >> 16) & 255, (c2 >> 8) & 255, c2 & 255];
	var c = Math.floor(c1[0]*(1-t)+c2[0]*t)*0x010000;
	c += Math.floor(c1[1]*(1-t)+c2[1]*t)*0x000100;
	c += Math.floor(c1[2]*(1-t)+c2[2]*t)*0x000001;
	return c;
}

// .ellipse() is not supported by Firefox and other browsers, so we implement our own version
// if it's not available
SGE.drawEllipse = function(ctx, x, y, rx, ry, fill) {
	fill = ifdef(fill, false);
	if (ctx.ellipse) {
		ctx.beginPath();
		ctx.ellipse(x,y,rx,ry,0,0,SGE.TAU,false);
		ctx.closePath();
		if (fill) {
			ctx.fill();
		} else {
			ctx.stroke();
		}
		return;
	}
	var i = 0, it = 64;
	ctx.beginPath();
	ctx.moveTo(x + Math.cos(i/it*SGE.TAU)*rx, y + Math.sin(i/it*SGE.TAU)*ry);
	for (var i = 1;i <= it; i++) {
		ctx.lineTo(x + Math.cos(i/it*SGE.TAU)*rx, y + Math.sin(i/it*SGE.TAU)*ry);
	}
	ctx.closePath();
	if (fill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}

//--------------------------------------------------------------------------------------------------
// Texture loader
// ToDo: a way to preload and initialize the engine
SGE.TextureLoader = {
	manager: null,
	loaders: {},
	textures: {},
	ready: {},
	callbacks: {}
};

SGE.TextureLoader.manager = new THREE.LoadingManager();
SGE.TextureLoader.onLoad = function(path, texture, image) {
	SGE.log("Loaded texture \""+path+"\" successfully." );
	texture.image = image;
	texture.needsUpdate = true;
	this.ready[path] = true; // mark as ready
	this.executeCallbacks(path);
}
SGE.TextureLoader.onProgress = function(path, xhr) {
	//SGE.log("Loading texture at \""+path+"\": "+Math.floor(xhr.loaded / xhr.total * 100));
}
SGE.TextureLoader.onError = function(path, xhr) {
	SGE.log("Error loading texture at \""+path+"\".");
}
SGE.TextureLoader.executeCallbacks = function(path) {
	if (!(path in this.callbacks)) return; // ignore if no callbacks exist
	for (var i = 0; i < this.callbacks[path].length; i++) { // execute all of them
		this.callbacks[path][i]( this.textures[path] );
	}
	delete this.callbacks[path]; // remove callback list, we won't need it anymore
}

// Path is the file path relative to the asset directory
// Callback is a function to call once texture is loaded
// The callback function has one argument, the THREE.Texture object loaded
SGE.TextureLoader.load = function(path, callback) {
	if (path in this.loaders) { // if already attempted to load this
		// handle callback
		if (typeof(callback) == "function") {
			if (this.ready[path]) { // if it's ready (already loaded)
				// trigger callback immediately
				callback(this.textures[path]);
			} else {
				// if not, add to callback queue
				this.callbacks[path].push( callback );
			}
		}
		return this.textures[path];
	} else { // if not, we're trying to load it for the first time
		
		var loader = new THREE.ImageLoader(SGE.TextureLoader.manager);
		var texture = new THREE.Texture();
		loader.load(path,
			function(image){ SGE.TextureLoader.onLoad(path, texture, image); },
			function(xhr){ SGE.TextureLoader.onProgress(path, xhr); },
			function(xhr){ SGE.TextureLoader.onError(path, xhr); }
		);
		this.loaders[path] = loader;
		this.textures[path] = texture;
		this.ready[path] = false;
		this.callbacks[path] = [];
		if (typeof(callback) == "function") { // if a callback was specified
			this.callbacks[path].push( callback ); // add callback to queue
		}
	}
	
	return texture;
}
SGE.TextureLoader.get = function(path) {
	if (path in SGE.TextureLoader.textures) return SGE.TextureLoader.textures[path];
	return SGE.TextureLoader.load(path);
}

//-------------------------------------
// SGE.Application instances, indexed by id (not uid):
SGE.instances = {};

SGE.createApp = function(id, w, h) {
	if (id in this.instances) {
		SGE.error("An SGE.Application named \"" + id + "\" already exists.");
	}
	var a = new SGE.Application(id, w, h);
	this.instances[id] = a;
	return a;
}

SGE.destroyApp = function(id) {
	if (!(id in this.instances)) {
		SGE.error("No SGE.Application named \"" + id + "\" exists.");
	}
	this.instances[id].destroy();
	delete this.instances[id];
}

// #################################################################################################
// APPLICATION

// An SGE.Application object, which is the top-level entity handled by the engine
// Applications offer a "canvas" (not actually a canvas object) where SGE.Components can be
// inserted into
SGE.Application = function(id, w, h) { this.uid = SGE.getUID();
	this.__CLASS = "Application";
	
	// Create DIV element
	this.div = $("<div>")
					.attr("id", id)
					.addClass("SGE_Application")
					.css("position", "relative") // for absolute positions inside
					.css("overflow", "hidden") // we don't want anything to stick out
					.css("width", w)
					.css("height", h).get(0);
	
	// ----------- Properties
	this.id = id;
	this.width = w;
	this.height = h;
	this.children = {};
	
	// ----------- Methods
	this.destroy = function() {
		// ToDo: destroy object, clean up everything
		// (may never be necessary)
	}
	
	this.add = function(c, x, y) {
		if (c.__CLASS != "Component") {
			SGE.error("Only components can be added in a SGE.Application.");
		}
		if (c.uid in this.children) {
			SGE.error("Component is already a child of SGE.Application.");
		}
		
		// Add to children
		this.children[c.uid] = c;
		c.x = x;
		c.y = y;
		c.parent = this;
		
		$(c.div).css('left', x).css('top', y);
		this.div.appendChild(c.div);
	}
	
	this.remove = function(c) {
		if (c.__CLASS != "Component") {
			SGE.error("Only components can be removed in a SGE.Application.");
		}
		if (!(c.uid in this.children)) {
			SGE.error("Component is not a child of SGE.Application.");
		}
		
		delete this.children[c.uid];
		c.parent = null;
		this.div.removeChild(c.div);
	}
	
}



// #################################################################################################
// COMPONENT & SUB CLASSES

// Generic SGE.Component class, extended by other objects.
// Notice that the UID is defined here.
// All components are wrapped inside a DIV and positioned absolutely
SGE.Component = function() { this.uid = SGE.getUID();
	this.__CLASS = "Component";
	this.__SUBCLASS = "";
	
	// Default position and sizes
	this.__x = 0;
	this.__y = 0;
	this.width = 0;
	this.height = 0;
	
	this.div = $("<div>")
		.css("position", "absolute")
		.css("overflow", "hidden") // components never leak outside the div
		.get(0);
	this.parent = null;
	
	this.__init = function() {
		$(this.div)
			.addClass("SGE_"+this.__CLASS)
			.addClass("SGE_"+this.__SUBCLASS);
	}
	
	// Glow functions
	this.__glow = 0;
	Object.defineProperty(this, 'glow', {
		set: function(value) {
			this.__glow = value;
			var r1 = Math.floor(value*SGE.COMPONENT_GLOW_SIZE);
			var r2 = Math.floor(value*SGE.COMPONENT_GLOW_SIZE/2);
			$(this.div).css(
				'box-shadow',
				"0 0 "+r1+"px "+r2+"px "+SGE.hex2html(SGE.COMPONENT_GLOW_COLOR));
		},
		get: function() {
			return this.__glow;
		}
	});
	
	// "Blink" is a quick glow that fades in and out 
	this.blink = function() {
		TweenMax.to(this, 0.5, {
			ease: Power3.easeInOut,
			glow: 1,
			onComplete: function(){
				TweenMax.to(this.target, 0.5, {
					glow: 0,
					ease: Power3.easeInOut
				});
			}
		});
	}
	
	// Fades in the glow and holds
	this.blinkOn = function() {
		TweenMax.killTweensOf(this, { glow: true });
		TweenMax.to(this, 1, {
			ease: Power3.easeInOut,
			glow: 1
		});
	}
	
	// Fades out the glow
	this.blinkOff = function() {
		TweenMax.killTweensOf(this, { glow: true });
		TweenMax.to(this, 1, {
			ease: Power3.easeInOut,
			glow: 0
		});
	}
	
	// Shadow
	this.__shadow = 0;
	Object.defineProperty(this, 'shadow', {
		set: function(value) {
			this.__shadow = value;
			if (value) {
				var r1 = Math.floor(value);
				var r2 = Math.floor(value);
				$(this.div).css(
					'box-shadow',
					r1/3+"px "+r2/3+"px "+r1+"px "+r2+"px rgba(0,0,0,0.3)"
				);
			} else {
				$(this.div).css('box-shadow',"");
			}
		},
		get: function() {
			return this.__shadow;
		}
	});
	
	// Position
	Object.defineProperty(this, 'x', {
		set: function(value) {
			this.__x = value;
			$(this.div).css('left',value+"px");
		},
		get: function() {
			return this.__x;
		}
	});
	Object.defineProperty(this, 'y', {
		set: function(value) {
			this.__y = value;
			$(this.div).css('top',value+"px");
		},
		get: function() {
			return this.__y;
		}
	});
	
}

// 3D viewport for the Stern-Gerlach experiments
SGE.Viewport3D = function(w, h, bgcolor) { SGE.Component.call(this); // initialized parent class
	this.__SUBCLASS = "Viewport3D";
	
	this.width = w;
	this.height = h;
	this.backgroundColor = ifdef(bgcolor, SGE.DEFAULT_BACKGROUND_COLOR);
	this.__camera = null;
	this.camera = null;
	this.fps = null;
	this.sky = null;
	this.debugAxes = null;
	this.statusIcon = null;
	this.raycaster = null;
	this.__orbit = false; // allow user to orbit camera around focus point
	this.orbitData = null; // keeps track of where the user is dragging from in the viewport
	this.events = new SGE.EventDispatcher(this);
	
	this.init = function() {
		this.__init();
		
		this.setCamera(true); // perspective = true
		
		// Raycaster for user interaction
		this.raycaster = new THREE.Raycaster();
		
		// Internal Three.js objects
		// Default settings for most
		// May be altered, if necessary, by direct access to these objects
		// SGE does not provide an interface for the settings, as that would be redundant
		// Most of the settings do not need changing anyway, at least not in normal circumstances
		this.__scene = new THREE.Scene();
		this.__renderer = new THREE.WebGLRenderer({ antialias: SGE.ANTIALIAS });
		this.__renderer.setSize(w, h);
		this.__renderer.setClearColor(this.backgroundColor);
		// Insert renderer element into the Viewport3D div
		this.canvas3d = this.__renderer.domElement;
		this.div.appendChild(this.canvas3d);
		$(this.canvas3d).css('display', "block");
		
		// Add ambient light
		this.ambientLight = new THREE.AmbientLight(SGE.AMBIENT_LIGHT);
		this.__scene.add(this.ambientLight);
		
		// ToDo: better FPS meter
		this.fps = $("<span>")
						.css("position", "absolute")
						.css("display", (SGE.debug?"block":"none"))
						.css("top", 2)
						.css("left", 5)
						.css("font-family", "monospace")
						.css("font-size", "15px")
						.css("color", "#FFFF00")
						.html("00").get(0);
		this.div.appendChild(this.fps);
		
		this.statusIcon = $("<span>")
						.css("position", "absolute")
						.css("display", "block")
						.css("background-image", "url("+SGE.asset("status_icon.png")+")")
						.css("background-position", "0 0")
						.css("width", 30)
						.css("height", 30)
						.css("opacity", 0)
						.css("left", 5)
						.css("top", this.height - 30 - 5)
						.get(0);
		this.div.appendChild(this.statusIcon);
		
		// Add sky-sphere as a default object
		// Sky is a sphere with a gradient texture, blended with a color
		// The gradient has a horizontal symmetry, which improves perception of space and direction
		this.sky = (function(viewport){
			var g = new THREE.SphereGeometry(
				SGE.SKY_RADIUS,
				16,
				2
			);
			var m = new THREE.MeshBasicMaterial({
				color: SGE.SKY_COLOR,
				side: THREE.BackSide,
				map: SGE.TextureLoader.get(SGE.asset('sky.png')),
				depthWrite: false
			});
			var o = new THREE.Mesh(g, m);
			
			viewport.__scene.add(o);
			return o;
		})(this);
		
		// Reference axes
		this.debugAxes = (function(viewport){
			var axes = new THREE.Group();
			var m, g, l, s = SGE.AXIS_SIZE;
			
			// x
			m = new THREE.LineBasicMaterial({ color: 0xFF0000 });
			g = new THREE.Geometry();
			g.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(s,0,0));
			axes.add(new THREE.Line(g,m));
			
			// y
			m = new THREE.LineBasicMaterial({ color: 0x00FF00 });
			g = new THREE.Geometry();
			g.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(0,s,0));
			axes.add(new THREE.Line(g,m));
			
			// z
			m = new THREE.LineBasicMaterial({ color: 0x0000FF });
			g = new THREE.Geometry();
			g.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,s));
			axes.add(new THREE.Line(g,m));
			
			viewport.__scene.add(axes);
			return axes;
		})(this);
		this.debugAxes.visible = false;
		
		
		// Add event handlers
		// https://developer.mozilla.org/en-US/docs/Web/Events
		var evObj = { viewport: this };
		$(this.__renderer.domElement)
			.bind("touchmove", evObj, this.evPointerMove)
			.bind("mousemove", evObj, this.evPointerMove);
		
		$(this.__renderer.domElement)
			.bind("tap", evObj, this.evPress)
			.bind("click", evObj, this.evPress);
			
		$(this.__renderer.domElement)
			.bind("touchstart", evObj, this.evPointerDown)
			.bind("mousedown", evObj, this.evPointerDown);
		
	}
	
	this.__cameraPerspective = null;
	this.setCamera = function(perspective) {
		
		delete this.camera;
		delete this.__camera;
		
		// Do nothing if no change
		if (perspective == this.__cameraPerspective) return;
		
		if (perspective) {
			// Three.js camera
			this.__camera = new THREE.PerspectiveCamera(
				SGE.DEFAULT_CAMERA_FOV,
				this.width/this.height,
				SGE.CAMERA_Z_NEAR,
				SGE.CAMERA_Z_FAR
			);
		} else {
			// ToDo orthographic?
			// THREE.OrthographicCamera( left, right, top, bottom, near, far )
		}
		
		this.__cameraPerspective = perspective;
		
		// SGE camera interface
		this.camera = new SGE.Camera(this.__camera);
	}
	
	// Add a point light, returns it
	this.addLight = function(x, y, z, color) {
		var l = new THREE.PointLight(color);
		// ToDo: use vector3.copy()
		l.position.x = x;
		l.position.y = y;
		l.position.z = z;
		this.__scene.add(l);
		return l;
	}
	
	// Remove point light, as returned by addLight()
	this.removeLight = function(light) {
		this.__scene.remove(light);
	}
	
	// Add experiment
	this.experiments = {};
	this.addExperiment = function(exp) {
		this.experiments[exp.uid] = exp;
		exp.__viewports[this.uid] = this;
		var self = this;
		this.__scene.add(exp.__group);
	}
	this.removeExperiment = function(exp) {
		this.__scene.remove(exp.__group);
		delete exp.__viewports[this.uid];
		delete this.experiments[exp.uid];
	}
	
	// Update experiments (before rendering)
	this.updateExperiments = function() {
		for(var i in this.experiments) {
			this.experiments[i].updatePositions();
		}
	}
	
	// Add/remove general 3D object
	this.add = function(obj) {
		this.__scene.add(obj);
	}
	this.remove = function(obj) {
		this.__scene.remove(obj);
	}
	
	// Update viewport
	this.lastRenderTime = 0;
	this.lastFPSUpdate = 0;
	this.fpsAverageTotal = 0;
	this.fpsAverageNum = 0;
	this.fpsUpdatePeriod = 200;
	this.render = function() {
		this.updatePointerOvers();
		this.updateExperiments();
		if (this.camera.__focusedOn) this.camera.update();
		this.__renderer.render(this.__scene, this.__camera);
		// If debug mode, we show a FPS meter
		if (SGE.debug) {
			var t = SGE.getTime();
			var fps = 1e3/(t-this.lastRenderTime); // find FPS according to last frame rendered
			this.fpsAverageTotal += fps; // tally a total
			this.fpsAverageNum++; // and number of samples
			// If we haven't updated the FPS after a long enough period
			if ((t - this.lastFPSUpdate) >= this.fpsUpdatePeriod) {
				// we compute average fps
				fps = Math.floor(this.fpsAverageTotal/this.fpsAverageNum).toString();
				// and display it
				if (fps.length == 1) fps = "0"+fps;
				this.fps.textContent = fps;
				// We also reset for the next samples
				this.lastFPSUpdate = t;
				this.fpsAverageNum = 0;
				this.fpsAverageTotal = 0;
			}
			this.lastRenderTime = t;
		}
	}
	
	// Keep track of mouse/finger (or generally, "pointer") coordinates at all times
	this.pointerCoords = new THREE.Vector2();
	
	// Get object at a given 2D coordinate in the viewport
	this.getObjectAt = function(pos) {
		// Normalize coordinates
		var at = new THREE.Vector2(
			(pos.x / this.width)*2-1,
			-(pos.y / this.height)*2+1
		);
		
		// Setup raycaster
		this.raycaster.setFromCamera(at, this.__camera);
		
		// List of interactive objects in the scene
		var list = [];
		for(var i in this.experiments) {
			for(var o in this.experiments[i].children) {
				list.push(this.experiments[i].children[o].sceneObject.object3d);
			}
		}
		
		// Find intersections
		var intersects = this.raycaster.intersectObjects(
			list, true
		);
		
		// If no intersections, we hit background or other useless things
		if (intersects.length == 0) return null;
		
		// Get ThreeJS object that intersected (usually, a random mesh inside our object)
		// The first one in the list will be the object closer to the camera
		var obj = intersects[0].object;
		
		// Move up the hierarchy until we find the sceneObject with userData set
		// This is guaranteed to occur, since active objects are always in SceneObjects
		while (isUndefined(obj.userData.experimentObject)) {
			obj = obj.parent;
		}
		
		// The reference to the abstract object is stored in the userData of the scene object
		obj = obj.userData.experimentObject;
		
		// Return the abstract SGE object
		return obj;
	}
	
	// ---------------------------------------------------------------------------------------------
	// Event handlers
	
	// Update and trigger mouseOver/mouseOut events
	this.updatePointerOvers = function() {
		var objOver = this.getObjectAt(this.pointerCoords);
		var obj;
		
		for(var i in this.experiments) {
			for(var o in this.experiments[i].children) {
				obj = this.experiments[i].children[o];
				if (obj && obj.mouseOver) {
					if (objOver === null || obj.uid != objOver.uid) {
						obj.mouseOver = false;
						obj.events.trigger(SGE.EVENT_MOUSE_OUT);
					}
				} else {
					if (objOver != null && obj.uid == objOver.uid) {
						obj.mouseOver = true;
						obj.events.trigger(SGE.EVENT_MOUSE_OVER);
					}
				}
			}
		}
		
		// If mouse is over some object
		if (objOver && objOver.interactive) {
			// Use that object's cursor
			if (this.canvas3d.style.cursor != objOver.cursor) {
				this.canvas3d.style.cursor = objOver.cursor;
			}
		} else {
			// Reset cursor otherwise
			if (this.orbit) {
				this.canvas3d.style.cursor = "move";
			} else {
				if (this.canvas3d.style.cursor != "default") {
					this.canvas3d.style.cursor = "default";
				}
			}
		}
	}
	
	// Updates last known position of pointer (mouse/finger)
	this.updatePointerCoords = function(event) {
		var parentOffset = $(this.canvas3d).parent().offset();
		var type = event.type.substr(0,5);
		if (type == "mouse") {
			this.pointerCoords.x = event.pageX - parentOffset.left;
			this.pointerCoords.y = event.pageY - parentOffset.top;
		} else if (type == "touch") {
			var touch = ifdef(event.originalEvent.touches[0], event.originalEvent.changedTouches[0]);
			if (touch) {
				this.pointerCoords.x = touch.pageX - parentOffset.left;
				this.pointerCoords.y = touch.pageY - parentOffset.top;
			}
		}
		
	}
	
	// Update pointer coordinates and trigger/update mouseOver states
	this.evPointerMove = function(e) {
		e.preventDefault();
		
		var viewport = e.data.viewport;
		
		viewport.updatePointerCoords(e);
		
		if (viewport.orbit && viewport.orbitData) {
			var dx = (viewport.pointerCoords.x - viewport.orbitData.x);
			var dy = (viewport.pointerCoords.y - viewport.orbitData.y);
			viewport.orbitMove(dx, dy);
		}
		
		viewport.events.trigger(SGE.EVENT_MOUSE_MOVE, { button: e.button });
	}
	
	// Trigger click/tap (press) events
	this.evPress = function(e) {
		var type = e.type.substr(0,5);
		var viewport = e.data.viewport;
		
		viewport.updatePointerCoords(e); // update cursor position anyway
		
		if (type == "mouse" && e.button != 0) return; // only care about left-click
		if (type == "touch") {
			// Ignore multiple touches
			if (e.originalEvent.touches.length > 1) return;
			if (e.originalEvent.changedTouches.length > 1) return;
		}
		
		var objOver = viewport.getObjectAt(viewport.pointerCoords);
		
		// If we pressed on an object
		if (objOver && objOver.interactive) {
			objOver.events.trigger(SGE.EVENT_PRESS, { button: e.button });
		}
		
		viewport.events.trigger(SGE.EVENT_PRESS, { button: e.button });
		
		// Disabled due to potential unresolved bugs in certain mobile platforms
		// if (type == "touch") e.stopPropagation();
	}
	
	this.evPointerDown = function(e) {
		var type = e.type.substr(0,5);
		var viewport = e.data.viewport;
		
		viewport.updatePointerCoords(e); // update pointer position anyway
		
		if (type == "mouse" && e.button != 0) return; // only care about left-click
		if (type == "touch") {
			// Ignore multiple touches
			if (e.originalEvent.touches.length > 1) return;
			if (e.originalEvent.changedTouches.length > 1) return;
		}
		
		var objOver = viewport.getObjectAt(viewport.pointerCoords);
		
		if (viewport.camera.focusedOn) {
			if (objOver === null || !objOver.interactive) {
				viewport.orbitData = {
					x: viewport.pointerCoords.x,
					y: viewport.pointerCoords.y,
					theta: viewport.camera.theta,
					phi: viewport.camera.phi,
					rho: viewport.camera.rho
				};
			}
		}
		
		// If on an object
		if (objOver && objOver.interactive) {
			objOver.events.trigger(SGE.EVENT_MOUSE_DOWN, { button: e.button });
		}
		
		viewport.events.trigger(SGE.EVENT_MOUSE_DOWN, { button: e.button });
		
		$(window)
			.bind("touchend", e.data, viewport.evPointerUp)
			.bind("mouseup", e.data, viewport.evPointerUp);
		
		// Disabled due to potential unresolved bugs in certain mobile platforms
		// if (type == "touch") e.stopPropagation();
	}
	
	this.evPointerUp = function(e) {
		var type = e.type.substr(0,5);
		var viewport = e.data.viewport;
		
		viewport.updatePointerCoords(e); // update pointer position anyway
		
		if (type == "mouse" && e.button != 0) return; // only care about left-click
		// Always cancel in case of touch, because it can be finnicky (accidental double touch)
		
		var objOver = viewport.getObjectAt(viewport.pointerCoords);
		
		viewport.orbitData = null;
		
		if (objOver && objOver.interactive) {
			objOver.events.trigger(SGE.EVENT_MOUSE_UP, { button: e.button });
		}
		
		viewport.events.trigger(SGE.EVENT_MOUSE_UP, { button: e.button });
		
		$(window)
			.unbind("touchend", viewport.evPointerUp)
			.unbind("mouseup", viewport.evPointerUp);
		
		// Disabled due to potential unresolved bugs in certain mobile platforms
		// if (type == "touch") e.stopPropagation();
	}
	
	Object.defineProperty(this, 'statusIconOpacity', {
		set: function(value) {
			$(this.statusIcon).css('opacity', value);
		},
		get: function() { return $(this.statusIcon).css('opacity'); }
	});
	
	this.__updateStatus = function() {
		var exp;
		var running = 0, paused = 0, total = Object.keys(this.experiments).length;
		for(var i in this.experiments) {
			exp = this.experiments[i];
			if (exp.isRunning) {
				running++;
				if (exp.isPaused) {
					paused++;
				}
			}
		}
		if (running == 0) {
			this.__setStatus(SGE.STATUS_IDLE);
		} else {
			if (running == paused) {
				this.__setStatus(SGE.STATUS_PAUSED);
			} else {
				this.__setStatus(SGE.STATUS_RUNNING);
			}
		}
	}
	
	this.__setStatus = function(status) {
		switch(status) {
			case SGE.STATUS_RUNNING:
				$(this.statusIcon).css("background-position", "0 0");
				TweenMax.to(this, 0.5, {
					statusIconOpacity: 1,
					ease: Power4.easeInOut
				});
				break;
			case SGE.STATUS_PAUSED:
				$(this.statusIcon).css("background-position", "-30px 0");
				TweenMax.to(this, 0.5, {
					statusIconOpacity: 1,
					ease: Power4.easeInOut
				});
				break;
			case SGE.STATUS_IDLE:
			default:
				TweenMax.to(this, 0.5, {
					statusIconOpacity: 0,
					ease: Power4.easeInOut
				});
		}
	}
	
	// ---------------------------------------------------------------------------------------------
	// Orbit controls
	
	Object.defineProperty(this, 'orbit', {
		set: function(value) {
			this.__orbit = true;
		},
		get: function() {
			return this.__orbit;
		}
	});
	
	this.orbitMove = function(dx, dy) {
		if (this.camera.focusedOn === null) return;
		// ToDo: prevent moving camera into objects? Not trivial, maybe not necessary
		this.camera.theta = this.orbitData.theta + dx/this.width*SGE.TAU/2;
		this.camera.phi = this.orbitData.phi - dy/this.height*SGE.TAU/2;
		this.camera.rho = this.orbitData.rho;
	}
	
	this.init();
}
SGE.Viewport3D.prototype = Object.create(SGE.Component.prototype);
SGE.Viewport3D.prototype.constructor = SGE.Viewport3D;


// Message box for text messages and instructions
SGE.MessageBox = function(w, h) { SGE.Component.call(this); // initialized parent class
	this.__SUBCLASS = "MessageBox";
	
	this.width = w;
	this.height = h;
	this.__contents = null;
	this.animating = false;
	
	this.init = function() {
		this.__init();
		$(this.div)
			.css('width', this.width)
			.css('height', this.height)
			.css('overflow-x', "hidden")
			.css('overflow-y', "scroll");
		
		this.__contents = $("<div>")
			.addClass("contents")
			.get(0);
			
		this.__contents.style.opacity = 1;
			
		this.div.appendChild(this.__contents);
	}
	
	Object.defineProperty(this, 'contentOpacity', {
		set: function(value) {
			this.__contents.style.opacity = value;
		},
		get: function() {
			return this.__contents.style.opacity;
		}
	});
	
	// Change the message box text
	// text:  Can be a string containing the HTML contents for the message box, or an array
	//        of such strings. In the case of an array, strings will each be separated into their
	//        own paragraphs. Use \n to force a line break (which is just replaced by <br/>).
	//
	// blink: Boolean. Specifies whether the message box should glow briefly when contents change.
	//        True by default. Use setMessage(text, false) followed by blinkOn() to make the glow
	//        stick instead of fading away immediately.
	this.setMessage = function(text, blink) {
		if (text === null) return; // null leaves it as-is
		blink = ifdef(blink, true);
		text = ifdef(text, "");
		// If array, we have multiple paragraphs
		if (Array.isArray(text)) text = text.join("</p><p>");
		
		// Replace \n by HTML line-breaks, add enclosing paragraph tags
		text = "<p>"+text.replace("\n","<br/>")+"</p>";
		TweenMax.to(this, 0.5, {
			contentOpacity: 0,
			onComplete: function() {
				$(this.target.__contents).html(text);
				$(this.target.div).scrollTop(0);
				TweenMax.to(this.target, 0.5, {
					contentOpacity: 1,
					onComplete: (blink ? this.target.blink() : function(){})
				});
			}
		});
	}
	
	this.clear = function() {
		this.setMessage("", false);
	}
	
	this.init();
}
SGE.MessageBox.prototype = Object.create(SGE.Component.prototype);
SGE.MessageBox.prototype.constructor = SGE.MessageBox;



// Clickable interface buttons
SGE.Button = function(w, h, text, color) { SGE.Component.call(this); // initialized parent class
	this.__SUBCLASS = "Button";
	
	this.width = w;
	this.height = h;
	this.__text = text;
	this.__color = null;
	this.__enabled = false;
	this.__locked = false;
	this.__pressedTime = null;
	this.events = new SGE.EventDispatcher(this);
	
	this.init = function() {
		this.__init();
		$(this.div)
			.css('width', this.width)
			.css('height', this.height);
		
		this.__button = $("<button>")
			.html(this.__text)
			.css('width', this.width)
			.css('height', this.height)
			.css('font-size', this.height/2)
			.css('font-weight', "bold")
			.css('outline', "none")
			.css('padding', "0")
			.css('margin', "0")
			.bind('mousedown', this, this.evDown)
			.bind('touchstart', this, this.evDown)
			.bind('click', this, this.evPress)
			.bind('tap', this, this.evPress)
			.get(0);
			
		this.color = color;
		this.enabled = false;
		
		this.div.appendChild(this.__button);
	}
	
	// Automatically enable/disable based on whether it is pressable
	// However, this limits the functionality. It's best if we can disable but keep events
	// this.__eventsChanged = function() {
		//this.enabled = (this.events.hasEvent(SGE.EVENT_PRESS));
	// }
	
	Object.defineProperty(this, 'enabled', {
		set: function(value) {
			this.__enabled = value;
			if (value) {
				if (this.__locked) {
					$(this.__button)
						.css('opacity', 0.66)
						.attr('title', "Please wait...")
						.css('cursor', 'progress');
				} else {
					$(this.__button)
						.css('opacity', 1)
						.attr('title', "")
						.css('cursor', 'pointer');
				}
			} else {
				$(this.__button)
					.css('opacity', 0.33)
					.attr('title', "This button is disabled")
					.css('cursor', 'not-allowed');
			}
		},
		get: function() { return this.__enabled; }
	});
	
	Object.defineProperty(this, 'color', {
		set: function(value) {
			this.__color = value;
			
			// Border base color
			var cl = SGE.hex2html(SGE.blendColors(value,0xFFFFFF,0.5)); // light
			var cd = SGE.hex2html(SGE.blendColors(value,0x000000,0.4));
			
			this.__textVersion = $("<span>")
				.html(this.__text)
				.css('font-size', '85%')
				.css('font-weight', 'bold')
				.css('display', 'inline-block')
				.css('vertical-align', 'baseline')
				.css('padding', '2px 10px')
				.css('color', SGE.hex2html(SGE.blendColors(value, 0, 0.75)))
				.css('border', "1px solid")
				.css('border-color', [cl,cd,cd,cl].join(" "))
				.css('background', SGE.hex2html(SGE.blendColors(value, 0x444444, 0.1)))
				.css('background','linear-gradient(to bottom,'+
					SGE.hex2html(SGE.blendColors(value, 0xFFFFFF, 0.3))+' 0%,'+
					SGE.hex2html(SGE.blendColors(value, 0xFFFFFF, 0.2))+' 45%,'+
					SGE.hex2html(SGE.blendColors(value, 0x444444, 0.1))+' 55%,'+
					SGE.hex2html(SGE.blendColors(value, 0x444444, 0.4))+' 100%'+
				')').prop('outerHTML');
			
			$(this.__button)
				.css('color', SGE.hex2html(SGE.blendColors(value, 0, 0.75)))
				.css('border', "3px solid")
				.css('border-color', [cl,cd,cd,cl].join(" "))
				.css('background', SGE.hex2html(SGE.blendColors(value, 0x444444, 0.1)))
				.css('background','linear-gradient(to bottom,'+
					SGE.hex2html(SGE.blendColors(value, 0xFFFFFF, 0.3))+' 0%,'+
					SGE.hex2html(SGE.blendColors(value, 0xFFFFFF, 0.2))+' 45%,'+
					SGE.hex2html(SGE.blendColors(value, 0x444444, 0.1))+' 55%,'+
					SGE.hex2html(SGE.blendColors(value, 0x444444, 0.4))+' 100%'+
				')');
			
		},
		get: function() {
			return this.__color;
		}
	});
	
	this.__textVersion = null;
	Object.defineProperty(this, 'textVersion', {
		get: function() {
			return this.__textVersion;
		}
	});
	
	// ToDo: sink the button text
	// Actually, create a div with absolute position inside, and move that
	// Use it for text and images
	this.evDown = function(e) {
		var bt = e.data;
		if (!bt.enabled) return;
		var type = e.type.substr(0,5);
		if (type == "mouse" && e.button != 0) return; // We only care about left-click or taps
		var t = SGE.getTime();
		if ((t - bt.__pressedTime) < SGE.BUTTON_TRIGGER_THRESHOLD) return;
		var cl = SGE.hex2html(SGE.blendColors(bt.__color,0xFFFFFF,0.5));
		var cd = SGE.hex2html(SGE.blendColors(bt.__color,0x000000,0.4));
		$(bt.__button)
			.css('border-color', [cd,cl,cl,cd].join(" "));
		$(window)
			.bind('mouseup', bt, bt.evUp)
			.bind('touchend', bt, bt.evUp);
	}
	
	this.evUp = function(e) {
		var bt = e.data;
		$(window)
			.unbind('mouseup', bt.evUp)
			.unbind('touchend', bt.evUp);
		if (!bt.enabled) return;
		var type = e.type.substr(0,5);
		if (type == "mouse" && e.button != 0) return; // We only care about left-click or taps
		var cl = SGE.hex2html(SGE.blendColors(bt.__color,0xFFFFFF,0.5));
		var cd = SGE.hex2html(SGE.blendColors(bt.__color,0x000000,0.4));
		$(bt.__button)
			.css('border-color', [cl,cd,cd,cl].join(" "));
	}
	
	this.evPress = function(e) {
		var bt = e.data;
		if (!bt.enabled) return;
		var t = SGE.getTime();
		if ((t - bt.__pressedTime) < SGE.BUTTON_TRIGGER_THRESHOLD) return;
		bt.__lock();
		bt.__pressedTime = t;
		e.data.events.trigger(SGE.EVENT_PRESS);
	}
	
	this.__lock = function() {
		var self = this;
		clearTimeout(this.__pressedTimer);
		this.__pressedTimer = setTimeout(function(){
			self.__unlock();
		}, SGE.BUTTON_TRIGGER_THRESHOLD);
		// Lock
		this.__locked = true;
		this.enabled = this.__enabled;
	}
	
	this.__unlock = function() {
		// Reset state
		this.__locked = false;
		this.enabled = this.__enabled;
	}
	
	this.init();
}
SGE.Button.prototype = Object.create(SGE.Component.prototype);
SGE.Button.prototype.constructor = SGE.Button;

SGE.ImageButton = function(w, h, image) { }


// 2D Canvas to draw things on
// It's composed of stacked canvases, so overlays and animations can be drawn
SGE.Canvas2D = function(w, h) { SGE.Component.call(this); // initialized parent class
	this.__SUBCLASS = "Canvas2D";
	
	this.__layers = {};
	this.__layerOrder = [];
	this.__currentLayer = null;
	this.__images = {};
	
	this.init = function(w, h) {
		this.__init();
		
		this.__width = w;
		this.__height = h;
		
		$(this.div)
			.css('width', this.width)
			.css('height', this.height)
			.css('overflow-x', "hidden")
			.css('overflow-y', "hidden");
			
		
		this.__span = $("<span>")
			.css('position',"absolute")
			.css('top',"-9999px")
			.css('left',"-9999px")
			.css('visibility',"hidden")
			.get(0);
		
		// Make it non-interactive by default
		this.interactive = false;
		
		this.__currentLayer = this.addLayer("background");
	}
	
	this.addLayer = function(name) {
		if (!isUndefined(name) && name in this.__layers) {
			SGE.error("Layer \""+ name +"\" already exists.");
		}
		
		var id = SGE.getUID();
		var canvas = $("<canvas>")
				.attr('width', this.width)
				.attr('height', this.height)
				.css('position', "absolute")
				.css('top', 0)
				.css('left', 0)
				.attr('sge:layer', ifdef(name, id))
				.get(0);
		var context = canvas.getContext("2d");
		
		// In order for shapes drawn to look sharp, we need to center the coordinates in the middle
		// of the pixels, so we transform the context by adding a half-pixel offset.
		// This makes drawing images blurry, however, but we compensate for that then.
		// (See the SGE.Canvas2D.image() method below)
		context.translate(0.5, 0.5);
		
		this.div.appendChild(canvas);
		
		id = ifdef(name, id);
		
		this.__layers[id] = {
			uid: id,
			canvas: canvas,
			context: context
		};
		
		this.__layerOrder.push(id);
		this.updateLayers();
		
		return id;
	}
	
	this.updateLayers = function() {
		var id;
		for (var i = 0; i < this.__layerOrder.length; i++) {
			id = this.__layerOrder[i];
			$(this.__layers[id].canvas).css('z-index', i);
		}
	}
	
	this.selectLayer = function(id) {
		if (!(id in this.__layers)) SGE.error("Layer \""+ id +"\" doesn't exist.");
		this.__currentLayer = id;
		return this;
	}
	
	this.selectLayerByDepth = function(depth) {
		if (depth < 0 || depth >= this.__layerOrder.length) {
			SGE.error("Invalid layer depth: "+depth);
		}
		this.selectLayer(this.__layerOrder[depth]);
		return this;
	}
	
	this.clear = function(rgb, a) {
		rgb = ifdef(rgb, 0xFFFFFF);
		a = ifdef(a, 1);
		// Make sure to cover all canvas, so make rectangle larger
		var ctx = this.context2d;
		ctx.clearRect(-1, -1, this.width+2, this.height+2);
		ctx.fillStyle = SGE.hex2html(rgb, a);
		ctx.fillRect(-1, -1, this.width+2, this.height+2);
	}
	
	this.fillRect = function(x, y, w, h, rgb, a) {
		var ctx = this.context2d;
		ctx.fillStyle = SGE.hex2html(rgb,a);
		ctx.fillRect(x, y, w, h);
		return this;
	}
	
	this.rect = function(x, y, w, h, rgb, a, s) {
		var ctx = this.context2d;
		ctx.strokeStyle = SGE.hex2html(rgb,a);
		ctx.lineWidth = s;
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.closePath();
		ctx.stroke();
		return this;
	}
	
	this.ellipse = function(x, y, w, h, rgb, a, s) {
		var ctx = this.context2d;
		ctx.strokeStyle = SGE.hex2html(rgb,a);
		ctx.lineWidth = s;
		SGE.drawEllipse(ctx, x, y, w/2, h/2, false);
		return this;
	}
	
	this.fillEllipse = function(x, y, w, h, rgb, a) {
		var ctx = this.context2d;
		ctx.fillStyle = SGE.hex2html(rgb,a);
		SGE.drawEllipse(ctx, x, y, w/2, h/2, true);
		return this;
	}
	
	this.circle = function(x, y, r, rgb, a, s) {
		this.ellipse(x, y, 2*r, 2*r, rgb, a, s);
		return this;
	}
	
	this.fillCircle = function(x, y, r, rgb, a) {
		this.fillEllipse(x, y, 2*r, 2*r, rgb, a);
		return this;
	}
	
	this.line = function(x1, y1, x2, y2, rgb, a, s) {
		var ctx = this.context2d;
		ctx.strokeStyle = SGE.hex2html(rgb,a);
		ctx.lineWidth = s;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.closePath();
		ctx.stroke();
		return this;
	}
	
	// Coords is array of arrays: [[x,y],[x,y],...]
	this.lines = function(coords, rgb, a, s) {
		for (var i = 0; i < coords.length-1; i++) {
			this.line(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1], rgb, a, s);
		}
		return this;
	}
	
	// Draw image on canvas (for icons)
	// dest and src are objects defining a rectangle:
	// Example: { x: 0, y: 0, w: 100, h: 100 }
	// Only dest.x and dest.y are mandatory parameters. In that case, widths and heights
	// are assumed to encompass the entire image
	// src is optional, and defines the source rectangle
	// If src is given, it MUST include all four xywh parameters
	// ctx forces the use of a specific context, this is for handling multiple layers
	this.image = function(url, dest, src, ctx) {
		ctx = ifdef(ctx, this.context2d);
		
		var img, ref;
		var canvas = this; // dummy reference to this object for the callbacks
		
		// If URL was already used
		if (url in this.__images) {
			
			ref = this.__images[url];
			img = ref.image;
			
			// We check if it's already loaded
			if (ref.loaded) {
				// If it's loaded, we just draw it
				
				// If we didn't specify the source rect info, we assume the whole image
				if (isUndefined(src)) {
					src = { x: 0, y: 0, w: img.width, h: img.height };
				}
				
				// If we didn't specify width and height on destination, we assume
				// the same size of the rectangle we are using as a source
				dest.w = ifdef(dest.w, src.w);
				dest.h = ifdef(dest.h, src.h);
				
				// We draw the image
				// The -0.5 offsets align the pixels properly for this case
				// Drawing shapes requires the offset to make them sharp, so we translated
				// the context when we initialized it.
				// But here, that becomes an issue and makes images blurry.
				// We are just compensating.
				ctx.drawImage(
					img,
					src.x - 0.5, src.y - 0.5, src.w, src.h,
					dest.x, dest.y, dest.w, dest.h
				);
				
				return this;
			}
			
			// If not loaded yet, we add another listener
			img.addEventListener("load", function(){
				ref.loaded = true;
				canvas.image(url, dest, src, ctx);
			});
			
		} else {
			// If we never used this URL, we need to create a loader
			// We can only draw the image after it's loaded
			SGE.log("Loading image \""+url+"\"");
			img = new Image();
			this.__images[url] = { image: img, loaded: false };
			ref = this.__images[url];
			img.addEventListener("load", function(){
				ref.loaded = true;
				canvas.image(url, dest, src, ctx);
			});
			img.src = url;
		}
		
		return this;
	}
	
	// Draw text. y coordinate is for the center line of the text
	// Anchor is:
	//     -1 (SGE.ALIGN_LEFT)  
	//      0 (SGE.ALIGN_CENTER)
	//     +1 (SGE.ALIGN_RIGHT) 
	// Angle rotates around the anchor
	this.text = function(text, x, y, rgb, fontStyle, anchor, angle) {
		angle = ifdef(angle, 0);
		anchor = ifdef(anchor, SGE.ALIGN_LEFT);
		this.context2d.font = fontStyle;
		$(this.__span).css('font',fontStyle).html(text);
		$(document.body).append(this.__span);
		var tw = this.context2d.measureText(text).width;
		var th = $(this.__span).height();
		var ox = 0;
		switch (anchor) {
			case -1:
				ox = 0;
				break;
			case 0:
				ox = - tw / 2;
				break;
			case +1:
				ox = - tw;
				break;
		}
		var ctx = this.context2d;
		ctx.save(); // Backup context
		ctx.translate(x, y); // Translate to desired position
		ctx.rotate(-angle); // Rotate context. Negative makes direction more intuitive.
		ctx.fillStyle = SGE.hex2html(rgb);
		ctx.textBaseline = "top"; // Baseline to top makes text height predictable
		ctx.beginPath();
		ctx.fillText(text, ox, - th / 2 - 1); // offsets in rotated context
		ctx.closePath();
		ctx.restore(); // restore context
		return this;
	}
	
	Object.defineProperty(this, 'context2d', {
		get: function() { return this.__layers[this.__currentLayer].context; }
	});
	
	Object.defineProperty(this, 'layerOpacity', {
		set: function(value) {
			if (value) {
				$(this.__layers[this.__currentLayer].canvas)
					.css('opacity', value)
					.css('display', "");
			} else {
				$(this.__layers[this.__currentLayer].canvas)
					.css('opacity', '0')
					.css('display', "none");
			}
		},
		get: function() {
			return parseFloat($(this.__layers[this.__currentLayer].canvas).css('opacity'));
		}
	});
	
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			if (value) {
				$(this.div)
					.css('opacity', value)
					.css('display', "");
			} else {
				$(this.div)
					.css('opacity', '0')
					.css('display', "none");
			}
		},
		get: function() { return parseFloat($(this.div).css('opacity')); }
	});
	
	// Pass through pointer events if false (this is the default)
	Object.defineProperty(this, 'interactive', {
		set: function(value) {
			$(this.div).css('pointer-events', (value ? "" : "none"));
		},
		get: function() { return !($(this.div).css('pointer-events') == "none"); }
	});
	
	// ToDo: copy each layer before resizing canvas, so contents aren't lost
	this.__resize = function() {
	}
	
	Object.defineProperty(this, 'width', {
		set: function(value) {
			this.__width = value;
			this.__resize();
		},
		get: function() { return this.__width; }
	});
	Object.defineProperty(this, 'height', {
		set: function(value) {
			this.__height = value;
			this.__resize();
		},
		get: function() { return this.__height; }
	});
	
	this.init(w, h);
}
SGE.Canvas2D.prototype = Object.create(SGE.Component.prototype);
SGE.Canvas2D.prototype.constructor = SGE.Canvas2D;



// #################################################################################################
// Abstract objects

// 3D camera with better interface for animation 
SGE.Camera = function(camera) {
	
	this.__camera = camera;
	this.__focusedOn = null; // ToDo: normalize these names and the related functions
	this.__focusedOnVector = new THREE.Vector3();
	this.__lookAt = null;
	this.__savedState = null;
	
	// Field of view
	Object.defineProperty(this, 'fov', {
		set: function(value) {
			this.__camera.fov = value;
			this.__camera.updateProjectionMatrix();
		},
		get: function() {
			return this.__camera.fov;
		}
	});
	
	// Shorthands for position.x/y/z
	Object.defineProperty(this, 'x', {
		set: function(value) {
			this.__camera.position.x = value;
			this.update();
		},
		get: function() {
			return this.__camera.position.x;
		}
	});
	
	Object.defineProperty(this, 'y', {
		set: function(value) {
			this.__camera.position.y = value;
			this.update();
		},
		get: function() {
			return this.__camera.position.y;
		}
	});
	
	Object.defineProperty(this, 'z', {
		set: function(value) {
			this.__camera.position.z = value;
			this.update();
		},
		get: function() {
			return this.__camera.position.z;
		}
	});
	
	// Returns a plain object with XYZ+polar location of the camera
	// For quickly backing up and restoring later
	Object.defineProperty(this, 'location', {
		get: function() {
			var p = {
				x: this.__camera.position.x,
				y: this.__camera.position.y,
				z: this.__camera.position.z
			};
			if (this.__focusedOn) {
				p.rho = this.rho;
				p.theta = this.theta;
				p.phi = this.phi;
			}
			return p;
		}
	});
	
	// Instantly changes camera to look at another object, and start following it
	this.focusOn = function(object) {
		this.__focusedOn = object;
		this.update();
	}
	
	Object.defineProperty(this, 'focusedOn', {
		get: function() {
			return this.__focusedOn;
		}
	});
	
	
	// Smoothly move the camera to point towards another object, then follow it
	// Notice that we inherently use Power2.easeInOut here. This is because sharper tweens look
	// unnatural for cameras. Make sure to move camera position with Power2.easeInOut for better
	// cinematography
	this.moveFocusTo = function(object, time, delay) {
		delay = ifdef(delay, 0);
		if (this.__focusedOn === null) SGE.error("Camera.moveFocusTo requires something to be in focus first.");
		var target = this.focusOnVector.clone();
		this.focusOn(target);
		var pos = object;
		if (object.position instanceof THREE.Vector3) pos = object.position;
		var camera = this;
		TweenMax.to(target, time, {
			x: pos.x,
			y: pos.y,
			z: pos.z,
			delay: delay,
			ease: Power2.easeInOut,
			onComplete: function() {
				camera.focusOn(object); // when we're done, we focus on the actual object
			}
		});
	}
	
	// Get vector in which the camera focus on
	Object.defineProperty(this, 'focusOnVector', {
		get: function() {
			if (this.__focusedOn === null) return null;
			return this.__focusedOnVector;
		}
	});
	
	// Spherical coordinates around focusOn point
	// If camera is not focused on a point, these cannot be used as it doesn't make sense
	// rho = radius
	Object.defineProperty(this, 'rho', { 
		set: function(value) {
			if (this.__focusedOn === null) SGE.error("Camera.rho only works if focusOn is set.");
			var v = this.focusOnVector.clone().add(
				this.__camera.position.clone().sub(this.focusOnVector).setLength(value)
			);
			this.__camera.position.set(v.x, v.y, v.z);
			this.update();
		},
		get: function() {
			if (this.__focusedOn === null) SGE.error("Camera.rho only works if focusOn is set.");
			var v = new THREE.Vector3();
			v.subVectors(this.__camera.position,this.focusOnVector);
			return v.length();
		}
	});
	// theta = azimuthal angle (around vertical y axis)
	Object.defineProperty(this, 'theta', { 
		set: function(value) {
			if (this.__focusedOn === null) SGE.error("Camera.theta only works if focusOn is set.");
			var r = this.rho;
			var phi = this.phi;
			this.__camera.position.set(
				this.focusOnVector.x + r*Math.sin(phi)*Math.cos(value),
				this.focusOnVector.y + r*Math.cos(phi),
				this.focusOnVector.z + r*Math.sin(phi)*Math.sin(value)
			);
			this.update();
		},
		get: function() {
			if (this.__focusedOn === null) SGE.error("Camera.theta only works if focusOn is set.");
			var v = new THREE.Vector3();
			v.subVectors(this.__camera.position,this.focusOnVector);
			return Math.atan2(v.z, v.x);
		}
	});
	// phi = polar angle (zero at +y)
	Object.defineProperty(this, 'phi', { 
		set: function(value) {
			if (this.__focusedOn === null) SGE.error("Camera.phi only works if focusOn is set.");
			value = Math.max(1e-2,Math.min(Math.PI-1e-2,value));
			var r = this.rho;
			var theta = this.theta;
			this.__camera.position.set(
				this.focusOnVector.x + r*Math.sin(value)*Math.cos(theta),
				this.focusOnVector.y + r*Math.cos(value),
				this.focusOnVector.z + r*Math.sin(value)*Math.sin(theta)
			);
			this.update();
		},
		get: function() {
			if (this.__focusedOn === null) SGE.error("Camera.phi only works if focusOn is set.");
			var v = this.__camera.position.clone().sub(this.focusOnVector);
			return v.angleTo(new THREE.Vector3(0,1,0));
		}
	});
	
	// Look at a point, but don't focus
	this.lookAt = function(v) {
		this.__lookAt = v;
		this.__camera.lookAt(v);
	}
	
	this.update = function() {
		if (!(this.__focusedOn === null)) {
			var v;
			if (this.__focusedOn instanceof THREE.Vector3) {
				v = this.__focusedOn
			} else if (this.__focusedOn.position instanceof THREE.Vector3) {
				v = this.__focusedOn.position;
			} else {
				return;
			}
			this.__focusedOnVector.set(v.x, v.y, v.z);
			this.lookAt(this.__focusedOnVector);
		}
	}
	
	// Save current camera settings so it can be restored later
	this.save = function() {
		this.__savedState = {
			fov: this.fov,
			position: this.__camera.position.clone(),
			focus: this.focusOnVector ? this.focusOnVector.clone() : null
		};
	}
	
	// Restore with proper animation if necessary
	this.restore = function(duration, wait, callback) {
		// debugger;
		if (!this.__savedState) return;
		duration = ifdef(duration, 0);
		wait = ifdef(wait, 0);
		if (duration > 0) {
			TweenMax.to(this, duration, {
				x: this.__savedState.position.x,
				y: this.__savedState.position.y,
				z: this.__savedState.position.z,
				fov: this.__savedState.fov,
				ease: Power2.easeInOut,
				delay: wait,
				onComplete: ( typeof(callback) == "function" ? callback : function(){} )
			});
			if (this.__savedState.focus) {
				this.moveFocusTo(this.__savedState.focus, duration, wait);
			}
		} else {
			this.x = this.__savedState.position.x;
			this.y = this.__savedState.position.y;
			this.z = this.__savedState.position.z;
			this.fov = this.__savedState.fov;
			this.focusOn(this.__savedState.focus);
			if (typeof(callback) == "function") callback();
		}
	}
	
	// Move camera and focus simultaneously
	// ToDo: replace all .tween(new THREE.Vector3()) with .tween([...]) shorthands
	this.tween = function(position, focus, duration, wait, callback) {
		// Accept arrays
		if (position instanceof Array) {
			position = new THREE.Vector3(
				ifdef(position[0], 0),
				ifdef(position[1], 0),
				ifdef(position[2], 0)
			);
		}
		if (focus instanceof Array) {
			focus = new THREE.Vector3(
				ifdef(focus[0], 0),
				ifdef(focus[1], 0),
				ifdef(focus[2], 0)
			);
		}
		duration = ifdef(duration, 0);
		wait = ifdef(wait, 0);
		
		TweenMax.to(this, duration, {
			x: position.x,
			y: position.y,
			z: position.z,
			ease: Power2.easeInOut,
			delay: wait,
			onComplete: ( typeof(callback) == "function" ? callback : function(){} )
		});
		if (focus) {
			this.moveFocusTo(focus, duration, wait);
			if (typeof(callback) == "function") callback();
		}
	}
	
}

// General object to handle internal events
SGE.EventDispatcher = function(target) {
	
	if (isUndefined(target)) SGE.error("Invalid initialization of EventDispatcher.");
	
	// Dictionary of events, with list of all callback functions
	this.__events = {};
	this.__protectedEvents = {};
	this.__target = target;
	
	// Add a new listener
	this.on = function(name, callback) {
		if (isUndefined(name)) SGE.error("Event type is undefined");
		if (isUndefined(callback)) SGE.error("Event callback is undefined");
		// Create array if there's no list yet
		if (!(name in this.__events)) this.__events[name] = [];
		// Add callback
		this.__events[name].push(callback);
		if (this.__target.__eventsChanged) this.__target.__eventsChanged();
	}
	
	// Add a new listener for a protected event
	// Protected events are events native to objects, and they are not removed by a general .off()
	// call. They are always fired first, and they are invisible to the user.
	this.__on = function(name, callback) {
		// Create array if there's no list yet
		if (!(name in this.__protectedEvents)) this.__protectedEvents[name] = [];
		// Make sure only one instance of an event+callback pair is attached
		// (prevents accidental double events, which are never desirable)
		this.off(name, callback);
		// Add callback
		this.__protectedEvents[name].push(callback);
	}
	
	// Remove a listener (or all, if no callback specified)
	this.off = function(name, callback) {
		if (!(name in this.__events)) return;
		
		if (this.__target.__eventsChanged) this.__target.__eventsChanged();
		
		// No specific callback clears all listeners
		if (isUndefined(callback)) {
			delete this.__events[name];
			return;
		}
		
		// Else, we want to remove a specific callback. We find where it is.
		var i = this.__events[name].indexOf(callback);
		// If it exits, we remove it
		if (i > -1) { this.__events[name].splice(i, 1); }
		
		// Delete key if no more listeners
		if (!this.__events[name].length) delete this.__events[name];
	}
	
	// Check if it has any handlers for this event
	this.hasEvent = function(name) {
		return (name in this.__events);
	}
	
	// Trigger an event with some optional data object
	this.trigger = function(name, obj) {
		if (SGE.debug) SGE.log(
			(this.__target.__SUBCLASS || this.__target.__CLASS)+" triggered "+name
		);
		
		obj = ifdef(obj, {});
		
		// Protected listeners fire first
		if (name in this.__protectedEvents) {
			// Automatically fill-in target object (which fired the event)
			obj.target = this.__target;
			
			// Otherwise, call all listeners, passing the object
			for(var c in this.__protectedEvents[name]) {
				if (typeof(this.__protectedEvents[name][c]) != "function") {
					SGE.error("Invalid callback for event "+name+" of "+this.__target.__SUBCLASS+".");
				}
				this.__protectedEvents[name][c](obj);
			}
		}
		
		// If there are no custom listeners, do nothing
		if (!(name in this.__events)) return;
		
		// Automatically fill-in target object (which fired the event)
		obj.target = this.__target;
		
		// Otherwise, call all listeners, passing the object
		// Use a copy of events list, since event triggers may remove events
		// This ensures they are all executed
		var events_copy = this.__events[name];
		for(var c in events_copy) {
			if (typeof(events_copy[c]) != "function") {
				SGE.error("Invalid callback for event "+name+" of "+this.__target.__SUBCLASS+".");
			}
			events_copy[c](obj);
		}
	}
}


// #################################################################################################
// Interfaces
SGE.Interface = {};
// Glowing objects based on texture base color
SGE.Interface.Glow = function(obj, materials) {
	obj.glowMaterials = materials;
	obj.glowDefaultColors = [];
	obj.__glowAmount = 0;
	
	for(var i in materials) {
		obj.glowDefaultColors[i] = materials[i].color.getHex();
	}
	
	obj.setGlow = function(value) {
		for(var i in this.glowMaterials) {
			this.glowMaterials[i].color.setHex(SGE.blendColors(
				this.glowDefaultColors[i],
				SGE.GLOW_COLOR,
				value
			));
			this.glowMaterials[i].needsUpdate = true;
		}
		this.__glowAmount = value;
	}
	
	Object.defineProperty(obj, 'glow', {
		set: function(value) {
			this.setGlow(value);
		},
		get: function() {
			return this.__glowAmount;
		}
	});
	
}
// #################################################################################################
// CUSTOM PRIMITIVES
// These are often-used collections of geometry definitions and materials worth reusing
SGE.Primitives = {};

// -------------------------------------------------------------------------------------------------
// Text label
SGE.Primitives.Label = function(labelText) {
	
	THREE.Object3D.call(this);
	
	this.init = function(labelText) {
		
		labelText = ifdef(labelText, "");
		
		this.__text = labelText;
		this.__canvas = document.createElement('canvas');
		this.color = SGE.LABEL_DEFAULT_COLOR;
		
		this.texture = new THREE.Texture(this.__canvas);
		this.material = new THREE.SpriteMaterial({ color: this.color, map: this.texture });
		this.sprite = new THREE.Sprite(this.material);
		
		this.textureSize = { w: 0, h: 0 };
		
		this.updateLabel();
		
		this.add(this.sprite);
	}
	
	// Scales texture so that it fits the text
	this.updateTextureSize = function() {
		// We start by creating a hidden span element
		var d = $('<span>')
			.css('position', "absolute")
			.css('font-family', SGE.LABEL_FONT_FAMILY)
			.css('text-align', "center")
			.css('display', "block")
			.css('line-height', "100%") // brings lines closer than usual
			.css('visibility', "hidden")
			.css('font-size', SGE.LABEL_TEXT_SIZE)
			.css('font-weight', (SGE.LABEL_FONT_BOLD?"bold":"normal"))
			.html("M") // font-height in pixels via the height of the letter M
			.get(0);
		document.body.appendChild(d);
		
		var w, h, s;
		
		// If SGE.LABEL_TEXT_SIZE hasn't been defined yet
		if (isUndefined(SGE.LABEL_TEXT_SIZE)) {
			// We'll find out what font-size gives us a letter M
			// with a height of SGE.LABEL_TEXTURE_LINE_SIZE (at most)
			h = 0;
			// We start with a font-size half the texture size per line
			// This is just an arbitrary low value. Zero would work too, but we'd get
			// extra failed loop cycles. Half the height seems like a good first guess.
			s = Math.floor(SGE.LABEL_TEXTURE_LINE_SIZE / 2);
			// We gradually increase font size until the height
			// matches the texture line size (its height per line)
			while (h < SGE.LABEL_TEXTURE_LINE_SIZE) {
				d.style.fontSize = s+"px";
				w = d.offsetWidth;
				h = d.offsetHeight;
				s += 1;
			}
			// At this point, we exceeded the size by 1 unit
			// So we record the previous value
			SGE.LABEL_TEXT_SIZE = s - 1;
		}
		
		// Put contents of label (with line breaks) inside the span element
		$(d).html(this.__text.replace("\n","<br/>"));
		// Set proper font size
		d.style.fontSize = (s-1)+"px";
		// Get size of the span element
		// This is our ideal texture size!
		w = d.offsetWidth;
		h = d.offsetHeight;
		
		// Get rid of the span element
		document.body.removeChild(d);
		delete d;
		
		if (w < SGE.LABEL_TEXTURE_LINE_SIZE) w = SGE.LABEL_TEXTURE_LINE_SIZE;
		if (h < SGE.LABEL_TEXTURE_LINE_SIZE) h = SGE.LABEL_TEXTURE_LINE_SIZE;
		
		this.textureSize = { w: w, h: h};
	}
	
	this.updateTexture = function() {
		this.updateTextureSize();
		
		var lines = this.__text.split("\n");
		var numLines = lines.length;
		
		// Ensure the texture dimensions is a power of 2
		// Three.js does it automatically, but might as well do it here
		var cw = Math.pow(2,Math.ceil(Math.log(this.textureSize.w)/Math.log(2)));
		var ch = SGE.LABEL_TEXTURE_LINE_SIZE*numLines;
		
		this.__canvas.width = cw;
		this.__canvas.height = ch;
		
		var c = this.__canvas.getContext("2d");
		
		// Clear texture
		c.clearRect(0,0,cw,ch);
		
		c.fillStyle = "rgba(255,255,255,1)";
		c.font = (SGE.LABEL_FONT_BOLD?"bold ":"")+SGE.LABEL_TEXT_SIZE+"px "+SGE.LABEL_FONT_FAMILY;
		c.textAlign = "center";
		c.textBaseline = "middle";
		for(var i = 0; i < numLines; i++) {
			c.fillText(lines[i], cw / 2, SGE.LABEL_TEXTURE_LINE_SIZE*(i + 0.5));
		}
		
		this.texture.needsUpdate = true;
	}
	
	this.updateLabel = function() {
	
		this.updateTexture();
		
		var numLines = this.__text.split("\n").length;
		this.sprite.scale.x = this.__canvas.width / this.__canvas.height * numLines;
		this.sprite.scale.y = numLines;
	
	}
	
	this.init(labelText);
	
	// ---------------------------------------------------------------------------------------------
	
	// Label.alwaysVisible makes it always visible, even if behind objects
	Object.defineProperty(this, 'alwaysVisible', {
		set: function(value) {
			this.material.depthWrite = !value;
			this.material.depthTest = !value;
			this.material.needsUpdate = true;
		},
		get: function() {
			return this.material.depthTest;
		}
	});
	
	// Color of the label
	Object.defineProperty(this, 'color', {
		set: function(value) {
			this.material.color.setHex(value);
			this.material.needsUpdate = true;
		},
		get: function() {
			return this.material.color.getHex();
		}
	});
	
	// Opacity of the label
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.material.opacity = value;
			this.material.needsUpdate = true;
			this.visible = (value > 0);
		},
		get: function() {
			return this.material.opacity;
		}
	});
	
	// Plain text of the label. Not HTML!
	// Use \n for line breaks
	// Label is scaled according to the number of lines
	Object.defineProperty(this, 'text', {
		set: function(value) {
			this.__text = value;
			this.updateLabel();
		},
		get: function() {
			return this.__text;
		}
	});
	
	// Size of one line of the label. A label with two lines has height 2 x (size specified here)
	Object.defineProperty(this, 'size', {
		set: function(value) {
			this.scale.set(value, value, value);
		},
		get: function() {
			return this.scale.x;
		}
	});
	
}
SGE.Primitives.Label.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Label.prototype.constructor = SGE.Primitives.Label;


// -------------------------------------------------------------------------------------------------
// Sprite object (AKA billboard)
SGE.Primitives.Sprite = function(file) {
	
	THREE.Object3D.call(this);
	
	this.width = null;
	this.height = null;
	this.init = function(file) {
		// Load directly instead of using get(), since we need the callback
		var self = this; // callback scope correction
		this.texture = SGE.TextureLoader.load(SGE.asset(file), function(e){ self.onLoad(e); });
		this.material = new THREE.SpriteMaterial({ map: this.texture });
		this.sprite = new THREE.Sprite(this.material);
		
		this.add(this.sprite);
	}
	
	this.onLoad = function(texture) {
		this.width = texture.image.width;
		this.height = texture.image.height;
		this.scaleFactor = 1/Math.max(this.width, this.height);
		this.sprite.scale.set(
			this.width * this.scaleFactor * this.__size,
			this.height * this.scaleFactor * this.__size
		);
	}
	
	// Size of sprite, a shorthand for proportional scaling
	this.__size = 1;
	Object.defineProperty(this, 'size', {
		set: function(value) {
			this.__size = value;
			this.sprite.scale.set(
				this.width * this.scaleFactor * value,
				this.height * this.scaleFactor * value
			);
		},
		get: function() {
			return this.sprite.scale.x / (this.width * this.scaleFactor);
		}
	});
	
	// Shorthand for material opacity
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.material.opacity = value;
			this.visible = (value > 0);
		},
		get: function() {
			return this.material.opacity;
		}
	});
	
	// Makes it always visible, even if behind objects
	Object.defineProperty(this, 'alwaysVisible', {
		set: function(value) {
			this.material.depthWrite = !value;
			this.material.depthTest = !value;
			this.material.needsUpdate = true;
		},
		get: function() {
			return this.material.depthTest;
		}
	});
	
	this.init(file);
	
}
SGE.Primitives.Sprite.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Sprite.prototype.constructor = SGE.Primitives.Sprite;


// -------------------------------------------------------------------------------------------------
// Dynamic sprite
// Group with multiple sprites that can be exchanged easily for one another
// Handles animations automatically and everything
// The argument refs is an object in which the keys are name for the states, and the value of
// each key is the sprite texture path. Example
// { 'state1': "texture1.png", 'state2': "texture2.png" }
// Second argument is the default state. If not specified, the empty state is assumed (null)
// Change between states using the property 'state'
SGE.Primitives.DynamicSprite = function(refs, state) {
	
	THREE.Object3D.call(this);
	
	this.__references = {}; // reference to sprites and other info
	this.__size = 1; // size of the dynamic sprite
	this.__opacity = 1; // opacity of the dynamic sprite
	this.__state = null; // current state
	this.__sprites = null; // list of spriters for Tweenmax
	this.__animating = false; // if it's fading out - prevents weird effects
	
	this.init = function(refs, state) {
		var sp, st;
		// Initialize sprites
		this.__sprites = [];
		for (var k in refs) {
			if (!st) st = k;
			sp = new SGE.Primitives.Sprite(refs[k]);
			this.__references[k] = {
				sprite: sp,
				path: refs[k]
			};
			sp.opacity = 0;
			this.__sprites.push(sp);
			this.add(sp);
		}
		st = null; // Assume null state
		// If a default is specified, use that instead
		if (!isUndefined(state)) st = state;
		this.__state = st;
		// Toggle visibility for selected state, if any
		if (st in this.__references) {
			this.__references[st].sprite.opacity = 1;
		}
	}
	
	// Reveal new state
	this.__switchState = function() {
		this.__animating = false;
		if (!(this.__state in this.__references)) return; // skip if not a state
		// fade in the proper one
		TweenMax.to(this.__references[this.__state].sprite, 0.5, {
			opacity: this.__opacity,
			ease: Power4.easeOut
		});
		TweenMax.to(this.__references[this.__state].sprite, 0.5, {
			size: this.__size,
			ease: Back.easeOut
		});
	}
	
	// State of dynamic sprite
	Object.defineProperty(this, 'state', {
		set: function(value) {
			var self = this;
			this.__state = value
			if (this.__animating) return; // if already fading out, don't try fading again
			this.__animating = true;
			TweenMax.to(this.__sprites, 0.25, { // fade out all sprites
				opacity: 0,
				size: 0.5*this.__size,
				ease: Power4.easeIn,
				onComplete: function() {
					self.__switchState();
				}
			});
		},
		get: function() {
			return this.__state;
		}
	});
	
	
	// Size of sprite, a shorthand for proportional scaling
	Object.defineProperty(this, 'size', {
		set: function(value) {
			this.__size = value;
			for(var i in this.__sprites) {
				this.__sprites[i].size = value;
			}
		},
		get: function() {
			return this.__size;
		}
	});
	
	
	// Shorthand for material opacity
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.__opacity = value;
			this.__references[this.__state].sprite.opacity = value;
		},
		get: function() {
			return this.__opacity;
		}
	});
	
	// Makes it always visible, even if behind objects
	this.__alwaysVisible = false;
	Object.defineProperty(this, 'alwaysVisible', {
		set: function(value) {
			this.__alwaysVisible = value;
			for(var i in this.__sprites) {
				this.__sprites[i].alwaysVisible = value;
			}
		},
		get: function() {
			return this.__alwaysVisible;
		}
	});
	
	this.init(refs, state);
	
}
SGE.Primitives.DynamicSprite.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.DynamicSprite.prototype.constructor = SGE.Primitives.DynamicSprite;


// -------------------------------------------------------------------------------------------------
// Instruction set for "hidden variables" experiment
// 3 sprites
SGE.Primitives.InstructionSet = function() {
	
	THREE.Object3D.call(this);
	
	this.__size = 1; // size of 
	this.__opacity = 1; // opacity of the dynamic sprite
	this.__state = null; // current state
	this.__sprites = null; // list of sprites for TweenMax
	this.__directionOpacities = [1,1,1];
	this.position.y = SGE.INSTRUCTIONS_Y_OFFSET;
	
	this.init = function() {
		this.__sprites = [
			[
				new SGE.Primitives.Sprite("sprite_minus_blue.png"),
				new SGE.Primitives.Sprite("sprite_plus_red.png"),
			],
			[
				new SGE.Primitives.Sprite("sprite_minus_blue.png"),
				new SGE.Primitives.Sprite("sprite_plus_red.png"),
			],
			[
				new SGE.Primitives.Sprite("sprite_minus_blue.png"),
				new SGE.Primitives.Sprite("sprite_plus_red.png"),
			]
		];
		
		for(var i = 0; i < 3; i++) {
			for(var j = 0; j < 2; j++) {
				this.add(this.__sprites[i][j]);
			}
		}
		
		// this.visible = false;
		this.size = SGE.INSTRUCTIONS_SIZE;
		this.__update();
		
	}
	
	// Update visibilities & spacing
	this.__update = function() {
		var i;
		if (this.__state === null) {
			for(i = 0; i < 3; i++) {
				this.__sprites[i][0].visible = false;
				this.__sprites[i][1].visible = false;
			}
			return;
		}
		for(i = 0; i < 3; i++) {
			this.__sprites[i][0].visible = (this.__state[i] == SGE.MINUS);
			this.__sprites[i][1].visible = (this.__state[i] == SGE.PLUS);
		}
		
	}
	
	// Set instruction state
	Object.defineProperty(this, 'state', {
		set: function(value) {
			if (!(value instanceof Array) || value.length != 3) value = null;
			this.__state = value;
			this.__update();
		},
		get: function() {
			return this.__state;
		}
	});
	
	// Size of sprite, a shorthand for proportional scaling
	Object.defineProperty(this, 'size', {
		set: function(value) {
			this.__size = value;
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 2; j++) {
					this.__sprites[i][j].size = value;
					this.__sprites[i][j].position.x = (i-1)*value;
				}
			}
		},
		get: function() {
			return this.__size;
		}
	});
	
	// For when the atom is entering/leaving an object
	this.__contractionFactor = 1;
	Object.defineProperty(this, '__contract', {
		set: function(value) {
			this.__contractionFactor = value;
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 2; j++) {
					this.__sprites[i][j].position.x = (i-1)*this.__size* Math.pow(value,4);
					this.position.y = SGE.INSTRUCTIONS_Y_OFFSET*Math.pow(value, 3);
					this.__sprites[i][j].opacity = Math.pow(value, 4) * this.__directionOpacities[i];
					this.__sprites[i][j].visible = (this.__state[i] == (j?SGE.PLUS:SGE.MINUS));
				}
			}
		},
		get: function() {
			return this.__contractionFactor;
		}
	});
	
	// Shorthand for opacity
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.__opacity = value;
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 2; j++) {
					this.__sprites[i][j].opacity = value*this.__directionOpacities[i];
					this.__sprites[i][j].visible = (this.__state[i] == (j?SGE.PLUS:SGE.MINUS));
				}
			}
			this.visible = (value > 0);
		},
		get: function() {
			return this.__opacity;
		}
	});
	
	// Set instruction state
	Object.defineProperty(this, 'opacityA', {
		set: function(value) {
			this.__directionOpacities[0] = value;
			this.opacity = this.opacity; // force update
		},
		get: function() { return this.__directionOpacities[0]; }
	});
	Object.defineProperty(this, 'opacityB', {
		set: function(value) {
			this.__directionOpacities[1] = value;
			this.opacity = this.opacity; // force update
		},
		get: function() { return this.__directionOpacities[1]; }
	});
	Object.defineProperty(this, 'opacityC', {
		set: function(value) {
			this.__directionOpacities[2] = value;
			this.opacity = this.opacity; // force update
		},
		get: function() { return this.__directionOpacities[2]; }
	});
	
	this.init();
	
}
SGE.Primitives.InstructionSet.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.InstructionSet.prototype.constructor = SGE.Primitives.InstructionSet;


// -------------------------------------------------------------------------------------------------
// Box
// A simple box shape, but with special features for the texture mapping
// i.e.: one texture per box, easy way to set up the UV mapping for the faces
// It's also trivial to update the texture on a face to something else
SGE.Primitives.Box = function(width, height, depth, texture) {
	
	width = ifdef(width, 1);
	height = ifdef(height, 1);
	depth = ifdef(depth, 1);
	
	THREE.Object3D.call(this);
	
	this.plainMaterial = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
	this.textureMaterial = this.plainMaterial; // defaults to plain
	
	this.texture = null;
	if (!isUndefined(texture)) {
		this.texture = texture;
		this.textureMaterial = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, map: texture });
	}
	
	var m_list = [
		this.plainMaterial, this.plainMaterial, this.plainMaterial,
		this.plainMaterial, this.plainMaterial, this.plainMaterial
	];
	this.faceMaterials = new THREE.MeshFaceMaterial(m_list);
	
	this.geometry = new THREE.BoxGeometry(width, height, depth);
	
	var o = new THREE.Mesh(
		this.geometry,
		this.faceMaterials
	);
	this.add(o);
	
	// ----------------------
	// Material/texture handling using a texture atlas
	// We separate the texture into rectangular/square regions and index by region position
	// Some texel bleeding may occur between regions due to mipmapping blurring adjacent pixels
	// In this application this isn't really an issue because the textures are pretty simple
	
	// Number of horizontal and vertical regions of equal size in the texture
	// This partitions the UV mapping into discrete units to define rectangular regions to use
	// If this is [1,1], then we define regions by UV coordinates directly
	// If this is [image_width, image_height], then we're defining regions by pixel coordinates
	// This is useful because handling UV coordinates directly can be cumbersome
	this.numRegions = [1, 1];
	
	// UV atlas dictionary
	this.atlas = {};
	
	// Adds a map (a rectangular region) to the texture atlas
	// x, y, width and height, in region units
	this.addMap = function(name, x, y, w, h, flipx, flipy) {
		
		var flipx = !!flipx;
		var flipy = !!flipy;
		
		// U and V units
		var u = 1 / this.numRegions[0];
		var v = 1 / this.numRegions[1];
		var m = {
			x1: x*u,
			y1: 1-y*v,
			x2: (x+w)*u,
			y2: 1-(y+h)*v,
		};
		
		if (flipx) { var t = m.x1; m.x1 = m.x2; m.x2 = t; }
		if (flipy) { var t = m.y1; m.y1 = m.y2; m.y2 = t; }
		
		this.atlas[name] = m;
	}
	
	this.setMap = function(face, name) {
		// If no map is specified set face to plain material
		if (isUndefined(name)) {
			this.faceMaterials.materials[face] = this.plainMaterial;
			return;
		}
		
		// Else, check if the map exists
		if (!(name in this.atlas)) {
			SGE.log("Map \""+name+"\" not found it atlas. Using default.");
			this.faceMaterials.materials[face] = this.plainMaterial;
			return;
		}
		
		// If it exists, use it
		
		// Assign new material to current face
		this.faceMaterials.materials[face] = this.textureMaterial;
		
		// Shorthand
		var m = this.atlas[name];
		
		// Update the UV mapping of the two triangles for the box's face
		this.geometry.faceVertexUvs[0][2*face][0].set(m.x1, m.y1);
		this.geometry.faceVertexUvs[0][2*face][1].set(m.x1, m.y2);
		this.geometry.faceVertexUvs[0][2*face][2].set(m.x2, m.y1);
		
		this.geometry.faceVertexUvs[0][2*face+1][0].set(m.x1, m.y2);
		this.geometry.faceVertexUvs[0][2*face+1][1].set(m.x2, m.y2);
		this.geometry.faceVertexUvs[0][2*face+1][2].set(m.x2, m.y1);
		
		// We make sure Three.js knows we changed the UVs
		this.geometry.uvsNeedUpdate = true;
	
	}
	
	// Assign material to faces
	this.right = function(name) { this.setMap(0, name); }
	this.left = function(name) { this.setMap(1, name); }
	this.top = function(name) { this.setMap(2, name); }
	this.bottom = function(name) { this.setMap(3, name); }
	this.front = function(name) { this.setMap(4, name); }
	this.back = function(name) { this.setMap(5, name); }
	
	// Make it glow-able
	SGE.Interface.Glow(this, [this.plainMaterial, this.textureMaterial]);
}
SGE.Primitives.Box.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Box.prototype.constructor = SGE.Primitives.Box;

// -------------------------------------------------------------------------------------------------
// Analyzer plug
// It's a thick tube, with a black circle acting as hole for inside the analyzer
SGE.Primitives.Plug = function(innerRadius, outerRadius, height) {
	
	THREE.Object3D.call(this);
	
	var materials = [];
	
	var g, m, co, o;
	g = new THREE.CylinderGeometry(outerRadius, outerRadius, height, SGE.MESH_ROUND_SEGMENTS, 1, true);
	m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
	o = new THREE.Mesh(g, m);
	this.add(o);
	materials.push(m);
	
	g = new THREE.CylinderGeometry(innerRadius, innerRadius, height, SGE.MESH_ROUND_SEGMENTS, 1, true);
	m = SGE.DefaultMaterial({
			// Interior of plug is darker, looks better (emulates ambient occlusion)
			color: SGE.blendColors(SGE.BASE_COLOR, 0x000000, 0.5),
			side: THREE.BackSide
		});
	o = new THREE.Mesh(g, m);
	this.add(o);
	materials.push(m);
	
	// Hole
	g = new THREE.CircleGeometry(innerRadius, SGE.MESH_ROUND_SEGMENTS);
	m = new THREE.MeshBasicMaterial({ color: 0x000000 });
	o = new THREE.Mesh(g, m);
	o.position.y = -height/2+SGE.EPSILON;
	o.rotation.x = -SGE.TAU/4;
	this.add(o);
	
	g = new THREE.RingGeometry(innerRadius, outerRadius, SGE.MESH_ROUND_SEGMENTS, 1);
	m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
	o = new THREE.Mesh(g, m);
	o.rotation.x = -SGE.TAU/4;
	o.position.y = height/2;
	this.add(o);
	materials.push(m);
	
	// Make it glow-able
	SGE.Interface.Glow(this, materials);
	
	this.materials = materials;

}
SGE.Primitives.Plug.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Plug.prototype.constructor = SGE.Primitives.Plug;

// -------------------------------------------------------------------------------------------------
// Cone
// The conical bell-end of sources and detectors
SGE.Primitives.Cone = function(radius1, radius2, height, thickness) {
	
	THREE.Object3D.call(this);
	
	var materials = [];
	
	var g, m, co, o;
	g = new THREE.CylinderGeometry(radius2, radius1, height, SGE.MESH_ROUND_SEGMENTS, 1, true);
	m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
	o = new THREE.Mesh(g, m);
	this.add(o);
	materials.push(m);
	
	g = new THREE.CylinderGeometry(radius2-thickness, radius1-thickness, height, SGE.MESH_ROUND_SEGMENTS, 1, true);
	m = SGE.DefaultMaterial({
			// Interior of plug is darker
			color: SGE.blendColors(SGE.BASE_COLOR, 0x000000, 0.5),
			side: THREE.BackSide
		});
	o = new THREE.Mesh(g, m);
	this.add(o);
	materials.push(m);
	
	// Hole
	g = new THREE.CircleGeometry(radius1-thickness, SGE.MESH_ROUND_SEGMENTS);
	m = new THREE.MeshBasicMaterial({ color: 0x000000 });
	o = new THREE.Mesh(g, m);
	o.position.y = -height/2+SGE.EPSILON;
	o.rotation.x = -SGE.TAU/4;
	this.add(o);
	
	g = new THREE.RingGeometry(radius2-thickness, radius2, SGE.MESH_ROUND_SEGMENTS, 1);
	m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
	o = new THREE.Mesh(g, m);
	o.rotation.x = -SGE.TAU/4;
	o.position.y = height/2;
	this.add(o);
	materials.push(m);
	
	// Make it glow-able
	SGE.Interface.Glow(this, materials);
}
SGE.Primitives.Cone.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Cone.prototype.constructor = SGE.Primitives.Cone;

// -------------------------------------------------------------------------------------------------
// Stern-Gerlach magnets
// The special-shaped magnets as well as the field lines between them
SGE.Primitives.Magnets = function() {
	
	THREE.Object3D.call(this);
	var co, o, g, m, s;
	
	var NORTH_MAGNET_WIDTH = 1/2;
	var NORTH_MAGNET_HEIGHT = 1/3;
	var SOUTH_MAGNET_RADIUS = 1/3;
	var SOUTH_MAGNET_SX = 0.75;
	var SOUTH_MAGNET_SZ = 0.825;
	
	// North is a block at the bottom
	g = new THREE.BoxGeometry(1, NORTH_MAGNET_HEIGHT, NORTH_MAGNET_WIDTH);
	m = new THREE.MeshLambertMaterial({ color: SGE.NORTH_COLOR });
	o = new THREE.Mesh(g, m);
	o.position.y = -SGE.MAGNET_SPACING/2;
	co = new THREE.Group();
	co.add(o);
	this.add(co);
	this.northMagnet = co;
	
	// South is a triangular prism on top
	// This is created as a 3-sided cylinder approximation, and squashed slightly
	// Easier than defining the prism by hand
	g = new THREE.CylinderGeometry(SOUTH_MAGNET_RADIUS, SOUTH_MAGNET_RADIUS, 1, 3, 1);
	m = new THREE.MeshLambertMaterial({ color: SGE.SOUTH_COLOR });
	o = new THREE.Mesh(g, m);
	o.position.y = SGE.MAGNET_SPACING/2;
	o.scale.z = SOUTH_MAGNET_SX;
	o.scale.x = SOUTH_MAGNET_SZ;
	o.rotation.z = SGE.TAU/4;
	o.rotation.x = SGE.TAU/4;
	co = new THREE.Group();
	co.add(o);
	this.add(co);
	this.southMagnet = co;
	
	// Field lines
	var t1 = SGE.MAGNET_SPACING/2 - SOUTH_MAGNET_SX*SOUTH_MAGNET_RADIUS; // y of tip of top magnet
	var t2 = -SGE.MAGNET_SPACING/2 + NORTH_MAGNET_HEIGHT/2; // y of top of bottom magnet
	co = new THREE.Group(); // group of magnetic field lines
	m = new THREE.LineBasicMaterial({ color: SGE.MAGNETIC_FIELD_COLOR, side: THREE.DoubleSide });
	m.transparent = true;
	
	var jt = 8; // number of segments in magnetic field lines
	// We'll have 3 copies of the magnetic field lines
	for (var i = 0; i <= 0; i++) {
		// Each copy has 5 field lines
		// The lines are a quarter of an ellipse
		for(var n = -2; n <= 2; n++) {
			g = new THREE.Geometry();
			for(var j = 0; j <= jt; j++) {
				g.vertices.push(new THREE.Vector3(
					// The three multipliers at the beginning of the next lines adjust the
					// appearance slightly:
					// - Move the three field line copies away from the front and back edges
					// - Make field line enter the top magnet, instead of just touching the tip
					// - Move the lines away from the side edges a bit
					0.40 * i,
					1.05 * (t1-t2) * Math.sin(j/jt*SGE.TAU/4) + t2,
					0.90 * NORTH_MAGNET_WIDTH/2 * n/2 * Math.cos(j/jt*SGE.TAU/4)
				));
			}
			
			// Add field line
			o = new THREE.Line(g, m);
			co.add(o);
			
			// Add corresponding arrow for direction
			s = new THREE.Shape();
			s.moveTo(0,0);
			s.lineTo(1,-1);
			s.lineTo(-1,-1);
			s.lineTo(0,0);
			o = new THREE.Mesh(new THREE.ShapeGeometry(s), m);
			o.scale.x = 0.035; 
			o.scale.y = 0.07;
			o.rotation.y = SGE.TAU/4;
			o.position.y = 1.05 * (t1-t2) / 2 + t2; // place arrows halfway vertically
			o.position.z = 0.90 * NORTH_MAGNET_WIDTH/2 * n/2 * Math.sqrt(3)/2;
			co.add(o);
		}
	}
	// Disabled by default
	m.opacity = 0;
	co.visible = false;
	this.add(co);
	this.field = co;
	this.fieldMaterial = m;
	
	// Rotate only the magnets in this case
	Object.defineProperty(this, 'fieldOpacity', {
		set: function(value) {
			this.fieldMaterial.opacity = value;
			this.field.visible = (value > 0);
		},
		get: function() {
			return this.fieldMaterial.opacity;
		}//,
		// configurable: true
	});
	
}
SGE.Primitives.Magnets.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Magnets.prototype.constructor = SGE.Primitives.Magnets;


// -------------------------------------------------------------------------------------------------
// Arrow3D
// A cylinder with a conical tip
SGE.Primitives.Arrow3D = function(length, bodyRadius, headRadius, headLength, color) {
	
	THREE.Object3D.call(this);
	var co, o, g, m;
	
	m = new THREE.MeshLambertMaterial({ color: color, transparent: true });
	
	// Cylinder
	g = new THREE.CylinderGeometry(bodyRadius, bodyRadius, length, SGE.AXES_ROUND_SEGMENTS, 1);
	o = new THREE.Mesh(g, m);
	o.position.y = length/2;
	this.add(o);
	
	// Cone
	g = new THREE.CylinderGeometry(0, headRadius, headLength, SGE.AXES_ROUND_SEGMENTS*2, 1);
	o = new THREE.Mesh(g, m);
	o.position.y = length + headLength/2;
	this.add(o);
	
	this.arrowMaterial = m;
}
SGE.Primitives.Arrow3D.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Arrow3D.prototype.constructor = SGE.Primitives.Arrow3D;


// -------------------------------------------------------------------------------------------------
// Axes
// Thick axes we can place anywhere for narrative purposes, basically three arrows with labels XYZ
// This follows the BOOK convention, NOT the engine convention. 
//
// Engine convention:
//
//       Y       This convention is easier to think of because it follows the typical
//     |         screen coordinates
//     |____ X   
//    /          
//   / Z         
// 
// Book convention:
//
//       Z       This convention is the one used in Styer's book, and it was picked
//     |         so that Z is vertical (where we measure spin) and the system is still
//     |____ Y   right-handed
//    /          
//   / X         
// 
SGE.Primitives.Axes = function() {
	
	THREE.Object3D.call(this);
	
	// Create labels
	this.labels = {
		x: new SGE.Primitives.Label("X"),
		y: new SGE.Primitives.Label("Y"),
		z: new SGE.Primitives.Label("Z")
	}
	
	// X
	this.xAxis = new SGE.Primitives.Arrow3D(
		SGE.AXES_LENGTH,
		SGE.AXES_THICKNESS/2,
		SGE.HEAD_THICKNESS/2,
		SGE.AXES_HEAD_LENGTH,
		SGE.AXES_COLOR_X
	);
	this.xAxis.rotation.x = SGE.TAU/4;
	this.add(this.xAxis);
	this.labels.x.color = SGE.AXES_COLOR_X;
	this.labels.x.size = SGE.AXES_LABEL_SIZE;
	this.labels.x.position.z = SGE.AXES_LENGTH + SGE.AXES_LABEL_OFFSET;
	
	// Y
	this.yAxis = new SGE.Primitives.Arrow3D(
		SGE.AXES_LENGTH,
		SGE.AXES_THICKNESS/2,
		SGE.HEAD_THICKNESS/2,
		SGE.AXES_HEAD_LENGTH,
		SGE.AXES_COLOR_Y
	);
	this.yAxis.rotation.z = -SGE.TAU/4;
	this.add(this.yAxis);
	this.labels.y.color = SGE.AXES_COLOR_Y;
	this.labels.y.size = SGE.AXES_LABEL_SIZE;
	this.labels.y.position.x = SGE.AXES_LENGTH + SGE.AXES_LABEL_OFFSET;
	
	// Z
	this.zAxis = new SGE.Primitives.Arrow3D(
		SGE.AXES_LENGTH,
		SGE.AXES_THICKNESS/2,
		SGE.HEAD_THICKNESS/2,
		SGE.AXES_HEAD_LENGTH,
		SGE.AXES_COLOR_Z
	);
	this.add(this.zAxis);
	this.labels.z.color = SGE.AXES_COLOR_Z;
	this.labels.z.size = SGE.AXES_LABEL_SIZE;
	this.labels.z.position.y = SGE.AXES_LENGTH + SGE.AXES_LABEL_OFFSET;
	
	// Add labels
	this.add(this.labels.x);
	this.add(this.labels.y);
	this.add(this.labels.z);
	
	
	// Properties
	Object.defineProperty(this, 'xOpacity', {
		set: function(value) {
			this.labels.x.visible = (value > 0);
			this.xAxis.visible = (value > 0);
			this.labels.x.opacity = value;
			this.xAxis.arrowMaterial.opacity = value;
		},
		get: function() {
			return this.labels.x.opacity;
		}
	});
	Object.defineProperty(this, 'yOpacity', {
		set: function(value) {
			this.labels.y.visible = (value > 0);
			this.yAxis.visible = (value > 0);
			this.labels.y.opacity = value;
			this.yAxis.arrowMaterial.opacity = value;
		},
		get: function() {
			return this.labels.y.opacity;
		}
	});
	Object.defineProperty(this, 'zOpacity', {
		set: function(value) {
			this.labels.z.visible = (value > 0);
			this.zAxis.visible = (value > 0);
			this.labels.z.opacity = value;
			this.zAxis.arrowMaterial.opacity = value;
		},
		get: function() {
			return this.labels.z.opacity;
		}
	});
	
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.xOpacity = value;
			this.yOpacity = value;
			this.zOpacity = value;
		},
		get: function() {
			// Get the average
			return (this.xOpacity + this.yOpacity + this.zOpacity)/3;
		}
	});
	
}
SGE.Primitives.Axes.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Axes.prototype.constructor = SGE.Primitives.Axes;


// -------------------------------------------------------------------------------------------------
// Path
// Linear spline used to denote atom paths through the experiment
// The 'points' argument is an array with the coordinates:
// [ [0,0,0] , [ 1, 0, 1] , ... ]
// If any of the coordinates if a THREE.Vector3 object, it will work too
// Important: this assumes the x coordinate of vertices is monotonic (always decreasing/increasing)
// That is, a path can't stop or move backwards
SGE.Primitives.Path = function(points, style, params) {
	
	THREE.Object3D.call(this);
	
	this.__style = style;
	this.__params = params;
	this.material = null;
	this.geometry = null;
	this.path = null;
	this.__alwaysVisible = false;
	
	if (isUndefined(this.__params['offset'])) this.__params['offset'] = 0;
	
	// Initialize path
	this.init = function(points) {
		var p;
		this.path = [];
		this.numVertices = points.length;
		for( var i = 0; i < this.numVertices; i++) {
			// Use Vector3 as-is
			if (points[i] instanceof THREE.Vector3) {
				p = points[i].clone();
			} else { // or convert array to Vector3
				p = new THREE.Vector3(
					points[i][0],
					points[i][1],
					points[i][2]
				);
			}
			// Add this to path definition
			this.path.push(p);
		}
		
		
		// Compute total distance of path
		// Since atoms always move in the x direction at constant speed, we do not
		// use the actual arclength but the total x distance traveled
		this.distance = Math.abs(this.path[this.numVertices-1].x - this.path[0].x);
		
		// Create geometry & material
		this.setGeometry();
		this.setMaterial();
		
		this.line = new THREE.Line(this.geometry, this.material);
		this.line.frustumCulled = false;
		this.add( this.line );
		
		this.alwaysVisible = true;
		
		this.update();
	}
	
	this.setGeometry = function() {
		// Dispose any existing geometry
		if (this.geometry) this.geometry.dispose();
		this.geometry = new THREE.Geometry();
		for( var i = 0; i < this.numVertices; i++ ) {
			this.geometry.vertices.push(this.path[i].clone());
		}
	}
	
	this.setMaterial = function() {
		// Dispose any existing material
		if (this.material) this.material.dispose();
		// Create material
		if (this.__style == SGE.LINE_DASHED) {
			this.material = new THREE.LineDashedMaterial({
				color:			ifdef(this.__params.color, 0xFFFFFF),
				dashSize:		ifdef(this.__params.dashSize, 1),
				gapSize:		ifdef(this.__params.gapSize, 1),
				scale:			ifdef(this.__params.scale, 1),
				transparent:	true
			});
		} else { // Default to solid line
			this.material = new THREE.LineBasicMaterial({
				color:			ifdef(this.__params.color, 0xFFFFFF),
				linecap:		ifdef(this.__params.linecap, "round"),
				linejoin:		ifdef(this.__params.linejoin, "round"),
				transparent:	true
			});
		}
	}
	
	// Truncate path to a determined distance
	// This is given by the x distance along the path
	this.truncate = function(dist) {
		dist -= this.offset;
		
		if (dist < 0) dist = 0;
		if (dist > this.distance) dist = this.distance;
		
		// console.log(dist);
		
		// we'll use dist as the total distance left to cover
		
		// console.log( dist );
		
		// Update vertices
		// Reset position of the first one
		var i = 0; // current vertex
		var d, t, l;
		
		// Collapse all points
		for(var i = 0; i < this.numVertices; i++) {
			this.geometry.vertices[i].copy(this.path[0]);
		}
		
		for(var i = 0; i < this.numVertices - 1; i++) {
			// Find displacement along the x direction to the next vertex
			dx = Math.abs(this.path[i+1].x - this.path[i].x);
			if (dx < dist) { // if this step is strictly too small, cover it all
				this.geometry.vertices[i+1].copy(this.path[i+1]);
				dist -= dx;
			} else {
				t = 1;
				if (dx != 0) t = dist / dx;
				this.geometry.vertices[i+1].lerpVectors(
					this.path[i],
					this.path[i+1],
					t
				);
				l = i+1;
				break;
			}
		}
		
		for (var i = l+1; i < this.numVertices; i++) {
			this.geometry.vertices[i].copy( this.geometry.vertices[l] );
		}
		
		this.update();
		// console.log(l);
	}
	
	this.update = function() {
		this.geometry.computeLineDistances();
		this.line.geometry.verticesNeedUpdate = true;
		// this.line.geometry.colorsNeedUpdate = true;
		this.line.geometry.lineDistancesNeedUpdate = true;
	}
	
	// alwaysVisible makes it always visible, even if behind/inside objects
	Object.defineProperty(this, 'alwaysVisible', {
		set: function(value) {
			this.__alwaysVisible = value;
			this.material.depthWrite = !value;
			this.material.depthTest = !value;
			this.material.needsUpdate = true;
		},
		get: function() {
			return this.material.depthTest;
		}
	});
	
	// Color of the label
	Object.defineProperty(this, 'color', {
		set: function(value) {
			this.material.color.setHex(value);
			this.material.needsUpdate = true;
		},
		get: function() {
			return this.material.color.getHex();
		}
	});
	
	// Opacity of the line
	this.__opacity = 1;
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.material.transparent = true;
			this.material.opacity = value;
			this.material.needsUpdate = true;
			if (this.__hidden) {
				this.visible = false;
			} else {
				this.visible = (value > 0);
			}
			this.__opacity = value;
		},
		get: function() {
			return this.__opacity;
		}
	});
	
	this.__hidden = false;
	Object.defineProperty(this, 'hidden', {
		set: function(value) {
			this.__hidden = value;
			this.visible = !this.__hidden;
		},
		get: function() {
			return this.__hidden;
		}
	});
	
	Object.defineProperty(this, 'style', {
		set: function(value) {
			if (this.__style == value) return;
			this.__style = value;
			this.setMaterial();
			this.line.material = this.material;
			this.line.materialNeedsUpdate = true;
			this.update();
			this.alwaysVisible = this.__alwaysVisible;
		},
		get: function() {
			return this.__style;
		}
	});
	
	// Offset
	Object.defineProperty(this, 'offset', {
		get: function() {
			return this.__params['offset'];
		}
	});
	
	// Initialize
	this.init(points);
}
SGE.Primitives.Path.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Path.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.Path.prototype.constructor = SGE.Primitives.Path;


// Group of paths, all are truncated as a single entity
SGE.Primitives.PathGroup = function() {
	
	THREE.Object3D.call(this);
	
	this.__paths = [];
	this.__pathNames = {};
	
	// Truncate paths to a determined distance
	// This is given by the x distance along the path
	this.truncate = function(dist) {
		for (var i = 0; i < this.__paths.length; i++) {
			this.__paths[i].truncate(dist);
		}
	}
	
	this.addPath = function(path, name) {
		this.__paths.push(path);
		this.__pathNames[name] = path;
		this.add(path);
	}
	
	this.getPath = function(name) {
		return this.__pathNames[name];
	}
	
	// Get total path distance
	Object.defineProperty(this, 'distance', {
		get: function() {
			var md = 0, d;
			for (var i = 0; i < this.__paths.length; i++) {
				d = this.__paths[i].offset + this.__paths[i].distance;
				if (d > md) md = d;
			}
			return md;
		}
	});
	
	// Opacity of the line
	this.__opacity = 1;
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.__opacity = value;
			for (var i = 0; i < this.__paths.length; i++) {
				this.__paths[i].opacity = value;
			}
		},
		get: function() {
			return this.__opacity;
		}
	});
	
}
SGE.Primitives.PathGroup.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.PathGroup.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.PathGroup.prototype.constructor = SGE.Primitives.PathGroup;


// -------------------------------------------------------------------------------------------------
// Bell Analyzer Drum
// A drum for the pivoting Stern-Gerlach analyzer
// Features two lights on top
//                                
//          __   __                 
//         (+ ) (- )                
//       ___||___||___ ___                         
//     //           //     \               
//   _||           ||   |   |            
//  |_||-----------||   +   |            
//    ||           ||  / \  |            
//     \\___________\\ ___ /                         
//                                 
//
SGE.Primitives.BellAnalyzerDrum = function() {
	
	THREE.Object3D.call(this);
	
	this.container = null;
	this.top = null;
	this.bottom = null;
	this.front = null;
	this.back = null;
	this.directions = null;
	this.__bulbMaterials = {};
	this.__bulbSignMaterials = {};
	this.__flareSprites = {};
	this.__bulbBrightness = 0;
	this.timeFactor = 1;
	this.events = new SGE.EventDispatcher(this);
	
	this.init = function() {
		
		// General geometry container
		this.container = new THREE.Group();
		this.container.position.x = SGE.BELL_OFFSET;
		this.add(this.container);
		
		// Cylinder box
		var materials = [];
		var outerRadius = SGE.BELL_DRUM_OUTER_RADIUS;
		var innerRadius = SGE.BELL_DRUM_INNER_RADIUS;
		var drumLength = SGE.BELL_DRUM_LENGTH;
		var g, m, co, cco, o;
		
		// Create drum halves
		this.top = new THREE.Object3D();
		this.bottom = new THREE.Object3D();
		
		for(var i = 0; i <= 1; i++) {
			co = new THREE.Group();
		
			g = new THREE.CylinderGeometry(outerRadius, outerRadius, drumLength, SGE.MESH_ROUND_SEGMENTS, 1, true, 0, SGE.TAU/2);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			co.add(o);
			materials.push(m);
			
			g = new THREE.CylinderGeometry(innerRadius, innerRadius, drumLength, SGE.MESH_ROUND_SEGMENTS, 1, true, 0, SGE.TAU/2);
			m = SGE.DefaultMaterial({
					// Interior is darker, looks better (emulates ambient occlusion)
					color: SGE.blendColors(SGE.BASE_COLOR, 0x000000, 0.5),
					side: THREE.BackSide
				});
			o = new THREE.Mesh(g, m);
			co.add(o);
			materials.push(m);
			
			g = new THREE.RingGeometry(innerRadius, outerRadius, SGE.MESH_ROUND_SEGMENTS, 1, 0, SGE.TAU/2);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
			o = new THREE.Mesh(g, m);
			o.rotation.z = -SGE.TAU/4;
			o.rotation.x = -SGE.TAU/4;
			o.position.y = drumLength/2;
			co.add(o);
			materials.push(m);
			
			g = new THREE.RingGeometry(innerRadius, outerRadius, SGE.MESH_ROUND_SEGMENTS, 1, 0, SGE.TAU/2);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
			o = new THREE.Mesh(g, m);
			o.rotation.z = -SGE.TAU/4;
			o.rotation.x = SGE.TAU/4;
			o.position.y = -drumLength/2;
			co.add(o);
			materials.push(m);
			
			g = new THREE.PlaneGeometry(SGE.BELL_THICKNESS, drumLength);
			o = new THREE.Mesh(g, m);
			o.rotation.y = -SGE.TAU/4;
			o.position.z = (innerRadius+outerRadius)/2;
			co.add(o);
			materials.push(m);
			
			g = new THREE.PlaneGeometry(SGE.BELL_THICKNESS, drumLength);
			o = new THREE.Mesh(g, m);
			o.rotation.y = -SGE.TAU/4;
			o.position.z = -(innerRadius+outerRadius)/2;
			co.add(o);
			materials.push(m);
			
			co.rotation.z = SGE.TAU/4 * (i ? 1 : -1);
			
			cco = ( i ? this.top : this.bottom );
			cco.add(co);
			
			this.container.add(cco);
		}
		
		// Create covers
		this.back = new THREE.Object3D();
		this.front = new THREE.Object3D();
		
		for(var i = 0; i <= 1; i++) {
			co = new THREE.Group();
		
			g = new THREE.CylinderGeometry(outerRadius, outerRadius, SGE.BELL_THICKNESS, SGE.MESH_ROUND_SEGMENTS*2, 1, true, 0, SGE.TAU);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			co.add(o);
			materials.push(m);
			
			g = new THREE.CircleGeometry(outerRadius, SGE.MESH_ROUND_SEGMENTS*2);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			o.rotation.x = SGE.TAU/4;
			o.position.y = -SGE.BELL_THICKNESS/2;
			co.add(o);
			materials.push(m);
			
			g = new THREE.CircleGeometry(outerRadius, SGE.MESH_ROUND_SEGMENTS*2);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			o.rotation.x = -SGE.TAU/4;
			o.position.y = SGE.BELL_THICKNESS/2;
			co.add(o);
			materials.push(m);
			
			co.rotation.z = SGE.TAU/4;
			co.position.x = (drumLength/2 + SGE.BELL_THICKNESS/2) * (i ? -1 : 1);
			
			if (i == 1) { // if front cover
				// Input plug
				o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
				o.position.y = SGE.PLUG_LENGTH/2 + SGE.BELL_THICKNESS/2 + SGE.EPSILON;
				co.add(o);
				for(var m in o.materials) materials.push(o.materials[m]);
				
				// Input plug inside
				o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH/4);
				o.position.y = -(SGE.PLUG_LENGTH/8 + SGE.BELL_THICKNESS/2 + SGE.EPSILON);
				o.rotation.x = SGE.TAU/2;
				co.add(o);
				for(var m in o.materials) materials.push(o.materials[m]);
			
			}
			
			cco = ( i ? this.front : this.back );
			cco.add(co);
			this.container.add(cco);
		}
		
		
		// Lights
		var h = SGE.BELL_SOCKET_HEIGHT; // socket height
		var r = SGE.BELL_SOCKET_RADIUS; // bulb socket radius
		var br = SGE.BELL_BULB_RADIUS*r; // bulb radius 
		var bsh = SGE.BELL_BULB_STEM_HEIGHT*r; // bulb stem height 
		var bbr = SGE.BELL_BULB_STEM_RADIUS*r; // bulb stem radius
		var st = SGE.BELL_BULB_SIGN_THICKNESS; // sign thickness
		var sa1 = SGE.TAU*(0.25 - SGE.BELL_SIGN_SIZE/2);
		var sa2 = SGE.TAU*SGE.BELL_SIGN_SIZE;
		
		for(var i = 0; i <= 1; i++) {
			co = new THREE.Group();
			
			// Socket
			g = new THREE.CylinderGeometry(r, r, h, SGE.MESH_ROUND_SEGMENTS, 1, true, 0, SGE.TAU);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			materials.push(m);
			o.position.y = h/2;
			co.add(o);
			
			// Socket rim
			g = new THREE.CircleGeometry(r, SGE.MESH_ROUND_SEGMENTS);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR, side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			materials.push(m);
			o.rotation.x = -SGE.TAU/4;
			o.position.y = h;
			co.add(o);
			
			// Bulb
			g = new THREE.SphereGeometry(br, SGE.MESH_ROUND_SEGMENTS, SGE.MESH_ROUND_SEGMENTS/2);
			m = SGE.DefaultMaterial({ color: ( i ? SGE.NORTH_COLOR : SGE.SOUTH_COLOR ), side: THREE.FrontSide });
			o = new THREE.Mesh(g, m);
			o.rotation.x = -SGE.TAU/4;
			o.position.y = h + bsh/2*0.8 + br;
			o.scale.y = SGE.BELL_BULB_SQUASH;
			co.add(o);
			
			// Base of bulb
			g = new THREE.CylinderGeometry(bbr, bbr, bsh, SGE.MESH_ROUND_SEGMENTS, 1, true, 0, SGE.TAU);
			o = new THREE.Mesh(g, m);
			o.position.y = h + bsh/2;
			co.add(o);
			
			this.__bulbMaterials[i ? SGE.PLUS : SGE.MINUS] = m;
			
			// Front and back sides
			m = SGE.DefaultMaterial({
				color: SGE.blendColors(
					( i ? SGE.NORTH_COLOR : SGE.SOUTH_COLOR ),
					0x000000,
					0
				),
				side: THREE.FrontSide
			});
			for (var k = 0; k <= 1; k++) {
				// Minus sign
				g = new THREE.CylinderGeometry(br, br, st, SGE.MESH_ROUND_SEGMENTS, 1, true, sa1, sa2);
				o = new THREE.Mesh(g, m);
				o.rotation.y = -SGE.TAU/4 * (k ? +1 : -1);
				o.position.y = h + bsh/2 + br;
				o.position.z = SGE.EPSILON * (k ? +1 : -1);
				o.scale.x = SGE.BELL_BULB_SQUASH;
				co.add(o);
				
				if (i) {
				
					// Plus sign
					g = new THREE.CylinderGeometry(br, br, st, SGE.MESH_ROUND_SEGMENTS, 1, true, sa1, sa2);
					o = new THREE.Mesh(g, m);
					o.rotation.x = SGE.TAU/4;
					o.rotation.z = SGE.TAU/4 + SGE.TAU/2 * (k ? 0 : 1);
					o.position.y = h + bsh/2 + br;
					o.position.z = SGE.EPSILON * (k ? +1 : -1);
					o.scale.x = SGE.BELL_BULB_SQUASH;
					co.add(o);
				
				}
				
				this.__bulbSignMaterials[i ? SGE.PLUS : SGE.MINUS] = m;
				
			}
			
			// Sprites
			o = new SGE.Primitives.Sprite( i ? "bell_light_plus.png" : "bell_light_minus.png" );
			o.alwaysVisible = true;
			o.position.y = h + bsh/2 + br;
			o.opacity = 0;
			co.add(o);
			
			this.__flareSprites[i ? SGE.PLUS : SGE.MINUS] = o;
			
			co.position.y = SGE.BELL_DRUM_INNER_RADIUS;
			co.position.x = (i ? -1 : 1) * SGE.BELL_BULB_SPACING/2;
			this.top.add(co);
		}
		
		this.directions = new SGE.Primitives.BellAnalyzerDirections();
		this.container.add(this.directions);
		
		this.directions.position.x = SGE.BELL_DRUM_LENGTH/2 + SGE.BELL_THICKNESS + SGE.EPSILON;
		
		// Make it glow-able
		SGE.Interface.Glow(this, materials);
		// missing glow on the plugs
		
		this.light = 0;
	}
	
	this.__flashPlus = function(e) {
		e.state = SGE.PLUS;
		this.flash(SGE.PLUS);
		this.events.trigger(SGE.EVENT_DETECT_PARTICLE, e);
	}
	this.__flashMinus = function(e) {
		e.state = SGE.MINUS;
		this.flash(SGE.MINUS);
		this.events.trigger(SGE.EVENT_DETECT_PARTICLE, e);
	}
	
	this.setAnalyzer = function(analyzer) {
		if (!analyzer.experiment) return;
		analyzer.experiment.updatePositions();
		var dplus = analyzer.attachments[SGE.IO_TOP];
		var dminus = analyzer.attachments[SGE.IO_BOTTOM];
		if (!(dplus instanceof SGE.Detector && dminus instanceof SGE.Detector)) {
			SGE.error("BellAnalyzerDrum requires an analyzer with two detectors attached.");
		}
		
		// Make sure detectors are the right distance from analyzer
		dplus.spacing = SGE.BELL_DETECTOR_OFFSET;
		dminus.spacing = SGE.BELL_DETECTOR_OFFSET;
		
		// Clear events
		var self = this;
		dplus.events.on(SGE.EVENT_DETECT_PARTICLE, function(e){ self.__flashPlus(e); } );
		dminus.events.on(SGE.EVENT_DETECT_PARTICLE, function(e){ self.__flashMinus(e); } );
		
		// Position drum
		var d = analyzer.direction;
		this.position.set(
			analyzer.position.x,
			analyzer.position.y,
			analyzer.position.z
		);
		
		// Set rotation to follow direction of atoms
		this.rotation.y = (d == SGE.RIGHT ? 0 : SGE.TAU/2);
	}
	
	this.__setLight = function(light, brightness) {
		if (light != SGE.PLUS && light != SGE.MINUS) return;
		this.__bulbMaterials[light].color.setHex(
			SGE.blendColors(
				( light == SGE.PLUS ? SGE.NORTH_COLOR : SGE.SOUTH_COLOR ),
				0x000000,
				1 - (0.4 + 0.6*brightness)
			)
		);
		this.__bulbSignMaterials[light].color.setHex(
			SGE.blendColors(
				( light == SGE.PLUS ? SGE.NORTH_COLOR : SGE.SOUTH_COLOR ),
				0x000000,
				1 - (0.1 + 0.1*brightness)
			)
		);
		this.__flareSprites[light].size = 2.5 + 2 * Math.pow(brightness, 3);
		this.__flareSprites[light].opacity = Math.pow(brightness, 4);
	}
	
	Object.defineProperty(this, 'light', {
		set: function(value) {
			this.__bulbBrightness = value;
			if (value >= 0) {
				this.__setLight(SGE.PLUS, value);
				this.__setLight(SGE.MINUS, 0);
			} else {
				this.__setLight(SGE.MINUS, Math.abs(value));
				this.__setLight(SGE.PLUS, 0);
			}
		},
		get: function() { return this.__bulbBrightness; }
	});
	
	this.flash = function(value) {
		if (value == SGE.PLUS) { value = 1; }
		else if (value == SGE.MINUS) { value = -1; }
		else { value = 0; }
		TweenMax.to(this, (value == 0 ? 0.2 : 0.4 )/SGE.AnimationManager.timeFactor, {
			light: value,
			ease: (value == 0 ? Power0.easeNone : Back.easeOut )
		});
	}
	
	this.init();
	
}
SGE.Primitives.BellAnalyzerDrum.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.BellAnalyzerDrum.prototype.constructor = SGE.Primitives.BellAnalyzerDrum;

// Three directions
SGE.Primitives.BellAnalyzerDirections = function() {
	THREE.Object3D.call(this);
	
	this.__labels = [];
	this.__material = null;
	this.__axes = null;
	this.init = function() {
		
		var g, m, o;
		m = new THREE.LineBasicMaterial({ color: SGE.BELL_DIRECTIONS_COLOR, transparent: true });
		for(var i = 0; i < 3; i++) {
			g = new THREE.Geometry();
			g.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,SGE.BELL_DRUM_INNER_RADIUS,0)
			);
			o = new THREE.Line(g,m);
			o.rotation.x = SGE.TAU/3*i;
			this.add(o);
			this.__axes = o;
			
			o = new SGE.Primitives.Label(String.fromCharCode(65+i));
			o.size = SGE.BELL_DIRECTIONS_LABEL_SIZE;
			o.color = SGE.BELL_DIRECTIONS_COLOR;
			o.position.y = Math.cos(SGE.TAU/3*i) * SGE.BELL_DRUM_INNER_RADIUS * 1.2;
			o.position.z = Math.sin(SGE.TAU/3*i) * SGE.BELL_DRUM_INNER_RADIUS * 1.2;
			this.add(o);
			
			this.__labels.push(o);
		}
		this.__material = m;
		
	}
	
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			for(var i in this.__labels) {
				this.__labels[i].opacity = value;
			}
			this.__material.opacity = value;
			this.visibility = (value > 0);
		},
		get: function() {
			return this.__material.opacity;
		}
	});
	
	Object.defineProperty(this, 'alwaysVisible', {
		set: function(value) {
			this.__material.depthWrite = !value;
			this.__material.depthTest = !value;
			this.__material.needsUpdate = true;
			for(var i in this.__labels) {
				this.__labels[i].alwaysVisible = value;
			}
		},
		get: function() {
			return this.this.__material.depthTest;
		}
	});
	
	this.init();
}
SGE.Primitives.BellAnalyzerDirections.prototype = Object.create(THREE.Object3D.prototype);
SGE.Primitives.BellAnalyzerDirections.prototype.constructor = SGE.Primitives.BellAnalyzerDirections;


// -------------------------------------------------------------------------------------------------



// #################################################################################################
// SCENE OBJECTS
SGE.SceneObjects = {};

// 3D objects and their geometry
// These are the entities we can place inside the 3D scene
// The 3D geometry actually passed to Three.js is always specified within the .object3d property

// -------------------------------------------------------------------------------------------------
// Base object
// All SceneObjects are extensions of this class
SGE.SceneObjects.BaseObject = function() { this.uid = SGE.getUID();
	
	this.__CLASS = "BaseObject";
	
	// Empty Three.js container that will hold all the geometry
	this.group = new THREE.Group(); // general container
	this.object3d = new THREE.Object3D(); // main geometry container
	this.group.add(this.object3d);
	
	// Parts
	// All objects are made up of sub-objects or primitives
	// This keeps track of them
	this.parts = [];
	// The list of parts is used to call .glow() individually
	this.__glowValue = 0;
	this.setGlow = function(v) {
		this.__glowValue = Math.max(0,Math.min(1,v));
		for(var i in this.parts) {
			if (this.parts[i].setGlow) this.parts[i].glow = v;
		}
	}
	Object.defineProperty(this, 'glow', {
		set: function(value) {
			this.setGlow(value);
		},
		get: function() {
			return this.__glowValue;
		}
	});
	
	// ToDo: Highlighting functions using the glow() interface
	// glow(duration) (off on)
	// unglow(duration) (on off)
	// blink (duration, number of times) (off on off on...)
	// stopBlink()
	
	// Orientation
	// Simulation occurs along the x-axis. This tells us which direction atoms will
	// pass through the object. Default is to the right.
	this.__direction = SGE.RIGHT;
	Object.defineProperty(this, 'direction', {
		set: function(value) {
			this.__direction = value;
			if (value == SGE.NO_DIRECTION) {
				this.object3d.rotation.y = 0;
			} else {
				this.object3d.rotation.y = (value == SGE.RIGHT ? 0 : SGE.TAU/2);
			}
		},
		get: function() {
			return this.__direction;
		}
	});
	
	
	// The simulation always happens along the x axis, so objects only rotate around x
	// This is the internal angle used in the simulation for this angle
	this.__angle = 0;
	// To get or change rotations
	Object.defineProperty(this, 'angle', {
		set: function(value) {
			this.__angle = value;
			this.object3d.rotation.x = value;
		},
		get: function() {
			return this.__angle;
		},
		configurable: true
	});
	
	// Label
	this.label = new SGE.Primitives.Label();
	this.label.opacity = 0;
	this.group.add(this.label);
	
	// Position
	// Borrow straight from object3d
	Object.defineProperty(this, 'position', {
		get: function() {
			return this.group.position;
		}
	});
	
	// Visibility
	// Borrow straight from object3d
	Object.defineProperty(this, 'visible', {
		set: function(value) {
			this.group.visible = value;
		},
		get: function() {
			return this.group.visible;
		}
	});
	
	this.__debugBox = null;
	Object.defineProperty(this, 'debugBox', {
		set: function(value) {
			if (value === null) {
				if (this.__debugBox) {
					this.object3d.remove(this.__debugBox);
					this.__debugBox.material.dispose();
					this.__debugBox.geometry.dispose();
					this.__debugBox.dispose();
				}
				return;
			}
			if (!this.__debugBox) {
				var g = new THREE.BoxGeometry(1, 1, 1);
				var o = new THREE.Mesh(g, null);
				var box = new THREE.BoxHelper(o);
				box.material.color.set(0x00ff00);
				this.object3d.add( box );
				this.__debugBox = box;
			}
			this.__debugBox.scale.set(value[0], value[1], value[2]);
		},
		get: function() {
			if (!this.__debugBox) return null;
			return [
				this.__debugBox.scale.x,
				this.__debugBox.scale.y,
				this.__debugBox.scale.z
			];
		}
	});
	
	// Memory management
	// ToDo: add all mesh, geometry & material here. Leave textures alone, as they're cached/reused
	this.__disposables = [];
	
	this.addDisposable = function(o) {
		if (o.dispose) this.__disposables.push(o);
	}
	
	this.dispose = function() {
		var o;
		while (this.__disposables.length) {
			o = this.__disposables.pop();
			if (o && o.dispose) o.dispose();
		}
	}
	
}


// -------------------------------------------------------------------------------------------------
// Angle meter
SGE.SceneObjects.AngleMeter = function() {
	SGE.SceneObjects.BaseObject.call(this);
	
	this.__color = SGE.ANGLE_METER_COLOR;
	this.__radius = SGE.ANGLE_METER_RADIUS;
	this.__wedgeSize = SGE.ANGLE_METER_WEDGE_SIZE;
	
	this.init = function() {
		var g, m, co, o;
		
		// Create lines
		
		m = new THREE.LineBasicMaterial({ color: this.__color });
		
		// Reference line
		g = new THREE.Geometry();
		g.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
		o = new THREE.Line(g,m);
		this.group.add(o);
		this.referenceLine = o;
		
		// Angle line
		g = new THREE.Geometry();
		g.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
		o = new THREE.Line(g,m);
		this.object3d.add(o);
		this.angleLine = o;
		
		this.lineMaterial = m;
		this.lineMaterial.transparent = true;
		// this.lineMaterial.depthTest = true;
		// this.lineMaterial.depthWrite = true;
		
		// Curve line
		m = new THREE.MeshBasicMaterial({ color: this.__color, side: THREE.DoubleSide });
		g = new THREE.CircleGeometry(1, SGE.MESH_ROUND_SEGMENTS * 2);
		o = new THREE.Mesh(g,m);
		o.rotation.x = SGE.TAU/4;
		o.rotation.y = SGE.TAU/4;
		this.group.add(o);
		this.wedge = o;
		this.wedgeMaterial = m;
		this.wedgeMaterial.transparent = true;
		this.wedgeMaterial.opacity = SGE.ANGLE_METER_WEDGE_OPACITY;
		
		this.label.visible = true;
		this.label.alwaysVisible = false;
		this.label.size = 0.5;
		this.label.color = this.__color;
		
		// Force angle between -pi to +pi?
		this.symmetricAngleRange = false;
		
		this.update();
		
		this.opacity = 0;
	}
	
	this.update = function() {
		
		if (this.__angle === null) {
			this.angleLine.visible = false;
			this.wedge.visible = false;
			this.label.text = "?";
			return;
		}
		
		this.angleLine.visible = true;
		this.wedge.visible = true;
		
		// Force angle between -pi to +pi
		var a = Math.atan2(Math.sin(this.__angle), Math.cos(this.__angle));
		if (!this.symmetricAngleRange && a < 0) a = SGE.TAU + a;
		
		var it = this.wedge.geometry.vertices.length - 2;
		for (var i = 0; i <= it; i++) {
			this.wedge.geometry.vertices[i+1].x = Math.cos(a*i/it);
			this.wedge.geometry.vertices[i+1].y = Math.sin(a*i/it);
		}
		this.wedge.geometry.verticesNeedUpdate = true;
		
		var wr = this.__wedgeSize*this.__radius;
		this.wedge.scale.set(wr, wr, wr);
		this.referenceLine.geometry.vertices[1].y = this.__radius;
		this.referenceLine.geometry.verticesNeedUpdate = true;
		this.angleLine.geometry.vertices[1].y = wr;
		this.angleLine.geometry.verticesNeedUpdate = true;
		
		this.label.position.y = this.__radius+1/3;
		this.label.text = SGE.round(a*360/SGE.TAU) +"°";
	}
	
	Object.defineProperty(this, 'radius', {
		set: function(value) {
			this.__radius = value;
			this.update();
		},
		get: function() {
			return this.__radius;
		}
	});
	
	Object.defineProperty(this, 'wedgeSize', {
		set: function(value) {
			this.__wedgeSize = value;
			this.update();
		},
		get: function() {
			return this.__wedgeSize;
		}
	});
	
	Object.defineProperty(this, 'color', {
		set: function(value) {
			this.__color = value;
			this.label.color = value;
			this.lineMaterial.color.setHex(value);
			this.wedgeMaterial.color.setHex(value);
		},
		get: function() {
			return this.__color;
		}
	});
	
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.lineMaterial.opacity = value;
			this.wedgeMaterial.opacity = value*SGE.ANGLE_METER_WEDGE_OPACITY;
			this.label.opacity = value;
			this.visible = (value > 0);
		},
		get: function() {
			return this.lineMaterial.opacity;
		}
	});
	
	this.init();
}


// -------------------------------------------------------------------------------------------------
// Ignore
// Just an empty space with a cross that shows up whenever needed
SGE.SceneObjects.Ignore = function() {
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		// Geometry container
		co = new THREE.Object3D();
		var g, m, co, o;
		
		// Create sprite
		m = new THREE.SpriteMaterial({
			map: SGE.TextureLoader.load(SGE.asset("ignore.png"))
		});
		m.transparent = true;
		o = new THREE.Sprite(m);
		co.add(o);
		
		this.material = m;
		
		this.material.depthTest = false;
		this.material.depthWrite = false;
		
		this.label.visible = true;
		this.label.position.y = 1;
		this.label.alwaysVisible = true;
		this.label.size = 2/3;
		this.label.color = 0xFF0000;
		this.label.text = SGE.IGNORED_LABEL;
		
		this.opacity = 0;
		
		this.object3d.add(co);
	}
	
	Object.defineProperty(this, 'opacity', {
		set: function(value) {
			this.material.opacity = value;
			this.label.opacity = value;
		},
		get: function() {
			return this.material.opacity;
		}
	});
	
	this.init();
}

// -------------------------------------------------------------------------------------------------
// Atom source (or oven, furnace)
// It can be of three types:
// SGE.SOURCE_TYPE_NORMAL   : generates atom with a random state
// SGE.SOURCE_TYPE_SPINUP   : atom with a known state (spin up) relative to source
// SGE.SOURCE_TYPE_ENTANGLED: two atoms with randomly entangled states (u/d or d/u)
// To get spins in different directions, rotate the abstract SGE.Source object using the angle
// property.
// DO NOT rotate the Three.js geometry inside Source.object3d.
//   ______ 
//  |      |/|
//  |      | |
//  |______|\|
SGE.SceneObjects.Source = function(sourceType) {
	SGE.SceneObjects.BaseObject.call(this);
	
	sourceType = ifdef(sourceType, SGE.SOURCE_TYPE_NORMAL);
	this.__sourceType = sourceType;
	
	this.init = function() {
		var g, m, co, o, t;
		
		// Geometry container
		co = new THREE.Object3D();
		
		t = SGE.TextureLoader.get(SGE.asset('source.png'));
		o = new SGE.Primitives.Box(1, 1, 1, t);
		
		o.numRegions = [2, 2];
		o.addMap("source"+SGE.SOURCE_TYPE_SPINUP, 0, 0, 1, 1, true, false); 
		o.addMap("source"+SGE.SOURCE_TYPE_ENTANGLED, 1, 0, 1, 1, false, false);
		o.addMap("source"+SGE.SOURCE_TYPE_CURRENT_LOOP, 0, 1, 1, 1, false, false);
		
		co.add(o);
		this.parts.push(o);
		this.box = o;
		
		o = new SGE.Primitives.Cone(SGE.SOURCE_HOLE_RADIUS, SGE.SOURCE_CONE_RADIUS, SGE.SOURCE_CONE_LENGTH, SGE.WALL_THICKNESS)
		o.position.x = (1 + SGE.SOURCE_CONE_LENGTH)/2;
		o.rotation.z = SGE.TAU/4;
		o.rotation.y = SGE.TAU/2;
		co.add(o);
		this.parts.push(o);
		this.cone1 = o;
		
		// Add a second cone if entangled source
		o = new SGE.Primitives.Cone(SGE.SOURCE_HOLE_RADIUS, SGE.SOURCE_CONE_RADIUS, SGE.SOURCE_CONE_LENGTH, SGE.WALL_THICKNESS)
		o.position.x = -(1 + SGE.SOURCE_CONE_LENGTH)/2;
		o.rotation.z = SGE.TAU/4;
		co.add(o);
		this.parts.push(o);
		this.cone2 = o;
		
		this.object3d.add(co);
		
		// Sources are directionless
		// Direction is defined by which side you attach objects to
		this.direction = SGE.NO_DIRECTION;
		
		this.updateSource();
	}
	
	this.updateSource = function() {
		var g = "source"+this.__sourceType;
		switch(this.__sourceType) {
			case SGE.SOURCE_TYPE_NORMAL:
				this.box.front();
				this.box.back();
				this.box.left();
				break;
			case SGE.SOURCE_TYPE_SPINUP:
			case SGE.SOURCE_TYPE_CURRENT_LOOP:
				this.box.front(g);
				this.box.back(g);
				this.box.left(g);
				break;
			case SGE.SOURCE_TYPE_ENTANGLED:
				this.box.front(g);
				this.box.back(g);
				this.box.left();
				break;
		}
		this.cone2.visible = (this.__sourceType == SGE.SOURCE_TYPE_ENTANGLED);
	}
	
	Object.defineProperty(this, 'sourceType', {
		set: function(value) {
			this.__sourceType = value;
			this.updateSource();
		},
		get: function() { return this.__sourceType; }
	});
	
	this.init();
	
}
// Aliases for other sources, for readability in code, if necessary
SGE.SceneObjects.SourceSpinUp = function() {
	SGE.SceneObjects.Source.call(this, SGE.SOURCE_TYPE_SPINUP);
}
SGE.SceneObjects.SourceEntangled = function() {
	SGE.SceneObjects.Source.call(this, SGE.SOURCE_TYPE_ENTANGLED);
}


// -------------------------------------------------------------------------------------------------
// Detector
//        __
//   |\ /    \ 
//   | |      |
//   |/ \ __ /
SGE.SceneObjects.Detector = function() {
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		var g, m, co, o;
		// Geometry container
		co = new THREE.Object3D();
		
		// Create sphere geometry and mesh
		g = new THREE.SphereGeometry(
			SGE.DETECTOR_RADIUS,
			SGE.MESH_SPHERE_SEGMENTS,
			SGE.MESH_SPHERE_SEGMENTS,
			0, SGE.TAU,
			0, SGE.TAU/2*SGE.DETECTOR_OVERLAP_FACTOR1
		);
		m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
		o = new THREE.Mesh(g, m);
		o.rotation.z = SGE.TAU/4;
		co.add(o);
		SGE.Interface.Glow(o, [m]);
		this.parts.push(o);
		this.sphere = o;
		
		o = new SGE.Primitives.Cone(SGE.DETECTOR_HOLE_RADIUS, SGE.DETECTOR_CONE_RADIUS, SGE.DETECTOR_CONE_LENGTH, SGE.WALL_THICKNESS)
		o.position.x = SGE.DETECTOR_RADIUS + SGE.SOURCE_CONE_LENGTH/2*SGE.DETECTOR_OVERLAP_FACTOR2;
		o.rotation.z = SGE.TAU/4;
		o.rotation.y = SGE.TAU/2;
		co.add(o);
		this.parts.push(o);
		
		co.rotation.y = SGE.TAU/2;
		
		// Counter label
		this.counterLabel = new SGE.Primitives.Label();
		this.counterLabel.text = "0";
		this.counterLabel.opacity = 0;
		this.group.add(this.counterLabel);
		
		this.object3d.add(co);
	}
	
	Object.defineProperty(this, 'sphereGlow', {
		set: function(value) {
			this.sceneObject.sphere.setGlow(value);
		},
		get: function() { return this.sceneObject.sphere.setGlow(value); }
	});
	
	this.init();
}


// -------------------------------------------------------------------------------------------------
// Analyzer
// A 4x3x1 box with three cylindrical tubes on the sides of height 1/2
// Total width is 5
//      _______ _
//    _|       |_|
//   |_|       |_
//     |_______|_|
SGE.SceneObjects.Analyzer = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		var g, m, co, o, t;
		
		// Geometry container. This is scaled later so the source fits inside a 1x1x1 box
		co = new THREE.Object3D();
		
		t = SGE.TextureLoader.get(SGE.asset('analyzer_interferometer.png'));
		o = new SGE.Primitives.Box(4, 3, 1, t);
		
		o.numRegions = [4, 8];
		o.addMap("front", 0, 3, 4, 3, false, false); 
		o.addMap("back", 0, 3, 4, 3, true, false); 
		o.addMap("top", 0, 6, 4, 1, false, false); 
		o.addMap("bottom", 0, 7, 4, 1, false, false);
		
		o.front("front");
		o.back("back");
		o.top("top");
		o.bottom("bottom");
		
		co.add(o);
		this.parts.push(o);
		
		// Input plug
		o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
		o.rotation.z = SGE.TAU/4;
		o.position.x = -(2+SGE.PLUG_LENGTH/2);
		co.add(o);
		this.parts.push(o);
		
		// Output plugs
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (2+SGE.PLUG_LENGTH/2);
		o.position.y = 1;
		co.add(o);
		this.parts.push(o);
		
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (2+SGE.PLUG_LENGTH/2);
		o.position.y = -1;
		co.add(o);
		this.parts.push(o);
		
		// Local object's origin at the left
		// co.position.x = 2;
		
		this.object3d.add(co);
		
	}
	
	this.init();
}

// -------------------------------------------------------------------------------------------------
// Exploded analyzer
// Analyzer with the inner workings of the Stern-Gerlach experiment exposed
// Hiding the analyzer box and tubing gets us the raw Stern-Gerlach experiments
// Don't use this unless you plan on exposing the insides, as it has a lot of extra geometry
SGE.SceneObjects.ExplodedAnalyzer = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		
		var g, m, o, t, co;

		t = SGE.TextureLoader.get(SGE.asset('analyzer_interferometer.png'));
		
		// ----------------------------------------- Back cover
		co = new THREE.Group();
		o = new SGE.Primitives.Box(4, 3, SGE.WALL_THICKNESS, t);
		o.numRegions = [4, 8];
		o.addMap("back", 0, 3, 4, 3, true, false); 
		o.back("back");
		o.position.z = -(1-SGE.WALL_THICKNESS)/2-SGE.EPSILON;
		co.add(o);
		this.parts.push(o);
		this.backCover = co;
		
		// ----------------------------------------- Box
		co = new THREE.Group();
		// Top cover
		o = new SGE.Primitives.Box(4, SGE.WALL_THICKNESS, 1, t);
		o.numRegions = [4, 8];
		o.addMap("top", 0, 6, 4, 1, false, false); 
		o.top("top");
		o.position.y = (3-SGE.WALL_THICKNESS)/2;
		co.add(o);
		this.parts.push(o);
		
		// Bottom cover
		o = new SGE.Primitives.Box(4, SGE.WALL_THICKNESS, 1, t);
		o.numRegions = [4, 8];
		o.addMap("bottom", 0, 7, 4, 1, false, false);
		o.bottom("bottom");
		o.position.y = -(3-SGE.WALL_THICKNESS)/2;
		co.add(o);
		this.parts.push(o);
		
		// Left cover
		o = new SGE.Primitives.Box(SGE.WALL_THICKNESS, 3, 1-SGE.EPSILON, t);
		o.position.x = -(4-SGE.WALL_THICKNESS)/2;
		co.add(o);
		this.parts.push(o);

		// Right cover
		o = new SGE.Primitives.Box(SGE.WALL_THICKNESS, 3, 1-SGE.EPSILON, t);
		o.position.x = (4-SGE.WALL_THICKNESS)/2;
		co.add(o);
		this.parts.push(o);
		
		// Input plug
		o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
		o.rotation.z = SGE.TAU/4;
		o.position.x = -(2+SGE.PLUG_LENGTH/2);
		co.add(o);
		this.parts.push(o);
		
		// Input plug inside
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH/4);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = -(4-SGE.PLUG_LENGTH/4-2*SGE.WALL_THICKNESS)/2;
		co.add(o);
		this.parts.push(o);
		
		// Output plugs
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (2+SGE.PLUG_LENGTH/2);
		o.position.y = 1;
		co.add(o);
		this.parts.push(o);
		
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (2+SGE.PLUG_LENGTH/2);
		o.position.y = -1;
		co.add(o);
		this.parts.push(o);
		
		// Output plugs inside
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH/4);
		o.rotation.z = +SGE.TAU/4;
		o.position.x = (4-SGE.PLUG_LENGTH/4-2*SGE.WALL_THICKNESS)/2;
		o.position.y = 1;
		co.add(o);
		this.parts.push(o);
		
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH/4);
		o.rotation.z = +SGE.TAU/4;
		o.position.x = (4-SGE.PLUG_LENGTH/4-2*SGE.WALL_THICKNESS)/2;
		o.position.y = -1;
		co.add(o);
		this.parts.push(o);
		this.boxFrame = co;
		
		
		
		// ----------------------------------------- Front cover
		co = new THREE.Group();
		o = new SGE.Primitives.Box(4, 3, SGE.WALL_THICKNESS, t);
		o.numRegions = [4, 8];
		o.addMap("front", 0, 3, 4, 3, false, false); 
		o.front("front");
		o.position.z = (1-SGE.WALL_THICKNESS)/2+SGE.EPSILON;
		co.add(o);
		this.parts.push(o);
		this.frontCover = co;
		
		
		
		// ----------------------------------------- Magnets
		co = new SGE.Primitives.Magnets();
		co.position.x = -1; // offset to the left, near the input
		this.magnets = co;
		
		// ----------------------------------------- Tubes
		co = new THREE.Group();
		var r = 0.5-SGE.WALL_THICKNESS*2;
		// Defines a tapering curve shaped like /¯¯
		var p = (function(){
			var Curve = THREE.Curve.create(
				function (scale) { this.scale = scale; }, // scaling factor
				function (t) {
					t += 0.15; // offset t a little for aesthetics
					var v;
					// 0.1 is the "knee curve" length
					if (t < (0.5 - 0.1/Math.sqrt(2))) {
						v = new THREE.Vector3(this.scale*t, this.scale*t, 0);
					} else {
						v = new THREE.Vector3(this.scale*t, this.scale*0.5, 0)
					}
					return v;
				}
			);
			
			return new Curve(1.5);
		})();
		
		// Top tube
		// Two meshes on top of eachother, since inside is darker
		this.topTube = new THREE.Group();
		g = new THREE.TubeGeometry(p, 8, r, SGE.MESH_ROUND_SEGMENTS, false);
		m = new THREE.MeshLambertMaterial({color: SGE.ANALYZER_TUBE_COLOR, side: THREE.FrontSide});
		o = new THREE.Mesh(g, m);
		o.position.y = 0.25; // eyeballing vertical offset
		this.topTube.add(o);
		m = new THREE.MeshLambertMaterial({
			color: SGE.blendColors(SGE.ANALYZER_TUBE_COLOR, 0x000000, 2/3),
			side: THREE.BackSide
		});
		o = new THREE.Mesh(g, m);
		o.position.y = 0.25;
		this.topTube.add(o);
		co.add(this.topTube);
		
		// Bottom tube
		// Two meshes on top of eachother, since inside is darker
		this.bottomTube = new THREE.Group();
		g = new THREE.TubeGeometry(p, 8, r, SGE.MESH_ROUND_SEGMENTS, false);
		m = new THREE.MeshLambertMaterial({color: SGE.ANALYZER_TUBE_COLOR, side: THREE.FrontSide});
		o = new THREE.Mesh(g, m);
		o.position.y = -0.25; // eyeballing vertical offset
		o.rotation.x = SGE.TAU/2;
		this.bottomTube.add(o);
		m = new THREE.MeshLambertMaterial({
			color: SGE.blendColors(SGE.ANALYZER_TUBE_COLOR, 0x000000, 2/3),
			side: THREE.BackSide
		});
		o = new THREE.Mesh(g, m);
		o.position.y = -0.25; // eyeballing vertical offset
		o.rotation.x = SGE.TAU/2;
		this.bottomTube.add(o);
		co.add(this.bottomTube);
		
		this.tubes = co;
		
		// At this point, all elements are defined
		
		
		// Local object's origin at the left
		co = new THREE.Group();
		// co.position.x = 2;
		
		co.add(this.backCover);
		co.add(this.boxFrame);
		co.add(this.frontCover);
		co.add(this.magnets);
		co.add(this.tubes);
		
		this.object3d.add(co);
		
	}
	
	this.init();
}


// -------------------------------------------------------------------------------------------------
// Stern-Gerlach apparatus
// A standard, "bare", Stern-Gerlach experiment with a magnet arrangement and a screen
// The magnets and screen are contained inside their own separate dummy objects centered at this
// objects local origin. 
// _________     _____
// \/______/    |     |
//              |     |
//  _______     |     |
// |_|_____|    |_____|
SGE.SceneObjects.SternGerlach = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		
		var g, m, co, o, t;
		
		// ----------------------------------------- Magnets
		co = new SGE.Primitives.Magnets();
		co.position.x = -SGE.SG_LENGTH/2+1; // offset to the left, near the input
		this.magnets = co;
		this.object3d.add(co);
		
		// ----------------------------------------- Screen
		co = new THREE.Group();
		g = new THREE.BoxGeometry(SGE.SG_SCREEN_THICKNESS,3,3);
		t = (function(){
			var c = document.createElement('canvas');
			var r = SGE.SG_SCREEN_TEXTURE_SIZE;
			c.width = r;
			c.height = r;
			var ctx = c.getContext("2d");
			ctx.fillStyle = "rgba(255,255,255,1)";
			ctx.fillRect(0,0,r,r);
			var tex = new THREE.Texture(c);
			tex.needsUpdate = true;
			return {
				texture: tex,
				context2d: ctx,
				canvas: c,
				size: SGE.SG_SCREEN_TEXTURE_SIZE
			};
		})();
		
		var m_p = new THREE.MeshLambertMaterial({ color: SGE.SG_SCREEN_COLOR });
		var m_t = new THREE.MeshLambertMaterial({ color: SGE.SG_SCREEN_COLOR, map: t.texture });
		var m_list = [m_t, m_t, m_p, m_p, m_p, m_p];
		m = new THREE.MeshFaceMaterial(m_list);
		o = new THREE.Mesh(g, m);
		o.position.x = SGE.SG_LENGTH/2 + SGE.SG_SCREEN_THICKNESS;
		co.add(o);
		this.object3d.add(co);
		t.object = co;
		this.screen = t;
		
		
		
		this.clearScreen();
	}
	
	this.clearScreen = function() {
		this.screen.context2d.fillStyle = "rgba(255,255,255,1)";
		this.screen.context2d.fillRect(0,0,this.screen.size,this.screen.size);
		this.screen.texture.needsUpdate = true;
	}
	
	this.drawDot = function(x, y, radius, alpha) {
		alpha = ifdef(alpha, 1);
		var m = this.screen.size;
		var r = radius*m/2;
		x = (x+1)/2 * m;
		y = (1-y)/2 * m;
		this.screen.context2d.fillStyle = "rgba(0,0,0,"+alpha+")";
		this.screen.context2d.beginPath();
		SGE.drawEllipse(this.screen.context2d,x,y,r,r);
		this.screen.context2d.fill();
		this.screen.texture.needsUpdate = true;
	}
	
	// Rotate only the magnets in this case
	Object.defineProperty(this, 'angle', {
		set: function(value) {
			this.__angle = value;
			this.magnets.rotation.x = value;
		},
		get: function() {
			return this.__angle;
		},
		configurable: true
	});
	
	this.init();
	
}


// -------------------------------------------------------------------------------------------------
// Eraser
// Similar to the analyzer, but with two inputs and one output
//
//    _ _______ 
//   |_|       |_
//    _|       |_|
//   |_|_______|
SGE.SceneObjects.Eraser = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		var g, m, co, o, t;
		
		// Geometry container. This is scaled later so the source fits inside a 1x1x1 box
		co = new THREE.Object3D();
		
		
		t = SGE.TextureLoader.get(SGE.asset('analyzer_interferometer.png'));
		o = new SGE.Primitives.Box(4, 3, 1, t);
		
		o.numRegions = [4, 8];
		o.addMap("front", 0, 0, 4, 3, true, false); 
		o.addMap("back", 0, 0, 4, 3, false, false); 
		
		o.front("front");
		o.back("back");
		
		co.add(o);
		this.parts.push(o);
		
		// Input plugs
		o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
		o.rotation.z = SGE.TAU/4;
		o.position.x = -(2+SGE.PLUG_LENGTH/2);
		o.position.y = 1;
		co.add(o);
		this.parts.push(o);
		
		o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
		o.rotation.z = SGE.TAU/4;
		o.position.x = -(2+SGE.PLUG_LENGTH/2);
		o.position.y = -1;
		co.add(o);
		this.parts.push(o);
		
		// Output plug
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (2+SGE.PLUG_LENGTH/2);
		co.add(o);
		this.parts.push(o);
		
		// Local object's origin at the left
		// co.position.x = 2;
		
		this.object3d.add(co);
	
	}
		
	this.init();
}


// -------------------------------------------------------------------------------------------------
// Gate
// A 1x3x1 box where top or bottom paths can be closed
//    _ ___ _
//   |_|(x)|_|
//    _|   |_
//   |_|(>)|_|
SGE.SceneObjects.Gate = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		var co, o, t;
		// Geometry container. This is scaled later so the source fits inside a 1x1x1 box
		co = new THREE.Object3D();
		
		t = SGE.TextureLoader.get(SGE.asset('gate.png'));
		o = new SGE.Primitives.Box(1, 3, 1, t);
		
		o.numRegions = [4, 4];
		o.addMap("front00", 0, 0, 1, 3, false, false); 
		o.addMap("back00", 0, 0, 1, 3, true, false); 
		o.addMap("front10", 1, 0, 1, 3, false, false); 
		o.addMap("back10", 1, 0, 1, 3, true, false); 
		o.addMap("front01", 2, 0, 1, 3, false, false); 
		o.addMap("back01", 2, 0, 1, 3, true, false); 
		o.addMap("front11", 3, 0, 1, 3, false, false); 
		o.addMap("back11", 3, 0, 1, 3, true, false); 
		
		o.front("front00");
		o.back("back00");
		
		co.add(o);
		this.parts.push(o);
		this.box = o;
		
		// Input plugs
		o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
		o.rotation.z = SGE.TAU/4;
		o.position.x = -(1.5/2);
		o.position.y = 1;
		co.add(o);
		this.parts.push(o);
		
		o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
		o.rotation.z = SGE.TAU/4;
		o.position.x = -(1.5/2);
		o.position.y = -1;
		co.add(o);
		this.parts.push(o);
		
		// Output plugs
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (1.5/2);
		o.position.y = 1;
		co.add(o);
		this.parts.push(o);
		
		o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
		o.rotation.z = -SGE.TAU/4;
		o.position.x = (1.5/2);
		o.position.y = -1;
		co.add(o);
		this.parts.push(o);
		
		// Local object's origin at the left
		// co.position.x = 1/2;
		
		this.object3d.add(co);
	}
	
	this.init();
	
	this.open = {};
	this.open[SGE.IO_TOP] = false;
	this.open[SGE.IO_BOTTOM] = false;
	
	this.setOpenState = function(top, bottom) {
		this.open[SGE.IO_TOP] = top;
		this.open[SGE.IO_BOTTOM] = bottom;
		var c = (top?"1":"0")+(bottom?"1":"0");
		this.box.front("front"+c);
		this.box.back("back"+c);
	}
	
}

// -------------------------------------------------------------------------------------------------
// DetectorGate
// A 1x3x1 box with 1 or 2 detector-like input/output conical ports or straight pipes
// Lets all atoms through, but acts like a detector as well.
// "Collapses" states, since measuring one path and not measuring the other are equivalent
//   _        _
//  | \ .--. / |
//  |  (    )  |
//  |_/ '--' \_|
//     ______   
//   _|      |_
//  |_|======|_|
//    |______|
//
SGE.SceneObjects.DetectorGate = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.__detectors = { "top": null, "bottom": null };
	this.__pipes     = { "top": null, "bottom": null };
	
	this.init = function() {
		var g, m, co, so, o, mco, t, dy;
		// Geometry container
		mco = new THREE.Object3D();
		
		// --------- Create detectors
		for (var k in this.__detectors) {
			so = new THREE.Group();
			co = new THREE.Object3D();
			
			if (k == "top")    dy =  1;
			if (k == "bottom") dy = -1;
			
			// Create sphere geometry and mesh
			g = new THREE.SphereGeometry(
				SGE.DETECTOR_RADIUS,
				SGE.MESH_SPHERE_SEGMENTS,
				SGE.MESH_SPHERE_SEGMENTS,
				0, SGE.TAU,
				SGE.TAU/2*(1-SGE.DETECTOR_OVERLAP_FACTOR1), SGE.TAU/2*(1 - 2*(1-SGE.DETECTOR_OVERLAP_FACTOR1))
			);
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
			o = new THREE.Mesh(g, m);
			o.rotation.z = SGE.TAU/4;
			co.add(o);
			SGE.Interface.Glow(o, [m]);
			this.parts.push(o);
			this[k+"Sphere"] = o;
			
			// ToDo: make it precise, remove magic numbers
			// Left cone
			o = new SGE.Primitives.Cone(
				SGE.DETECTOR_HOLE_RADIUS, SGE.SOURCE_CONE_RADIUS,
				SGE.DETECTOR_CONE_LENGTH+0.1, SGE.WALL_THICKNESS);
			o.position.x = SGE.DETECTOR_RADIUS + SGE.SOURCE_CONE_LENGTH/2*SGE.DETECTOR_OVERLAP_FACTOR2;
			o.rotation.z = SGE.TAU/4;
			o.rotation.y = SGE.TAU/2;
			co.add(o);
			this.parts.push(o);
			
			// Right cone
			o = new SGE.Primitives.Cone(
				SGE.DETECTOR_HOLE_RADIUS, SGE.SOURCE_CONE_RADIUS-SGE.WALL_THICKNESS,
				SGE.DETECTOR_CONE_LENGTH+0.1, SGE.WALL_THICKNESS);
			o.position.x = -(SGE.DETECTOR_RADIUS + SGE.SOURCE_CONE_LENGTH/2*SGE.DETECTOR_OVERLAP_FACTOR2);
			o.rotation.z = SGE.TAU/4;
			o.rotation.y = SGE.TAU;
			co.add(o);
			this.parts.push(o);
			
			co.rotation.y = SGE.TAU/2;
			co.position.y = dy;
			
			// Cone plug extensions
			o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
			o.rotation.z = -SGE.TAU/4;
			o.position.x = 1;
			co.add(o);
			this.parts.push(o);
			
			o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
			o.rotation.z = SGE.TAU/4;
			o.position.x = -1;
			co.add(o);
			this.parts.push(o);
			
			so.add(co);
			mco.add(so);
			
			this.__detectors[k] = so;
		}
		
		// --------- Create pipes
		for (var k in this.__pipes) {
			so = new THREE.Group();
			co = new THREE.Object3D();
			
			if (k == "top")    dy =  1;
			if (k == "bottom") dy = -1;
			
			// Reuse analyzer texture for the straight pipe section
			t = SGE.TextureLoader.get(SGE.asset('analyzer_interferometer.png'));
			m = SGE.DefaultMaterial({ color: SGE.BASE_COLOR });
			o = new SGE.Primitives.Box(1.5, 1, 1, t);
			
			o.numRegions = [4, 8];
			o.addMap("pipe", 3, 0, 1, 1, false, false); 
			o.front("pipe");
			o.back("pipe");
			o.top("pipe");
			o.bottom("pipe");
			co.add(o);
			this.parts.push(o);
			
			o = new SGE.Primitives.Plug(0.5-SGE.WALL_THICKNESS, 0.5, SGE.PLUG_LENGTH);
			o.rotation.z = SGE.TAU/4;
			o.position.x = -1;
			co.add(o);
			this.parts.push(o);
			
			o = new SGE.Primitives.Plug(0.5-2*SGE.WALL_THICKNESS, 0.5-SGE.WALL_THICKNESS, SGE.PLUG_LENGTH);
			o.rotation.z = -SGE.TAU/4;
			o.position.x = 1;
			co.add(o);
			this.parts.push(o);
			
			co.position.y = dy;
			
			so.add(co);
			mco.add(so);
			
			this.__pipes[k] = so;
		}
		
		// Main container
		this.object3d.add(mco);
		
		// Pipes by default
		this.topDetector.visible = false;
		this.bottomDetector.visible = false;
		
	}
	
	Object.defineProperty(this, 'topDetector', {
		get: function() { return this.__detectors['top']; }
	});
	Object.defineProperty(this, 'bottomDetector', {
		get: function() { return this.__detectors['bottom']; }
	});
	Object.defineProperty(this, 'topPipe', {
		get: function() { return this.__pipes['top']; }
	});
	Object.defineProperty(this, 'bottomPipe', {
		get: function() { return this.__pipes['bottom']; }
	});
	
	this.init();
}

// -------------------------------------------------------------------------------------------------
// Atom
SGE.SceneObjects.Atom = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	this.init = function() {
		var g, m, co, o;
		// Geometry container. This is scaled later so the source fits inside a 1x1x1 box
		co = new THREE.Object3D();
		
		// Create sphere geometry and mesh
		g = new THREE.SphereGeometry(
			SGE.ATOM_RADIUS,
			SGE.MESH_SPHERE_SEGMENTS,
			SGE.MESH_SPHERE_SEGMENTS
		);
		m = SGE.DefaultMaterial({ color: SGE.ATOM_COLOR });
		m.shininess = 120; // make it shinier
		this.sphereMaterial = m;
		o = new THREE.Mesh(g, m);
		co.add(o);
		SGE.Interface.Glow(o, [m]);
		this.parts.push(o);
		
		// Cones
		var cone = new THREE.Object3D(); 
		// North cone
		g = new THREE.CylinderGeometry(
			SGE.ATOM_CONE_LENGTH*Math.tan(SGE.ATOM_CONE_ANGLE/2),
			0,
			SGE.ATOM_CONE_LENGTH,
			SGE.MESH_ROUND_SEGMENTS,
			1,
			SGE.ATOM_CONE_OPEN
		);
		m = SGE.DefaultMaterial({ color: SGE.NORTH_COLOR, side: THREE.DoubleSide });
		o = new THREE.Mesh(g, m);
		o.position.y = SGE.ATOM_CONE_LENGTH/2;
		cone.add(o);
		
		// South cone
		g = new THREE.CylinderGeometry(
			0,
			SGE.ATOM_CONE_LENGTH*Math.tan(SGE.ATOM_CONE_ANGLE/2),
			SGE.ATOM_CONE_LENGTH,
			SGE.MESH_ROUND_SEGMENTS,
			1,
			SGE.ATOM_CONE_OPEN
		);
		m = SGE.DefaultMaterial({ color: SGE.SOUTH_COLOR, side: THREE.DoubleSide });
		o = new THREE.Mesh(g, m);
		o.position.y = -SGE.ATOM_CONE_LENGTH/2;
		cone.add(o);
		co.add(cone);
		
		this.object3d.add(co);
		this.cone = cone;
		
		this.__lastSpinAngle = [];
		this.__spinAngle = null;
		this.__revealState = false;
		
		this.__instructions = null;
		
	}
	
	this.clearSpinHistory = function() {
		this.__lastSpinAngle = [];
	}
	
	this.eraseSpin = function() {
		this.spin = this.__lastSpinAngle.pop();
	}
	
	// ---------------------------------------------------------------------------------------------
	
	// Atoms don't rotate
	Object.defineProperty(this, 'angle', {
		set: function(value) {
			SGE.error("Atoms do not rotate. Use Atom.spin instead.");
		},
		get: function() { return; }
	});
	
	Object.defineProperty(this, 'lastSpin', {
		get: function() { return this.__lastSpinAngle[this.__lastSpinAngle.length - 1]; }
	});
	
	Object.defineProperty(this, 'spin', {
		set: function(value) {
			this.__lastSpinAngle.push(this.__spinAngle);
			this.__spinAngle = value;
			if (value === null) {
				this.cone.rotation.x = 0;
				this.cone.visible = false;
				return;
			}
			this.cone.rotation.x = value;
			this.cone.visible = this.__revealState;
		},
		get: function() {
			return this.__spinAngle;
		}
	});
	
	Object.defineProperty(this, 'revealState', {
		set: function(value) {
			this.__revealState = value;
			this.cone.visible = value;
		},
		get: function() { return this.__revealState; }
	});
	
	Object.defineProperty(this, 'coneSize', {
		set: function(value) {
			
			// We also contract instructions if they exist already
			if (!(this.__instructions === null)) {
				this.__instructions.__contract = value;
			}
			
			if (value < 1e-3) {
				this.cone.visible = false;
				return;
			}
			if (this.__spinAngle === null) {
				this.cone.visible = false;
			} else {
				this.cone.visible = (this.__revealState >= 1e-3);
			}
			this.cone.scale.set(value, value, value);
		},
		get: function() { return this.cone.scale.x; }
	});
	
	// Instruction set
	Object.defineProperty(this, 'instructions', {
		get: function() {
			if (this.__instructions === null) {
				this.__instructions = new SGE.Primitives.InstructionSet();
				this.object3d.add(this.__instructions);
			}
			return this.__instructions;
		}
	});
	
	// Instruction set
	Object.defineProperty(this, 'hasInstructions', {
		get: function() {
			return !(this.__instructions === null);
		}
	});
	
	this.init();
}

// -------------------------------------------------------------------------------------------------
// Current loop
SGE.SceneObjects.CurrentLoop = function() {
	
	SGE.SceneObjects.BaseObject.call(this);
	
	// Frequencies (in Hz)
	// How fast the charge moves around the loop
	this.spinFrequency = SGE.LOOP_SPIN_FREQUENCY;
	// How fast the arrow spins around the spin axis
	this.precessionFrequency = SGE.LOOP_PRECESSION_FREQUENCY;
	this.precessionAxis = new THREE.Vector3(0,1,0);
	this.precessionAxis = new THREE.Vector3(0,1,0);
	this.__spinAngle = 0;
	this.__fieldAngle = 0;
	this.__fieldIntensity = 0;
	this.__chargeAngle = 0;
	
	this.init = function() {
		
		var g, m, co, o;
		var co = new THREE.Group();
		
		// Top half (north) of arrow shaft
		g = new THREE.CylinderGeometry(
			SGE.LOOP_ARROW_THICKNESS/2,
			SGE.LOOP_ARROW_THICKNESS/2,
			SGE.LOOP_ARROW_LENGTH/2-SGE.LOOP_ARROW_HEAD_LENGTH/2,
			SGE.MESH_ROUND_SEGMENTS,
			1,
			false
		);
		m = new THREE.MeshLambertMaterial({ color: SGE.NORTH_COLOR });
		o = new THREE.Mesh(g, m);
		o.position.y = (SGE.LOOP_ARROW_LENGTH/2-SGE.LOOP_ARROW_HEAD_LENGTH/2)/2;
		co.add(o);
		
		// Arrow head (north)
		g = new THREE.CylinderGeometry(
			0,
			SGE.LOOP_ARROW_HEAD_THICKNESS/2,
			SGE.LOOP_ARROW_HEAD_LENGTH,
			SGE.MESH_ROUND_SEGMENTS,
			1,
			false
		);
		m = new THREE.MeshLambertMaterial({ color: SGE.NORTH_COLOR });
		o = new THREE.Mesh(g, m);
		o.position.y = (SGE.LOOP_ARROW_LENGTH+2*SGE.LOOP_ARROW_HEAD_LENGTH)/4;
		co.add(o);
		
		// Bottom half (south) of arrow shaft
		g = new THREE.CylinderGeometry(
			SGE.LOOP_ARROW_THICKNESS/2,
			SGE.LOOP_ARROW_THICKNESS/2,
			SGE.LOOP_ARROW_LENGTH/2,
			SGE.MESH_ROUND_SEGMENTS,
			1,
			false
		);
		m = new THREE.MeshLambertMaterial({ color: SGE.SOUTH_COLOR });
		o = new THREE.Mesh(g, m);
		o.position.y = -SGE.LOOP_ARROW_LENGTH/4;
		co.add(o);
		this.arrow = co;
		
		
		if (!SGE.LOOP_USE_I_ARROW) {
			// Loop
			var g = new THREE.Geometry();
			var it = SGE.MESH_ROUND_SEGMENTS;
			for(var i = 0;i <= it; i++) {
				g.vertices.push(
					new THREE.Vector3(
						Math.cos(i/it*SGE.TAU)*SGE.LOOP_RADIUS,
						0,
						Math.sin(i/it*SGE.TAU)*SGE.LOOP_RADIUS
					)
				);
			}
			m = new THREE.LineBasicMaterial({ color: SGE.LOOP_COLOR });
			o = new THREE.Line(g, m);
			co.add(o);
			this.loop = co;
		
			// Spinning charge
			t = (function(){
				var c = document.createElement('canvas');
				var r = 16;
				c.width = r*2;
				c.height = r*2;
				var ctx = c.getContext("2d");
				ctx.clearRect(0,0,r*2,r*2);
				ctx.fillStyle = "rgba(255,255,255,1)";
				SGE.drawEllipse(ctx,r,r,r,r);
				var tex = new THREE.Texture(c);
				tex.needsUpdate = true;
				return tex;
			})();
			m = new THREE.SpriteMaterial({ color: SGE.LOOP_CHARGE_COLOR, map: t });
			o = new THREE.Sprite(m);
			o.scale.set(
				SGE.LOOP_CHARGE_RADIUS*2,
				SGE.LOOP_CHARGE_RADIUS*2,
				SGE.LOOP_CHARGE_RADIUS*2
			);
			co.add(o);
			this.charge = o;
		} else {
			// Curved arrow
			this.curvedArrow = (function(){
				var r1 = SGE.LOOP_I_ARROW_RADIUS;
				var r2 = _r2;
				var _r2 = SGE.LOOP_I_ARROW_TUBE_RADIUS;
				var _r3 = SGE.LOOP_I_ARROW_HEAD_RADIUS;
				var _max = SGE.LOOP_I_ARROW_MAX_ANGLE;
				var _head = SGE.LOOP_I_ARROW_HEAD_ANGLE;
				var nt = SGE.LOOP_I_ARROW_TUBE_DETAIL;
				var nf = SGE.LOOP_I_ARROW_CURVE_DETAIL;
				var g = new THREE.TorusGeometry( r1, r2, nt, nf );
				var m = new THREE.MeshBasicMaterial({ color: SGE.LOOP_I_ARROW_COLOR });
				// We create a torus and modify its vertices
				var torus = new THREE.Mesh(g, m);
				var vs = g.vertices;
				var i, af, at, s;
				for(var t = 0; t <= nt; t++) {
					for(var f = 0; f <= nf; f++) {
						at = t/nt*SGE.TAU; // angle around circle
						
						// First, we modify the 
						// Rings of vertices are stretched around the circle ignoring last two
						if (f <= (nf-2)) {
							af = f/(nf-2) * (_max - _head);
						}
						// We place the vertices for the last ring on top of the previous ring
						if (f == (nf-1)) {
							af = (_max - _head);
						}
						// Final ring of vertices is placed at the end of the arrow
						if (f == nf) {
							af = _max;
						}
						
						// Now we modify the radius of these rings of vertices
						if (f == (nf-1)) { // ring before the last is the edge of the arrow head
							r2 = _r3;
						} else if (f == nf) { // last ring collapses into a point, the arrow tip
							r2 = 0;
						} else { // everything else is the tube radius, linearly scaled
							r2 = _r2 * (f/(nf-2));
						}
						
						i = t*(nf+1) + f; // index of the vertice
						vs[i].x = (r1 + r2*Math.cos(at))*Math.cos(af);
						vs[i].y = (r1 + r2*Math.cos(at))*Math.sin(af);
						vs[i].z = r2*Math.sin(at);
					}
				}
				g.verticesNeedUpdate = true;
				torus.rotation.x = -SGE.TAU/4; // rotate it so it's horizontal
				return torus;
			})();
			
			co.add(this.curvedArrow);
		}
		
		this.arrowAndLoop = co;
		this.object3d.add(co);
		
		// Field axis
		var g = new THREE.Geometry();
		g.vertices.push(
			new THREE.Vector3(0,SGE.LOOP_FIELD_AXIS_SIZE/2,0),
			new THREE.Vector3(0,-SGE.LOOP_FIELD_AXIS_SIZE/2,0)
		);
		m = new THREE.LineBasicMaterial({ color: SGE.LOOP_FIELD_AXIS_COLOR });
		m.transparent = true;
		o = new THREE.Line(g, m);
		o.visible = false;
		this.group.add(o);
		this.fieldAxisMaterial = m;
		this.fieldAxis = o;
		
		// Cones
		var cone = new THREE.Object3D(); 
		this.coneData = {};
		// North cone
		g = new THREE.CircleGeometry(
			1,
			SGE.MESH_ROUND_SEGMENTS
		);
		m = new THREE.MeshBasicMaterial({ color: SGE.NORTH_COLOR, side: THREE.DoubleSide });
		m.transparent = true;
		m.opacity = 1;
		o = new THREE.Mesh(g, m);
		o.rotation.x = SGE.TAU/4;
		cone.add(o);
		this.coneData.north = { geometry: g, material: m };
		
		// South cone
		g = new THREE.CircleGeometry(
			1,
			SGE.MESH_ROUND_SEGMENTS
		);
		m = new THREE.MeshBasicMaterial({ color: SGE.SOUTH_COLOR, side: THREE.DoubleSide });
		m.transparent = true;
		m.opacity = 1;
		o = new THREE.Mesh(g, m);
		o.rotation.x = SGE.TAU/4;
		cone.add(o);
		this.coneData.south = { geometry: g, material: m };
		
		this.cone = cone;
		this.group.add(cone);
		
		this.updateCones();
		
		// Reset animation state
		this.animate(0, 0);
	}
	
	this.resetAnimation = function() {
		this.arrowAndLoop.rotation.set(0,0,0);
		this.__chargeAngle = 0;
	}
	
	// Animate based on time t (in milliseconds)
	this.animate = function(t, delta) {
		// We subtract precession frequency to compensate for the rotation of the arrow
		// which also carries the loop itself around
		var a = this.__fieldAngle - this.spin;
		
		var w1 = SGE.TAU*this.precessionFrequency*this.__fieldIntensity;
		this.precessionAxis.y = Math.cos(a);
		this.precessionAxis.z = Math.sin(a);
		this.arrowAndLoop.rotateOnAxis(this.precessionAxis, w1*delta);
		
		var w2 = SGE.TAU*this.spinFrequency;
		this.__chargeAngle += delta*(w2 - Math.cos(a)*w1); // compensate for precession
		if (this.charge) {
			this.charge.position.x = SGE.LOOP_RADIUS*Math.cos(this.__chargeAngle)*this.__loopSize;
			this.charge.position.z = -SGE.LOOP_RADIUS*Math.sin(this.__chargeAngle)*this.__loopSize;
		}
		if (this.curvedArrow) {
			this.curvedArrow.rotation.z = this.__chargeAngle;
		}
	}
	
	this.updateCones = function() {
		var vs, it
		var r = SGE.LOOP_ARROW_LENGTH/2 * Math.sin(this.__fieldAngle - this.spin);
		var h = SGE.LOOP_ARROW_LENGTH/2 * Math.cos(this.__fieldAngle - this.spin);
		for (var c in this.coneData) {
			vs = this.coneData[c].geometry.vertices;
			it = vs.length - 2;
			for(var i = 0;i <= it;i++) {
				vs[i+1].x = r*Math.cos(i/it*SGE.TAU);
				vs[i+1].y = r*Math.sin(i/it*SGE.TAU);
				vs[i+1].z = (c == "north" ? -h : +h);
			}
			this.coneData[c].geometry.verticesNeedUpdate = true;
		}
	}
	
	// Loop size
	this.__loopSize = 1;
	Object.defineProperty(this, 'loopSize', {
		set: function(value) {
			this.__loopSize = value;
			if (value > 1e-3) {
				if (value > 1) value = 1;
				this.arrowAndLoop.scale.set(value, value, value);
				if (this.charge) {
					var s = value*SGE.LOOP_CHARGE_RADIUS*2;
					this.charge.scale.set(s, s, s);
					this.charge.visible = true;
				}
				if (this.curvedArrow) {
					this.curvedArrow.scale.set(value, value, value);
					this.curvedArrow.visible = true;
				}
				this.arrowAndLoop.visible = true;
			} else {
				this.arrowAndLoop.visible = false;
				if (this.charge) this.charge.visible = false;
				if (this.curvedArrow) this.curvedArrow.visible = false;
			}
		},
		get: function() { return this.__loopSize; }
	});
	
	// Current loops don't rotate
	Object.defineProperty(this, 'angle', {
		set: function(value) {
			SGE.error("Current loops do not rotate. Use CurrentLoop.spin instead.");
		},
		get: function() { return; }
	});
	
	Object.defineProperty(this, 'spin', {
		set: function(value) {
			this.__spinAngle = value;
			this.object3d.rotation.x = value;
		},
		get: function() {
			return this.__spinAngle;
		}
	});
	
	Object.defineProperty(this, 'fieldAngle', {
		set: function(value) {
			this.__fieldAngle = value;
			this.fieldAxis.rotation.x = value;
			this.cone.rotation.x = value;
			this.updateCones();
		},
		get: function() {
			return this.__fieldAngle;
		}
	});
	
	Object.defineProperty(this, 'fieldIntensity', {
		set: function(value) {
			this.__fieldIntensity = value;
			if (value <= 0) {
				this.fieldAxis.visible = false;
				this.fieldAxisMaterial.opacity = 0;
				this.cone.visible = false;
				this.coneData.north.material.opacity = 0;
				this.coneData.south.material.opacity = 0;
			} else {
				this.fieldAxis.visible = true;
				this.cone.visible = true;
				this.fieldAxisMaterial.opacity = value*SGE.LOOP_FIELD_AXIS_OPACITY;
				var o = value*SGE.LOOP_FIELD_CONE_OPACITY;
				this.coneData.north.material.opacity = o;
				this.coneData.south.material.opacity = o;
			}
		},
		get: function() {
			return this.__fieldIntensity;
		}
	});
	
	this.init();
}





// #################################################################################################
// Experiment
// An experiment is a collection of objects aligned with each other
// At the origin of the experiment there's a source of atoms
// The source is aligned along the x direction, so atoms are shot to the +x or -x direction
// An entangled source can shoot two atoms at once, with opposite spins
// As such, an experiment has two available branches: left or right.
// To setup an experiment, create an Experiment object and add to a Viewport3D instance
// Experiment.source will reference the source for that experiment. Use it to setup the source type
// Use source.attach(obj, side) to attach another object, with side as either "left" or "right"
SGE.Experiment = function() { this.uid = SGE.getUID();
	this.__CLASS = "Experiment";
	
	this.attachedTo = null;
	this.detachedObjects = {}; // ExperimentObjects
	this.children = {}; // ExperimentObjects
	this.__group = null;
	this.__source = null;
	this.__ignoreR = null;
	this.__ignoreL = null;
	this.__runID = null;
	this.__triggerPoints = null;
	this.__isClassical = false;
	this.atoms = null;
	this.atomSpeed = 1;
	this.isPaused = false;
	this.isRunning = false;
	this.waitAfterEnd = false;
	this.events = new SGE.EventDispatcher(this);
	this.__viewports = {};
	
	this.init = function() {
		this.__source = null;
		
		// General container for the experiment
		this.__group = new THREE.Group();
		this.__source = new SGE.Source();
		this.__ignoreR = new SGE.Ignore();
		this.__ignoreL = new SGE.Ignore();
		
		// Always start with  source
		this.__source.experiment = this;
		this.add(this.__source);
		this.__source.detach();
		
		// Simulated atoms
		// Two atoms in case of an entangled source
		this.__atoms = [];
		this.__atoms.push(new SGE.Atom());
		this.__atoms.push(new SGE.Atom());
		this.__atoms.push(new SGE.CurrentLoop());
		
		this.atomR.direction = SGE.RIGHT;
		this.atomL.direction = SGE.LEFT;
		this.loop.direction = SGE.RIGHT;
		
		// Atom speed in units per second
		this.atomSpeed = 1;
		this.isRunning = false;
		this.isPaused = false;
		this.isClassical = false;
		
		// Trigger points
		this.clearTriggers();
		
		// Default events
		var self = this;
		this.events.__on(SGE.EVENT_BEGIN_EXPERIMENT, function(){ self.__updateViewports(); });
		this.events.__on(SGE.EVENT_END_EXPERIMENT, function(){ self.__updateViewports(); });
		this.events.__on(SGE.EVENT_PAUSE_EXPERIMENT, function(){ self.__updateViewports(); });
		this.events.__on(SGE.EVENT_RESUME_EXPERIMENT, function(){ self.__updateViewports(); });
		
		// Min and max X positions of objects in the experiment
		// This is so we know how wide it is along the x-axis
		this.size = { min: 0, max: 0};
	}
	
	// Read-only source reference
	Object.defineProperty(this, 'source', {
		get: function() {
			return this.__source;
		}
	});
	
	// Read-only atom reference
	Object.defineProperty(this, 'atomR', {
		get: function() {
			return this.__atoms[0];
		}
	});
	Object.defineProperty(this, 'atomL', {
		get: function() {
			return this.__atoms[1];
		}
	});
	Object.defineProperty(this, 'loop', {
		get: function() {
			return this.__atoms[2];
		}
	});
	
	Object.defineProperty(this, 'isClassical', {
		set: function(value) {
			this.__isClassical = value;
		},
		get: function() {
			return this.__isClassical;
		}
	});
	
	Object.defineProperty(this, 'ignoreSilently', {
		set: function(value) {
			this.__ignoreR.silent = value;
			this.__ignoreL.silent = value;
		},
		get: function() {
			return this.__ignoreR.silent;
			return this.__ignoreL.silent;
		}
	});
	
	// Whether or not show cones for state of atoms
	// This is not always physically accurate or desirable, use with pedagogical intent only
	Object.defineProperty(this, 'revealStates', {
		set: function(value) {
			this.atomR.revealState = value;
			this.atomL.revealState = value;
		}
	});
	
	this.add = function(obj) {
		if (obj.__CLASS == "ExperimentObject") {
			// If object was in some other experiment, remove first
			if (obj.experiment) obj.experiment.remove(obj);
			this.__group.add(obj.sceneObject.group);
			if (!(obj instanceof SGE.Ignore)) {
				this.children[obj.uid] = obj;
			}
			obj.experiment = this;
			return;
		}
		
		// If we're adding a plain Three.js object (or some of the SGE primitives)
		// we add directly
		if (obj instanceof THREE.Object3D) {
			if (obj.parent) obj.parent.remove(obj); // remove from whatever it is already
			this.__group.add(obj); // add to this experiment
		}
	}
	this.remove = function(obj) {
		if (obj.__CLASS == "ExperimentObject") {
			this.__group.remove(obj.sceneObject.group);
			delete this.children[obj.uid];
			delete this.detachedObjects[obj.uid];
			obj.experiment = null;
			return;
		}
		
		if (obj instanceof THREE.Object3D) {
			this.childrenObjects(obj.uuid);
			if (obj.parent == this.__group) this.__group.remove(obj);
		}
	}
	
	this.needsUpdate = false;
	this.updatePositions = function() {
		if (!this.needsUpdate) return;
		// We begin at the "root" objects, which are not attached to anything (e.g., the source)
		for(var i in this.detachedObjects) {
			this.detachedObjects[i].updateAttachments();
		}
		this.needsUpdate = false;
	}
	
	// Offset experiment in the x direction to center it
	this.center = function() {
		this.updatePositions();
		this.position.x = -(this.size['max']+this.size['min'])/2;
	}
	
	Object.defineProperty(this, 'position', {
		get: function() { return this.__group.position; }
	});
	
	// Run the experiment once
	// Begin association with objects and initialize simulation code
	this.run = function() {
		if (this.isRunning) return; // Prevent running twice
		
		// If an experiment run just ended, we always wait for the next frame before we run again
		// This makes sure the experiment ends and cleans up properly between two runs
		if (this.waitAfterEnd) {
			// To do this, we add again the callback to the animate() function in the experiment
			SGE.AnimationManager.add(this);
			// And we wait for it to run (now go to animate(), below)
			return;
		}
		
		// If not, we just start things normally
		SGE.AnimationManager.add(this);
		this.isRunning = true;
		this.isPaused = false;
		
		this.__runID = SGE.getUID(); // in case we need to label the current run
		
		// Remove atoms from experiment
		this.remove(this.atomR);
		this.remove(this.atomL);
		this.remove(this.loop);
		SGE.AnimationManager.remove(this.loop);
		
		// Clear entanglement
		this.atomR.entangledWith = null;
		this.atomL.entangledWith = null;
		
		// Initialize atoms again
		// Set their states and positions
		switch (this.source.sourceType) {
			case SGE.SOURCE_TYPE_NORMAL: // atom with undefined state
			case SGE.SOURCE_TYPE_SPINUP: // spin up atom (relative to source orientation)
			default:
				this.atomR.detected = false;
				this.atomR.spin = null;
				this.atomR.clearSpinHistory();
				
				if (this.source.sourceType == SGE.SOURCE_TYPE_SPINUP || this.source.forceSpinUp) {
					this.atomR.spin = this.source.angle;
				}
				
				this.atomR.position.set(
					this.source.__position.x,
					this.source.__position.y,
					this.source.__position.z
				);
				this.add(this.atomR);
				
				this.atomR.comingFrom = {
					object: this.source,
					output: SGE.IO_RIGHT
				}
				
				if (isUndefined(this.source.attachments[SGE.IO_RIGHT])) {
					this.ignoreAt(this.source, SGE.IO_RIGHT);
				}
				
				this.atomR.goingTo = {
					object: this.source.attachments[SGE.IO_RIGHT],
					input: SGE.IO_DEFAULT
				}
				
				this.source.events.trigger(SGE.EVENT_RELEASE_PARTICLE, { particle: this.atomR });
				
				break;
			case SGE.SOURCE_TYPE_CURRENT_LOOP: // current loop
				this.loop.detected = false;
				this.loop.spin = this.source.angle;
				this.loop.fieldAngle = 0;
				this.loop.fieldIntensity = 0;
				this.loop.resetAnimation();
				
				this.loop.position.set(
					this.source.__position.x,
					this.source.__position.y,
					this.source.__position.z
				)
				this.add(this.loop);
				SGE.AnimationManager.add(this.loop);
				
				this.loop.comingFrom = {
					object: this.source,
					output: SGE.IO_RIGHT
				}
				
				if (isUndefined(this.source.attachments[SGE.IO_RIGHT])) {
					this.ignoreAt(this.source, SGE.IO_RIGHT);
				}
				
				this.loop.goingTo = {
					object: this.source.attachments[SGE.IO_RIGHT],
					input: SGE.IO_DEFAULT
				}
				
				this.source.events.trigger(SGE.EVENT_RELEASE_PARTICLE, { particle: this.loop });
				
				break;
			case SGE.SOURCE_TYPE_ENTANGLED: // entangled atom pair
				this.atomR.detected = false;
				this.atomL.detected = false;
				this.atomR.spin = null;
				this.atomL.spin = null;
				this.atomR.clearSpinHistory();
				this.atomL.clearSpinHistory();
				this.atomR.entangledWith = this.atomL;
				this.atomL.entangledWith = this.atomR;
				
				this.atomR.position.set(
					this.source.__position.x,
					this.source.__position.y,
					this.source.__position.z
				);
				this.atomL.position.set(
					this.source.__position.x,
					this.source.__position.y,
					this.source.__position.z
				);
				this.add(this.atomR);
				this.add(this.atomL);
				
				this.atomR.comingFrom = {
					object: this.source,
					output: SGE.IO_RIGHT
				}
				this.atomL.comingFrom = {
					object: this.source,
					output: SGE.IO_LEFT
				}
				
				if (isUndefined(this.source.attachments[SGE.IO_RIGHT])) {
					this.ignoreAt(this.source, SGE.IO_RIGHT);
				}
				if (isUndefined(this.source.attachments[SGE.IO_LEFT])) {
					this.ignoreAt(this.source, SGE.IO_LEFT);
				}
				
				this.atomR.goingTo = {
					object: this.source.attachments[SGE.IO_RIGHT],
					input: SGE.IO_DEFAULT
				}
				this.atomL.goingTo = {
					object: this.source.attachments[SGE.IO_LEFT],
					input: SGE.IO_DEFAULT
				}
				
				this.source.events.trigger(SGE.EVENT_RELEASE_PARTICLE, { particle: [this.atomR, this.atomL] });
				break;
		}
		
		// Clear history of experiment run
		delete this.__history;
		this.__history = {};
		for(var i in this.__atoms) {
			this.__history[this.__atoms[i].uid] = {};
			this.__history[this.__atoms[i].uid].interacted = {};
			this.__history[this.__atoms[i].uid].dist = 0;
		}
		
		this.events.trigger(SGE.EVENT_BEGIN_EXPERIMENT);
	}
	
	this.end = function(particle) {
		if (!this.isRunning) return;
		
		var allDone = true; // assume experiment is over
		for(var ai in this.__atoms) { // step through all particles
			if (this.__atoms[ai] == particle) { // if this particle is trying to end the experiment
				this.remove(particle); // remove it from the experiment
			}
			// in either case, check if the particle is in the experiment
			// if any is found to still be in the experiment, we keep going
			if (this.__atoms[ai].experiment) allDone = false;
		}
		
		// If no particle is specified, this is a forced end
		if (isUndefined(particle)) allDone = true;
		
		// if there's still stuff to do, we're not done yet and we stop here
		if (!allDone) return;
		// otherwise we clean everything up
		
		// Only do this if all atoms have been accounted for
		this.isRunning = false;
		SGE.AnimationManager.remove(this);
		
		this.__ignoreR.detach(); // make sure to get rid of the ignore target
		this.__ignoreL.detach(); // make sure to get rid of the ignore target
		
		// Make sure we remove all atoms from experiment anyway
		this.remove(this.atomR);
		this.remove(this.atomL);
		this.remove(this.loop);
		
		// Mark to wait at least 1 frame after ending
		// This is so calling run() on the same frame/event doesn't prevent a proper ending
		this.waitAfterEnd = true;
		this.events.trigger(SGE.EVENT_END_EXPERIMENT);
	}
	
	this.pause = function() {
		if (!this.isRunning) return;
		this.isPaused = true;
		this.events.trigger(SGE.EVENT_PAUSE_EXPERIMENT);
		SGE.AnimationManager.remove(this);
	}
	
	this.resume = function() {
		if (!this.isRunning) return;
		this.isPaused = false;
		this.events.trigger(SGE.EVENT_RESUME_EXPERIMENT);
		SGE.AnimationManager.add(this);
	}
	
	// History of data between frames, so we know the last state of simulation and such
	// ToDo: test this more carefully? Passed all tests so far
	// ToDo: verify why it becomes 4-5x slower in some cases
	this.__history = null;
	this.animate = function(t, delta) {
		// If the experiment ends, this isn't called again in the same frame
		// However, if the experiment ends and in the same frame (say, on an event trigger) the
		// experiment is told to run again, this will cause issues
		// To prevent this, we always make the experiment wait for the next frame by calling
		// animate() once more
		// So, in this case, the experiment just ended, and we're calling animate()
		// See run() method above
		if (this.waitAfterEnd) {
			// This means we want to run it again
			// We remove the animation callback, it'll be added again when we execute run()
			SGE.AnimationManager.remove(this);
			// We remove the waitAfterEnd flag
			this.waitAfterEnd = false;
			// We run the experiment
			this.run();
			// And let the next frame take care of it
			return;
		}
		
		// If the experiment isn't running, there's no need to do anything else
		if (!this.isRunning) return;
		
		var H;
		var ai, a, d, dm, sd, l, cf, gt, fromDist, toDist, dist, cs, pos, tpts, tp;
		var sd = SGE.ATOM_CONE_SHRINK_DISTANCE;
		var stepping, totalStep, step, nextStep;
		
		// Trigger points as sorted array, shorthand
		tpts = this.__triggerPoints.__list;
		
		// For each atom/current loop
		for(ai in this.__atoms) {
			a = this.__atoms[ai]; // shorthand
			if (!a.experiment) continue; // if not in the experiment, skip
			
			H = this.__history[a.uid]; // shorthand for this particle's history
			
			dm = (a.direction == SGE.RIGHT ? +1 : -1); // travel direction
			
			dist = a.position.x; // Current position
			totalStep = this.atomSpeed*delta; // How much particle needs to move in total
			
			cs = 1; // Cone/loop scale. Full-size by default
			
			// We'll now run a loop that will make sure a fast atom (large value for totalStep)
			// doesn't pass through objects without interacting with them. To do this, we repeatedly
			// make the atom jump to important points in the simulation, and remove the jump length
			// from the total distance it needs to travel (totalStep).
			// When the next jump (nextStep) is larger than whatever distance is left (totalStep),
			// we move the atom by the remaining distance.
			stepping = true; // we are performing the above algorithm
			while (stepping) {
				if (a.detected) break; // if atom was detected, we stop this here
				// Aliases for shorthand
				cf = a.comingFrom.object;
				gt = a.goingTo.object;
				
				// First, we look ahead and see what important positions (that trigger events)
				// the particle will need to cover immediately next. Everything else is irrelevant.
				// Since at any point the particle has a comingFrom and goingTo object referenced,
				// which changes whenever the particle reaches the center of an object, we only need
				// to check 5 locations: leaving current object, some trigger point between the
				// current object and the next, entering next object, interacting with next object
				// and leaving next object (in case there's no other in front).
				// We want to find which one of these is next, that is, nearer to the current
				// position. This means we check them in reverse order and see which is closer.
				// The conditions fail for any point already behind the current position.
				
				// First, we assume we can go the entire distance in one step 
				nextStep = totalStep;
				
				// In order of closeness/priority, we verify each key point
				// If it's closer than the current step, we use it
				// For this part, the variable "step" is just for simplifying the ifs
				
				// leaving goingTo
				if (dist*dm < (gt.__position.x*dm + gt.length/2)) {
					step = (gt.__position.x*dm + gt.length/2) - dist*dm;
					if (step >= 0 && step < nextStep) nextStep = step;
				}
				
				// interacting with goingTo
				if (dist*dm < gt.__position.x*dm) {
					step = gt.__position.x*dm - dist*dm;
					if (step >= 0 && step < nextStep) nextStep = step;
				}
				
				// entering goingTo
				if (dist*dm < (gt.__position.x*dm - gt.length/2)) {
					step = (gt.__position.x*dm - gt.length/2)- dist*dm;
					if (step >= 0 && step < nextStep) nextStep = step;
				}
				
				// leaving comingFrom
				if (dist*dm < (cf.__position.x*dm + cf.length/2)) {
					step = (cf.__position.x*dm + cf.length/2) - dist*dm;
					if (step >= 0 && step < nextStep) nextStep = step;
				}
				
				if (tpts.length) {
					tp = -1; // unmark next trigger point
					for(var i = 0; i < tpts.length; i++) {
						if (dist*dm < tpts[i]) {
							step = tpts[i] - dist*dm;
							tp = i; // mark active trigger point for future reference
							break; // break on the closest trigger found
						}
					}
					if (step >= 0 && step < nextStep) nextStep = step;
				}
				
				// Now, the variable nextStep gives us how much we need to move to reach the next
				// important point.
				
				// If the next step is closer than the total amount we need to move, we
				// go to the next important location. Otherwise, we ran out of distance we
				// can move, and the loop must end after we're done with this
				if (nextStep < totalStep) {
					step = nextStep;
				} else {
					step = totalStep;
					stepping = false;
				}
				
				// We increase the total distance the atom has moved along the x direction
				dist += step*dm;
				// And reduce how much it is left to move by the same amount
				totalStep -= step;
				
				// Now, the simulation does the actual interactions
				
				// Distances to the center of comingFrom/goingTo objects
				// Since experiment is running, we use the internal __position getter
				fromDist = dist*dm - cf.__position.x*dm;
				toDist = dist*dm - gt.__position.x*dm;
				
				// The order of the following [INTERACTION] blocks guarantees that events are fired
				// following a logical order:
				// enter -> moveInside -> interact -> moveInside -> leave
				// (In practice, we also always have a moveInside before interaction)
				// Trigger points are assumed to have maximum priority and do not affect
				// simulation, so trigger events must be used carefully.
				
				
				// [INTERACTION] trigger point
				// In this case, we just need to check the distance to the next one
				if (tpts.length && tp >= 0) { // if any trigger points exist and one was marked
					d = tpts[tp];
					if (H.dist*dm < d && dist*dm >= d) {
						// Trigger for experiment
						this.events.trigger(SGE.EVENT_TRIGGER_POINT,{
							particle: a,
							distance: d,
							direction: dm,
							trigger: this.__triggerPoints.__names[d]
						});
						// Note: We do not verify if trigger points are inside/outside objects
						// For very fast simulations, a trigger point outside an object
						// may result in an invisible cone, because the sizes are updated
						// as it passes through objects
						// For these cases, a manual experiment.revealStates = true, to force
						// a cone size on the trigger event callback, is more appropriate.
					}
				}
				
				// [INTERACTION] comingFrom object
				d = Math.abs(fromDist); // absolute distance
				l = cf.length/2; // length of the object
				if (d <= l) { // if inside comingFrom object
					// Trigger moveInside event
					cf.events.trigger(SGE.EVENT_MOVE_INSIDE, {
						particle: a,
						distance: fromDist
					});
					cs = 0; // hide cone
				} else { // if outside
					if (d <= (l + sd)) { // is it within the shrink distance
						cs = (d - l)/sd; // shrink accordingly
					} 
				}
				
				// [INTERACTION] If particle was inside, but now it's outside, the particle left
				if (H.fromDist <= (cf.length/2) && fromDist > (cf.length/2)) {
					cf.events.trigger(SGE.EVENT_LEAVE, {
						particle: a,
						distance: a.comingFrom.input
					});
				}
				// [INTERACTION] Same as above, but for the case where there's nowhere else to go
				// In this case, the event triggers in the goingTo object
				// So far, this is only for the SGE.SternGerlach object
				if (H.toDist <= (gt.length/2) && toDist > (gt.length/2)) {
					gt.events.trigger(SGE.EVENT_LEAVE, {
						particle: a,
						distance: a.goingTo.input
					});
				}
				
				// [INTERACTION] If particle was outside, but now it's inside, the particle entered
				if (H.toDist < -(gt.length/2) && toDist >= -(gt.length/2)) {
					gt.events.trigger(SGE.EVENT_ENTER, {
						particle: a,
						distance: a.goingTo.output
					});
				}
				
				// [INTERACTION] goingTo object
				if (!(gt instanceof SGE.Ignore)) { // doesn't apply to SGE.Ignore object
					d = Math.abs(toDist); // we look ahead into the goingTo object distance
					l = gt.length/2;
					if (d <= l) { // if inside the goingTo object
						// Trigger moveInside event
						gt.events.trigger(SGE.EVENT_MOVE_INSIDE, {
							particle: a,
							distance: toDist 
						});
						cs = 0; // hide cone
						// Don't shrink inside SternGerlach objects
						if (gt instanceof SGE.SternGerlach) cs = 1;
					} else { // if outside
						if (d <= (l + sd)) { // if entering the goingTo object
							cs = (d - l)/sd; // shrink as it enters
							// Don't shrink inside SternGerlach objects
							if (gt instanceof SGE.SternGerlach) cs = 1;
						}
					}
					
					
				}
				
				// [INTERACTION] As soon as we cross over the center of the object, we interact
				if (H.toDist < 0 && toDist >= 0) {
					if (!(gt.uid in H.interacted)) {
						gt.interact(
							a, a.comingFrom, a.goingTo
						);
					}
				}
				
				// Update history of movement
				H.fromDist = fromDist;
				H.toDist = toDist;
				H.dist = dist;
				
				// If something paused/ended the experiment, we halt all movement
				if (this.isPaused) stepping = false;
			
				// Mark atom as detected if it's far.
				// Safeguard.
				if (Math.abs(dist) > SGE.TOO_FAR) a.detected = true;
			
			} // end of stepping
		
			// So far, the simulation is just abstract
			// This is when we actually update the geometry
			
			// Actually update atom position for rendering
			a.position.x = dist;
			
			// Apply cone size
			if (a instanceof SGE.Atom) a.coneSize = SGE.ease(cs);
			if (a instanceof SGE.CurrentLoop) a.loopSize = SGE.ease(cs);
		
		} // end particle movements
		
		
	}
	
	// Places an ignore target at some position
	// This is so we can automatically ignore atoms that are going nowhere
	this.ignoreAt = function(obj, output) {
		// SGE.log("Ignore at "+obj.__SUBCLASS+"'s "+output);
		var ignore;
		
		if (obj instanceof SGE.Source) {
			ignore = ( output == SGE.IO_RIGHT ? this.__ignoreR : this.__ignoreL );
		} else {
			ignore = ( obj.direction == SGE.RIGHT ? this.__ignoreR : this.__ignoreL );
		}
		
		ignore.detach();
		var s = SGE.SPACING_FOR_IGNORE;
		// Ignore spacing is increased to match whatever else is attached, otherwise it looks weird
		for(var i in obj.attachments) {
			if (obj.attachments[i].spacing > s) s = obj.attachments[i].spacing;
		}
		ignore.spacing = s;
		obj.attach(ignore, output);
	}
	
	this.__updateViewports = function() {
		for (var i in this.__viewports) {
			this.__viewports[i].__updateStatus();
		}
	}
	
	// Add trigger point
	// A trigger point fires SGE.EVENT_TRIGGER_POINT when particles have moved a certain distance
	// The experiment fires the event for all particles that passed the point.
	// If more than one particle, the event fires more than once. Use caution!
	// This is because one particle may be detected earlier than the other, so we handle
	// such things in a case-by-case basis.
	// The triggered event data object passes the distance and the particle
	// Handling the specific triggers (different distances) is done manually, otherwise we'd
	// introduce a different system for event triggering/management, and that wouldn't be good idea
	// This is because events are parameter-less. There's no way to something like
	// experiment.events.on(SGE.EVENT_TRIGGER_POINT_AT_DISTANCE_5,...)
	// It's possible to come up with a system, but I figured it's best to keep the same event
	// system in place as it is and not complicate things
	// Trigger points are really only useful in a couple experiments anyway, not a big deal
	this.addTrigger = function(dist, name) {
		if (isUndefined(name)) name = "";
		this.__triggerPoints.__names[dist] = name;
		this.__triggerPoints.__points[dist] = Math.abs(dist);
		this.__triggerPoints.__list = Object.values(this.__triggerPoints.__points);
		this.__triggerPoints.__list.sort(); // Make sure it's sorted
	}
	this.removeTrigger = function(dist) {
		if (dist in this.__triggerPoints.__points) {
			delete this.__triggerPoints.__points[dist];
			delete this.__triggerPoints.__names[dist];
		}
		this.__triggerPoints.__list = Object.values(this.__triggerPoints.__points);
		this.__triggerPoints.__list.sort(); // Make sure it's sorted
	}
	this.clearTriggers = function() {
		this.__triggerPoints = {
			__list: [],
			__points: {},
			__names: {}
		};
	}
	
	this.init();
}

// #################################################################################################
// EXPERIMENT OBJECTS
// These are the abstract entities in the simulation, which hold the properties and methods
// we manipulate during the simulation
// Each has a sceneObject property which actually specifies the 3D geometry used inside the
// 3D scene
// THESE are what are instanced and used in an experiment. SceneObjects are internal.

// General abstract class for objects used inside the experiment (Sources, Analyzers, etc.)
// Contains the general methods (chaining and experiment tree handling), as well as spacing
SGE.ExperimentObject = function() { this.uid = SGE.getUID();
	this.__CLASS = "ExperimentObject";
	this.__SUBCLASS = "";
	
	this.sceneObject = null;
	this.experiment = null;
	this.attachments = {};
	this.attachedTo = null;
	this.attachable = true;
	this.mouseOver = false;
	this.cursor = "default";
	this.__angleMeter = null;
	
	this.events = new SGE.EventDispatcher(this);
	
	this.__init = function() {
		this.sceneObject.object3d.userData = {
			experimentObject: this
		};
	}
	
	// Object dimensions and spacing definitions
	// These are similar to the CSS box model: length, padding and margins
	// (previous object)[spacing][marginL][paddingL][length][paddingR][marginR]
	// By default, objects are oriented to the right. When attached to a source on the left,
	// they are flipped. These definitions are automatically inverted for these cases.
	
	// Length of the main body of the object
	// This is the length of the "inside" region of the object
	// Plugs and other appendages are accounted for with padding or margins
	this.length = 0;
	
	// Padding on the sides. This is for extra elements like the conical plugs of 
	// source and detectors, objects that "get in the way"
	// Plugs, which get inside one another, are specified with margins below
	this.paddingLeft = 0;
	this.paddingRight = 0;
	
	// Margins
	// All margins collapse, so only the largest margin between two objects is used
	// This is used for plugs getting inside each other, connecting.
	this.marginLeft = 0;
	this.marginRight = 0;
	
	// Spacing relative to the previous element this is attached to
	this.__spacing = 0;
	
	// Dictionary of output/input names and offsets
	this.outputs = {};
	this.inputs = {};
	
	Object.defineProperty(this, 'interactive', {
		get: function() {
			var evs = [
				SGE.EVENT_MOUSE_OVER,
				SGE.EVENT_MOUSE_OUT,
				SGE.EVENT_MOUSE_DOWN,
				SGE.EVENT_MOUSE_UP,
				SGE.EVENT_MOUSE_MOVE,
				SGE.EVENT_PRESS,
				SGE.EVENT_RELEASE
			];
			for (var i = 0; i < evs.length; i++) {
				if (this.events.hasEvent(evs[i])) return true;
			}
			return false;
		}
	});
	
	Object.defineProperty(this, 'multipleInputs', {
		get: function() { return Object.keys(this.inputs).length > 1; }
	});
	
	Object.defineProperty(this, 'multipleOutputs', {
		get: function() { return !this.isSource && Object.keys(this.outputs).length > 1; }
	});
	
	Object.defineProperty(this, 'isSource', {
		get: function() { return (this instanceof SGE.Source); }
	});
	
	Object.defineProperty(this, 'isAttached', {
		get: function() { return !(this.attachedTo === null); }
	});
	
	Object.defineProperty(this, 'direction', {
		set: function(value) {
			this.sceneObject.direction = value;
			if (this.experiment) this.experiment.needsUpdate = true;
		},
		get: function() { return this.sceneObject.direction; }
	});
	
	Object.defineProperty(this, 'angle', {
		set: function(value) {
			if (this.multipleInputs) {
				SGE.error("Cannot independently rotate object with multiple inputs.");
			}
			if (this instanceof SGE.Detector) {
				SGE.error("Detectors do not rotate.");
			}
			if (this.experiment) this.experiment.needsUpdate = true;
			this.sceneObject.angle = value;
			if (this.__angleMeter) {
				this.__angleMeter.angle = value;
				this.__angleMeter.update();
			}
		},
		get: function() { return this.sceneObject.angle; }
	});
	
	// Same as above, but internal
	Object.defineProperty(this, '__angle', {
		set: function(value) {
			if (this.experiment) this.experiment.needsUpdate = true;
			this.sceneObject.angle = value;
			if (this.__angleMeter) {
				this.__angleMeter.angle = value;
				this.__angleMeter.update();
			}
		},
		get: function() { return this.sceneObject.angle; }
	});
	
	Object.defineProperty(this, 'spacing', {
		set: function(value) {
			if (value == this.__spacing) return;
			this.__spacing = value;
			// if (this.experiment) this.experiment.updatePositions();
			if (this.experiment) this.experiment.needsUpdate = true;
		},
		get: function() { return this.__spacing; }
	});
	
	Object.defineProperty(this, 'label', {
		get: function() { return this.sceneObject.label; }
	});
	
	// Angle meter
	Object.defineProperty(this, 'angleMeter', {
		get: function() {
			
			if (this.__angleMeter === null) {
				this.__angleMeter = new SGE.SceneObjects.AngleMeter();
				if (this instanceof SGE.SternGerlach) {
					this.__angleMeter.position.x = this.magnets.position.x;
				}
				this.sceneObject.group.add(this.__angleMeter.group);
			}
			
			return this.__angleMeter;
			
		}
	});
	
	Object.defineProperty(this, 'visible', {
		set: function(value) { this.sceneObject.group.visible = value; },
		get: function() { return this.sceneObject.group.visible; }
	});
	
	Object.defineProperty(this, 'position', {
		get: function() { return this.sceneObject.position; },
		configurable: true // allow override (e.g., for the source)
	});
	
	// Position override
	Object.defineProperty(this, '__position', {
		get: function() { return this.sceneObject.position; }
	});
	
	Object.defineProperty(this, 'glow', {
		set: function(v) { this.sceneObject.glow = v; },
		get: function() { return this.sceneObject.glow; }
	});
	
	
	// I/O
	this.addOutput = function(name, data) {
		this.outputs[name] = data;
	}
	
	this.addInput = function(name, data) {
		this.inputs[name] = data;
	}
	
	// ToDo: verify all possible attachments
	this.attach = function(obj, output) {
		if (!this.experiment) {
			SGE.error(
				obj.__SUBCLASS+" is not part of an experiment. Use Experiment.add() or " +
				"attach it to objects already in an experiment (e.g., a source)."
			);
		}
		
		if (!obj.attachable) {
			SGE.error(obj.__SUBCLASS+" is not attachable to other objects.");
		}
		if (!this.attachable) {
			SGE.error(this.__SUBCLASS+" is not attachable to other objects.");
		}
		
		if (!(obj instanceof SGE.Ignore) && this.experiment.isRunning) {
			SGE.error("Cannot change attachments while experiment is running.");
		}
		
		output = ifdef(output, SGE.IO_DEFAULT);
		
		if (output == SGE.IO_ALL) {
			SGE.error("Output SGE.IO_ALL is protected and reserved for multiple input objects.");
		}
		
		if (!obj.multipleInputs && !(output in this.outputs)) {
			SGE.error("\""+output+"\" is not a recognized output for "+this.__SUBCLASS+".");
		}
		
		if (!isUndefined(this.attachments[SGE.IO_ALL])) {
			SGE.error(this.__SUBCLASS+"'s output slots are already occupied.");
		}
		
		if (!isUndefined(this.attachments[output])) {
			SGE.error(this.__SUBCLASS+"'s output slot \""+output+"\" is already occupied.");
		}
		
		if (this.isSource) {
			if (output == "left" && this.sourceType != SGE.SOURCE_TYPE_ENTANGLED) {
				SGE.error("Left-side output is only available for entangled pair source.");
			}
		}
		
		if (obj.multipleInputs) {
			if (!this.multipleOutputs) {
				SGE.error(
					"Cannot attach objects. " +
					obj.__SUBCLASS+" has multiple inputs, but " + 
					this.__SUBCLASS + " does not have multiple outputs."
				);
			}
			this.attachments[SGE.IO_ALL] = obj;
		} else {
			this.attachments[output] = obj;
		}
		
		// Add object to the experiment, in case it wasn't already
		this.experiment.add(obj);
		
		// Assign attachments and experiment
		obj.attachedTo = this;
		obj.experiment = this.experiment;
		
		// If object was currently in an experiment but detached, we remove it
		if (obj.experiment) delete obj.experiment.detachedObjects[obj.uid];
		
		if (this.isSource) {
			obj.direction = this.outputs[output].direction;
		} else {
			obj.direction = this.direction;
		}
		
		this.experiment.needsUpdate = true;
		this.updateAttachments(); // ToDo: remove this if performance drops
	}
	
	// Detach this object from whatever it is attached to
	this.detach = function() {
		if (!this.experiment) return;
		
		if (!(this instanceof SGE.Ignore) && this.experiment.isRunning) {
			SGE.error("Cannot change attachments while experiment is running.");
		}
		
		if (this.attachedTo) {
			for(var o in this.attachedTo.attachments) {
				if (this.attachedTo.attachments[o].uid == this.uid) {
					delete this.attachedTo.attachments[o];
				}
			}
		}
		this.attachedTo = null;
		this.experiment.detachedObjects[this.uid] = this;
	}
	
	// ToDo: check if this can be optimized
	this.updateAttachments = function() {
		var obj, out, d, p;
		
		// If object isn't attached to an experiment, there's nothing to do really
		if (this.experiment === null) return;
		
		if (this.sceneObject.position.x < this.experiment.size['min']) {
			this.experiment.size['min'] = this.sceneObject.position.x;
		}
		if (this.sceneObject.position.x > this.experiment.size['max']) {
			this.experiment.size['max'] = this.sceneObject.position.x;
		}

		
		for(var i in this.attachments) {
			obj = this.attachments[i];
			out = this.outputs[i];
			if (this.isSource) {
				d = (out.direction == SGE.RIGHT ? 1 : -1);
			} else {
				d = (this.direction == SGE.RIGHT ? 1 : -1);
			}
			if (!obj.multipleInputs) {
				p = obj.sceneObject.position;
				
				p.copy( this.sceneObject.position );
				
				p.x += this.length/2 * d;
				p.x += obj.length/2 * d;
				
				p.x += this.paddingRight * d;
				p.x += obj.paddingLeft * d;
				
				// Use the largest margin between the two objects (margin collapse)
				p.x += Math.max(this.marginRight, obj.marginLeft) * d;
				
				// Object spacing
				p.x += obj.spacing * d;
				
				// Add offset to the output
				p.z += out.offset * Math.sin(this.angle);
				p.y += out.offset * Math.cos(this.angle);
			} else {
				p = obj.sceneObject.position;
				
				p.copy( this.sceneObject.position );
				
				p.x += this.length/2 * d;
				p.x += obj.length/2 * d;
				
				p.x += this.paddingRight * d;
				p.x += obj.paddingLeft * d;
				
				// Object spacing
				p.x += obj.spacing * d;
				
				// Use the largest margin between the two objects (margin collapse)
				p.x += Math.max(this.marginRight, obj.marginLeft) * d;
				
				// Multiple inputs forces both objects to have the same angle
				obj.__angle = this.angle;
			}
			obj.updateAttachments();
		}
	}
	
	// Interaction with object (atom or current loop)
	// Default is just event trigger
	// This is called again for other objects
	this.interact = function(particle) {
		this.events.trigger(SGE.EVENT_INTERACT, {
			particle: particle
		});
		this.experiment.__history[particle.uid].interacted[this.uid] = true;
	}
	this.__interact = this.interact;
	
	
	// Gets the TOTAL probability of particle reaching this object coming from the source
	// This is like an "instantaneous" simulation, useful to get numerical results beforehand
	// It does so by simulating a particle by its known spin angle only (variable tmpSpin below)
	// In practice, this should be used only for detectors and analyzers: we get the probability
	// for each detector and use the probability of their analyzer to normalize the results
	//
	// Example: if an analyzer has 0.25 probability of atoms reaching it, and the two detectors
	// attached to it have 0.075 and 0.175, then the ratio of probabilities of detection will be:
	//      Detector 1: 0.075 / 0.25 = 30%
	//      Detector 2: 0.175 / 0.25 = 70%
	// Which is the value we talk about in the tutorials
	//
	// ToDo: make it comprehensive for ALL objects. At the moment, it only handles analyzers
	// None of the experiments required this, but could be useful for later cases.
	Object.defineProperty(this, 'probability', {
		get: function() {
			// If not attached to the experiment, there's no chance
			if (this.attachedTo === null) return 0;
			var o = this.attachedTo; // current object
			var chain = [this]; // chain of objects being analyzed
			
			chain.unshift(o);
			
			if (!this.multipleInputs) {
				while (o.__SUBCLASS != "Source") {
					o = o.attachedTo;
					chain.unshift(o);
				}
				// console.log(chain);
				
				// Go through the chain and update probabilities
				var prob = 1.0; // current probability
				var s = chain[0]; // source
				var tmpSpin; // simulated angle of particle
				switch(s.sourceType) {
					case SGE.SOURCE_TYPE_NORMAL:
						tmpSpin = null;
						break;
					case SGE.SOURCE_TYPE_SPINUP:
					case SGE.SOURCE_TYPE_CURRENT_LOOP:
						tmpSpin = s.angle;
						break;
					case SGE.SOURCE_TYPE_ENTANGLED:
						tmpSpin = null;
						break;
				}
				
				// Continue here
				var no, ang, p;
				for(var i = 1; i < chain.length-1; i++) {
					o = chain[i];
					no = chain[i+1];
					
					switch(o.__SUBCLASS) {
						case "Analyzer":
						case "ExplodedAnalyzer":
						case "SternGerlach":
							ang = (tmpSpin === null ? o.angle + SGE.TAU/4 : tmpSpin) - o.angle;
							p = Math.pow(Math.cos(ang/2),2);
							if (!isUndefined(o.attachments[SGE.IO_TOP]) &&
								o.attachments[SGE.IO_TOP] == no) {
								prob *= p;
								tmpSpin = o.angle; // measurement defines state
							} else { // on the (-) output, results are complementary
								prob *= (1.0 - p);
								tmpSpin = o.angle + SGE.TAU/2;
							}
							break;
						case "Gate":
							// ToDo: handle other objects
							// For the gate, we have to check inputs and outputs
							break;
						default:
							break;
					}
					
				}
				
				return Math.round(prob*1e6)/1e6; // round to 6 decimal places to simplify result
			} else {
				// ToDo: Logic is different for multiple inputs
			}
		}
	});
	
	this.blink = function() {
		var o = this.sceneObject;
		TweenMax.to(
			o, 0.3, {
				glow: 1,
				onComplete: function() {
					TweenMax.to(o, 0.6, { glow: 0 });
				}
			}
		);
	}
	
	// Memory management
	this.dispose = function() {
		if (this.sceneObject) this.sceneObject.dispose();
	}
	
}

// Source of atoms or current loops
SGE.Source = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Source";
	this.sceneObject = new SGE.SceneObjects.Source();
	
	// Dimensions
	this.length = 1;
	this.paddingLeft = SGE.SOURCE_CONE_LENGTH;
	this.paddingRight = SGE.SOURCE_CONE_LENGTH;
	
	// Properties
	// Even if the source is normal, we can still force it to have spin up behavior
	// This is done for narrative purposes, when we need a predictable behavior
	// This does not change the appearance of the source
	// Ideally, this should be used along with hidden states (no visible cones)
	this.forceSpinUp = false;
	
	if (SGE.debug) this.sceneObject.debugBox = [1,1,1];
	
	this.addOutput("right",{
		direction: SGE.RIGHT,
		offset: 0
	});
	
	this.addOutput("left",{
		direction: SGE.LEFT,
		offset: 0
	});
	
	Object.defineProperty(this, 'sourceType', {
		set: function(value) {
			this.sceneObject.sourceType = value;
		},
		get: function() { return this.sceneObject.sourceType; }
	});
	
	Object.defineProperty(this, 'position', {
		get: function() { SGE.error("Sources cannot be moved away from the origin. Move the experiment object instead."); }
	});
	
	this.__init();
}

// An invisible object that "detects" a particle and displays an "ignore" message
// Used in front of unused object outputs, so that there's always an end to the chain of objects
// Otherwise, atoms would go on forever in some cases
SGE.Ignore = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Ignore";
	this.sceneObject = new SGE.SceneObjects.Ignore();
	
	this.length = 1;
	if (SGE.debug) this.sceneObject.debugBox = [1,1,1];
	this.addInput(SGE.IO_DEFAULT, { offset: 0 });
	
	this.__silent = false;
	Object.defineProperty(this, 'silent', {
		set: function(value) {
			this.__silent = value;
		},
		get: function() { return this.__silent; }
	});
	
	this.show = function() {
		if (this.__silent) return; // don't show if set to silent
		var o = this;
		TweenMax.killTweensOf(o.sceneObject, { opacity: true });
		if (o.sceneObject.opacity >= 0.75) o.sceneObject.opacity = 0.5;
		TweenMax.to(
			o.sceneObject, 0.2,
			{
				opacity: 1,
				onComplete: function(){ o.hide(); }
			}
		);
	}
	
	this.hide = function() {
		var o = this;
		TweenMax.killTweensOf(o.sceneObject, { opacity: true });
		TweenMax.to(
			this.sceneObject, 0.2,
			{
				delay: 0.2,
				opacity: 0
			}
		);
	}
	
	this.interact = function(particle) {
		this.__interact(particle);
		particle.events.trigger(SGE.EVENT_NOT_DETECTED);
		this.show();
		this.experiment.end(particle);
	}
	
	this.__init();
}

// General interface for the objects that perform a spin measurement
// This is used by all the Stern-Gerlach apparatus-like objects
// This is what causes state collapse
SGE.Interface.AnalyzerMeasurement = function(analyzer) {
	
	analyzer.measure = function(particle) {
		// state boolean (true/false=+/-), dummy angle, probability
		var state, ang, prob;
		
		// Only atoms are measured, current loops are only deflected
		if (particle instanceof SGE.Atom) {
			
			// If atom has hidden instructions set
			if (particle.hasInstructions) {
				// Current direction in terms of ABC (0, 120, 240 degrees)
				ang  = ((SGE.round(3 * this.angle / SGE.TAU) + 3) % 3);
				
				// Force hidden state
				if (particle.instructions.state[ang] == SGE.PLUS) state = true;
				if (particle.instructions.state[ang] == SGE.MINUS) state = false;
				particle.spin = this.angle + (state ? 0 : 1) * SGE.TAU/2;
				
				return state;
			}
			
			// First, we set ang to the spin angle if defined, otherwise we assume a 
			// a spin perpendicular to the analyzer, so probability ends up being 50%/50% anyway
			ang = (particle.spin === null ? this.angle + SGE.TAU/4 : particle.spin);
			// Then, we find the raw difference between the spin angle and the analyzer
			ang = ang - this.angle;
			
			// We find the probability to measure a + state
			prob = Math.pow(Math.cos(ang/2),2);
			
			// Round to 6 decimal places, avoids spurious results due to floating point
			prob = Math.round(prob*1e6)/1e6;
			
			// Pick a new state randomly based on the probability
			state = (Math.random() <= prob); // true = +, false = -
			
			// Set spin according to new state, with direction relative to analyzer
			particle.spin = this.angle + (state ? 0 : 1) * SGE.TAU/2;
			
			return state;
		}
		
		// Measuring doesn't affect current loops, but it does set the local field value
		if (particle instanceof SGE.CurrentLoop) {
			particle.fieldAngle = this.angle;
			// Field strength is given by the SGE.SternGerlach.deflect method
		}
		
	}
	
}

// Stern-Gerlach analyzer in a box
SGE.Analyzer = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Analyzer";
	this.sceneObject = new SGE.SceneObjects.Analyzer();
	
	this.length = 4;
	this.marginLeft = SGE.PLUG_LENGTH;
	this.marginRight = SGE.PLUG_LENGTH;
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,3,1];
	
	this.addInput(SGE.IO_DEFAULT, { offset: 0 });
	this.addOutput(SGE.IO_TOP,{ offset: 1 });
	this.addOutput(SGE.IO_BOTTOM,{ offset: -1 });
	
	SGE.Interface.AnalyzerMeasurement(this);
	
	// Interact with atom/current loop
	this.interact = function(particle) {
		if (particle instanceof SGE.CurrentLoop) {
			SGE.error("Analyzers can't deal with current loops. Use SGE.SternGerlach instead.");
		}
		
		state = this.measure(particle);
		this.__interact(particle);
		
		var output = (state ? SGE.IO_TOP : SGE.IO_BOTTOM);
		particle.position.y = this.position.y + Math.cos(this.angle) * this.outputs[output].offset;
		particle.position.z = this.position.z + Math.sin(this.angle) * this.outputs[output].offset;
		
		var next;
		if (SGE.IO_ALL in this.attachments) {
			next = this.attachments[SGE.IO_ALL];
		} else if (!(output in this.attachments)) {
			this.experiment.ignoreAt(this, output);
			next = this.attachments[output];
		} else {
			next = this.attachments[output];
		}
		
		particle.comingFrom = {
			object: this,
			output: output
		}
		particle.goingTo = {
			object: next,
			input: (next && next.multipleInputs ? output : SGE.IO_DEFAULT)
		}
	}
	
	this.__init();
}

// Exploded Stern-Gerlach analyzer
SGE.ExplodedAnalyzer = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "ExplodedAnalyzer";
	this.sceneObject = new SGE.SceneObjects.ExplodedAnalyzer();
	
	this.length = 4;
	this.marginLeft = SGE.PLUG_LENGTH;
	this.marginRight = SGE.PLUG_LENGTH;
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,3,1];
	
	this.addInput(SGE.IO_DEFAULT, { offset: 0 });
	this.addOutput(SGE.IO_TOP,{ offset: 1 });
	this.addOutput(SGE.IO_BOTTOM,{ offset: -1 });
	
	SGE.Interface.AnalyzerMeasurement(this);
	
	Object.defineProperty(this, 'frontCover', {
		get: function() { return this.sceneObject.frontCover; }
	});
	
	Object.defineProperty(this, 'backCover', {
		get: function() { return this.sceneObject.backCover; }
	});
	
	Object.defineProperty(this, 'boxFrame', {
		get: function() { return this.sceneObject.boxFrame; }
	});
	
	Object.defineProperty(this, 'tubes', {
		get: function() { return this.sceneObject.tubes; }
	});
	
	Object.defineProperty(this, 'topTube', {
		get: function() { return this.sceneObject.topTube; }
	});
	
	Object.defineProperty(this, 'bottomTube', {
		get: function() { return this.sceneObject.bottomTube; }
	});
	
	Object.defineProperty(this, 'magnets', {
		get: function() { return this.sceneObject.magnets; }
	});
	
	
	// Interact with atom/current loop
	// particle = atom/current loop object
	// This is usually triggered automatically once it passes through the center of objects
	// However, we need to decide which way to deflect the particle right away, so for the
	// exploded analyzer, we call interact() as soon as it enters the object (see event below)
	this.interact = function(particle) {
		if (particle instanceof SGE.CurrentLoop) {
			SGE.error("Analyzers can't deal with current loops. Use SGE.SternGerlach instead.");
		}
		
		state = this.measure(particle);
		this.__interact(particle);
		
		var output = (state ? SGE.IO_TOP : SGE.IO_BOTTOM);
		
		var next;
		if (SGE.IO_ALL in this.attachments) {
			next = this.attachments[SGE.IO_ALL];
		} else if (!(output in this.attachments)) {
			this.experiment.ignoreAt(this, output);
			next = this.attachments[output];
		} else {
			next = this.attachments[output];
		}
		
		particle.comingFrom = {
			object: this,
			output: output
		}
		particle.goingTo = {
			object: next,
			input: (next && next.multipleInputs ? output : SGE.IO_DEFAULT)
		}
	}
	// Exploded analyzer is interacted with as soon as particle enters it, as opposed to 
	// when the particle reaches its center
	this.onEnter = function(ev) { ev.target.interact(ev.particle); }
	this.events.__on(SGE.EVENT_ENTER, this.onEnter);
	
	// Deflect atom/current loop inside
	this.deflect = function(ev) {
		var d = ev.distance;
		var analyzer = ev.target;
		var l = (analyzer.length / 2);
		d += 1.1;
		if (d < 0) return;
		var a = ev.particle;
		var k = d / l;
		if (k > 1) k = 1;
		var y = k*k;
		var od;
		if (a instanceof SGE.Atom) { // Deflect quantum-mechanically
			var o = (analyzer.angle == a.spin ? SGE.IO_TOP : SGE.IO_BOTTOM);
			od = analyzer.outputs[o].offset;
		}
		a.position.y = analyzer.position.y + y * Math.cos(analyzer.angle) * od;
		a.position.z = analyzer.position.z + y * Math.sin(analyzer.angle) * od;
	}
	// Assign onMoveInside handler
	this.events.__on(SGE.EVENT_MOVE_INSIDE, this.deflect);
	
	this.__init();
}

// Stern-Gerlach apparatus (magnets + screen)
SGE.SternGerlach = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "SternGerlach";
	this.sceneObject = new SGE.SceneObjects.SternGerlach();
	
	this.length = SGE.SG_LENGTH;
	this.paddingLeft = 1;
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,3,3];
	
	this.addInput(SGE.IO_DEFAULT, { offset: 0 });
	this.addOutput(SGE.IO_TOP,{ offset: 1 });
	this.addOutput(SGE.IO_BOTTOM,{ offset: -1 });
	
	SGE.Interface.AnalyzerMeasurement(this);
	
	Object.defineProperty(this, 'magnets', {
		get: function() { return this.sceneObject.magnets; }
	});
	
	Object.defineProperty(this, 'screen', {
		// .screen is an object with reference to context, texture and such, so we use .object too
		get: function() { return this.sceneObject.screen.object; }
	});
	
	// Interact with atom/current loop
	this.interact = function(particle) {
		this.measure(particle);
		this.__interact(particle);
	}
	
	// Stern-Gerlach experiment interacted with as soon as particle enters it, as opposed to 
	// when the particle reaches its center
	this.onEnter = function(ev) { ev.target.interact(ev.particle); }
	this.events.__on(SGE.EVENT_ENTER, this.onEnter);
	
	// Deflect atom/current loop inside
	this.deflect = function(ev) {
		var d = ev.distance;
		var sg = ev.target;
		var l = (sg.length / 2);
		var a = ev.particle;
		
		var k = (d / l + 1)/2;
		if (k > 1) k = 1;
		var y = k*k;
		
		// Deflect according to spin
		var od = Math.cos(sg.angle - a.spin);
		
		// Change field intensity
		if (a instanceof SGE.CurrentLoop) {
			var dm = a.position.x - (sg.position.x + sg.sceneObject.magnets.position.x);
			if (Math.abs(dm) > 1) {
				a.fieldIntensity = 0;
			} else {
				a.fieldIntensity = Math.pow(Math.cos(dm*SGE.TAU/4),2);
			}
		}
		
		a.position.y = sg.position.y + y * Math.cos(sg.angle) * od;
		a.position.z = sg.position.z + y * Math.sin(sg.angle) * od;
	}
	
	this.dotAlpha = SGE.SG_SCREEN_DOT_ALPHA;
	this.dotSize = SGE.SG_SCREEN_DOT_SIZE;
	this.dotSpread = SGE.SG_SCREEN_DOT_SPREAD;
	this.hitScreen = function(ev) {
		var a = ev.particle;
		var sg = ev.target;
		var x = (a.position.z - sg.position.z) / 1.5;
		var y = (a.position.y - sg.position.y) / 1.5;
		
		// Generates a radial Gaussian distribution (Box-Muller transform)
		var u = Math.random();
		var v = Math.random();
		var r = Math.sqrt(-2*Math.log(u));
		
		x += r * Math.cos(SGE.TAU*v) * SGE.SG_SCREEN_DOT_SPREAD;
		y += r * Math.sin(SGE.TAU*v) * SGE.SG_SCREEN_DOT_SPREAD;
		
		sg.drawDot(x, y, sg.dotSize, sg.dotAlpha);
		a.detected = true;
		
		sg.experiment.end(a); 
	}
	
	this.clearScreen = function() {
		this.sceneObject.clearScreen();
	}
	
	this.drawDot = function(x, y, radius, alpha) {
		this.sceneObject.drawDot(x, y, radius, alpha);
	}
	
	// Assign onMoveInside handler
	this.events.__on(SGE.EVENT_MOVE_INSIDE, this.deflect);
	this.events.__on(SGE.EVENT_LEAVE, this.hitScreen);
	
	this.__init();
}


// Gate for analyzers
SGE.Gate = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Gate";
	this.sceneObject = new SGE.SceneObjects.Gate();
	
	this.length = 1;
	this.marginLeft = SGE.PLUG_LENGTH;
	this.marginRight = SGE.PLUG_LENGTH;
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,3,1];
	
	this.addInput(SGE.IO_TOP,{ offset: 1 });
	this.addInput(SGE.IO_BOTTOM,{ offset: -1 });
	this.addOutput(SGE.IO_TOP,{ offset: 1 });
	this.addOutput(SGE.IO_BOTTOM,{ offset: -1 });
	
	this.__blocked = new SGE.Ignore();
	this.__blocked.sceneObject.label.text = SGE.BLOCKED_LABEL;
	
	// Similar system that of analyzer
	SGE.Interface.AnalyzerMeasurement(this);
	
	// Gate states
	Object.defineProperty(this, 'topOpen', {
		set: function(value) {
			this.sceneObject.setOpenState(value, this.sceneObject.open[SGE.IO_BOTTOM]);
		},
		get: function() { return this.sceneObject.open[SGE.IO_TOP]; }
	});
	
	Object.defineProperty(this, 'bottomOpen', {
		set: function(value) {
			this.sceneObject.setOpenState(this.sceneObject.open[SGE.IO_TOP], value);
		},
		get: function() { return this.sceneObject.open[SGE.IO_BOTTOM]; }
	});
	
	// State alias
	Object.defineProperty(this, 'open', {
		get: function() { return this.sceneObject.open; }
	});
	
	// Ignore silently
	Object.defineProperty(this, 'silent', {
		set: function(value) {
			this.__blocked.silent = value;
		},
		get: function() { return this.__blocked.silent; }
	});
	
	// Interact with atom/current loop
	this.interact = function(particle) {
		this.__interact(particle);
		
		var cf = particle.comingFrom;
		var gt = particle.goingTo;
		
		var output = gt.input;
		var next;
		
		if (this.experiment.isClassical) {
			if (this.open[output]) { // Path is open
				// Pass through
				
				if (SGE.IO_ALL in this.attachments) {
					next = this.attachments[SGE.IO_ALL];
				} else if (!(output in this.attachments)) {
					this.experiment.ignoreAt(this, output);
					next = this.attachments[output];
				} else {
					next = this.attachments[output];
				}
				
				particle.comingFrom = {
					object: this,
					output: output
				}
				particle.goingTo = {
					object: next,
					input: (next && next.multipleInputs ? output : SGE.IO_DEFAULT)
				}
				
			} else { // Path is blocked
				var o = this.outputs[output].offset;
				this.experiment.add(this.__blocked);
				// ToDo: use vector3.copy()
				this.__blocked.position.x = this.position.x;
				this.__blocked.position.y = this.position.y + Math.cos(this.angle)*o;
				this.__blocked.position.z = this.position.z + Math.sin(this.angle)*o;
				this.__blocked.show();
				particle.detected = true; // blocking a particle is the same as detecting it
				this.experiment.end(particle);
			}
		} else {
			
			if (!this.open[SGE.IO_TOP] && !this.open[SGE.IO_BOTTOM]) {
				// Both paths are closed so the atom is blocked
				this.experiment.add(this.__blocked);
				// ToDo: use vector3.copy()
				this.__blocked.position.x = this.position.x;
				this.__blocked.position.y = this.position.y;
				this.__blocked.position.z = this.position.z;
				this.__blocked.show();
				particle.detected = true; // blocking a particle is the same as detecting it
				this.experiment.end(particle);
			} else {
				
				if (this.open[SGE.IO_TOP] && this.open[SGE.IO_BOTTOM]) {
					// If both paths are open, they can interfere
					// We pass the atom through untouched
				} else {
					// If one path is open and the other is closed, there's only one possible state
					
					// We attempt to measure the state
					state = this.measure(particle);
					// This is the output the particle is at
					var output = (state ? SGE.IO_TOP : SGE.IO_BOTTOM);
					
					// If that output is blocked, we show it
					if (!this.open[output]) {
						var o = this.outputs[output].offset;
						this.experiment.add(this.__blocked);
						// ToDo: use vector3.copy()
						this.__blocked.position.x = this.position.x;
						this.__blocked.position.y = this.position.y + Math.cos(this.angle)*o;
						this.__blocked.position.z = this.position.z + Math.sin(this.angle)*o;
						this.__blocked.show();
						particle.detected = true; // blocking a particle is the same as detecting it
						this.experiment.end(particle);
					}
					
					// Otherwise, the atom passed through.
					
					// We set the atom spin again to its current value, as if it was a second
					// measurement. This erases the previous known state in memory and removes
					// possible interference.
					particle.spin = particle.spin;
				}
				
				// Pass atom through
				if (SGE.IO_ALL in this.attachments) {
					next = this.attachments[SGE.IO_ALL];
				} else if (!(output in this.attachments)) {
					this.experiment.ignoreAt(this, output);
					next = this.attachments[output];
				} else {
					next = this.attachments[output];
				}
				
				particle.comingFrom = {
					object: this,
					output: output
				}
				particle.goingTo = {
					object: next,
					input: (next && next.multipleInputs ? output : SGE.IO_DEFAULT)
				}
				
			}
		}
	}
	
	this.__init();
}


// Gate-like detector pair
// If both pipes are visible and both detectors are invisible, then it does not collapse state
SGE.DetectorGate = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "DetectorGate";
	this.sceneObject = new SGE.SceneObjects.DetectorGate();
	
	// Dimensions
	this.length = 1.5;
	this.marginLeft = SGE.PLUG_LENGTH;
	this.marginRight = SGE.PLUG_LENGTH;
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,3,1];
	
	this.addInput(SGE.IO_TOP,{ offset: 1 });
	this.addInput(SGE.IO_BOTTOM,{ offset: -1 });
	this.addOutput(SGE.IO_TOP,{ offset: 1 });
	this.addOutput(SGE.IO_BOTTOM,{ offset: -1 });
	
	// Similar system that of analyzer
	SGE.Interface.AnalyzerMeasurement(this);
	
	// Interact with atom/current loop
	this.interact = function(particle) {
		this.__interact(particle);
		
		var cf = particle.comingFrom;
		var gt = particle.goingTo;
		
		var output = gt.input;
		var next;
		
		// Pass through & detect
		// Internally, all simulations are classical and we just "fudge" information to make
		// it quantum, so there's nothing to do but pass through.
		if (SGE.IO_ALL in this.attachments) {
			next = this.attachments[SGE.IO_ALL];
		} else if (!(output in this.attachments)) {
			this.experiment.ignoreAt(this, output);
			next = this.attachments[output];
		} else {
			next = this.attachments[output];
		}
		
		// ... but since the detector-gate forces collapse if there's a detector being used
		// anywhere, we check for this case. In fact, it's better to check whether it is NOT
		// a quantum situation involving only the pipes.
		// The reason we uncouple pipes and detectors is for animation purposes.
		// I'm not sure what alternative approach would work here. A bit more cumbersome,
		// but allows for dynamic animations. Anyway, to recap:
		// If NOT a pipes-only scenario
		if (!(this.topDetector.visible == false && this.bottomDetector.visible == false &&
			this.topPipe.visible == true && this.bottomPipe.visible == true)) {
				// Force collapse of state of the atom
				particle.spin = particle.spin;
		}
		// else, pass-through and behave quantum mechanically
		
		
		// Blink appropriate detector sphere, if visible
		this.blink(output);
		
		particle.comingFrom = {
			object: this,
			output: output
		}
		particle.goingTo = {
			object: next,
			input: (next && next.multipleInputs ? output : SGE.IO_DEFAULT)
		}
		

	}
	
	this.blink = function(pos) {
		var o;
		if (pos == SGE.IO_TOP) {
			if (!this.topDetector.visible) return;
			o = this.sceneObject.topSphere;
		} else {
			if (!this.bottomDetector.visible) return;
			o = this.sceneObject.bottomSphere;
		}
		// Pass-through detectors glow slowly and hold the glow for longer
		if (o.glow > 0) o.glow = o.glow/4;
		TweenMax.to(
			o, 0.25, {
				glow: 1,
				onComplete: function() {
					TweenMax.to(o, 0.25, { glow: 0, delay: 0.5 });
				}
			}
		);
	}
	
	Object.defineProperty(this, 'topDetector', {
		get: function() { return this.sceneObject.topDetector; }
	});
	Object.defineProperty(this, 'bottomDetector', {
		get: function() { return this.sceneObject.bottomDetector; }
	});
	Object.defineProperty(this, 'topPipe', {
		get: function() { return this.sceneObject.topPipe; }
	});
	Object.defineProperty(this, 'bottomPipe', {
		get: function() { return this.sceneObject.bottomPipe; }
	});
	
	this.__init();
}

// Quantum eraser
SGE.Eraser = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Eraser";
	this.sceneObject = new SGE.SceneObjects.Eraser();
	
	this.length = 4;
	this.marginLeft = SGE.PLUG_LENGTH;
	this.marginRight = SGE.PLUG_LENGTH;
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,3,1];
	
	this.addInput(SGE.IO_TOP,{ offset: 1 });
	this.addInput(SGE.IO_BOTTOM,{ offset: -1 });
	this.addOutput(SGE.IO_DEFAULT,{ offset: 0 });
	
	// Interact with atom/current loop
	this.interact = function(particle) {
		
		this.__interact(particle);
		
		var output = SGE.IO_DEFAULT;
		
		var next;
		if (SGE.IO_ALL in this.attachments) {
			next = this.attachments[SGE.IO_ALL];
		} else if (!(output in this.attachments)) {
			this.experiment.ignoreAt(this, output);
			next = this.attachments[output];
		} else {
			next = this.attachments[output];
		}
		
		particle.position.y = this.position.y;
		particle.position.z = this.position.z;
		
		particle.comingFrom = {
			object: this,
			output: SGE.IO_DEFAULT
		}
		particle.goingTo = {
			object: next,
			input: (next && next.multipleInputs ? output : SGE.IO_DEFAULT)
		}
		
		// If we're working quantum-mechanically, stop
		if (!this.experiment.isClassical) {
			var a = particle.spin;
			particle.eraseSpin();
			// console.log(a+" -> "+particle.spin);
		}
		
	}
	
	this.__init();
}

// Detector
SGE.Detector = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Detector";
	this.sceneObject = new SGE.SceneObjects.Detector();
	
	this.length = SGE.DETECTOR_RADIUS*2;
	this.paddingLeft = SGE.SOURCE_CONE_LENGTH*(SGE.DETECTOR_OVERLAP_FACTOR2 + 1/2);
	
	if (SGE.debug) this.sceneObject.debugBox = [this.length,1,1];
	
	this.addInput(SGE.IO_DEFAULT, { offset: 0 });
	
	// Interact with atom/current loop
	this.interact = function(particle) {
		this.__interact(particle);
		particle.detected = true;
		this.counter++;
		this.events.trigger(SGE.EVENT_DETECT_PARTICLE, { particle: particle });
		particle.events.trigger(SGE.EVENT_DETECTED, { object: this });
		this.blink();
		this.experiment.end(particle);
	}
	
	this.blink = function() {
		var o = this.sceneObject.sphere;
		TweenMax.to(
			o, 0.2, {
				glow: 1,
				onComplete: function() {
					TweenMax.to(o, 0.2, { glow: 0 });
				}
			}
		);
	}
	
	// Counter properties
	this.__counter = 0;
	Object.defineProperty(this, 'counter', {
		set: function(value) {
			this.__counter = value;
			this.sceneObject.counterLabel.text = this.__counter.toString();
		},
		get: function() { return this.__counter; }
	});
	
	// Bypass to property
	Object.defineProperty(this, 'counterLabel', {
		get: function() { return this.sceneObject.counterLabel; }
	});
	
	this.__init();
}

// Atom - Don't instantiate, these are handled automatically by the experiment
// Each experiment has two atoms: atomR and atomL. They're handled automatically.
// Atoms may carry hidden instructions in 3 directions (for Bell experiment)
// Set: atom.instructions.state = [SGE.PLUS, SGE.MINUS, SGE.PLUS]; (act with local determinism)
// Unset: atom.instructions.state = null; (act quantum-mechanically)
SGE.Atom = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "Atom";
	this.sceneObject = new SGE.SceneObjects.Atom();
	this.attachable = false;
	this.detected = false;
	
	// Entanglement data
	this.entangledWith = null; // reference to the other atom
	
	if (SGE.debug) this.sceneObject.debugBox = [1,1,1];
	
	this.goingTo = null;
	this.comingFrom = null;
	
	Object.defineProperty(this, 'spin', {
		set: function(value) {
			this.sceneObject.spin = value;
			if (this.entangledWith) { // if entangled
				// set opposite spin
				this.entangledWith.sceneObject.spin = (value === null ? null : value + SGE.TAU/2);
			}
			if (this.__angleMeter) { // not used in practice, but we keep it for consistency
				this.__angleMeter.angle = value;
				this.__angleMeter.update();
			}
		},
		get: function() { return this.sceneObject.spin; }
	});
	
	// Clear spin history
	this.clearSpinHistory = function() {
		this.sceneObject.clearSpinHistory();
	}
	
	// Reverts to previous state. If atom is entangled
	this.eraseSpin = function() {
		this.sceneObject.eraseSpin();
	}
	
	Object.defineProperty(this, 'lastSpin', {
		get: function() { return this.sceneObject.lastSpin; }
	});
	
	Object.defineProperty(this, 'revealState', {
		set: function(value) {
			this.sceneObject.revealState = value;
		},
		get: function() { return this.sceneObject.revealState; }
	});
	
	Object.defineProperty(this, 'coneSize', {
		set: function(value) {
			this.sceneObject.coneSize = value;
		},
		get: function() { return this.sceneObject.coneSize; }
	});
	
	Object.defineProperty(this, 'hasInstructions', {
		get: function() { return this.sceneObject.hasInstructions; }
	});
	
	Object.defineProperty(this, 'instructions', {
		get: function() {
			var obj = this.sceneObject.instructions;
			// Automatically rotate so the order of instructions doesn't flip on the left
			// We always want it to be ABC. Without this, the atom on the left becomes CBA.
			this.sceneObject.__instructions.rotation.y = (this.direction == SGE.LEFT?SGE.TAU/2:0);
			return obj;
		}
	});
	
	this.__init();
}

// Current loops are also handled automatically. There's only one current loop per experiment.
// It moves to the right, by default, since only one tutorial called for it.
SGE.CurrentLoop = function() {
	SGE.ExperimentObject.call(this);
	this.__SUBCLASS = "CurrentLoop";
	this.sceneObject = new SGE.SceneObjects.CurrentLoop();
	this.attachable = false;
	this.detected = false;
	
	if (SGE.debug) this.sceneObject.debugBox = [1,1,1];
	
	Object.defineProperty(this, 'spin', {
		set: function(value) {
			this.sceneObject.spin = value;
			if (this.__angleMeter) {
				this.__angleMeter.angle = value;
				this.__angleMeter.update();
			}
		},
		get: function() { return this.sceneObject.spin; }
	});
	
	Object.defineProperty(this, 'fieldAngle', {
		set: function(value) {
			this.sceneObject.fieldAngle = value;
		},
		get: function() {
			return this.sceneObject.fieldAngle;
		}
	});
	
	Object.defineProperty(this, 'fieldIntensity', {
		set: function(value) {
			this.sceneObject.fieldIntensity = value;
		},
		get: function() {
			return this.sceneObject.fieldIntensity;
		}
	});
	
	Object.defineProperty(this, 'spinFrequency', {
		set: function(value) {
			this.sceneObject.spinFrequency = value;
		},
		get: function() { return this.sceneObject.spinFrequency; }
	});
	
	Object.defineProperty(this, 'precessionFrequency', {
		set: function(value) {
			this.sceneObject.precessionFrequency = value;
		},
		get: function() { return this.sceneObject.precessionFrequency; }
	});
	
	Object.defineProperty(this, 'loopSize', {
		set: function(value) {
			this.sceneObject.loopSize = value;
		},
		get: function() { return this.sceneObject.loopSize; }
	});
	
	this.resetAnimation = function() {
		this.sceneObject.resetAnimation();
	}
	
	this.animate = function(t, delta) { this.sceneObject.animate(t, delta); }
	
	this.__init();
}

// Animation manager
SGE.AnimationManager = {};
SGE.AnimationManager.objects = {};
SGE.AnimationManager.timeFactor = 1;
SGE.AnimationManager.__lastTime = 0;
// Add an object to the list of animated objects
// The object must implement the .animate(t, delta) method
SGE.AnimationManager.add = function(obj) {
	if (typeof(obj.animate) != "function") {
		SGE.error("Object is not animated.");
	}
	this.objects[obj.uid] = {
		object: obj,
		// The offset marks when the object was added to the manager. This way, absolute
		// time for the object is relative to when its own animation was started
		offset: this.__lastTime
	};
}
// Remove object from the list of animated objects
SGE.AnimationManager.remove = function(obj) {
	if (obj.uid in this.objects) delete this.objects[obj.uid];
}
// Pass animation to all objects
SGE.AnimationManager.animate = function(t, delta) {
	for(var i in this.objects) this.objects[i].object.animate(
		(t - this.objects[i].offset)*this.timeFactor,
		delta*this.timeFactor
	);
	this.__lastTime = t;
}


// #################################################################################################
// Animation toolkit
// A wrapper for TweenMax with automatic queuing
// (ToDo: remove if never used)
SGE.Animation = {};

// Curve for time acceleration (SGE.AnimationManager.timeFactor)
// This creates a speed-up, a plateau at a max value and then a slow down
// Min value is assumed to be 1 (normal speed)
// n			current value (0 <= n <= total)
// total		final value
// rampup		amount of n to reach max
// rampdown		amount of n to go down to min
// power		power of ramp function
// max			maximum value reached
//
// Details: This function is useful to make sped-up simulations feel more natural.
// We usually want the simulation to accelerate so we can get through it faster
// But stopping at the end suddenly is bad. It's much more interesting to have a slow-down
// at the end.
SGE.Animation.TimeCurve = function(n, total, rampup, rampdown, power, max) {
	var v = max;
	if (n < rampup) {
		v = Math.pow( (n/rampup), power );
	} else if (n > (total-rampdown)) {
		v = Math.pow( ((total-n)/rampdown), power );
	}
	return 1 + Math.abs(v*(max - 1));
}

SGE.Animation.Tween = function(object, time, props, paused) {
	this.__onComplete = null;
	this.__next = null;
	this.__tween = null;
	
	this.init = function(object, time, props, paused) {
		// Default ease
		props.ease = ifdef(props.ease, Power2.easeInOut);
		
		var T = this;
		props.onComplete = function(){ T.onComplete(T); };
		
		// Tween object
		this.__tween = TweenMax.to(object, time, props);
		
		// Pause if paused can be evaluated to true
		if (!!paused == true) this.pause();
	}
	
	this.pause = function() {
		this.__tween.pause();
	}
	
	this.resume = function() {
		this.__tween.resume();
	}
	
	this.onComplete = function() {
		if (typeof(this.__onComplete) == "function") this.__onComplete();
	}
	
	this.tween = function(object, time, props) {
		var t = new SGE.Animation.Tween(object, time, props, true);
		this.__onComplete = function(){ t.resume(); }
		return t;
	}
	
	this.then = function(f) {
		this.__onComplete = f;
	}
	
	this.init(object, time, props, paused);
}

// Alias for new object
SGE.tween = function(object, time, props) {
	return new SGE.Animation.Tween(object, time, props);
}

// Symbols for message box
SGE.Symbols = {};
SGE.Symbols.create = function(n, text, scale) {
	scale = ifdef(scale, 1);
	return this.__textVersion = $("<span>")
		.html(text)
		.css('display', 'inline-block')
		.css('vertical-align', 'middle')
		.css('width', "25px")
		.css('margin', "0 "+(-Math.floor((1-scale)*25/2))+"px")
		.css('height', "25px")
		.css('overflow', "hidden")
		.css('transform', "scale("+scale+") translate(0px,"+(-(1-scale)*25/2)+"px)")
		.css('background-image', "url('" + SGE.asset('symbols.png') + "')")
		.css('background-repeat', "no-repeat")
		.css('background-position', (-25*n) + "px 0px")
		.css('text-indent', "-9999px")
		.prop('outerHTML');
}
SGE.Symbols.PLUS		= SGE.Symbols.create(0, "(+)");
SGE.Symbols.MINUS		= SGE.Symbols.create(1, "(&ndash;)");
SGE.Symbols.CLOSED		= SGE.Symbols.create(2, "(&times;)");
SGE.Symbols.OPEN		= SGE.Symbols.create(3, "(▸)");
SGE.Symbols.RED			= SGE.Symbols.create(4, "{+}");
SGE.Symbols.BLUE		= SGE.Symbols.create(5, "{&ndash;}");
SGE.Symbols.RED_SMALL 	= SGE.Symbols.create(4, "{+}", 0.7);
SGE.Symbols.BLUE_SMALL	= SGE.Symbols.create(5, "{&ndash;}", 0.7);
SGE.Symbols.X			= "<strong style=\"color:#C00\">x</strong>";
SGE.Symbols.Y			= "<strong style=\"color:#0C0\">y</strong>";
SGE.Symbols.Z			= "<strong style=\"color:#00D\">z</strong>";

// #################################################################################################
// Initialization of the engine
SGE.init();
