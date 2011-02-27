<?php
function clean($received){
	//var_dump($received);
	foreach (array('name','subject','email','body') as $v) $$v = $received[$v];
	if (!preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/is', $email)) return 'Please use a standard email address.';
	foreach (array($email, $name, $subject) as $str) if (preg_match('/(%0A|%0D|\\n+|\\r+)/i', $str)) return 'Multi-line fields are not supported.';
	$injects = '/multipart\/mixed|(content-transfer-encoding|content-type|mime-version|bcc|cc|to):/is';    
	foreach (array($email, $name, $subject, $body) as $str) if (!$str || preg_match($injects, $str)) return 'Copies may not be sent via this form.';
}

function responder($fromAcct, $toAdmin, $received, $response){
	extract($received);
	$headers = "From:$fromAcct\r\nReply-To:$name <$email>";
	$success = mail($toAdmin, $subject, $body, $headers);
	if (!$success || !$response) return $success;
	else mail("$name <$email>", $response['subject'], $response['body'], $response['from']);
	return $success;
}
?>