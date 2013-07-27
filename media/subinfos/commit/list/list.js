steal(
	"jquery/controller",
	"jquery/view/ejs",
	"/static/jquery.dataTables.min.js",
	"subinfos/scripts/mine/commit_list.js"
)
.then(
	"./views/init.ejs",
	"./views/no_repo_selected.ejs",

function($) {
	/**
	* @class Subinfos.Commit.List
	* @parent index
	* @inherits jQuery.Controller
	* Lists commits and lets you destroy them.
	*/
	$.Controller("Subinfos.Commit.List",
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		_resizeTimer: null,

		init : function() {
			this.element.html("//subinfos/commit/list/views/no_repo_selected.ejs", { });
		},
		"{Subinfos.Repo.List} deselect": function() {
			this.init();
		},
		"{Subinfos.Repo.List} repo_selected": function(el, ev, params) {
			steal.dev.log("repo_selected");
			steal.dev.log(params);
			$([Subinfos.Toolbar]).trigger("enableSearch");
			//DataTable.ext.sErrMode = "throw";

			var instance = this;
			this.element.html("//subinfos/commit/list/views/init.ejs", { }, function() {
				steal.dev.log("init table");
				$("#commits_table").dataTable({
					bScrollCollapse: true,
					sScrollY: "200",
					bPaginate: false,
					bInfo: false,
					bLengthChange: false,
					bFilter: true,
					bProcessing: true,
					bServerSide: true,
					sAjaxSource: "/repo/" + params.id + "/commits",
					fnServerData: dataTablesPipeline,
					bDeferRender: true,
					aaSorting: [[ 4, "desc" ]],
					aoColumns: [
						{ bVisible: false, asSorting: [  ] },
						null,
						{ asSorting: [  ] },
						null,
						null
					]
				});

				jQuery.fn.dataTableExt.oSort["html-undefined"]  = function(a,b) {
					return false;
				};
				$(".sorting_disabled").unbind("click");
				$(".sorting_disabled").css("cursor", "default");

				instance.setupResize();
			});
		},
		"#commits_table tr click": function(el, ev) {
			$("#commits_table").find("tr.row_selected").removeClass("row_selected");
			$(el).addClass("row_selected");

			var pos = $("#commits_table").dataTable().fnGetPosition(el.get(0));
			var data = $("#commits_table").dataTable().fnGetData(pos);

			//$("body").trigger("commit_selected", [ { id: data[0] } ]);
			$([Subinfos.Commit.List]).trigger("commit_selected", { id: data[0] });
		},
		setupResize: function() {
			var instance = this;
			$(window).resize(function() {
				clearTimeout(instance._resizeTimer);
				instance._resizeTimer = setTimeout(instance.redrawTable, 100);
			});
		},
		redrawTable: function() {
			var dataTable = $("#commits_table").dataTable();

			disableServerSide(dataTable);
			dataTable.fnDraw();
			enableServerSide(dataTable);
		}
	});
});
