
/* IE lt 9 sucks -> we define our own indexOf method */
if( !Array.prototype.indexOf ) {
	Array.prototype.indexOf = function(needle) {
		for(var i = 0; i < this.length; i++)
			if(this[i] === needle)
				return i;
		return -1;
	};
}

/*Since javascript sucks -> we define our own array remove */
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/* typedef enum :-P :-P :-P 
 * Legacy code from attacker-defender mode, we should maybe just delete this */
Owner = {
	DEFENDER : 0,
	ATTACKER : 1,
	NEUTRAL  : 2
}

/* Node */
function Node(lvl, id){
	this.troops = [];
	this.owner = Owner.NEUTRAL;
	this.level = lvl;
	this.id = id;
	this.neighbor_list = [];
}

function Player(id, numtroops, controlled_nodes, capital, chips){
	this.id = id;
	this.available_troops = numtroops;  /* Troops available for placement */
	this.numtroops = 0;  /* troops present on the board */
	this.controlled_nodes = controlled_nodes;
	for(var n in controlled_nodes)
		n.owner = id;
	this.capital = capital;
	this.chips = chips;
}

Player.prototype.place_troops = function(node, troops){ 
	/* TODO: perform some additional checks to see if there aren't too many troops already present on node */
	if( troops > this.available_troops) {
		alert("You cannot place your troops here!");
		return false;
	} else {
		node.troops[this.id] += troops;
		this.available_troops -= troops;
		this.numtroops += troops;
		return true;
	}
}

/* TODO: review conditions on moving troops (check for correct levels and so on) 
 * once we've finally decided on a set of rules */
Player.prototype.movetroops = function(startnode, endnode, numtroops){
	if(startnode.neighbor_list.indexOf(endnode) == -1 || startnode.troops[this.id] < numtroops) {
		console.log("You cannot move " + numtroops + " troops from node " + startnode.id + " to node " + endnode.id + "!" + startnode.neighbor_list.indexOf(endnode) );
		return false;
	} else {
		startnode.troops[this.id] -= numtroops;
		endnode.troops[this.id] += numtroops;
		return true;
	}
} 


function fullGraphGen(){

	var depth = 6;
	var nodes_per_level = 5;
	//for each level generate the number of nodes per level
	var lvlNodes = []; //elements of the form [ number of nodes per level, array of nodes in level]
	for(var i = 0; i <= depth; i++)
		lvlNodes.push([ nodes_per_level, [] ]);

	var graph = [];
	var id = 0;
	//generate nodes
	for(var i = 0; i < lvlNodes.length; i++) {
		for(var j = 1; j <= lvlNodes[i][0]; j++) {
			var n = new Node(i, id++);
			graph.push(n);
			lvlNodes[i][1].push(n);
		}
	}

	/* Sorry for the horrible syntax, when I tried to do for(var n1 in lvlNodes[i][1]) javascript was screwing up */
	for(var i = 0; i < depth - 1; i++)
		/* for(var n1 in lvlNodes[i][1]) */
		for(var n1 = 0; n1 < lvlNodes[i][1].length; n1++) {
			/* for(var n2 in lvlNodes[i+1][1]) {*/
			for(var n2 = 0; n2 < lvlNodes[i+1][1].length; n2++) {
				// n1.neighbor_list.push(n2);
				// n2.neighbor_list.push(n1);
				lvlNodes[i][1][n1].neighbor_list.push(lvlNodes[i+1][1][n2]);
				lvlNodes[i+1][1][n2].neighbor_list.push(lvlNodes[i][1][n1]);
			}
		}

		for(var i = 0; i < graph.length; i++) {
			numNeighbors = Math.floor( (Math.random() * graph[i].neighbor_list.length) + 2);
			/* Choose a random index from current neighbors
			 * delete node at that index from current neighbors
			 * Connections are 2 ways => we then delete the current node from the list
			 * of neighbors of the node we just deleted */
			while(graph[i].neighbor_list.length > numNeighbors) {
				var unjoin_index = Math.floor(Math.random() * graph[i].neighbor_list.length);
				var unjoined = graph[i].neighbor_list[unjoin_index];
				graph[i].neighbor_list.splice(unjoin_index, 1);
				unjoined.neighbor_list.splice(unjoined.neighbor_list.indexOf(graph[i]), 1);
			}
		}
		return graph;
		/* TODO: what might be interesting is to select the capitals in this function and return the graph AND
		 * the list of capitals */
		};




	function Board(){
		this.nodelist = fullGraphGen();
		this.players = null;
	}


	Board.prototype.battle = function(){
		for(var k=0;k< boardPos.RposArray.length;k++){
			var i = boardPos.RposArray[k][3];
			var node = board.nodelist[i];
			if(node.troops[0]!=0 && node.troops[1]!=0){
				if(node.troops[0]>node.troops[1]){
					this.players[1].numtroops -= node.troops[1];
					node.troops[1] = 0;

					for(var j=0;j<boardPos.BposArray.length;j++){
						if(boardPos.BposArray[j][3]==i){
							boardPos.BposArray[j].remove(0);
							boardPos.BposArray[j].remove(1);
							boardPos.BposArray[j].remove(2);
							boardPos.BposArray[j].remove(3);
							boardPos.BposArray.remove(j);
						}
					}
				}
				if(node.troops[0]<node.troops[1]){
					this.players[0].numtroops -= node.troops[0];
					node.troops[0] = 0;

					for(var j=0;j<boardPos.RposArray.length;j++){
						if(boardPos.RposArray[j][3]==i){
							boardPos.RposArray[j].remove(0);
							boardPos.RposArray[j].remove(1);
							boardPos.RposArray[j].remove(2);
							boardPos.RposArray[j].remove(3);
							boardPos.RposArray.remove(j);
						}
					}
				}
				if(node.troops[0]==node.troops[1]){
					this.players[1].numtroops -= node.troops[1];
					node.troops[1] = 0;
					this.players[0].numtroops -= node.troops[0];
					node.troops[0] = 0;

					for(var j=0;j<boardPos.BposArray.length;j++){
						if(boardPos.BposArray[j][3]==i){
							boardPos.BposArray[j].remove(0);
							boardPos.BposArray[j].remove(1);
							boardPos.BposArray[j].remove(2);
							boardPos.BposArray[j].remove(3);
							boardPos.BposArray.remove(j);
						}
					}

					for(var j=0;j<boardPos.RposArray.length;j++){
						if(boardPos.RposArray[j][3]==i){
							boardPos.RposArray[j].remove(0);
							boardPos.RposArray[j].remove(1);
							boardPos.RposArray[j].remove(2);
							boardPos.RposArray[j].remove(3);
							boardPos.RposArray.remove(j);
						}
					}
				}
			}
		}
	}



	Board.prototype.battle2 = function(){
		for(var node in this.nodelist) {
			var owner = node.owner;
			var tie = false;
			/* Find out who owns the node */
			for(var i = 1; i < this.players.length; i++)
				if(owner == Owner.NEUTRAL || node.troops[i] > node.troops[owner]) {
					owner = i;
					tie = false;
				} else if(node.troops[i] == node.troops[owner])
					tie = true;

			/* kill off everyone else on this node and clean up dead players */
			if(owner != Owner.NEUTRAL)
				for(var i = 0; i < this.players.length; i++)
					if(i == owner && ! tie)
						continue;
					else {
						this.players[i].numtroops -= node.troops[i];
						node.troops[i] = 0;

						/* update board to remove players who lost */
						if(this.players[i].capital == node || this.players[i].numtroops == 0) {
							alert("Player " + this.players[i].id + " lost :(");
							for(var n in this.players[i].controlled_nodes) {
								n.owner = owner;
								this.players[owner].controlled_nodes.push(n);
							}
							this.players.splice(this.players.indexOf(this.players[i]), 1);
						}
					}
		}
	}



	Board.prototype.generate_chips = function(numNodes){

		var Uchips = [[10,10,20,5,30,25],
		    [20,20,10,30,10,10],
		    [5,5,20,20,20,30],
		    [5,10,15,20,30,20],
		    [30,15,15,15,15,10]];

		var listOfChips = Uchips[Math.floor( (Math.random() * (numNodes-1)))  ];
		return listOfChips;
	};


	var main = function(){

		for(var i = 0; i < 2; i++){
			players.push(new Player(i, 100, null, null,board.generate_chips(6)));  /* TODO: get a capital and a list of nodes from the board */
		}

		//players[0].capital = board.nodelist[0];
		//players[1].capital = board.nodelist[board.nodelist.length-1];

		board.players = players;
		/* for each node in graph, create an array of size 2 initialized to 0 */
		for(var i=0;i< board.nodelist.length;i++){
			board.nodelist[i].troops = [];
			board.nodelist[i].troops.push(0);
			board.nodelist[i].troops.push(0);
			board.nodelist[i].troops.push(0);
		}
		//n.troops = Array.apply(null, new Array(2)).map(Number.prototype.valueOf, 0);

		board.display();

		//if(board.players.length == 1)
		//alert("Player " + board.players[0] + " is king of the world.");
		//else
		//alert("Everyone loses in a war. People die and no one gets anything out of it.");
	}
