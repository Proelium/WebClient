var Proelium = {
	getUser: function (id) {
		if (id == -1)
			return "Proelium";
		return id;
	},
	filter: function (str) {
		return str;
	},
	currentGame: false,
	hideMenu: function () {
		$(".menu").css("transform", "scale(0)");
		$("#profile").html(Proelium.user.view());
	},
	showMenu: function () {
		if (Proelium.currentGame !== false) {
			Proelium.currentGame.exit();
			delete Proelium.currentGame;
			Proelium.currentGame = false;
		}
		$(".menu").css("transform", "scale(1)");
		$("#profile").html(Proelium.user.view());
	},
	user: false, //No user until logged in
	notify: function (msg) {
		Materialize.toast(msg, 4000);
	},
	cache: false
};

global = {Proelium: Proelium};

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

document.onkeyup = function (e) {
	if (e.keyCode == 27)
		Proelium.showMenu();
};