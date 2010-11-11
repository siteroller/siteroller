<?php
/*

function createDatabase($db){ 
	try { $database = new SQLiteDatabase("../../databi/$db.sqlite", 0666, $error);
	} catch(Exception $e) { die("#1: $error"); }
	
	//add Users
	$query = "CREATE TABLE $db (user TEXT, pass TEXT);";         
	if(!$database->queryExec($query, $error)) die("2: $error");	
	return true;
}

function addUser($db, $user, $pass){
	try { $database = new SQLiteDatabase("../../databi/$db.sqlite", 0666, $error);
	} catch(Exception $e) { die("#1: $error"); }
	
	echo $query = 'INSERT INTO '.$db.' (user, pass) VALUES ('.$user.', '.$pass.');'; 
	if(!$database->queryExec($query, $error)) die($error); 
	return true;
}

function seeData($db){
	try { $database = new SQLiteDatabase("../../databi/$db.sqlite", 0666, $error);
	} catch(Exception $e) { die("#1: $error"); }
	
	$query = "SELECT * FROM $db";
	echo $query;
	if($result = $database->query($query, SQLITE_BOTH, $error)){echo '1';	while($row = $result->fetch()) var_dump($row); }
	else echo "no data";
	echo '2';
}


function checkUser($db, $user, $pass){
	$query = "SELECT * FROM $db";
	if($result = $database->query($query, SQLITE_BOTH, $error))
		while($row = $result->fetch())
			if ($user == $row['user'] && $pass == $row['pass']) $pass = true;
	echo $pass;
}

$db = "Admins";
#createDatabase("Admin");
echo addUser("Admin", 'jack', 'sprat');
seeData("Admin"); die;



#####################################################
$db = "whatever1";
try { $database = new SQLiteDatabase("../../databi/$db.sqlite", 0666, $error); }
catch (Exception $e) { die($error); }

$query = 'CREATE TABLE Movies (Title TEXT, Director TEXT, Year INTEGER)';
if(!$database->queryExec($query, $error)) die($error);

$query =
  'INSERT INTO Movies (Title, Director, Year) VALUES ("The Dark Knight", "Christopher Nolan", 2008); ' .
  'INSERT INTO Movies (Title, Director, Year) VALUES ("Cloverfield", "Matt Reeves", 2008); ' .
  'INSERT INTO Movies (Title, Director, YEAR) VALUES ("Beverly Hills Chihuahua", "Raja Gosnell", 2008)';
if(!$database->queryExec($query, $error)) die($error);

$query = "SELECT * FROM Movies";
if($result = $database->query($query, SQLITE_BOTH, $error))	while($row = $result->fetch()) var_dump($row);
else die($error);
*/


#####################################################
function db($db){
	try { $database = new SQLiteDatabase("../../databi/$db.sqlite", 0666, $error); }
	catch (Exception $e) { die($error); }
	return $database;
}
function createDB($db, $field1='user', $field2='pass'){
	$database = db($db);
	$query = "CREATE TABLE $db ($field1 TEXT, $field2 TEXT)";
	if(!$database->queryExec($query, $error)) die($error);
}

function insertData($db, $user, $pass){
	$database = db($db);
	$query = "INSERT INTO $db (user, pass) VALUES ('$user', '$pass')";
	if(!$database->queryExec($query, $error)) die($error);
}

function displayData($db, $user, $pass){
	$database = db($db);
	$query = "SELECT * FROM $db";
	if($result = $database->query($query, SQLITE_BOTH, $error))	while($row = $result->fetch()) var_dump($row);
	else die($error);
}

function checkUser($db, $user, $pass){
	$database = db($db);
	$q2 = "SELECT * FROM $db";
	$query = "SELECT * FROM $db WHERE user='$user' AND pass='$pass'";
	if($result = $database->query($query, SQLITE_BOTH, $error)){
		if($result->fetch()){
			session_start();
			$_SESSION['admin']=true; 
			echo 1;
		} else echo 0;
	} else die($error);
}

@mysql_real_escape_string($user = strtolower(stripslashes($_GET['user']))); 
@mysql_real_escape_string($pass = stripslashes($_GET['pass'])); 
#insertData('admin', 'marknchava', '212313');
checkUser("admin", $user, $pass);
#createDB("admin");
?>