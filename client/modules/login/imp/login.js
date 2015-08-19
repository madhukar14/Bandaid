define(['utility','jquery','backbone','underscore'],function(){

$(document).ready(function start(){	
	$('.upload-profile').on("submit",upload_profile);
});

function upload_profile(event){
	event.stopPropagation(); 
    event.preventDefault();
	data = {name: "madhukar", sec: "C", subject: "DB"};
	var template = _.template(_u.get("/bandaid/client/modules/templates/simple.html"));
	$('body').append(template(data));	
	var data = new FormData();
	var files = this[0].files;
	for(var i=0; i<files.length; i++){
		if(!files[i].type.match('image.*')){
			alert("upload only image files");
			return;
		}	
	}
	$.ajax({
		url: "/bandaid/server/Upload.php", // Url to which the request is send
		type: "POST",             // Type of request to be send, called as method
		data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
		contentType: false,       // The content type used when sending data to the server.
		cache: false,             // To unable request pages to be cached
		processData:false,        // To send DOMDocument or non processed data file it is set to false
		success: function(data)   // A function to be called if request succeeds
		{
			$('img').attr("src","/bandaid/server/" + data);
		}
	});
}

function uploadSuccess(){
	alert("done");
}

});