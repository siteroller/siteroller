<?php
//Copyright October 2008:  S. Goodman ishtov@yahoo.com
//Licensed under the Open Software License version 2.1
//Docs in attached MAN page
//Beta v0.17 (benchmark 0.0068)  Changes: fixed custom selectors, added some new css3 selectors,  

$starttimer = time()+microtime();
require "utils.php";
class DOMParser{

	private $htm = '';
	private $elements = array();	
	private $queue = array();	
	
	function __construct($htm, $opts=array()) {
		
		extract(array_merge(array('request' => false, 'advancedSelectors' => false, 'stripTags' => ''), $opts));
		//debug($htm, 'htm1');
		$ht = strtolower(substr($htm, 5));
		//debug ($htm, 'believe it or not, this is the htm');
		//if (strpos($htm,' ') === false)echo "no strpos!"; else echo "strpos welcome!";
		if(strpos($ht,'http')===0 || strpos($ht,'www')===0 || strpos($htm,' ') === false){
			if($request == 'curl'){$c = curl_init($htm); curl_exec($c); curl_close($c); 
			} elseif($request == 'include'){ ob_start(); include $htm; $this->htm = ob_get_clean(); 
			} else { $this->htm = file_get_contents($htm);  }	
		} else { /*debug($htm, "good");*/ $this -> htm = $htm; }
		//debug($this->htm, 'this->htm');
		$this->build();
	}
	
	function build(){
		//debug('building');
		$htm = $this->htm;
		$autoClose = array('base','meta','img','input','link','embed','br','hr','spacer');	//'simple_html_dom incorrectly includes 'nobr'.    
		$regex = "%<(?:!--.*?--|!DOCTYPE[^>]+|script.*?/script|\?.*?\?|(/)?(\w+)[^>]*)>%s";
        preg_match_all($regex, $htm, $match, PREG_OFFSET_CAPTURE);
        
		$this->elements = array();
		//debug($htm, 'htm');
		//debug(strlen  ($htm), 'count(htm)');
        $n = -1; $lineage = array('root'); $el['root'] = array(0,0,strlen($htm));
		for($i=0; $i<count($match[0]); $i++){
		    $tag = $match[0][$i][0]; $start = $match[0][$i][1]; $elType = $match[2][$i][0]; 
		    if (!$match[1][$i][0]){
				$num = 'e'.++$n; $dad = $lineage[count($lineage)-1];
				$el[$num][0] = $start;             							//outerBegin  
				$el[$num][1] = $start+strlen($tag);   						//innerBegin
				if($elType){ 												//not a comment.  create properties and types arrays. 
					$regex = '%([\w-]+)(?:\s*=\s*(?:\"([^\\\"]+(?:\\\.[^\\\"]*)*)\"|\'([^\\\']+(?:\\\.[^\\\']*)*)\'|([^\s\/>]+)))?%';
					preg_match_all($regex, $tag, $props, PREG_SET_ORDER);	//array of all properties as: [[div, div], [tag=val, tag, =, val]]
					$this->elements[2][strtolower($props[0][0])][]=$num;				//type
					for($j=1; $j<count($props); $j++) $prop[strtolower($props[$j][1])][$num] = pick($props[$j][2],$props[$j][3],$props[$j][4]); //properties
				} else $elements[2]['comments'][] = $num;					//type
				substr($tag, -2) == "/>" || !$elType || in_array($props[0][0], $autoClose)? $el[$num][3] = $el[$num][2] = $el[$num][1] 
					: $lineage[] = $final['elCount'][$elType][] = $num; 	//If self-closing or comment tag, add endtags.  Otherwise, add utility array to track parents and children.
				$el[$num][4]   = $dad;										//parent
				$el[$dad][5][] = $num;										//add to children list of parent			
			} else {
		        @$elNum = array_pop($final['elCount'][$elType]);
		        $el[$elNum][2] = $start;              						//innerEnd
		        $el[$elNum][3] = $start+strlen($tag); 						//outerEnd
		        erase($lineage, $elNum);
		    }
        }
		
		//$this->htm = $htm;
		$this->elements[0] = $el;
		$this->elements[1] = $prop;
        
        #debug($prop, 'el');
	}
   
	function search($input){
        $regex2="%([#.][^#.\s\[]+|\[[^\]]+\])|(\*|,\s*|[:]?[\w-]+)|(\s*[+>~<](?:\d[+-]?)?\s*|\s\s*)%";
		preg_match_all($regex2, trim($input), $matches, PREG_SET_ORDER);
		$properties = &$this->elements[1];
		$type = &$this->elements[2];
		$el = &$this->elements[0];
		$search=array();
		
		foreach($matches as $matche){
			$match = $matche[0];
			$atch = substr($match, 1);
			//debug($matches, 'matches');
			if($matche[1]){
				#debug($matche[1], 'matche[1]');
				switch($match[0]){
					case '#': $pair[1] = $atch; $tp = 'id'; $exact = true; break; 								//$pair = array('id', $atch); $tp = $pair[0]; $exact = true; break;
					case '.': $pair[1] = $atch; $tp = 'class'; $r1 ='(^|\s)'; $r2 = '(\s|$)'; break; 	//$pair = array('class', $atch); 	$tp = $pair[0]; $exact=false; break; 
					case '[': $pair = explode('=', preg_replace('%[]\'"]%','', $atch)); 
						$tp = trim($pair[0], "\x21\x24\x2A\x5e\x7c\x7e");
						if(trim($pair[0]) == $tp){ 
							$exact = true;
							if (!$pair[1]){
								if(!isset($temp)) $temp = array_keys($properties[$pair[0]]); 
								else foreach($temp as $key => $val) if(!isset($properties[$pair[0]][$val])) unset($temp[$key]); #get rid of the isset!
								continue 2;
							}
						} else {
							if(strpos($pair[0], '!')) $notTemp = $temp;
							if(!strpos($pair[0], '*')){
								if(strpos($pair[0], '~')){ $r1 ='(^|\s)'; $r2 = '(\s|$)'; }
								elseif(strpos($pair[0], '|')){ $r1 ='(^|\|)'; $r2 = '(\||$)'; }
								else{ $r1 ='^'; $r2 = '$'; } 
								if(strpos($pair[0], '$')) $r1='';
								elseif(strpos($pair[0], '^')) $r2='';
							}
						}
					break;
				}
				$reg = '%'.$r1.$pair[1].$r2.'%';
				if(!isset($temp)){
					#debug($tp, 'tp');
					#debug($properties[$tp], 'prop[tp]');
					#debug($properties, 'prop');
					$temp = $exact ? array_keys($properties[$tp], $pair[1]) 
					: array_keys(preg_grep($reg, $properties[$tp]));
				} else foreach($temp as $key => $val)
					if($exact ? ($properties[$tp][$val] != $pair[1]) : !preg_match($reg, $properties[$tp][$val])) unset($temp[$key]); //inneficient, as it checks if $exact is true for every step of the foreach.
				if($notTemp){ $temp = $temp - $notTemp; $notTemp = null; }
				$exact = false;
			} elseif($matche[2]){
				#debug($matche, 'matche2');
				#debug($match, 'match');
				switch($match[0]){
					case ',': $search = array_merge($search, $temp);  unset($temp); break;
					default : $temp = isset($temp) ? array_intersect($temp, $type[$match]) : $type[$match];  break;//continue 2;debug($temp, 'temp at end of default');
					case '*': if(isset($temp)) continue 1; else $temp = pick($el[$type['body'][0]][5], array('root')); break; //if there is no body, it should return all, which will be handled by flushing out root.
					case ':':
						$f = false; $n = 0;
						switch(substr($atch, 0, 7)){
							case 'root': $temp = $el['root'][5]; break;//continue 3; 
							case 'empty': foreach($temp as $key=>$val) if($el[$val][5]) unset($temp[$key]); break;
							case 'checked': $temp = array_intersect($temp, $type['checked']); break;
							case 'sort': $temp = sort($temp); break; //e11 will come after e1, until we fix the array to not have the e.
							case 'first-line': case 'first-letter': 
								foreach ($temp as $key=>$val)$temp2[]=substr($this->htm, $el[$val][1], 1); break; //Not supported, as it would return the letter instead of the element.  I dont think it is part of css3, only css2.				
							default:
								default: $temp = array(); break; //continue;
								case 'only-ch': case 'only-of': $o = true; break; //but continue evaling
								case 'nth-chi': case 'first-c': case 'nth-of-': $f = true;	break; //but continue evaling									//'only-child', 'only-of-type': break;
								case 'nth-chi': case 'nth-las': case 'nth-of-': $n = split($atch,'{[()]}'); $n = $n[1]; break;	//but continue evaling		//figure out n; - dont forget to resolve diffe btwn nth last child, and nth last of type!
								case 'nth-las': $atch = substr($atch, 10, 1); break; 											//To resolve clash of 'nth-last-of-type(n)'  && 'nth-last-child':
								case 'nth-chi': case 'first-c': case 'last-ch': case 'only-ch': $atch = 'c'; break; 							//child
								case 'nth-of-': case 'first-o': case 'last-of': case 'only-of': $atch = 't'; break; 
								
								$temp2 = array(); //new
								#debug('r u sure?');
								switch($atch){ 
									case 'c': foreach($temp as $val){ if(!($o && count($e = $el[$val][5])==1))$temp2[] = $e[$f ? $n : count($e)-$n]; } break;
									case 't': foreach($temp as $val){ 
										$typeHere = substr($this->htm, $el[$val][2]+1, strpos($this->htm, ' ', $el[$val][2])-$el[$val][2]);
										$temp3 = array_intersect($el[$val][5], $type[$typeHere]);
										if(!($o && count($temp3)==1)) $temp3=array();
										$temp2[] = $temp3[$n[1]];
									}
								}
								$temp = $temp2;
								#debug($temp, 'temp at end of match 2');
							break;
						}
					break;
				}
				#debug('finished the img if correctly');
			} elseif($matche[3]){
				#debug($matche, 'matche1');
				$preg = preg_split('%(\d+)%', trim($match), -1, PREG_SPLIT_DELIM_CAPTURE);
				$temp3 = array();
				if(!isset($temp))$temp = array(); // added this to stop error, am not following code at time.  will bite!!!!!!!!!!!!!
				$i = 0;
				do{
					$temp2 = array();
					//debug($match, 'debug temp, matche 3');
					foreach($temp as $val) switch($preg[0]){ 
						case '>': if($el[$val][5]) $temp2 = array_merge($temp2, $el[$val][5]); break; //debug($temp); debug($temp2, "temp2: (val = $val)".++$cont);
						case '<': if(!in_array($el[$val][4],$temp2))$temp2[] = $el[$val][4];  break;//debug($el['root'], 'root');
						case '+': $next = substr($val,1); if($el[$val][4] == $el['e'.++$next][4])$temp2[] = 'e'.$next; break;
						case '~': foreach($el[$el[$val][4]][5] as $sibling)if($el[$sibling][0] > $el[$val][0])$temp2[] = $sibling; break;
						default : $next = substr($val,1); while($el['e'.++$next][0] < $el[$val][2])$temp2[] = 'e'.$next; //correct this with next and key!!  $val = next($el);
					}
					$temp3 = $preg[2] == '-' ? array_merge($temp2, $temp3) : $temp2;
					$temp = $temp2;
				} while(++$i<$preg[1]);
				$temp = $temp3;
				#debug($temp, 'temp at end of match 3');
			} //debug($tp, 'The end of the if (Beware the Jabberwock, my son)');
		}
		//debug($temp, 'temp');
		if(!isset($temp))$temp = array();
		$search = array_merge($search, $temp);
		return $search;
    }
	
	function get(){
		$args = array('', 'innerhtml', 'innertext', 'outerhtml', 'tags', 'close', 'run', 'array', 'string', 'auto', 'properties', 'styles');
		foreach(func_get_args() as $arg){
			#debug($arg, 'arg');
			//debug(array_search(strtolower($arg), $args), argument);
			
			$A = is_array($arg) ? 'properties' : 
				(($S = array_search(strtolower($arg), $args)) ? ($S < 4 ? 'target':($S < 7 ? 'action':'response')) : ($css ? 'properties':'css')); //$css || ($S = array_search(strtolower($arg), $args)) ? ($S < 4 ? 'target':($S < 7 ? 'action':'response')) : (is_array($arg) ? 'properties':'css');//$css || 
			#debug($A, 'a');
			$$A = $arg; 
		}
		#debug($css, 'css');
		#debug($target, 'target');
		#debug($action, 'action');
		#debug($properties, 'properties');
		#debug($response, 'response');
		
		$css = $this->search($css);
		if (!count($css)) return false;
		$htm = &$this -> htm;
		$els = &$this->elements[0];
		$i=-1; $htmLength = count($htm);
		
		foreach ($css as $s){
			switch(strtolower($target)):
				case 'outerhtml': $html = substr($htm, $els[$s][0], pick($els[$s][3],$htmLength)-$els[$s][0]); break; 
				case 'tags'		: $html = substr($htm, $els[$s][0], $els[$s][1]-$els[$s][0]); break;
				default 		: $html = substr($htm, $els[$s][1], pick($els[$s][2],$htmLength)-$els[$s][1]); if($arg=='innertext') $html = strip_tags($html); break;
			endswitch; 
			if($properties){
				#debug($properties, 'properties');
				$h[++$i]['content'] = $html;
				foreach ((array)$properties as $p){
					//$p = trim($p);
					$h[$i][$p] = $this->elements[1][$p][$s];
				}
			} else $response == 'string' ? $h.=$html : $h[]=$html;
		}
		return $h;
	}
	
	function set(){
		$args = array('', 'innerhtml', 'outerhtml', 'top', 'bottom', 'after', 'before', 'tag', 'properties', 'styles', 'rebuild', 'queue', 'run', 'close');
		foreach(func_get_args() as $arg) 
			!($target && $action) && ($S = array_search(strtolower($arg), $args)) ? ($S > 9 ? $action = $arg : $target = $arg) : ($css ? $html = $arg : $css = $arg);
		if($css){
			$css = $this->search($css);
			#debug(count($css), 'countcss');
			if (!count($css)) return $this->htm;
			$els = &$this->elements[0];
			switch(strtolower(substr($target,0,2))){
				case 'pr': case 'st':
				case 'ta': $k1=0;$k2=1; break;
				case 'be': $k1= $k2 =0; break;
				case 'to': $k1= $k2 =1; break;
				case 'bo': $k1= $k2 =2; break;
				case 'af': $k1= $k2 =3; break;
				case 'ou': $k1=0;$k2=3; break;
				default  : $k1=1;$k2=2; break;
			}
			$v =-1;
			foreach($css as $val){
				#debug($css, 'css');
				if (!is_array($html)) $h = $html;
				elseif(isset($html[0])) $h = $html[++$v];
				else{
					$tag = substr($this->h, $els[$val][$k0], $els[$val][$k1]); //e1, e2 == <tag  ><tag>
					if($target == "properties") foreach($html as $key=>$val) $tag = preg_replace('%'.$key.'\s*=\s*[\'\"]?'.$val.'[\'\"]?%','$key="$val"' ,$tag);
				}
				$this->queue[$els[$val][$k1]] = array($h, $els[$val][$k2]);
			}
		}
		if($action == 'queue') return true;
		
		ksort($this->queue);
		foreach($this->queue as $start => $q){
			$htm .= substr($this->htm, $orig, $start - $orig).$q[0];
			$orig = $q[1];
		}
		$htm .= substr($this->htm, $orig);
		$this->htm = $htm;
		$this->queue=array();
		//debug($this->htm, 'this-htm');
		switch ($action){
			case 'run'  : break;
			case 'close': unset($this); break; 
			default     : $this -> build(); break;  //debug('action:rebuild');
		}
	
		return $htm;
	}
	
	function getHTM(){ return $this->htm; }
	function close($opts){
		return $this->replace(array_merge(array('action'=>'close'), $opts));
	}
}

##########------------------ General Utility Functions ------------------------###########
# For This page: Erase, pick, debug;
function template($template){
	$tmpl = new DOMRoller($template);
	echo $tmpl->merge(basename($_SERVER['PHP_SELF']));
	die;
}

##########------------------ Extended CMS Functions ------------------------###########
class DOMRoller extends DOMParser {

    function merge($content, $opts=array()){
		//debug($this->htm, 'this.htm in merge');
		//debug($content, 'content in merge');
		if(!$content) return false; //If there is an empty div, it will empty.
		//echo "\nabout to rebuild within merge\n";
		$cont = new DOMParser($content, $opts);
		//return $cont->get('#e2');
		//$mike = $cont->get('[id]');
		foreach($cont->get(":root['id']", array_merge(array('properties'=>'id'), $opts)) as $item) //var_dump("dumpgrounds");
			$this->set('#'.$item['id'], $item['content'], 'queue'); //will not handle inner / outer div selection
		return $this->set('run');//$opts['action']
	}
	
	function template($content, $src){
		$cont = new DOMParser($content, $opts);
		foreach($cont->get("include[src='$src']>div[id]", array('properties'=>'id', 'action'=>'run')) as $item)
			$this->set('#'.$item['id'], $item['content'], 'queue');
		return $this->set();
	}
	function repeat(){}
}

#echo 1;
#$dom = new DOMParser("http://www.zeldman.com");
//$dom = new DOMParser("loremipsum.htm");
//debug($dom->get("span", array('id'), 'outerhtml'));
#echo 2;

/*


							
		'nth-of-type(n)', 'first-of-type', 'last-of-type', 
		'nth-of-', 'first-o', 'last-of', 'nth-las';
		: $atch = 'nth-child';   $n = 0; $r=false; break;
		case 'last-child'   : $atch = 'nth-child';   $n = 0; $r=true;  break;
		case 'first-child': case 'nth-child'	: $atch = 'nth-child'; $n = 0; $r=true;  break;
		case 'nth-last-child':$atch = 'nth-child';   $n = 0; $r=false; break;	$n = split($atch,'{[()]}'); foreach($temp as $val) $temp2[]=$el[$val][5][count($el[$val][5])-$n[0]]; $temp = $temp2; break; //new
		case 'first-of-type': $atch = 'nth-of-type'; $n = 0; $r=false; break;
		case 'last-of-type' : $atch = 'nth-of-type'; $n = 0; $r=true;  break;
	}
	switch($atch){
		
	
	}

switch($atch){
	case 'first-child': $temp2=array(); foreach($temp as $val) $temp2[] = $el[$val][5][0]; $temp = $temp2; break;//debug($temp, 'temp'); debug($val, 'val'); debug($temp2, 'temp2'); 
	case 'last-child':  $temp2=array(); foreach($temp as $val) $temp2[] = $el[$val][5][count($el[$val][5])]; $temp = $temp2; break;//debug($temp, 'temp') ; debug($val, 'val'); debug($temp2, 'temp2'); new
	case 'nth-child(n)': 		$n = split($atch,'{[()]}'); foreach($temp as $val) $temp2[]=$el[$val][5][$n[1]]; $temp = $temp2; break; //new
	case 'nth-last-child(n)': 	$n = split($atch,'{[()]}'); foreach($temp as $val) $temp2[]=$el[$val][5][count($el[$val][5])-$n[0]]; $temp = $temp2; break; //new
	case 'nth-of-type(n)': 		$n = split($atch,'{[()]}'); foreach($temp as $val){ 
			$typeHere = substr($this->htm, $el[$val][2]+1, strpos($this->htm, ' ', $el[$val][2])-$el[$val][2]);
			$temp3 = array_intersect($el[$val][5], $type[$typeHere]);
			$temp2[] = $temp3[$n[1]]; 
		} $temp = $temp2; break; //new  - get type, merge array of its children with said type, get last one.
	case 'nth-last-of-type(n)': $n = split($atch,'{[()]}'); foreach($temp as $val){ 
			$typeHere = substr($this->htm, $el[$val][2]+1, strpos($this->htm, ' ', $el[$val][2])-$el[$val][2]);
			$temp3 = array_intersect($el[$val][5], $type[$typeHere]);
			$temp2[] = $temp3[count($temp3) - $n[1]]; 
		} $temp = $temp2; break; //new  - get type, merge array of its children with said type, get last one.
	default: $temp = array();
}

switch(substr($content,0,1)){
	case 'o': $html = substr($htm, $els[$s][0], pick($els[$s][3],$htmLength)-$els[$s][0]); break; 
	case 'i': $html = substr($htm, $els[$s][1], pick($els[$s][2],$htmLength)-$els[$s][1]); if(strtolower($content)=='innertext') $html = strip_tags($html); break;
	case 't': $html = substr($htm, $els[$s][0], $els[$s][1]-$els[$s][0]); break;
}
$css, $opts = array()

	
		foreach(func_get_args() as $arg) {
			$S = array_search($arg = strtolower($arg), $args);
			$A = 
			if($S < 5) 	
			elseif ($S < 7)
		}
		
		extract(array_merge(array('response' =>'auto', 'content'=>'innerHTML', 'action'=>'run', 'properties'=>false, 'bereft'=>false), $opts));
		if($properties)$properties = explode(',', $properties);
*/
?>