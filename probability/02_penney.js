// #################################################################################################
// Penney's Game simulation
// Georgetown University
// Department of Physics - Washington, DC, USA
// Written by Lucas Vieira (https://github.com/1ucasvb)
//
// This software is licensed CC BY-SA
// https://creativecommons.org/licenses/by-sa/2.0/
// 
// #################################################################################################

var PenneyGame = {};
PenneyGame.init = function() {
	if (typeof(TweenMax) == "undefined") {
		setTimeout(function(){ PenneyGame.init(); }, 100);
		return;
	}
	
	this.totalMatches = 100;
	this.numRounds = 0;
	this.numMatches = 0;
	
	this.game = document.getElementById("game");
	this.gameContext = this.game.getContext("2d");
	
	// Coin atlas
	this.coinImage = new Image();
	this.coinSize = 100;
	this.playerCoinSize = 80;
	this.locked = false;
	this.showPCCoins = false;
	this.coinImage.addEventListener("load", function(){
		PenneyGame.generateSmallCoin();
		PenneyGame.setPlayerCoin(0,0,0);
		PenneyGame.setPlayerCoin(0,1,0);
		PenneyGame.setPlayerCoin(0,2,0);
		PenneyGame.updateResult();
	});
	this.coinImage.src = "coin_atlas.png";
	
	// Pre-reduction
	this.coinImageSmall = document.createElement("canvas");
	this.coinImageSmallContext = this.coinImageSmall.getContext("2d");
	this.coinImageSmall.width = this.coinSize;
	this.coinImageSmall.height = this.coinSize / 2;
	
	// Button
	this.btPlay = document.getElementById("play");
	this.btPlay.addEventListener("click", function() { PenneyGame.play(); });
	
	// Player coins
	this.playerCoin = [
		[
			document.getElementById("coin_player_1"),
			document.getElementById("coin_player_2"),
			document.getElementById("coin_player_3")
		],[
			document.getElementById("coin_pc_1"),
			document.getElementById("coin_pc_2"),
			document.getElementById("coin_pc_3")
		]
	];
	
	this.playerCoin[0][0].addEventListener("click", function(){ PenneyGame.switchState(0,0); });
	this.playerCoin[0][1].addEventListener("click", function(){ PenneyGame.switchState(0,1); });
	this.playerCoin[0][2].addEventListener("click", function(){ PenneyGame.switchState(0,2); });
	
	this.playerCoinContext = [
		[
			this.playerCoin[0][0].getContext("2d"),
			this.playerCoin[0][1].getContext("2d"),
			this.playerCoin[0][2].getContext("2d")
		],
		[
			this.playerCoin[1][0].getContext("2d"),
			this.playerCoin[1][1].getContext("2d"),
			this.playerCoin[1][2].getContext("2d")
		]
	];
	
	// Text measurement
	this.__span = document.createElement("span");
	this.__span.style.position = "absolute";
	this.__span.style.top = "-9999px";
	this.__span.style.left = "-9999px";
	this.__span.style.visibility = "hidden";
	document.body.append(this.__span);
	
	// Score signs
	this.scoreSign = [
		document.getElementById("score_player"),
		document.getElementById("score_pc")
	];
	this.matchesConter = document.getElementById("matches_count");
	this.winnerMessage = document.getElementById("winner");
	this.scoreStats = [
		document.getElementById("player_won"),
		document.getElementById("pc_won")
	];
	
	this.history = [];
	for(var i = 0; i < 10; i++) this.history.push(null);
	
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
	
	this.playerCoinFlipping = [[false,false,false],[false,false,false]];
	Object.defineProperty(this, 'coinStateA0', {
		get: function() { return this.getPlayerCoinState(0,0); }
	});
	Object.defineProperty(this, 'coinStateA1', {
		get: function() { return this.getPlayerCoinState(0,1); }
	});
	Object.defineProperty(this, 'coinStateA2', {
		get: function() { return this.getPlayerCoinState(0,2); }
	});
	Object.defineProperty(this, 'coinStateB0', {
		get: function() { return this.getPlayerCoinState(1,0); }
	});
	Object.defineProperty(this, 'coinStateB1', {
		get: function() { return this.getPlayerCoinState(1,1); }
	});
	Object.defineProperty(this, 'coinStateB2', {
		get: function() { return this.getPlayerCoinState(1,2); }
	});
	
	this.playerCoinScale = [[1,1,1],[1,1,1]];
	Object.defineProperty(this, 'coinScaleA0', {
		get: function() { return this.playerCoinScale[0][0]; },
		set: function(value) { this.playerCoinScale[0][0] = value; }
	});
	Object.defineProperty(this, 'coinScaleA1', {
		get: function() { return this.playerCoinScale[0][1]; },
		set: function(value) { this.playerCoinScale[0][1] = value; }
	});
	Object.defineProperty(this, 'coinScaleA2', {
		get: function() { return this.playerCoinScale[0][2]; },
		set: function(value) { this.playerCoinScale[0][2] = value; }
	});
	Object.defineProperty(this, 'coinScaleB0', {
		get: function() { return this.playerCoinScale[1][0]; },
		set: function(value) { this.playerCoinScale[1][0] = value; }
	});
	Object.defineProperty(this, 'coinScaleB1', {
		get: function() { return this.playerCoinScale[1][1]; },
		set: function(value) { this.playerCoinScale[1][1] = value; }
	});
	Object.defineProperty(this, 'coinScaleB2', {
		get: function() { return this.playerCoinScale[1][2]; },
		set: function(value) { this.playerCoinScale[1][2] = value; }
	});
	
	this.playerCoinRotation = [[0,0,0],[0,0,0]];
	Object.defineProperty(this, 'coinRotationA0', {
		get: function() { return this.playerCoinRotation[0][0]; },
		set: function(value) { this.playerCoinRotation[0][0] = value; this.setPlayerCoin(0,0,value); }
	});
	Object.defineProperty(this, 'coinRotationA1', {
		get: function() { return this.playerCoinRotation[0][1]; },
		set: function(value) { this.playerCoinRotation[0][1] = value; this.setPlayerCoin(0,1,value); }
	});
	Object.defineProperty(this, 'coinRotationA2', {
		get: function() { return this.playerCoinRotation[0][2]; },
		set: function(value) { this.playerCoinRotation[0][2] = value; this.setPlayerCoin(0,2,value); }
	});
	Object.defineProperty(this, 'coinRotationB0', {
		get: function() { return this.playerCoinRotation[1][0]; },
		set: function(value) { this.playerCoinRotation[1][0] = value; this.setPlayerCoin(1,0,value); }
	});
	Object.defineProperty(this, 'coinRotationB1', {
		get: function() { return this.playerCoinRotation[1][1]; },
		set: function(value) { this.playerCoinRotation[1][1] = value; this.setPlayerCoin(1,1,value); }
	});
	Object.defineProperty(this, 'coinRotationB2', {
		get: function() { return this.playerCoinRotation[1][2]; },
		set: function(value) { this.playerCoinRotation[1][2] = value; this.setPlayerCoin(1,2,value); }
	});
	
	// Glow coins
	this.__glowCoins = 0;
	Object.defineProperty(this, 'glowCoins', {
		get: function() { return this.__glowCoins; },
		set: function(value) {
			this.__glowCoins = value;
			this.playerCoin[0][0].style.boxShadow = "rgba(255,255,0,"+value+") 0 0 "+Math.floor(10*value)+"px "+Math.floor(5*value)+"px";
			this.playerCoin[0][1].style.boxShadow = "rgba(255,255,0,"+value+") 0 0 "+Math.floor(10*value)+"px "+Math.floor(5*value)+"px";
			this.playerCoin[0][2].style.boxShadow = "rgba(255,255,0,"+value+") 0 0 "+Math.floor(10*value)+"px "+Math.floor(5*value)+"px";
		}
	});
	
	this.enable();
}

PenneyGame.getPlayerCoinState = function(p, c) {
	return Math.floor(Math.abs(this.playerCoinRotation[p][c])) % 2;
}
PenneyGame.flipPlayerCoinDone = function(p,c) {
	this.playerCoinFlipping[p][c] = false;
	this.playerCoinRotation[p][c] = this.getPlayerCoinState(p,c);
	this.updateResult();
}
PenneyGame.switchState = function(p,c,state) {
	if (p == 0 && this.locked) return;
	if (this.playerCoinFlipping[p][c]) return;
	this.playerCoinFlipping[p][c] = true;
	var o = { ease: Circ.easeOut };
	var time = 0.5;
	// Switch
	if (typeof(state) == "undefined") {
		state = this.getPlayerCoinState(p,c) + 3;
	} else {
		this.playerCoinRotation[p][c] = this.getPlayerCoinState(p,c);
		state = this.getPlayerCoinState(p,c) + (this.getPlayerCoinState(p,c) == state? 4 : 3);
	}
	o["coinRotation"+String.fromCharCode(65+p)+c] = state;
	TweenMax.to(PenneyGame, time, o);
	o = {
			ease: Power0.easeNone,
			onComplete: function() {
				PenneyGame.flipPlayerCoinDone(p,c);
			}
	}
	this.playerCoinScale[p][c] = 0;
	o["coinScale"+String.fromCharCode(65+p)+c] = 1;
	TweenMax.to(PenneyGame, time, o);
}
PenneyGame.setPlayerCoin = function(p, c, value) {
	if (typeof(value) == "undefined") {
		value = this.getPlayerCoinState(p,c);
	}
	this.playerCoinRotation[p][c] = value;
	
	var ctx;
	
	ctx = this.playerCoinContext[p][c];
	
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect(0, 0, this.playerCoinSize, this.playerCoinSize);
	
	if (value === null) return;
	
	var n = Math.floor(value*32) % 64; // frame number
	var s = this.playerCoinScale[p][c];
	
	s = 2/3 + 1/3*4*(s - Math.pow(s, 2));
	ctx.drawImage(
		this.coinImage,
		(n % 8) * this.coinSize, Math.floor(n / 8) * this.coinSize,
		this.coinSize, this.coinSize,
		this.playerCoinSize*(1-s)/2, this.playerCoinSize*(1-s)/2,
		this.playerCoinSize*s, this.playerCoinSize*s
	);
}
PenneyGame.end = function() {
	TweenMax.to();
}
PenneyGame.enable = function() {
	this.btPlay.disabled = false;
	this.locked = false;
	this.updateResult();
	this.showPCCoins = false;
	this.setPlayerCoin(1,0,null);
	this.setPlayerCoin(1,1,null);
	this.setPlayerCoin(1,2,null);
	TweenMax.to(this, 0.5, { glowCoins: 1, ease: Back.easOut });
}
PenneyGame.disable = function() {
	this.btPlay.disabled = true;
	TweenMax.to(this, 0.5, { glowCoins: 0, ease: Back.easOut });
}
PenneyGame.clearHistory = function() {
	this.history = [];
	for(var i = 0; i < 10; i++) this.history.push(null);
}
PenneyGame.play = function() {
	this.disable();
	this.clearHistory();
	this.numRounds = 0;
	this.numMatches = 0;
	this.numWins = [0,0];
	this.updateScores();
	this.updateResult();
	this.locked = true;
	this.showPCCoins = false;
	
	// Computer strategy
	var play = [
		1-this.getPlayerCoinState(0,1),
		this.getPlayerCoinState(0,0),
		this.getPlayerCoinState(0,1)
	];
	
	var s = 500;
	setTimeout(function(){ PenneyGame.switchState(1, 0, play[0]); }, 1*s);
	setTimeout(function(){ PenneyGame.switchState(1, 1, play[1]); }, 2*s);
	setTimeout(function(){ PenneyGame.switchState(1, 2, play[2]); }, 3*s);
	setTimeout(function(){
		PenneyGame.showPCCoins = true;
		PenneyGame.updateResult();
	}, 3*s + 1000);
	setTimeout(function(){
		PenneyGame.flipCoin(1);
	}, 3*s + 1500);
}
PenneyGame.newMatch = function() {
	this.numRounds = 0;
	w = Math.pow( 10, (-this.numMatches * 0.1 ));
	setTimeout(
		function(){
			PenneyGame.clearHistory();
			PenneyGame.updateResult();
			PenneyGame.flipCoin(w);
			PenneyGame.winnerMessage.innerHTML = "";
		},
		50 + 2000 * w
	);
	
}
PenneyGame.flipCoinDone = function() {
	this.animating = false;
	this.history.pop();
	this.history.unshift( this.coinState );
	this.numRounds++;
	this.updateResult();
	
	var winner = null, w;
	
	if (PenneyGame.getScore(0) == 3) {
		this.numWins[0]++;
		winner = 0;
	} else if (PenneyGame.getScore(1) == 3) {
		this.numWins[1]++;
		winner = 1;
	}
	
	if (winner !== null) { // if there's a winner
		this.numMatches++;
		this.updateScores(winner);
		
		if (this.numMatches == this.totalMatches) { // if final match
			this.enable(); // re-enable game
			// HIIIGHLY unlikely, but just in case...
			this.winnerMessage.innerHTML = "FINAL WINNER:<br/> " + (
				this.numWins[0] > this.numWins[1] ? "YOU" : "COMPUTER");
			return;
		}
		
		// More matches
		this.newMatch();
		return;
	}
	
	// Keep tossing coins
	w = Math.pow( 10, (-(this.numRounds + this.numMatches) * 0.1 ));
	clearTimeout(this.timer);
	this.timer = setTimeout(function(){ 
		PenneyGame.flipCoin(w);
	}, 10 + 500 * w);
}
PenneyGame.flipCoin = function(time) {
	if (this.animating) return;
	var result = ( Math.random() <= 0.5 ? 0 : 1 );
	this.coinRotation = this.coinState;
	this.coinScale = 0;
	if (time > 0.01) {
		this.animating = true;
		TweenMax.to(PenneyGame, time, {
			coinRotation: Math.max(10,Math.ceil(10*time)) + result,
			ease: Circ.easeOut
		});
		TweenMax.to(PenneyGame, time, {
			coinScale: 1,
			ease: Power0.easeNone,
			onComplete: function() {
				PenneyGame.flipCoinDone();
			}
		});
	} else {
		this.coinRotation = result;
		this.flipCoinDone();
	}
	return result;
}
PenneyGame.updateScores = function(winner) {
	this.scoreSign[0].innerHTML = (this.numWins[0] < 10 ? "0" : "") + this.numWins[0];
	this.scoreSign[1].innerHTML = (this.numWins[1] < 10 ? "0" : "") + this.numWins[1];
	this.matchesConter.innerHTML = this.numMatches + " / " + this.totalMatches;
	if (this.numMatches) {
		this.scoreStats[0].innerHTML = Math.round(100 * (this.numWins[0] / this.numMatches));
		this.scoreStats[1].innerHTML = Math.round(100 * (1- this.numWins[0] / this.numMatches));
	} else {
		this.scoreStats[0].innerHTML = "0";
		this.scoreStats[1].innerHTML = "0";
	}
	if (typeof(winner) != "undefined") {
		this.winnerMessage.innerHTML = (winner == 0 ? "YOU WIN" : "COMPUTER WINS");
	} else {
		this.winnerMessage.innerHTML = "";
	}
}
PenneyGame.clearCoin = function() {
	var aw = this.game.width, ah = this.game.height;
	var cs = 36;
	x = 10 + (this.history.length+1)*cs;
	y = ah/2 - this.coinSize/2;
	this.gameContext.fillStyle = "rgba(255,255,255,1)";
	this.gameContext.fillRect(x, y, this.coinSize, this.coinSize);
}
PenneyGame.setCoin = function(value, state) {
	this.clearCoin();
	var ctx = this.gameContext;
	var aw = this.game.width, ah = this.game.height;
	var cs = 36;
	x = 10 + (this.history.length+1)*cs;
	y = ah/2 - this.coinSize/2;
	var n = Math.floor(value*32) % 64; // frame number
	var s = this.__coinScale;
	s = 2/3 + 1/3*4*(s - Math.pow(s,2));
	ctx.drawImage(
		this.coinImage,
		(n % 8) * this.coinSize, Math.floor(n / 8) * this.coinSize, this.coinSize, this.coinSize,
		x + this.coinSize*(1-s)/2, y + this.coinSize*(1-s)/2, this.coinSize*s, this.coinSize*s
	);
	if (state == null) {
		ctx.strokeStyle = "#CCCCCC";
	} else {
		ctx.strokeStyle = ( state ? "#5481FC" : "#E3673B" );
	}
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.rect(x+0.5,y+0.5,this.coinSize,this.coinSize);
	ctx.closePath();
	ctx.stroke();
}
// 1 level pre-reduction so tiny coins don't look weird 
PenneyGame.generateSmallCoin = function() {
	for(var i = 0; i < 2; i++) {
		this.coinImageSmallContext.drawImage(
			this.coinImage,
			0, i * this.coinSize * 4, this.coinSize, this.coinSize,
			i * (this.coinSize / 2), 0, (this.coinSize / 2), (this.coinSize / 2)
		);
	}
}
PenneyGame.getScore = function(p) {
	var score = 0;
	for(var j = 0; j < 3; j++) {
		score += (this.history[2-j] == this.getPlayerCoinState(p,j) ? 1 : 0);
	}
	return score;
}
PenneyGame.updateResult = function() {
	var ctx = this.gameContext;
	
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect(-1, -1, this.game.width+2, this.game.height+2);
	
	var aw = this.game.width, ah = this.game.height;
	
	var it = this.history.length;
	var state, x, y, s, cs = 36, ml = 10;
	state = 0;
	
	y = ah/2 - cs/2;
	
	// History
	for(var i = 0; i < it; i++) {
		x = ml + i*cs;
		ctx.strokeStyle = "rgba(0,0,0,0.2)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.rect(x+0.5,y+0.5,cs,cs);
		ctx.closePath();
		ctx.stroke();
		
		if (this.locked && this.history[it-i-1] !== null) {
			ctx.drawImage(
				this.coinImageSmall,
				this.history[it-i-1] * (this.coinSize / 2), 0, (this.coinSize / 2), (this.coinSize / 2),
				x , y, cs, cs
			);
		}
	}
	
	// Players selections
	x = ml + (it-3)*cs;
	for(var i = -1; i <= 1; i++) {
		for(var j = 0; j < 3; j++) {
			ctx.strokeStyle = "rgba(0,0,0,0.2)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.rect(x+0.5 + j*cs, y+0.5 + i*(cs + 10),cs,cs);
			ctx.closePath();
			ctx.stroke();
			
			if (i != 0) {
				if (i == -1 || (i == 1 && this.showPCCoins)) {
					s = this.getPlayerCoinState(i > 0 ? 1 : 0,j);
					
					if (this.locked && this.history[2-j] == s) {
						ctx.fillStyle = "rgba(0,250,0,0.5)";
						ctx.fillRect(x + j * cs , y + i*(cs + 10), cs, cs);
					}
					
					ctx.drawImage(
						this.coinImageSmall,
						s * (this.coinSize / 2), 0, (this.coinSize / 2), (this.coinSize / 2),
						x + j * cs , y + i*(cs + 10), cs, cs
					);
				}
			}
			
		}
		ctx.strokeStyle = "rgba(100,100,100,1)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(x +0.5, y+0.5 + i*(cs + 10), cs*3, cs);
		ctx.closePath();
		ctx.stroke();
	}
	
	this.drawText("Coins tossed: "+this.numRounds, ml, ah/2 - cs*1, "rgba(0,0,0,1)", "25px sans-serif", -1);
	
	this.drawText("YOU", x+0.5 + 1.5*cs, ah/2 - (8 + cs*2), "rgba(0,0,0,1)", "20px sans-serif" );
	this.drawText("COMPUTER", x+0.5 + 1.5*cs, ah/2 + (12 + cs*2), "rgba(0,0,0,1)", "20px sans-serif" );
	
	// Lines to big coin
	ctx.strokeStyle = "rgba(0,0,0,0.5)";
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(ml + it*cs, ah/2 - cs/2 + 1);
	ctx.lineTo(ml + (it+1)*cs + 1, ah/2 - this.coinSize/2);
	ctx.closePath();
	ctx.stroke();
	
	ctx.strokeStyle = "rgba(0,0,0,0.5)";
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(ml + it*cs, ah/2 + cs/2 - 1);
	ctx.lineTo(ml + (it+1)*cs + 1, ah/2 + this.coinSize/2);
	ctx.closePath();
	ctx.stroke();
	
	this.setCoin(this.coinState, this.coinState);
}

PenneyGame.drawText = function(text, x, y, color, fontStyle, align) {
	var ctx = this.gameContext;
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
PenneyGame.init();