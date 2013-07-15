steal(
	"jquery/model",

	function()
	{
		/**
		* @class Subinfos.Models.Menu
		* @parent index
		* @inherits jQuery.Model
		* Wraps backend menu services.
		*/
		$.Model("Subinfos.Models.Menu",
		/* @Static */
		{
			findAll: "/menu"
		},
		/* @Prototype */
		{

		});
	}
);
