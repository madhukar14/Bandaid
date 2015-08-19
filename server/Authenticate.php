<?php
if(isset($_SESSION["id"])){
	session_destroy();
}
include 'DB.php';
$data = $_POST["data"];
$method = $_POST["func"];
$db = new DB();
$result = $db->get($method,$data);
$data = json_decode($result,true);
if($data["rCode"] == 0){
	session_start();
	$_SESSION["id"] = $_POST["data"]["uname"];
}
echo json_encode($data);
?>