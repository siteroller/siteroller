<?php

function erase(&$array, $val, $reorder = true){
    $key = array_search($val,$array,true);
    if($key === false) return false;
    unset($array[$key]);
    if($reorder) $array = array_values($array);
    return true;
}
function pick(){ 
    foreach (func_get_args() as $arg) if ($arg) return $arg; return false; 
}
function debug($bug,$head=null){
	echo "--------$head--------\n";
	var_dump($bug);
	echo "-------------------\n";
}
function relation($to, $from=''){
	if(!$from) $from = getenv("SCRIPT_NAME");
	while($to[++$i] == $from[$i]);
	return str_repeat('../', count(explode('/', substr($from,$i)))-1).substr($to, $i);
}


###------------------------- Test functions ---------------------###
function testCallee(){
	debug(basename(__file__), 'basename(__file__)');
	debug($_SERVER['PHP_SELF'], '$_SERVER[PHP_SELF]');
	debug(getenv("SCRIPT_NAME"), 'getenv(SCRIPT_NAME)');
	debug(basename($_SERVER['PHP_SELF']), 'basename[PHP_SELF]');
}
?>