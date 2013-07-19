function dataTablesPipeline(source, data, callback)
{
	var dataTable = this;

	var displayStart = 0;
	var displayLength = 10;
	setKey(data, "iDisplayLength", displayLength);

	var completed = false;
	var index = getKey(data, "sEcho");
	var isFirst = true;
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
				if(json.iTotalDisplayRecords == 0) {
					completed = true;
					return;
				}

				completed = (json.iTotalDisplayRecords < displayLength);
				if(isFirst) {
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
