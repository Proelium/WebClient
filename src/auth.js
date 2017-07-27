function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	
	var id_token = googleUser.getAuthResponse().id_token;
	socket.emit("login", {token: id_token});
	
	socket.on("notify", function (msg) {
		Proelium.notify(msg.message);
	});
	
	socket.on("join", function (msg) {
		Proelium.user = new Proelium.player(msg);
		if (msg["new"]) {
			Proelium.notify("Welcome "+msg.name+" to Proelium, view your mail to get started.");
		}else{
			Proelium.notify("Welcome back "+msg.name+".");
		}
		
		
		//TODO: Organize this
		$(".starter").css("position", "relative");
		$("h2.starter").animate({"left": "-500%"}, 250);
		$("div.starter").animate({"right": "-500%"}, 250, function () {
			$(".starter").remove();
			Proelium.showMenu();
		});
		
	});
};