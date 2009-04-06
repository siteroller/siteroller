/*MooTools, My Object Oriented Javascript Tools. Copyright (c) 2006-2007 Valerio Proietti, <http://mad4milk.net>, MIT Style License.||Clientcide Copyright (c) 2006-2008, http://www.clientcide.com/wiki/cnet-libraries#license*/

var dbug={logged:[],timers:{},firebug:false,enabled:false,log:function(){dbug.logged.push(arguments)},nolog:function(msg){dbug.logged.push(arguments)},time:function(name){dbug.timers[name]=new Date().getTime()},timeEnd:function(name){if(dbug.timers[name]){var end=new Date().getTime()-dbug.timers[name];dbug.timers[name]=false;dbug.log('%s: %s',name,end)}else dbug.log('no such timer: %s',name)},enable:function(silent){if(dbug.firebug){try{dbug.enabled=true;dbug.log=function(){(console.debug||console.log).apply(console,arguments)};dbug.time=function(){console.time.apply(console,arguments)};dbug.timeEnd=function(){console.timeEnd.apply(console,arguments)};if(!silent)dbug.log('enabling dbug');for(var i=0;i<dbug.logged.length;i++){dbug.log.apply(console,dbug.logged[i])}dbug.logged=[]}catch(e){dbug.enable.delay(400)}}},disable:function(){if(dbug.firebug)dbug.enabled=false;dbug.log=dbug.nolog;dbug.time=function(){};dbug.timeEnd=function(){}},cookie:function(set){var value=document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');var debugCookie=value?unescape(value[1]):false;if((!$defined(set)&&debugCookie!='true')||($defined(set)&&set)){dbug.enable();dbug.log('setting debugging cookie');var date=new Date();date.setTime(date.getTime()+(24*60*60*1000));document.cookie='jsdebug=true;expires='+date.toGMTString()+';path=/;'}else dbug.disableCookie()},disableCookie:function(){dbug.log('disabling debugging cookie');document.cookie='jsdebug=false;path=/;'}};(function(){var fb=typeof console!="undefined";var debugMethods=['debug','info','warn','error','assert','dir','dirxml'];var otherMethods=['trace','group','groupEnd','profile','profileEnd','count'];function set(methodList,defaultFunction){for(var i=0;i<methodList.length;i++){dbug[methodList[i]]=(fb&&console[methodList[i]])?console[methodList[i]]:defaultFunction}};set(debugMethods,dbug.log);set(otherMethods,function(){})})();if(typeof console!="undefined"&&console.warn){dbug.firebug=true;var value=document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');var debugCookie=value?unescape(value[1]):false;if(window.location.href.indexOf("jsdebug=true")>0||debugCookie=='true')dbug.enable();if(debugCookie=='true')dbug.log('debugging cookie enabled');if(window.location.href.indexOf("jsdebugCookie=true")>0){dbug.cookie();if(!dbug.enabled)dbug.enable()}if(window.location.href.indexOf("jsdebugCookie=false")>0)dbug.disableCookie()}new Native({name:'Date',initialize:Date,protect:true});['now','parse','UTC'].each(function(method){Native.genericize(Date,method,true)});Date.$Methods=new Hash();["Date","Day","FullYear","Hours","Milliseconds","Minutes","Month","Seconds","Time","TimezoneOffset","Week","Timezone","GMTOffset","DayOfYear","LastMonth","UTCDate","UTCDay","UTCFullYear","AMPM","UTCHours","UTCMilliseconds","UTCMinutes","UTCMonth","UTCSeconds"].each(function(method){Date.$Methods.set(method.toLowerCase(),method)});$each({ms:"Milliseconds",year:"FullYear",min:"Minutes",mo:"Month",sec:"Seconds",hr:"Hours"},function(value,key){Date.$Methods.set(key,value)});Date.implement({set:function(key,value){key=key.toLowerCase();var m=Date.$Methods;if(m.has(key))this['set'+m.get(key)](value);return this},get:function(key){key=key.toLowerCase();var m=Date.$Methods;if(m.has(key))return this['get'+m.get(key)]();return null},clone:function(){return new Date(this.get('time'))},increment:function(interval,times){return this.multiply(interval,times)},decrement:function(interval,times){return this.multiply(interval,times,false)},multiply:function(interval,times,increment){interval=interval||'day';times=$pick(times,1);increment=$pick(increment,true);var multiplier=increment?1:-1;var month=this.format("%m").toInt()-1;var year=this.format("%Y").toInt();var time=this.get('time');var offset=0;switch(interval){case'year':times.times(function(val){if(Date.isLeapYear(year+val)&&month>1&&multiplier>0)val++;if(Date.isLeapYear(year+val)&&month<=1&&multiplier<0)val--;offset+=Date.$units.year(year+val)});break;case'month':times.times(function(val){if(multiplier<0)val++;var mo=month+(val*multiplier);var year=year;if(mo<0){year--;mo=12+mo}if(mo>11||mo<0){year+=(mo/12).toInt()*multiplier;mo=mo%12}offset+=Date.$units.month(mo,year)});break;case'day':return this.set('date',this.get('date')+(multiplier*times));default:offset=Date.$units[interval]()*times;break}this.set('time',time+(offset*multiplier));return this},isLeapYear:function(){return Date.isLeapYear(this.get('year'))},clearTime:function(){['hr','min','sec','ms'].each(function(t){this.set(t,0)},this);return this},diff:function(d,resolution){resolution=resolution||'day';if($type(d)=='string')d=Date.parse(d);switch(resolution){case'year':return d.format("%Y").toInt()-this.format("%Y").toInt();break;case'month':var months=(d.format("%Y").toInt()-this.format("%Y").toInt())*12;return months+d.format("%m").toInt()-this.format("%m").toInt();break;default:var diff=d.get('time')-this.get('time');if(diff<0&&Date.$units[resolution]()>(-1*(diff)))return 0;else if(diff>=0&&diff<Date.$units[resolution]())return 0;return((d.get('time')-this.get('time'))/Date.$units[resolution]()).round()}},getWeek:function(){var day=(new Date(this.get('year'),0,1)).get('date');return Math.round((this.get('dayofyear')+(day>3?day-4:day+3))/7)},getTimezone:function(){return this.toString().replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/,'$1').replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,'$1$2$3')},getGMTOffset:function(){var off=this.get('timezoneOffset');return((off>0)?'-':'+')+Math.floor(Math.abs(off)/60).zeroise(2)+(off%60).zeroise(2)},parse:function(str){this.set('time',Date.parse(str));return this},format:function(f){f=f||"%x %X";if(!this.valueOf())return'invalid date';if(Date.$formats[f.toLowerCase()])f=Date.$formats[f.toLowerCase()];var d=this;return f.replace(/\%([aAbBcdHIjmMpSUWwxXyYTZ])/g,function($1,$2){switch($2){case'a':return Date.$days[d.get('day')].substr(0,3);case'A':return Date.$days[d.get('day')];case'b':return Date.$months[d.get('month')].substr(0,3);case'B':return Date.$months[d.get('month')];case'c':return d.toString();case'd':return d.get('date').zeroise(2);case'H':return d.get('hr').zeroise(2);case'I':return((d.get('hr')%12)||12);case'j':return d.get('dayofyear').zeroise(3);case'm':return(d.get('mo')+1).zeroise(2);case'M':return d.get('min').zeroise(2);case'p':return d.get('hr')<12?'AM':'PM';case'S':return d.get('seconds').zeroise(2);case'U':return d.get('week').zeroise(2);case'W':throw new Error('%W is not supported yet');case'w':return d.get('day');case'x':var c=Date.$cultures[Date.$culture];return d.format('%'+c[0].substr(0,1)+c[3]+'%'+c[1].substr(0,1)+c[3]+'%'+c[2].substr(0,1).toUpperCase());case'X':return d.format('%I:%M%p');case'y':return d.get('year').toString().substr(2);case'Y':return d.get('year');case'T':return d.get('GMTOffset');case'Z':return d.get('Timezone');case'%':return'%'}return $2})},setAMPM:function(ampm){ampm=ampm.toUpperCase();if(this.format("%H").toInt()>11&&ampm=="AM")return this.decrement('hour',12);else if(this.format("%H").toInt()<12&&ampm=="PM")return this.increment('hour',12);return this}});Date.prototype.compare=Date.prototype.diff;Date.prototype.strftime=Date.prototype.format;Date.$nativeParse=Date.parse;$extend(Date,{$months:['January','February','March','April','May','June','July','August','September','October','November','December'],$days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],$daysInMonth:function(monthIndex,year){if(Date.isLeapYear(year.toInt())&&monthIndex===1)return 29;return[31,28,31,30,31,30,31,31,30,31,30,31][monthIndex]},$epoch:-1,$era:-2,$units:{ms:function(){return 1},second:function(){return 1000},minute:function(){return 60000},hour:function(){return 3600000},day:function(){return 86400000},week:function(){return 608400000},month:function(monthIndex,year){var d=new Date();return Date.$daysInMonth($pick(monthIndex,d.format("%m").toInt()),$pick(year,d.format("%Y").toInt()))*86400000},year:function(year){year=year||new Date().format("%Y").toInt();return Date.isLeapYear(year.toInt())?31622400000:31536000000}},$formats:{db:'%Y-%m-%d %H:%M:%S',compact:'%Y%m%dT%H%M%S',iso8601:'%Y-%m-%dT%H:%M:%S%T',rfc822:'%a, %d %b %Y %H:%M:%S %Z','short':'%d %b %H:%M','long':'%B %d, %Y %H:%M'},isLeapYear:function(yr){return new Date(yr,1,29).getDate()==29},parseUTC:function(value){var localDate=new Date(value);var utcSeconds=Date.UTC(localDate.get('year'),localDate.get('mo'),localDate.get('date'),localDate.get('hr'),localDate.get('min'),localDate.get('sec'));return new Date(utcSeconds)},parse:function(from){var type=$type(from);if(type=='number')return new Date(from);if(type!='string')return from;if(!from.length)return null;for(var i=0,j=Date.$parsePatterns.length;i<j;i++){var r=Date.$parsePatterns[i].re.exec(from);if(r){try{return Date.$parsePatterns[i].handler(r)}catch(e){dbug.log('date parse error: ',e);return null}}}return new Date(Date.$nativeParse(from))},parseMonth:function(month,num){var ret=-1;switch($type(month)){case'object':ret=Date.$months[month.get('mo')];break;case'number':ret=Date.$months[month-1]||false;if(!ret)throw new Error('Invalid month index value must be between 1 and 12:'+index);break;case'string':var match=Date.$months.filter(function(name){return this.test(name)},new RegExp('^'+month,'i'));if(!match.length)throw new Error('Invalid month string');if(match.length>1)throw new Error('Ambiguous month');ret=match[0]}return(num)?Date.$months.indexOf(ret):ret},parseDay:function(day,num){var ret=-1;switch($type(day)){case'number':ret=Date.$days[day-1]||false;if(!ret)throw new Error('Invalid day index value must be between 1 and 7');break;case'string':var match=Date.$days.filter(function(name){return this.test(name)},new RegExp('^'+day,'i'));if(!match.length)throw new Error('Invalid day string');if(match.length>1)throw new Error('Ambiguous day');ret=match[0]}return(num)?Date.$days.indexOf(ret):ret},fixY2K:function(d){if(!isNaN(d)){var newDate=new Date(d);if(newDate.get('year')<2000&&d.toString().indexOf(newDate.get('year'))<0){newDate.increment('year',100)}return newDate}else return d},$cultures:{'US':['month','date','year','/'],'GB':['date','month','year','/']},$culture:'US',$language:'enUS',$cIndex:function(unit){return Date.$cultures[Date.$culture].indexOf(unit)+1},$parsePatterns:[{re:/^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})$/,handler:function(bits){var d=new Date();var culture=Date.$cultures[Date.$culture];d.set('year',bits[Date.$cIndex('year')]);d.set('month',bits[Date.$cIndex('month')]-1);d.set('date',bits[Date.$cIndex('date')]);return Date.fixY2K(d)}},{re:/^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})\s(\d{1,2}):(\d{1,2})(\w{2})$/,handler:function(bits){var d=new Date();d.set('year',bits[Date.$cIndex('year')]);d.set('month',bits[Date.$cIndex('month')]-1);d.set('date',bits[Date.$cIndex('date')]);d.set('hr',bits[4]);d.set('min',bits[5]);d.set('ampm',bits[6]);return Date.fixY2K(d)}}]});Number.implement({zeroise:function(length){return String(this).zeroise(length)}});String.implement({repeat:function(times){var ret=[];for(var i=0;i<times;i++)ret.push(this);return ret.join('')},zeroise:function(length){return'0'.repeat(length-this.length)+this}});Element.implement({tidy:function(){try{this.set('value',this.get('value').tidy())}catch(e){dbug.log('element.tidy error: %o',e)}},getTextInRange:function(start,end){return this.get('value').substring(start,end)},getSelectedText:function(){if(Browser.Engine.trident)return document.selection.createRange().text;return this.get('value').substring(this.getSelectionStart(),this.getSelectionEnd())},getSelectionStart:function(){if(Browser.Engine.trident){var offset=(Browser.Engine.trident4)?3:2;this.focus();var range=document.selection.createRange();if(range.compareEndPoints("StartToEnd",range)!=0)range.collapse(true);return range.getBookmark().charCodeAt(2)-offset}return this.selectionStart},getSelectionEnd:function(){if(Browser.Engine.trident){var offset=(Browser.Engine.trident4)?3:2;var range=document.selection.createRange();if(range.compareEndPoints("StartToEnd",range)!=0)range.collapse(false);return range.getBookmark().charCodeAt(2)-offset}return this.selectionEnd},getSelectedRange:function(){return{start:this.getSelectionStart(),end:this.getSelectionEnd()}},setCaretPosition:function(pos){if(pos=='end')pos=this.get('value').length;this.selectRange(pos,pos);return this},getCaretPosition:function(){return this.getSelectedRange().start},selectRange:function(start,end){this.focus();if(Browser.Engine.trident){var range=this.createTextRange();range.collapse(true);range.moveStart('character',start);range.moveEnd('character',end-start);range.select();return this}this.setSelectionRange(start,end);return this},insertAtCursor:function(value,select){var start=this.getSelectionStart();var end=this.getSelectionEnd();this.set('value',this.get('value').substring(0,start)+value+this.get('value').substring(end,this.get('value').length));if($pick(select,true))this.selectRange(start,start+value.length);else this.setCaretPosition(start+value.length);return this},insertAroundCursor:function(options,select){options=$extend({before:'',defaultMiddle:'SOMETHING HERE',after:''},options);value=this.getSelectedText()||options.defaultMiddle;var start=this.getSelectionStart();var end=this.getSelectionEnd();if(start==end){var text=this.get('value');this.set('value',text.substring(0,start)+options.before+value+options.after+text.substring(end,text.length));this.selectRange(start+options.before.length,end+options.before.length+value.length);text=null}else{text=this.get('value').substring(start,end);this.set('value',this.get('value').substring(0,start)+options.before+text+options.after+this.get('value').substring(end,this.get('value').length));var selStart=start+options.before.length;if($pick(select,true))this.selectRange(selStart,selStart+text.length);else this.setCaretPosition(selStart+text.length)}return this}});Element.Properties.inputValue={get:function(){switch(this.get('tag')){case'select':vals=this.getSelected().map(function(op){var v=$pick(op.get('value'),op.get('text'));return(v=="")?op.get('text'):v});return this.get('multiple')?vals:vals[0];case'input':switch(this.get('type')){case'checkbox':return this.get('checked')?this.get('value'):false;case'radio':var checked;if(this.get('checked'))return this.get('value');$(this.getParent('form')||document.body).getElements('input').each(function(input){if(input.get('name')==this.get('name')&&input.get('checked'))checked=input.get('value')},this);return checked||null}case'input':case'textarea':return this.get('value');default:return this.get('inputValue')}},set:function(value){switch(this.get('tag')){case'select':this.getElements('option').each(function(op){var v=$pick(op.get('value'),op.get('text'));if(v=="")v=op.get('text');op.set('selected',$splat(value).contains(v))});break;case'input':if(['radio','checkbox'].contains(this.get('type'))){this.set('checked',$type(value)=="boolean"?value:$splat(value).contains(this.get('value')));break}case'textarea':case'input':this.set('value',value);break;default:this.set('inputValue',value)}return this},erase:function(){switch(this.get('tag')){case'select':this.getElements('option').each(function(op){op.erase('selected')});break;case'input':if(['radio','checkbox'].contains(this.get('type'))){this.set('checked',false);break}case'input':case'textarea':this.set('value','');break;default:this.set('inputValue','')}return this}};$E=document.getElement.bind(document);var InputValidator=new Class({Implements:[Options],initialize:function(className,options){this.setOptions({errorMsg:'Validation failed.',test:function(field){return true}},options);this.className=className},test:function(field){if($(field))return this.options.test($(field),this.getProps(field));else return false},getError:function(field){var err=this.options.errorMsg;if($type(err)=="function")err=err($(field),this.getProps(field));return err},getProps:function(field){if($(field)&&$(field).get('validatorProps')){try{return JSON.decode($(field).get('validatorProps'))}catch(e){return{}}}else{return{}}}});var FormValidator=new Class({Implements:[Options,Events],options:{fieldSelectors:"input, select, textarea",ignoreHidden:true,useTitles:false,evaluateOnSubmit:true,evaluateFieldsOnBlur:true,evaluateFieldsOnChange:true,serial:true,warningPrefix:function(){return FormValidator.resources[FormValidator.language].warningPrefix||'Warning: '},errorPrefix:function(){return FormValidator.resources[FormValidator.language].errorPrefix||'Error: '}},initialize:function(form,options){this.setOptions(options);this.form=$(form);this.form.store('validator',this);this.warningPrefix=$lambda(this.options.warningPrefix)();this.errorPrefix=$lambda(this.options.errorPrefix)();if(this.options.evaluateOnSubmit)this.form.addEvent('submit',this.onSubmit.bind(this));if(this.options.evaluateFieldsOnBlur)this.watchFields()},toElement:function(){return this.form},getFields:function(){return this.fields=this.form.getElements(this.options.fieldSelectors)},watchFields:function(){this.getFields().each(function(el){el.addEvent('blur',this.validateField.pass([el,false],this));if(this.options.evaluateFieldsOnChange)el.addEvent('change',this.validateField.pass([el,true],this))},this)},onSubmit:function(event){if(!this.validate(event)&&event)event.preventDefault();else this.reset()},reset:function(){this.getFields().each(this.resetField,this);return this},validate:function(event){var result=this.getFields().map(function(field){return this.validateField(field,true)},this).every(function(v){return v});this.fireEvent('onFormValidate',[result,this.form,event]);return result},validateField:function(field,force){if(this.paused)return true;field=$(field);var passed=!field.hasClass('validation-failed');var failed,warned;if(this.options.serial&&!force){failed=this.form.getElement('.validation-failed');warned=this.form.getElement('.warning')}if(field&&(!failed||force||field.hasClass('validation-failed')||(failed&&!this.options.serial))){var validators=field.className.split(" ").some(function(cn){return this.getValidator(cn)},this);var validatorsFailed=[];field.className.split(" ").each(function(className){if(!this.test(className,field))validatorsFailed.include(className)},this);passed=validatorsFailed.length===0;if(validators&&!field.hasClass('warnOnly')){if(passed){field.addClass('validation-passed').removeClass('validation-failed');this.fireEvent('onElementPass',field)}else{field.addClass('validation-failed').removeClass('validation-passed');this.fireEvent('onElementFail',[field,failed])}}if(!warned){var warnings=field.className.split(" ").some(function(cn){if(cn.test('^warn-')||field.hasClass('warnOnly'))return this.getValidator(cn.replace(/^warn-/,""));else return null},this);field.removeClass('warning');var warnResult=field.className.split(" ").map(function(cn){if(cn.test('^warn-')||field.hasClass('warnOnly'))return this.test(cn.replace(/^warn-/,""),field,true);else return null},this)}}return passed},getPropName:function(className){return'__advice'+className},test:function(className,field,warn){field=$(field);if(field.hasClass('ignoreValidation'))return true;warn=$pick(warn,false);if(field.hasClass('warnOnly'))warn=true;var isValid=true;if(field){var validator=this.getValidator(className);if(validator&&this.isVisible(field)){isValid=validator.test(field);if(!isValid&&validator.getError(field)){if(warn)field.addClass('warning');var advice=this.makeAdvice(className,field,validator.getError(field),warn);this.insertAdvice(advice,field);this.showAdvice(className,field)}else this.hideAdvice(className,field);this.fireEvent('onElementValidate',[isValid,field,className])}}if(warn)return true;return isValid},showAdvice:function(className,field){var advice=this.getAdvice(className,field);if(advice&&!field[this.getPropName(className)]&&(advice.getStyle('display')=="none"||advice.getStyle('visiblity')=="hidden"||advice.getStyle('opacity')==0)){field[this.getPropName(className)]=true;if(advice.reveal)advice.reveal();else advice.setStyle('display','block')}},hideAdvice:function(className,field){var advice=this.getAdvice(className,field);if(advice&&field[this.getPropName(className)]){field[this.getPropName(className)]=false;if(advice.dissolve)advice.dissolve();else advice.setStyle('display','none')}},isVisible:function(field){if(!this.options.ignoreHidden)return true;while(field!=document.body){if($(field).getStyle('display')=="none")return false;field=field.getParent()}return true},getAdvice:function(className,field){return field.retrieve('advice-'+className)},makeAdvice:function(className,field,error,warn){var errorMsg=(warn)?this.warningPrefix:this.errorPrefix;errorMsg+=(this.options.useTitles)?field.title||error:error;var advice=this.getAdvice(className,field);if(!advice){var cssClass=(warn)?'warning-advice':'validation-advice';advice=new Element('div',{text:errorMsg,styles:{display:'none'},id:'advice-'+className+'-'+this.getFieldId(field)}).addClass(cssClass)}else{advice.set('html',errorMsg)}field.store('advice-'+className,advice);return advice},insertAdvice:function(advice,field){var vProp=field.get('validatorProps');if(vProp){var vp=JSON.decode(vProp);var msgPos=vp.msgPos}if(!msgPos){switch(field.type.toLowerCase()){case'radio':var p=field.getParent().adopt(advice);break;default:advice.inject($(field),'after')}}else{$(msgPos).grab(advice)}},getFieldId:function(field){return field.id?field.id:field.id="input_"+field.name},resetField:function(field){field=$(field);if(field){var cn=field.className.split(" ");cn.each(function(className){if(className.test('^warn-'))className=className.replace(/^warn-/,"");var prop=this.getPropName(className);if(field[prop])this.hideAdvice(className,field);field.removeClass('validation-failed');field.removeClass('warning');field.removeClass('validation-passed')},this)}return this},stop:function(){this.paused=true;return this},start:function(){this.paused=false;return this},ignoreField:function(field,warn){field=$(field);if(field){this.enforceField(field);if(warn)field.addClass('warnOnly');else field.addClass('ignoreValidation')}return this},enforceField:function(field){field=$(field);if(field)field.removeClass('warnOnly').removeClass('ignoreValidation');return this}});FormValidator.resources={enUS:{required:'This field is required.',minLength:'Please enter at least {minLength} characters (you entered {length} characters).',maxLength:'Please enter no more than {maxLength} characters (you entered {length} characters).',integer:'Please enter an integer in this field. Numbers with decimals (e.g. 1.25) are not permitted.',numeric:'Please enter only numeric values in this field (i.e. "1" or "1.1" or "-1" or "-1.1").',digits:'Please use numbers and punctuation only in this field (for example, a phone number with dashes or dots is permitted).',alpha:'Please use letters only (a-z) with in this field. No spaces or other characters are allowed.',alphanum:'Please use only letters (a-z) or numbers (0-9) only in this field. No spaces or other characters are allowed.',dateSuchAs:'Please enter a valid date such as {date}',dateInFormatMDY:'Please enter a valid date such as MM/DD/YYYY (i.e. "12/31/1999")',email:'Please enter a valid email address. For example "fred@domain.com".',url:'Please enter a valid URL such as http://www.google.com.',currencyDollar:'Please enter a valid $ amount. For example $100.00 .',oneRequired:'Please enter something for at least one of these inputs.',errorPrefix:'Error: ',warningPrefix:'Warning: '}};FormValidator.language="enUS";FormValidator.getMsg=function(key,language){return FormValidator.resources[language||FormValidator.language][key]};FormValidator.adders={validators:{},add:function(className,options){this.validators[className]=new InputValidator(className,options);if(!this.initialize){this.implement({validators:this.validators})}},addAllThese:function(validators){$A(validators).each(function(validator){this.add(validator[0],validator[1])},this)},getValidator:function(className){return this.validators[className]}};$extend(FormValidator,FormValidator.adders);FormValidator.implement(FormValidator.adders);FormValidator.add('IsEmpty',{errorMsg:false,test:function(element){if(element.type=="select-one"||element.type=="select")return!(element.selectedIndex>=0&&element.options[element.selectedIndex].value!="");else return((element.get('value')==null)||(element.get('value').length==0))}});FormValidator.addAllThese([['required',{errorMsg:function(){return FormValidator.getMsg('required')},test:function(element){return!FormValidator.getValidator('IsEmpty').test(element)}}],['minLength',{errorMsg:function(element,props){if($type(props.minLength))return FormValidator.getMsg('minLength').substitute({minLength:props.minLength,length:element.get('value').length});else return''},test:function(element,props){if($type(props.minLength))return(element.get('value').length>=$pick(props.minLength,0));else return true}}],['maxLength',{errorMsg:function(element,props){if($type(props.maxLength))return FormValidator.getMsg('maxLength').substitute({maxLength:props.maxLength,length:element.get('value').length});else return''},test:function(element,props){return(element.get('value').length<=$pick(props.maxLength,10000))}}],['validate-integer',{errorMsg:FormValidator.getMsg.pass('integer'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||/^-?[1-9]\d*$/.test(element.get('value'))}}],['validate-numeric',{errorMsg:FormValidator.getMsg.pass('numeric'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/.test(element.get('value'))}}],['validate-digits',{errorMsg:FormValidator.getMsg.pass('digits'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||(/^[\d() .:\-\+#]+$/.test(element.get('value')))}}],['validate-alpha',{errorMsg:FormValidator.getMsg.pass('alpha'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||/^[a-zA-Z]+$/.test(element.get('value'))}}],['validate-alphanum',{errorMsg:FormValidator.getMsg.pass('alphanum'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||!/\W/.test(element.get('value'))}}],['validate-date',{errorMsg:function(element,props){if(Date.parse){var format=props.dateFormat||"%x";return FormValidator.getMsg('dateSuchAs').substitute({date:new Date().format(format)})}else{return FormValidator.getMsg('dateInFormatMDY')}},test:function(element,props){if(FormValidator.getValidator('IsEmpty').test(element))return true;if(Date.parse){var format=props.dateFormat||"%x";var d=Date.parse(element.get('value'));var formatted=d.format(format);if(formatted!="invalid date")element.set('value',formatted);return!isNaN(d)}else{var regex=/^(\d{2})\/(\d{2})\/(\d{4})$/;if(!regex.test(element.get('value')))return false;var d=new Date(element.get('value').replace(regex,'$1/$2/$3'));return(parseInt(RegExp.$1,10)==(1+d.getMonth()))&&(parseInt(RegExp.$2,10)==d.getDate())&&(parseInt(RegExp.$3,10)==d.getFullYear())}}}],['validate-email',{errorMsg:FormValidator.getMsg.pass('email'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(element.get('value'))}}],['validate-url',{errorMsg:FormValidator.getMsg.pass('url'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(element.get('value'))}}],['validate-currency-dollar',{errorMsg:FormValidator.getMsg.pass('currencyDollar'),test:function(element){return FormValidator.getValidator('IsEmpty').test(element)||/^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(element.get('value'))}}],['validate-one-required',{errorMsg:FormValidator.getMsg.pass('oneRequired'),test:function(element){var p=element.parentNode;return p.getElements('input').some(function(el){if(['checkbox','radio'].contains(el.get('type')))return el.get('checked');return el.get('value')})}}]]);$extend(FormValidator.resources.enUS,{noSpace:'There can be no spaces in this input.',reqChkByNode:'No items are selected.',requiredChk:'This field is required.',reqChkByName:'Please select a {label}.',match:'This field needs to match the {matchName} field',startDate:'the start date',endDate:'the end date',currendDate:'the current date',afterDate:'The date should be the same or after {label}.',beforeDate:'The date should be the same or before {label}.',startMonth:'Please select a start month',sameMonth:'These two dates must be in the same month - you must change one or the other.'});FormValidator.addAllThese([['validate-enforce-oncheck',{test:function(element,props){if(element.checked){(props.toEnforce||$(props.enforceChildrenOf).getElements('input, select, textarea')).map(function(item){FV.enforceField(item)})}return true}}],['validate-ignore-oncheck',{test:function(element,props){if(element.checked){(props.toIgnore||$(props.ignoreChildrenOf).getElements('input, select, textarea')).each(function(item){FV.ignoreField(item);FV.resetField(item)})}return true}}],['validate-nospace',{errorMsg:function(){return FormValidator.getMsg('noSpace')},test:function(element,props){return!element.get('value').test(/\s/)}}],['validate-toggle-oncheck',{test:function(element,props){var parentForm=element.getParent('form').retrieve('validator');var eleArr=props.toToggle||$(props.toToggleChildrenOf).getElements('input, select, textarea');if(!element.checked){eleArr.each(function(item){parentForm.ignoreField(item);parentForm.resetField(item)})}else{eleArr.each(function(item){parentForm.enforceField(item)})}return true}}],['validate-reqchk-bynode',{errorMsg:function(){return FormValidator.getMsg('reqChkByNode')},test:function(element,props){return($(props.nodeId).getElements(props.selector||'input[type=checkbox], input[type=radio]')).some(function(item){return item.checked})}}],['validate-required-check',{errorMsg:function(element,props){return props.useTitle?element.get('title'):FormValidator.getMsg('requiredChk')},test:function(element,props){return!!element.checked}}],['validate-reqchk-byname',{errorMsg:function(element,props){return FormValidator.getMsg('reqChkByName').substitute({label:props.label||element.get('type')})},test:function(element,props){var grpName=props.groupName||element.get('name');var oneCheckedItem=$$(document.getElementsByName(grpName)).some(function(item,index){return item.checked});var fv=element.getParent('form').retrieve('validator');if(oneCheckedItem&&fv)fv.resetField(element);return oneCheckedItem}}],['validate-validate-match',{errorMsg:function(element,props){return FormValidator.getMsg('match').substitute({matchName:props.matchName||$(props.matchInput).get('name')})},test:function(element,props){var eleVal=element.get('value');var matchVal=$(props.matchInput)&&$(props.matchInput).get('value');return eleVal&&matchVal?eleVal==matchVal:true}}],['validate-after-date',{errorMsg:function(element,props){return FormValidator.getMsg('afterDate').substitute({label:props.afterLabel||(props.afterElement?FormValidator.getMsg('startDate'):FormValidator.getMsg('currentDate'))})},test:function(element,props){var start=$(props.afterElement)?Date.parse($(props.afterElement).get('value')):new Date();var end=Date.parse(element.get('value'));return end&&start?end>=start:true}}],['validate-before-date',{errorMsg:function(element,props){return FormValidator.getMsg('beforeDate').substitute({label:props.beforeLabel||(props.beforeElement?FormValidator.getMsg('endDate'):FormValidator.getMsg('currentDate'))})},test:function(element,props){var start=Date.parse(element.get('value'));var end=$(props.beforeElement)?Date.parse($(props.beforeElement).get('value')):new Date();return end&&start?end>=start:true}}],['validate-custom-required',{errorMsg:function(){return FormValidator.getMsg('required')},test:function(element,props){return element.get('value')!=props.emptyValue}}],['validate-same-month',{errorMsg:function(element,props){var startMo=$(props.sameMonthAs)&&$(props.sameMonthAs).get('value');var eleVal=element.get('value');if(eleVal!=''){if(!startMo){return FormValidator.getMsg('startMonth')}else{return FormValidator.getMsg('sameMonth')}}},test:function(element,props){var d1=Date.parse(element.get('value'));var d2=Date.parse($(props.sameMonthAs)&&$(props.sameMonthAs).get('value'));return d1&&d2?d1.format("%B")==d2.format("%B"):true}}]]);