window.onload = function(){
	var startButton = document.getElementById("btn-start");
	startButton.onclick = function(){
		
		var size = document.getElementById("select-size").options[document.getElementById("select-size").selectedIndex].value;
		var fieldBorder = document.getElementById("field-border").options[document.getElementById("field-border").selectedIndex].value;
		var difficulty = document.getElementById("difficulty").options[document.getElementById("difficulty").selectedIndex].value;
		
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("fieldBorder", fieldBorder);
			localStorage.setItem("size", size);
			localStorage.setItem("difficulty", difficulty);
		}	
		window.location.href = "snake/snake.html";
	}
	if (typeof(Storage) !== "undefined") {
		var fieldBorder = localStorage.getItem("fieldBorder") || 0;
		document.getElementById("field-border").selectedIndex = fieldBorder;	
		var size = localStorage.getItem("size") || 1;
		document.getElementById("select-size").selectedIndex = size;
		var difficulty = localStorage.getItem("difficulty") || 1;
		document.getElementById("difficulty").selectedIndex = difficulty;
	}
}