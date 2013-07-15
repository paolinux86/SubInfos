steal("funcunit/qunit", "subinfos/fixtures", "subinfos/models/menu.js", function(){
	module("Model: Subinfos.Models.Menu")
	
	test("findAll", function(){
		expect(4);
		stop();
		Subinfos.Models.Menu.findAll({}, function(menus){
			ok(menus)
	        ok(menus.length)
	        ok(menus[0].name)
	        ok(menus[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Subinfos.Models.Menu({name: "dry cleaning", description: "take to street corner"}).save(function(menu){
			ok(menu);
	        ok(menu.id);
	        equals(menu.name,"dry cleaning")
	        menu.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Subinfos.Models.Menu({name: "cook dinner", description: "chicken"}).
	            save(function(menu){
	            	equals(menu.description,"chicken");
	        		menu.update({description: "steak"},function(menu){
	        			equals(menu.description,"steak");
	        			menu.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Subinfos.Models.Menu({name: "mow grass", description: "use riding mower"}).
	            destroy(function(menu){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})