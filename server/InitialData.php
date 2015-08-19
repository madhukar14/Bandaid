<?php
	include 'DB.php';
	$db = new DB();
	$result = $db->get("get_all_band_music",null);
	echo $result;
?>