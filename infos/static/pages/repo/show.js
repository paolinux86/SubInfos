function dataTablesPipeline(source, data, callback)
{
	var dataTable = this;

	var search = getKey(data, "sSearch");
	if(search != "") {
		data.push({"name": "fil_revision", "value": $("#filter_revision").is(":checked") });
		data.push({"name": "fil_comment", "value": $("#filter_comment").is(":checked") });
		data.push({"name": "fil_user", "value": $("#filter_user").is(":checked") });
		data.push({"name": "fil_content", "value": $("#filter_content").is(":checked") });
	}

	var displayStart = 0;
	var displayLength = 10;
	setKey(data, "iDisplayLength", displayLength);

	var completed = false;
	var index = getKey(data, "sEcho");
	var isFirst = true;

	disableServerSide(dataTable);
	dataTable.fnClearTable();
	enableServerSide(dataTable);
	do {
		setKey(data, "iDisplayStart", displayStart);
		setKey(data, "sEcho", index);

		$.ajax({
			dataType: "json",
			url: source,
			data: data,
			async: false,
			success: function(json) {
				steal.dev.log("success");
				if(json.length == 0 || json.iTotalDisplayRecords == 0) {
					completed = true;
					return;
				}

				completed = (json.iTotalDisplayRecords < displayLength);
				if(isFirst && !(json.length == 1 || json.iTotalDisplayRecords == 1)) {
					callback(json);
				} else {
					addDataToTable(dataTable, json);
				}
			},
			error: function() {
				steal.dev.log("error");
				window.location.reload();
			}
		});

		displayStart += displayLength;
		index++;
		isFirst = false;
	} while(!completed);

	$("#commits_table_processing").css("visibility", "hidden");
}

function disableServerSide(dataTable)
{
	dataTable.fnSettings().oFeatures.bServerSide = false;
}

function enableServerSide(dataTable)
{
	dataTable.fnSettings().oFeatures.bServerSide = true;
}

function addDataToTable(dataTable, json)
{
	disableServerSide(dataTable);
	dataTable.fnAddData(json.aaData);
	enableServerSide(dataTable);
}

function setKey(data, key, value)
{
	for(var i = 0, len = data.length; i < len; i++) {
		if(data[i].name == key) {
			data[i].value = value;
		}
	}
}

function getKey(data, key)
{
	for(var i = 0, len = data.length; i < len ; i++) {
		if(data[i].name == key) {
			return data[i].value;
		}
	}

	return null;
}
