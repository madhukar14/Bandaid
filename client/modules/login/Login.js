define(['jquery','jquery-ui','backbone','underscore','utility'],function(){
	$(document).ready(function(){
		_ = _;
		_u = _u;
		var login = new Login();
		login.init();
	});	
	
});
	
Login = function(){
	this.artistClicked = false;
	this.groupClicked = false;
	this.sendData = {type: null, band_music:[], band_name: null, uname:"", email:"",fname:"", lname: "", pwd:""};
	this.bandList = [{name:"abc",group:"group"},
					{name:"abc1",group:"group"},
					{name:"abc2",group:"group"},
					{name:"abc3",group:"group"}];
}

Login.prototype.init = function(){
	//this.setSlider();
	//this.setDatePicker(); 	
	this.addHeader();
	this.showPage1();
	this.fetchData();
	this.attachEventHandlers();
};

Login.prototype.attachEventHandlers = function(){
	$('.login-but').click($.proxy(this.userLogin,this));
}

Login.prototype.userLogin = function(){
	var uname = $('.login-uname').val().trim();
	var pwd = $('.login-pwd').val().trim();
	if(uname == "" || pwd == ""){
		alert("username or password is blank");
		return;
	}
	$.post(SERVER+"/Authenticate.php",{func:"login",data:{uname: uname, pwd: pwd}},$.proxy(this.loginSuccess,this),type="json");
};

Login.prototype.loginSuccess = function(data){
	if(data.rCode == 0){
		window.location.href = MODULES + "/home/homepage.html";
	}else if(data.rCode == 4){
		alert("username or password is incorrect");
	}else{
		alert("some error occured");
	}
};

Login.prototype.fetchData= function(){
	$.post(SERVER+"/InitialData.php",{},$.proxy(this.initialDataAvailable,this),type="json");
};

Login.prototype.initialDataAvailable = function(data){
	this.bandList = data.data.band;
	this.musicList = data.data.music;
};

Login.prototype.addHeader = function(){
	/*var data = {followers: 30, image : "abc.jpg"};
	var header = _u.getTmpl("header");
	var headerTemplate = _.template(header.tmpl);*/
	
	
	var ret =
	'<table class="header-table">\
			<tr class="header-top-border">\
				<td colspan="4"><div></div></td>\
			</tr>\
			<tr class="header-row">\
				<td><div class="header-band-name">BANDAID</div></td>\
				<td><div class="login-cred">\
					<input class="login-uname" type="textfield" placeholder="Username"></input>\
					<input class="login-pwd" type="password" placeholder="Password"></input>\
					<input class="login-but" type="button" value="LOGIN"></input>\
					</div></td>\
			</tr>\
		</table>'
		$('.login-header').html(ret);
		
};

Login.prototype.showPage1 = function(){
		var ret = 
		'<form class = "type-of-user">\
			<input class="user" type="radio" value = 0>I am a User<br>\
			<input class="artist" type="radio" value = 1>I am an Artist\
		</form>';
		$('.sign-up-header').html("SIGN UP");
		$('.sign-up').css("height","100px");
		$('.sign-up').html(ret);
		$('.sign-up input').click($.proxy(this.userTypeSelected,this));
		
};

Login.prototype.userTypeSelected = function(event){
	var val = $(event.currentTarget).val();
	if(val == "0"){
		this.sendData.type= null;
		this.sendData.band_music = [];
		this.artistClicked = false;
		this.showPage3();
	}
	else{
		this.sendData.type="solo";
		this.artistClicked = true;
		this.showPage2();
	}
};

Login.prototype.showPage3 = function(eve){
	if($(event.currentTarget).hasClass('sign-up-but-back-music-next')){
		var data = $('input[type="checkbox"]:checked');
		this.sendData.band_music = [];
		for(var i=0; i< data.length; i++){
			this.sendData.band_music.push(data[i].value);
		}
	}
	if($(event.currentTarget).hasClass('sign-up-but-back-band-next')){
		this.sendData.band_music = [];
		this.sendData.band_name = $('.band-list').val();
	}
	console.log(this.sendData);
	var ret = 
	'<div class="username">\
		<input type="textfield" placeholder="Choose a user name"></input>\
		<span class="error">User Name exists !!</span>\
	</div>\
	<div class="email">\
		<input type="textfield" placeholder="Email"></input>\
		<span class="error">Enter valid Email id</span>\
	</div>\
	<div class="fname">\
		<input type="textfield" placeholder="First name"></input>\
		<span class="error">Enter valid Email id</span>\
	</div>\
	<div class="lname">\
		<input type="textfield" placeholder="Last Name"></input>\
		<span class="error">Enter valid Email id</span>\
	</div>\
	<div class="password">\
		<input  type="password" placeholder="Password"></input>\
		<span class="error">Password not okay</span>\
	</div>\
	</div>\
		<input class="sign-up-back" type="button" value="Back"></input>\
		<input class="sign-up-but" type="button" value="Sign Up"></input>\
	</div>'
	
	$('.sign-up-header').html("CREATE YOUR ACCOUNT");
	$('.sign-up').css("height","300px");
	$('.sign-up').css("overflow-y","auto");
	$('.sign-up').html(ret);
	$('.sign-up-back').click($.proxy(this.showPage1,this));
	$('.sign-up-but').click($.proxy(this.redirectProfilePage,this));
	
}

Login.prototype.redirectProfilePage = function(){
	this.sendData.uname = $('.username input').val();
	if(this.sendData.uname.trim() == ""){
		alert("user name cannot be blank");
		return;
	}
	this.sendData.email = $('.email input').val();
	if(this.sendData.email.trim() == ""){
		alert("Email cannot be blank");
		return;
	}
	this.sendData.fname = $('.fname input').val();
	if(this.sendData.fname.trim() == ""){
		alert("First name cannot be blank");
		return;
	}
	this.sendData.lname = $('.lname input').val();
	if(this.sendData.lname.trim() == ""){
		alert("Last name cannot be blank");
		return;
	}
	this.sendData.pwd = $('.password input').val();	
	if(this.sendData.pwd.trim() == ""){
		alert("password cannot be blank");
		return;
	}
	
	console.log(this.sendData);
	$.post(SERVER+"/Authenticate.php",{func:"signup",data:this.sendData},this.signupSuccess,type="json");
	
};

Login.prototype.signupSuccess = function(data){
	if(data.rCode == 0){		
		window.location.href = MODULES + "/profile/profile.html";
	}else if(data.rCode != 4){
		alert("Some error occured");
	}else{
		alert("username or email is already used");
	}
	
}




Login.prototype.setSlider = function(){
	$( "#slider" ).slider({
      value:1,
      min: 0,
      max: 1,
      step: 1,
      slide: function( event, ui ) {
		if(ui.value == 0)
			$( "#slider > span" ).html( "ARTIST" );
		else
			$( "#slider > span" ).html( "USER" );
      }
    });
    $( "#slider > span" ).html("USER");
};

Login.prototype.setDatePicker = function(){
	$( "#datepicker" ).datepicker({
      changeMonth: true,
      changeYear: true
    });
};


Login.prototype.showPage2 = function(){
	var ret = 
		'<form class = "type-of-band">\
			<input class="solo" type="radio" value = 0>I am a Solo Artist<br>\
			<input class="group" type="radio" value = 1>I have a Band\
		</form>\
		<input class="sign-up-but-back-page2" type="button" value="Back"></input>'
		
		$('.sign-up-header').html("BAND INFORMATION");
		$('.sign-up').css("height","150px");
		$('.sign-up').html(ret);
		$('.sign-up .sign-up-but-back-page2').click($.proxy(this.showPage1,this));
		$('.sign-up .solo').click($.proxy(this.showMusicPage,this));
		$('.sign-up .group').click($.proxy(this.showBandPage,this));
		
		
		
		
		/*var temp = _.template(this.getMusicMenuTemplate());
		var str = temp(rdata);
		console.log(str);*/
		
		
};

Login.prototype.showMusicPage = function(event,band_name){	
	if($(event.currentTarget).hasClass(".solo")){
		this.sendData.type = "solo";
	}else{
		this.sendData.band_name = band_name;
	}
	var mtmpl = this.getMusicMenuTemplate();	
	$('.sign-up-header').html("BAND INFORMATION");
		$('.sign-up').css("height","270px");
		$('.sign-up').html(mtmpl);
		$('.sign-up .sign-up-but-back-music-pg').click($.proxy(this.showPage2,this));
		$('.sign-up .sign-up-but-back-music-next').click($.proxy(this.showPage3,this));
	
};

Login.prototype.showBandPage = function(){
	this.sendData.type = "group";
	var ret = this.getBandInfoTmpl();
	$('.sign-up-header').html("BAND INFORMATION");
		$('.sign-up').css("height","270px");
		$('.sign-up').html(ret);
		$('.band-list').change(function(){
			$('.band-name').val("");
		});	
		$('.band-name').focus(function(){
			$('.band-list').val("-1");
		});
		$('.sign-up .sign-up-but-back-band-pg').click($.proxy(this.showPage2,this));
		$.proxy(this.showMusicPage,this)
		var ref = this;
		$('.sign-up .sign-up-but-back-band-next').click(function(event){
			if(($('.band-name').val().trim() == "") && ($('.band-list').val() == -1)){
				alert("Band name required");
			}else{
				if($('.band-name').val().trim() == "")
					ref.showPage3(event,$('.band-list').val())
				else
					ref.showMusicPage(event,$('.band-name').val())
			}
		});
}

Login.prototype.getMusicMenuTemplate = function(){
	var ret ='<div class="music-info-header">Select your band\'s music genre</div>\
			 <div class="music-holder">'
	data = this.musicList;
		/*data = [{music_id:"m1",category: "jazz", sub_category: [{name:"cool-jazz"},{name: "b-jazz"},{name: "c-jazz"}]},
		{music_id:"m2", category: "rock", subcategory: [{name:"cool-rock"},{name: "b-rock"},{name: "c-rock"}]}];*/	
	for(var i = 0; i< data.length; i++)	{
		
			ret = ret + '<input type = "checkbox" value ="'+ data[i].music_id  +'">'+data[i].category +"  "+ data[i].sub_category+'</input><br>';		
	}
	ret = ret + '</div>'
	ret = ret + '<input class="sign-up-but-back-music-pg" type="button" value="Back"></input>' + '<input class="sign-up-but-back-music-next" type="button" value="Next"></input>'
	console.log(ret);
	return ret;
	
};

Login.prototype.getBandInfoTmpl = function(){
	var ret = 
	'<input class="band-name" type = "textfield"  placeholder="Add a New Band name"></input><br>\
	<p class="or">OR</p><br>\
	<select class="band-list" placeholder ="Select from the list" ><option value="-1" selected="selected">Select an existing Band</option>';
	for(var i=0; i < this.bandList.length; i++){
		ret = ret +
		'<option value="'+this.bandList[i].name+'">'+ this.bandList[i].name +'</option>';			
	}
	ret = ret +
	'</select></br>'
	
	ret = ret + '<input class="sign-up-but-back-band-pg" type="button" value="Back"></input>' + '<input class="sign-up-but-back-band-next" type="button" value="Next"></input>'
	return ret;
};

/*Login.prototype.getMusicMenuTemplate = function(){
	var ret = 
	'<%if (data.length > 0){%>\
		<ul>\
	<%}%>\
	<%for(var i = 0; i < data.length; i++){%>\
		<li>\
			<input type="checkbox">\
			<label ><%=data[i].category%></label>\
			<%console.log(data[i].subcategory)%>\
			<%if (data[i].subcategory.length > 0){%>'
				+'<ul>'+	
			'<%}%>\
			<%for(var j = 0; j < data[i].subcategory.length; i++){%>\
				<li>\
					<input type="checkbox">\
					<label ><%=data[i].subcategory[j].name%></label>\
				</li>\
			<%}%>\
			<%if (data[i].subcategory.length > 0){%>'
				+'<ul>'+		
			'<%}%>\
		</li>\
	<%}%>\
	<%if (data.length > 0){%>\
		</ul>\
	<%}%>'
	return ret;
};*/


/*	Login.prototype.setUpMusicCheckBox = function() {
      $('input[type="checkbox"]').change(function(e) {
      var checked = $(this).prop("checked"),
          container = $(this).parent(),
          siblings = container.siblings();
  
      container.find('input[type="checkbox"]').prop({
          indeterminate: false,
          checked: checked
      });
  
      function checkSiblings(el) {
          var parent = el.parent().parent(),
              all = true;
  
          el.siblings().each(function() {
              return all = ($(this).children('input[type="checkbox"]').prop("checked") === checked);
          });
  
          if (all && checked) {
              parent.children('input[type="checkbox"]').prop({
                  indeterminate: false,
                  checked: checked
              });
              checkSiblings(parent);
          } else if (all && !checked) {
              parent.children('input[type="checkbox"]').prop("checked", checked);
              parent.children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
              checkSiblings(parent);
          } else {
              el.parents("li").children('input[type="checkbox"]').prop({
                  indeterminate: true,
                  checked: false
              });
          }
        }
    
        checkSiblings(container);
      });
    };







/*'<div class="fname">\
		<input type="textfield" placeholder="First Name"></input>\
		<span class="error">Special Characters not allowed</span>\
	</div>\
	<div class="lname">\
		<input type="textfield" placeholder="Last Name"></input>\
		<span class="error">Special Characters not allowed</span>\
	</div>\
	<div class="email">\
		<input type="textfield" placeholder="Email"></input>\
		<span class="error">Enter valid Email id</span>\
	</div>\
	<div class="phone">\
		<input type="textfield" placeholder="Phone Number"></input>\
		<span class="error">Enter valid phone number</span>\
	</div>\
	<div class="password">\
		<input  type="password" placeholder="Password"></input>\
		<span class="error">Password not okay</span>\
	</div>\
	<div class="dob">\
		<input type="text" id="datepicker" placeholder="Date of birth">\
		<span class="error">Choose a vaild date</span>\
	</div>\
	<div class="gender">\
		<form action="">\
			<input class="male" type="radio" value="male">Male\
			<input class="female" type="radio" value="female">Female\
		</form>\
	</div>\
	<div class="address">\
		<input class = "city" type="textfield" placeholder="City"></input>\
		<input class="street" type="textfield" placeholder="Street"></input>\
		<input class = "state" type="textfield" placeholder="State"></input>\
		<input class = "zip-code" type="textfield" placeholder="Zip Code"></input>\
		<select class="country" ></select>\
	</div>'*/
