steal('jquery/controller',
	  'jquery/view/ejs')
.then('./views/init.ejs', function($) {
	/**
	* @class Subinfos.Menu
	*/
	$.Controller('Subinfos.Menu',
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function() {
			var menu = Subinfos.Models.Menu.findAll({}, null, function() {
				window.location.reload(true);
			});
			this.element.html("//subinfos/menu/views/init.ejs", menu);
		},
		".submenu .item click": function(el, ev) {
			ev.preventDefault();
			ev.stopPropagation();

			var model = $(el).model();
			steal.dev.log(model);

			switch(model.type) {
				case "link":
					window.location = model.url;
					break;
				case "dialog":
					this._openDialog(model);
					break;
			}
		},
		_openDialog: function(model) {
			if(model.type != "dialog") {
				return;
			}

			switch(model.dialog) {
				case "info":
					$("#about").closest(".dialogcontainer").show();
					break;
			}
		}




		/*,
		"#menu_about click": function() {
			$("#about").closest(".dialogcontainer").show();
		}*/
	});
});
