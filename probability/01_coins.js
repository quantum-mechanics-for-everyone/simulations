// #################################################################################################
// Coin flipping simulation
// Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Lucas Vieira (https://github.com/1ucasvb)
//
// This software is licensed CC BY-SA
// https://creativecommons.org/licenses/by-sa/2.0/
// 
// #################################################################################################

var CoinFlipper = {};
CoinFlipper.init = function() {
	if (typeof(TweenMax) == "undefined") {
		setTimeout(function(){ CoinFlipper.init(); }, 100);
		return;
	}
	
	this.coin = document.getElementById("coin_image");
	this.coinContext = this.coin.getContext("2d");
	this.results = document.getElementById("results_image");
	this.resultsContext = this.results.getContext("2d");
	this.animating = false;
	
	// Coin objects
	this.btFlip = document.getElementById("coin_flip");
	this.coinResult = document.getElementById("coin_result");
	
	// Load coin atlas
	this.coinImage = new Image();
	this.coinSize = 100;
	this.coinImage.addEventListener("load", function(){ CoinFlipper.setCoin(0); });
	this.coinImage.src = "coin_atlas.png";
	
	// Pre-reduction
	this.coinImageSmall = document.createElement("canvas");
	this.coinImageSmallContext = this.coinImageSmall.getContext("2d");
	this.coinImageSmall.width = this.coinSize / 2;
	this.coinImageSmall.height = this.coinSize / 2;
	
	// Clear canvases
	this.clearCoin();
	this.clearResults();
	
	// Create properties
	this.__coinRotation = 0; // even = heads, odd = tails
	Object.defineProperty(this, 'coinRotation', {
		get: function() { return this.__coinRotation; },
		set: function(value) {
			this.__coinRotation = value;
			this.setCoin(Math.abs(value));
		}
	});
	Object.defineProperty(this, 'coinState', {
		get: function() {
			return Math.floor(Math.abs(this.__coinRotation)) % 2;
		}
	});
	this.__coinScale = 1;
	Object.defineProperty(this, 'coinScale', {
		get: function() { return this.__coinScale; },
		set: function(value) {
			this.__coinScale = value;
			this.coinRotation = this.coinRotation;
		}
	});
	
	// Sliders and inputs
	this.sliderProb = document.getElementById("prob_slider");
	this.valueProb = document.getElementById("prob_value");
	this.sliderCoins = document.getElementById("numcoins_slider");
	this.valueCoins = document.getElementById("numcoins_value");
	this.valueTotal = document.getElementById("result_total");
	this.valueTails = document.getElementById("result_tails");
	this.valueHeads = document.getElementById("result_heads");
	this.btFair = document.getElementById("bt_fair");
	
	this.sliderProb.addEventListener("change", function(){ CoinFlipper.updatevalueProb(); });
	this.sliderProb.addEventListener("input", function(){ CoinFlipper.updatevalueProb(); });
	this.valueProb.addEventListener("change", function(){ CoinFlipper.updatesliderProb(); });
	this.valueProb.addEventListener("input", function(){ CoinFlipper.updatesliderProb(); });
	
	this.sliderCoins.addEventListener("change", function(){ CoinFlipper.updatevalueCoins(); });
	this.sliderCoins.addEventListener("input", function(){ CoinFlipper.updatevalueCoins(); });
	this.valueCoins.addEventListener("change", function(){ CoinFlipper.updatesliderCoins(); });
	this.valueCoins.addEventListener("input", function(){ CoinFlipper.updatesliderCoins(); });
	
	// Properties
	Object.defineProperty(this, 'probability', {
		get: function() { return this.valueProb.value; }
	});
	Object.defineProperty(this, 'numCoins', {
		get: function() { return this.valueCoins.value; }
	});
	
	this.btFair.addEventListener("click", function(){ CoinFlipper.makeFair(); });
	this.btFlip.addEventListener("click", function(){ CoinFlipper.flipAllCoins(); });
}
CoinFlipper.makeFair = function() {
	this.valueProb.value = 0.5;
	this.sliderProb.value = 0.5;
}
CoinFlipper.updatevalueProb = function() { this.valueProb.value = this.sliderProb.value; }
CoinFlipper.updatesliderProb = function() { this.sliderProb.value = this.valueProb.value; }
CoinFlipper.updatevalueCoins = function() { this.valueCoins.value = this.sliderCoins.value; }
CoinFlipper.updatesliderCoins = function() { this.sliderCoins.value = this.valueCoins.value; }
CoinFlipper.clearCoin = function() {
	var w = this.coin.width;
	var h = this.coin.height;
	this.coinContext.fillStyle = "rgba(255,255,255,1)";
	this.coinContext.fillRect(-1, -1, w+2, h+2);
}
CoinFlipper.setCoin = function(value) {
	CoinFlipper.clearCoin();
	var n = Math.floor(value*32) % 64; // frame number
	var s = this.__coinScale, w = this.coin.width, h = this.coin.height;
	s = 2/3 + 1/3*4*(s - Math.pow(s, 2));
	this.coinContext.drawImage(
		this.coinImage,
		(n % 8) * this.coinSize, Math.floor(n / 8) * this.coinSize, this.coinSize, this.coinSize,
		w*(1-s)/2, h*(1-s)/2, w*s, h*s
	);
}
CoinFlipper.addCoinResult = function(state) {
	state = ( state ? 32 : 0 );
	var w = this.coin.width, h = this.coin.height;
	var aw = this.results.width, ah = this.results.height;
	var t = this.totalCoins;
	var n = this.numCoins;
	
	var s, px, py, nx, ny, ix, iy, img;
	
	// Find size of coin that will fit
	if (0 < n && n <= 5) { nx = n; ny = 1; s = 1; }
	if (5 < n && n <= 10) { nx = 5; ny = 2; s = 1; }
	if (10 < n && n <= 15) { nx = 5; ny = 3; s = ah/(3*h); }
	if (15 < n && n <= 20) { nx = 10; ny = 2; s = aw/(10*h); }
	if (20 < n && n <= 30) { nx = 10; ny = 3; s = aw/(10*h); }
	if (30 < n && n <= 40) { nx = 10; ny = 4; s = ah/(4*h); }
	if (40 < n && n <= 50) { nx = 10; ny = 5; s = ah/(5*h); }
	if (50 < n && n <= 60) { nx = 15; ny = 4; s = aw/(15*h); }
	if (60 < n && n <= 75) { nx = 15; ny = 5; s = aw/(15*h); }
	if (75 < n && n <= 90) { nx = 15; ny = 6; s = ah/(6*h); }
	if (90 < n && n <= 100) { nx = 20; ny = 5; s = aw/(20*h); }
	
	ix = (t - 1) % nx;
	iy = Math.floor((t - 1) / nx);
	px = aw/2 - nx*w*s/2 + w*s/2 + w*s*ix;
	py = ah/2 - ny*h*s/2 + h*s/2 + h*s*iy;
	
	if (s <= 0.5) {
		this.coinImageSmallContext.clearRect(0, 0, this.coinImageSmall.width, this.coinImageSmall.height);
		this.coinImageSmallContext.drawImage(
			this.coinImage,
			(state % 8) * this.coinSize, Math.floor(state / 8) * this.coinSize, this.coinSize, this.coinSize,
			0, 0, this.coinImageSmall.width, this.coinImageSmall.height
		);
		this.resultsContext.drawImage(
			this.coinImageSmall,
			0, 0, this.coinSize/2, this.coinSize/2,
			px - w*s/2, py - h*s/2, w*s, h*s
		);
	} else {
		this.resultsContext.drawImage(
			this.coinImage,
			(state % 8) * this.coinSize, Math.floor(state / 8) * this.coinSize, this.coinSize, this.coinSize,
			px - w*s/2, py - h*s/2, w*s, h*s
		);
	}
}
CoinFlipper.updateResult = function() {
	this.coinResult.innerHTML = ( this.coinState ? "TAILS" : "HEADS" );
	this.coinResult.style.color = ( this.coinState ? "#5481FC" : "#E3673B" );
	this.totalCoins++;
	if (this.coinState) {
		this.totalTails++;
	} else {
		this.totalHeads++;
	}
	if (this.totalCoins < this.numCoins) {
		clearTimeout(this.timer);
		var w = Math.pow(10, (-this.totalCoins * 0.1));
		this.timer = setTimeout(
			function(){
				CoinFlipper.flipAgain();
			},
			parseInt(50 + 500 * w)
		);
	} else {
		this.enable();
	}
	
	this.addCoinResult(this.coinState);
	
	this.valueTotal.innerHTML = this.totalCoins;
	this.valueHeads.innerHTML = this.totalHeads + " ("+Math.round(100 * (this.totalHeads / this.totalCoins))+"%)";
	this.valueTails.innerHTML = this.totalTails + " ("+Math.round(100 * (1 - this.totalHeads / this.totalCoins))+"%)";
}
CoinFlipper.flipAgain = function() {
	var w = Math.pow(10 , (-(this.totalCoins * 0.1)));
	this.flipCoin( w );
}
CoinFlipper.enable = function() {
	this.btFlip.disabled = false;
	this.sliderProb.disabled = false;
	this.valueProb.disabled = false;
	this.sliderCoins.disabled = false;
	this.valueCoins.disabled = false;
	this.btFair.disabled = false;
}
CoinFlipper.disable = function() {
	this.btFlip.disabled = true;
	this.sliderProb.disabled = true;
	this.valueProb.disabled = true;
	this.sliderCoins.disabled = true;
	this.valueCoins.disabled = true;
	this.btFair.disabled = true;
}
CoinFlipper.flipCoinDone = function() {
	this.animating = false;
	this.updateResult();
}
CoinFlipper.flipCoin = function(time) {
	if (this.animating) return;
	var result = ( Math.random() < this.probability ? 0 : 1 );
	this.coinRotation = this.coinState;
	this.coinScale = 0;
	this.coinResult.innerHTML = "";
	CoinFlipper.disable();
	if (time > 0.01) {
		this.animating = true;
		TweenMax.to(CoinFlipper, time, {
			coinRotation: Math.max(10,Math.ceil(10*time)) + result,
			ease: Circ.easeOut
		});
		TweenMax.to(CoinFlipper, time, {
			coinScale: 1,
			ease: Power0.easeNone,
			onComplete: function() {
				CoinFlipper.flipCoinDone();
			}
		});
	} else {
		this.coinRotation = result;
		this.flipCoinDone();
	}
	return result;
}
CoinFlipper.clearResults = function() {
	var w = this.results.width;
	var h = this.results.height;
	this.resultsContext.fillStyle = "rgba(255,255,255,1)";
	this.resultsContext.fillRect(-1, -1, w+2, h+2);
}
CoinFlipper.flipAllCoins = function() {
	this.valueTotal.innerHTML = "0";
	this.valueHeads.innerHTML = "0 (0%)";
	this.valueTails.innerHTML = "0 (0%)";
	this.totalCoins = 0;
	this.totalHeads = 0;
	this.totalTails = 0;
	this.clearResults();
	this.flipCoin(1);
}
CoinFlipper.init();