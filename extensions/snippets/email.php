<?php
function clean($received){
	foreach (array('name','subject','email','body') as $v) $$v = $received[$v];
	if (!preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/is', $email)) return false;
	foreach (array($email, $name, $subject) as $str) if (preg_match('/(%0A|%0D|\\n+|\\r+)/i', $str)) return false;
	$injects = '/multipart\/mixed|(content-transfer-encoding|content-type|mime-version|bcc|cc|to):/is';    
	foreach (array($email, $name, $subject, $body) as $str) if (!$str || preg_match($injects, $str)) return false;
	return true;
}

function responder($fromAcct, $toAdmin, $received, $response){
	extract($received);
	$headers = "From:$fromAcct\r\nReply-To:$name <$email>";
	$success = mail($toAdmin, $subject, $body, $headers);
	if (!$success || !$responder) return $success;
	else mail("$name <$email>", $response['subject'], $response['body'], $response['from']);
	return $success;
}
?>