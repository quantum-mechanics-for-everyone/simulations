// #################################################################################################
// QUANTUM Engine
// Copyright (C) 2015-2016 Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Dylan Cutler (https://github.com/DCtheTall)
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


/*

Quantum Mechanics Interactive Engine
------------------------------------
Author: Dylan Cutler
--------------------

This is a JavaScript engine for creating interactive animated
tutorials on Feynman's quantum mechanics and quantum seeing in the
dark. This engine. The engine consists of a single context object,
QUANTUM, which contains class definitions for different components in
the exercise.

The engine uses the following dependencies:

- Raphael.js: An SVG library for rendering 2-D graphics
- jQuery: A JavaSCript library for manipulating the DOM
- Hammer/jQuery Hammer plugin: A library for handling touch screen compatibility
- Three.js: A JavaScript libary for rendering 3D graphics using WebGL
- mirror.js: A Three.js program for rendering mirrors in WebGL

*/

// This context object, QUANTUM, is defined in the global scope.
// This object contains functions and class constructors that are
// called in each individual exercise.
var QUANTUM = {

  //== CONSTANTS ==//

  // Scale factor
  _SCALE_FACTOR: 1,

  // Animation frame rate
  _ANIMATION_FRAMERATE: 60,

  // Photon color
  _PHOTON_COLOR: 'RED',

  // CSS browser prefix
  // set in the engine's init function
  _BROWSER_PREFIX: null,

  // Boolean for developer mode
  _DEVELOPER_MODE: false,

  // Boolean for WebGL compatibility (set when app initializes)
  _WEB_GL_SUPPORT: null,

  // Boolean for texture compaitibility, mobile devices do not have powerful
  // enough GPUs for all of the textures
  _TEXTURE_SUPPORT: true,

  // Boolean for reducing label size of 3D objects
  _REDUCE_LABEL_SIZE: null,

  // Boolean for updating labels
  _UPDATE_LABELS: false,

  // Remote assets are stored in this object
  _REMOTE_ASSETS: {
    'METAL TEXTURE': 'metal.jpg'
  },

  // Introductory message to users (set to a string in experiments)
  _INTRO_MESSAGE: null,

  //== MEMORY FOR CLASSES ==//

  // This will be set to a function in each individual experiment's program
  // it will be initialized to a
  experiment: null,

  // This will be set to a Tutorial object (defined below) in each experiment
  tutorial: null,

  // Children objects
  children: {},

  // Instance of the Application object
  instance: null,

  // Instance of the Animator object
  animator: null,

  // Lightpaths in the experiment (for 2D and 3D)
  lightPaths: [],

  // Mirrors (for 2D and 3D)
  mirrors: [],

  //-- Elements for 2D experiments

  // Photon source
  photonSources: [],

  // Photon detectors:
  photonDetectors: [],

  // Beam splitters
  beamSplitters: [],

  // Amplitude boxes
  amplitudeBoxes: [],

  //-- These are used in 3D experiments --//

  // Three.js Scene object
  scene: null,

  // Three.js PerspectiveCamera object
  camera: null,

  // Three.js WebGLRenderer object
  renderer: null,

  // Three.js children objects
  threeChildren: {},

  // Three.js mirror objects
  threeMirrors: [],

  // Polarizers
  polarizers: [],

  //== GENERAL CLASS CONSTRUCTORS ==//

  // General child class constructor
  // inputs are:
  // - Reference for object in QUANTUM scope
  // - x, y coordinates of upper left corner
  // - width (w) and height (h) of child
  Child: function(name, x, y, w, h) {
    // Appending this child to the engine's memory
    this.name = name;
    QUANTUM.children[name] = this;

    // Memory of children of this object
    this.children = {};

    // Sometimes useful to have these be accessible in other scopes
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;

    // Shorthand for scale factor
    var s = QUANTUM._SCALE_FACTOR;

    // Child renders HTML div which contains all other graphics
    var div = document.createElement('div');
    this.div = div;

    // Creating a publicly accessible jQuery object
    this.$ = $(div);

    // Styling HTML div
    this.$.css({
      'position': 'absolute',
      'left': (x * s) + 'px',
      'top': (y * s) + 'px',
      'width': (w * s) + 'px',
      'height': (h * s) + 'px'
    });

    // Methods for styling HTML div

    // Fill background with a solid color
    this.fill = function(r, g, b) {
      div.style.background = 'rgb(' + r +','+ g +','+ b +')';
    }

    // Fill background with a gradient with an arbitrary amount of colors
    // Inputs (not specified here) are
    // - Direction of gradient (up, down, left, right)
    // - Color objects which contain values
    this.fillWithGradient = function() {
      arguments = Array.prototype.slice.call(arguments);

      // CSS gradient prefix
      var prefix = QUANTUM._BROWSER_PREFIX;

      // Creating gradient string
      var gradString = 'linear-gradient(' + arguments[0] + ',';
      for(var i = 1; i < arguments.length; i++) {
        gradString += 'rgb(' +
          arguments[i][0] + ',' +
          arguments[i][1] + ',' +
          arguments[i][2] + ')';
          if(i !== arguments.length - 1) gradString += ','
          else gradString += ')';
      }

      // Styling HTML div
      div.style.background = prefix + gradString;
    }

    // Add outline stroke
    this.addStroke = function(r, g, b) {
      div.style.border = 'solid ' + s + 'px rgb('+ r +','+ g +','+ b +')';
    }

    // Add drop shadow
    this.addShadow = function() {
      div.style.boxShadow = (2*s) +'px '+ (2*s) +'px '+ (5*s) +'px rgba(0,0,0,0.4)';
    }

    // RaphaelJS setup

    var paper;
    this.paper = null;

    // Add a Raphael paper object to this DOM node
    this.addRaphaelPaper = function() {
      paper = new Raphael(div, w*s, h*s);
      this.paper = paper;
    }

    // Transformation methods

    // Useful quantities:
    // Position
    var r = new THREE.Vector2(x, y);

    // Translate child object by vector <dx, dy>
		this.translate = function(dx, dy) {
      // Translation vector gets updated
      r.x += dx; r.y += dy;

      // Performing translation using jQuery
			this.$.css({
				left: (r.x * s) + 'px',
				top: (r.y * s) + 'px'
			});
		}

    // Other methods

    // Hide window
    // input is a boolean which determines if the app renders a fade animation
    this.hide = function(animate) {
      if(animate) this.$.fadeOut()
      else this.$.hide();
    }

    // Show window
    // input is duration of fade in animation
    this.show = function(duration) {
      this.$.fadeIn({ 'duration': duration !== undefined? duration : 400 });
    }

    // Add child object
    this.addChild = function(child) {
      child.parent = this;
      this.children[child.name] = child;
      div.appendChild(child.div);
    }

    //-- Blink feature, a glow to grab users' attention --//

    var blinkTimer = 0;
    this.blinkHold = false;

    // Blink feature
    /* If the hold is set to true, half the blink animation
    executes, and it is left glowing. The full animation lasts 600
    milliseconds (300 if blink is held). */
    this.blink = function(hold) {
      // Blink hold is a public boolean so the Child knows if it's blink feature
      // is active
      this.blinkHold = hold !== undefined? hold : false;

      if(blinkTimer <= (hold? 300 : 600)) {
        var blinkSize = 10 * Math.pow(Math.sin(Math.PI * blinkTimer / 600), 2);
        blinkSize *= QUANTUM._SCALE_FACTOR;
        this.$.css({
          'box-shadow': '0 0 '+ Math.floor(blinkSize) +'px '+ Math.floor(blinkSize) +'px #ffff99'
        });

        // Using setTimeout to recursively call function for animation
        var self = this;
        setTimeout(function() {
          blinkTimer += 10;
          self.blink(hold);
        }, 10);
      }
      else blinkTimer = 0; // Reset timer once animation ends
    }

    // Blink off animation
    this.blinkOff = function() {
      this.blinkHold = false;

      if(blinkTimer < 300) {
        var blinkSize = 10 * Math.pow(Math.cos(Math.PI * blinkTimer / 600), 2);
        blinkSize *= QUANTUM._SCALE_FACTOR;
        this.$.css({
          'box-shadow': '0 0 '+ Math.floor(blinkSize) +'px '+ Math.floor(blinkSize) +'px #ffff99'
        });

        // Rescursive call
        var self = this;
        setTimeout(function() {
          blinkTimer += 10;
          self.blinkOff();
        }, 10);
      }
      else blinkTimer = 0; // Reset timer once animation ends
    }

    // Reset blink graphic
    this.resetBlink = function() {
      blinkTimer = 0;
      this.$.css('box-shadow', '');
    }
  },
  // Method for removing child object
  removeChild: function(child) {
    if(!child || child.div === undefined) return;
    child.parent.div.removeChild(child.div);
    delete child.parent.children[child.name];
    delete QUANTUM.children[child.name];
  },
  // End of class definition for Child object

  // Text box object constructor
  // inputs are
  // - reference of the object in the QUANTUM scope
  // - x, y coordinates of top left of the text
  // - font size (pixels)
  // - color of the text (Array)
  TextBox: function(name, x, y, size, color) {
    // This object is an instance of a child object
    QUANTUM.Child.call(this, name, x, y, 0, 0);

    // Shorthand for the scale
    var s = QUANTUM._SCALE_FACTOR;

    // Adding CSS styles to the text box
    this.$.css({
      '-moz-user-select': 'none',
      'user-select': 'none',
      '-webkit-user-select': 'none',
      '-ms-user-select': 'none',
      'cursor': 'default',
      'font-family': 'Roboto',
      'font-size': (size * s) + 'px',
      'color': Array.prototype.slice.call(arguments).length === 5?
        'rgb('+ color[0] +','+ color[1] +','+ color[2] +')' :
        'rgb(0, 0, 0)'
    });

    // Methods

    // Set content of text box
    this.setContent = function(content) {
      this.div.innerHTML = content;
    }

    // Center the text
    // the input is the width of the window you are centering the text in.
    this.center = function(width) {
      this.$.css({
        'width': (width * s) + 'px',
        'text-align': 'center'
      });
    }

    // Add text shadow
		this.addTextShadow = function() {
			var strokeString = '2px 2px 5px rgba(0,0,0,0.5)';
			this.$.css('text-shadow', strokeString);
		}

    // Add text shadow
		this.addTextStroke = function() {
			var strokeString = '-1px -1px 0px #000, '+
   			'1px -1px 0px #000, '+
    		'-1px 1px 0px #000, '+
     		'1px 1px 0px #000';
			this.$.css('text-shadow', strokeString);
		}

    // Add box shadow behind the text
    this.addBoxShadow = function() {
      this.$.css('background', '#000000');
    }
  },
  // End of TextBox class constructor

  // General constructor for a wrapper around a child object of Raphael
  // inputs are:
  // - reference of the object in the scope of its parent
  // - parent of this object (Child object)
  // - plain JS object with information about the graphics
  RaphaelChild: function(name, parent, data) {
    if(!parent.paper) {
      console.log('Need to initialize Raphael object in ' + parent.name);
      return;
    }

    // Storing this object in its parent's memory
    this.name = name;
    parent.children[name] = this;

    // References for the Raphael child object and its parent (paper)
    var raphaelChild
    ,   paper = parent.paper
    // Shorthad for scale factor
    ,   s = QUANTUM._SCALE_FACTOR;

    // Creating graphic
    // different types are below, the type determines what the data object
    // contains
    this.type = data.type;
    switch(data.type) {
      // Object renders a rectangle
      // data object contains:
      // - x, y coordinates of top left corner
      // - width (w) and height(h) of the rectangle
      // - color of the outline stroke
      // - color of the rectangle's body
      case 'rect':
        raphaelChild = paper.rect(data.x*s, data.y*s, data.w*s, data.h*s).attr({
          'stroke': data.stroke,
          'stroke-width': data.hasOwnProperty('width')? data.width * s : s,
          'fill': data.color
        });
        break;
      // Object renders an SVG path
      // data object contains:
      // - color of path
      // - width of path
      // - x0, y0 coordinates of the first point in the path
      case 'path':
        raphaelChild = paper.path().attr({
          'stroke': data.color,
          'stroke-width': data.hasOwnProperty('width')? data.width * s : s,
        });
        var path = 'M ' + (data.x0 * s) + ' ' + (data.y0 * s) + ' ';
        break;
      // Object renders an ellipse
      // data object contains:
      // - cx, cy coordinates of the center of the ellipse
      // - horizontal radius (rx) and vertical radius (ry)
      // - color of the outline stroke
      // - color of the ellipse's body
      case 'ellipse':
        raphaelChild = paper.ellipse(data.cx*s, data.cy*s, data.rx*s, data.ry*s).attr({
          'stroke': data.stroke,
          'stroke-width': data.hasOwnProperty('width')? data.width * s : s,
          'fill': data.color
        });
        break;
    }

    // Useful quantities to have publicly accessible

    // Reference to the RaphaelJS child object
    this.graphic = raphaelChild;
    // Reference to the graphic's DOM node
    this.node = raphaelChild.node;
    // Reference to the jQuery object
    this.$ = $(raphaelChild.node);

    //-- Methods --//

    // These methods are specific to the SVG path graphics
    // Add point, arguments are pairs of points
    this.addPoint = function() {
      arguments = Array.prototype.slice.call(arguments);
      for(var i = 0; i < arguments.length/2; i++)
        path += 'L ' + (arguments[2*i] * s) + ' ' + (arguments[2*i+1] * s) + ' ';
      raphaelChild.attr('path', path);
    }
    // Close path
    this.close = function() {
      path += 'Z';
      raphaelChild.attr('path', path);
    }

    // Fill graphic with color determined by hex string
    this.fill = function(colorHex) {
      raphaelChild.attr('fill', colorHex);
    }

    // Add inner bevel
    this.addInnerBevel = function() {
      this.bevel = raphaelChild.clone();
      this.bevel.translate(QUANTUM._SCALE_FACTOR, QUANTUM._SCALE_FACTOR);
      this.bevel.attr('opacity', 0.5);
      if(raphaelChild.attr('stroke') === 'none') this.bevel.attr('fill', '#fff')
      else this.bevel.attr('stroke', '#fff')
      this.bevel.toBack();
    }

    //-- Transformation methods --//

    // Useful quantities:
    // Translation vector
    var t = new THREE.Vector2(0, 0)
    // Angle of rotation (deg)
    ,  theta = 0;

    // Translate graphic
    this.translate = function(dx, dy) {
      // Updating translation vector
      t.x += dx; t.y += dy;

      // Transforming graphic
      raphaelChild.transform(
        't' + t.x * s +','+ t.y * s +','+ // Applying translation matrix
        'r' + theta // Applying rotation matrix
      );
    }

    // Rotate graphic an angle theta (deg) around a point
    this.rotate = function(angle) {
      // Saving the new rotation angle
      theta = angle;
      // Transforming graphic
      raphaelChild.transform(
        't' + t.x * s +','+ t.y * s +','+ // Applying translation matrix
        'r' + theta // Applying rotation matrix
      );

      // Rotating the bevel graphic if it exists
      if(this.bevel) this.bevel.transform(
        't' + QUANTUM._SCALE_FACTOR +','+ QUANTUM._SCALE_FACTOR +','+
        'r' + theta
      );
    }

    //-- Animation methods --//

    // Translation animation

    var t_progress = 0
    ,   t_vector = new THREE.Vector2()
    ,   dS = new THREE.Vector2();

    // Defining the object property for translation progress,
    // this syntax allows me to overload set and get
    Object.defineProperty(this, 't_progress', {
      set: function(value) {
        t_progress = value;

        // Translating the graphic with a series of translation, the graphic
        // gets translated vector dS iteravitely every frame. The rounding
        // error is handled in the animator object
        if(dS.x || dS.y) this.translate(-dS.x, -dS.y);
        dS.set(t_vector.x * t_progress, t_vector.y * t_progress);
        this.translate(dS.x, dS.y);
      },
      get: function() {
        return t_progress;
      }
    });

    // Move graphic by vector deltaS
    // inputs are:
    // - time animation takes (seconds)
    // - translation vector (Array)
    // - callback function executed at completion
    this.move = function(time, deltaS, callback) {
      t_vector.set(deltaS[0], deltaS[1]);

      // Animator object has application render an animation
      QUANTUM.animator.to(this, {t_progress: 1}, time, function() {
        t_progress = 0;
        dS.set(0, 0);
        if(callback !== undefined) callback();
      });
    }

    // Rotation animation

    var r_progress = 0
    ,   initialAngle = null
    ,   targetAngle = null;

    // Defining the object property for rotation progress
    // this syntax allows me to overload the set and get
    Object.defineProperty(this, 'r_progress', {
      set: function(value) {
        r_progress = value;

        // Iteratively rotates the graphic
        var dTheta = (targetAngle - initialAngle) * r_progress;
        this.rotate(dTheta);
      },
      get: function() {
        return r_progress;
      }
    });

    // Animate rotation graphic by angle (theta)
    // inputs are:
    // - time animation takes (seconds)
    // - angle of rotation
    this.animateRotation = function(time, angle, callback) {
      // Setting the initial and target angles
      initialAngle = theta;
      targetAngle = angle;

      // Animator object has application render the animation
      QUANTUM.animator.to(this, {r_progress: 1}, time, function() {
        r_progress = 0;
        if(callback !== undefined) callback();
      });
    }

    //-- Hide/Show child --//

    this.hide = function(animate) {
      if(animate) this.$.fadeOut()
      else this.$.hide();
    }

    this.show = function(duration) {
      this.$.fadeIn({
        duration: duration
      })
    }

    //-- Remove child --//

    this.remove = function() {
      // Removing the Raphael child object
      this.graphic.remove();
      if(this.bevel) this.bevel.remove();
      // Removing this from the memory of its parent
      delete parent.children[name];
    }
  },
  // End of RaphaelChild class constructor

  // Arrow class constructor
  // this class renders a 2D arrow using the RaphaelChild class
  // inputs are:
  // - parent object which contains the Raphael paper it will be rendered on
  // - name of the arrow
  // - data, a plain JS object with the properties:
  //   - x, y coordinates of the center of the tail of the arrow
  //   - width, length of the arrow and of the head of the arrow
  //   - color of the outline stroke
  //   - color of the arrow
  Arrow: function(name, parent, data) {
    // This class is an instance of the RaphaelChild class
    QUANTUM.RaphaelChild.call(this, name, parent, {
      type: 'path',
      color: data.stroke,
      width: 3,
      x0: data.x, y0: data.y
    });

    // Drawing the arrow
    var w = data.width/2
    ,   hw = data.headWidth/2
    ,   hl = data.length - data.headLength

    with(this) {
      fill(data.color);
      addPoint(
        data.x + w,  data.y,
        data.x + w,  data.y - hl,
        data.x + hw, data.y - hl,
        data.x,      data.y - data.length,
        data.x - hw, data.y - hl,
        data.x - w,  data.y - hl,
        data.x - w,  data.y
      );
      close();
    }

    //-- Methods --//

    var s = QUANTUM._SCALE_FACTOR;

    // Redefining the rotate function so that it rotates the arrow about the
    // end of its tail
    // input is angle of rotation (deg)
    this.rotate = function(theta) {
      this.graphic.transform('r'+ theta +','+ (s * data.x) +','+ (s * data.y));
    }
  },

  //== 2D EXPERIMENT OBJECTS ==//

  // ExperimentBox class constructor
  // this class renders a grid that the 2D experiments are rendered on
  // inputs are:
  // - x, y coordinates of the experiment
  // - width, height of the experiment
  ExperimentBox: function(x, y, w, h) {
    // This object is an instance of the Child class
    QUANTUM.Child.call(this, 'exp-box', x, y, w, h);
    this.addStroke(100, 100, 100);
    this.fillWithGradient('135deg', [120, 120, 120], [150, 150, 150], [120, 120, 120]);

    // This object contains the grid
    var grid = new QUANTUM.Child('exp-grid', 4, 4, w-10, h-10);
    grid.addStroke(120, 120, 120);
    grid.fillWithGradient('135deg', [170, 170, 170], [190, 190, 190], [170, 170, 170]);
    grid.addRaphaelPaper();
    this.addChild(grid);
    // Adding horizontal lines
    for(var i = 1; i < h/10 - 1; i++) {
      var line = new QUANTUM.RaphaelChild('exp-h-'+i, grid, {
        type: 'path',
        color: '#555',
        width: 0.2,
        x0: 0, y0: 10*i
      });
      line.addPoint(w-10, 10*i);
    }
    // Adding vertical lines
    for(var i = 1; i < w/10 - 1; i++) {
      var line = new QUANTUM.RaphaelChild('exp-v-'+i, grid, {
        type: 'path',
        color: '#555',
        width: 0.2,
        x0: 10*i, y0: 0
      });
      line.addPoint(10*i, h-10);
    }

    // This Child contains the components of the experiment
    var exp = new QUANTUM.Child('exp', 0, 0, w-10, h-10);
    exp.addRaphaelPaper();
    grid.addChild(exp);

    // Add label to experiment
    // inputs are:
    // - label content
    // - x, y coordinates of top left corner of label
    this.addLabel = function(content, x, y, large) {
      large = large === undefined? false : large;

      var label = new QUANTUM.TextBox(content+'-label', x, y, large? 24 : 18, [255, 255, 255])
      ,   s = QUANTUM._SCALE_FACTOR;
      label.$.css('width', (200*s)+'px')
      label.addTextStroke();
      label.setContent(content);
      exp.addChild(label);
    }
  }, // End of ExperimentBox class constructor

  // PhotonSource class constructor
  // This class renders a photon source graphic and has some animation methods
  // inputs are:
  // - x, y coordinates of the center of the source (cx, cy)
  PhotonSource: function(cx, cy) {
    if(name === undefined) name = ''
    else name += '-'

    QUANTUM.photonSources.push(this);

    // Experiment box, the parent of all of the graphics
    var exp = QUANTUM.children['exp'];

    // Graphics

    // This set contains all of the graphics for the source and
    // is used for the blink feature
    var set = exp.paper.set()
    // This group is used for the blink feature below as well
    ,   g = exp.paper.group()
    // Reference to the application's scale
    ,   s = QUANTUM._SCALE_FACTOR;

    // Lens that photon leaves from
    var lens = new QUANTUM.RaphaelChild('source-'+name+'lens', exp, {
      type: 'ellipse',
      stroke: '#c00',
      color: '90-#f99-#f00',
      cx: cx+15, cy: cy,
      rx: 6, ry: 15
    })
    ,   highlight = new QUANTUM.RaphaelChild('source-'+name+'highlight', exp, {
      type: 'ellipse',
      color: '#fff',
      cx: cx+17.5, cy: cy-7.5,
      rx: 2, ry: 3
    })
    ,   glow = lens.graphic.glow({ color: '#f22', size: 15*s })
    ,   glowNode = $(exp.paper.group().push(glow).node);
    glowNode.hide();
    set.push(lens.graphic, highlight.graphic, glow);
    highlight.graphic.attr('opacity', 0.4);

    // Metal shells
    var middleShell = new QUANTUM.RaphaelChild('source-'+name+'mid-shell', exp, {
      type: 'rect',
      x: cx-20, y: cy-15,
      w: 35, h: 30,
      stroke: '#444',
      color: '90-#999-#ddd-#999'
    })
    ,   leftShell = new QUANTUM.RaphaelChild('source-'+name+'left-shell', exp, {
      type: 'rect',
      x: cx-20, y: cy-20,
      w: 5, h: 40,
      stroke: '#444',
			color: '90-#999-#ddd-#999'
    })
    ,   rightShell = new QUANTUM.RaphaelChild('source-'+name+'right-shell', exp, {
      type: 'rect',
      x: cx+10, y: cy-20,
      w: 5, h: 40,
      stroke: '#444',
      color: '90-#999-#ddd-#999'
    });
    set.push(middleShell.graphic, leftShell.graphic, rightShell.graphic);

    // Glow for blink method
    var clone = set.clone().attr({ fill: 'none', stroke: 'none' }).toBack()
    ,   blinkGlow = clone.glow({ size: 20*s, color: '#ff9' }).toBack()
    ,   blinkNode = $(g.push(blinkGlow).node);
    blinkNode.hide();

    // Creating a DOM node out of the graphics
    var group = exp.paper.group()
      .push(lens.graphic)
      .push(highlight.graphic)
      .push(middleShell.graphic)
      .push(leftShell.graphic)
      .push(rightShell.graphic);

    //-- Methods --//

    // Rotate the photon source about its center
    this.rotate = function(degrees) {
      var rotation = 'r' + degrees +','+ (cx*s) +','+ (cy*s);
      set.transform(rotation);
      blinkGlow.transform(rotation);
      blinkGlow.toBack();
    }

    // Emit animation
    this.emit = function() {
      glowNode.fadeIn({
        duration: 200,
        complete: function() {
          glowNode.fadeOut({ duration: 200 });
        }
      });
    }

    // Blink feature

    // Blink on
    // input is boolean which determines if the glow stays on (hold = true means
    // it does)
    this.blink = function(hold) {
      blinkNode.fadeIn({
        duration: 300,
        complete: function() {
          if(!hold) blinkNode.fadeOut({ duration: 300 });
        }
      })
    }
    // Blink off animation
    this.blinkOff = function() {
      blinkNode.fadeOut({ duration: 300 });
    }
    // Reset blink glow
    this.resetBlink = function() {
      blinkNode.hide();
    }

    // Add event on photon source
    this.onPress = function(callback) {
      QUANTUM.addTapEvent({ source: this, node: group.node }, callback);
    }

    // Remove event
    this.offPress = function(callback) {
      QUANTUM.removeEvent(group.node);
    }

    // Add color label to photon source
    this.addColorLabel = function() {
      this.colorLabel = new QUANTUM.TextBox('photon-source-color-label', cx - 45, cy - 55, 30, [255, 0, 0]);
      this.colorLabel.center(100);
      this.colorLabel.setContent('RED');
      this.colorLabel.addTextStroke();
      this.colorLabel.hide();
      this.colorLabel.show(500);
      QUANTUM.children['exp-box'].addChild(this.colorLabel);
    }

    // Change the color of the source
    this.changeColor = function() {
      var strokeColor, gradientColor;
      // Change color label
      switch(QUANTUM._PHOTON_COLOR) {
        case 'RED':
          strokeColor = '#c00';
          gradientColor = '90-#f99-#f00';
          this.colorLabel.setContent('RED');
          this.colorLabel.$.css('color', '#ff0000');
          break;
        case 'GREEN':
          strokeColor = '#090';
          gradientColor = '90-#9f9-#0f0';
          this.colorLabel.setContent('GREEN');
          this.colorLabel.$.css('color', '#33bb33');
          break;
        case 'BLUE':
          strokeColor = '#009';
          gradientColor = '90-#bbf-#44f';
          this.colorLabel.setContent('BLUE');
          this.colorLabel.$.css('color', '#6666ff');
          break;
      }
      // Change color of the lens
      lens.graphic.attr({
        stroke: strokeColor,
        fill: gradientColor
      });
    }
  }, // End of PhotonSource class constructor

  // PhotonDetector class constructor
  // inputs are:
  // - cx, cy coordinates of the center of the detector
  // - optional
  PhotonDetector: function(cx, cy, name) {
    if(name === undefined) name = ''
    else name += '-';

    // Adding to photon detectors
    QUANTUM.photonDetectors.push(this);

    // Experiment box, the parent of all of the graphics
    var exp = QUANTUM.children['exp'];

    // Graphics

    // This set contains all of the graphics for the source and
    // is used for the blink feature
    var set = exp.paper.set()
    // This group is used for the blink feature below as well
    ,   g = exp.paper.group()
    // Scale of application
    ,   s = QUANTUM._SCALE_FACTOR;

    // Lens that photon leaves from
    var lens = new QUANTUM.RaphaelChild('detector-'+name+'lens', exp, {
      type: 'ellipse',
      color: '90-#fff-#8cf',
 			stroke: '#66f',
      cx: cx-15, cy: cy,
      rx: 6, ry: 15
    })
    ,   highlight = new QUANTUM.RaphaelChild('detector-'+name+'highlight', exp, {
      type: 'ellipse',
      color: '#fff',
      cx: cx-17.5, cy: cy-7.5,
      rx: 2, ry: 3
    });
    set.push(lens.graphic, highlight.graphic);
    highlight.graphic.attr('opacity', 0.4);

    // Metal shells
    var middleShell = new QUANTUM.RaphaelChild('detector-'+name+'mid-shell', exp, {
      type: 'rect',
      x: cx-15, y: cy-15,
      w: 35, h: 30,
      stroke: '#333',
      color: '90-#555-#999-#555'
    })
    ,   leftShell = new QUANTUM.RaphaelChild('detector-'+name+'left-shell', exp, {
      type: 'rect',
      x: cx-15, y: cy-20,
      w: 5, h: 40,
      stroke: '#333',
			color: '90-#555-#999-#555'
    })
    ,   rightShell = new QUANTUM.RaphaelChild('detector-'+name+'right-shell', exp, {
      type: 'rect',
      x: cx+15, y: cy-20,
      w: 5, h: 40,
      stroke: '#333',
      color: '90-#555-#999-#555'
    });
    set.push(middleShell.graphic, leftShell.graphic, rightShell.graphic);

    // This graphic blinks to indicate the detector sees a photon
    var blinkerGlass = new QUANTUM.RaphaelChild('detector-'+name+'blinker', exp, {
      type: 'rect',
      x: cx-5, y: cy-10,
      w: 15, h: 20,
      color: '90-#fff-#8cf',
 			stroke: '#66f'
    })
    ,   blinker = blinkerGlass.graphic.clone().attr({ fill: '#ff9', stroke: 'none' })
    ,   glow = blinker.glow({ size: 15*s, color: '#ff9' })
    ,   glowNode = $(exp.paper.group().push(blinker).push(glow).node);
    set.push(blinkerGlass.graphic, blinker, glow);
    glowNode.hide();

    // Glow for blink method
    var clone = set.clone().attr({ fill: 'none', stroke: 'none' }).toBack()
    ,   blinkGlow = clone.glow({ size: 20*s, color: '#ff9' }).toBack()
    ,   blinkNode = $(g.push(blinkGlow).node);
    blinkNode.hide();

    // set.toFront();
    blinker.toFront();
    glow.toFront();

    //-- Methods --//

    // Rotate the photon source about its center
    this.rotate = function(degrees) {
      var s = QUANTUM._SCALE_FACTOR
      ,   rotation = 'r' + degrees +','+ (cx*s) +','+ (cy*s);
      set.transform(rotation);
      blinkGlow.transform(rotation);
      blinkGlow.toBack();
    }

    // This method starts an animation that signifies when the
    // detector sees a photon
    this.detect = function(two) {
      two = two === undefined? false : two;

      glow.toFront();
      blinker.toFront();

      glowNode.fadeIn({
        duration: 300,
        complete: function() {
          glowNode.fadeOut({
            duration: 300,
            complete: function() {
              if(two) glowNode.fadeIn({
                duration: 300,
                complete: function() {
                  glowNode.fadeOut({ duration: 300 });
                }
              })
            }
          });
        }
      })
    }

    // Blink feature

    // Blink on
    // input is boolean which determines if the glow stays on (hold = true means
    // it does)
    this.blink = function(hold) {
      blinkNode.fadeIn({
        duration: 300,
        complete: function() {
          if(!hold) blinkNode.fadeOut({ duration: 300 });
        }
      })
    }
    // Blink off animation
    this.blinkOff = function() {
      blinkNode.fadeOut({ duration: 300 });
    }
    // Reset blink glow
    this.resetBlink = function() {
      blinkNode.hide();
    }
  }, // End of PhotonDetector class

  // LightPath class constructor
  // this renders a 2D SVG path that represents a photon's path through the
  // experiment setup.
  // inputs are:
  // - x1, y1 coordinates of first point of the path
  // - x2, y2 coordinates of the second point of the path
  // - optional boolean 'refracted' can change the opacity of the path
  LightPath: function(x1, y1, x2, y2, refracted) {
    var exp = QUANTUM.children['exp']
    ,   i = QUANTUM.lightPaths.length;

    // This object is an instance of the RaphaelChild class
    QUANTUM.RaphaelChild.call(this, 'light-path-'+i, exp, {
      type: 'path',
      color: '#f00',
      width: 1.5,
      x0: x1, y0: y1
    });
    this.addPoint(x2, y2);
    this.graphic.toBack();
    if(refracted !== undefined && refracted)
      this.graphic.attr('opacity', 0.25);

    // Some useful public properties
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.length = Math.pow((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1), 0.5);

    //-- Methods --//

    // Blink feature to make path glow
    this.blink = function() {
      var s = QUANTUM._SCALE_FACTOR;
      this.graphic.attr({ 'stroke-width': 2.5*s, stroke: '#f90' });

      this.glow = this.graphic.glow({ size: 15*s, color: '#ff0' });
      this.glowNode = $(this.glow.node);
      this.glowNode.hide();
      this.glowNode.fadeIn({ duration: 500 });
    }

    // Blink off
    this.blinkOff = function() {
      if(this.graphic.attr('stroke') === '#f90') {
        var s = QUANTUM._SCALE_FACTOR;
        this.graphic.attr({ 'stroke-width': 1.5*s, stroke: '#f00' });
        this.glow.remove();
        this.glow = undefined;
        this.glowNode = undefined;
      }
    }

    // Adding this to the memory in QUANTUM object
    QUANTUM.lightPaths.push(this);
  }, // End of LightPath class

  // Photon constructor
  // this class renders a 2D photon graphic and has animation methods
  // inputs are:
  // - x, y coordinates of the photon's initial position
  Photon: function(x, y) {
    var exp = QUANTUM.children['exp'];

    // This is an instance of the RaphaelChild class
    QUANTUM.RaphaelChild.call(this, 'photon', exp, {
      type: 'ellipse',
      color: '#f00',
      rx: 5, ry: 5,
      cx: x, cy: y
    });

    // Poyinting vector
    var poynting = {x: 1, y: 0};

    //-- Methods --//

    // Set photon's poynting vector
    this.setPoyntingFromPath = function(index) {
      var path = QUANTUM.lightPaths[index]
      ,   x = (path.x2 - path.x1) / path.length
      ,   y = (path.y2 - path.y1) / path.length;
      poynting.x = x; poynting.y = y;
    }

    // Shoot photon
    this.shoot = function(time, distance, callback) {
      this.move(time, [distance * poynting.x, distance * poynting.y], callback);
    }
  },

  // Glass class constructor
  // this class renders a semi-opaque glass block in 2D experiments
  // it also can change size in the Mach Zehnder exercises
  // inputs are:
  // - x, y coordinates of top left corner
  // - initial width (w) and height (h) of the glass
  Glass: function(x, y, w, h) {
    var exp = QUANTUM.children['exp'];

    // This object is an instance of the RaphaelChild class
    QUANTUM.RaphaelChild.call(this, 'glass', exp, {
      type: 'rect',
      type: 'rect',
      x: x, y: y,
      w: w, h: h,
      color: '135-#8cf-#fff-#8cf',
 			stroke: '#66f'
    });
    this.$.fadeTo(0, 0.6);
    this.graphic.toBack();

    // x coordinate of the left edge of the glass
    this.x = x;
    // The length of the glass
    this.length = w;

    // Method for changing the length of the glass a length dL
    this.changeLength = function(dL) {
      this.length += dL;
      this.x -= dL/2;

      this.graphic.attr({
        'x': this.x * QUANTUM._SCALE_FACTOR,
        'width': this.length * QUANTUM._SCALE_FACTOR
      });
    }

    // Get the phase shift the glass causes in the Mach-Zehnder interferometer (deg)
    this.getDelta = function() {
      var dTheta = QUANTUM._PHOTON_COLOR === 'RED'? 5 :
        QUANTUM._PHOTON_COLOR === 'GREEN'? 7.5 : 10;

      return 0.2 * this.length * dTheta;
    }
  }, // End of Glass class

  // Mirror class constructor
  // this class renders a mirror graphic
  // inputs are:
  // - cx, cy coordinates of center of the interface the photon interacts with
  Mirror: function(cx, cy) {
    var i = QUANTUM.mirrors.length
    ,   exp = QUANTUM.children['exp'];

    // This object is a instance of the RaphaelChild class
    QUANTUM.RaphaelChild.call(this, 'mirror-'+i, exp, {
      type: 'rect',
      x: cx-40, y: cy+2,
      w: 80, h: 10,
      color: '0-#9bc-#fff-#9bc',
      stroke: '#66f'
    });
    this.graphic.toBack();
    QUANTUM.mirrors.push(this);

    // Changing the rotate function to have the mirror rotate about
    // the center of the interface (easier to position mirros this way)
    this.rotate = function(degrees) {
      var s = QUANTUM._SCALE_FACTOR;
      this.graphic.transform('r'+ degrees +','+ (cx*s) +','+ (cy*s));
    }
  }, // End of Mirror class

  // BeamSplitter class constructor
  // this class renders 2D beam splitter graphic that has can be rotated
  // inputs are:
  // - cx, cy coordinates of the center mirrored side of the beam splitter
  BeamSplitter: function(cx, cy) {
    var i = QUANTUM.beamSplitters.length
    ,   exp = QUANTUM.children['exp'];

    var mirror = new QUANTUM.RaphaelChild('bs-mirror-'+i, exp, {
      type: 'rect',
      x: cx-40, y: cy,
      w: 80, h: 4,
      color: '0-#8cf-#fff-#8cf',
 			stroke: '#66f'
    })
    ,   glass = new QUANTUM.RaphaelChild('bs-glass-'+i, exp, {
      type: 'rect',
      x: cx-40, y: cy+4,
      w: 80, h: 16,
      color: '0-#abb-#dee-#abb',
 			stroke: '#688'
    });
    mirror.graphic.toBack();
    glass.graphic.toBack();
    glass.$.fadeTo(0, 0.6);

    // Rotate about center
    this.rotate = function(degrees) {
      var s = QUANTUM._SCALE_FACTOR
      ,   rotation = 'r'+ degrees +','+ (cx*s) +','+ (cy*s);
      mirror.graphic.transform(rotation);
      glass.graphic.transform(rotation);
    }
  }, // End of BeamSplitter constructor

  //== DISPLAY WINDOWS FOR 2D EXPERIMENTS ==//

  // AmplitudeBox class constructor
  // this class renders a window which displays a photon's probability amplitude
  // inputs are:
  // - x, y coordinates of the top left corner of the window
  // - the content of the label in the window
  AmplitudeBox: function(x, y, labelContent) {
    var i = QUANTUM.amplitudeBoxes.length
    ,   s = QUANTUM._SCALE_FACTOR;

    // This object is an instance of the Child class
    QUANTUM.Child.call(this, 'amp-box-'+i, x, y, 200, 230);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.addShadow();
    QUANTUM.amplitudeBoxes.push(this);

    // Label
    var label = new QUANTUM.TextBox('amp-box-label-'+i, 0, 10, 18, [100, 100, 100]);
    label.center(200);
    label.setContent(labelContent);
    this.addChild(label);

    // Text resides in this Child object
    var contentBox = new QUANTUM.Child('amp-box-content-'+i, 10, 40, 180, 180);
    contentBox.fillWithGradient('90deg', [240, 240, 210], [255, 255, 230]);
    contentBox.addStroke(150, 140, 100);
    contentBox.addRaphaelPaper();
    this.addChild(contentBox);

    // Display text

    // Amplitude
    var ampText = new QUANTUM.TextBox('amp-box-'+i+'-amp-text', 0, 4, 16, [0, 0, 0]);
    ampText.center(180);
    ampText.setContent('Amplitude: 1');
    contentBox.addChild(ampText);

    //Radical 2 string
		var radTwoStr = '&radic;<span style="text-decoration: overline">2</span>'

    // Clock time
    var clockTime = new QUANTUM.TextBox('amp-box-'+i+'-clock-time', 0, 150, 16, [0, 0, 0]);
    clockTime.center(180);
    clockTime.setContent('Clock Time: 0:00');
    contentBox.addChild(clockTime);

    // 2D graphics

    // Axes that show horizontal and vertical direction
    var vertical = new QUANTUM.RaphaelChild('indicator-vertical-axis', contentBox, {
      type: 'path',
      width: 2,
      color: '#ddc',
      x0: 90, y0: 15
    });
    vertical.addPoint(90, 165);
    var horizontal = new QUANTUM.RaphaelChild('indicator-horizontal-axis', contentBox, {
      type: 'path',
      width: 2,
      color: '#ddc',
      x0: 15, y0: 90
    });
    horizontal.addPoint(165, 90);

    // Arrow that represents the amplitude

    var arrow = new QUANTUM.Arrow('amp-box-'+i+'-arrow', contentBox, {
      x: 90, y: 90,
      length: 60, width: 4,
      headWidth: 15, headLength: 15,
      color: '#000'
    })
    // Amplitude of the photon state
    ,   amplitude = 1
    // Phase angle
    ,   theta = 0
    // Initialized as a graphic in methods below for reflection/amplitude changes
    ,   shadow
    // Color of the arrow graphic (hex string)
    ,   arrowColor = '#000';

    this.theta = theta;
    this.amplitude = amplitude;

    //-- Methods --//

    // Blink feature

    // Blink on
    this.blink = function(hold) {
      contentBox.blink(hold);
    }
    // Blink off
    this.blinkOff = function() {
      contentBox.blinkOff();
    }
    // Reset blink
    this.resetBlink = function() {
      contentBox.resetBlink();
    }

    // Text blink (makes text larger and glow)
    // input is text: a string indicating whether ampText or clockTime gets enlarged
    var enlarged = false;
    this.textBlinkOn = function(text) {
      enlarged = true;
      if(text === 'clock')
        clockTime.$.animate({
          'font-size': (20 * s)+'px'
        }, 1000);
      else if(text === 'amplitude')
        ampText.$.animate({
          'font-size': (20 * s)+'px'
        }, 1000);
    }

    // Text blink off
    this.textBlinkOff = function() {
      if(!enlarged) return;
      clockTime.$.animate({
        'font-size': (16 * s)+'px'
      }, 1000);
      ampText.$.animate({
        'font-size': (16 * s)+'px'
      }, 1000);
    }

    // Change label
    // inputs are content and optional argument 'size'
    this.setLabel = function(content, size) {
      label.setContent(content);
      if(size !== undefined) {
        var s = QUANTUM._SCALE_FACTOR;
        label.$.css('font-size', (size * s)+'px');
      }
    }

    // Clear amplitude
    this.clearAmplitude = function() {
      if(arrow !== undefined) {
        arrow.remove();
        arrow = undefined;
      }

      amplitude = 1;
      this.amplitude = amplitude;

      theta = 0;
      this.theta = theta;
      ampText.setContent('Amplitude: ');
      clockTime.setContent('Clock Time: ');
    }

    // Rotate arrow
    // input is angle in degrees
    this.rotate = function(degrees) {
      if(isNaN(degrees)) {
        console.log('Need to input a number in rotate method for amp-box-'+i);
        return;
      }
      // Removes shadow if this is normal rotation
      if(degrees !== 0 && degrees !== 180) this.removeShadow();

      // Saving new angle
      theta += degrees;
      theta %= 360;
      this.theta = theta;

      // Rotating arrow
      arrow.rotate(theta);

      //Changing the clock time
			var clockHour = Math.floor(theta / 30)
			,   clockMin = (Math.floor(theta / 360 * 48 % 12) * 15) % 60;
			if(clockMin === 0) clockMin = '00';

			clockTime.setContent('Clock Time: '+ clockHour +':' + clockMin);
    }

    // Change amplitude
 		this.setAmplitude = function(amp) {
      // Saving new amplitude
 			amplitude = amp;
 			this.amplitude = amplitude;

      // Changing amplitude text
 			ampText.setContent('Amplitude: ' + Math.round(1000*amp)/1000);

 			var len = 60 * amp + (1 - Math.exp(-1) * Math.exp(amp)) * 20
 			,   hw = 15 * Math.pow(amp, 0.25) + 2;

      // Changing arrow graphic
      if(arrow !== undefined) arrow.remove();
      arrow = new QUANTUM.Arrow('amp-box-'+i+'-arrow', contentBox, {
        x: 90, y: 90,
        length: len, width: 4,
        headWidth: hw, headLength: hw,
        color: arrowColor
      });
      this.rotate(0);
 		}

    // Copy amplitude from another amplitude box
    this.copyAmplitude = function(ampBox, blink) {
      this.setAmplitude(ampBox.amplitude);
      this.rotate(ampBox.theta - this.theta);
      arrow.hide();
      arrow.$.fadeIn({duration: 300});
      if(blink !== undefined && blink) {
        ampBox.blink(true);
        this.blink(true);
      }
    }

    // Add six hours to the amplitude
    this.addSixHours = function() {
      this.removeShadow();
      shadow = arrow.graphic.clone().attr({ opacity: 0.2 });
      this.rotate(180);
    }

    // Remove shadow
    this.removeShadow = function() {
      if(shadow !== undefined) {
        shadow.remove();
        shadow = undefined;
      }
    }

    // Shrink amplitude by a factor of 1/sqrt2
    this.shrinkAmplitude = function() {
      this.removeShadow();
      shadow = arrow.graphic.clone().attr({ opacity: 0.2 });
      if(amplitude === 1) this.setAmplitude(Math.pow(0.5, 0.5))
      else if(amplitude === Math.pow(0.5, 0.5)) this.setAmplitude(0.5);
    }

    // Change arrow color
    this.setArrowColor = function(color) {
      arrowColor = color;
      arrow.graphic.attr('fill', color);
    }

    // Draw arc for additing angles animation
    // inputs are:
    // - angle: the angle of the arc in degrees
    // - rotated: a boolean which determines if the program rotates the arc
    //            to be in line with the arrow
    this.drawArc = function(angle, rotated) {
      // Arc is an SVG path
      this.arc = new QUANTUM.RaphaelChild('rotation-arc', contentBox, {
        type: 'path',
        width: 1.5,
        color: '#99a',
        x0: 90, y0: 90
      });
      this.arc.addPoint(90, 60);
      for(var i = 0; i < angle; i++)
        this.arc.addPoint(
          90 + 30 * Math.sin(Math.PI * i / 180),
          90 - 30 * Math.cos(Math.PI * i / 180)
        );
      this.arc.close();
      arrow.graphic.toFront();
      if(rotated) this.arc.graphic.transform('r'+ this.theta +','+ (90*s) +','+ (90*s));
      this.arc.hide();
      this.arc.show(400);
    }

    // Remove arc
    this.removeArc = function() {
      // Fade out arc
      if(this.arc !== undefined) {
        this.arc.hide(true);
        // Remove SVG path
        var self = this;
        setTimeout(function() {
          self.arc.remove();
          self.arc = undefined;
        }, 1000)
      }
    }

    //-- Animation methods --//

    // Translation
    this.animateTo = function(time, tx, ty) {
      this.$.animate({
        'left': (tx*s) + 'px',
        'top': (ty*s) + 'px'
      }, time * 1000)
    }

    // Reset window position
    this.resetPosition = function() {
      this.$.css({
        'left': (x*s) + 'px',
        'top': (y*s) + 'px'
      })
    }

    // Animate rotation

    // Amount amplitude window rotates each unit the photon moves
    var dTheta
    // Initial phase of the amplitude
    ,   initialAngle
    // Final phase of the amplitude after the animation finishes
    ,   finalAngle
    // Animation progress
    ,   r_progress = 0;

    // Overloading the set and get function for the property 'r_progress'
    Object.defineProperty(this, 'r_progress', {
      set: function(value) {
        var lastChange = r_progress * (finalAngle - initialAngle);
        r_progress = value;
        var nextChange = r_progress * (finalAngle - initialAngle);

        this.rotate(nextChange - lastChange);
      },
      get: function() {
        return r_progress;
      }
    });

    // Animate rotation method has one input: plain JS object 'data'
    // Data contains properties:
    // - time: time animation takes
    // - distance: distance photon travels
    // - angle (instead of distance)
    this.animateRotation = function(data) {
      initialAngle = theta;
      if(data.hasOwnProperty('distance')) {
        dTheta = QUANTUM._PHOTON_COLOR === 'RED'? 5
          : QUANTUM._PHOTON_COLOR === 'GREEN'? 7.5
          : 10;
        finalAngle = theta + dTheta * data.distance;
      }
      else if(data.hasOwnProperty('angle')) {
        finalAngle = data.angle + theta;
      }

      QUANTUM.animator.to(this, {r_progress: 1}, data.time, function() {
        r_progress = 0;
        if(data.hasOwnProperty('callback')) data.callback();
      })
    }

    // Changing amplitude animation

    var initialAmplitude
    ,   finalAmplitude
    ,   s_progress = 0;

    // Overloading the set and get of the object property
    Object.defineProperty(this, 's_progress', {
      set: function(value) {
        s_progress = value;
        this.setAmplitude(initialAmplitude + s_progress * (finalAmplitude - initialAmplitude));
      },
      get: function() {
        return s_progress;
      }
    });

    // Animate changing amplitude
    this.animateToAmplitude = function(time, finalAmp, callback) {
      initialAmplitude = amplitude;
      finalAmplitude = finalAmp;

      QUANTUM.animator.to(this, {s_progress: 1}, time, function() {
        s_progress = 0;
        if(callback !== undefined) callback();
      });
    }

    // This methods turns amplitude boxes into windows for amplitude addition
    // for the Mach-Zehnder interferometer exercises
    // inputs are:
    // - sampleOrRef: a boolean which determines which detector the amplitude
    //   is being drawn for, Dark is true, Bright is false
    // - delta: the phase difference between the paths
    this.drawAmplitudeAddition = function(darkOrBright, delta) {
      // Removing existing arrows
      this.clearAmplitude();
      if(this.firstArrow !== undefined) this.firstArrow.remove();
      if(this.secondArrow !== undefined) this.secondArrow.remove();
      if(this.finalArrow !== undefined) this.finalArrow.remove();

      // Mathematical values used to draw arrows

      // Phase of the Reference Path at the Dark Detector
      var initialAnglesDark = {
        'RED': 105, 'GREEN': 75, 'BLUE': 40
      }
      // Phase if the Reference Path at the Bright Detector
      ,   initialAnglesBright = {
        'RED': 160, 'GREEN': 70, 'BLUE': 330
      }
      // Angle the first component arrow rotates
      ,   theta1 = darkOrBright?
        initialAnglesDark[QUANTUM._PHOTON_COLOR] + 180 + delta
        : initialAnglesBright[QUANTUM._PHOTON_COLOR] + delta
      // Angle the second component arrow rotates
      ,   theta2 = darkOrBright?
        initialAnglesDark[QUANTUM._PHOTON_COLOR]
        : initialAnglesBright[QUANTUM._PHOTON_COLOR]
      // Center of the second arrow
      ,   secondArrowCenter = {
        x: 90 + 30 * Math.sin(Math.PI * theta1 / 180),
        y: 90 - 30 * Math.cos(Math.PI * theta1 / 180)
      }

      // Values for calculating orientation of the final arrow
      ,   lx = Math.cos(Math.PI * theta1 / 180) + Math.cos(Math.PI * theta2 / 180)
      ,   ly = Math.sin(Math.PI * theta1 / 180) + Math.sin(Math.PI * theta2 / 180)
      ,   finalTheta = 180 * Math.atan(ly / lx) / Math.PI

      // Final probability
      ,   probability = 1/4 * Math.pow(1 + Math.cos(Math.PI * ((darkOrBright? 180 : 0) + delta) / 180), 2)
        + 1/4 * Math.pow(Math.sin(Math.PI * ((darkOrBright? 180 : 0) + delta) / 180), 2)
      // Final amplitude
      ,   amplitude = Math.pow(probability, 0.5);

      // Drawing arrows for display

      // Drawing first component arrow from center
      this.firstArrow = new QUANTUM.Arrow('first-arrow', contentBox, {
        x: 90, y: 90,
        length: 30, width: 4,
        headWidth: Math.pow(0.5, 0.25) * 15,
        headLength: Math.pow(0.5, 0.25) * 15,
        color: '#bbb', stroke: 'none'
      });
      this.firstArrow.rotate(theta1);
      // Drawing second component arrow
      this.secondArrow = new QUANTUM.Arrow('second-arrow', contentBox, {
        x: secondArrowCenter.x, y: secondArrowCenter.y,
        length: 30, width: 4,
        headWidth: Math.pow(0.5, 0.25) * 15,
        headLength: Math.pow(0.5, 0.25) * 15,
        color: '#bbb', stroke: 'none'
      });
      this.secondArrow.rotate(theta2);
      // Final arrow
      if(amplitude > 0.1) {
        this.finalArrow = new QUANTUM.Arrow('final-arrow', contentBox, {
          x: 90, y: 90,
          length: 60 * amplitude, width: 6,
          headWidth: Math.pow(amplitude, 0.25) * 20,
          headLength: Math.pow(amplitude, 0.25) * 20,
          stroke: 'none',
          color: QUANTUM._PHOTON_COLOR === 'RED'? '#f00' :
            QUANTUM._PHOTON_COLOR === 'GREEN'? '#0b0' : '#33f'
        });
        this.finalArrow.rotate(finalTheta + (lx < 0? 180 : 0));
      }

      // Set display text
      ampText.setContent('Amplitude: '+ (Math.round(1000 * amplitude)/ 1000));
      clockTime.setContent('Probability: '+ (Math.round(1000 * probability) / 10) + '%');
    }
  }, // End of AmplitudeBox class

  // Amplitude Multiplier class constructor
  // this class renders graphics and animates the arrow multiplication process
  AmplitudeMultiplier: function() {
    QUANTUM.children['multiplier'] = this;

    // Application scale
    var s = QUANTUM._SCALE_FACTOR;

    // This method creates a Child object which contains the graphics for
    // the multiplication. This method also draws the addition and
    // multiplication icons for the animation
    this.createMultiplicationLayer = function(ampBoxA, ampBoxB, ampBoxC) {
      // Giving the object access  to the amplitude boxes
      this.ampBoxA = ampBoxA;
      this.ampBoxB = ampBoxB;
      this.ampBoxC = ampBoxC;

      // Coordinates for Child object
      var x1 = parseFloat(ampBoxA.$.css('left')) / s
      ,   x2 = parseFloat(ampBoxC.$.css('left')) / s + 200
      ,   y = parseFloat(ampBoxA.$.css('top')) / s;

      // Child object
      this.container = new QUANTUM.Child('multiplication-layer', x1, y, (x2 - x1), 250);
      this.container.addRaphaelPaper();
      QUANTUM.instance.add(this.container);

      //  Multiplication and addition icons

      // Make operator function
      // input is type, will be 'addition' or 'multiplication'
      function makeOperator(type) {
        // Icon is containted in the multiplication layer
        var container = QUANTUM.children['multiplication-layer']
        // Y coordinate of icon
        ,   y = type === 'addition'? 200 : 55
        // Icon graphic is an instance of the RaphaelChild
        ,   icon = new QUANTUM.RaphaelChild(type+'operator', container, {
          type: 'path',
          width: 1.5,
          color: '#000',
          x0: 195, y0: y
        });

        // Drawing SVG path for the icon
        with(icon) {
          fill('45-#444-#777-#444');
          addPoint(
            195, y+15,  225, y+15,
            225, y+45,  240, y+45,
            240, y+15,  270, y+15,
            270, y,     240, y,
            240, y-30,  225, y-30,
            225, y
          );
          close();
        }
        // Adding glow
        icon.glow = icon.graphic.glow({ size: 15*s, color: '#f90' });
        // Creating a jQuery object on SVG DOM node
        icon.$ = $(container.paper.group().push(icon.glow).push(icon.graphic).node);
        // Creating Raphael set object
        icon.set = container.paper.set().push(icon.graphic, icon.glow);
        return icon;
      }

      // Drawing operators
      this.multiplication = makeOperator('multiplication');
      this.addition = makeOperator('addition');

      // Rotate multiplication sign
      this.multiplication.set.transform('r45,'+ (232.5*s) +','+ (62.5*s));

      // Equal signs

      // This function draws an equal sign, the top of the equal sign is at
      // the given y coordinate in the multiplication layer
      function makeEqualSign(y) {
        // Icon is containted in the multiplication layer
        var container = QUANTUM.children['multiplication-layer']
        // Top icon
        ,   topIcon = new QUANTUM.RaphaelChild('top-equal-icon-'+y, container, {
          type: 'rect',
          x: 455, y: y,
          w: 75, h: 15,
          color: '0-#444-#777-#444',
          stroke: '#000',
          width: 1.5
        })
        // Bottom icon
        ,   bottomIcon = new QUANTUM.RaphaelChild('bottom-equal-'+y, container, {
          type: 'rect',
          x: 455, y: y+30,
          w: 75, h: 15,
          color: '0-#444-#777-#444',
          stroke: '#000',
          width: 1.5
        });

        // Adding glows
        topIcon.glow = topIcon.graphic.glow({ size: 15*s, color: '#f90' });
        bottomIcon.glow = bottomIcon.graphic.glow({ size: 15*s, color: '#f90' });

        // Function returns a plain JS object with access to the icons
        return {
          top: topIcon,
          bottom: bottomIcon,
          $: $(container.paper.group()
            .push(topIcon.glow)
            .push(bottomIcon.glow)
            .push(topIcon)
            .push(bottomIcon)
            .node
          )
        }
      }

      // Drawing equals signs
      this.multiplyEquals = makeEqualSign(40);
      this.addEquals = makeEqualSign(185);

      // Hiding icon
      this.multiplication.$.hide();
      this.addition.$.hide();
      this.addEquals.$.hide();
      this.multiplyEquals.$.hide();
    }

    // Remove multiplication layer
    this.removeMultiplicationLayer = function() {
      // Remove the multiplication layer
      QUANTUM.removeChild(this.container);
      // All of the properties get set to undefined
      this.ampBoxA = undefined;
      this.ampBoxB = undefined;
      this.ampBoxC = undefined;
      this.multiplication = undefined;
      this.addition = undefined;
      this.multiplyEquals = undefined;
      this.addEquals = undefined;
    }

    //-- Arrow Multiplication Animations --//

    // Multiplication is two complex numbers represented as 2D rotations
    // the multiplication goes: ampBoxA * ampBoxB = ampBoxC where ampBox_
    // represents the complex number

    // Animate addition of clock times or multiplication of amplitudes
    // inputs are:
    // - operation: a string which determines which animation is rendered
    // - a callback function executed when the animation ends
    this.animateOperation = function(operation, callback) {
      // This helps for nested functions
      var self = this;

      if(operation === 'addition' && this.ampBoxB.theta !== 0) {
        this.ampBoxB.blink(true);
        this.ampBoxB.drawArc(this.ampBoxB.theta, false);
        this.ampBoxC.blink(true);
        this.ampBoxC.drawArc(this.ampBoxB.theta, true);
      }
      else if(operation === 'multiplication' && this.ampBoxB.amplitude !== 1)
        this.ampBoxC.blink(true);

      // Animate rotation
      if(operation === 'addition' && self.ampBoxB.theta !== 0)
        setTimeout(function() {
          self.ampBoxC.animateRotation({
            time: 3,
            angle: self.ampBoxB.theta,
            callback: function() {
              self.ampBoxB.blinkOff();
              self.ampBoxC.blinkOff();
              setTimeout(animateArithmetic, 2000);
            }
          });
        }, 1000)
      else if(operation === 'addition' && self.ampBoxB.theta === 0) setTimeout(animateArithmetic, 1000)
      else if(operation === 'multiplication' && self.ampBoxB.amplitude !== 1)
        setTimeout(function() {
          self.ampBoxC.animateToAmplitude(3, self.ampBoxA.amplitude * self.ampBoxB.amplitude, function() {
            self.ampBoxC.blinkOff();
            setTimeout(animateArithmetic, 2000);
          })
        }, 1000)
      else if(operation === 'multiplication' && self.ampBoxB.amplitude === 1)
        setTimeout(animateArithmetic, 1000);

      // Animate addition of clock times
      function animateArithmetic() {
        // Enlarge clock time or amplitude display on ampBoxA
        self.ampBoxA.blink(true);
        setTimeout(function() {
          self.ampBoxA.textBlinkOn(operation === 'addition'? 'clock' : 'amplitude');
        }, 500)

        // Fade in addition or multiplication sign sign
        setTimeout(function() {
          operation === 'addition'?
            self.addition.show(500)
            : self.multiplication.show(500);
        }, 2000);

        // Enlarge clock time or ampliude display on ampBoxB
        setTimeout(function() {
          self.ampBoxB.blink(true);
          self.ampBoxB.textBlinkOn(operation === 'addition'? 'clock' : 'amplitude');
        }, 3500);

        // Fade in equal sign
        setTimeout(function() {
          operation === 'addition'?
            self.addEquals.$.fadeIn({ duration: 500 })
            : self.multiplyEquals.$.fadeIn({ duration: 500 });
        }, 5000);

        // Enlarge clock time on ampBoxB
        setTimeout(function() {
          self.ampBoxC.blink(true);
          self.ampBoxC.textBlinkOn(operation === 'addition'? 'clock' : 'amplitude');
        }, 6500);

        // Callback executed at the end
        if(callback !== undefined) setTimeout(callback, 8000);
      }
    }
  }, // End of AmplitudeMultiplier class

  // AmplitudeAdditionBox class constructor
  // this class renders a window which adds two amplitudes
  // inputs are x, y coordinates of top left corner of the window
  AmplitudeAdditionBox: function(x, y) {
    // This object is an instance of the Child class
    QUANTUM.Child.call(this, 'addition-box', x, y, 250, 280);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.$.css('z-index', 2);
    this.addShadow();

    // Label
    var label = new QUANTUM.TextBox('addition-box-label', 0, 6, 22, [100, 100, 100]);
    label.center(250);
    label.setContent('Final Amplitude');
    this.addChild(label);

    // Text resides in this Child object
    var contentBox = new QUANTUM.Child('amp-box-content-', 10, 40, 230, 230);
    contentBox.fillWithGradient('90deg', [240, 240, 210], [255, 255, 230]);
    contentBox.addStroke(150, 140, 100);
    contentBox.addRaphaelPaper();
    this.addChild(contentBox);

    // Display text

    // Amplitude
    var ampText = new QUANTUM.TextBox('addition-box-amp-text', 0, 4, 18, [0, 0, 0]);
    ampText.center(230);
    ampText.setContent('Amplitude: ');
    contentBox.addChild(ampText);

    // Clock time
    var probText = new QUANTUM.TextBox('addition-box-prob-text', 0, 200, 18, [0, 0, 0]);
    probText.center(230);
    probText.setContent('Probability: ');
    contentBox.addChild(probText);

    // Axes that show horizontal and vertical direction
    var vertical = new QUANTUM.RaphaelChild('indicator-vertical-axis', contentBox, {
      type: 'path',
      width: 2,
      color: '#ddc',
      x0: 115, y0: 20
    });
    vertical.addPoint(115, 210);
    var horizontal = new QUANTUM.RaphaelChild('indicator-horizontal-axis', contentBox, {
      type: 'path',
      width: 2,
      color: '#ddc',
      x0: 20, y0: 115
    });
    horizontal.addPoint(210, 115);

    //-- Methods --//

    // Blink feature

    // Blink on
    this.blink = function(hold) {
      contentBox.blink(hold);
    }
    // Blink off
    this.blinkOff = function() {
      contentBox.blinkOff();
    }
    // Reset blink
    this.resetBlink = function() {
      contentBox.resetBlink();
    }

    // Add amplitudes
    // inputs are two AmplitudeBox objects which display amplitudes the
    // window is adding
    this.addAmplitudes = function(ampBox1, ampBox2, callback) {
      var s = QUANTUM._SCALE_FACTOR

      // Drawing first arrow
      ,   len1 = 60 * ampBox1.amplitude + (1 - Math.exp(-1) * Math.exp(ampBox1.amplitude)) * 20
 			,   hw1 = 15 * Math.pow(ampBox1.amplitude, 0.25) + 2
      // First arrow
      ,   arrow1 = new QUANTUM.Arrow('addition-box-arrow-1', contentBox, {
        x: 115, y: 115,
        length: len1,
        width: 4,
        headWidth: hw1, headLength: hw1,
        color: '#f90'
      });
      this.arrow1 = arrow1;

      // Transforming arrow
      arrow1.rotate(ampBox1.theta);

      // Adding glow
      var glow1 = arrow1.graphic.glow({ size: 15 * s, color: '#ff0' })

      // Creating jQuery objects around groups of SVG nodes
      ,   $glow1 = $(contentBox.paper.group().push(glow1).node)
      ,   $arrow1 = $(contentBox.paper.group().push(arrow1).node);
      $arrow1.hide();
      $glow1.hide();

      // Drawing second arrow
      var len2 = 60 * ampBox2.amplitude + (1 - Math.exp(-1) * Math.exp(ampBox2.amplitude)) * 20
      ,   hw2 = 15 * Math.pow(ampBox2.amplitude, 0.25) + 2
      // Coordinates of the tail of the second arrow
      ,   cx = 115 + len1 * Math.sin(Math.PI * ampBox1.theta / 180)
      ,   cy = 115 - len1 * Math.cos(Math.PI * ampBox1.theta / 180)
      // Second arrow
      ,   arrow2 = new QUANTUM.Arrow('addiition-box-arrow-2', contentBox, {
        x: cx, y: cy,
        length: len2,
        width: 4,
        headWidth: hw2, headLength: hw2,
        color: '#f90'
      });
      this.arrow2 = arrow2;

      // Transforming second arrow
      arrow2.rotate(ampBox2.theta);

      // Adding glow
      var glow2 = arrow2.graphic.glow({ size: 15 * s, color: '#ff0' })

      // Creating jQuery objects around groups of SVG nodes
      ,   $glow2 = $(contentBox.paper.group().push(glow2).node)
      ,   $arrow2 = $(contentBox.paper.group().push(arrow2).node);
      $arrow2.hide();
      $glow2.hide();

      // Calculating useful values for the final arrow

      // X component of the final arrow
      var lx = len1 * Math.cos(Math.PI * ampBox1.theta / 180) + len2 * Math.cos(Math.PI * ampBox2.theta / 180)
      // Y component of the final arrow
      ,   ly = len1 * Math.sin(Math.PI * ampBox1.theta / 180) + len2 * Math.sin(Math.PI * ampBox2.theta / 180)
      // Length of the final arrow
      ,   len = Math.pow(lx * lx + ly * ly, 0.5)
      // Orientation of final arrow
      ,   theta = 180 * Math.atan(ly / lx) / Math.PI
      // Calculating the final amplitude
      ,   ampx = ampBox1.amplitude * Math.cos(Math.PI * ampBox1.theta / 180) + ampBox2.amplitude * Math.cos(Math.PI * ampBox2.theta / 180)
      ,   ampy = ampBox1.amplitude * Math.sin(Math.PI * ampBox1.theta / 180) + ampBox2.amplitude * Math.sin(Math.PI * ampBox2.theta / 180)
      ,   amplitude = Math.pow(ampx * ampx + ampy * ampy, 0.5);

      // Final Arrow
      var finalArrow, glow, $glow, $finalArrow;
      if(len > 6) {
        // Drawing final arrow
        finalArrow = new QUANTUM.Arrow('addition-box-final-arrow', contentBox, {
          x: 115, y: 115,
          length: len, width: 6,
          headWidth: len/4 + 5, headLength: len/4 + 5,
          color: '#f00'
        });
        this.finalArrow = finalArrow;

        // Transforming arrow
        if(lx < 0) theta += 180;
        finalArrow.rotate(theta);

        // Adding glow
        glow = finalArrow.graphic.glow({ size: 10 * s, color: '#f00' });

        // Wrapping glow and arrow's SVG node in a jQuery object
        $glow = $(contentBox.paper.group().push(glow).node);
        $finalArrow = $(contentBox.paper.group().push(finalArrow).node);
        $glow.hide();
        $finalArrow.hide();
      }

      //-- Animations --//

      // First fade in animation
      ampBox1.blink(true);
      $glow1.fadeIn({ duration: 1000 });
      $arrow1.fadeIn({
        duration: 1000,
        complete: function() {
          $glow1.fadeOut({ duration: 1000 });
          arrow1.graphic.animate({ fill: '#bbb' }, 1000);
          setTimeout(ampBox1.blinkOff, 1000);
        }
      });

      // Drawing second arrow
      setTimeout(function() {
        ampBox2.blink(true);
        $glow2.fadeIn({ duration: 1000 });
        $arrow2.fadeIn({
          duration: 1000,
          complete: function() {
            $glow2.fadeOut({ duration: 1000 });
            arrow2.graphic.animate({ fill: '#bbb' }, 1000);
            setTimeout(ampBox2.blinkOff, 1000);
          }
        })
      }, 3000);

      // Drawing final arrow
      setTimeout(function() {
        if(len > 6) {
          $glow.fadeIn({ duration: 1000 });
          $finalArrow.fadeIn({
            duration: 1000,
            complete: function() {
              $glow.fadeOut({ duration: 1000 });
              setTimeout(function() {
                ampText.setContent('Amplitude: ' + Math.round(1000 * amplitude) / 1000);
                probText.setContent('Probability: ' + Math.round(1000 * Math.pow(amplitude, 2))/ 10 + '%');
              }, 1000);
            }
          });
        }
        else {
          ampText.setContent('Amplitude: ' + Math.round(1000 * amplitude) / 1000);
          probText.setContent('Probability: ' + Math.round(1000 * Math.pow(amplitude, 2))/ 10 + '%');
        }
      }, 6000);

      if(callback !== undefined) setTimeout(callback, 9000);
    }

    // Reset
    this.reset = function() {
      if(this.arrow1 !== undefined) this.arrow1.remove();
      this.arrow1 = undefined;
      if(this.arrow2 !== undefined) this.arrow2.remove();
      this.arrow2 = undefined;
      if(this.finalArrow !== undefined) {
        this.finalArrow.remove();
        this.finalArrow = undefined;
      }
    }
  }, // End of AmplitudeAdditionBox constructor

  // ProbabilityDisplay class constructor
  // displays a probability as a percentage
  // inputs are: x, y coordinates of top left corner of window
  ProbabilityDisplay: function(x, y) {
    // This object is an instance of the Child class
    QUANTUM.Child.call(this, 'prob-display-'+x, x, y, 120, 90);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.addShadow();

    // Add label
    var label = new QUANTUM.TextBox('prob-label-'+x, 0, 5, 18, [100, 100, 100]);
    label.center(120);
    label.setContent('Probability');
    this.addChild(label);

    // Add screen
    var screen = new QUANTUM.Child('prob-screen-'+x, 5, 40, 110, 45);
    screen.fill(50, 50, 50);
    this.addChild(screen);

    // Glowing text
    var text = new QUANTUM.TextBox('prob-text-'+x, 10, 10, 25, [255, 255, 255])
    ,   s = QUANTUM._SCALE_FACTOR;
    text.$.css({
      'width': (90 * s) + 'px',
      'text-align': 'right',
      'font-family': "Orbitron"
    })
    screen.addChild(text);

    // Methods

    // Blink feature works on screen
    this.blink = function(hold) {
      screen.blink(hold);
    }
    this.blinkOff = function() {
      screen.blinkOff();
    }
    this.resetBlink = function() {
      screen.resetBlink();
    }

    // Set probability
    this.set = function(p) {
      var color = QUANTUM._PHOTON_COLOR === 'RED'? '#ff0000' :
        QUANTUM._PHOTON_COLOR === 'GREEN'? '#00ff00' : '#0000ff';
      var s = QUANTUM._SCALE_FACTOR;

      text.$.css('text-shadow', '0px 0px '+ (5*s) +'px '+ color);
      text.setContent(Math.round(1000 * p)/10 + '%');
    }

    // Reset screen
    this.reset = function() {
      text.setContent('');
    }
  },

  //== THREE.JS SCENE CLASSES ==//

  // DynamicCamera class constructor
  // The dynamic camera is for 3D scenes and allows me
  // to easily move the view for exercises
  // inputs are:
  // - aspect ratio (wdith/height) of the scene
  DynamicCamera: function(aspectRatio) {
    // Instantiate Three.js perspective camera object
    var camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 10000);
    QUANTUM.camera = camera;
    QUANTUM.scene.add(camera);

    // Eye vector (position of the camera)
    var eye = new THREE.Vector3()
    // At vector (direction the camera looks)
    ,   at = new THREE.Vector3();

    // Making vectors publicly accessible
    this.position = eye; this.lookAt = at;

    // Methods

    // Set camera position
    this.setPosition = function(x, y, z) {
      // Updating eye vector
      eye.set(x, y, z);

      // Moving the camera position
      camera.position.set(eye.x, eye.y, eye.z);
      // Setting at vector
      this.setLookAt(at.x, at.y, at.z);
    }

    // Set camera look at
    this.setLookAt = function(x, y, z) {
      // Updating at vector
      at.set(x, y, z);

      // Setting ThreeJS camera look at
      camera.lookAt(at);
    }
  },
  // End of dynamic camera class constructor

  // SceneBox class constructor
  // This class instantiates one of the Child objects
  // and instantiates a Three.js Scene object that renders
  // a WebGL scene in the Child's div object
  // inputs are:
  // - x, y coordinate of the upper left corner of the scene
  // - width (w) height (h) of the scene
  // - RGB vector for clear color of the scene (Array)
  SceneBox: function(x, y, w, h) {
    // If WebGL is not available, the app will not run
    // and an error message is displayed which instructs users to
    // try the app on another device
    if(!QUANTUM._WEB_GL_SUPPORT)
    { // Script runs if WebGL can not be used

      // Prevents error
      var w = QUANTUM.instance.w
      ,   h = QUANTUM.instance.h;
      QUANTUM.Child.call(this, 'SceneBox', 0, 0, w, h);
      this.fill(0, 0, 0);

      for(key in QUANTUM.children) {
        var child = QUANTUM.children[key];
        if(child.parent !== undefined) QUANTUM.removeChild(child);
      }
      console.log('This app cannot run without WebGL. Please revisit this webpage on another device or browser.');

      // Error message to user
      var msg = new QUANTUM.TextBox('webgl-error-messag', 0, h/3, 32, [255, 255, 255]);
      msg.center(w);
      msg.setContent(
        'Error: This device or web browser does not support WebGL '+
        'which is required to render 3D graphics. '+
        'Please revisit this this webpage on another device or web browser '+
        'to complete this exercise.'
      );
      this.addChild(msg);
    }
    else
    { // WebGL successfully detected, and the app can render the scene

    // Instantiating Child object which contains the scene
    QUANTUM.Child.call(this, 'SceneBox', x, y, w, h);

    // Creating Three.js scene
    var scene = new THREE.Scene()
    QUANTUM.scene = scene;

    // Renderer
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    ,   s = QUANTUM._SCALE_FACTOR;
    renderer.setSize(w*s, h*s);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x2c3c3c);
    this.div.appendChild(renderer.domElement);
		$(renderer.domElement).css({
			'position': 'absolute',
			'left': '0px',
			'top': '0px'
		});
		QUANTUM.renderer = renderer;

    // Lighting

    // Cool ambient light
    var ambient = new THREE.AmbientLight();
    ambient.color = new THREE.Color(0.4, 0.4, 0.6);
    scene.add(ambient);

    // Point lights stored in vector
    lights = {};

    // Method for adding a point light source
    // inputs is a plain JS object with the following properties
    // - color: the color of the light (hexidecmal number)
    // - decay: the distance the light decays over
    // - position: a THREE.Vector3 which represents the light's position
    // - name: the reference to the light in the scope of the scene (I might need this)
    this.addPointLight = function(options) {
      var light = new THREE.PointLight(options.color, 1, options.decay);
      light.position.set(options.position.x, options.position.y, options.position.z);
      // light.shadowCameraVisible = true;
      // THREE.CameraHelper(light.shadow);
      scene.add(light);
      lights[options.name] = light;
      for(key in QUANTUM.threeChildren)
        QUANTUM.threeChildren[key].mesh.material.needsUpdate = true;
    }

    // Camera object
    var Camera = new QUANTUM.DynamicCamera(w / h);

    // Remove point light
    this.removePointLight = function(name) {
      if(!lights[name]) return;

      var light = lights[name];
      scene.remove(light);
      delete lights[name];
    }

    //-- Methods for camera --//

    // Place camera
    // inputs are
    // - components of the eye vector
    // - components of the at vector
    this.placeCamera = function(eyeX, eyeY, eyeZ, atX, atY, atZ) {
      Camera.setPosition(eyeX, eyeY, eyeZ);
      Camera.setLookAt(atX, atY, atZ);
    }

    //-- Tween for moving camera --//

    var initialPosition = Camera.position
    ,   newPosition = new THREE.Vector3()
    ,   initialLookAt = Camera.lookAt
    ,   newLookAt = new THREE.Vector3()
    ,   progress = 0;

    // Defining a new property for animation progress
    // this syntax allows me to overload the set and get function
    Object.defineProperty(this, 'progress', {
      set: function(value) {
        progress = value;

        // Linearly interpolates the position of the camera during animation frames
        var p = new THREE.Vector3(
          initialPosition.x + (newPosition.x - initialPosition.x) * Math.pow(progress, 6),
          initialPosition.y + (newPosition.y - initialPosition.y) * Math.pow(progress, 6),
          initialPosition.z + (newPosition.z - initialPosition.z) * Math.pow(progress, 6)
        );

        // Linearly interpolates the look at vector of the camera as well
        var la = new THREE.Vector3(
          initialLookAt.x + (newLookAt.x - initialLookAt.x) * Math.pow(progress, 6),
          initialLookAt.y + (newLookAt.y - initialLookAt.y) * Math.pow(progress, 6),
          initialLookAt.z + (newLookAt.z - initialLookAt.z) * Math.pow(progress, 6)
        );

        // Moving camera every frame
        this.placeCamera(p.x, p.y, p.z, la.x, la.y, la.z);
      },
      get: function() {
        return progress;
      }
    });

    // Move camera animation
    this.moveCamera = function(time, eyeX, eyeY, eyeZ, atX, atY, atZ, callback) {
      newPosition.set(eyeX, eyeY, eyeZ);
      newLookAt.set(atX, atY, atZ);

      QUANTUM.animator.to(this, {progress: 1}, time, function() {
        progress = 0;
        if(callback) callback();
      });
    }

    // If the app is in developer mode, this object adds Cartesian coordinate
    // axes to the scene
    if(QUANTUM._DEVELOPER_MODE) {
      // I use the same geometry and material object arguments for all 3
      var args = [
        {
          type: 'cylinder',
          radius: 0.5,
          height: 1000
        },
        {
          type: 'lambertian',
          inputs: {
            color: 0xffffff
          }
        }
      ]
      // x-axis
      var x_axis = new QUANTUM.ThreeChild('x-axis', args[0], args[1]);
      x_axis.rotate(Math.PI/2, 0, 0, 1);
      // y-axis
      var y_axis = new QUANTUM.ThreeChild('y-axis', args[0], args[1]);
      // z-axis
      var z_axis = new QUANTUM.ThreeChild('z-axis', args[0], args[1]);
      z_axis.rotate(Math.PI/2, 1, 0, 0);
    }

    }

    //-- Arrow Layer --//

    var arrowLayer
    ,   arrows = [];

    // This method creates a new Child on top of the scene were arrows are drawn
    this.addArrowLayer = function() {
      arrowLayer = new QUANTUM.Child('scene-arrow-layer', 0, 0, w, h);
      arrowLayer.addRaphaelPaper();
      this.addChild(arrowLayer);
    }

    // This method draws an arrow on the scene
    // - inputs are x, y coordinates of arrow's tail
    // - theta is the angle the arrow makes with the y axis (0 means arrow points up)
    this.addArrow = function(x, y, theta) {
      // Render an arrow
      var i = arrows.length
      ,   arrow = new QUANTUM.Arrow('arrow-'+i, arrowLayer, {
        x: x + 100, y: y,
        length: 100, width: 20,
        headWidth: 40, headLength: 30,
        color: '#fff', stroke: '#222'
      });
      arrows.push(arrow);
      arrow.rotate(theta);

      // Fading in arrow
      arrow.$.hide();
      arrow.$.show(600);
    }

    // Remove arrows from the scene
    this.removeArrows = function() {
      arrows.filter(function(arrow) {
        arrow.$.fadeOut();
        setTimeout(function() {
          arrow.remove();
        }, 400);
        return false;
      });
    }
  },
  // End of SceneBox constructor

  // ThreeChild class constructor
  // this class renders Three.js meshes in the WebGL scene and
  // has some public methods for animations and transformations
  // inputs are:
  // - reference for the ThreeChild in the scope of the Scene object
  // - geometry object: contains information about the geometry of the mesh
  // - material object: contains information about the material of the mesh
  ThreeChild: function(name, g, m) {
    QUANTUM.threeChildren[name] = this;

    // Geometry object for Three.js mesh
    // all g objects contain property 'type'
    var geometry;
    switch(g.type) {
      // Box geometry object contains
      // - lx, length in x direction
      // - ly, length in y direction
      // - lz, length in z direction
      case 'box':
        geometry = new THREE.BoxGeometry(g.lx, g.ly, g.lz);
        break;
      // Cylinder geometry object contains
      // - radius of cylinder
      // - radius of the other base (optional)
      // - height of the cylinder
      case 'cylinder':
        var r = 'radius2' in g? g.radius2 : g.radius;
        geometry = new THREE.CylinderGeometry(g.radius, r, g.height, 64, 64, g.open !== undefined? g.open : false);
        break;
      // Sphere geometry object contains
      // - radius of the sphere
      case 'sphere':
        geometry = new THREE.SphereGeometry(g.radius, 64, 64);
        break;
      // Plane geometry object contains
      // - lx, length in x direction
      // - ly, length in y direction
      case 'plane':
        geometry = new THREE.PlaneBufferGeometry(g.lx, g.ly, 64);
        break;
      // Circle geometry object contains
      // - radius of the circle
      case 'circle':
        geometry = new THREE.CircleGeometry(g.radius, 64);
        break;
      // Ring geometry object contains
      // - outer radius
      // - inner radius
      case 'ring':
        geometry = new THREE.RingGeometry(g.innerRadius, g.outerRadius, 64);
        break;
      // Parametric geometry object contains
      // - surface, a function of two numbers that returns a THREE.Vector3
      // - steps, number of steps the parameters take over the surface
      case 'parametric':
        geometry = new THREE.ParametricGeometry(g.surface, 64, 64);
        break;
    }

    // Material object for Three.js mesh
    // all m objects contain:
    // - type, type of material the mesh will have
    // - inputs, object that is the input of the THREE.Material constructor*
    // *: mirror object contains property color, a Three.js color object, and has no property inputs
    var material
    ,   mirror;
    switch(m.type) {
      case 'basic':
        material = new THREE.MeshBasicMaterial(m.inputs);
        break;
      case 'lambertian':
        material = new THREE.MeshLambertMaterial(m.inputs);
        break;
      case 'phong':
        material = new THREE.MeshPhongMaterial(m.inputs);
        break;
      case 'mirror':
        mirror = new THREE.Mirror(QUANTUM.renderer, QUANTUM.camera, {
          color: m.color
        });
        QUANTUM.threeMirrors.push(mirror);
        material = mirror.material;
        break;
    }

    // Instantiating Three.js mesh object
    var mesh = new THREE.Mesh(geometry, material);
    QUANTUM.scene.add(mesh);
    if(mirror) mesh.add(mirror);
    this.mesh = mesh;

    // Transformations

    // Translation vector
    var t = new THREE.Vector3(0, 0, 0);
    this.position = t;

    // General translation method
    // inputs are components of the vector representing the translation
    this.translate = function(x, y, z) {
      // Updating the mesh's total translation vector
      t.x += x; t.y += y; t.z += z;

      // Updating positon of the mesh
			mesh.position.set(t.x, t.y, t.z);
    }

    // Rotate mesh on axis given by a vector
    // inputs are:
    // - angle of rotation (rad)
    // - components of the vector representing the axis of rotation
    this.rotate = function(theta, x, y, z) {
      var axis = new THREE.Vector3(x, y, z);
      mesh.rotateOnAxis(axis.normalize(), theta);
    }

    //-- Animation methods --//

    // Translation animation

    var t_progress = 0
    ,   t_vector = new THREE.Vector3()
    ,   dS = new THREE.Vector3(0, 0, 0);

    // Defining the object property for translation progress,
    // this syntax allows me to overload set and get
    Object.defineProperty(this, 't_progress', {
      set: function(value) {
        t_progress = value;

        // Translating the graphic with a series of translation, the graphic
        // gets translated vector dS iteravitely every frame. The rounding
        // error is handled in the animator object
        if(dS.x || dS.y || dS.z) this.translate(-dS.x, -dS.y, -dS.z);
        dS.set(
          t_vector.x * t_progress,
          t_vector.y * t_progress,
          t_vector.z * t_progress
        );
        this.translate(dS.x, dS.y, dS.z);
      },
      get: function() {
        return t_progress;
      }
    });

    // Move graphic by vector deltaS
    // inputs are:
    // - time animation takes (seconds)
    // - translation vector (Array)
    // - callback function executed at completion
    this.move = function(time, deltaS, callback) {
      t_vector.set(deltaS[0], deltaS[1], deltaS[2]);

      // Animator object has application render an animation
      QUANTUM.animator.to(this, {t_progress: 1}, time, function() {
        t_progress = 0;
        dS.set(0, 0, 0);
        if(callback !== undefined) callback();
      });
    }

    // Rotation animation

    var r_progress = 0
    ,   r_axis = new THREE.Vector3()
    ,   thetaStep = null;

    // Defining the object property for rotation progress
    // this syntax allows me to overload the set and get
    Object.defineProperty(this, 'r_progress', {
      set: function(value) {
        r_progress = value;

        // Iteratively rotates the graphic
        this.rotate(thetaStep, r_axis.x, r_axis.y, r_axis.z);
      },
      get: function() {
        return r_progress;
      }
    });

    // Animate rotation graphic by angle (theta)
    // inputs are:
    // - time animation takes (seconds)
    // - angle of rotation (rad)
    // - axis of rotation (Array)
    // - callback for the end
    this.animateRotation = function(time, theta, axis, callback) {
      // Setting the angle the mesh is rotated each frame
      thetaStep = theta / time / 120;

      // Setting the axis of rotation
      r_axis.set( axis[0], axis[1], axis[2] );

      // Animator object has application render the animation
      QUANTUM.animator.to(this, {r_progress: 1}, time, function() {
        r_progress = 0;
        thetaStep = null;
        if(callback !== undefined) callback();
      });
    }

    // Animate 3D mesh along a parameterized path

    var p_progress = 0
    // These will both be 3-vectors
    ,   prevPosition
    ,   currentPosition
    // This will be a function of one number ranging from 0 to 1
    // that returns a THREE.Vector3
    ,   path;

    // Creating object property "p_progress"
    // this syntax allows me to overload the set and get for this property
    Object.defineProperty(this, 'p_progress', {
      set: function(value) {
        p_progress = value;

        // Setting previous position
        if(currentPosition) prevPosition = currentPosition
        // Setting current position
        currentPosition = path(p_progress);

        // Calculating the change in position since last frame
        var delta = new THREE.Vector3();
        if(prevPosition) delta.subVectors(currentPosition, prevPosition)
        else delta = currentPosition;

        // Translate 3D mesh
        this.translate(delta.x, delta.y, delta.z);
      },
      get: function() {
        return p_progress;
      }
    });

    // This method animates the 3D mesh over a parameterized path
    // inputs are:
    // - the amount of time the animation occurs over (seconds)
    // - the path as a function of 1 parameter
    // - a callback function
    this.animateAlongPath = function(time, pathFn, callback) {
      path = pathFn;
      QUANTUM.animator.to(this, {p_progress: 1}, time, function() {
        p_progress = 0;
        currentPosition = null;
        prevPosition = null;
        if(callback !== undefined) callback();
      });
    }

    //-- Other methods --//

    // Get the position of the 3D mesh in the div containing the scene
    this.getWindowPosition = function() {
      QUANTUM.scene.updateMatrixWorld(true);

      // Getting dimensions of the scene
      var w = QUANTUM.children['SceneBox'].w
      ,   h = QUANTUM.children['SceneBox'].h
      // vector object used for getting the window coordinates
      ,   vec3 = new THREE.Vector3();

      // Retrieiving window coordinates
      vec3.setFromMatrixPosition(mesh.matrixWorld).project(QUANTUM.camera);
      vec3.x = w/2 + Math.round(w/2 * vec3.x);
      vec3.y = h/2 - Math.round(h/2 * vec3.y);
      // Returns the 3-vector object
      return vec3;
    }

    // Labeling

    // Add label to 3D mesh
    // inputs are:
    // - content of the label
    this.addLabel = function(content, dx, dy) {
      // Storing the inputs in a vector, this info is used in a method
      // which updates an object's label when the camera moves
      this.labelInfo = [content, dx, dy];

      var p = this.getWindowPosition()
      ,   s = QUANTUM._SCALE_FACTOR
      ,   size = QUANTUM._REDUCE_LABEL_SIZE? 20 : 28;

      // Label
      this.label = new QUANTUM.TextBox(name+'-label', p.x+dx, p.y+dy, size, [255, 255, 255]);
      this.label.setContent(content);
      this.label.addTextShadow();
      this.label.center(200);

      QUANTUM.instance.add(this.label);
    }

    // Remove label
		this.removeLabel = function() {
			if(this.label) {
				QUANTUM.removeChild(this.label);
				delete this.label;
			}
		}

    // Update label position when scene changes
    this.updateLabel = function() {
      if(QUANTUM._UPDATE_LABELS) {
        this.removeLabel();

        var l = this.labelInfo;
        this.addLabel(l[0], l[1], l[2]);
      }
    }

    // Remove ThreeChild from the scene
    this.remove = function() {
      if(this.label) this.removeLabel();
      QUANTUM.scene.remove(mesh);
      delete QUANTUM.threeChildren[name];
    }
  },
  // End of ThreeChild class constructor

  //== EVENT LISTENERS ==//

  // Add a event listener
  // inputs are:
  // - data object which contains
  //   - source: object which contains the DOM node
  //   - node: DOM node the event is listened for on
  // - the callback when the event is detected
  addTapEvent: function(data, callback) {
    // Adds event listener to the DOM node with a jQuery object
    with($(data.node)) {
      // Adding tap event listener using jQuery's Hammer plugin
      hammer()
        .on('tap press', data, function(e) {
          callback();
          e.gesture.srcEvent.preventDefault();
        })
        .remove('pan multitap');
      css('cursor', 'pointer');
    }
  },

  // Remove tap event listener
  // input is DOM node that has event listener attached
  removeEvent: function(DOMnode) {
    // jQuery object constructor
    var $node = $(DOMnode);

    // It checks if the object has an event by looking at the CSS cursor style
    if($node.css('cursor') === 'pointer') {
      with($node) {
        hammer().off('tap');
        $node.css('cursor', 'default');
      }
    }
    else if($node.css('cursor') === 'all-scroll') {
      with($node) {
        hammer().off('panleft panright panup pandown panend');
        $node.css('cursor', 'default');
      }
    }
  },

  //== ANIMATOR OBJECT ==//

  Animator: function() {
    // Animation objects are stored in a vector
    var animations = [];

    // Methods

    // Create animation
    // inputs are:
    // - object we are changing the state of
    // - animation object which contains information about the final state of the main object
    // - time the animation takes in seconds
    // - callback function that executes when the
    this.to = function(mainObject, animObject, time, completionCallback) {
      // Reference to the object property the animation interpolates
      // the value of (it will always be a number)
      var objectProperty = Object.keys(animObject)[0];

      // Appends the animations vector with a plain JS object with properties
      // about the animation
      animations.push({
        // Current frame in the animation
        currentFrame: 0,
        // Frame count of the animation
        frameCount: QUANTUM._DEVELOPER_MODE? 1 : 60 * time,
        // Object the animation changes the state of
        object: mainObject,
        // Object property it linearly interpolates
        property: objectProperty,
        // Initial state of the object property
        initialState: mainObject[objectProperty],
        // Final state of the object
        finalState: animObject[objectProperty],
        // Object state is appended this much each frame
        step: (animObject[objectProperty] - mainObject[objectProperty]) / (60 * time),
        // Callback function at the end of the animation
        callback: completionCallback !== undefined? completionCallback : function(){},
        // Boolean indicates if the animation is complete
        complete: false
      });
    }

    // Kill all animations without executing callbacks
    // input is a boolean which tells the program to finish the animations or not
    this.killAnimations = function(finish) {
      if(finish)
        for(i in animations) {
          animations[i].object[animations[i].property] = animations[i].finalState;
        };
      animations = [];
    }

    //-- Render loop --//

    var self = this
    ,   fps = QUANTUM._ANIMATION_FRAMERATE
    ,   now
    ,   then = Date.now()
    ,   interval = 1000/fps
    ,   delta;


    this.render = function() {
      now = Date.now();
      delta = now - then;

      // Conditional for capping frame rate at 60 fps
      if(delta > interval) {
        then = now - (delta % interval);

        for(i in animations) {
          var animation = animations[i];

          // Updating frame count
          animation.currentFrame++;

          // Updating object state
          animation.object[animation.property] += animation.step;
          animation.object[animation.property] =
            Math.min(animation.object[animation.property], animation.finalState);

          // Checking to see if the animation is finished
          if(animation.currentFrame === animation.frameCount) {
            // Set the object to the final desired state
            // (anticipating rounding error)
            animation.object[animation.property] = animation.finalState;

            // Animation is complete and the callback runs
            animation.complete = true;
            animation.callback();
          }
        }

        // Filtering out complete animations
        animations = animations.filter(function(animation) {
          return !animation.complete;
        });

        // Updating labels of 3D objects for animations
        for(key in QUANTUM.threeChildren) {
          if(QUANTUM.threeChildren[key].label && animations.length)
            QUANTUM.threeChildren[key].updateLabel();
        }

        // Rendering mirror textures
        for(i in QUANTUM.threeMirrors) {
  				QUANTUM.threeMirrors[i].updateTextureMatrix();
  				QUANTUM.threeMirrors[i].render();
  			}

        // Render the 3D scene, if there is one
        if(QUANTUM.renderer !== null)
          QUANTUM.renderer.render(QUANTUM.scene, QUANTUM.camera);
      }

      // Repaints the screen and calls the render function again as a callback
      window.requestAnimationFrame(self.render);
    }
  },

  //== BUTTON OBJECTS ==//

  // General Button object constructor
  Button: function(name, x, y, w, h) {
    // All buttons are instances of the Child object
    QUANTUM.Child.call(this, name, x, y, w, h);

    // Adding overlay which will have an inner shadow when the button gets
    // pressed to give illusion of depth
    var overlay = new QUANTUM.Child('next-button-overlay', 0, 0, w, h);
    overlay.$.css('z-index', 2);
    this.overlay = overlay;
 		this.addChild(overlay);

    // This method adds an event listener to the button
    // input is the callback that executes when the event is triggered
    this.onPress = function(callback) {
      this.offPress();

      // This function gets called on a Hammet tap event
      function event() {
        // Callback executes
        callback();
        // Add inset shadow for 0.4 seconds
        var s = QUANTUM._SCALE_FACTOR;
        overlay.$.css({
          'box-shadow': 'inset '+ (5*s) +'px '+ (5*s) +'px '+ (8*s) +'px rgba(0,0,0,0.4)'
        });
        setTimeout(function() {
          overlay.$.css('box-shadow', '');
        }, 400);
      }
      // Add Hammer tap event listener to button
      QUANTUM.addTapEvent({source: this, node: overlay.div}, event);
    }

    // Remove the button's event listener
    this.offPress = function() {
      QUANTUM.removeEvent(overlay.div);
    }

    // Methods for button style

    // This method sets the color of the button
    this.setColor = function(r, g, b) {
      this.color = [r, g, b];
      this.addStroke(r-80, g-80, b-80);
      this.fillWithGradient('90deg', [r-20, g-20, b-20], [r+20, g+20, b+20]);
    }

    // Add text box
    this.addTextContent = function(size, content) {
      if(this.color === undefined) {
        console.log('Set '+ name +'\'s color before adding text');
        return;
      }

      // Instantiating a TextBox object inside the button
      var c = []
      ,   s = QUANTUM._SCALE_FACTOR;
      for(i in this.color) c.push(this.color[i]-80);
      this.text = new QUANTUM.TextBox(name+'-text', 0, (h-size)/3, size, c);
      this.addChild(this.text);
      this.text.center(w);
      this.text.setContent(content);
      this.text.$.css('text-shadow', '1px 1px 0px rgba(255,255,255,.3)');
    }

    // Disable button (remove event listener and make it semi-transparent)
    this.disable = function() {
      this.offPress();
      this.$.css('opacity', 0.4);
    }

    // Enable button
    this.enable = function() {
      this.$.css('opacity', 1);
    }
  },
  // End of Button class constructor

  // ButtonRefresh class constructor
  // This object creates a button that can refresh the exercise
  ButtonRefresh: function() {
    // Calls an instance of the button object
    QUANTUM.Button.call(this, 'bt-refresh', QUANTUM.instance.w-55, 10, 40, 40);
    this.setColor(255, 100, 100);
    this.addRaphaelPaper();

    // Top refresh graphic
    var topGraphic = new QUANTUM.RaphaelChild('top-refresh-graphic', this, {
      type: 'path',
      color: 'none',
      width: 0,
      x0: 32,
      y0: 28
    });
    with(topGraphic) {
      addPoint(
        25, 20,
        29, 20
      );
      for(var i = 1; i <= 125; i++)
        addPoint(20 + 9 * Math.cos(Math.PI * i / 180), 20 - 9 * Math.sin(Math.PI * i / 180));
      for(var i = 125; i >= 1; i--)
        addPoint(20 + 14 * Math.cos(Math.PI * i / 180), 20 - 14 * Math.sin(Math.PI * i / 180));
      addPoint(38, 20);
      fill('#933');
      addInnerBevel();
    }

    // Bottom refresh graphic
    var bottomGraphic = new QUANTUM.RaphaelChild('bottom-refresh-graphic', this, {
      type: 'path',
      color: 'none',
      width: 0,
      x0: 8, y0: 12
    });
    with(bottomGraphic) {
      addPoint(
        15, 20,
        19, 20
      );
      for(var i = 181; i <= 305; i++)
        addPoint(20 + 9 * Math.cos(Math.PI * i / 180), 20 - 9 * Math.sin(Math.PI * i / 180));
      for(var i = 305; i >= 181; i--)
        addPoint(20 + 14 * Math.cos(Math.PI * i / 180), 20 - 14 * Math.sin(Math.PI * i / 180));
      addPoint(2, 20);
      fill('#933');
      addInnerBevel();
    }

    // Adding the refresh functionality
    function renderRefreshWindow() {
      // Reference to the refresh button itself
      var self = QUANTUM.children['bt-refresh']
      // Reference to the instance of the application
      ,   app = QUANTUM.instance;

      // So that you cannot make two refresh window layers
      self.offPress();

      // Creates an overlay over the application
      var overlay = new QUANTUM.Child('refresh-overlay', 0, 0, app.w, app.h);
      overlay.div.style.background = 'rgba(0, 0, 0, 0.7)';
      app.add(overlay, true);

      // Creates a window which prompts users on whether or not they want to
      // restart the application
      var refreshWindow = new QUANTUM.Child('refresh-window', app.w/2-200, app.h/2-100, 400, 200);
      refreshWindow.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
      refreshWindow.addStroke(100, 100, 100);
      refreshWindow.addShadow();
      overlay.addChild(refreshWindow);

      // The text box prompts the users on whether they want to restart the exercise
      var prompt = new QUANTUM.TextBox('refresh-prompt', 25, 30, 24, [80, 80, 80]);
      prompt.center(350);
      prompt.setContent('Are you sure you want to restart the exercise from the beginning?');
      refreshWindow.addChild(prompt);

      // Users can click on either a Yes or No button to make a decision

      // Yes button
      var btYes = new QUANTUM.Button('bt-yes', 80, 120, 100, 60);
      btYes.setColor(50, 220, 150);
      btYes.addTextContent(30, 'YES');
      refreshWindow.addChild(btYes);

      // No button
      var btNo = new QUANTUM.Button('bt-yes', 220, 120, 100, 60);
      btNo.setColor(220, 130, 100);
      btNo.addTextContent(30, 'NO');
      refreshWindow.addChild(btNo);

      // Adding event listeners to buttons in the window

      // Pressing NO removes the window and resumes the exercise
      btNo.onPress(function() {
        btNo.offPress();
        overlay.hide(true);
        setTimeout(function() {
          QUANTUM.removeChild(btYes);
          QUANTUM.removeChild(btNo);
          QUANTUM.removeChild(refreshWindow);
          QUANTUM.removeChild(overlay);
        }, 600);
        self.onPress(renderRefreshWindow);
      });

      // Pressing YES restarts the exercise
      btYes.onPress(function() {
        btYes.offPress();
        // Remove the overlay
        overlay.hide(true);
        // Remove all objects from the 3D scene
        for(key in QUANTUM.threeChildren) QUANTUM.threeChildren[key].remove();
        // Hide all of the app's children
        for(key in QUANTUM.children)
          switch(key) {
            case 'app': break;
            default:
            if(QUANTUM.children[key].hide !== undefined)
              QUANTUM.children[key].hide(true);
              break;
          }
        // Remove all of the app's children
        setTimeout(function() {
          for(key in QUANTUM.children)
            switch(key) {
              case 'app': break;
              default:
                QUANTUM.removeChild(QUANTUM.children[key]);
                break;
            }
        }, 500);
        setTimeout(function() {
          QUANTUM.renderIntro();
        }, 600)
      })
    }

    // Adding event listener to this button
    this.onPress(renderRefreshWindow);
  }, // End of ButtonRefresh constructor

  // Class constructor for a button that opens the exercise in a new tab
  ButtonWindow: function() {
    // This object is an instance of the Button class
    QUANTUM.Button.call(this, 'bt-window', QUANTUM.instance.w-115, 10, 40, 40);
    this.setColor(0, 200, 255);
    this.addRaphaelPaper();

    // Front window graphic
    var frontGraphic = new QUANTUM.RaphaelChild('front-window-graphic', this, {
      type: 'path',
      width: 3,
      color: '#369',
      x0: 15, y0: 15
    });
    with(frontGraphic) {
      addPoint(
        15, 35,
        35, 35,
        35, 15
      );
      close();
      addInnerBevel();
    }

    // Back window graphic
    var backGraphic = new QUANTUM.RaphaelChild('back-window-graphic', this, {
      type: 'path',
      width: 3,
      color: '#369',
      x0: 10, y0: 25
    });
    with(backGraphic) {
      addPoint(
        5, 25,
        5, 5,
        25, 5,
        25, 10
      );
      addInnerBevel();
    }

    // Functionality
    this.onPress(function() {
      window.open(document.location.href, "_blank");
    })
  }, // End of ButtonWindow class

  // This class renders a NEXT button that is used to navigate exercises.
  // ButtonNext class constructor
  // inputs are:
  // - x, y coordinates of top left corner
  // - width (w) and height(h) of the button
  ButtonNext: function(x, y, w, h) {
    // This is an instance of the Button class
    QUANTUM.Button.call(this, 'bt-next', x, y, w, h);
    this.setColor(100, 130, 222);
    this.addTextContent(h-15, 'NEXT');
  },

  // This class renders a BACK button that is used to navigate exercises.
  // ButtonBack class constructor
  // inputs are the same as the ButtonNext constructor
  ButtonBack: function(x, y, w, h) {
    // This is an instance of the Button class
    QUANTUM.Button.call(this, 'bt-back', x, y, w, h);
    this.setColor(170, 122, 230);
    this.addTextContent(h-15, 'BACK');
  },

  // This class renders a play button that is used to start animations
  // ButtonPlay class constructor
  // inputs are the same as the two classes above
  ButtonPlay: function(x, y, w, h) {
    // This is an instance of the Button class
    QUANTUM.Button.call(this, 'bt-play', x, y, w, h);
    this.addRaphaelPaper();
    this.setColor(90, 220, 90);

    // Play graphic
    var playGraphic = new QUANTUM.RaphaelChild('play-graphic', this, {
      type: 'path',
      color: 'none',
      width: 0,
      x0: w/3, y0: 10
    });
    with(playGraphic) {
      addPoint(
        w/3, h-10,
        2*w/3, h/2
      );
      fill('#363');
      addInnerBevel();
    }
  },

  // This class renders a help button that renders an overlay for instructions
  // ButtonHelp class constructor
  // inputs are the same as the button classes above
  ButtonHelp: function(x, y, w, h) {
    // This is an instance of the Button class
    QUANTUM.Button.call(this, 'bt-help', x, y, w, h);
    this.setColor(100, 220, 255);
    this.addTextContent(h-15, '?');

    // Pressing this button renders the help layer
    this.onPress(QUANTUM.renderHelpLayer);
  },

  // This function is called when the help button is pressed
  renderHelpLayer: function() {
    QUANTUM.children['bt-help'].offPress();
    if(QUANTUM.children['bt-help'].blinkHold) QUANTUM.children['bt-help'].blinkOff();

    // Instantiate help layer
    var helpLayer = new QUANTUM.HelpLayer();
  },

  // PolarizerSwitch class constructor
  // this class renders a button which adds or removes a polarizer
  // inputs are:
  // - index of switches in Array
  // - x, y, coordinates of the upper left corner of the bounding box
  PolarizerSwitch: function(index) {
    // This is an instance of the Button class
    QUANTUM.Button.call(this, 'bt-switch-'+index, 475+120*index, 100, 60, 60);
    this.setColor(110, 190, 110);
    this.addRaphaelPaper();
    // Border radius so that the button appears circular
    this.$.css('border-radius', '50%');
    this.overlay.div.style.borderRadius = '50%';

    // Plus graphic
    var vertical = new QUANTUM.RaphaelChild('bt-switch-'+index+'-vertical', this, {
      type: 'path',
      color: '#474',
      width: 8,
      x0: 30, y0: 10
    });
    vertical.addPoint(30, 50);
    vertical.addInnerBevel();
    var horizontal = new QUANTUM.RaphaelChild('bt-switch-'+index+'-horizontal', this, {
      type: 'path',
      color: '#474',
      width: 8,
      x0: 10, y0: 30
    });
    horizontal.addPoint(50, 30);
    horizontal.addInnerBevel();

    // Adding event listener to button

    // This boolean determines whether the button adds or removes a polarizer
    // from view
    var polarizerInView = false;

    //-- Adding event listener --//

    // Adding extra callback to press event
    this.callback = function() {};

    // Pointer to this object (for scope of setTimeout)
    var self = this;

    // Event callback
    function toggleSwitch() {
      // Removing the event listener
      self.offPress();

      // Executing additional callback
      self.callback();

      // Turning off the blink feature
      if(self.blinkHold) self.blinkOff();

      // Moving the polarizer in or out of view
      var x = polarizerInView? 1 : -1;
      QUANTUM.polarizers[index + 1].inView = !QUANTUM.polarizers[index + 1].inView;
      QUANTUM.polarizers[index + 1].removeLabel();
      // Animation
      QUANTUM.polarizers[index + 1].move(1, [0, x * 300, 0], function() {
        QUANTUM.polarizers[index + 1].inView = !polarizerInView;
        QUANTUM.polarizers[index + 1].orientToAngle(0);
        x === 1? QUANTUM.polarizers[index + 1].removeInput() : QUANTUM.polarizers[index + 1].addInput();
      });

      // Changing the length of the light path if it's necessary
      setTimeout(function() {
        var polarizersInView = QUANTUM.polarizers.filter(function(current) {
          return current.inView;
        })
        ,   probability = 1;
        if(polarizersInView.length === 1) {
          QUANTUM.children['Screen3D'].illuminate(1);
          QUANTUM.lightPaths[0].changeLength(600 - QUANTUM.lightPaths[0].length);
        }
        for(var i = 1; i < polarizersInView.length; i++) {
          // Changing the probability displayed on the screen
          probability *= Math.pow(Math.cos(polarizersInView[i].theta - polarizersInView[i-1].theta), 2);
          if(i === polarizersInView.length - 1)
            QUANTUM.children['Screen3D'].illuminate(probability);

          if(Math.abs(polarizersInView[i].theta - polarizersInView[i-1].theta) === Math.PI/2) {
            var index = QUANTUM.polarizers.indexOf(polarizersInView[i])
            ,   length = 150 + 100 * index;
            QUANTUM.lightPaths[0].changeLength(length - QUANTUM.lightPaths[0].length);
            break;
          }
          else if(i === polarizersInView.length - 1) {
            var length = 600;
            QUANTUM.lightPaths[0].changeLength(length - QUANTUM.lightPaths[0].length);
          }
        }
      }, polarizerInView? 10 : 1200);

      //-- Button animation and graphics changes --//

      // Hiding window temporarily
      self.hide(true);

      setTimeout(function() {
        // Showing window again after some time
        self.show(500);
      }, 1500);

      // Changing the graphic from 'X' to '+' or vice versa
      setTimeout(function() {
        // Change the color of the button
        self.setColor(
          polarizerInView? 110 : 190,
          polarizerInView? 190 : 110,
          110
        );

        // Change the color of the graphic
        vertical.graphic.attr('stroke', polarizerInView? '#474' : '#744');
        horizontal.graphic.attr('stroke', polarizerInView? '#474' : '#744');

        // Rotate the graphic
        vertical.rotate(polarizerInView? 0 : 45);
        horizontal.rotate(polarizerInView? 0: 45);
      }, 500);

      // Reattaching the event listener after the polarizer animation finishes
      setTimeout(function() {
        // Switching the boolean which flags whether the button switches
        // the polarizer into the view or removes it
        polarizerInView = !polarizerInView;

        self.onPress(toggleSwitch);
      }, 3000);
    }

    // Adding event listener
    this.addEvent = function() {
      this.onPress(toggleSwitch);
    }
    this.addEvent();

  }, // End of PolarizerSwitch class

  //-- These buttons change the length of the glass in the 2nd Mach-Zehnder experiment --//

  // General constructor for the buttons, since they are very similar in design
  // and I do not want to repeat similar code
  // inputs are:
  // - name of the button object
  // - shorten: a boolean which determines if this button shortens the glass (true) or
  //   makes it longer (false)
  ButtonLengthChange: function(name, shorten) { // 290, 160, 100, 40
    // This object is an instance of the Button class
    QUANTUM.Button.call(this, name, 305, shorten? 295 : 355, 120, 40);
    this.setColor(100, 120, 250);
    this.$.css('z-index', 2);
    this.addRaphaelPaper();

    // Arrow graphics

    // Arrow facing right
    var right = new QUANTUM.Arrow(name+'-right', this, {
      length: 40, width: 10,
      headWidth: 25, headLength: 15,
      x: shorten? 10 : 70, y: 20,
      color: '#339', stroke: 'none'
    });
    right.rotate(90);
    right.addInnerBevel();

    // Arrow facing left
    var left = new QUANTUM.Arrow(name+'-left', this, {
      length: 40, width: 10,
      headWidth: 25, headLength: 15,
      x: shorten? 110 : 50, y: 20,
      color: '#339', stroke: 'none'
    });
    left.rotate(270);
    left.addInnerBevel();
    left.bevel.translate(-2*QUANTUM._SCALE_FACTOR, -QUANTUM._SCALE_FACTOR);
  },

  // ButtonShort class constructor
  // this class creates a button that shortens the length of the glass
  ButtonShort: function() {
    // This object is an instance of the ButtonLengthChange class above
    QUANTUM.ButtonLengthChange.call(this, 'bt-short', true);
  },

  // ButtonLong class constructor
  // this class creates a button that increases the length of the glass
  ButtonLong: function() {
    // This object is an instance of the ButtonLengthChange class above
    QUANTUM.ButtonLengthChange.call(this, 'bt-long', false);
  },

  //== MESSAGE BOX ==//

  // Class constructor for the MessageBox
  // inputs are:
  // - x, y coordinates of window
  // - width (w) and height (h) of window
  // - optional options object
  MessageBox: function(x, y, w, h, options) {
    // This object is an instance of a Child object
    QUANTUM.Child.call(this, 'msg-box', x, y, w, h);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.addShadow();

    // Text resides in this Child object
    var contentBox = new QUANTUM.Child('msg-content-box', 14, 15, w-30, h-30);
    contentBox.fillWithGradient('90deg', [240, 240, 210], [255, 255, 230]);
    contentBox.addStroke(150, 140, 100);
    this.addChild(contentBox);

    // This object's blink feature will make the content box glow
    this.blink = function(hold) {
      contentBox.blink(hold)
    }
    this.blinkOff = function() {
      contentBox.blinkOff();
    }
    this.resetBlink = function() {
      contentBox.resetBlink();
    }

    // Text box object
    var size = options !== undefined && options.hasOwnProperty('font-size') ?
          options['font-size'] : 24
    ,   h_margin = options !== undefined && options.hasOwnProperty('horizontal-margin')?
          options['horizontal-margin'] : 10
    ,   content = new QUANTUM.TextBox('msg-content', h_margin, 5, size, 'black')
    ,   s = QUANTUM._SCALE_FACTOR;
    content.$.css({
      'width': ((w - (30 + 2 * h_margin)) * s) + 'px',
      'height': ((h- 40) * s) + 'px',
      'overflow-x': 'hidden',
      'overflow-y': 'auto'
    });
    contentBox.addChild(content);

    // Set message
    this.setMessage = function(message) {
      if(message === content.div.innerHTML) return;

      // If the message isn't blank, the screen blinks
      if(message !== '' && content.div.innerHTML !== '')
        setTimeout(this.blink, 400)
      else if(message !== '') this.blink();
      // Scrolling the div containing the text to the top automatically
      content.$.scrollTop(0);

      // Set the text displayed in the message box
      if(content.div.innerHTML === "") {
        with(content.$) {
          css('display', '');
          scrollTop(0);
          hide();
          fadeIn();
        }
        content.setContent(message);
      }
      else {
        content.$.fadeOut({
          'complete': function() {
            with(content.$) {
              css('display', '');
              scrollTop(0);
              hide();
              fadeIn();
            }
            content.setContent(message);
          }
        });
      }
    }
  }, // End of MessageBox class constructor

  //== 3D OBJECTS ==//

  // LightPath3D
  // this class renders 3D light paths
  // inputs are:
  // - coordiantes of the endpoints in the XZ plane
  LightPath3D: function(x1, z1, x2, z2) {
    // Storing the light path in publicly accesible memory
    var i = QUANTUM.lightPaths.length;
    QUANTUM.lightPaths.push(this);

    // Making endpoints publicly accessible
    this.x1 = x1; this.z1 = z1;
    this.x2 = x2; this.z2 = z2;

    // Calculating the length of the light path
    var length = Math.pow((x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1), 0.5);
    this.length = length;

    // Material for the light path
    var pathMaterial = { // Material
      type: 'basic',
      inputs: {
        color: 0xff0000,
        transparent: true,
        opacity: 0.4
      }
    }

    // Light path graphic
    var path = new QUANTUM.ThreeChild(
      'light-path-'+i,
      { // Geometry
        type: 'cylinder',
        radius: 1, height: length
      },
      pathMaterial
    );
    path.rotate(Math.PI/2, z2-z1, 0, x1-x2);
    path.translate((x1 + x2)/2, 0, (z1 + z2)/2);
    this.graphic = path;

    // Change the length of the light path keeping the x1, z1 endpoint fixed
    // input is the change in length
    this.changeLength = function(dL) {
      var scale = (length + dL) / length;
      path.mesh.geometry.scale(1, scale, 1);

      var lx = this.x2 - this.x1
      ,   lz = this.z2 - this.z1
      ,   dx = lx > 0? dL * lx / length : -dL * lx / length
      ,   dz = lz < 0? dL * lz / length : -dL * lz / length;
      this.x1 -= dx/2;
      this.x2 += dx/2;
      this.z1 -= dz/2;
      this.z2 += dz/2;
      length += dL;
      this.length = length;
      path.translate(dx/2, 0, dz/2);
    }

    // Changing length animation

    var progress = 0
    ,   totalLength
    ,   lastChange = 0;

    // Defining the object property 'progress'
    // this syntax allows me to overload the set and get
    Object.defineProperty(this, 'progress', {
      set: function(value) {
        progress = value;

        // Changing the length of the light path interatively
        this.changeLength(progress * totalLength - lastChange);
        lastChange = progress * totalLength;
      },
      get: function() {
        return progress;
      }
    });

    // Animate change in path length
    // inputs are:
    // - time animation takes (seconds)
    // - total change in the length of the path
    // - callback function that executes when the animation ends (optional)
    this.animateLengthChange = function(time, dL, callback) {
      totalLength = dL;
      QUANTUM.animator.to(this, {progress: 1}, time, function() {
        progress = 0;
        lastChange = 0;
        if(callback !== undefined) callback();
      })
    }
  }, // End of LightPath3D class constructor

  // Photon3D class constructor
  // this class renders a 3D photon graphic
  Photon3D: function() {
    // Position
    var position = new THREE.Vector3(0, 0, 0)
    // Poynting vector (since the photon only moves in the XZ plane it is a 2D vector)
    ,   poynting = new THREE.Vector2()
    // Polarization
    ,   polarization = 'random';
    // Making the polarization publicly accessible
    this.polarization = polarization;


    // Material for 3D objects
    var photonMaterial = {
      type: 'phong',
      inputs: {color: 0xff5544}
    }

    // Rendering the sphere
    var particle = new QUANTUM.ThreeChild(
      'photon-particle',
      { // Geometry
        type:'sphere',
        radius: 6
      },
      photonMaterial
    );

    // The graphic representing the polarization requires
    // setting the poynting vector
    var polarGraphic
    // This vector represents
    ,   rotationAxis = new THREE.Vector3();

    //-- Methods --//

    // Set Poynting vector
    this.setPoyntingVector = function(x, z) {
      poynting.set(x, z);
      poynting.normalize();

      // If the polarization graphic is not yet rendered, this function
      // will do so
      if(polarGraphic === undefined) {
        // The polarization is represented with a cylinder
        var randomState = polarization === 'random'
        ,   r = randomState? 20 : 1.5
        ,   h = randomState? 1 : 40;

        polarGraphic = new QUANTUM.ThreeChild(
          'photon-polarization',
          { // Geometry
            type: 'cylinder',
            radius: r, height: h
          },
          photonMaterial
        );
        polarGraphic.translate(position.x, position.y, position.z);

      }
      else {
        // Otherwise it rotates the graphic back to its original orientation
        var theta = polarization === 'random'? Math.PI/2 : polarization;
        polarGraphic.rotate(-theta, rotationAxis.x, 0, rotationAxis.z);
      }

      // Setting the axis of rotation for the polarization graphics
      polarization === 'random'?
        rotationAxis.set(poynting.y, 0, -poynting.x) : rotationAxis.set(poynting.x, 0, poynting.y);

      // Rotating the graphic to show the new orientation of the photon
      var theta = polarization === 'random'? Math.PI/2 : polarization;
      polarGraphic.rotate(theta, rotationAxis.x, 0, rotationAxis.z);
    }

    // This public boolean determines if the polarization indicator
    this.polarizeIndicator = true;

    // Polarize photon
    // input is angle of polarization (rad) or the string 'random'
    this.polarize = function(theta) {
      // Updates polarization indicator window if there is one
      if(QUANTUM.children['polarization-indicator'] && this.polarizeIndicator)
        QUANTUM.children['polarization-indicator'].polarize(
          theta === 'random'? theta : Math.round(1800 * theta / Math.PI) / 10
        );

      // Case where no change is necessary
      if(theta === polarization) return;

      // I remove the current graphic and set the reference to undefined
      polarGraphic.remove();
      polarGraphic = undefined;

      // I change the saved polarization
      polarization = theta;

      // I set the poyting vector to itself, which will render the polarization
      // graphic (no repeated code!!!)
      this.setPoyntingVector(poynting.x, poynting.y);
    }

    // Translate photon a distance x along its poynting vector
    this.translate = function(x, y, z) {
      // Updating position vector
      position.x += x; position.y += y; position.z += z;

      // Translating the photon in the direction of the poynting vector
      particle.translate(x, y, z);
      polarGraphic.translate(x, y, z);
    }

    // Shoot photon along its path a distance x over time t
    // it can include an optional callback function that executes when the animation ends
    this.shoot = function(t, x, callback) {
      position.x += x * poynting.x; position.z += x * poynting.y;
      particle.move(t, [x * poynting.x, 0, x * poynting.y]);
      polarGraphic.move(t, [x * poynting.x, 0, x * poynting.y], callback);
    }

    // Rotate polarization animation

    var r_progress = 0
    ,   initialPolarization
    ,   finalPolarization;

    // Defining the property 'r_progress'
    // this syntax allows me to overload set and get
    Object.defineProperty(this, 'r_progress', {
      set: function(value) {
        // Update the numerical representation polarization of the photon
        polarization -= r_progress * (finalPolarization - initialPolarization);
        r_progress = value;
        polarization += r_progress * (finalPolarization - initialPolarization);
        this.polarization = polarization;

        if(QUANTUM.children['polarization-indicator'] && this.polarizeIndicator)
          QUANTUM.children['polarization-indicator'].polarize(
            Math.round(1800 * polarization / Math.PI) / 10
          );
      },
      get: function() {
        return r_progress;
      }
    });

    // Rotate photons polarization
    // inputs are:
    // - time animation takes (seconds)
    // - dTheta, the overall change in the polarization (rad)
    this.rotatePolarization = function(time, dTheta) {
      // Preparing animation
      initialPolarization = polarization;
      finalPolarization = polarization + dTheta;

      // Rotating polar graphic
      polarGraphic.animateRotation(time, dTheta, [poynting.x, 0, poynting.z]);
      // Updating the numeric representation of the polarization
      QUANTUM.animator.to(this, {r_progress: 1}, time, function() {
        r_progress = 0;
        finalPolarization = initialPolarization + dTheta;
      })
    }

  }, // End of Photon3D class constructor

  // 3D PhotonSource class constructor
  PhotonSource3D: function() {
    // Creating the 3D objects that make up the photon source

    // This vector will contain all of the objects which render the 3D primitives
    var meshes = [];

    // Material object for the metal
    THREE.ImageUtils.crossOrigin = '';
    var metalMatObj = {
 			type: 'phong',
 			inputs: {
 				color: 0x999999,
 				specular: 0x999999,
        emissive: 0x222222,
 				shininess: 10,
 				metal: true,
        specularMap: QUANTUM._TEXTURE_SUPPORT?
          THREE.ImageUtils.loadTexture(QUANTUM._REMOTE_ASSETS['METAL TEXTURE']) : null
 			}
 		}

    // Main shell
    var shell = new QUANTUM.ThreeChild(
      'photon-source-shell',
      {
        type: 'cylinder',
        radius: 30,
        height: 60
      },
      metalMatObj
    );
    shell.rotate(Math.PI/2, 0, 0, 1);
    meshes.push(shell);

    // Outer shells
    var outerShellGeometry = {
      type: 'cylinder',
      radius: 35,
      height: 10
    }
    ,   shell1 = new QUANTUM.ThreeChild('photon-source-shell1', outerShellGeometry, metalMatObj)
    ,   shell2 = new QUANTUM.ThreeChild('photon-source-shell2', outerShellGeometry, metalMatObj);
    shell1.rotate(Math.PI/2, 0, 0, 1);
    shell1.translate(25, 0, 0);
    meshes.push(shell1);
    shell2.rotate(Math.PI/2, 0, 0, 1);
    shell2.translate(-25, 0, 0);
    meshes.push(shell2);

    // Bevels for visual effect
    var bevelGeometry = {
      type: 'cylinder',
      radius: 35,
      radius2: 0,
      height: 20
    }
    ,   bevel1 = new QUANTUM.ThreeChild('photon-source-bevel1', bevelGeometry, metalMatObj)
    ,   bevel2 = new QUANTUM.ThreeChild('photon-source-bevel2', bevelGeometry, metalMatObj);
    bevel1.rotate(-Math.PI/2, 0, 0, 1);
    bevel1.translate(10, 0, 0);
    meshes.push(bevel1);
    bevel2.rotate(Math.PI/2, 0, 0, 1);
    bevel2.translate(-10, 0, 0);
    meshes.push(bevel2);

    // Red lens where photons exit source
    var lens = new QUANTUM.ThreeChild(
      'photon-source-lens',
      { // Geometry object
        type: 'parametric',
        surface: function(s, t) {
          var x = 30 + 12 * Math.sin(2*Math.PI*s) * Math.sin(2*Math.PI*t);
   				var y = 25 * Math.cos(2*Math.PI*s);
   				var z = 25 * Math.sin(2*Math.PI*s) * Math.cos(2*Math.PI*t);

   				return new THREE.Vector3(x, y, z);
        }
      },
      { // Material object
        type: 'phong',
        inputs: {
          color: 0xff0000,
   				specular: 0x555555,
   				shininess: 50
        }
      }
    );
    meshes.push(lens);

    //-- Methods --//

    // Translation vector
    var t = new THREE.Vector3(0, 0, 0);

    // Translate photon source
    // inputs are components of the vector representing the translation
    this.translate = function(x, y, z) {
      t.x += x, t.y += y, t.z += z;
      for(i in meshes) meshes[i].translate(x, y, z);
    }

    // Animate motion of the photon source
    // inputs are:
    // - time animation takes (seconds)
    // - vector representing the translation (Array)
    // - callback function that executes when the animation is over
    this.move = function(time, deltaS, callback) {
      t.x += deltaS[0]; t.y += deltaS[1]; t.z += deltaS[2];
      for(var i = 0; i < meshes.length-1; i++) meshes[i].move(time, deltaS);
      meshes[meshes.length-1].move(time, deltaS, callback);
    }

    // Rotating source about Y-axis

 		this.theta = 0;

    // Rotate source a specified angle
 		this.rotate = function(angle) {
 			this.theta += angle;
 			this.theta %= 2*Math.PI;

 			// Rotating the center piece and lens
 			shell.rotate(angle, 1, 0, 0);
 			lens.rotate(angle, 0, 1, 0);

 			var p = shell.mesh.position;

 			// Rotating the back end
 			var bmp = shell2.mesh.position
      ,   bmx = bmp.x - p.x
      ,   bmz = bmp.z - p.z;
 			shell2.rotate(angle, 1, 0, 0);
 			shell2.translate(-bmx, 0, -bmz);
 			shell2.translate(
 				bmx * Math.cos(angle) + bmz * Math.sin(angle),
 				0,
 				bmx * -Math.sin(angle) + bmz * Math.cos(angle)
 			);
 			// Rotating the back bevel
 			var bbp = bevel2.mesh.position
      ,   bbx = bbp.x - p.x
      ,   bbz = bbp.z - p.z;
 			bevel2.rotate(angle, 1, 0, 0);
 			bevel2.translate(-bbx, 0, -bbz);
 			bevel2.translate(
 				bbx * Math.cos(angle) + bbz * Math.sin(angle),
 				0,
 				bbx * -Math.sin(angle) + bbz * Math.cos(angle)
 			);

 			// Rotating the  end
 			var fmp = shell1.mesh.position
      ,   fmx = fmp.x - p.x
      ,   fmz = fmp.z - p.z;
 			shell1.rotate(angle, 1, 0, 0);
 			shell1.translate(-fmx, 0, -fmz);
 			shell1.translate(
 				fmx * Math.cos(angle) + fmz * Math.sin(angle),
 				0,
 				fmx * -Math.sin(angle) + fmz * Math.cos(angle)
 			);
 			// Rotating the back bevel
 			var fbp = bevel1.mesh.position
      ,   fbx = fbp.x - p.x
      ,   fbz = fbp.z - p.z;
 			bevel1.rotate(-angle, 1, 0, 0);
 			bevel1.translate(-fbx, 0, -fbz);
 			bevel1.translate(
 				fbx * Math.cos(angle) + fbz * Math.sin(angle),
 				0,
 				fbx * -Math.sin(angle) + fbz * Math.cos(angle)
 			);
 		}

 		// Animate to angle

 		var rotationProgress = 0
    ,   initialAngle
    ,   targetAngle;

    // Defining an object property rotationProgress
    // using an overloaded set and get
 		Object.defineProperty(this, 'rotationProgress', {
 			set: function(value) {
 				var dTheta = (targetAngle - initialAngle) * rotationProgress;
 				this.rotate(-dTheta);

 				rotationProgress = value;

 				dTheta = (targetAngle - initialAngle) * rotationProgress;
 				this.rotate(dTheta);
 			},
 			get: function() {
 				return rotationProgress;
 			}
 		});

 		this.animateToAngle = function(time, angle, callback) {
 			initialAngle = this.theta;
 			targetAngle = angle;

 			QUANTUM.animator.to(this, {rotationProgress: 1}, time, function() {
        this.theta %= (2 * Math.PI);
        rotationProgress = 0;
        if(callback !== undefined) callback();
      });
 		}

    // Add label
    this.addLabel = function(dx, dy) {
      shell.addLabel('Photon<br>Source', dx, dy);
      shell.label.hide();
      shell.label.show(800);
    }

    // Remove label
    this.removeLabel = function() {
      shell.label.hide(true);
      setTimeout(function() {
        shell.removeLabel();
      }, 400)
    }

    // Blink animation
    this.blink = function() {
      // Add light
      QUANTUM.children['SceneBox'].addPointLight({
        position: new THREE.Vector3(50 + t.x, t.y, t.z),
        color: 0xff0000,
        decay: 200,
        name: 'photon-source-light'
      });
      // Remove light half a second later
      setTimeout(function() {
        QUANTUM.children['SceneBox'].removePointLight('photon-source-light');
      }, 500);
    }
  }, // End of PhotonSource3D class constructor

  // Polarizer class constructor
  // this object renders a 3D polarizer in a WebGL scene
  Polarizer: function() {
    // Adding this polarizer to a vector defined earlier
    var index = QUANTUM.polarizers.length;
    QUANTUM.polarizers.push(this);

    // Creating 3D objects that make up the polarizer

    // This vector will contain all of the objects which render the 3D primitives
    var meshes = [];

    // Material for metal components
    THREE.ImageUtils.crossOrigin = '';
    var metalMatObj = {
 			type: 'phong',
 			inputs: {
 				color: 0x999999,
 				specular: 0xffffff,
 				shininess: 10,
 				metal: true,
        side: THREE.DoubleSide,
        specularMap: QUANTUM._TEXTURE_SUPPORT?
          THREE.ImageUtils.loadTexture(QUANTUM._REMOTE_ASSETS['METAL TEXTURE']) : null
 			}
 		}

    // Outer edge of the metallic cylinder containing the polarizing material
    var outerEdge = new QUANTUM.ThreeChild('polarizer-edge-'+index, {
        //Geometry object
        type: 'parametric',
        surface: function(s, t) {
          return new THREE.Vector3(
            -6 + 12*s,
            50 * Math.cos(2*Math.PI * t),
            50 * Math.sin(2*Math.PI * t)
          );
        }
      },
      metalMatObj
    );
    meshes.push(outerEdge);

    // Metal rings make up the face of the metal container
    var ringGeometryObj = {
      type: 'ring',
      innerRadius: 45,
      outerRadius: 50
    }
    ,   ring1 = new QUANTUM.ThreeChild('polarizer-ring1-'+index, ringGeometryObj, metalMatObj)
    ,   ring2 = new QUANTUM.ThreeChild('polarizer-ring2-'+index, ringGeometryObj, metalMatObj)
    ring1.rotate(Math.PI/2, 0, 1, 0);
    ring1.translate(6, 0, 0);
    meshes.push(ring1);
    ring2.rotate(-Math.PI/2, 0, 1, 0);
    ring2.translate(-6, 0, 0);
    meshes.push(ring2);

    // Bevels for visual effect
    var bevelGeometryObj = {
      type: 'parametric',
      surface: function(s, t) {
        return new THREE.Vector3(
          5*t,
          (35 + 10 * t) * Math.cos(2*Math.PI * s),
          (35 + 10 * t) * Math.sin(2*Math.PI * s)
        );
      }
    }
    ,   bevel1 = new QUANTUM.ThreeChild('polarizer-bevel1-'+index, bevelGeometryObj, metalMatObj)
    ,   bevel2 = new QUANTUM.ThreeChild('polarizer-bevel1-'+index, bevelGeometryObj, metalMatObj);
    bevel1.translate(1, 0, 0);
    meshes.push(bevel1);
    bevel2.rotate(Math.PI, 0, 1, 0);
    bevel2.translate(-1, 0, 0);
    meshes.push(bevel2);

    // Polarizing material
    var lensGeometryObj = {
      type: 'circle',
      radius: 50
    }
    ,   lensMaterialObj = QUANTUM._TEXTURE_SUPPORT?
      {
        type: 'mirror',
        color: 0x333333
      } :
      {
        type: 'lambertian',
        inputs: {color: 0x333333}
      }
    ,   lens1 = new QUANTUM.ThreeChild('polarizer-lens1-'+index, lensGeometryObj, lensMaterialObj)
    ,   lens2 = new QUANTUM.ThreeChild('polarizer-lens1-'+index, lensGeometryObj, lensMaterialObj);
    lens1.rotate(Math.PI/2, 0, 1, 0);
    lens1.translate(4, 0, 0);
    meshes.push(lens1);
    lens2.rotate(-Math.PI/2, 0, 1, 0);
    lens2.translate(-4, 0, 0);
    meshes.push(lens2);

    // Cylinders indicate the orientation of the transmission axis
    var knobGeometryObj = {
      type: 'cylinder',
      radius: 4,
      height: 20
    }
    ,   topKnob = new QUANTUM.ThreeChild('polarizer-top-knob-'+index, knobGeometryObj, metalMatObj)
    ,   bottomKnob = new QUANTUM.ThreeChild('polarizer-bottom-knob-'+index, knobGeometryObj, metalMatObj);
    topKnob.translate(0, 60, 0);
    meshes.push(topKnob);
    bottomKnob.translate(0, -60, 0);
    meshes.push(bottomKnob);

    //-- Methods --//

    // Angle the transmission axis makes with the y-axis
    this.theta = 0;
    // Axis that the knobs rotate around
    var rotAxis = new THREE.Vector3(1, 0, 0);

    // Add label
    this.addLabel = function(dx, dy) {
      var theta = this.theta;
      outerEdge.addLabel(
        Math.round(180 * theta / Math.PI) % 180 + '&#176', dx, dy
      );
      outerEdge.label.hide();
      outerEdge.label.show(800);
    }

    // Remove label
    this.removeLabel = function() {
      if(outerEdge.label) outerEdge.label.hide(true);
      setTimeout(function() {
        outerEdge.removeLabel();
      }, 400);
    }

    // Orient polarization lens to a specified angle
    this.orientToAngle = function(angle) {
      // This vector represents the distance from the center
      // of the polarizer to the center of the knobs
      var p = new THREE.Vector3(0, 60, 0);

      // Translating the knobs to the center of the lens
      p.applyAxisAngle(rotAxis, this.theta);
      topKnob.translate(-p.x, -p.y, -p.z);
      p.applyAxisAngle(rotAxis, Math.PI);
      bottomKnob.translate(-p.x, -p.y, -p.z);
      p.set(0, 60, 0);

      // Rotating the knobs to the specified angle
      topKnob.rotate(-this.theta, rotAxis.x, rotAxis.y, rotAxis.z);
      topKnob.rotate(angle, rotAxis.x, rotAxis.y, rotAxis.z);
      bottomKnob.rotate(-this.theta, rotAxis.x, rotAxis.y, rotAxis.z);
      bottomKnob.rotate(angle, rotAxis.x, rotAxis.y, rotAxis.z);

      // Saving the new angle
      this.theta = angle;

      // Translating the knobs to the correct position
      p.applyAxisAngle(rotAxis, angle);
      topKnob.translate(p.x, p.y, p.z);
      p.applyAxisAngle(rotAxis, Math.PI);
      bottomKnob.translate(p.x, p.y, p.z);

      // Updating the label (if there is one)
      if(outerEdge.label)
        outerEdge.label.setContent((180 * angle / Math.PI) % 180 + '&#176');
    }

    // Animate lens to angle
    // inputs are:
    // - time animation will take (seconds)
    // - final angle the transmission axis will make with the vertical
    // - callback function that executes when the animation ends
    this.animateToAngle = function(time, finalAngle, callback) {
      // Saving the initial angle
      var initialAngle = this.theta;

      // Animating the rotation of the knobs
      topKnob.animateRotation(time, finalAngle - initialAngle, [rotAxis.x, rotAxis.y, rotAxis.z]);
      bottomKnob.animateRotation(time, finalAngle - initialAngle, [rotAxis.x, rotAxis.y, rotAxis.z]);

      // Animating the movement of the knobs around the frame of the lens
      var rotatedAngle = 0
      ,   self = this;

      // First I have to translate them back to the center of the frame,
      // this makes the parameterization of the path simpler
      var p = new THREE.Vector3(0, 60, 0);
      p.applyAxisAngle(rotAxis, initialAngle);
      topKnob.translate(-p.x, -p.y, -p.z);
      p.applyAxisAngle(rotAxis, Math.PI);
      bottomKnob.translate(-p.x, -p.y, -p.z);

      // Animating motion of top knob
      topKnob.animateAlongPath(time, function(s) {
        var p = new THREE.Vector3(0, 60, 0);
        p.applyAxisAngle(rotAxis, initialAngle + s * (finalAngle - initialAngle));
        return p;
      });

      // Animating motion of bottom knob
      bottomKnob.animateAlongPath(time, function(s) {
        var p = new THREE.Vector3(0, -60, 0);
        var theta = initialAngle + s * (finalAngle - initialAngle);
        p.applyAxisAngle(rotAxis, theta);

        // Updating the label if there is one
        if(outerEdge.label) {
          outerEdge.removeLabel();
          outerEdge.addLabel(
            Math.round(180 * theta / Math.PI) % 180 + '&#176',
            outerEdge.labelInfo[1],
            outerEdge.labelInfo[2]
          );
        }

        return p;
      },
      function() {
        self.theta = finalAngle;
        if(callback !== undefined) callback();
      })
    }

    // Rotate polarizer into XY plane
    this.putInXYPlane = function() {
      // Rotating the outer ring
      outerEdge.rotate(Math.PI/2, 0, 1, 0);
      // Rotating and translating the metal rings
      ring1.rotate(-Math.PI/2, 0, 1, 0);
      ring1.translate(-6, 0, 6);
      ring2.rotate(Math.PI/2, 0, 1, 0);
      ring2.translate(6, 0, -6);
      // Rotating bevels
      bevel1.rotate(-Math.PI/2, 0, 1, 0);
      bevel1.translate(-1, 0, 1);
      bevel2.rotate(Math.PI/2, 0, 1, 0);
      bevel2.translate(1, 0, -1);
      // Rotating lenses
      lens1.rotate(-Math.PI/2, 0, 1, 0);
      lens1.translate(-4, 0, 4);
      lens2.rotate(Math.PI/2, 0, 1, 0);
      lens2.translate(4, 0, -4);
      // Rotating the axis of rotation of the transmission axis
      rotAxis = new THREE.Vector3(0, 0, 1);
    }

    // Translate polarizer
    // inputs are components of the vector representing the translation
    this.translate = function(x, y, z) {
      for(i in meshes) meshes[i].translate(x, y, z);
    }

    // Animate motion of lens
    // inputs are:
    // - time animation takes (seconds)
    // - vector representing the translation (Array)
    // - callback function that executes when the animation is over
    this.move = function(time, deltaS, callback) {
      for(var i = 0; i < meshes.length-1; i++) meshes[i].move(time, deltaS);
      meshes[meshes.length-1].move(time, deltaS, callback);
    }

    //-- Methods and properties for polarization free mode --//

    // This boolean determines if the polarizers that can be toggled on and off
    // are in the experiment view
    this.inView = false;

    // Add input box for user to set polarizer angle
    this.addInput = function() {

      // Instantiating a new child object which contains the actual input div
      this.input = new QUANTUM.Child('polarizer-'+i+'-input-container', 445 + (index-1) * 125, 395, 100, 80);
      this.input.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
      this.input.addStroke(100, 100, 100);
      this.input.addShadow();
      this.input.$.css('z-index', 2);
      QUANTUM.instance.add(this.input, true);

      // Creating HTML input element inside the container
      var s = QUANTUM._SCALE_FACTOR
      ,   self = this
      ,   input = document.createElement('input');

      $(input)
        .css({
          'position': 'absolute',
          'left': (5 * s) + 'px',
          'top': (5 * s) + 'px',
          'box-shadow': 'inset '+ (2*s) +'px'+ (2*s) +'px'+ (5*s) +'px rgba(0,0,0,0.5)',
          'width': (80*s) + 'px',
          'height': (60*s) + 'px',
          'padding': (2.5 * s) + 'px',
          'background': '#ffffff',
          'font-size': (42 * s) + 'px',
          'font-family': 'Roboto',
          'text-align': 'center'
        })
        .keydown(function(event) {
          if(event.keyCode === 13) {
            // Changing the angle of the polarizer
            var value = parseFloat(input.value);
            isNaN(value)? self.orientToAngle(0) : self.orientToAngle(Math.PI * value / 180);

            // Changing the length of the light path if it's necessary
            var polarizersInView = QUANTUM.polarizers.filter(function(current) {
              return current.inView;
            })
            ,   probability = 1;
            for(var i = 1; i < polarizersInView.length; i++) {
              // Changing the probability displayed on the screen
              probability *= Math.pow(Math.cos(polarizersInView[i].theta - polarizersInView[i-1].theta), 2);
              if(i === polarizersInView.length - 1)
                QUANTUM.children['Screen3D'].illuminate(probability);

              if(Math.abs(polarizersInView[i].theta - polarizersInView[i-1].theta) % (2 * Math.PI) === Math.PI/2) {
                var index = QUANTUM.polarizers.indexOf(polarizersInView[i])
                ,   length = 150 + 100 * index;
                QUANTUM.lightPaths[0].changeLength(length - QUANTUM.lightPaths[0].length);
                break;
              }
              else if(i === polarizersInView.length - 1) {
                var length = 600;
                QUANTUM.lightPaths[0].changeLength(length - QUANTUM.lightPaths[0].length);
              }
            }
          }
        });

      // Adding input to the child object instantiated above
      this.input.div.appendChild(input);
    }

    // Remove input box
    this.removeInput = function() {
      var self = this;

      if(self.input) {
        self.input.hide(true);
        setTimeout(function() {
          QUANTUM.removeChild(self.input);
          setTimeout(function() { delete self.input; }, 500);
        }, 800);
      }
    }
  },
  // End of Polarizer class

  // Mirror3D class constructor
  // this class renders a 3 dimensional, reflective Mirror3D
  Mirror3D: function() {
    var i = QUANTUM.mirrors.length;
    QUANTUM.mirrors.push(this);

    // Rendering 3D graphics

    // This vector will contain all of the objects which render the 3D primitives
    var meshes = [];

    // Material object for the walls of the mirror
    var bodyMaterial = {
      type: 'phong',
      inputs: {color: 0xaabbcc, side: THREE.DoubleSide}
    };

    // Back wall of the body
    var back = new QUANTUM.ThreeChild(
      'mirror-back-wall-'+i,
      { // Geometry object
        type: 'plane',
        lx: 100, ly: 100
      },
      bodyMaterial
    );
    back.rotate(Math.PI, 0, 1, 0);
    back.translate(0, 0, -10);
    meshes.push(back);

    // Side walls, there is empty space between the plane where the
    // texture is rendered and the back of the mirror to prevent overlap
    // from rounding errors
    var wallGeometry = {
      type: 'plane',
      lx: 100, ly: 10
    }
    ,   topWall = new QUANTUM.ThreeChild(
      'mirror-top-wall-'+i,
      wallGeometry,
      bodyMaterial
    )
    ,   bottomWall = new QUANTUM.ThreeChild(
      'mirror-bottom-wall-'+i,
      wallGeometry,
      bodyMaterial
    )
    ,   leftWall = new QUANTUM.ThreeChild(
      'mirror-left-wall-'+i,
      wallGeometry,
      bodyMaterial
    )
    ,   rightWall = new QUANTUM.ThreeChild(
      'mirror-right-wall-'+i,
      wallGeometry,
      bodyMaterial
    );
    topWall.translate(0, 50, -5);
    topWall.rotate(-Math.PI/2, 1, 0, 0);
    meshes.push(topWall);
    bottomWall.translate(0, -50, -5);
    bottomWall.rotate(Math.PI/2, 1, 0, 0);
    meshes.push(bottomWall);
    leftWall.rotate(Math.PI/2, 0, 0, 1);
    leftWall.rotate(-Math.PI/2, 1, 0, 0);
    leftWall.translate(-50, 0, -5);
    meshes.push(leftWall);
    rightWall.rotate(Math.PI/2, 0, 0, 1);
    rightWall.rotate(Math.PI/2, 1, 0, 0);
    rightWall.translate(50, 0, -5);
    meshes.push(rightWall);

    // Mirror
    var mirror = new QUANTUM.ThreeChild(
      'mirror-'+i,
      { // Geometry
        type: 'plane',
        lx: 100, ly: 100
      },
      { // Material
        type: 'mirror',
        color: 0x99aabb
      }
    );
    meshes.push(mirror);

    // Put the mirror in the XZ plane
    // input is a string that can be:
    // - '+x' which means the screen will face the +x direction
    // - '-x' screen faces the -x direction
    this.putInXZPlane = function(direction) {
      if(direction !== '+x' && direction !== '-x') {
        console.log('Error: Put in XZ plane method needs \'+x\' or \'-x\' as an argument');
        return;
      }

      // Rotating and moving the back
      back.rotate(Math.PI/2, 0, 1, 0);
      back.translate(direction === '+x'? -10 : 10, 0, 10);

      // Rotating and moving the walls (the sides do not need to rotate)
      topWall.rotate(Math.PI/2, 0, 0, 1);
      topWall.translate(direction === '+x'? -5 : 5, 0, 5);
      bottomWall.rotate(Math.PI/2, 0, 0, 1);
      bottomWall.translate(direction === '+x'? -5 : 5, 0, 5);
      leftWall.rotate(Math.PI/2, 1, 0, 0);
      leftWall.translate(direction === '+x'? 45 : 55, 0, -45);
      rightWall.rotate(Math.PI/2, 1, 0, 0);
      rightWall.translate(direction === '+x'? -55 : -45, 0, 55);

      // Rotating and translating the screen
      mirror.rotate(direction === '+x'? Math.PI/2 : -Math.PI/2, 0, 1, 0);
    }

    // Translate the mirror
    // inputs are components of the vector representing the translation
    this.translate = function(x, y, z) {
      for(i in meshes) meshes[i].translate(x, y, z);
    }

    // Animate translation
    // inputs are:
    // - time animation takes (seconds)
    // - translation vector (Array)
    // - callback function that executes when the animation ends (optional)
    this.move = function(time, deltaS, callback) {
      for(var i = 0; i < meshes.length-1; i++) meshes[i].move(time, deltaS);
      meshes[meshes.length - 1].move(time, deltaS, callback);
    }

    // Add label
    this.addLabel = function(dx, dy) {
      back.addLabel('Mirror', dx, dy);
      back.label.hide();
      back.label.show(800);
    }

    // Remove label
    this.removeLabel = function() {
      back.label.hide(true);
      setTimeout(function() {
        back.removeLabel();
      }, 600);
    }
  },
  // End of Mirror3D class

  // Screen3D class constructor
  // an illuminating screen that lights up when a photon is detected
  // inputs are:
  Screen3D: function() {
    // Some exercises need 2 screens so this is to avoid overwriting
    var name = QUANTUM.children['Screen3D'] === undefined? 'Screen3D' : 'Screen3D-2';
    QUANTUM.children[name] = this;

    // Rendering 3D objects in the scene

    // This vector will contain all of the objects which render the 3D primitives
    var meshes = [];

    // Body material
    var bodyMaterial = {
      type: 'phong',
      inputs: {color: 0x222222, side: THREE.DoubleSide}
    }
    // Back of the screen
    ,   back = new QUANTUM.ThreeChild(
      name,
      { // Geometry object
        type: 'plane',
        lx: 100, ly: 100
      },
      bodyMaterial
    );
    back.rotate(Math.PI, 0, 1, 0);
    back.translate(0, 0, -10);
    meshes.push(back);

    // Side walls, there is empty space between the plane where the
    // texture is rendered and the back of the screen to prevent overlap
    // from rounding errors
    var wallGeometry = {
      type: 'plane',
      lx: 100, ly: 10
    }
    ,   topWall = new QUANTUM.ThreeChild(
      name + '-top-wall',
      wallGeometry,
      bodyMaterial
    )
    ,   bottomWall = new QUANTUM.ThreeChild(
      name + '-bottom-wall',
      wallGeometry,
      bodyMaterial
    )
    ,   leftWall = new QUANTUM.ThreeChild(
      name + '-left-wall',
      wallGeometry,
      bodyMaterial
    )
    ,   rightWall = new QUANTUM.ThreeChild(
      name + '-right-wall',
      wallGeometry,
      bodyMaterial
    );
    topWall.translate(0, 50, -5);
    topWall.rotate(-Math.PI/2, 1, 0, 0);
    meshes.push(topWall);
    bottomWall.translate(0, -50, -5);
    bottomWall.rotate(Math.PI/2, 1, 0, 0);
    meshes.push(bottomWall);
    leftWall.rotate(Math.PI/2, 0, 0, 1);
    leftWall.rotate(-Math.PI/2, 1, 0, 0);
    leftWall.translate(-50, 0, -5);
    meshes.push(leftWall);
    rightWall.rotate(Math.PI/2, 0, 0, 1);
    rightWall.rotate(Math.PI/2, 1, 0, 0);
    rightWall.translate(50, 0, -5);
    meshes.push(rightWall);

    // Creatingt the HTML canvas that the illumination graphic will be rendered on
    var canvas = document.createElement('canvas')
    ,   ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    // Texture object
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Screen lies on this plane
    var screen = new QUANTUM.ThreeChild(
      name + '-canvas',
      { // Geometry object
        type: 'plane',
        lx: 100, ly: 100
      },
      {
        type: 'lambertian',
        inputs: {
          map: texture
        }
      }
    );
    meshes.push(screen);

    //-- Methods --//

    // Reset screen
    this.reset = function() {
      // Make canvas blank
      ctx.fillStyle = '#222222';
      ctx.fillRect(0, 0, 512, 512);

      // Map it to the screen
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      screen.mesh.material.map = texture;
    }
    this.reset();

    // Illuminate screen (function of probability)
		this.illuminate = function(p) {
			this.reset();

			// Create radial gradient
			var grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 100);
			grad.addColorStop(0, '#ff9999');
			grad.addColorStop(0.55 * Math.pow(p, 2), '#ff2222');
			grad.addColorStop(0.95 * Math.pow(p, 1/2), '#222222');
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, 512, 512);

			// Map it to the screen
			texture = new THREE.Texture(canvas);
			texture.needsUpdate = true;
			screen.mesh.material.map = texture;

			// Display probability
			ctx.font = "65px Arial";
			ctx.fillStyle = '#ff3333';
			ctx.textAlign = 'center';
			ctx.fillText(Math.round(100 * p) + '%', 128, 64);
		}

    // Put the screen in the XZ plane
    // input is a string that can be:
    // - '+x' which means the screen will face the +x direction
    // - '-x' screen faces the -x direction
    this.putInXZPlane = function(direction) {
      if(direction !== '+x' && direction !== '-x') {
        console.log('Error: Put in XZ plane method needs \'+x\' or \'-x\' as an argument');
        return;
      }

      // Rotating and moving the back
      back.rotate(Math.PI/2, 0, 1, 0);
      back.translate(direction === '+x'? -10 : 10, 0, 10);

      // Rotating and moving the walls (the sides do not need to rotate)
      topWall.rotate(Math.PI/2, 0, 0, 1);
      topWall.translate(direction === '+x'? -5 : 5, 0, 5);
      bottomWall.rotate(Math.PI/2, 0, 0, 1);
      bottomWall.translate(direction === '+x'? -5 : 5, 0, 5);
      leftWall.rotate(Math.PI/2, 1, 0, 0);
      leftWall.translate(direction === '+x'? 45 : 55, 0, -45);
      rightWall.rotate(Math.PI/2, 1, 0, 0);
      rightWall.translate(direction === '+x'? -55 : -45, 0, 55);

      // Rotating and translating the screen
      screen.rotate(direction === '+x'? Math.PI/2 : -Math.PI/2, 0, 1, 0);
    }

    // Translate the screen
    // inputs are components of the vector representing the translation
    this.translate = function(x, y, z) {
      for(i in meshes) meshes[i].translate(x, y, z);
    }

    // Animate translation
    // inputs are:
    // - time animation takes (seconds)
    // - translation vector (Array)
    // - callback function that executes when the animation ends (optional)
    this.move = function(time, deltaS, callback) {
      for(var i = 0; i < meshes.length-1; i++) meshes[i].move(time, deltaS);
      meshes[meshes.length - 1].move(time, deltaS, callback);
    }

    // Add label
    this.addLabel = function(dx, dy) {
      back.addLabel('Screen', dx, dy);
      back.label.hide();
      back.label.show(800);
    }

    // Remove label
    this.removeLabel = function() {
      back.label.hide(true);
      setTimeout(function() {
        back.removeLabel();
      }, 600);
    }
  }, // End of Screen3D constructor

  // PolarizingBeamSplitter class
  // this class renders a polarizing beam splitter graphic
  // and has some general translation methods
  PolarizingBeamSplitter: function() {
    // Rendering 3D graphics

    // This vector will contain all of the objects which render the 3D primitives
    var meshes = [];

    // Material objects (blue and clear)
    var blueMaterial = {
      type:'phong',
 			inputs: {
 				color: 0x7788dd,
 				shininess: 30,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
 			}
    }
    ,   clearMaterial = {
      type: 'phong',
 			inputs: {
 				color: 0xcccccc,
 				shininess: 10,
 				transparent: true,
 				opacity: 0.7,
        side: THREE.DoubleSide
 			}
    };

    // Walls that make up the sides of the beam splitter
    var wallGeometry = {
      type: 'plane',
      lx: 60, ly: 60
    }
    ,   backWall = new QUANTUM.ThreeChild(
      'beam-splitter-back-wall',
      wallGeometry,
      clearMaterial
    )
    ,   frontWall = new QUANTUM.ThreeChild(
      'beam-splitter-front-wall',
      wallGeometry,
      blueMaterial
    )
    ,   leftWall = new QUANTUM.ThreeChild(
      'beam-splitter-left-wall',
      wallGeometry,
      clearMaterial
    )
    ,   rightWall = new QUANTUM.ThreeChild(
      'beam-splitter-right-wall',
      wallGeometry,
      blueMaterial
    );
    backWall.rotate(Math.PI, 0, 1, 0);
    backWall.translate(0, 0, -30);
    meshes.push(backWall);
    frontWall.translate(0, 0, 30);
    meshes.push(frontWall);
    leftWall.rotate(-Math.PI/2, 0, 1, 0);
    leftWall.translate(-30, 0, 0);
    meshes.push(leftWall);
    rightWall.rotate(Math.PI/2, 0, 1, 0);
    rightWall.translate(30, 0, 0);
    meshes.push(rightWall);

    // Triangles on the top and bottom
    var triangleGeometry = {
      type: 'parametric',
      surface: function(s, t) {
        return new THREE.Vector3(
          30 - 2 * s * 30,
          0,
          30 - 2 * t * (30 - s * 30)
        );
      }
    }
    ,   topBlueTriangle = new QUANTUM.ThreeChild(
      'beam-splitter-top-blue-triangle',
      triangleGeometry,
      blueMaterial
    )
    ,   topClearTriangle = new QUANTUM.ThreeChild(
      'beam-splitter-top-clear-triangle',
      triangleGeometry,
      clearMaterial
    )
    ,   bottomBlueTriangle = new QUANTUM.ThreeChild(
      'beam-splitter-bottom-blue-triangle',
      triangleGeometry,
      blueMaterial
    )
    ,   bottomClearTriangle = new QUANTUM.ThreeChild(
      'beam-splitter-bottom-clear-triangle',
      triangleGeometry,
      clearMaterial
    );
    topBlueTriangle.translate(0, 30, 0);
    meshes.push(topBlueTriangle);
    topClearTriangle.rotate(Math.PI, 0, 1, 0);
    topClearTriangle.translate(0, 30, 0);
    meshes.push(topClearTriangle);
    bottomBlueTriangle.translate(0, -30, 0);
    meshes.push(bottomBlueTriangle);
    bottomClearTriangle.rotate(Math.PI, 0, 1, 0);
    bottomClearTriangle.translate(0, -30, 0);
    meshes.push(bottomClearTriangle);

    //-- Methods --//

    // General translation
    // inputs are components of the vector representing the translation
    this.translate = function(x, y, z) {
      for(i in meshes) meshes[i].translate(x, y, z);
    }

    // Animate translation
    // inputs are:
    // - time animation will take (seconds)
    // - translation vector (Array)
    // - callback function that executes when animation ends (optional)
    this.move = function(time, deltaS, callback) {
      for(var i = 0; i < meshes.length-1; i++) meshes[i].move(time, deltaS);
      meshes[meshes.length-1].move(time, deltaS, callback);
    }

    // Rotation

    // Saving the angle of orientation
    this.theta = 0;

    // Rotate beam splitter
    // input is the angle of rotation (radians)
    this.rotate = function(angle) {
      // Rotating 3D components
      for(i in meshes) meshes[i].rotate(angle, 0, 1, 0);

      // Translating walls to the center of the beam splitter
      backWall.translate(30 * Math.sin(this.theta), 0, 30 * Math.cos(this.theta));
      frontWall.translate(-30 * Math.sin(this.theta), 0, -30 * Math.cos(this.theta));
      leftWall.translate(30 * Math.cos(this.theta), 0, -30 * Math.sin(this.theta));
      rightWall.translate(-30 * Math.cos(this.theta), 0, 30 * Math.sin(this.theta));

      // Translating the walls to match the new orientation
      this.theta += angle;
      backWall.translate(-30 * Math.sin(this.theta), 0, -30 * Math.cos(this.theta));
      frontWall.translate(30 * Math.sin(this.theta), 0, 30 * Math.cos(this.theta));
      leftWall.translate(-30 * Math.cos(this.theta), 0, 30 * Math.sin(this.theta));
      rightWall.translate(30 * Math.cos(this.theta), 0, -30 * Math.sin(this.theta));
    }

    // Rotation animation

    var self = this
    ,   r_progress = 0
    ,   initialAngle
    ,   finalAngle;

    // Defining property rotation progress
    // this syntax allows me to overload the set and get
    Object.defineProperty(this, 'r_progress', {
      set: function(value) {
        var dTheta = (targetAngle - initialAngle) * r_progress;
 				this.rotate(-dTheta);

 				r_progress = value;

 				dTheta = (targetAngle - initialAngle) * r_progress;
 				this.rotate(dTheta);
      },
      get: function() {
        return r_progress;
      }
    });

    // Call this method to animate the angle of the beam splitter
    // to a specified angle
    // inputs are:
    // - time animation takes (seconds)
    // - angle of the final orientation
    // - callback that executes when the animation ends (optional)
    this.animateToAngle = function(time, angle, callback) {
 			initialAngle = this.theta;
 			targetAngle = angle;

      QUANTUM.animator.to(this, {r_progress: 1}, time, function() {
        r_progress = 0;
        self.theta %= (2 * Math.PI);
        if(callback !== undefined) callback();
      });
    }

    // Add label
    this.addLabel = function(dx, dy) {
      backWall.addLabel('Polarizing Beam<br>Splitter', dx, dy);
      backWall.label.hide();
      backWall.label.show(800);
    }

    // Remove label
    this.removeLabel = function() {
      backWall.label.hide(true);
      setTimeout(function() {
        backWall.removeLabel();
      }, 600);
    }
  }, // End of PolarizingBeamSplitter class constructor

  // PolarizationRotator class constructor
  // this class renders a cylindrical polarization rotator
  // input is the number of degrees the photon's polarization will rotate
  // which will also determine the length of the graphic
  PolarizationRotator: function(deg) {
    // Angle of rotation determines length
    deg = parseFloat(deg);
    this.length = 180 * (deg / 90);

    // Rendering 3D cylinder in multiple parts so that the bases may
    // be removed

    // This vector will contain all of the objects which render the 3D primitives
    var meshes = [];

    // The meshes will be rendered with this material
    var rotatorMaterial = {
      type: 'phong',
      inputs: {
				color: 0xaaddff,
				specular: 0xffffff,
				transparent: true,
				opacity: 0.6
			}
    };

    // Body of the beam splitter
    var body = new QUANTUM.ThreeChild(
      'polarization-rotator-body',
      { // Geometry
        type: 'cylinder',
        radius: 40,
        height: (180 * (deg / 90)),
        open: true
      },
      rotatorMaterial
    );
    body.rotate(Math.PI/2, 0, 0, 1);
    meshes.push(body);

    // Bases

    // Geometry
    var baseGeometry = { type: 'circle', radius: 40 }
    // Left base
    ,   leftBase = new QUANTUM.ThreeChild(
      'polarization-rotator-left-base',
      baseGeometry,
      rotatorMaterial
    )
    // Right base
    ,   rightBase = new QUANTUM.ThreeChild(
      'polarization-rotator-right-base',
      baseGeometry,
      rotatorMaterial
    );
    leftBase.rotate(-Math.PI/2, 0, 1, 0);
    leftBase.translate(-this.length/2, 0, 0);
    meshes.push(leftBase);
    rightBase.rotate(Math.PI/2, 0, 1, 0);
    rightBase.translate(this.length/2, 0, 0);
    meshes.push(rightBase);

    //-- Methods --//

    // General translation
    // inputs are components of vector representing the translation
    this.translate = function(x, y, z) {
      for(i in meshes) meshes[i].translate(x, y, z);
    }

    // Animate translation
    // inputs are:
    // - time animation will take (seconds)
    // - translation vector (Array)
    // - callback function that executes when animation ends (optional)
    this.move = function(time, deltaS, callback) {
      for(var i = 0; i < meshes.length-1; i++) meshes[i].move(time, deltaS);
      meshes[meshes.length-1].move(time, deltaS, callback);
    }

    // Add label
    this.addLabel = function(dx, dy) {
      body.addLabel(deg + '&deg', dx, dy);
    }

    // Remove label
    this.removeLabel = function() {
      body.removeLabel();
    }

    // Remove rotator
    this.remove = function() {
      leftBase.remove();
      rightBase.remove();
      body.remove();
    }
  },

  //== EXTRA WINDOWS FOR 3D EXPERIMENTS ==//

  // Polarization indicator window shows the polarization of the photon
  // constructor function defined below
  // inputs are: x, y coordinate of the window
  PolarizationIndicator: function(x, y) {
    QUANTUM.Child.call(this, 'polarization-indicator', x, y, 200, 200);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.addShadow();

    // Label
    var label = new QUANTUM.TextBox('indicator-label', 0, 5, 20, [100, 100, 100]);
    label.center(200);
    label.setContent('Photon Polarization');
    this.addChild(label);

    // Graphics are rendered in this Child object
    var contentBox = new QUANTUM.Child('msg-content-box', 20, 30, 160, 160);
    contentBox.fillWithGradient('90deg', [240, 240, 210], [255, 255, 230]);
    contentBox.addStroke(150, 140, 100);
    contentBox.addRaphaelPaper();
    this.addChild(contentBox);

    // Blink feature on this object illuminates content box
    this.blink = function(hold) {
      contentBox.blink(hold);
    }
    this.blinkOff = function() {
      contentBox.blinkOff();
    }

    // Background graphics

    // Axes that show horizontal and vertical axes
    var vertical = new QUANTUM.RaphaelChild('indicator-vertical-axis', contentBox, {
      type: 'path',
      width: 2,
      color: '#ccb',
      x0: 80, y0: 15
    });
    vertical.addPoint(80, 145);
    var horizontal = new QUANTUM.RaphaelChild('indicator-horizontal-axis', contentBox, {
      type: 'path',
      width: 2,
      color: '#ccb',
      x0: 15, y0: 80
    });
    horizontal.addPoint(145, 80);

    // Circle
    var circle = new QUANTUM.RaphaelChild('indicator-circle', contentBox, {
      type: 'ellipse',
      rx: 50, ry: 50,
      cx: 80, cy: 80,
      stroke: '#ccb',
      color: 'none'
    });
    circle.graphic.attr('stroke-width', 2);

    // Diagonal tick marks on circle
    var NWSE = new QUANTUM.RaphaelChild('indactor-nwse', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#ccb',
      x0: 35, y0: 35
    });
    NWSE.addPoint(55, 55);
    var NESW = new QUANTUM.RaphaelChild('indactor-nwse', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#ccb',
      x0: 125, y0: 35
    });
    NESW.addPoint(105, 55);
    var SENW = new QUANTUM.RaphaelChild('indactor-nwse', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#ccb',
      x0: 125, y0: 125
    });
    SENW.addPoint(105, 105);
    var SWNE = new QUANTUM.RaphaelChild('indactor-nwse', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#ccb',
      x0: 35, y0: 125
    });
    SWNE.addPoint(55, 105);

    // Text indicates polarization
    var degrees = new QUANTUM.TextBox('indicator-degrees', 110, 135, 20, [150, 140, 100]);
    contentBox.addChild(degrees);

    // Graphic shows polarization
    var polarization = new QUANTUM.RaphaelChild('indicator-graphic', contentBox, {
      type: 'path',
      width: 10,
      color: '#f00',
      x0: 80, y0: 30
    });
    polarization.addPoint(80, 130);

    // Horizontal and vertical bars show the amplitude components of the
    // polarization states

    //-- Methods --//

    // This angle represents the polarization angle
    var theta = 0
    // This represents the probability amplitude of the photon polarization state
    ,   amplitude = 1;

    // Change window to match photon polarization
    // input is polarization angle (deg)
    this.polarize = function(angle) {
      polarization.graphic.toFront();
      if(angle === 'random') {
        polarization.hide();
        polarization.rotate(-theta);
        theta = null;
        degrees.setContent('');
      }
      else {
        polarization.show(400);
        polarization.rotate(-theta);

        theta = angle;
        polarization.rotate(theta);
        polarization.graphic.scale(1, amplitude);

        degrees.setContent(Math.round(100 * theta) / 100 + '&deg');
      }
    }

    // Set amplitude of polarization
    this.setAmplitude = function(amp) {
      polarization.graphic.scale(1, 1/amplitude);
			amplitude = amp;
			polarization.graphic.scale(1, amp);
    }

    // Hide vertical component
		// and project photon polarization state to horizontal
		this.hideVerticalComponent = function(count) {
			this.hideComponents();

			var amp = Math.cos(Math.PI/24) * Math.pow(Math.cos(Math.PI/12), count+1);
			this.setAmplitude(amp);

			this.polarize(90);
			polarization.show();
		}

    // Show red polarization bar
		this.showPolarization = function() {
      degrees.setContent(Math.round(100 * theta) / 100 + '&deg');
			polarization.show(400);
		}

		// Hide red polarization bar
		this.hidePolarization = function() {
      degrees.setContent('');
			polarization.hide(true);
		}

		// Show component polarization bars
		this.showComponents = function() {
      // Horizontal component
      var hBar = new QUANTUM.RaphaelChild('indicator-h-bar', contentBox, {
        type: 'path',
        width: 10,
        color: '#aa9',
        x0: 30, y0: 80
      });
      hBar.addPoint(130, 80);
      hBar.hide();

      // Vertical component
      var vBar = new QUANTUM.RaphaelChild('indicator-v-bar', contentBox, {
        type: 'path',
        width: 10,
        color: '#aa9',
        x0: 80, y0: 30
      });
      vBar.addPoint(80, 130);
      vBar.hide();

      vBar.graphic.scale(1, amplitude * Math.cos(Math.PI * theta / 180));
      hBar.graphic.scale(amplitude * Math.sin(Math.PI * theta / 180), 1);

      vBar.show(400);
      hBar.show(400);

      this.vBar = vBar;
      this.hBar = hBar;
		}

		// Hide component polarization bars
		this.hideComponents = function() {
			this.vBar.hide(true);
			this.hBar.hide(true);
      setTimeout(function() {
        this.vBar.remove();
        this.vBar = undefined;
        this.hBar.remove();
        this.hBar = undefined;
      }, 500);
		}
  },

  // PhotonCounter class constructor
  // This class renders a window which acts as a photon counter in exercises
  // inputs for constructor are:
  // - cintent of the label at the top of the window
  // - x, y coordinates of the top left corner
  PhotonCounter: function(labelContent, x, y) {
    QUANTUM.Child.call(this, 'photon-counter: '+labelContent, x, y, 180, 100);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.addShadow();

    // Label text box
    var label = new QUANTUM.TextBox('photon-counter-label: '+labelContent, 0, 5, 18, [90, 90, 90]);
    label.center(180);
    label.setContent(labelContent);
    this.addChild(label);

    // Photon counter screen
    var screen = new QUANTUM.Child('photon-counter-screen: '+labelContent, 30, 32, 120, 60);
    screen.fillWithGradient('150deg', [15, 15, 15], [65, 65, 65], [15, 15, 15]);
    screen.addStroke(100, 100, 100);
    this.addChild(screen);

    // Number graphic
    var count = 0
    ,   number = new QUANTUM.TextBox('photon-counter-number: '+labelContent, 0, 8, 40, [255, 255, 255]);
    number.center(120);
    number.setContent(count);
    screen.addChild(number);

    //-- Methods --//

    // Blink feature
    this.blink = function(hold) {
      screen.blink(hold);
    }
    this.blinkOff = function() {
      screen.blinkOff();
    }

    // Increase counter
    this.increase = function() {
      count++;
      number.setContent(count);
      this.blink();
    }
  },

  // ProjectionHelper class constructor
  // this class renders a window which provides visual aid for users for
  // adding polarization states at the amplitude level
  ProjectionHelper: function() {
    // This is an instance of the Child class
    QUANTUM.Child.call(this, 'proj-helper', 710, 200, 260, 290);
    this.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    this.addStroke(100, 100, 100);
    this.addShadow();

    // Label on top
    var label = new QUANTUM.TextBox('proj-helper-label', 0, 5, 25, [100, 100, 100]);
    label.center(260);
    label.setContent('Photon Polarization');
    this.addChild(label);

    // Content is rendered in this box
    var contentBox = new QUANTUM.Child('proj-helper-content-box', 10, 40, 240, 240);
    contentBox.addRaphaelPaper();
    contentBox.fillWithGradient('90deg', [240, 240, 210], [255, 255, 230]);
    contentBox.addStroke(150, 140, 100);
    this.addChild(contentBox);

    // Blink feature lights up contentBox
    this.blink = function(hold) {
      contentBox.blink(hold);
    }
    this.blinkOff = function() {
      contentBox.blinkOff();
    }
    this.resetBlink = function() {
      contentBox.resetBlink();
    }

    // Angle display text
		var angleText = new QUANTUM.TextBox('proj-helper-angle-text', 10, 215, 16, [140, 130, 90]);
    angleText.$.css('width', '100px');
    angleText.hide();
		contentBox.addChild(angleText);

		// Amplitude display text
		var ampText = new QUANTUM.TextBox('proj-helper-amp-text', 120, 215, 16, [140, 130, 90]);
    ampText.$.css('width', '140px');
    ampText.hide();
		contentBox.addChild(ampText);

    // Bakcground graphics

    var circle = new QUANTUM.RaphaelChild('proj-helper-circle', contentBox, {
      type: 'ellipse',
      width: '1.5',
      color: 'none',
      stroke: '#bba',
      cx: 120, cy: 110,
      rx: 90, ry: 90
    });

    // Vertical axis
    var vAxis = new QUANTUM.RaphaelChild('proj-helper-v-axis', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#bba',
      x0: 120, y0: 10
    });
    vAxis.addPoint(120, 210);

    // Horizontal axis
    var hAxis = new QUANTUM.RaphaelChild('proj-helper-h-axis', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#bba',
      x0: 20, y0: 110
    });
    hAxis.addPoint(220, 110);

    // Diagonal ticks
    var NWSE = new QUANTUM.RaphaelChild('proj-helper-nwse', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#bba',
      x0: 45, y0: 35
    });
    NWSE.addPoint(65, 55);
    var NESW = new QUANTUM.RaphaelChild('proj-helper-nesw', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#bba',
      x0: 195, y0: 35
    });
    NESW.addPoint(175, 55);
    var SENW = new QUANTUM.RaphaelChild('proj-helper-senw', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#bba',
      x0: 195, y0: 185
    });
    SENW.addPoint(175, 165);
    var SWNE = new QUANTUM.RaphaelChild('proj-helper-senw', contentBox, {
      type: 'path',
      width: 1.5,
      color: '#bba',
      x0: 45, y0: 185
    });
    SWNE.addPoint(65, 165);

    //-- Visual aids for photon polarization --//

    // Horizontal and vertical bars show the amplitudes for the different
    // paths the photon can take when it exits the beam splitter

    // Horizontal bar
    var hBar = new QUANTUM.RaphaelChild('proj-helper-h-bar', contentBox, {
      type: 'path',
      width: 8,
      color: '#aa9',
      x0: 30, y0: 110
    });
    hBar.addPoint(210, 110);
    hBar.hide();

    // Vertical bar
    var vBar = new QUANTUM.RaphaelChild('proj-helper-v-bar', contentBox, {
      type: 'path',
      width: 8,
      color: '#aa9',
      x0: 120, y0: 20
    });
    vBar.addPoint(120, 200);
    vBar.hide();

    // Rotating bar that indicates the photon polarization state
    var polarBar = new QUANTUM.RaphaelChild('proj-helper-polar-bar', contentBox, {
      type: 'path',
      width: 8,
      color: '#f00',
      x0: 120, y0: 20
    });
    polarBar.addPoint(120, 200);

    //-- Methods --//

    // Hide vertical, horizontal bar
		this.hideBar = function(direction) {
			if(direction == 'h') {
        hBar.hide(true);
        hBar.graphic.toBack();
      }
			if(direction == 'v') {
        vBar.hide(true);
        vBar.graphic.toBack();
      }
		}

    // Show vertical, horizontal bar
		this.showBar = function(direction) {
			if(direction == 'h') {
        hBar.graphic.toFront();
        hBar.show(400);
      }
			if(direction == 'v') {
        vBar.show(400);
        vBar.graphic.toFront();
      }
		}

    // Show polarization state
		this.showPolarization = function() {
			polarBar.show(600);
      polarBar.graphic.toFront();

			// Set angle text
			angleText.setContent('Angle: '+ Math.round(18000 * theta / Math.PI)/100 +'&deg');

			// Set amplitude text
			ampText.setContent('Amplitude: 1');

			angleText.show();
			ampText.show();
		}

		// Hide polarization bar
		this.hidePolarization = function() {
      polarBar.graphic.toBack();
			polarBar.hide(true);
      ampText.hide(true);
			angleText.hide(true);
		}

    // This reference saves the angle of the polarization
    var theta = null;

    // Rotate polarization graphic
    this.polarize = function(angle) {
      // Resetting the lengths of the amplitude components
      if(theta !== null && theta !== 0)
        hBar.graphic.scale(1/Math.sin(theta), 1);
      if(theta !== null)
        vBar.graphic.scale(1, 1/Math.cos(theta));

      // Scaling the amplitude components
      theta = angle
      hBar.graphic.scale(Math.sin(theta), 1);
      vBar.graphic.scale(1, Math.cos(theta));

      // Rotating the red bar showing the photon polarization
      angle *= 180 / Math.PI;
      polarBar.rotate(angle);
    }

    // Change polarization state to one of the component amplitudes
    // this represents the photon taking one of the possible paths
    this.changePolarization = function(direction) {
      if(direction == 'h') {
				hBar.graphic.toFront();
				hBar.graphic.animate({stroke: '#f00'}, 600);

				setTimeout(function() {
					ampText.setContent('Amplitude: '+ (Math.round(100 * Math.sin(theta)) / 100));
					angleText.setContent('Angle: 90<sup>o</sup>');
				}, 800);
			}
      else if(direction == 'v') {
				vBar.graphic.toFront();
				vBar.graphic.animate({stroke: '#f00'}, 600);

				setTimeout(function() {
					ampText.setContent('Amplitude: '+ (Math.round(100 * Math.cos(theta)) / 100));
					angleText.setContent('Angle: 0<sup>o</sup>');
				}, 800);
			}

      polarBar.hide(true);

      ampText.hide(true);
			angleText.hide(true);

			setTimeout(function() {
				ampText.show(400);
				angleText.show(400);
			}, 900);
    }

    // Reset polarization graphic
		this.resetPolarizationBars = function() {
			hBar.graphic.attr('stroke', '#aa9');
			vBar.graphic.attr('stroke', '#aa9');

			ampText.hide(true);
			angleText.hide(true);
		}

    //-- Animation --//

    // This object traces lines from the polarization graphic to where
    // the component bars are drawn, or vice versa

    // Array stores the RaphaelChild objects that render the lines
    var lines = [null, null, null, null]
    // Start points of the lines
    ,   start1
    ,   start2
    // Used in animation
    ,   line_progress = 0
    ,   line_direction
    ,   reverse_lines;

    // This syntax allows me to define a property with overloaded set and get
    Object.defineProperty(this, 'line_progress', {
      set: function(value) {
        line_progress = value;

        // Animating the lines
        if(line_direction === 'h') {
          length = (start1.x - 120) * line_progress;

          lines[0].addPoint(
            reverse_lines? 120 + length : start1.x - length,
            start1.y
          );
          lines[2].addPoint(
            reverse_lines? 120 - length : start2.x + length,
            start2.y
          );
        }
        else if(line_direction === 'v') {
          length = (110 - start1.y) * line_progress;

          lines[1].addPoint(
            start1.x,
            reverse_lines? 110 - length :  start1.y + length
          );
          lines[3].addPoint(
            start2.x,
            reverse_lines? 110 + length : start2.y - length
          );
        }
      },
      get: function() {
        return line_progress;
      }
    });

    // Draw the lines
    // inputs are:
    // - direction: vertical (v) or horizontal (h)
    // - boolean reverse is false if the lines are drawn from the polarization
    //   graphic and true if the other way around
    // - callback function that executes when the animation ends
    this.drawLines = function(direction, reverse, callback) {
      // Saving the direction the program needs to draw the lines
      line_direction = direction;
      // Saving the reverse boolean
      reverse_lines = reverse;

      // Start point of the lines
			start1 = {
				x: 120 + 90 * Math.sin(theta),
				y: 110 - 90 * Math.cos(theta)
			};
			start2 = {
				x: 120 - 90 * Math.sin(theta),
				y: 110 + 90 * Math.cos(theta)
			};

      if(direction === 'h') {
        // Top horizontal line
				if(lines[0]) lines[0].remove();
				lines[0] = new QUANTUM.RaphaelChild('proj-helper-h-line-1', contentBox, {
          type: 'path',
					x0: reverse? 120 : start1.x,
					y0: start1.y,
					color: '#aa9',
					width: 3
				});
        lines[0].graphic.toFront();

				// Bottom horizontal line
				if(lines[2]) lines[2].remove();
				lines[2] = new QUANTUM.RaphaelChild('proj-helper-h-line-2', contentBox, {
          type: 'path',
					x0: reverse? 120 : start2.x,
					y0: start2.y,
					color: '#aa9',
					width: 3
				});
        lines[2].graphic.toFront();
      }
      else if(direction === 'v') {
        // Right vertical line
				if(lines[1]) lines[1].remove();
				lines[1] = new QUANTUM.RaphaelChild('proj-helper-v-line-1', contentBox, {
          type: 'path',
					x0: start1.x,
					y0: reverse? 110 : start1.y,
					color: '#aa9',
					width: 3
				});
        lines[1].graphic.toFront();

				// Left vertical line
				if(lines[3]) lines[3].remove();
				lines[3] = new QUANTUM.RaphaelChild('proj-helper-v-line-2', contentBox, {
          type: 'path',
					x0: start2.x,
					y0: reverse? 110 : start2.y,
					color: '#aa9',
					width: 3
				});
        lines[3].graphic.toFront();
      }

      // Call animation
      QUANTUM.animator.to(this, {line_progress: 1}, 1.5, function() {
        line_progress = 0;
        if(callback !== undefined) callback();
      })
    }

    //-- End of animation --//

    // Hide vertical/horizontal lines from polarization state to
		// the axes
		this.hideLines = function(direction) {
			if(direction == 'h' && lines[0] !== null && lines[2] !== null) {
				lines[0].hide(true);
        lines[2].hide(true);
			}
			if(direction == 'v' && lines[1] !== null && lines[3] !== null) {
				lines[1].hide(true);
				lines[3].hide(true);
			}
		}

    // Reset window
		this.reset = function() {
			this.hideBar('h');
		  this.hideBar('v');
		  this.hideLines('h');
		  this.hideLines('v');
			hBar.graphic.attr('stroke', '#aa9');
			vBar.graphic.attr('stroke', '#aa9');
		  this.hidePolarization();
		}
  }, // End of ProjectionHelper class

  //== HELP LAYER ==//

  // This is set to a function in each exercise which tells the HelpLayer
  // object what to render
  helpLayerSetup: null,

  // This class gets instantiated whenever the help button is pressed
  // HelpLayer class constructor
  HelpLayer: function() {
    // Reference to the instance of the application
    var app = QUANTUM.instance;

    // This is an instance of a Child class
    QUANTUM.Child.call(this, 'help-layer', 0, 0, app.w, app.h);
    this.div.style.background = 'rgba(0, 0, 0, 0.6)';
    this.div.style.zIndex = 2;
    this.addRaphaelPaper();
    app.add(this, true);

    //-- Methods --//

    var self = this
    ,   btHelpClone
    ,   arrows = []
    ,   messages = [];

    // Render a a clone of the Help button that exits the help layer
    this.renderHelpClone = function(x, y, w, h) {
      btHelpClone = new QUANTUM.Button('bt-help-clone', x, y, w, h);
      btHelpClone.setColor(100, 220, 255);
      btHelpClone.addTextContent(h-15, '?');
      this.addChild(btHelpClone);

      // Add an event listener to the help button clone to remove the help layer
      setTimeout(function() {
        btHelpClone.onPress(function() {
          // Hiding help layer
          self.hide(true);

          // Removing help layer from application
          setTimeout(function() {
            arrows = [];
            for(i in messages) QUANTUM.removeChild(messages[i]);
            messages = [];
            QUANTUM.removeChild(btHelpClone);
            QUANTUM.removeChild(self);
          }, 600);

          // Adding the event listener back onto the original help button
          QUANTUM.children['bt-help'].onPress(QUANTUM.renderHelpLayer);
        });
      }, 1000);
    }

    // Add an arrow to the help layer
    // inputs are:
    // - x, y coordinates of the tail of the arrow
    // - the angle (deg) the arrow makes with the y-axis (0 means arrow points up)
    this.addArrow = function(x, y, theta) {
      var i = arrows.length;

      // Renders an arrow
      var arrow = new QUANTUM.Arrow('help-arrow-'+i, this, {
        width: 15,
        headWidth: 30,
        length: 80,
        headLength: 20,
        stroke: '#000',
        color: '#fff',
        x: x, y: y
      });
      arrow.rotate(theta);
      arrows.push(arrow);
    }

    // This method adds a text box to the help layer
    // inputs are:
    // - x, y coordinates of the top left corner of the text box
    // - width (w) of the text box
    // - content of the text box
    this.addText = function(x, y, w, content) {
      var i = messages.length;

      // Renders the text box
      var text = new QUANTUM.TextBox('help-msg-'+i, x, y, 18, [255, 255, 255]);
      text.addBoxShadow();
      text.center(w);
      text.setContent(content);
      text.addTextStroke();
      messages.push(text);

      this.addChild(text);
    }

    //-- End of object methods --//

    // Calls the setup function defined in each exercise and uses the methods
    // defined above
    QUANTUM.helpLayerSetup();
  }, // End of HelpLayer class constructor

  //== TUTORIAL SETUP ==//

  /*

  The tutorials work by creating a Tutorial class in each exericse. Tutorials
  eexecute a number of steps defined in the exercise. Each step is created in
  each exercise by calling the method .addStep() on the Tutorial object. The
  arguments of .addStep() are plain JS objects which are used as arguments in
  constructors for the Part class. The Part class defines a series of functions
  which the program executes to render each step of the exercise.

  */

  // Part class constructor
  // inputs are:
  // - parent object of the part (a Step class defined below)
  // - data object which instructs the program what to do in this part of the tutorial
  Part: function(step, data) {
    // This vector stores each function this Part object will execute
    var functions = [];

    // Data object sets the message
    functions.push(function() {
      QUANTUM.children['msg-box'].setMessage(data.hasOwnProperty('msg')? data.msg : '');
    });

    // Data object tells whether the next button triggers the next part
    if(data.hasOwnProperty('trigger')) {
      // Setting the reference trigger to the appropriate Button object
      var trigger;
      switch(data.trigger) {
        case 'next':
          trigger = QUANTUM.children['bt-next'];
          break;
        case 'play':
          trigger = QUANTUM.children['bt-play'];
          break;
        case 'source':
          trigger = QUANTUM.photonSources[0];
          break;
      }

      // Adding an event listener
      functions.push(function() {
        with(trigger) {
          if(data.trigger !== 'source') enable();
          blink(true);
          onPress(function() {
            trigger.offPress();
            trigger.blinkOff();
            if(data.trigger !== 'source') trigger.disable();

            // Clearing the message box
            QUANTUM.children['msg-box'].setMessage('');

            // Executes the next part in the step
            setTimeout(function() {
              step.executeNextPart();
            }, 500);

            // Disabling the back button
            QUANTUM.children['bt-back'].offPress();
            if(QUANTUM.children['bt-back'].blinkHold)
              QUANTUM.children['bt-back'].blinkOff();
            QUANTUM.children['bt-back'].disable();

            // Ending the the continuous animation (if there is one)
            if(data.hasOwnProperty('endAnimation')) {
              QUANTUM.animator.killAnimations();
              data.endAnimation();
            }

            // Turning off the blink feature of objects except navigation buttons
            for(key in QUANTUM.children)
              switch(key) {
                case 'bt-next': break;
                case 'bt-back': break;
                case 'bt-play': break;
                default:
                  if(QUANTUM.children[key].blinkHold) QUANTUM.children[key].blinkOff();
                  break;
              }

            // Turning off blik feature of photon sources, detectors, and lightpaths
            for(i in QUANTUM.photonSources)
              QUANTUM.photonSources[i].blinkOff();
            for(i in QUANTUM.photonDetectors)
              QUANTUM.photonDetectors[i].blinkOff();
            if(QUANTUM.lightPaths.length && QUANTUM.lightPaths[0].blinkOff !== undefined)
              for(i in QUANTUM.lightPaths)
                QUANTUM.lightPaths[i].blinkOff();

            // Turning off the text blink for the amplitude boxes in 2D experiments
            for(i in QUANTUM.amplitudeBoxes) {
              QUANTUM.amplitudeBoxes[i].textBlinkOff();
              QUANTUM.amplitudeBoxes[i].removeArc();
            }
            // Removing the addition and multiplication signs
            if(QUANTUM.children['multiplication-layer'])
              with(QUANTUM.children['multiplier']) {
                addition.hide(true);
                multiplication.hide(true);
                addEquals.$.fadeOut();
                multiplyEquals.$.fadeOut();
              }
          });
        }
      });
    }

    // Data object tells whether the user can go back to the previous step
    // from this part. This is usually reserved for the beginning of each
    // step in the tutorial, the message box and blink feature will indicate
    // when users can use the BACK button
    if(data.hasOwnProperty('back'))
      functions.push(function() {
        // Adding event listener to the back button
        with(QUANTUM.children['bt-back']) {
          enable();
          blink(true);
          onPress(function() {
            QUANTUM.children['bt-back'].offPress();
            QUANTUM.children['bt-back'].blinkOff();
            QUANTUM.children['bt-back'].disable();
            QUANTUM.children['bt-next'].offPress();
            if(QUANTUM.children['bt-next'].blinkHold)
              QUANTUM.children['bt-next'].blinkOff();
            QUANTUM.children['bt-next'].disable();
            if(QUANTUM.children['bt-play']) {
              QUANTUM.children['bt-play'].offPress();
              if(QUANTUM.children['bt-play'].blinkHold)
              QUANTUM.children['bt-play'].blinkOff();
              QUANTUM.children['bt-play'].disable();
            }

            // Clearing the message box
            QUANTUM.children['msg-box'].setMessage('');

            // Undoes the last step (effectively)
            data.back();
            // Executes previous step again
            step.resetStep();
            setTimeout(function() {
              QUANTUM.tutorial.executePreviousStep();
            }, 500);
          });
        }
      });

    // The data object tells the program whether it needs to render an
    // animation during this part of the exercise
    if(data.hasOwnProperty('animation')) {
      // Define animate function
      function animate() {
        data.animation(function() {
          data.hasOwnProperty('continuous')?
          data.animation(animate) : setTimeout(function() {
            step.executeNextPart();
          }, 500);
        });
      }

      // Add it to the list of functions that need to be executed
      functions.push(function(){
        setTimeout(animate, 500);
      });
    }

    // The data object tells the program to turn on the blink feature
    if(data.hasOwnProperty('blink'))
      data.blink.map(function(current) {
        functions.push(function() {
          current.object.blink(current.hold);
        });
      });

    // Data object tells the program whether to make the labels small
    if(data.hasOwnProperty('smallLabels'))
      functions.push(function() {
        QUANTUM._REDUCE_LABEL_SIZE = data.smallLabels;
      });

    // The data object tells the program to add/remove a label from objects in
    // the experiment
    if(data.hasOwnProperty('labels')) {
      QUANTUM._UPDATE_LABELS = true;
      data.labels.map(function(current) {
        functions.push(function() {
          current.object.addLabel(current.dx, current.dy);
        })
      })
    }
    if(data.hasOwnProperty('removeLabels'))
      functions.push(function() {
        QUANTUM._UPDATE_LABELS = false;
        for(key in QUANTUM.threeChildren) {
          if(QUANTUM.threeChildren[key].label)
            QUANTUM.threeChildren[key].label.hide(true);
          setTimeout(function() {
            QUANTUM.threeChildren[key].removeLabel();
          }, 500)
        }
      });

    // Data object tells the program when the exercise has entered a free
    // exploration mode
    if(data.hasOwnProperty('free'))
      functions.push(function() {
        data.free(function() {
          step.executeNextPart();
        });
      });

    // Execute the functions that make up this part of the experiment step
    this.executeFunctions = function() {
      // If the part is skipped, only one function is executed. This function
      // will transition the app into the state it would be in without animations
      if(step.skipped) {
        if(data.hasOwnProperty('skip')) data.skip();
        setTimeout(function(){ step.executeNextPart(); }, 10);
      }
      else
        for(i in functions) functions[i]();
    }
  }, // End of Part class constructor

  // Step class constructor
  // inputs are:
  // - data objects for the Parts (defined above) of the step
  Step: function(args) {
    var parts = []
    ,   currentPart = 0;

    // Each Part class in this step is stored
    for(i in args) parts.push(new QUANTUM.Part(this, args[i]));

    //-- Methods --//

    // Reset current part of the step to zero
    this.resetStep = function() {
      currentPart = 0;
    }

    // Execute the specified part of this step
    this.executeNextPart = function() {
      if(currentPart < parts.length) {
        parts[currentPart].executeFunctions();
        currentPart++;
      }
      else {
        this.resetStep();
        QUANTUM.tutorial.executeNextStep();
      }
    }

    // This boolean determines if the step object executes entirely or if
    // the step is skipped
    this.skipped = false;
  }, // End of Step class constructor

  // Tutorial class constructor
  Tutorial: function() {
    QUANTUM.tutorial = this;

    // Steps of the exercise are stored in this vector
    var steps = []
    ,   currentStep = 0;

    // Add a step to the tutorial
    this.addStep = function() {
      arguments = Array.prototype.slice.call(arguments);
      steps.push(new QUANTUM.Step(arguments));
    }

    // Start tutorial
    // input is a number which indicates which step to start at (for development)
    this.start = function(startHere) {
      startHere = startHere !== undefined? startHere : 0;
      for(var i = 0; i < startHere; i++)
        steps[i].skipped = true;
      steps[0].executeNextPart();
    }

    // Execute next step
    this.executeNextStep = function() {
      currentStep++;
      if(currentStep < steps.length)
        steps[currentStep].executeNextPart();
    }

    // Execute previous step
    this.executePreviousStep = function() {
      currentStep--;
      steps[currentStep].executeNextPart();
    }
  }, // End of Tutorial class constructor

  //== APPLICATION SETUP ==//

  // Application object constructor
  // inputs are width (w) and height (h)
  Application: function(w, h) {
    // Useful to habe these be public
    this.w = w; this.h = h;

    // Creating a child object which contains the application
    var app = new QUANTUM.Child('app', 0, 0, w, h);
    app.fillWithGradient('90deg', [150, 150, 150], [200, 200, 200]);
    document.body.appendChild(app.div);

    // Add child to app, this is how all of the components of the exercises
    // are added to the application
    // animate is an optional boolean which causes the program to fade in the
    // graphic element when it adds it to the application
    this.add = function(child, animate) {
      app.addChild(child);
      if(animate) {
        child.$.hide();
        setTimeout(function() {
          child.$.fadeIn(500);
        }, 500);
      }
    }
  }, // End of Application class constructor

  // Initialize instance of application
  // inputs are width (w) and height (h) of the application
  init: function(w, h) {
    // Scaling application
    var ww = window.innerWidth
    ,   wh = window.innerHeight
    ,   s;
    if(ww < w || wh < h) {
      s = Math.min(ww/w, wh/h);
      QUANTUM._SCALE_FACTOR = s;
    }

    // Detect CSS prefix for the browser
    var prefixes = ['-webkit-', '-moz-', '-o-', '-ms-']
    ,   dom = document.createElement('div');
    for(i in prefixes) {
      dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';
      if(dom.style.background) {
        dom = null; delete dom;
        QUANTUM._BROWSER_PREFIX = prefixes[i];
        break;
      }
    }

    // Detect WebGL
    try {
      var canvas = document.createElement('canvas');
      QUANTUM._WEB_GL_SUPPORT = window.WebGLRenderingContext && (
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        || canvas.getContext('moz-webgl') || canvas.getContext('webkit-3d')
      );
    }
    catch(err) {
      console.log('Error: Browser or device does not support WebGL')
      QUANTUM._WEB_GL_SUPPORT = false;
    }
    if(QUANTUM._WEB_GL_SUPPORT) console.log('WebGL supported');

    // Detect mobile device for textures
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
      QUANTUM._TEXTURE_SUPPORT = false;
      console.log('mobile device detected, removing texturing')
    }

    // Instantiating classes

    // Instantiating Application class
    QUANTUM.instance = new QUANTUM.Application(w, h);

    // Instantiating Animator class
    QUANTUM.animator = new QUANTUM.Animator();
    // Initializing the render loop
    QUANTUM.animator.render();

    // Begin experiment
    QUANTUM._DEVELOPER_MODE? QUANTUM.experiment() : QUANTUM.renderIntro();
  },

  // This will be a string that describes the experiment

  // Render an introductory message for the user and prepare the experiment
  renderIntro: function() {
    // Reference to the instance of the application
    var app = QUANTUM.instance;

    // Black overlay covers the application
    var overlay = new QUANTUM.Child('intro-overlay', 0, 0, app.w, app.h);
    overlay.fill(100, 100, 100);
    app.add(overlay);

    // Intro message is displayed in large white text for users
    var introMessage = new QUANTUM.TextBox('intro-message', 100, 100, 40, [210, 210, 210]);
    introMessage.center(app.w-200);
    introMessage.setContent(QUANTUM._INTRO_MESSAGE);
    introMessage.addTextStroke();
    app.add(introMessage);

    // BEGIN button starts the experiment
    var btStart = new QUANTUM.Button('bt-begin', app.w/2-100, 400, 200, 70);
    btStart.setColor(100, 220, 180);
    btStart.addTextContent(36, 'START');
    app.add(btStart);

    // Pressing START launches the rest of the app
    btStart.onPress(function() {
      btStart.offPress();

      // Hiding the text and the button
      btStart.hide(true);
      introMessage.hide(true);
      // Hiding the overlay
      overlay.hide(true);

      // Render loading screen
      var loading = new QUANTUM.TextBox('loading', 0, 200, 40, [50, 50, 50]);
      loading.center(app.w);
      loading.setContent("Loading...");
      app.add(loading);

      // Removing the introductory elements
      setTimeout(function() {
        QUANTUM.removeChild(overlay);
        QUANTUM.removeChild(btStart);
        QUANTUM.removeChild(introMessage);
      }, 500);

      // Beginning the experiment
      setTimeout(QUANTUM.experiment, 400);
    });
  }
}
