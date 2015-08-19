<?php
	$sourcePath = $_FILES['file']['tmp_name']; 
	$targetPath = "band-pics/".$_FILES['file']['name'];
	move_uploaded_file($sourcePath,$targetPath) ;
?>