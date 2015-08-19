define(['jquery','jquery-ui','backbone','underscore','utility','home/MyRecoContainer'],function(){
	$(document).ready(function(){
		_ = _;
		_u = _u;
		var uprofile = new userProfile();
		uprofile.init();
	});	
});

userProfile = function(){
};

userProfile.prototype.init = function(){
	var str = window.location.search;
	strr = str.split("?")[1];
	 var name_key_val = str.split("&")[0];
	 //var type_key_val = str.split("&")[1];
	 var uname_val = name_key_val.split("=")[1].replace(/%20/g," ");
	 uname_val = uname_val.replace(/\s{2,}/g,' ');;
	 console.log(uname_val);
	 this.uname = uname_val; 
	 $('.uprofile-follows').click($.proxy(this.showWhoUserFollows,this));
	 $('.uprofile-followed-by').click($.proxy(this.showFollwedBy,this));
	 $('.uprofile-music-like').click($.proxy(this.showMusic,this));
	 $('.uprofile-band-info').click($.proxy(this.artistsClicked,this));
	 $('.uprofile-follow').click($.proxy(this.followUser,this));
	this.fetchData();
};

userProfile.prototype.artistsClicked = function(){
	$.get(SERVER+"/DBAjaxReq.php",{func:"artists_from_band",data:{band_type:this.band_type,band_name: this.band_name}},$.proxy(this.artistsAvailable,this),type="json");	
};

userProfile.prototype.artistsAvailable = function(data){
	if(data.rCode == 0){
	var cdata = {};
	cdata.names = data.data;
	/*cdata.names[0] = {fname:"Madhukar"};
	cdata.names[1] = {fname:"Sudhakar"};
	cdata.names[2] = {fname:"Mayank"};
	cdata.names[3] = {fname:"Ashutosh"};*/
	data = {};
	data.data = cdata.names;
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("BAND - "+this.band_name);
	}
};
userProfile.prototype.showWhoUserFollows = function(){
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"user_follows_who",data:{uname: this.uname}},$.proxy(this.whoUserFollowsAvailable,this),type="json");
};

userProfile.prototype.whoUserFollowsAvailable = function(data){
	if(data.rCode == 0){
	var cdata = {};
	cdata.names = data.data;
	
	data = {};
	data.data = cdata.names;
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("People who "+this.fname+" follows ");
	}
};

userProfile.prototype.showFollwedBy = function(){
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"user_followed_by",data:{uname: this.uname}},$.proxy(this.userFollowedBy,this),type="json");
};

userProfile.prototype.userFollowedBy = function(data){
	if(data.rCode == 0){
	var cdata = {};
	cdata.names = data.data;
	
	data = {};
	data.data = cdata.names;
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("People who follow "+this.fname);
	}
};

userProfile.prototype.showMusic = function(){
	
	var cdata = {};
	cdata.names = [];
	for(var i = 0; i < this.music.length; i++){
		cdata.names.push({fname: this.music[i].category +"  "+this.music[i].sub_category});
	}
	data = {};
	data.data = cdata.names;
	var memData = {names: data.data};
	var dialog = _u.getMusicDialog(memData);
	dialog.show();
	dialog.setTitle("Music "+ this.fname+ " likes");
	
};

userProfile.prototype.followUser = function(event){
	if($(event.currentTarget).hasClass('uprofile-followed')){
		$('.uprofile-follow').removeClass("uprofile-followed");
		$('.uprofile-follow').val("Follow");
	}else{
		$('.uprofile-follow').addClass("uprofile-followed");
		$('.uprofile-follow').val("Unfollow");
	}
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"member_follow_unfollow",data:{follow_user: this.uname}},type="json");
	
};



userProfile.prototype.fetchData = function(){
	this.follows = [{fname:"xyz0", uname:"xyz0"},
					{fname:"xyz1", uname:"xyz1"},
					{fname:"xyz2", uname:"xyz2"},
					{fname:"xyz3", uname:"xyz3"},
					{fname:"xyz4", uname:"xyz4"},
					{fname:"xyz5", uname:"xyz5"},
					{fname:"xyz6", uname:"xyz6"},
					{fname:"xyz7", uname:"xyz7"}];
	
	this.followedBy = [{fname:"xyzxyz0", uname:"xyzxyz0"},
					{fname:"xyzxyz1", uname:"xyzxyz1"},
					{fname:"xyzxyz2", uname:"xyzxyz2"},
					{fname:"xyzxyz3", uname:"xyzxyz3"},
					{fname:"xyzxyz4", uname:"xyzxyz4"},
					{fname:"xyzxyz5", uname:"xyzxyz5"},
					{fname:"xyzxyz6", uname:"xyzxyz6"},
					{fname:"xyzxyz7", uname:"xyzxyz7"}];
					
	this.bands = [{name:"abc",type:"solo", url:"a.jpg"},
				   {name:"abc1",type:"solo", url:"a.jpg"},
				   {name:"abc2",type:"group", url:"a.jpg"},
				   {name:"abc3",type:"solo", url:"a.jpg"}];
	
	this.music = [{category:"xyz", sub_category:"1234"},
				{category:"xyz", sub_category:"1234"},
				{category:"xyz", sub_category:"1234"},
				{category:"xyz", sub_category:"1234"},
				{category:"xyz", sub_category:"1234"}];
				
	this.performs = [{name:"kkk",type:"solo",url:"a.jpg"}];
	
	$.get(SERVER+"/DBAjaxReq.php",{func:"usr_profile",data:{uname: this.uname}},$.proxy(this.usrProfileDataAvailable,this),type="json");	
	
};

userProfile.prototype.usrProfileDataAvailable = function(data){
	if(data.rCode == 0){
		this.userDetails = data.userDetails;
		this.band_name = data.data.band_name;
		this.band_type = data.data.band_type;
		this.url = data.data.url;
		this.isArtist = data.data.is_artist;
		this.fname = data.data.usr_fname;
		this.lname = data.data.usr_lname;
		this.has_followed = data.data.has_followed;
		this.addHeader();
		this.setUp(data.data);
	}
};

userProfile.prototype.addHeader = function(){	
	var data = {followers: 30, image : this.userDetails.url};
	var header = _u.getTmpl("header");
	var headerTemplate = _.template(header.tmpl);
	$('.uprofile-header').append(headerTemplate(data));
	$('.header-welcome-user').html((this.userDetails.fname+"  "+this.userDetails.lname).toUpperCase());
	header.attachEventHandlers();
}

userProfile.prototype.setUp = function(data){
	$('.user-name').html((this.fname+"  " +this.lname).toUpperCase());
	$('.uprofile-pic').attr("src",PROFILE_PICS+"/"+this.url);
	if(this.isArtist){
		$('.uprofile-band-info').removeClass("uprofile-band-info-invisible");
	}
	if(this.has_followed){
		$('.uprofile-follow').addClass("uprofile-followed");
		$('.uprofile-follow').val("Unfollow");
	}
	this.bands = data.band;
	this.music = data.music;
	var tmpl = 
	'<div class="uprofile-reco-made"><span class="reco-header">Recommendations made</span></div>';
	tmpl = tmpl +
	'<div class="uprofile-likes-bands">Bands Liked</div><br><div class="bands-liked-container">';
	for(var i=0; i < this.bands.length; i++){
		tmpl = tmpl +'<div class="img-img"> <img src="/bandaid/server/band-pics/' + this.bands[i].pic_url + '"></img>'+ '<span>' + this.bands[i].band_name + '</span></div>';
	}
	tmpl = tmpl + '</div>';
	/*tmpl = tmpl +
	'<br><br><br><div class="uprofile-likes music">Prefers Music</div><br>\
	<hr>';	
	for(var i=0; i < this.music.length; i++){
		tmpl = tmpl + '<span>' + this.music[i].category + " - " + this.music[i].sub_category + '</span><br>';
	}	
	tmpl = tmpl + '<br><br><br>';*/
	/*if(this.performs.length > 0){
		tmpl = tmpl + '<div class="uprofile-performs-in">Performs in</div><br>' +
		'<img src="' + this.performs[0].url + '"></img>'+ '<span>' + this.performs[0].name + '</span><br>';
	}*/
	$('.uprofile-content').html(tmpl);
	this.setupRecommendations();
	//$('.uprofile-follows').click($.proxy(this.showFollows,this));
	//$('.uprofile-followed-by').click($.proxy(this.showFollowedBy,this));
	
};

userProfile.prototype.showFollows = function(event){
	name = "Madhukar";
	var data = {};
	data.names = [];
	data.names = this.follows;
	var dialog = _u.getMembersDialog(data,{width: 350});
	dialog.show();
	dialog.setTitle("People who "+name+" follows");	
};

userProfile.prototype.showFollowedBy = function(){
	name = "Madhukar";
	var data = {};
	data.names = [];
	data.names = this.followedBy;
	var dialog = _u.getMembersDialog(data,{width: 350});
	dialog.show();
	dialog.setTitle("People who follow "+name);
};


userProfile.prototype.setupRecommendations = function(){
	this.myRecoView = new MyRecoContainer();
	$('.uprofile-reco-made').append(this.myRecoView.el);
	this.myRecoView.fetchData( 0,this.uname);
};