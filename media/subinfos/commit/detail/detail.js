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
			var commit = Subinfos.Models.Commit.findOne(params, null, function() {
				window.location.reload();
			});
			this.element.html("//subinfos/commit/detail/views/init.ejs", , function() {
				$("#commit_diff").html(""); //TODO: loading...
				$("#commit_diff").load("/commit/" + params.id + "/diff", function(response, status, xhr) {
					if(status == "error") {
						window.location.reload();
					}
				});
			});
		}
	});
});
