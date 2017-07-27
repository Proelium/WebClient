Proelium.game = function (data) {
	this.id = data.id;
	this.map = new Proelium.map(data.map);
	this.app = false;
	this.selected = [];
	this.listener = false; //Map event listener
	this.mouseListener = false; //Map event listener
	this.container = false;
};

Proelium.game.prototype.exit = function () {
	if (this.listener !== false)
		document.removeEventListener("keydown", this.listener); //Free up any event listeners for this game
	
	if (this.mouseListener !== false)
		document.removeEventListener("wheel", this.mouseListener);
	
	if (this.container !== false)
		this.container.destroy(true);
	
	for (var i in PIXI.utils.TextureCache)
		PIXI.utils.TextureCache[i].destroy(true); //Clean up textures
	
	$(this.app.renderer.view).remove(); //Remove html element.
	
	this.map.destroy();
	delete this.map;
};

var listened = false;

function buildStats(stats) {
	var o = [];
	for (var i in stats) {
		o.push('<label style="margin-bottom: .5em"><i class="material-icons prefix" style="vertical-align: middle;">' + stats[i][0] + '</i> ' + stats[i][1] + '</label>');
	}
	return o.join("<br>");
}

Proelium.game.display = function (data) {
	$("#game-modal").remove();
	
	var form = !data.hasNation ? 
	'<div class="row"><div class="input-field col s6"><i class="material-icons prefix">account_balance</i><input id="icon_prefix" type="text" class="nation-name validate"><label for="icon_prefix">Your nation name</label></div><div class="col s6"><a href="#!" data-game-id="' + data.id + '" class="game-new-nation waves-effect waves-green green-text btn-flat">Start new nation</a></div></div>'
	: '<a href="#!" data-game-id="' + data.id + '" class="game-join waves-effect waves-green green-text btn-flat">Join</a>';
	
	var stats = [
		["access_time", (Math.round((Math.abs(data.starts)/60) * 100) / 100) + " hours old"],
		["account_balance", data.nations + " nations"],
		["fast_forward", data.speed + " speed"]
	];
	
	$('<div id="game-modal" class="modal"><div class="modal-content"><h4 class="left">' + Proelium.filter(data.name) + '</h4><p><div class="right">' + buildStats(stats) + '</div><br><p>' + data.description + '</p>' + form + '</div><div class="modal-footer"><a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat">Close</a></div></div>').appendTo("body").modal().modal("open");
};

Proelium.game.view = function (data) {
	return '<div class="card blue-grey game-list-item" style="padding: 1em; color: white; cursor: pointer;" data-started="' + data.started + '" data-starts="' + data.starts + '" data-game-id="' + data.id + '">' + data.name + '<span class="badge blue">' + (data.started ? "Started" : "Starting in " + data.starts + "min") + '</span></div>';
};

Proelium.game.uiEvents = function () {
	$(document).on("click", ".game-list-item", function () {
		socket.emit("game", {type: 3, id: parseInt($(this).attr("data-game-id"))});
	});
	
	$(document).on("click", ".game-join", function () {
		socket.emit("game", {type: 4, create: false, id: parseInt($(this).attr("data-game-id"))});
	});
	
	$(document).on("click", ".game-new-nation", function () {
		socket.emit("game", {type: 4, create: true, name: $(".nation-name").val(), id: parseInt($(this).attr("data-game-id"))});
	});
};

Proelium.game.refresh = function () {
	socket.emit("game", {type: 2});
	if (!listened) {
		Proelium.game.uiEvents();
		
		setInterval(function () {
			$(".game-list-item[data-started=false]").each(function () {
				var starts = parseInt($(this).attr("data-starts"))-1;
				$(this).attr("data-starts", starts);
				$(this).children(".badge").html("Starting in " + starts + "min");
			});
		}, 1000 * 60);
		
		socket.on("game", function (data) {
			if (data.type == 2) {
				$("#games").empty();
				for (var i in data.games) {
					$("#games").append(Proelium.game.view(data.games[i]));
				}
			}else if(data.type == 1) {
				$(".game-list-item[data-game-id=" + data.game + "] > .badge").html("Started");
				$(".game-list-item[data-game-id=" + data.game + "]").attr("data-started", "true");
			}else if(data.type == 3) {
				Proelium.game.display(data.game);
			}else if(data.type == 4) {
				$("#game-modal").modal("close"); //Make sure its gone
				if (Proelium.currentGame !== false)
					Proelium.currentGame.exit();
				Proelium.currentGame = new Proelium.game(data.game);
				Proelium.currentGame.start();
				Proelium.hideMenu();
				Proelium.notify("You entered a game, hit the esc key to exit.");
			}
		});
		listened = true;
	}
};

Proelium.game.prototype.start = function (game) {
	//TODO: Add game server connection
	
	var that = this;
	
	const app = new PIXI.Application();
	this.app = app;
	
	document.body.appendChild(app.view);
	
	var handle = function () {
		$(app.view).css({position: "absolute", top: 0, left: 0, "z-index": 10});
		app.view.width = window.innerWidth;
		app.view.height = window.innerHeight;
		app.renderer.resize(window.innerWidth, window.innerHeight);
	};
	
	app.backgroundColor = 0x90a4ae;
	
	app.render();
	
	window.onresize = handle;
	
	handle();
	
	var map = new PIXI.Container();
	that.container = map;
	map.position.x = 0;
	map.position.y = 0;
	
	var scape = [];
	
	app.stage.addChild(map);
	var x = 0;
	var y = 0;
	var scale = 1;
	function ren(clear) {
		clear = clear || false;
		that.map.render(map, x, y, scale, clear);
	}
	
	ren();
	
	that.mouseListener = function (e) {
		scale -= (e.deltaY)/1000;
		
		if (scale < 0.7)
			scale = 0.6;
		
		if (scale > 2)
			scale = 2;
		
		scale = Math.round(scale*10)/10;
		
		ren(true);
	};
	
	
	that.listener = function (e) {
		if (e.keyCode == 37)
			x -= 1;
		else if(e.keyCode == 39)
			x += 1;
		else if(e.keyCode == 38)
			y -= 1;
		else if(e.keyCode == 40)
			y += 1;
		ren();
	};
	
	document.addEventListener("keydown", that.listener);
	document.addEventListener("wheel", that.mouseListener);

};