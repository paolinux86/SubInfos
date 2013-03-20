steal('jquery/controller',
	  'jquery/view/ejs',
	   'subinfos/models' )
.then('./views/init.ejs', function($) {

	/**
	* @class Subinfos.Commit.Detail
	*/
	$.Controller('Subinfos.Commit.Detail',
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function() {
		},
		"{Subinfos.Commit.List} commit_selected": function(el, ev, params) {
			this.element.html("//subinfos/commit/detail/views/init.ejs", Subinfos.Models.Commit.findOne(params), function() {
				$("#commit_diff").html(""); //TODO: loading...
				$("#commit_diff").load("/commit/" + params.id + "/diff");
			});
		}
	});
});
