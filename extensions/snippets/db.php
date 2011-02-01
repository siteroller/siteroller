<?php

# Does NOT sanitize keys, so be careful when keys are used in a query.
function sanitize($vals, $html=true){
	$val = '';
	if(!$vals = (array)$vals) return false;
	foreach ($vals as &$val){
		if ($html) $val = htmlentities($val,ENT_NOQUOTES,'UTF-8',false);
		if (is_array($val))
			foreach ($val as &$v) $v = sanitize($v);
		elseif (@mysql_ping()){
			if (get_magic_quotes_gpc()) $val = stripslashes($val);
			$val = mysql_real_escape_string(trim($val));
		} elseif (!get_magic_quotes_gpc()) $val = addslashes(trim($val));
	}
	return count($vals) > 1 ? $vals : $val;
}

function filter($array, $accept, $global = false, $sanitize = false){
	$accepted = array();
	if (!is_array($accept)) $accept = explode(',',$accept);
	foreach($accept as $v){
		if ($array[$v]){
			if ($global) global $$v;
			$$v = $accepted[$v] = $sanitize ? sanitize($array[$v]) : $array[$v];
		}
	}
	return $accepted;
}

$debug = false;
function errHandler($err, $errno, $query, $mail=false){
	global $debug;

	$message  = '<b>MySQL error:</b><br>' . $err . '<br><br>'
			   .'<b>Whole query:</b><br>' . $query . '<br><br>';
	//if ($mail) echo 'mail not set up correctly';
	if ($debug) die ($message);
	return array('err',$errno,$err);
}

function query($sql, $flat = 0, $conn='', $array=1){
	$query = mysql_query($sql);
	if (!$query) return errHandler(mysql_error(),mysql_errno(),$sql);
	if (!$array || is_bool($query)) return $query;

	$results = array();
	while ($result = mysql_fetch_assoc($query)) $results[] = $result;
	if ($results && ($flat == 1 || ($flat && count($results) == 1))) $results = array_shift($results);
	return $results;
}

function connect($file){
	require dirname(__FILE__).'/../../../vars/'.$file;
	//require __DIR__.'/../../../vars/'.$file - > php5.3;
	$link = mysql_connect("localhost", $myUser, $myPass);
	if (!$link) $link = errHandler(mysql_error(),mysql_errno(),$sql,1);
	if (!mysql_select_db($database)) $link = errHandler(mysql_error(),mysql_errno(),$sql,1);
	return $link;
}

?>