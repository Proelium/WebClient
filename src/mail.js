Proelium.mail = {
	refresh: function () {
		socket.emit("mail", {type: 1});
	},
	create: function () {
		
	},
	view: function (data) {
		var badge = "";
		if (!data.viewed)
			badge = "<span class='new badge right'></span>";
		
		return '<div class="card blue-grey mail-item" style="padding: 1em; color: white; cursor: pointer;" data-mail-id="' + data.id + '"> ' + Proelium.getUser(data.from) + ' : ' + Proelium.filter(data.subject) + badge + '</div>';
	},
	bigView: function (data) {
		return '<div id="mail-modal" class="modal"><div class="modal-content"><h4 class="left">' + Proelium.filter(data.subject) + '</h4><p><div class="right"><label>' + data.date + '</label><br>' + Proelium.getUser(data.from) + ' -> ' + Proelium.getUser(data.user) + "</div><br><p>"  + Proelium.filter(data.message) + '</p></div><div class="modal-footer"><a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat">Close</a></div></div>';
	},
	listen: function () {
		var that = this;
		$(document).on("click", ".mail-item", function () {
			socket.emit("mail", {type: 2, id: parseInt($(this).attr("data-mail-id"))});
		});
		
		socket.on("mail", function (data) {
			if (data.type == 1) {
				$("#mail-area").html("");
				for (var i in data.mail) {
					$("#mail-area").append(Proelium.mail.view(data.mail[i]));
				}
			}else{
				if ($("#mail-modal").length > 0) {
					$("#mail-modal").modal("close"); //Make sure its closed
					$("#mail-modal").remove();
				}
				$(Proelium.mail.bigView(data.mail)).appendTo("body").modal().modal("open");
			}
		});
	}
};