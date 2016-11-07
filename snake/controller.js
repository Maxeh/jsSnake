"use strict";
var view;
var model;
var gameIsOver;
var pause;
var interval;
var difficulty;
var gameCounter = 0;

window.onload = function(){	
	if (typeof(Storage) !== "undefined") {
		var fb = localStorage.getItem("fieldBorder");
		var fieldBorder = true; 
		if (fb == "1") fieldBorder = false; 
		
		var difficulty = localStorage.getItem("difficulty") || 1;
		
		var size = localStorage.getItem("size") || 1;
		switch(parseInt(size)){
			case 0: startGame(window.innerWidth, window.innerHeight, fieldBorder, difficulty); break;
			case 1: startGame(window.innerWidth * 0.9, window.innerHeight * 0.9, fieldBorder, difficulty); break;
			case 2: startGame(window.innerWidth * 0.8, window.innerHeight * 0.8, fieldBorder, difficulty); break;
			case 3: startGame(window.innerWidth * 0.7, window.innerHeight * 0.7, fieldBorder, difficulty); break;
		}	
	}
}

function startGame(fWidth, fHeight, fieldBorder, diff){
	var boxSize = 20;
	var fieldWidth = fWidth;
	var fieldHeight = fHeight;
	difficulty = diff;
	gameIsOver = false;
	pause = false;
	
	// 7 wird abgezogen, wegen der zusätzlichen Border (2px), um Scrollbalken zu verhindern
	var nbrX = Math.floor((fieldWidth-7) / boxSize);
	var nbrY = Math.floor((fieldHeight-7) / boxSize);
	
	var gameWidth = (nbrX * boxSize)-1;
	var gameHeight = (nbrY * boxSize)-1;

	var marginX = Math.floor((window.innerWidth  - gameWidth) / 2);
	var marginY = Math.floor((window.innerHeight - gameHeight) / 2);
	
	model = new Model(nbrX, nbrY, fieldBorder);
	
	view = new View(model, boxSize, gameWidth, gameHeight, marginX, marginY);
	view.updateView();

	// Hammer Listener nur beim ersten Mal setzen
	if (gameCounter == 0) { gameCounter++; setListener(); }
	gameLoop();
}

function gameLoop(){
	var time;
	switch(parseInt(difficulty)){
		case 0: time = 220; break;
		case 1: time = 180; break;
		case 2: time = 130; break;
		case 3: time = 80; break;
	}
	interval = setInterval(function(){
		if (!model.getSnakeBox().move())
			gameOver();
		if (!gameIsOver && !pause) view.updateView();
	}, time);	
}

function gameOver(){
	gameIsOver = true;
	clearInterval(interval);
	view.gameOver();
}

function setListener(){	
	window.onkeydown = function(event){
		if (gameIsOver) return;
		switch(event.keyCode){
			case 37: if (!pause) left(); break;
			case 38: if (!pause) up(); break;
			case 39: if (!pause) right(); break;
			case 40: if (!pause) down(); break;
			case 80: pauseGame(); break;
		}
	}
	window.ondblclick  = function() { pauseGame(); }
		
	// WICHTIG: HTML-Node übergeben, nicht window oder body, weil es sonst bei Android zu starken Laggs kommt
	var hammer = new Hammer.Manager(document.getElementsByTagName("html")[0]);
	var swipe = new Hammer.Swipe({ velocity: 0.1, threshold: 1});
	hammer.add(swipe);
	
	hammer.on('swipeleft', function(){ if (!pause) left(); });
	hammer.on('swiperight', function(){ if (!pause) right(); });
	hammer.on('swipeup', function(){ if (!pause) up(); });
	hammer.on('swipedown', function(){ if (!pause) down(); });
	
	function pauseGame(){
		if (!gameIsOver) {
			if (!pause) {
				pause = true;
				clearInterval(interval);
				view.pause();
			} else {
				pause = false;
				gameLoop();
			}
		}
	}
	
	function right(){ model.getSnakeBox().setDir("right"); }
	
	function left(){ model.getSnakeBox().setDir("left"); }
	
	function up(){ model.getSnakeBox().setDir("up"); }
	
	function down(){ model.getSnakeBox().setDir("down"); }
}