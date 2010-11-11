<?php
#copyright S. Goodman (www.siteroller.net)
#Licensed under a modified OSI license.

$file = $_SERVER['PATH_INFO']; 
$doc = $_SERVER['DOCUMENT_ROOT'];
$fullfile = $_SERVER['PATH_TRANSLATED'];
//echo __file__; 
//echo $fullfile;
//echo $file;
//echo 'alive';

if($_GET['edit'] || $_GET['build'] || file_exists("$doc/siteroller/cache/flags/$file")){
	require "parse.php";
	handleIncludes($fullfile);
} else {
	if(file_exists("$doc/siteroller/cache/$file")) $fullfile = "$doc/siteroller/cache/$file";
	if(substr($file,-3) == 'php') include($fullfile); else echo file_get_contents($fullfile);//"$doc/$file"
}

function handleIncludes($content = 'index.html'){
	global $doc;	
	require 'classes.php';
	
	$Cdom = new DOMParser($content, array('request'=>'include')); 
	$includes = $Cdom->get('include', array('src', 'parts', 'id'));	
	
	session_start();  
	$_SESSION['cookie'];
	
	debug('in handleIncludes');
	while($includes){
		foreach($includes as $include){
			$Tdom = new DOMParser(pick($doc.$include['src'], 'parts.php'), array('request'=>'include'));
			if($include['parts']){
				foreach(explode(',',$include['parts']) as $part){
					$part = trim($part);
					$rp = $Tdom->get("#$part", 'outerHTML', 'string');
					$replaces = $replaces.$rp;
				}
				$Tdom = new DOMParser($replaces);
			}
			$cookie[$include['src']][pick($include['parts'], 'html')][] = '#'.$include['id'];	//adapt to allow for more than one instance calling the same parts.
			//debug($Cdom->get('include[src='.$include['src'].']>[id]'), 'include ids');
			foreach($Cdom->get('include[src='.$include['src'].']>[id]', 'id', 'array', 'outerHTML') as $el){
				//debug($el, 'el');
				$Tdom->set('#'.$el['id'], $el['content'], 'outerHTML');
				$cookie[$include['src']][pick($include['parts'], 'html')][] = '#'.$el['id'];
			}
			$Cdom->set('include[src='.$include['src'].']', $Tdom->set(), 'outerHTML', 'queue');
			if (++$catch > 500){ echo "your loopy - Infinite loop alert #1!"; break; }
		}
		$Cdom->set();
		$includes = $Cdom->get('include', array('src', 'parts'));
		if (++$catch > 500){ echo "You're loopy! - It is looping on line 54, as there is always another 'include tag'"; break; }
		//debug('in while');	
	}
	
	if($cookie) $_SESSION['cookie'] = $cookie;
	//else echo "no cookie here";
	 
	#$scripts =  array('php'=>'','css'=>'','head'=>'','foot'=>'');//debug($funcs['edit'], 'funcs[edit]');//debug($scripts, 'scripts, after first merge');
	#if($_GET['edit']) $scripts =array_merge_recursive($scripts, $funcs['edit']);
	
	$scripts = array();
	foreach ($_GET as $get=>$truth){ //flags should be merged into same array
		if($truth && $loc = $funcs[$get]['url']){ 
			$funcs[$get][$loc] = $funcs[$get]['js'];
			$scripts = array_merge_recursive($scripts, $funcs[$get]);
			$scriptname .= $get;
		}
	}
	foreach((array)$Cdom -> get('[class^~=sr_]', array('class', 'id')) as $el){
		$cs = explode('sr_', $el['class']);
		array_shift($cs);
		foreach($cs as $c){
			$c = array_shift(explode(' ', $c));
			if(!$funcs[$c]) $funcs[$c] = array('php'=>"$c/index.php",'css'=>"$c/styles.css",'head'=>"",'foot'=>array("$c/scripts.js","$c/$c.js"));
			$scripts = array_merge_recursive($scripts, $funcs[$c]);
			$scriptname .=$c;
		}; 
	}
	
	//debug($scripts, 'scripts');
	//debug($_GET, 'get');
#if(file_exists($doc."siteroller/cache/$type/$scriptname.$extension")){}else{
	unset($scripts['js'], $scripts['url']);
	foreach($scripts as $key=>$val) $scripts[$key]=array_unique((array)$val); //debug($scripts, 'scripts');
	foreach((array)array_shift($scripts) as $php) if($php)include $doc."siteroller/classes/$php";
	foreach($scripts as $type=>$script){
		$data = '';
		$extension = $type == 'head' || $type == 'foot' ? 'js' : $type;
		foreach($script as $add) $data .= file_get_contents($doc."siteroller/classes/$add");
		file_put_contents($doc."siteroller/cache/$type/$scriptname.$extension", $data);	
		//debug($type, '$type');//debug($script, '$script');//debug($data, '$data');	
	}
#}
	if(!$Cdom->get('head')); //add head if it doesn't exist;
	$Cdom->set('head', 'bottom', "
		<script type='text/javascript' src='siteroller/cache/head/$scriptname.js'></script>
		<link rel='stylesheet' type='text/css' href='siteroller/cache/css/$scriptname.css'/> 
	");
	//debug($Cdom->set('body', 'pickles'), 'body');
	$Cdom->set('body', 'bottom', "<div class='srRemove'><script type='text/javascript' src='siteroller/cache/foot/$scriptname.js'></script></div>");		
	
	//ob_start('ob_gzhandler');
	echo $Cdom->set(); 
	//ob_end_flush();
}




//debug( $session = array( $include['src'] => array( $include['parts'][] = array())));
//debug( $session = array( $include['src'] => array( $include['id'] => array( $include['parts']=> $part))));
//{'template.htm':{'i109287':{'footer':['testInclude']}}} //if we only allow a page to be included in its entirety once, we do not need the id.  May be even not, am trying it.
//debug($rp, "part: ".$part.++$somethin);
	//debug( $cookie);
		//debug($replaces, 'replace');
	//debug($_SESSION['cookie'], 'cook2');
		//debug("till here, all is dandy!");
				//debug($Tdom->set(), 'tdomSet');
			//echo "\ne1\n"; debug($include['src']);
		//debug($include, 'include');	//debug('e2');
	//if($script){
	//		$fo = fopen($doc."siteroller/cache/$fold/$scriptname.txt", 'w');
	//			foreach ($scripts[$fold] as $ea) fwrite($fo, file_get_contents($doc."siteroller/classes/$ea"));
	///		fclose($fo);
	//	}
		


/* Cache rules: 
	1. Build if build/edit var or build flag is set.
	2. Otherwise, if cached, give cached file.  If not, include php files, file_get_contents of static pages. 
	Include rules:
	1. Check if page includes include - requires loading pages, perhaps add check to parse.php.
	1. All includes are unfolded before dealing with other functions.
	2. Includes are "included", so all php is processed as they are being included.  code accordingly.
	3. All included parent tags should have "include:1" added to the tags. (So that page can be later edited in correct place)
	Function rules:
	1. If edit var is set, add sr_edit to footerscript array. 
	2. Check for sr_.  If not found, skip to step #5.
	3. Else, build appropriate indices. Than, for each - 
		a. Check function array for list of pages to include.  
		b. if not found, check for folder.  
		c. If found, include index.php, and add scripts.js and functionname.js to headscripts array.
	3. Add default functions: (edit, ?) to footscripts array.
	4. Check footscripts and headscripts for duplicates.
	5. Build headerscripts.js footerscript.js, put in matching cache location.
*/
/* ToDo:
	1. Set flag if edit is set to true.
	2. Remove flag upon building, unless appropriate variable is set.
	3. add built file to the cache
	4. Add check in parse.php to look skip all if no include or sr_ tags.
		a. Perhaps, adjust where the check for edit and where the inclusion of funcs.php &/or parse.php should be done
	5. Add head and relevant php if they do not exist
	6. Add compression (uncomment the lines).
*/
?>