var MooInline = new Class({
	
	Implements: [Events, Options],

	options:{
		xhtml : true,
		path: "/siteroller/classes/mooinline/icons/"
	},
	
	initialize: function(options){		//(els, options)
		//console.log("call");
		this.setOptions(options);
		var displayBox = new Element('textarea', {'class':'srHide srRemove', 'id':'displayBox', 'type':'text' }).inject(document.body);		
		this.build();			
		
		//if(!window.location.search.contains("edit=shtrl"))return false;			//$$(els).set('contentEditable', true)				//console.log('Al Hanissim0');	
		//var toolbar = new Element('div', {'id':'toolbar'}).inject(document.body);	//var save = new Request({url:'/siteroller/update.php'});	//alert('Al Hanissim0');	
	},

	build: function(){
		this.imgPath = "/siteroller/classes/mootextarea/images/";// "/siteroller/classes/mooinline/icons/";	//new Element('div', {'id':'backup', 'class':'srHide'}).inject(document.body);		//$$('.srImport').each(function(){ $('backup').adopt() }); })
		this.save = new Request({url:'/siteroller/classes/editor/update.php'});
		var srEditor = new Element('div', {'id':'srEditor', 'class':'srRemove', 'contentEditable':false}).inject(document.body, 'bottom');
		MooInline.Buttons.self = this;
		this.toolbar('srMain_0');
		
		//var test = MooInline.Buttons.r1_a0.a4.click.attempt('',this);test();
	},
	
	toolbar: function(row){
		var t = this, num = row.substr(-1), an = 'active'+num;
		//console.log("an is "+an);
		if(this.Buttons){console.log('here'); console.log(this.Buttons.srMain_0);}
		//var parent = $(row) || new Element('div',{'id':row}).inject($('srEditor'));
		//var parent = $(title = 'srR'+row.substr(1,1)) || new Element('div',{'id':title}).inject($('srEditor'));
		var parent = $(title = 'srR'+num) || new Element('div',{'id':title}).inject($('srEditor'));
		if(!$(row)){
			var bar = new Element('div', {'id':row}).inject(parent);
			MooInline.Buttons[row].each(function(val, key){
				var properties = new Hash({
					styles:{'background-image':'url('+t.imgPath+key.substr(0,1)+'.gif)', 'background-position':(16+16*key.substr(1))+'px 0' }, //-16
					title: val.args,
					events:{
						'mousedown': function(e){ e.stop() },
						'click': function(){ val.click ? (val.click=='toolbar' ? this.toolbar : val.click).attempt(val.args||val.title,this) : this.exec(val.args||val.title) }.bind(t)
						//'click': function(){ val.click ? (val.click=='toolbar' ? this.toolbar(val.args) : val.click.attempt(val.args||val.title,this)) : this.exec(val.args||val.title) }.bind(t)
						//is there some way to pass this.toolbar in the val.click?  'this' is misidentified, toolbasr by itself is not recognised.
						//'click': function(){ val.click ? val.click.attempt(val.args||val.title,t) : t.exec(val.args||val.title) }.bind(t)
					}
				}).extend(val).erase('args').erase('shortcut').erase('click').getClean();
				var btn = new Element((val.element||'span'), properties).inject(bar);
				if (val.click) bar.addEvent('keydown', function(){ if (event.key == val.shortcut && event.control) val.click });//change to switch
				
				//properties.events.click = properties.events.click.bind(t);  Will change 'this' to the class within the functions, even if the functions are overwritten in the hash.
			})
		}
		//if(t[an]) console.log("'t[an]' is "+t[an])
		if(t[an]) $(t[an]).setStyle('bottom', -20); 
		t[an] = row;
		$(row).setStyle('bottom', 0); //update to use effects	
	},
	
	exec: function(args){
		args = $splat(args);
		document.execCommand(args[0], args[2]||false, args[1]||null);
	},	
		
	getRange:function(){
		var sel = window.getSelection();
		if (!sel) return null;
		this.range = sel.rangeCount > 0 ? sel.getRangeAt(0) : (sel.createRange ? sel.createRange() : null);
		
		//try { return s.rangeCount > 0 ? s.getRangeAt(0) : (s.createRange ? s.createRange() : null); }
		//catch (e) { /IE bug when used in frameset/ return this.doc.body.createTextRange(); }
	},
	
	setRange: function(range) {
		var s = window.getSelection(); 				//document.getSelection for IE?
		//if (range2.select) $try(function(){ range2.select(); }); else { //for IE?
		
		if (s.addRange) {
			s.removeAllRanges();
			s.addRange(this.range);
		}
		var url = $('ght').get('value') || "http://www.google.com";
		this.exec(['createlink',url]);
		
		//var url = window.prompt("Enter an URL:", ".");
		//document.execCommand('createlink', false, url);
	},
	
	clean: function(source){
		//console.log('clean');
		if($('modalOverlay')){ console.log('modal going'); $('modalOverlay').destroy(); }else console.log('no modal');
		if($('windowUnderlay'))$('windowUnderlay').destroy();
		//console.log("about to begin");
		//if (notYet){
		//console.log("notYet is yet");
		var x = this.options.xhtml;
		//console.log("x is "+x)
		var br = '<br'+(x?'/':'')+'>';
		var cleanup = [
			[/<br class\="webkit-block-placeholder">/gi, "<br />"],		// Webkit cleanup
			[/<span class="Apple-style-span">(.*)<\/span>/gi, '$1'],	// should be corrected, not to get messed over on nested spans - SG!!!
			[/ class="Apple-style-span"/gi, ''],
			[/<span style="">/gi, ''],
			[/<p>\s*<br ?\/?>\s*<\/p>/gi, '<p>\u00a0</p>'],				// Remove padded paragraphs
			[/<p>(&nbsp;|\s)*<\/p>/gi, '<p>\u00a0</p>'],
			[/<br\s*\/?>/gi, br],										// Fix BRs, make it easier for next BR steps.
			[/><br\/?>/g, '>'],											// Remove (arguably) useless BRs
			[/^<br\/?>/g, ''],											// Remove leading BRs - perhaps combine with removing useless brs.
			[/<br\/?>$/g, ''],											// Remove leading BRs
			[/<br\/?>\s*<\/(h1|h2|h3|h4|h5|h6|li|p)/gi, '</$1'],		// Remove BRs from end of blocks
			//[/(<(?:img|input|br)[^/>]*)>/g, '$1 />'] 									// if (this.options.xhtml)//make tags xhtml compatable
			[/<p>(?:\s*)<p>/g, '<p>'],									// Remove double <p> tags - very dangerous, see next line 
			[/<\/p>\s*<\/p>/g, '</p>'],									// Remove double ending <p>s. - it will mess up the following: <p>a<p>b</p></p> --consider switching to a system of using node trees.
			[/<p>\W*<\/p>/g, ''],										// Remove empty ps, will mess up some formatting, depending on browser.
			[/<span style="font-weight: bold;">(.*)<\/span>/gi, '<strong>$1</strong>'],	// Semantic conversion.  Should be separate array that is merged in if semantic is set to true.
			[/<span style="font-style: italic;">(.*)<\/span>/gi, '<em>$1</em>'],
			[/<b\b[^>]*>(.*?)<\/b[^>]*>/gi, '<strong>$1</strong>'],
			[/<i\b[^>]*>(.*?)<\/i[^>]*>/gi, '<em>$1</em>'],
			[/<u\b[^>]*>(.*?)<\/u[^>]*>/gi, '<span style="text-decoration: underline;">$1</span>']
		];
		cleanup.each(function(val, key){ console.log(val); source = source.replace(val[0], val[1]); });
		//} else console.log("skipped the notYet, surely yet")
		return source;
	}        
})

MooInline.Buttons = new Hash({
	srMain_0: new Hash({
		m0:{'text':'SiteRoller', args:'Open Siteroller.org Homepage', 'click':function(){ window.open('http://www.siteroller.org') }},
		m1:{'id':'srTrigger', 'text':'Edit Page', 'click':function(){ 
			window.document.body.contentEditable='true';
			//$('srEditor').set('display','fixed'); 
			this.toolbar('srTextEdit_1');
		}}, 
		m2:{'text':'file'}, //{'text':'metadata'},		
		m3:{ title:'Save Changes', 'class':'saveBtn', 'styles':{'width':'75px'},
			shortcut:'s', click:function(){
		//		var content = this.clean(document.body.innerHTML);
			//	if(console)console.log('save')
				//if(console)console.log(content)
				
				new Request({url:'/siteroller/classes/mootextarea/update.php', data:new Hash({ 
						'page': window.location.pathname, 'content': document.body.innerHTML
					}).toQueryString()	
				}).send();
			}}
	}),
	
	srTextEdit_1: new Hash({ 
		//click, args, shortcut, parent, title,  - change to remove the click and arg, and then to merge by default. 
		a0:{ title:'Bold', shortcut:'b' },
		a1:{ title:'Italic', shortcut:'i' },
		a2:{ title:'Underline', shortcut:'u' },
		a3:{ title:'Strikethrough', shortcut:'s' },
		a4:{ title:'Link', click:'toolbar', args:'srAddLink_2' },
		a5:{ title:'Unlink' },
		/*c0:{ title:'Save Changes', shortcut:'s', click:function(){ 
				new Request({url:'/siteroller/classes/editor/update.php', data:new Hash({ 
						'page': window.location.pathname, 'content': document.body.innerHTML
					}).toQueryString()	
				}).send();
			}},*/
		b0:{ title:'Justify Menu', click:'toolbar', args:'srJustify_2' },
		b1:{ title:'Indent Menu',  click:'toolbar', args:'srIndent_2' },
		c0:{ title:'Undo', shortcut:'z' },
		c1:{ title:'Redo', shortcut:'y' },
		c2:{ title:'Display HTML', click:function(){
				var d = $('displayBox');
				if(d.hasClass('srHide')){
					//d.removeClass('hide'); 
					$('displayBox').set({'styles':curEl.getCoordinates(), 'class':'', 'text':curEl.innerHTML.trim()});
				} else d.addClass('srHide'); } 
		}
	}),
	
	srAddLink_2: new Hash({
		l0:{ 'text':'enter the url'},
		l1:{ 'click': this.getRange },
		l2:{ 'element':'input', 'type':'text', 'id':'ght', events:{ 'mousedown':function(){ MooInline.Buttons.self.getRange(); }}},
		l3:{ 'element':'input', 'type':'submit', 'value':'add link', events:{'click':function(){MooInline.Buttons.self.setRange()}}}
	}),
	
	srJustify_2: new Hash({
		j0:{ title:'Justify Left', args:'JustifyLeft'},
		j1:{ title:'Justify Center', args:'JustifyCenter'},
		j2:{ title:'Justify Right', args:'JustifyRight'},
		j3:{ title:'Justify Full', args:'JustifyFull'}
	}),
	
	srIndent_2:new Hash({
		i0:{title:'Indent'},
		i1:{title:'Outdent'},
		i2:{title:'Numbered List', args:'InsertOrderedList'},
		i3:{title:'Bulleted List', args:'InsertUnorderedList'}
	})
})

//window.addEvent('domready', function(){ abc = new MooInline() });
/*
String.prototype.multiReplace = function ( replacements ) {
	var str = this, i;
	for (i = 0; i < replacements.length; i++ ) {
		str = str.replace(replacements[i][0], replacements[i][1]);
	}
	return str;
};
*/
