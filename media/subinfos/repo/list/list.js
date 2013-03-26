steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'subinfos/models' )
.then( './views/init.ejs', 
       './views/repo.ejs', 
       function($){

	/**
	* @class Subinfos.Repo.List
	* @parent index
	* @inherits jQuery.Controller
	* Lists repos and lets you destroy them.
	*/
	$.Controller('Subinfos.Repo.List',
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function() {
			var repos = Subinfos.Models.Repo.findAll({}, null, function() {
				window.location.reload(true);
			});
			this.element.html(this.view('init', repos));
		},
		".repo click": function(el, ev) {
			var repo_id = el.model().id;
			//$([Subinfos.Repo.List]).trigger("repo_selected", [ { el: el, id: repo_id } ]);
			$.route.attrs({ resource: "repo", id: repo_id }, true);
		},
		"{Subinfos.Repo.List} repo_selected": function(el, ev, params) {
			var repos = this.element.find(".repo");

			$.each(repos, function(index, item) {
				$item = $(item);
				if($item.find(".repo_id").text() != params.id) {
					return;
				}

				$item.siblings(".current").removeClass("current");
				$item.addClass("current");
			});
		}
	});
});
