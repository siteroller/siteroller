function tabs(tabs, elements, options){
	options = Object.merge({first:0}, options|| {});
	var els = $$(elements)
	  , tabs = $$(tabs)
	  , first = els[options.first||0];
	
	if (options.auto){
		var coords = first.getCoordinates(first.getOffsetParent());
		els.each(function(el){
			if (el.getStyle('position') != 'absolute'){
				var d = el.getSize();
				var wrap = new Element('div', 
						{ 'styles': {position:'absolute', width:d.x, height:d.y, top:coords.top, left:coords.left }, html: el.innerHTML	}
					);
				el.empty().adopt(wrap).setStyles({width:d.x, height:d.y});
			}
		});
	}
	
	tabs.each(function(tab,i){
		if (els[i]) var is = els[i].fade('hide');
		
		tab.addEvent('click',function(e){
			if (e) e.stop();
			els.fade(0).removeClass('activeEL');
			is.fade(1).addClass('activeEl');
			tabs.removeClass('activeTab');
			this.addClass('activeTab');
		});
	});
	first.fade('show');
}

function overtext(fields){
	$$(fields || 'input[rel], textarea[rel]').each(function(el){
		var prompt = el.get('rel')
		  , pass = el.get('type') == 'password';
		
		el.addEvents({
			focus: function(){
				if (el.get('value') == prompt){
					el.set({value:''}).removeClass('prompt');
					if (pass) el.set('type','password');
				}
			},
			blur: function(){
				var val = el.get('value');
				if (!val || val == prompt){
				   el.set('value',prompt).addClass('prompt');
				   if (pass) el.set('type','text');
				}
			}
		}).fireEvent('blur');
	});
}