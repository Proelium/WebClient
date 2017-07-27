Proelium.player = function (data) {
	this.username = data.name;
	this.picture = data.picture;
	this.points = data.points;
	
	
	Proelium.mail.listen();
	Proelium.mail.refresh();
	Proelium.game.refresh();
	$("#mail-refresh").on("click", function () {
		Proelium.mail.refresh();
	});
}

Proelium.player.prototype.view = function () {
	return '<div class="card grey darken-2"><div class="row"><div class="col s2"><img class="responsive-img circle"/ src="' + this.picture + '"></div><div class="col s10 white-text">' + this.username + '<br><label>' + this.points + '</label></div></div></div>';
};