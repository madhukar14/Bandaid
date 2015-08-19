<?php
	$sourcePath = $_FILES['file']['tmp_name']; 
	$targetPath = "profile-pics/".$_FILES['file']['name'];
	move_uploaded_file($sourcePath,$targetPath) ;
?>