steal(
	"./models/models.js",		// steals all your models
	"./scripts/enums/enums.js",		// steals all enums
	//"./fixtures/fixtures.js",	// sets up fixtures for your models
	"jquery/dom/route",
	"subinfos/dispatcher")
.then(
	"subinfos/menu",
	"subinfos/repo/list",
	"subinfos/commit/list",
	"subinfos/commit/detail",
	"subinfos/toolbar"
)
.then(
	function()
	{
		// configure your application
		$("body").subinfos_dispatcher();

		$("#menu").subinfos_menu();
		$("#left_toolbar").subinfos_toolbar({ context: ToolbarContext.REPO_TOOLBAR });
		$("#right_toolbar").subinfos_toolbar({ context: ToolbarContext.COMMITS_TOOLBAR, search: true });
		$("#repo_list").subinfos_repo_list();
		$("#commit_list").subinfos_commit_list();
		$("#commit_detail").subinfos_commit_detail();

		$.route.ready(true);

		var resourceFromRouteAttr = $.route.attr("resource");
		if(resourceFromRouteAttr == "") {
			$.route.attrs({ resource: "main" }, true);
		}
	}
);
