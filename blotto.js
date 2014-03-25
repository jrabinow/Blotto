var board = new Board();
var players = [];

function BoardPos()
{
	this.posArray = [];
	this.RposArray = [];
	this.BposArray = [];
	this.radius = 20;
};

var boardPos = new BoardPos();
var mouseDown = false;
var itemClicked = false;
var stage1 = true; //Red and blue put their chips on graph
var redTurn = true;
var chipInMotion = -1;

function dist(x1, y1, x2, y2)
{
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

function update(event)
{
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	if(itemClicked == false) {
		if(stage1) {
			if(redTurn)
				for (var i = 0; i < boardPos.RposArray.length; i++) {
					var x2 = boardPos.RposArray[i][0];
					var y2 = boardPos.RposArray[i][1];

					if (dist(x2, y2, x, y) < boardPos.radius
							&& boardPos.RposArray[i][4] == true
							&& boardPos.RposArray[i][5] == false) {
						console.log(boardPos.RposArray.length);
						itemClicked = true;
						chipInMotion = i;
					}
				}
			else
				for (var i = 0; i < boardPos.BposArray.length; i++) {
					var x2 = boardPos.BposArray[i][0];
					var y2 = boardPos.BposArray[i][1];

					if (dist(x2, y2, x, y) < boardPos.radius
							&& boardPos.BposArray[i][4] == true
							&& boardPos.BposArray[i][5] == false) {
						itemClicked = true;
						chipInMotion = i;
					}
				}
		} else {
			if(redTurn)
				for (var i = 0; i < boardPos.RposArray.length; i++) {
					var x2 = boardPos.RposArray[i][0];
					var y2 = boardPos.RposArray[i][1];

					if (dist(x2, y2, x, y) < boardPos.radius
							&& boardPos.RposArray[i][4] == true) {
						itemClicked = true;
						chipInMotion = i;
					}
				}
			else
				for (var i = 0; i < boardPos.BposArray.length; i++) {
					var x2 = boardPos.BposArray[i][0];
					var y2 = boardPos.BposArray[i][1];

					if (dist(x2, y2, x, y) <boardPos.radius
							&& boardPos.BposArray[i][4] == true) {
						itemClicked = true;
						chipInMotion = i;
					}
				}
		}
	} else {
		if(stage1) {
			if(redTurn) {
				for (var i = 0; i < 10; i++) {
					var x2 = boardPos.posArray[i][0];
					var y2 = boardPos.posArray[i][1];

					if (dist(x2, y2, x, y) < boardPos.radius ) {
						if(players[0].place_troops(board.nodelist[i], boardPos.RposArray[chipInMotion][2])) {
							boardPos.RposArray[chipInMotion][0] = x2;
							boardPos.RposArray[chipInMotion][1] = y2;

							boardPos.RposArray[chipInMotion][3] = i;
							boardPos.RposArray[chipInMotion][5] = true;
							itemClicked = false;
							chipInMotion = -1;

							if(players[0].available_troops == 0) {
								redTurn = false;
							}
							board.Udisplay();
						}
					}
				}
			} else {
				for (var i = 20; i < 30; i++) {
					var x2 = boardPos.posArray[i][0];
					var y2 = boardPos.posArray[i][1];

					if (dist(x2, y2, x, y) <boardPos.radius) {
						console.log(board.nodelist.toString);
						if(players[1].place_troops(board.nodelist[i], boardPos.BposArray[chipInMotion][2])) {
							boardPos.BposArray[chipInMotion][0] =x2;
							boardPos.BposArray[chipInMotion][1] =y2;
							boardPos.BposArray[chipInMotion][5]=true;
							boardPos.BposArray[chipInMotion][3] = i;
							itemClicked = false;
							chipInMotion = -1;

							//alert(players[1].available_troops);
							if(players[1].available_troops == 0) {
								redTurn = true;
								stage1 = false;
							}
							board.Udisplay();
						}
					}
				}
			}
		} else {
			if(redTurn) {
				for (var i = 0; i < 30; i++) {
					var x2 = boardPos.posArray[i][0];
					var y2 = boardPos.posArray[i][1];

					if (dist(x2, y2, x, y) < boardPos.radius) {
						if(players[0].movetroops(board.nodelist[boardPos.RposArray[ chipInMotion][3]],
									board.nodelist[i],
									boardPos.RposArray[chipInMotion][2])) {
							boardPos.RposArray[chipInMotion][0] = x2;
							boardPos.RposArray[chipInMotion][1] = y2;
							boardPos.RposArray[chipInMotion][3] = i;
							board.battle(chipInMotion, i, 0);
							chipInMotion = -1;
							redTurn = false;
						}
						itemClicked = false;
						board.Udisplay();
					}
				}
			} else {
				for (var i = 0; i < 30; i++) {
					var x2 = boardPos.posArray[i][0];
					var y2 = boardPos.posArray[i][1];

					if (dist(x2, y2, x, y) < boardPos.radius) {
						if(players[1].movetroops(board.nodelist[boardPos.BposArray[chipInMotion][3]],
									board.nodelist[i],
									boardPos.BposArray[chipInMotion][2])) {
							boardPos.BposArray[chipInMotion][0] = x2;
							boardPos.BposArray[chipInMotion][1] = y2;
							boardPos.BposArray[chipInMotion][3] = i;
							board.battle(chipInMotion, i, 1);
							chipInMotion = -1;
							redTurn = true;
						}
						itemClicked = false;
						board.Udisplay();
					}
				}
			}
		}
	}
};

var Start = 0;
var End = 800;
var BVStart = 200;
var BVEnd = 600;
var BHStart = 150;
var BHEnd = 650;

function commonDisplay()
{
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var capitalR = [10, 300];
	var capitalB = [680, 300];
	var rt = document.getElementById("rt");
	var bt = document.getElementById("bt");

	document.getElementsByTagName('table')[0].style.width = screen.width;
	ctx.drawImage(rt, capitalR[0], capitalR[1], 100, 100);
	ctx.drawImage(rs, 10, 10, 100, 100);
	//boardPos.posArray[0] = [capitalR[0], capitalR[1]];

	ctx.drawImage(bt, capitalB[0], capitalB[1], 100, 100);
	ctx.drawImage(bs, 700, 10, 100, 100);
	//boardPos.posArray[31] = [capitalB[0], capitalB[1]];

	ctx.beginPath();
	ctx.moveTo(200, 0);
	ctx.lineTo(200, 800);
	ctx.moveTo(600, 0);
	ctx.lineTo(600, 800);
	ctx.moveTo(0, 150);
	ctx.lineTo(800, 150);
	ctx.moveTo(0, 650);
	ctx.lineTo(800, 650);
	ctx.stroke();
	ctx.globalCompositeOperation="destination-over";
	ctx.beginPath();

	for (var i = 0; i < board.nodelist.length; i++) {
		for (var j = 0; j < board.nodelist[i].neighbor_list.length; j++) {
			ctx.moveTo(boardPos.posArray[board.nodelist[i].id][0],
					boardPos.posArray[board.nodelist[i].id][1]);
			ctx.lineTo(boardPos.posArray[board.nodelist[i].neighbor_list[j].id][0],
					boardPos.posArray[board.nodelist[i].neighbor_list[j].id][1]);
		};
	};

	ctx.lineWidth = 2;
	ctx.strokeStyle = 'rgba(0, 220, 0, 0.4)';
	ctx.stroke();
	ctx.beginPath();

	for(var i = 0; i < 5; i++) {
		var x = 225;
		var y = (BVStart + BVEnd) / 2 - 200 + i * 100;
		ctx.moveTo(capitalR[0] + 100, capitalR[1]);
		ctx.lineTo(x, y);
	}
	ctx.strokeStyle = 'rgba(220, 0, 0, 0.8)';
	ctx.stroke();
	ctx.beginPath();

	for(var i = 0; i < 5; i++) {
		var x = 575;
		var y = (BVStart + BVEnd) / 2 -200 + i * 100;
		ctx.moveTo(capitalB[0], capitalB[1]);
		ctx.lineTo(x, y);
	}
	ctx.strokeStyle = 'rgba(0, 0, 220, 0.8)';
	ctx.stroke();
	ctx.fillStyle = "green";
	ctx.font = 'bold italic 50px Times New Roman';
	ctx.fillText(" GRAPH WARS!", 200, 100);
	ctx.font = 'bold 30px sans-serif';
	ctx.fillText("Troops On Board:", 200, 680);
	ctx.fillStyle = "red";
	ctx.fillText("Red :" + players[0].numtroops, 350, 720);
	ctx.fillStyle = "blue";
	ctx.fillText("Blue:" + players[1].numtroops, 350, 750);
	ctx.font = 'bold 20px sans-serif';

	if(players[0].numtroops == 0 && boardPos.RposArray[0][4] == false) {
		ctx.fillStyle = "blue";
		ctx.fillText("BLUE WON with", 620, 710);
		ctx.fillText(" score " + players[1].numtroops , 620, 740);
	} else if(players[1].numtroops == 0 && boardPos.BposArray[0][4] == false) {
		ctx.fillStyle = "red";
		ctx.fillText("RED WON with", 620, 710);
		ctx.fillText(" score " + players[0].numtroops , 620, 740);
	} else {
		if(redTurn == true) {
			ctx.fillStyle = "red";
			ctx.fillText("Turn : RED ", 620, 720);
		} else {
			ctx.fillStyle = "blue";
			ctx.fillText("Turn : BLUE ", 620, 720);
		}
	}
	return ctx;
}

function getWinner()
{
	if(players[0].numtroops == 0 && boardPos.RposArray[0][4] == false) {
		return "RED";
	} else if(players[1].numtroops == 0 && boardPos.BposArray[0][4] == false) {
		return "BLUE";
	} else {
		return "No One";
	}
}

function getWinnerScore()
{
	if(getWinner() == "RED") {
		return players[0].numtroops;
	} else if(getWinner() == "BLUE") {
		return players[1].numtroops;
	} else
		return 0;
}

Board.prototype.Udisplay = function()
{
	var canvas = document.getElementById('myCanvas');
	var ctx= canvas.getContext('2d');
	ctx.clearRect(0, 0, 800, 800);
	ctx.textBaseline = "middle";
	ctx.font = 'bold 20px sans-serif';
	ctx.fillStyle = '#d3d3d3';
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
	ctx.globalCompositeOperation="source-over";

	for(var i = 0; i < 6; i++) {
		for(var j = 0; j < 5; j++) {
			ctx.beginPath();
			var x = Start + i * 70 + 50 + 175;		// x coordinate
			var y = (BVStart + BVEnd) / 2 -200 + j * 100;	// y coordinate
			ctx.arc(x, y, boardPos.radius, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < 3; j++) {
			var x = Start + i * 50 + 50;
			var y = (BVStart + BVEnd) / 2 + 100 + j * 50;
			ctx.beginPath();
			ctx.arc(x, y, boardPos.radius , 0, 2 * Math.PI);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(x + 650, y, boardPos.radius , 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	ctx.fillStyle = 'red';
	for(var i = 0; i < boardPos.RposArray.length; i++) {
		if(boardPos.RposArray[i][4] == true) {
			ctx.beginPath();
			var x = boardPos.RposArray[i][0];
			var y = boardPos.RposArray[i][1];
			ctx.arc(x, y, boardPos.radius , 0, 2 * Math.PI);
			ctx.fillText(players[0].chips[i].toString(), x - 10, y);
			ctx.stroke();
		}
	}
	ctx.fillStyle = 'blue';
	for(var i = 0; i < boardPos.BposArray.length; i++) {
		if(boardPos.BposArray[i][4] == true) {
			ctx.beginPath();
			var x = boardPos.BposArray[i][0];
			var y = boardPos.BposArray[i][1];
			ctx.arc(x, y, boardPos.radius , 0, 2 * Math.PI);
			ctx.fillText(players[1].chips[i].toString(), x - 10, y);
			ctx.stroke();
		}
	}
	commonDisplay();
}

Board.prototype.display = function()
{
	var canvas = document.getElementById('myCanvas');
	var ctx= canvas.getContext('2d');

	ctx.textBaseline = "middle";
	ctx.font = 'bold 20px sans-serif';
	ctx.fillStyle = 'red';

	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < 3; j++) {
			var x = Start + i * 50 + 50;			// x coordinate
			var y = (BVStart + BVEnd) / 2 + 100 + j * 50;	// y coordinate

			ctx.beginPath();
			ctx.arc(x, y, boardPos.radius , 0, 2 * Math.PI);
			ctx.fillText(players[0].chips[i * 3 + j].toString(), x - 10, y);
			ctx.stroke();
			boardPos.RposArray[i * 3 + j] = [x, y, players[0].chips[i * 3 + j]];
			boardPos.RposArray[i * 3 + j][4] = true;
			boardPos.RposArray[i * 3 + j][5] = false;
			boardPos.RposArray[i * 3 + j][3] = -1;
		}
	}
	ctx.fillStyle = 'blue';
	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < 3; j++) {
			var x = Start + i * 50 + 50 + 650;		// x coordinate
			var y = (BVStart + BVEnd) / 2 + 100 + j * 50;	// y coordinate
			var endAngle = 2 * Math.PI;

			ctx.beginPath();
			ctx.arc(x, y, boardPos.radius, 0, endAngle);
			ctx.fillText(players[1].chips[i * 3 + j].toString(), x - 10, y);
			ctx.stroke();
			boardPos.BposArray[i * 3 + j] = [x, y, players[1].chips[i * 3 + j]];
			boardPos.BposArray[i * 3 + j][4] = true;
			boardPos.BposArray[i * 3 + j][5] = false;
			boardPos.BposArray[i * 3 + j][3] = -1;
		}
	}
	ctx.fillStyle = 'grey';
	for(var i = 0; i < 6; i++) {
		for(var j = 0; j < 5; j++) {
			ctx.beginPath();
			var x = Start + i * 70 + 50 + 175;		// x coordinate
			var y = (BVStart + BVEnd) / 2 -200 + j * 100;	// y coordinate

			ctx.arc(x, y, boardPos.radius, 0, 2 * Math.PI);
			ctx.fill();
			boardPos.posArray[i * 5 + j] = [x, y];
		}
	}
	commonDisplay();
}

