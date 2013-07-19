steal( "jquery/controller",
	   "jquery/view/ejs",
	   "subinfos/models",
	   "jquery/lang/observe/delegate",
	   "jquery/dom/route")
.then( "./views/404.ejs", function($){

	/**
	* @class Subinfos.Dispatcher
	*/
	$.Controller("Subinfos.Dispatcher",
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function(){
			$.route.ready(false);

			$.route(":resource", { "resource": "" });
			$.route(":resource/:id", { "resource": "", "id": "" });
		},
		"{$.route.data} change": function(route, event, newValue, oldValue) {
			$("html, body").animate({ scrollTop: 0 }, 200);
		},
		"{$.route.data} resource set": function(route, event, newValue, oldValue) {
			if($.route.attr("resource") == "repo") {
				var route_id = $.route.attr("id");
				if(route_id == null || route_id == "") {
					this.showError404();
				}
			} else if($.route.attr("resource") == "main") {
				$([Subinfos.Repo.List]).trigger("deselect");
			} else {
				this.showError404();
			}
		},
		"{$.route.data} resource remove": function(route, event, newValue, oldValue) {
			$.route.attrs({ resource: "main" }, true);
		},
		"{$.route.data} id set": function(route, event, newValue, oldValue) {
			if($.route.attr("resource") == "repo") {
				var route_id = $.route.attr("id");
				if(route_id != null && route_id != "") {
					$([Subinfos.Repo.List]).trigger("repo_selected", { id: parseInt(route_id) });
				} else {
					this.showError404();
				}
			} else {
				this.showError404();
			}
		},
		"{$.route.data} id remove": function(route, event, newValue, oldValue) {
			var route_resource = $.route.attr("resource");
			if(route_resource == "repo") {
				this.showError404();
			} else {
				$([Subinfos.Repo.List]).trigger("deselect");
			}
		},
		_handle: function() {
// 			//$("#user_login_container").hide();
// 			switch($.route.attr("resource")) {
// 				case "repo":
// 					var route_id = $.route.attr("id");
// 					if(route_id != null && route_id != "") {
// 						$([Subinfos.Repo.List]).trigger("repo_selected", { id: parseInt(route_id) });
// 					} else {
// 						this.showError404();
// 					}
// 					break;
// 				case "repo_":
// 					break;
// // 				case "login":
// // 					$([Gcm.Models]).trigger("clear");
// // 					var user = new Gcm.Models.User();
// // 					if(user.isLogged()) {
// // 						$.route.attrs({ resource: "main" }, true);
// // 						return;
// // 					}
// // 					$([Gcm.User.Login]).trigger("show");
// // 					break;
// 				case "main":
// 					break;
// 				default:
// 					try {
// 						if(window.location.hash.startsWith("#!")) {
// 							this.showError404();
// 						} // else ignore
// 					} catch(e) {
// 					}
//
// 					break;
// 			}
		},
		showError404: function()
		{
			//$("#dispatcher_errors").html("//gcm/dispatcher/views/404.ejs", {}).show();
		}
	});

});
