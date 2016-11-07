"use strict";
function View(_model, _boxSize, _gameWidth, _gameHeight, _marginX, _marginY){
	var model = _model;
	var boxSize = _boxSize;
	var gameWidth = _gameWidth;
	var gameHeight = _gameHeight;
	var marginX = _marginX;
	var marginY = _marginY;
	
	(function(){
		document.body.innerHTML = 
			"<div id=\"field\"style=\""+
		    	"width:"+gameWidth+"px;"+
				"height:"+gameHeight+"px;"+
				"left:"+marginX+"px;"+
				"top:"+marginY+"px;"+
			"\"></div>";
	})();
	
	this.updateView = function(){
		
		// Punkte rendern
		var pointsHTML;
		if (model.getScore().getScore())
			pointsHTML = "<div id=\"points\">" + model.getScore().getScore() + "</div>";
		else pointsHTML = "";

		// Snake rendern
		var snakeHTML = "<div class=\"box\" style=\""+
			"left:"+(model.getSnakeBox().getX()*boxSize-1)+"px;"+
			"top:"+(model.getSnakeBox().getY()*boxSize-1)+"px;"+
			"width:"+parseFloat(boxSize-1)+"px;"+
			"height:"+parseFloat(boxSize-1)+"px;"+
			"border-radius:"+Math.round((boxSize/100)*30)+"px;"+
			"\"></div>";
	
		var tail = model.getSnakeBox().getTail(); 
		for (var i = 0; i < tail.length; i++) {
			snakeHTML += "<div class=\"box\" style=\""+
			"left:"+(tail[i].getX()*boxSize-1)+"px;"+
			"top:"+(tail[i].getY()*boxSize-1)+"px;"+
			"width:"+parseFloat(boxSize-1)+"px;"+
			"height:"+parseFloat(boxSize-1)+"px;"+
			"border-radius:"+Math.round((boxSize/100)*30)+"px;"+
			"\"></div>";
		}
			
		// Box rendern
		var boxHTML = "<div class=\"box\" style=\""+
			"left:"+(model.getBox().getX()*boxSize-1)+"px;"+
			"top:"+(model.getBox().getY()*boxSize-1)+"px;"+
			"width:"+parseFloat(boxSize-1)+"px;"+
			"height:"+parseFloat(boxSize-1)+"px;"+
			"background:#666;"+
			"border-radius:"+Math.round((boxSize/100)*30)+"px;"+
			"\"></div>";
			
		document.getElementById("field").innerHTML = pointsHTML + boxHTML + snakeHTML;
	}
	
	this.gameOver = function(){
		var s;
		if (model.getScore().getScore() == 1) s = "Block"; else s = "Bl&ouml;cke";
		var msg = "<div id=\"game-over\"><span id=\"game-over-text\">GAME OVER</span><br>Score: " + model.getScore().getScore() + " " + s +
				  "<br><button id=\"btn-start-page\">Einstellungen</button>"+
				  "<button id=\"btn-new-game\">Neues Spiel</button>"+
				  "</div>";
		document.getElementById("field").innerHTML = msg;
		document.getElementById("btn-new-game").focus();
		document.getElementById("btn-start-page").onclick = function(){ 
			location.href = "../index.html";	
		}
		document.getElementById("btn-new-game").onclick = function(){
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
	}
	
	this.pause = function() {
		var p = "<div id=\"pause\"><img src=\"../bilder/pause.png\"></div>"; 
		document.getElementById("field").innerHTML = p;		
	}
}