 <?php //edited
$root = $_SERVER['DOCUMENT_ROOT'];
$cache = 'siteroller/cache/';
include 'classes.php'; 
if($compress = false) include 'jsPacker.php';

$scriptname = $_POST['assets'];


foreach(array('js'=>'js', 'css2'=>'css') as $folder=>$extension){
	$script = array();
	foreach(explode('_', $_POST['assets']) as $asset) $script = array_merge($script, (array)$funcs[$asset][$folder]);
	array_unique($script);
	
	$file = "$cache$folder/$scriptname.$extension";
	$ff = $root.$file;
	if($script ){//&& !file_exists($ff)
		$data = '';
		$paths .= ($paths ? '|' : '')."$extension!/$file";
		//var_dump($paths);
		foreach($script as $add) $data .= file_get_contents($root."siteroller/classes/$add");
		//var_dump($paths); 
		if($compress){
			$packer = new JavaScriptPacker($code, 'Normal', true, false);
			$pack = $packer->pack();
			file_put_contents($ff, $pack);
		} else file_put_contents($ff, $data);	
	}
	
}
echo $paths;
//array_splice($array1,count($array1),0,array2); is allegedly much quicker than array merge, and is the same.  array_splice($array1,0,0,array2); is twice as fast, but revrses the order.
	
?>