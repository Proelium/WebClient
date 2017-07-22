var Proelium = {
	Hexagon: function (hexagonRadius, hexagonHeight) {
		var hex = new PIXI.Graphics();
		hex.beginFill(0xFF0000);
		
		hex.drawPolygon([
			-hexagonRadius, 0,
			-hexagonRadius/2, hexagonHeight/2,
			hexagonRadius/2, hexagonHeight/2,
			hexagonRadius, 0,
			hexagonRadius/2, -hexagonHeight/2,
			-hexagonRadius/2, -hexagonHeight/2,
		]);
		
		hex.endFill();
		return hex;
	}
};

Proelium.game = function (ip, gameId) {
	this.ip = ip;
	this.gameId = gameId;
	this.app = false;
	this.selected = [];
};

Proelium.game.prototype.start = function () {
	//TODO: Add game server connection
	
	const app = new PIXI.Application();
	this.app = app;
	
	document.body.appendChild(app.view);
	
	var handle = function () {
		app.view.width = window.innerWidth;
		app.view.height = window.innerHeight;
		app.renderer.resize(window.innerWidth, window.innerHeight);
	};
	
	window.onresize = handle;
	
	handle();
	
	PIXI.loader.add('logo', '/Logo/Proelium Logo.png').load(function(loader, resources) {
		var map = new PIXI.Container();
		map.position.x = 200;
		map.position.y = 200;
		
		
		function hexSelect() {
			console.log(this.mapData);
		}
		
		function hover() {
			this.alpha = 0.5;
		}
		
		function hoverLeave() {
			this.alpha = 1;
		}
		
		app.stage.addChild(map);
		var onOff = true;
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				onOff = !onOff;
				var size = 24;
				var hex = Proelium.Hexagon(46, 80);
				var pos = toHexagonPosition({x: i*(72), y: j*(82)}, 46, 80);
				hex.position.x = pos.x;
				hex.position.y = pos.y;
				hex.interactive = true;
				hex.mouseover = hover;
				hex.mouseout = hoverLeave;
				hex.click = hexSelect;
				hex.mapData = {x: i, y: j};
				
				map.addChild(hex);
			}
		}
	});
};

function toHexagonPosition(p, hexagonRadius, hexagonHeight) {
  var newP = {};
  var xIdx = Math.round(p.x / (hexagonRadius * (3 / 2)));
  newP.x = xIdx * (hexagonRadius * (3 / 2));
  if (xIdx % 2) {
    newP.y = Math.floor(p.y / (hexagonHeight)) * hexagonHeight + hexagonHeight / 2; 
  } else {
    newP.y = Math.round(p.y / (hexagonHeight)) * hexagonHeight;
  }
  
  return newP;
}