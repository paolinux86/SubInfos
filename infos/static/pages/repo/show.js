var cache = {
	cacheLower: -1,
	cacheUpper: null,
	displayStart: null,
	displayLength: null,
	lastRequest: null
};

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

function dataTablesPipeline(source, data, callback)
{
	var pipeSize = 5; /* Ajust the pipe size */

	var needServer = false;
	var echo = getKey(data, "sEcho");
	var requestStart = getKey(data, "iDisplayStart");
	var requestLength = getKey(data, "iDisplayLength");
	var requestEnd = requestStart + requestLength;
	cache.displayStart = requestStart;

	if(isOutsidePipeline(requestStart, requestEnd) || isSomethingChanged(data)) {
		needServer = true;
	}

	/* Store the request for checking next time around */
	cache.lastRequest = data.slice();

	if(needServer) {
		if(requestStart < cache.cacheLower) {
			requestStart = requestStart - (requestLength * (pipeSize - 1));
			if(requestStart < 0) {
				requestStart = 0;
			}
		}

		cache.cacheLower = requestStart;
		cache.cacheUpper = requestStart + (requestLength * pipeSize);
		cache.displayLength = getKey(data, "iDisplayLength");
		setKey(data, "iDisplayStart", requestStart);
		setKey(data, "iDisplayLength", requestLength * pipeSize);

		$.ajax({
			dataType: "json",
			url: source,
			data: data,
			success: function(json) {
				cache.lastJson = jQuery.extend(true, {}, json);
				if(cache.cacheLower != cache.displayStart) {
					json.aaData.splice(0, cache.displayStart-cache.cacheLower);
				}

				json.aaData.splice(cache.displayLength, json.aaData.length);
				callback(json)
			},
			error: function() {
				window.location.reload();
			}
		});
	} else {
		json = jQuery.extend(true, {}, cache.lastJson);
		json.sEcho = echo; /* Update the echo for each response */
		json.aaData.splice(0, requestStart - cache.cacheLower);
		json.aaData.splice(requestLength, json.aaData.length);
		callback(json);

		return;
	}
}

function isOutsidePipeline(requestStart, requestEnd)
{
	return cache.cacheLower < 0 ||
		requestStart < cache.cacheLower ||
		requestEnd > cache.cacheUpper;
}

function isSomethingChanged(data)
{
	if(!cache.lastRequest) {
		return false;
	}

	for(var i = 0, len = data.length; i < len; i++) {
		if(isPropertyNameToBeConsidered(data[i]) && data[i].value != cache.lastRequest[i].value) {
			return true;
		}
	}

	return false;
}

// TODO: Trovare un nome più decente...
function isPropertyNameToBeConsidered(data)
{
	return data.name != "iDisplayStart" &&
		data.name != "iDisplayLength" &&
		data.name != "sEcho";
}
