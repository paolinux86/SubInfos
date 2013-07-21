steal(
	"jquery/controller",
	"jquery/view/ejs"
)
.then(
	"./views/init.ejs",

	function($)
	{
		/**
		* @class Subinfos.Toolbar
		*/
		$.Controller("Subinfos.Toolbar",
		/** @Static */
		{
			defaults : {}
		},
		/** @Prototype */
		{
			init : function() {
				this.element.html("//subinfos/toolbar/views/init.ejs", this.options, function() {
// 					$("#buttonToolbar").buttonset();
				});
			},
			"#searchField keyup": function(el, ev) {
				if(ev.which == 13) {
					this._doSearch();
					return;
				}

				if($(el).val() == "") {
					var dataTable = $("#commits_table").dataTable();
					var dtSettings = dataTable.fnSettings();
					dtSettings.oPreviousSearch.sSearch = "";
					dataTable.fnDraw();
				}
			},
			"#searchButton click": function() {
				this._doSearch();
			},
			_doSearch: function() {
				var filter = $("#searchField").val();
				if(filter == null || filter == "") {
					return;
				}

				var dataTable = $("#commits_table").dataTable();
				dataTable.fnFilter(filter);
			},
			"{Subinfos.Toolbar} enableSearch": function() {
				$("#searchButton").removeAttr("disabled");
				$("#searchField").removeAttr("disabled");
				$("#buttonToolbar").children().removeAttr("disabled");
			},
			"#buttonToolbarButton click": function() {
				if($("#buttonToolbarButton").hasClass("opener")) {
					$("#buttonToolbar").children().show();
					$("#buttonToolbarButton").removeClass("opener");
					$("#buttonToolbarButton").addClass("closer");
				} else {
					$("#buttonToolbar").children().hide();
					$("#buttonToolbarButton").removeClass("closer");
					$("#buttonToolbarButton").addClass("opener");
				}
			}
		});
	}
);
