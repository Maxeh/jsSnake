"use strict";
function Model(_nbrX, _nbrY, _fieldBorder){
	var nbrX = _nbrX;
	var nbrY = _nbrY;
	var maxX = nbrX - 1;
	var maxY = nbrY - 1;
	var fieldBorder = _fieldBorder;
	var snakeBox = new SnakeBox();
	var box = new Box();
	var score = new Score();

	this.getBox = function(){
		return box;
	}
	this.getSnakeBox = function(){
		return snakeBox;
	}
	this.getScore = function(){
		return score;
	}
	
	function Score(){
		var score = 0;	
		
		this.getScore = function() {
			return score;
		}
		this.setScore = function(s){
			score = s;
		}	
		this.incScore = function(s){
			score++;
		}
	}
	
	function SnakeBox(){
		var tail = [];	
		var x;
		var y;
		var dir = "right";
		var intervalDir = "right";
		
		(function(){
			x = Math.floor(nbrX / 2); 
			y = Math.floor(nbrY / 2);
			if (tail.length == 0){
				var box = new Box(x-1,y);
				tail.push(box);
				var box = new Box(x-2,y);
				tail.push(box);
			}
		})();
		
		this.getTail = function(){
			return tail;
		}
		this.getX = function(){
			return x;
		}
		this.getY = function(){
			return y;
		}
		this.setDir = function(d){
			switch(d){
				case "left": if (intervalDir != "right") dir = "left"; break;
				case "right": if (intervalDir != "left")  dir = "right"; break;
				case "up": if (intervalDir != "down") dir = "up"; break;
				case "down": if (intervalDir != "up") dir = "down"; break;
			}
		}
		this.move = function(d){
			function updateBoxesInTail(_nX, _nY){
				var nX = _nX;
				var nY = _nY;
				var oX;
				var oY;
				// Alle Box-Objekte verschieben
				for (var i = 0; i < tail.length; i++){
					oX = tail[i].getX();
					oY = tail[i].getY();
					tail[i].setX(nX);
					tail[i].setY(nY);
					nX = oX;
					nY = oY;
				}
				// prüfen, ob Box eingesammelt wurde
				if (box.getX() == x && box.getY() == y){
					// Variable i gibt an, wie viele Blöcke angezeigt werden sollen
					for (var i = 0; i < 3; i++){
						box = new Box(tail[tail.length-1].getX(), tail[tail.length-1].getY());
						tail.push(box);
                    }
                    box = new Box();
					score.incScore();
				}
			}
			
			function nextFieldFree(_x, _y){
				for (var i = 0; i < tail.length; i++){
					if (tail[i].getX() == _x && tail[i].getY() == _y) 
						return false;		
				}
				return true;
			}
			
			switch(dir){
				case "right":
					if (nextFieldFree(x+1, y)){
						var nX = x;
						var nY = y;
						if (x == maxX && fieldBorder) return false;
						if (x == maxX && !fieldBorder) {
							x = 0; 
							if (!nextFieldFree(x,y)) return false;
						}
						else x++;
						updateBoxesInTail(nX, nY);
						intervalDir = "right";
						return true;
					}
					return false;
				case "left": 
					if (nextFieldFree(x-1, y)){
						var nX = x;
						var nY = y;						
						if (x == 0 && fieldBorder) return false;
						if (x == 0 && !fieldBorder) {
							x = maxX;
							if (!nextFieldFree(x,y)) return false;
						}
						else x--;
						updateBoxesInTail(nX, nY);
						intervalDir = "left";
						return true;
					}
					return false;
				case "up": 
					if (nextFieldFree(x, y-1)){
						var nX = x;
						var nY = y;
						if (y == 0 && fieldBorder) return false;
						if (y == 0 && !fieldBorder) {
							y = maxY;
							if (!nextFieldFree(x,y)) return false;
						}
						else y--;
						updateBoxesInTail(nX, nY);
						intervalDir = "up";
						return true;
					}
					return false;
				case "down":  
					if (nextFieldFree(x, y+1)){
						var nX = x;
						var nY = y;
						if (y == maxY && fieldBorder) return false;
						if (y == maxY && !fieldBorder) {
							y = 0;
							if (!nextFieldFree(x,y)) return false;
						}
						else y++;
						updateBoxesInTail(nX, nY);
						intervalDir = "down";
						return true;
					}
					return false;		
			}		
		}
	}
	
	function Box(_x, _y){
		var x = _x;
		var y = _y;
		
		function freeForBox(rX, rY){
			if (snakeBox.getX() == rX && snakeBox.getY() == rY) 
				return false;
			var tail = snakeBox.getTail();
			for (var i = 0; i < tail.length; i++) {
				if (tail[i].getX() == rX && tail[i].getY() == rY) 
					return false;
			}
			return true;
		}
		
		(function(){
			// Number.isInteger is notwendig, weil 0 als false interpretiert wird
			if (Number.isInteger(_x) && Number.isInteger(_y)) return;
			
			var rX = Math.floor(Math.random() * nbrX);
			var rY = Math.floor(Math.random() * nbrY);
			while (!freeForBox(rX, rY)) {
				var rX = Math.floor(Math.random() * nbrX);
				var rY = Math.floor(Math.random() * nbrY);
			}
			x = rX;
			y = rY;
		})();
		
		this.getX = function(){
			return x;
		}
		this.getY = function(){
			return y;
		}	
		this.setX = function(_x){
			x = _x;	
		}
		this.setY = function(_y){
			y = _y;	
		}
	}
}