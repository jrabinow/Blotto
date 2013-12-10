/* return all elements in a1 not contained in a2 */
function array_diff(a1, a2)
{
	var a = [], diff = [];

	for(var i = 0; i < a1.length; i++)
		a[a1[i]] = true;
	for(var i = 0; i < a2.length; i++)
		if(a[a2[i]])
			delete a[a2[i]];
		else
			a[a2[i]] = true;
	for(var k in a)
		diff.push(k);
	return diff;
}

/* IE lt 9 sucks -> we define our own indexOf method */
if( !Array.prototype.indexOf ) {
	Array.prototype.indexOf = function(needle) {
		for(var i = 0; i < this.length; i++)
			if(this[i] === needle)
				return i;
		return -1;
	};
}

/* typedef enum :-P :-P :-P 
 * Legacy code from attacker-defender mode, we should maybe just delete this */
Owner = {
	DEFENDER : 0,
	ATTACKER : 1,
	NEUTRAL  : 2
}

/* Node */
function Node(lvl, id)
{
	this.troops = [];
	this.owner = Owner.NEUTRAL;
	this.level = lvl;
	this.id = id;
	this.neighbor_list = [];
}

function Player(id, numtroops, controlled_nodes, capital)
{
	this.id = id;
	this.available_troops = numtroops;	/* Troops available for placement */
	this.numtroops = 0;			/* troops present on the board */
	this.controlled_nodes = controlled_nodes;
	for(var n in controlled_nodes)
		n.owner = id;
	this.capital = capital;
}

Player.prototype.place_troops = function(node, troops)
{	
	/* TODO: perform some additional checks to see if there aren't too many troops already present on node */
	if(node.owner != this.id || troops > this.available_troops) {
		alert("You cannot place your troops here!");
		return false;
	} else {
		node.troops[this.id] += troops;
		this.available_troops -= troops;
		return true;
	}
}

/* TODO: review conditions on moving troops (check for correct levels and so on) 
 * once we've finally decided on a set of rules */
Player.prototype.movetroops = function(startnode, endnode, numtroops)
{
	if(startnode.neighbor_list.indexOf(endnode) == -1 || startnode.troops[this.id] < numtroops) {
		alert("You cannot move " + numtroops + " troops from node " + startnode.id + " to node " + endnode.id + "!");
		return false;
	} else {
		startnode.troops[this.id] -= numtroops;
		endnode.troops[this.id] += numtroops;
		return true;
	}
}

/* Object-oriented programming is very nice, but there's no need to make this function part of the Board class
 * "Floating" functions are just fine too :) */
function fullGraphGen(depth, nodes_per_level)
{
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
				/* n1.neighbor_list.push(n2);
				 * n2.neighbor_list.push(n1);*/
				lvlNodes[i][1][n1].neighbor_list.push(lvlNodes[i+1][1][n2]);
				lvlNodes[i+1][1][n2].neighbor_list.push(lvlNodes[i][1][n1]);
			}
		}

	for(var i = 0; i < graph.length; i++) {
		numNeighbors = Math.floor( (Math.random() * graph[i].neighbor_list.length) + 1);
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

function sparseGraphGen(max_depth, max_nodes_per_level)
{
	//generate the number of levels
	var numlvl = Math.floor( (Math.random() * max_depth) + 1 );

	//for each level generate the number of nodes per level
	var lvlNodes = []; //elements of the form [ number of nodes per level, array of nodes in level]
	for(var i = 0; i <= numlvl; i++) {
		var numNodes = Math.floor( (Math.random() * max_nodes_per_level) + 1 );
		lvlNodes.push([ nodes_per_level, [] ]);
	}

	var graph = [];
	var id = 0;
	//generate the number of neighbors, per node
	for(var i = 0; i < lvlNodes.length; i++)
		for(var j = 1; j <= lvlNodes[i][0]; j++) {
			var n = new Node(i, id++);
			graph.push(n);
			lvlNodes[i][1].push(n);
		}

	for(var i = 0; i < depth - 1; i++)
		for(var n1 = 0; n1 < lvlNodes[i][1].length; n1++) {
			for(var n2 = 0; n2 < lvlNodes[i+1][1].length; n2++) {
				/* Sorry for the horrible syntax, when I tried to do for(var n1 in lvlNodes...) javascript was screwing up */
				lvlNodes[i][1][n1].neighbor_list.push(lvlNodes[i+1][1][n2]);
				lvlNodes[i+1][1][n2].neighbor_list.push(lvlNodes[i][1][n1]);
			}
		}

	//pruning
	for(var i = 0; i < graph.length; i++) {
		numNeighbors = Math.floor( (Math.random() * graph[i].neighbor_list.length) + 1);
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

	return graph;	// TODO: Same thing as for fullgraphgen
};

function Board(max_depth, max_nodes_per_level)
{
	this.nodelist = fullGraphGen(max_depth, max_nodes_per_level);
	this.players = null;
}

// TODO: implement me
Board.prototype.display = function()
{
}

Board.prototype.battle = function()
{
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

/* TODO: review code logic. WHY ARE WE GENERATING ONE CHIP PER NODE???
 * DO WE EVEN NEED CHIPS??? */
Board.prototype.generate_chips = function(numNodes, max_troops)
{
	var listOfChips = [];

	for(var i = 0; i < numNodes; i++) {
		var troop = Math.floor( ( Math.random() * max_troops) + 1 );
		listOfChips.push(troop);
	}
	return listOfChips;
};

var main = function()
{
	/* TODO: make number of players, size of graph and maximum number of troops parameters decided by player */
	var board = new Board(5, 5);
	/* "2 or more, use a for"
	 * 	-- Edgar Dijsktra */
	var players = [];
	//var chips = board.generate_chips(board.nodelist.length, 20);
	for(var i = 0; i < 2; i++)
		players.push(new Player(i, 50, null, null));	/* TODO: get a capital and a list of nodes from the board */
	board.players = players;
	/* for each node in graph, create an array of size 2 initialized to 0 */
	for(var n in board.nodelist)
		n.troops = Array.apply(null, new Array(2)).map(Number.prototype.valueOf, 0);
	board.display();

	/* The following random BS. This should all be erased and replaced with code that's activated by mouseclics */
	//	for(var p in players)
	//		p.place_troops();

	/* while more than one player remaining */
	while(board.players.length > 1) {
		/*		for(var p in players)
				p.movetroops();
				board.battle();
				*/
		break;
	}
	if(board.players.length == 1)
		alert("Player " + board.players[0] + " is king of the world.");
	else
		alert("Everyone loses in a war. People die and no one gets anything out of it.");
}

