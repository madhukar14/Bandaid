define(['jquery','jquery-ui','backbone','underscore','utility'],function(){
	$(document).ready(function(){
		_ = _;
		_u = _u;
		var profile = new Profile();
		profile.init();
	});	
});

Profile = function(){
	this.sendData = {};	
	this.sendData.gender = "";
};

/*Profile.prototype.fetchData= function(){
	
};*/

Profile.prototype.initialDataAvailable = function(data){
	this.bandList = data.data.band;
	this.musicList = data.data.music;
};

Profile.prototype.getMusicMenuTemplate = function(){
	var ret ='<div class="music-info-header"></div>\
			 <div class="music-holder">'
	data = this.musicList;
		/*data = [{music_id:"m1",category: "jazz", sub_category: [{name:"cool-jazz"},{name: "b-jazz"},{name: "c-jazz"}]},
		{music_id:"m2", category: "rock", subcategory: [{name:"cool-rock"},{name: "b-rock"},{name: "c-rock"}]}];*/	
	for(var i = 0; i< data.length; i++)	{
		
			ret = ret + '<input type = "checkbox" value ="'+ data[i].music_id  +'">'+data[i].category +"  "+ data[i].sub_category+'</input><br>';		
	}
	ret = ret + '</div>'
	ret = ret + '<input class="sign-up-but-back-music-next" type="button" value="Done"></input>'
	
	this.dialog = _u.getDialog({height: 400, width: 300, modal: true});
	this.dialog.addContent(ret);
	this.dialog.show();
	this.dialog.setTitle("Select Music");
	$('.sign-up-but-back-music-next').click($.proxy(this.musicSubmit,this));
	//console.log(ret);
	return ret;
	
};


Profile.prototype.musicSubmit = function(event){
if($(event.currentTarget).hasClass('sign-up-but-back-music-next')){
		var data = $('input[type="checkbox"]:checked');
		this.sendData.band_music = [];
		for(var i=0; i< data.length; i++){
			this.sendData.band_music.push(data[i].value);
		}
	}
	this.dialog.close();
}




Profile.prototype.fetchData = function(){	
	/*var data = {};
	data.data = {};
	data.data.fname = "Madhukar";
	data.data.lname = "samak";
	data.data.email = "abc.com";
	data.data.phone = "9292929292";
	data.data.dob = "14/01/1990";
	data.data.city = "abc";
	data.data.gender = "male";
	data.data.street = "abc";
	data.data.state = "abc";
	data.data.zipcode = "abc";
	data.data.country = "Aruba";
	data.data.url = "madhukar.jpg";
	data.data.pic_url   = "queries-2.jpg"
	data.data.isArtist = true;*/
	$.get(SERVER+"/DBAjaxReq.php",{func:"return_profile_data"},$.proxy(this.profileDataObtained,this),type="json");
	$.post(SERVER+"/InitialData.php",{},$.proxy(this.initialDataAvailable,this),type="json");
	
};

Profile.prototype.profileDataObtained = function(data){
	if(data.rCode == 0){
		this.inputData = data;
		this.userDetails = data.userDetails;
		if($('.header-welcome-user').parent().length != 0){
			$('.header-welcome-user').html("Welcome "+this.userDetails.fname+" "+this.userDetails.lname);
		}
		if($('.header-photo img').parent().length != 0){
			$('.header-photo img').attr("src",PROFILE_PICS+"/"+this.userDetails.url);
		}
		this.initialData(data);
	}else if(data.rCode == -1){
		window.location.href = MODULES+"/login/login.html";
	}else{
		alert("some error occured");
		return;
	}
}

Profile.prototype.init = function(){
	/*var attrs = window.location.href.split("?");
	var attrArray = attrs[1].split("&");
	var uname = attrArray[0].split("=")[1];
	this.sendData.uname = uname;*/
	this.addHeader();
	this.addCountryDD();
	$('.upload-profile').on("submit",$.proxy(this.uploadProfile,this));
	$('.save-details').click($.proxy(this.saveDetails,this));
	$('.music input').click($.proxy(this.getMusicMenuTemplate,this));
	this.fetchData();
};

Profile.prototype.initialData = function(data){
	$('img:not(.band-picture)').attr("src",PROFILE_PICS+"/"+data.data.url);
	$('.fname input').val(data.data.fname);
	$('.lname input').val(data.data.lname);
	//$('.email input').val(data.data.email);
	$('.phone input').val(data.data.phone);
	$('.dob input').val(data.data.dob);	
	$('.city').val(data.data.city);
	$('.street').val(data.data.street);
	$('.state').val(data.data.state);
	$('.zip-code').val(data.data.zipcode);
	$('.country').val(data.data.country);
	//$('input:radio[name=gender]').val(data.data.gender);
	 $('input[name="gender"][value="'+data.data.gender+'"]').prop('checked', true);
	 if(data.data.isArtist){	 
		$('.profile-band-pic').removeClass("invisible");
		$('.band-picture').attr("src",BAND_PICS+"/"+data.data.pic_url);
		$('.upload-band-pic').on("submit",$.proxy(this.uploadBandPic,this));
	 }
	
};

Profile.prototype.addCountryDD = function(){
	var countries = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', '$_[', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];
	var data = {countries: countries};
	var str = '<%for(var i=0; i<countries.length; i++){%>\
					<option value="<%=countries[i]%>"><%=countries[i]%></option>\
					<%}%>';
	var template = _.template(str);
	console.log(template(data));
	$('.address select').html(template(data));
};

Profile.prototype.addHeader = function(){	
	var data = {followers: 30, image : "abc.jpg"};
	var header = _u.getTmpl("header");
	var headerTemplate = _.template(header.tmpl);
	$('.profile-header').append(headerTemplate(data));		
	header.attachEventHandlers();
}



Profile.prototype.uploadProfile = function(event){

	event.stopPropagation(); 
    event.preventDefault();
	var data = new FormData();
	var files = event.currentTarget[0].files;
	for(var i=0; i<files.length; i++){
		if(!files[i].type.match('image.*')){
			alert("upload only image files");
			return;
		}	
	}
	this.imageName = files[0].name;
	$.ajax({
		url: SERVER + "/Upload.php", // Url to which the request is send
		type: "POST",             // Type of request to be send, called as method
		data:  new FormData(event.currentTarget), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
		contentType: false,       // The content type used when sending data to the server.
		cache: false,             // To unable request pages to be cached
		processData:false,        // To send DOMDocument or non processed data file it is set to false
		success: $.proxy(this.imageUploaded,this)
	});
};

Profile.prototype.imageUploaded = function(){
	$('img:not(.band-picture)').attr("src",PROFILE_PICS+"/"+this.imageName);
	this.inputData.data.url = this.imageName
}

Profile.prototype.uploadBandPic = function(event){

	event.stopPropagation(); 
    event.preventDefault();
	var data = new FormData();
	var files = event.currentTarget[0].files;
	for(var i=0; i<files.length; i++){
		if(!files[i].type.match('image.*')){
			alert("upload only image files");
			return;
		}	
	}
	this.bandImageName = files[0].name;
	$.ajax({
		url: SERVER + "/UploadBand.php", // Url to which the request is send
		type: "POST",             // Type of request to be send, called as method
		data:  new FormData(event.currentTarget), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
		contentType: false,       // The content type used when sending data to the server.
		cache: false,             // To unable request pages to be cached
		processData:false,        // To send DOMDocument or non processed data file it is set to false
		success: $.proxy(this.bandImageUploaded,this)
	});
};

Profile.prototype.bandImageUploaded = function(){
	$('.band-picture').attr("src",BAND_PICS+"/"+this.bandImageName);
	this.inputData.data.pic_url = this.bandImageName;
}

Profile.prototype.saveDetails = function(){
	this.sendData.fname = $('.fname input').val().trim().toLowerCase();
	this.sendData.lname = $('.lname input').val().trim().toLowerCase();
	//this.sendData.email = $('.email input').val().trim().toLowerCase();
	this.sendData.phone = $('.phone input').val().trim().toLowerCase();;
	this.sendData.dob = $('.dob input').val().trim().toLowerCase();
	this.sendData.city = $('.city').val().trim().toLowerCase();
	this.sendData.street = $('.street').val().trim().toLowerCase();
	this.sendData.state = $('.state').val().trim().toLowerCase();
	this.sendData.zipcode = $('.zip-code').val().trim().toLowerCase();
	this.sendData.country = $('.country').val();
	this.sendData.pic_url = this.inputData.data.pic_url;
	this.sendData.url = this.inputData.data.url;
	if($('input:radio[name=gender]:checked').val()){
		this.sendData.gender = $('input:radio[name=gender]:checked').val();
	}
	$.get(SERVER+"/DBAjaxReq.php",{func:"update_profile_info",data:this.sendData},$.proxy(this.profileUpdated,this),type="json");
	//this.saveData();
	console.log(this.sendData);
};

Profile.prototype.profileUpdated = function(data){
	
	if(data.rCode == 0){
		window.location.href = MODULES+"/home/homepage.html";
	}else if(data.rCode == -1){
		window.location.href = MODULES+"/login/login.html";
	}else{
		alert("some error occured");
	}
};

