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
		init : function(){
			this.element.html("//subinfos/menu/views/init.ejs", { });
		},
		"#menu_about click": function() {
			$("#about").closest(".dialogcontainer").show();
		}
	});
});
