<?php
error_reporting(E_ALL & ~E_NOTICE);
session_start();
if(isset($_SESSION["id"])){
	include 'DB.php';
	$db = new DB();
	$db->setUserName($_SESSION["id"]);
	$ud = $db->getUserDetails();
	
	if(array_key_exists('data', $_GET)){
		$data = $_GET["data"];
	}else{
		$data = null;
	}
	
	$retDataStr = $db->get($_GET["func"],$data);
	$retData = json_decode($retDataStr,true);
	$retData["userDetails"] = $ud;
	echo json_encode($retData);
}else{
	$resp["rText"] = "session invalid";
	$resp["rCode"] = "-1";
	echo json_encode($resp);
}



