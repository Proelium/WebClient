var Proelium = {};

Proelium.game = function (ip, gameId) {
	this.ip = ip;
	this.gameId = gameId;
};

Proelium.game.prototype.start = function () {
	//TODO: Add game server connection
	
	// Create the application
	const app = new PIXI.Application();

	// Add the view to the DOM
	document.body.appendChild(app.view);

	// ex, add display objects
	app.stage.addChild(PIXI.Sprite.fromImage('/Graphics/Logo/Proelium Logo.png'));
};