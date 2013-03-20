steal("funcunit/qunit", "subinfos/fixtures", "subinfos/models/repo.js", function(){
	module("Model: Subinfos.Models.Repo")
	
	test("findAll", function(){
		expect(4);
		stop();
		Subinfos.Models.Repo.findAll({}, function(repos){
			ok(repos)
	        ok(repos.length)
	        ok(repos[0].name)
	        ok(repos[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Subinfos.Models.Repo({name: "dry cleaning", description: "take to street corner"}).save(function(repo){
			ok(repo);
	        ok(repo.id);
	        equals(repo.name,"dry cleaning")
	        repo.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Subinfos.Models.Repo({name: "cook dinner", description: "chicken"}).
	            save(function(repo){
	            	equals(repo.description,"chicken");
	        		repo.update({description: "steak"},function(repo){
	        			equals(repo.description,"steak");
	        			repo.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Subinfos.Models.Repo({name: "mow grass", description: "use riding mower"}).
	            destroy(function(repo){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})