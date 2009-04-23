<?php

$funcs = array(
	'edit'		=> array(
		'php' => '',
		'css' => array('mochaui/css/uiModified.css', 'edit/edit.css'),
		'head'=> array('libs/moo.121.c.js', 'libs/moo.121.m.js'),
		'foot'=> array('edit/edit.js'),
		'js'  => array('mochaui/scripts/source/Core/Core.js', 'mochaui/scripts/source/Window/Window.js', 'mochaui/scripts/source/Window/Modal.js', 'mootextarea/mochaPopup.js'),//'edit/mochaPopup.js'
		'url' => 'foot'
		//, 'dependencies'=>array('mootools'),	'css2'=>array('mochaui/css/uiModified.css')
	),
	'forms'    => array('foot' => array('libs/moo.121.c.js', 'forms/forms.js', 'forms/scripts.js')),
	'mooinline'=> array('foot' => array('libs/moo.121.c.js', 'mooinline/mooinline.js', 'mooinline/scripts.js')),
	'MooEditor'=> array('js'=>'editor/editor.js', 'css2'=>'editor/styles.css'),
	'MooTextArea'=> array('js'=>'mootextarea/mootextarea.js', 'css2'=>'mootextarea/mootextarea.css'),
	'test' => array('js'=>'test/scripts.js', 'css2'=>'test/styles.css')
);