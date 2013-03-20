steal('jquery/controller',
	  'jquery/view/ejs',
	  '/static/jquery.dataTables.min.js')
.then('./views/init.ejs',

function($) {
	/**
	* @class Subinfos.Commit.List
	* @parent index
	* @inherits jQuery.Controller
	* Lists commits and lets you destroy them.
	*/
	$.Controller('Subinfos.Commit.List',
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function() {
		},
		"{Subinfos.Repo.List} repo_selected": function(el, ev, params) {
			this.element.html("//subinfos/commit/list/views/init.ejs", { }, function() {
				$('#commits_table').dataTable({
					bPaginate: false,
					bInfo: false,
					bLengthChange: false,
					bFilter: false,
					bProcessing: true,
					bServerSide: true,
					sAjaxSource: "/repo/" + params.id + "/commits",
					fnServerData: dataTablesPipeline,
					aoColumns: [
						{ bVisible: false },
						null,
						{ asSorting: [  ] },
						null,
						null
					]
				});

				jQuery.fn.dataTableExt.oSort['html-undefined']  = function(a,b) {
					return false;
				};
				$('.sorting_disabled').unbind('click');
				$('.sorting_disabled').css("cursor", "default");
			});
		},
		"#commits_table tr click": function(el, ev) {
			$("#commits_table").find("tr.row_selected").removeClass("row_selected");
			$(el).addClass("row_selected");

			var pos = $("#commits_table").dataTable().fnGetPosition(el.get(0));
			var data = $("#commits_table").dataTable().fnGetData(pos);

			//$("body").trigger("commit_selected", [ { id: data[0] } ]);
			$([Subinfos.Commit.List]).trigger("commit_selected", { id: data[0] });
		}
	});
});
