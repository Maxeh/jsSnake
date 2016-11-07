/******* Date: 04.05.2015 *******/
/***** Author: Max Ehbauer ******/
/********************************/ 
"use strict";
/* Das snakeBox-Objekt entspricht dem Kopf der Snake (erste Box, die man steuern kann). */
/* Das snakeBox-Objekt gelangt als erstes Objekt ins Array >tail< */
var snakeBox; 
/* Das aktuelle (einzusammelnde) Box-Objekt wird global in der Variable >box< gespeichert. */
/* Wird ein neues Box-Objekt erstellt, gelangt das alte Box-Objekt ins Array >tail< und die Variable wird ueberschrieben. */
var box; 
var gameRunning = false;
var timerRunning = false;
var interval;
var speed;
/* Die Variable >intervalDirection< speichert die Variable >direction<, die fuer ein Intervall gilt. */ 
/* Auf diese Weise kann die Bewegung in die entgegengesetzte Richtung verhindert werden. */
var intervalDirection;
var direction = "right";
/* Alle Boxen werden als eigenes Objekt im Array >tail< gespeichert. */
var tail = [];
/* Das Spielfeld ist in einzelne Felder eingeteilt - ein Feld ist 50x50px groß. */ 
/* Die Nummerierung erfolgt von oben links bis unten rechts. */
var coordinates = new Array(220);

window.onload = function() {
	var startButton = document.getElementById("start-button");
	var pauseButton = document.getElementById("pause-button");
	var controlSelect = document.getElementById("control-select");
	startButton.onclick = function(){	
		if(!gameRunning) {
			var snakeWrapper = document.getElementById("snakeWrapper");
			var snakeNodes = snakeWrapper.childNodes;
			var snakeNodesLength = snakeNodes.length;
			for (var i = 0; i < snakeNodesLength; i++) {
				snakeWrapper.removeChild(snakeWrapper.firstChild);
			}
			snakeWrapper.innerHTML += "<div id='snakeBox' style='top: 250px; left: 300px;'></div>";
			
			var points = document.getElementById("points");
			points.innerHTML = 0;
			
			document.getElementById("game-over").style.display = "none";
			document.getElementById("snakeWrapper").style.borderColor = "black";
			
			pauseButton.disabled = false;
			startButton.disabled = true;
			controlSelect.disabled = true;
			
			var speedValue = document.getElementsByName("speed");
			for (var i = 0; i < speedValue.length; i++){
				if (speedValue[i].checked) 
					speed = speedValue[i].getAttribute("data-index") * 100;
			
				speedValue[i].disabled = true;
			}
	
			tail = [];
			snakeBox = new Snake();
			box = new Box();
			gameRunning = true;
			timerRunning = true;
			direction = "right";
			tail.push(snakeBox);
			interval = setInterval(snakeBox.move, speed);
		}
	}
	
	pauseButton.onclick = function() {
		if (gameRunning) {
			if (timerRunning) {
				timerRunning = false;
				clearInterval(interval);
				controlSelect.disabled = false;
				this.innerHTML = "Spiel fortsetzen [P]";
			}
			else {
				timerRunning = true;
				interval = setInterval(snakeBox.move, speed);
				controlSelect.disabled = true;
				this.innerHTML = "Spiel pausieren [P]";
			}
		}
	}
	
	window.onkeydown = function() {
		if (gameRunning && timerRunning){ 
			/* Eine Bewegung in die entgegengesetzte Richtung ist nicht moeglich. */
			/* Die Variable >intervalDirection< speichert die Richtung der letzten Bewegung (in der Funktion move()). */
			/* Moegliches Szenario ohne die Variable >intervalDirection<: Snake bewegt sich nach rechts => Klick nach oben und Klick nach links schnell hintereinander => Error */
			var controlSelect = document.getElementById("control-select");
			if (controlSelect.selectedIndex == 0){ // Pfeiltasten
				switch(event.keyCode) {
					case 37: if(intervalDirection != "right") direction = "left"; break;
					case 38: if(intervalDirection != "bottom") direction = "top"; break;
					case 39: if(intervalDirection != "left") direction = "right"; break;
					case 40: if(intervalDirection != "top") direction = "bottom"; break;
				}
			}
			if (controlSelect.selectedIndex == 1){ // W,A,S,D
				switch(event.keyCode) {
					case 65: if(intervalDirection != "right") direction = "left"; break;
					case 87: if(intervalDirection != "bottom") direction = "top"; break;
					case 68: if(intervalDirection != "left") direction = "right"; break;
					case 83: if(intervalDirection != "top") direction = "bottom"; break;
				}
			}
		} 	
		if (gameRunning) {
			if (event.keyCode == 80) 
				document.getElementById("pause-button").click();
		}
		if (!gameRunning) {
			if (event.keyCode == 13) 
				document.getElementById("start-button").click();
		}
	}
}

/* Bei einer Kollision mit einer Wand oder einer anderen Box wird die Methode gameOver() aufgerufen. */
function gameOver(){
	clearInterval(interval);
	timerRunning = false;
	gameRunning = false;
	document.getElementById("snakeWrapper").style.borderColor = "red"; 
	document.getElementById("game-over").style.display = "block";
	var speedValue = document.getElementsByName("speed");
		for (var i = 0; i < speedValue.length; i++){
			speedValue[i].disabled = false;
	}
	var startButton = document.getElementById("start-button");
	var pauseButton = document.getElementById("pause-button");
	var controlSelect = document.getElementById("control-select");
	controlSelect.disabled = false;
	pauseButton.disabled = true;
	startButton.disabled = false;
}

/* Der Snake Konstruktor wird einmal zu Beginn durch den Start-Button aufgerufen. */
function Snake() {	
	var snakeBoxDiv = document.getElementById("snakeBox"); 
	/* Jeweils 1 abziehen, damit die Boxen am Rand nicht eine doppelte Border haben. */
	var top = 249;
	var left = 299;	
		
	this.getTop = function() {
		return top;
	}
	this.getLeft = function() {
		return left;
	}
	
	/* Methode verschiebt die snakeBox horizontal um x Pixel. */
	function changeLeft(x) {
		left += x;
		snakeBoxDiv.style.left = left + "px";
	}
	
	/* Methode verschiebt die snakeBox vertikal um x Pixel. */
	function changeTop(y) {
		top += y;
		snakeBoxDiv.style.top = top + "px";
	}
	
	/* Methode prueft, ob im naechsten Schritt eine Box gefunden wird. */
	function checkBoxFound(){
		if ((top - 50 == box.getTop() && left == box.getLeft() && direction == "top") || (top + 50 == box.getTop() && left == box.getLeft() && direction == "bottom") ||
		    (top == box.getTop() && left + 50 == box.getLeft() && direction == "right") || (top == box.getTop() && left - 50 == box.getLeft() && direction == "left")) {
			/* Box befindet sich direkt vor der snakeBox und wird im naechsten Schritt eingesammelt. */
			
			/* Fuer jede eingesammelte Box werden die Punkte um 10 erhoeht. */
			var points = document.getElementById("points");
			points.innerHTML = parseInt(points.innerHTML) + 10;
			
			/* Die Box, die im naechsten Schritt eingesammelt wird muss aus dem HTML-Code geloescht werden. */
			/* Dazu wird das letzte div-Element mit der Klasse .box geloescht. */
			var delBox = document.getElementsByClassName("box")[document.getElementsByClassName("box").length - 1];
			document.getElementById("snakeWrapper").removeChild(delBox); 

			/* Die eingesammelte Box bekommt die Position des letzten Elements im Array >tail<. */
			/* Sie wird also auf die Box am Ende der gesamten Snake gesetzt */
			var lastTail = tail[tail.length - 1];
			box.boxDiv = document.createElement("div");
			box.boxDiv.setAttribute("class", "box");
			box.boxDiv.setAttribute("style", "");
			box.boxDiv.style.left = lastTail.getLeft() + "px";
			box.setLeft(lastTail.getLeft());
			box.boxDiv.style.top = lastTail.getTop() + "px";
			box.setTop(lastTail.getTop());
			document.getElementById("snakeWrapper").appendChild(box.boxDiv);
			
			tail.push(box);
			
			/* Nachdem die Box eingesammelt wurde wird eine neue Box erstellt. */
			box = new Box(); 			
		}
	}
	
	/* Methode ermittelt aus left-/top-Wert die Koordinate des Spielfelds. */
	function getCoordiante(_left, _top) {
		var leftCoo = (_left+1) / 50;
		var topCoo = (_top+1) / 50;
		var coo = (leftCoo+1) * 11 + topCoo;
		return coo;		
	}
	
	/* Methode legt fuer die Koordinate, auf der sich die snakeBox befindet die gewaehlte Richtung >direction< fest. */ 
	function setDirectionForCoordinate() {
		var coo = getCoordiante(left, top);
		coordinates[coo] = direction;	
	}
	
	/* Nachdem sich die snakeBox bewegt hat, muessen alle Boxen (außer die Box, die auf der letzten Box liegt) aufruecken. */
	function moveTail() {
		/* tail[0] = snakeBox => nicht verschieben */
		for (var i = 1; i < tail.length; i++) {
			
			var moveBox = tail[i];		
			
			/* Eine Box die gerade eingesammelt wurde und auf der letzten Box liegt, wird nicht verschoben und so automatisch zur letzten Box. */
			/* Im naechsten Zug muss diese Box natuerlich auch verschoben werden => boolean auf true setzen */
			if (moveBox.moveBoxOnFunctionMoveTail) {		
				var coo = getCoordiante(moveBox.getLeft(), moveBox.getTop());
			
				switch (coordinates[coo]) {
					case "right": moveBox.changeLeft(50); break;
					case "left": moveBox.changeLeft(-50); break;
					case "bottom": moveBox.changeTop(50); break;
					case "top": moveBox.changeTop(-50); break;	
				}
				
			} 
			else moveBox.moveBoxOnFunctionMoveTail = true;				
		}
	}
	
	/* Methode prueft, ob die snakeBox im naechsten Schritt mit einer Wand kollidiert. */
	function checkCollisionWithBorder() {
		if ((top == -1 && direction == "top") || (top == 499 && direction == "bottom") ||
		(left == -1 && direction == "left") || (left == 949 && direction == "right")) 
			return true;
	}
	
	/* Methode prueft, ob die snakeBox im naechsten Schritt mit einer anderen Box kollidiert. */
	function checkCollisionWithBox(){
		/* tail[0] = snakeBox => nicht ueberpruefen */
		for (var i = 1; i < tail.length; i++) {
			switch (direction){
				case "left": if(((left - 50) == tail[i].getLeft()) && (top == tail[i].getTop())) return true; break;
				case "top": if(((top - 50) == tail[i].getTop()) && (left == tail[i].getLeft())) return true; break;
				case "right": if(((left + 50) == tail[i].getLeft()) && (top == tail[i].getTop())) return true; break;
				case "bottom": if(((top + 50) == tail[i].getTop()) && (left == tail[i].getLeft())) return true; break;
			}
		}	
	}
	
	/* Die Methode move() wird durch das Intervall aufgerufen. */
	this.move = function() {
		if (checkCollisionWithBorder()) {
			gameOver();
			return;
		}
		if (checkCollisionWithBox()) {
			gameOver();
			return;
		}
		checkBoxFound();
		setDirectionForCoordinate();
		switch(direction){
			case "right": changeLeft(50); break;
			case "left": changeLeft(-50); break;
			case "bottom": changeTop(50); break;
			case "top": changeTop(-50); break;	
		}
		intervalDirection = direction; 
		moveTail();		
	}	
}



/* Box Konstruktor */
function Box() {
	this.boxDiv;  // speichert die Referenz auf das div der box
	this.moveBoxOnFunctionMoveTail = false;
	var top;
	var left;
	
	/* Es werden zufaellige Koordinaten fuer die Box ermittelt. */
	function getNextRandom(maxValue) {
		var countDown = 0;
		var countUp = 0;
		var rand = Math.round(Math.random()*maxValue);
		
		for (var i = 0; i < 2; i++) {
			var rand2 = rand;
			
			while(rand2 % 50 != 0) {
				if (i == 0) {
					rand2--;
					countDown++;
				}
				else {
					rand2++;
					countUp++;
				}
			}
		}	

		if (countDown > countUp)
			return rand-countDown;
		else return rand+countUp;
	}
	
	this.changeLeft = function(x) {
		 left += x;
		 this.boxDiv.style.left = left + "px";
	}
	this.changeTop = function(y)  {
		 top += y;
		 this.boxDiv.style.top = top + "px";
	}
	this.getTop = function() {
		return top;
	}
	this.setTop = function(_top) {
		top = _top;
	}
	this.getLeft = function() {
		return left;
	}
	this.setLeft = function(_left) {
		left = _left;
	}
	
	/**************************************************************/
	
	/* Die neue Position der Box darf nicht schon vergeben sein. */
	/* Es wird geprueft, ob die zufaellig ermittelte Stelle noch frei ist. */
	var free = false;
	while (!free) {
		var isFree = true;
		top = getNextRandom(500)-1;
		left = getNextRandom(950)-1;

		for (var i = 0; i < tail.length; i++) {
			if ((tail[i].getLeft() == left) && (tail[i].getTop() == top)) {
				isFree = false;
				break;
			}			
		}
		
		/* Die neue Box darf nicht direkt neben snakeBox liegen. */
		if (((snakeBox.getLeft() - 50) == left) && (snakeBox.getTop() == top)) isFree = false;	
		if (((snakeBox.getLeft() + 50) == left) && (snakeBox.getTop() == top)) isFree = false;
		if (((snakeBox.getLeft()) == left) && (snakeBox.getTop() + 50 == top)) isFree = false;
		if (((snakeBox.getLeft()) == left) && (snakeBox.getTop() - 50 == top)) isFree = false;
		
		if (isFree) free = true;		
	}
	
	/* Box wird erstellt und dem HTML-Code hinzugefuegt. */
	this.boxDiv = document.createElement("div");
	this.boxDiv.setAttribute("class", "box");
	this.boxDiv.setAttribute("id", "nextbox");
	this.boxDiv.setAttribute("style", "");
	this.boxDiv.style.left = left + "px";
	this.boxDiv.style.top = top + "px";
	document.getElementById("snakeWrapper").appendChild(this.boxDiv);	
}

