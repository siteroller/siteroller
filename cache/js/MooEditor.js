var MooInline = new Class({
	
	Implements: [Events, Options],

	options:{
		xhtml : true
	},
	
	initialize: function(els, options){
		this.setOptions(options);						
		var displayBox = new Element('textarea', {'class':'srHide srRemove', 'id':'displayBox', 'type':'text' }).inject(document.body);
		this.build();			
		
		//if(!window.location.search.contains("edit=shtrl"))return false;			//$$(els).set('contentEditable', true)				//console.log('Al Hanissim0');	
		//var toolbar = new Element('div', {'id':'toolbar'}).inject(document.body);	//var save = new Request({url:'/siteroller/update.php'});	//alert('Al Hanissim0');	
	},

	build: function(){
		var path = "/siteroller/classes/mooinline/icons/";	//new Element('div', {'id':'backup', 'class':'srHide'}).inject(document.body);		//$$('.srImport').each(function(){ $('backup').adopt() }); })
		var save = new Request({url:'/siteroller/classes/editor/update.php'});
		function exec(args){ document.execCommand(cmd, args[1]||false, args[2]||null); }	//function exec(cmd){ document.execCommand(cmd, false, null); }//console.log('wow')
		var srEditor = new Element('div', {'id':'srEditor', 'class':'srRemove'}).inject(document.body, 'bottom');
		this.toolbar('r0_aa');
	},
	
	toolbar: function(row){
		//var title = 'srR'+row.substr(-1);
		var parent = $(title = 'srR'+row.substr(-1)) || new Element('div'{'id':title}).inject($('srEditor'));
		if(!$(row)){
			var bar = new Element('div', {'id':'srEditor_' + toolbar});
			MooInline.Buttons[row].each(function(key, val){
				var btn = new Element('span', {
					styles:{'background-image':'url('+path+'mi_'+key.substr(0,1)+'.gif)', 'background-position':(-16*key.substr(1))+'px 0' },
					title:val.title || val.args,
					events:{
						'mousedown': function(e){ e.stop() },
						'click': function(){ (val.click||exec)(val.args) }
					}
				}).inject(bar);
				if (val.click) bar.addEvent('keydown', function(){ if (event.key == val.shortcut && event.control) val.click });
				bar.inject(parent);
			})
		}
		
		row.setStyle('bottom', 0); //update to use effects	
	}
})

MooInline.Buttons = new Hash({
	r0_a0: new Hash({
		a0:{'text':'SiteRoller'}
		a1:{ title:'Save Changes', shortcut:'s', args:'', click:function(){ } }
		a2:{'id':'srTrigger', 'text':'Edit Page', 'click':function(){ 
			Browser.Engine.trident ? window.document.body.contentEditable='true' : document.designMode = 'On';
			if($('srEditor')) $('srEditor').set('display','fixed'); 
		}}
		a3:{'text':'metadata'}
	}),
	
	r1_a0: new Hash({ 
		//click, args, shortcut, parent, title, 
		a0:{ args:'Bold', shortcut:'b' },
		a1:{ args:'Italic', shortcut:'i' },
		a2:{ args:'Underline', shortcut:'u' },
		a3:{ args:'Strikethrough' },
		a4:{ args:['Link',true], click:exec2, title:'Link'  },
		a5:{ args:'Unlink' },
		c0:{ title:'Save Changes', shortcut:'s', click:function(){ 
				var details = new Hash({ 
					'page': window.location.pathname, // + (window.location.pathname == '/' ? 'index.php' : ''), 
					'content': document.body.innerHTML
				});
				/* var els = $$('.srImport')) || $$('body');
				  * els.each(function(){
				  * 	var id = this.get('id'), htm = this.innerHTML.trim();//get('html') was messing up the formatting!!
				  * 	if($(id+'_srImport').get('value') != htm) details.set(id:htm);insert: this.get('class');}) */
				save.send(details.toQueryString());
			}},
		c1:{ args:'Undo', shortcut:'z' },
		c2:{ args:'Redo', shortcut:'y' },
		c3:{ title:'Display HTML', click:function(){
				var d = $('displayBox');
				if(d.hasClass('srHide')){
					//d.removeClass('hide'); 
					$('displayBox').set({'styles':curEl.getCoordinates(), 'class':'', 'text':curEl.innerHTML.trim()});
				} else d.addClass('srHide'); } 
		}
	}),
	
	r2_aa: new Hash({
		'input':''
	})
})


/*
var MooEditor = new Class({
	
	Implements: [Events, Options],

	options:{
		xhtml : true
	},
	
	initialize: function(els,options){
		//console.log('Al Hanissim0');
		//alert('Al Hanissim0');
		//if(!window.location.search.contains("edit=shtrl"))return false;	
		this.setOptions(options);	
		
		
		//var toolbar = new Element('div', {'id':'toolbar'}).inject(document.body);
		var displayBox = new Element('textarea', {'class':'srHide srRemove', 'id':'displayBox', 'type':'text' }).inject(document.body);
		//var save = new Request({url:'/siteroller/update.php'});
		this.build();
		//$$(els).set('contentEditable', true)
	},

	build: function(){
		var path = "/siteroller/classes/mooinline/icons/";
		//new Element('div', {'id':'backup', 'class':'srHide'}).inject(document.body);
		//$$('.srImport').each(function(){ $('backup').adopt() }); })
		function exec(cmd){ document.execCommand(cmd, false, null); }//console.log('wow')
		function exec2(args){
			document.execCommand(cmd, args[1]||false, args[2]||null);
		}
		function clean(htm){  }
		var save = new Request({url:'/siteroller/classes/editor/update.php'});
		var srEditor = new Element('div', {'id':'srEditor', 'class':'srRemove'}).adopt(
			new Element('div').adopt( new Element('div', {'id':'srMenu'}).adopt(
				new Element('span',{'text':'SiteRoller'}), 
				new Element('span',{'text':'Save'}),
				new Element('span',{'id':'srTrigger', 'text':'Edit Page', 'events':{'click':function(){ 
					//console.log('Al Hanissim1'); 
					//window.document.designMode = 'on';
					(Browser.Engine.trident) ? window.document.body.contentEditable='true' : document.designMode = 'On';
					//alert('Al 1'); 
					
					//document.body.set('contentEditable',true);
					//(Browser.Engine.trident) ? window.document.body.set('contentEditable',true) : document.designMode = 'On';
					if($('srEditor')) $('srEditor').set('display','fixed')
					//$(window.document).set('designMode',true);  more testing here is needed desperately
			}} })	)	),
			new Element('div', {'id':'srMain'}).adopt(
				new Element('div', {'id':'srTemplate'}),
				new Element('div', {'id':'srText'}),
				new Element('div', {'id':'srModify'}),
				new Element('div', {'id':'srInput'})
			),
			new Element('div', {'id':'srFlyout'})
		).inject(document.body, 'bottom');
		
		var btns = new Hash({ 
			//click, args, shortcut, parent, title, 
			a0:{ args:'Bold', shortcut:'b' },
			a1:{ args:'Italic', shortcut:'i' },
			a2:{ args:'Underline', shortcut:'u' },
			a3:{ args:'Strikethrough' },
			a4:{ args:['Link',true], click:exec2, title:'Link'  },
			a5:{ args:'Unlink' },
			c0:{ title:'Save Changes', shortcut:'s', click:function(){ 
					var details = new Hash({ 
						'page': window.location.pathname, // + (window.location.pathname == '/' ? 'index.php' : ''), 
						'content': document.body.innerHTML
					});
					
					//var els = $$('.srImport')) || $$('body');
					//var details = new Hash({ 
					//	page: window.location.pathname, // + (window.location.pathname == '/' ? 'index.php' : ''), 
					//});
					//els.each(function(){
					//	var id = this.get('id'), htm = this.innerHTML.trim();//get('html') was messing up the formatting!!
					//	if($(id+'_srImport').get('value') != htm) details.set(id:htm);insert: this.get('class');
					//})
					
					save.send(details.toQueryString());
				}}, 
			c1:{ args:'Undo', shortcut:'z' },
			c2:{ args:'Redo', shortcut:'y' },
			c3:{ title:'Display HTML', click:function(){
					var d = $('displayBox');
					if(d.hasClass('srHide')){
						//d.removeClass('hide'); 
						$('displayBox').set({'styles':curEl.getCoordinates(), 'class':'', 'text':curEl.innerHTML.trim()});
					} else d.addClass('srHide'); } }
		}).each(function(val, key){
			new Element('span', {
				styles:{'background-image':'url('+path+'mi_'+key.substr(0,1)+'.gif)', 'background-position':(-16*key.substr(1))+'px 0' },
				id: 'mi_'+key,
				title:val.title || val.args,
				events:{
					'mousedown': function(e) { e.stop(); },
					'click': function(){ (val.click||exec)(val.args) },
					'keydown': function(){ if (event.key == val.shortcut && event.control) val.click }
				}
			}).inject($(val.parent || 'srText'));//
		})
	}
})


			new Element('div').adopt( new Element('div', {'id':'srMenu'}).adopt(
				new Element('span',{'text':'SiteRoller'}), 
				new Element('span',{'text':'Save'}),
				new Element('span',{'id':'srTrigger', 'text':'Edit Page', 'events':{'click':function(){ 
					//console.log('Al Hanissim1'); 
					//window.document.designMode = 'on';
					(Browser.Engine.trident) ? window.document.body.contentEditable='true' : document.designMode = 'On';
					//alert('Al 1'); 
					
					//document.body.set('contentEditable',true);
					//(Browser.Engine.trident) ? window.document.body.set('contentEditable',true) : document.designMode = 'On';
					if($('srEditor')) $('srEditor').set('display','fixed')
					//$(window.document).set('designMode',true);  more testing here is needed desperately
			}} })	)	),
			new Element('div', {'id':'srMain'}).adopt(
				new Element('div', {'id':'srTemplate'}),
				new Element('div', {'id':'srText'}),
				new Element('div', {'id':'srModify'}),
				new Element('div', {'id':'srInput'})
			),
			
		)
		
		


this.row0.each(function(val, key){
	new Element('span', {
		text:val.text,
		title:val.title || val.args,
		events:{ 'click': function(){ (val.click||exec)(val.args) }}
	});
	new Element('div', {'id':'mi0_'+key}).inject($('srMain'));
});		

this.row1.each(function(val, key){
	new Element('span', {
		styles:{'background-image':'url('+path+'mi_'+key.substr(0,1)+'.gif)', 'background-position':(-16*key.substr(1))+'px 0' },
		id: 'mi_'+key,
		title:val.title || val.args,
		events:{
			'mousedown': function(e) { e.stop(); },
			'click': function(){ (val.click||exec)(val.args) },
			'keydown': function(){ if (event.key == val.shortcut && event.control) val.click }
		}
	}).inject($(val.parent || 'srText'));
});

*/