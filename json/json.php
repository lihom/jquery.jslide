<?php

// get file name
function get_file_name($dir, $format) {
	$filenames = array();
	$lower = glob($dir.'/*.'.$format);
	$upper = glob($dir.'/*.'.strtoupper($format));
	$result = array_merge($lower, $upper);
	if ($result != FALSE) {
		foreach ($result as $k=>$v) {
			$filenames[] = (string)basename($v);
		}
		return $filenames;
	} else {
		return NULL;
	}
}

$folder = isset($_GET['f']) ? $_GET['f'] : 'img';

$files = get_file_name($folder, 'jpg');

$datas = array();

foreach ($files as $k=>$v) {
	$datas[$k]['url'] = 'json/' . $folder . '/' . $v;
	$datas[$k]['caption'] = 'Image ' . sprintf("%02d", $k + 1);
	$datas[$k]['desc'] = 'filename: ' . $v;
}

echo json_encode($datas);

header('Content-Type: application/json; charset=utf-8');

?>