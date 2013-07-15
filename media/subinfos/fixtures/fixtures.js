// map fixtures for this application

steal("jquery/dom/fixture", function(){
	
	$.fixture.make("repo", 5, function(i, repo){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "repo "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("commit", 5, function(i, commit){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "commit "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("menu", 5, function(i, menu){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "menu "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
})