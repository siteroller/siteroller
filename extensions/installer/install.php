<?php

if($_GET['install']){

	#1 Setup global variables:
	$dbhost = $dbname = $dbuser = $dbpass = $db = '';
	if(extract($_POST, EXTR_IF_EXISTS, EXTR_PREFIX_ALL, "e_") != 4) die("oops");
	//list($dbhost = $dbname = $dbuser = $dbpass) = array($_POST['dbhost'],$_POST['dbname'],$_POST['dbuser'],$_POST['dbpass']);
	die("step 1 complete with no errors: $dbhost = $dbname = $dbuser = $dbpass = $db");
	
	#2 Write user name and password to config file.
	$file = fopen(CL_ROOT . "/config/" . CL_CONFIG . "/config.php", "w+");
	$put  = fwrite($file, "<?php \$dbhost = '$dbhost';\n\$db_name = '$db_name';\n\$db_user = '$db_user';\n\$db_pass = '$db_pass';\n?>");
	if ($put) @chmod(CL_ROOT . "/config/" . CL_CONFIG . "/config.php", 0755);


	#3 Setup htaccess to send all pages through our parser.
	$rewrite = "<FilesMatch '*'>
	php_value auto_prepend_file ".$_GET['home']."/core/index.php
	</FilesMatch>";

	file_put_contents($_GET['dirs'].".htaccess",$rewrite,FILE_APPEND);

	#4 Setup Database:
	$query = "
		CREATE TABLE `pages` (
			`index` int(10) NOT NULL auto_increment,
			`name`  varchar(255) NOT NULL default '',
			`path`  varchar(255) NOT NULL default '',
			`group` varchar(255) NOT NULL default '',
			PRIMARY KEY  (`ID`),
			KEY `name` (`name`)
		)TYPE=MyISAM,
		CREATE TABLE `data` (
				`index` int(10) NOT NULL auto_increment,
				`page` varchar(255) NOT NULL default '',
				`data` varchar(255) NOT NULL default '',
			PRIMARY KEY  (`ID`),
			KEY `name` (`name`)
		) TYPE=MyISAM";

	if($e_db == 'mysql'){
		 
		// Connect to MySQL.
		$link = mysql_connect($dbhost, $dbuser, $dbpass) or die(mysql_error());
		if (!$link) return print "oops.2";
		else mysql_select_db($dbname) or die( mysql_error() );
		
		//Create MySQL Tables
		mysql_query($query);
		mysql_close($link);

	} else {
		//create or open the database
		try {	
			$database = new SQLiteDatabase('myDatabase.sqlite', 0666, $error);
		} catch(Exception $e) { 
			$nolite
		} 
		if(!$database->queryExec($query, $error)) die($error);	
	}

	if(!$nolite) //Use flat files globally!

}

//Tell apache to send all pages to our parser, without caring where it really is.  

/*
Options +FollowSymLinks
Options +Indexes
RewriteEngine On
RewriteBase /
rewriteCond $1 !srhandle\.php$ 
RewriteRule (.*)  siteroller/core/srhandle.php?SRPage=$1
*/
//Define the root of the document.
//$root = $document['root'];
//Add to include path, 
//include_path=".:/php/includes"






?>
<!doctype html>
<head>
	<title></title>
	<script type="text/javascript" src=""></script>
	<link rel="stylesheet" href="" /></head>
</head>
<body>
	<div class="login">
		<div class="login-in">
			<div class="logo-name">
				<h1><a href = "http://collabtive.o-dyn.de/"><img src="./templates/frost/images/logo-a.png" alt="AffineLogix" /></a></h1>
				<h2>Content Management System </h2>
			</div>

			Welcome to the installer.
			<form>
			<fieldset>
				
				<div class="row">
					<label for="user" class="user">User Name</label>
					<input type="text" name="user">
				</div>
				
				<div class="row">		
					<label for="pass" class="pass">Password</label>
					<input type="password" name="pass">
				</div>
				
				<div class="row">		
					<label for="db" class="db">Database</label>
						<input type="checkbox" name="db" value="mysql" > Mysql?
						<input type="text" name="dbhost">
						<input type="text" name="dbname">
						<input type="text" name="dbuser">
						<input type="text" name="dbpass">
				</div>
				
				<div class="row">		
					<label for="dirs">What directories should this affect? </label>
					<input type="text" name="dirs" value="<?=$root?>">
				</div>
				
				<div class="row">		
					<label for="home" id="home">Install Directory:</label>
					<input type="text" name="home" value="/siteroller">
				</div>
				
				<div class="row">
					<button type="submit" class="loginbutn" title="Login" onfocus="this.blur();">Login</button>
				</div>
	
			</fieldset>
			</form>
		</div>
	</div>


</body>
</html>
<?php

#5 Begin downloading actual siteroller class.
file_put_contents("/siteroller/siteroller.zip","http://siteroller.net/installer/siteroller.1a"); 

#6 Check if file has finished downloading. If not, wait till it is ready.
while(++$enough < 50 && $md = (md5_file("/siteroller/siteroller.zip") != 'abcdefghijklmnop')) sleep(10);
if (!$md) echo "seems to be having a trouble copying the source files.  Please try again later.";

#7 Unzip files to chosen directory.
elseif ($dirs = $_GET['dirs']){
	$zip = new ZipArchive;
	if ($zip->open(’my_zip_file.zip’) === TRUE) {
		$zip->extractTo($dirs);
		$zip->close();
		echo 'ok';
	} else echo 'failed';
} 

?>