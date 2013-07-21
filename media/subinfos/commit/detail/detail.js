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
			this.element.html("//subinfos/commit/detail/views/init.ejs", commit, function() {
				$("#commit_diff").html(""); //TODO: loading...
				$("#commit_diff").load("/commit/" + params.id + "/diff", function(response, status, xhr) {
					if(status == "error") {
						window.location.reload();
					}
				});
			});
		},
		"a click": function(el, ev) {
			ev.preventDefault();
			ev.stopPropagation();

			var element = $(el).attr('href');
			this.scrollToDiv($(element));
		},
		scrollToDiv: function(element) {
			var offset = element.position();
			var offsetTop = offset.top;
			var totalScroll = offsetTop;

			$("#commit_content").animate({
				scrollTop: totalScroll
			}, 200);
		}
	});
});
