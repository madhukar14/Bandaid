define(['jquery','jquery-ui','backbone','underscore','utility','HomeView.js','MusicContainer.js','fbrating','ConcertContainer.js','MemberContainer.js','MyRecoContainer.js'],function(){
	$(document).ready(function(){		
		_ = _;
		_u = _u;
		var homepage = new Homepage();
		homepage.setup();
	});	
});

Homepage = function(){
	this.tabIndex = -1;
	this.userDetails
};

Homepage.prototype.setup = function(){	
	$.get(SERVER+"/DBAjaxReq.php",{func:"abcd"},$.proxy(this.userDetailsAvailable,this),type="json");
	this.addHeader();
	this.attachEventHandlers();
	
};

Homepage.prototype.userDetailsAvailable = function(data){
	if(data.rCode && data.rCode == -1){
		window.location.href = MODULES+"/login/login.html";
	}
	this.userDetails = data.userDetails;
	if($('.header-welcome-user').parent().length != 0){
		$('.header-welcome-user').html(this.userDetails.fname.toUpperCase()+"      "+this.userDetails.lname.toUpperCase());
	}
	if($('.header-photo img').parent().length != 0){
		$('.header-photo img').attr("src",PROFILE_PICS+"/"+this.userDetails.url);
	}
}

Homepage.prototype.addHeader = function(){
	var data = {followers: 30, image : "abc.jpg"};
	var header = _u.getTmpl("header");
	var headerTemplate = _.template(header.tmpl);
	$('.home-header').append(headerTemplate(data));
	header.attachEventHandlers();
};

Homepage.prototype.attachEventHandlers = function(){	
	$('.navbar > li').click($.proxy(this.tabClicked,this));
	//$('.header-action select').change($.proxy(this.actionChange,this));
	//$('.opt-logout').click($.proxy(this.logOut,this));
	//$('.opt-profile').click($.proxy(this.showProfile,this));
	$('.nav-home').trigger("click");
	
};

Homepage.prototype.actionChange = function(){
	if($('.opt-logout').val() == "logout"){
		this.logOut();
	}else if($('.header-action select').val() == "profile"){
		window.location.href = MODULES + "/profile/profile.html";
	}
};

Homepage.prototype.showProfile = function(){
	window.location.href = MODULES + "/profile/profile.html";
};

Homepage.prototype.logOut = function(){
	$.get(SERVER+"/DBAjaxReq.php",{func:"logout",data:{}},$.proxy(this.logOutSucc,this),type="json");
};

Homepage.prototype.logOutSucc = function(data){
	if(data.rCode == -1 || data.rCode == 5){
		window.location.href = MODULES + "/login/login.html";
	}
};

Homepage.prototype.tabClicked = function(event){	
	
	if($(event.currentTarget).hasClass('nav-home')){
		if(this.tabIndex != 1){		
			this.tabIndex = 1;	
			this.homeClicked();
		}
	}
	if($(event.currentTarget).hasClass('nav-music')){
		if(this.tabIndex != 2){		
			this.tabIndex = 2;	
			this.musicClicked();
		}
	}
	if($(event.currentTarget).hasClass('nav-plan')){
		if(this.tabIndex != 3){		
			this.tabIndex = 3;	
			this.planClicked();
		}
	}
	if($(event.currentTarget).hasClass('nav-reco')){
		if(this.tabIndex != 4){		
			this.tabIndex = 4;	
			this.recoClicked();
		}
	}
	if($(event.currentTarget).hasClass('nav-members')){
		if(this.tabIndex != 5){		
			this.tabIndex = 5;
			this.membersClicked();
		}
	}
	if($(event.currentTarget).hasClass('nav-others')){
		if(this.tabIndex != 6){		
			this.tabIndex = 6;	
			this.othersClicked();
		}
	}
};

Homepage.prototype.homeClicked = function(){
	$('.nav-highlight').removeClass('nav-highlight');	
	$('.nav-home').addClass('nav-highlight');
	$('.canvas').empty();	
	that = this;	
	this.getRecommendations();
	var data = {system: {music:[], band:[], concert:[]}, 
				friends:{music:[], band:[], concert:[]} };
	this.homeView = new HomeView();
	this.homeView.setModelData(data);
	$('.canvas').append(this.homeView.el);	
};

Homepage.prototype.getRecommendations = function(){
	$.get("/bandaid/server/DBAjaxReq.php", {func: "combine_sys_recomm"},$.proxy(this.recommendationsAvailable,this),type="json");
};

Homepage.prototype.recommendationsAvailable = function(data){
	$('.loading').remove();
	this.homeView.setModelData(data.data);
};



Homepage.prototype.musicClicked = function(){
	$('.nav-highlight').removeClass('nav-highlight');
	$('.nav-music').addClass('nav-highlight');	
	$('.canvas').empty();
	var searchField = '<input class="band-search-name" type = "textfield" placeholder="              Search by Band name"></input>\
					   <input class="band-search-artist" type = "textfield" placeholder="                 Search Artist name"></input>\
					   <input class="band-search-music" type = "textfield" placeholder="                  Search by Music"></input>';
	$('.canvas').append(searchField);
	this.bandSearchView = new MusicContainer();
	this.bandSearchView.setType("bandsearch");
	$('.canvas').append(this.bandSearchView.el);
	var that = this;
	
	$('.band-search-name').focus(function(){
		$('.band-search-artist').val("");
		$('.band-search-music').val("");
	});
	$('.band-search-artist').focus(function(){
		$('.band-search-music').val("");
		$('.band-search-name').val("");
	});
	$('.band-search-music').focus(function(){
		$('.band-search-artist').val("");
		$('.band-search-name').val("");
	});
	
	$('.band-search-name').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.musicSearchClicked(event,"name",$('.band-search-name').val());
			}
	});
	$('.band-search-artist').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.musicSearchClicked(event,"artist", $('.band-search-artist').val());
			}
	});
	$('.band-search-music').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.musicSearchClicked(event,"music", $('.band-search-music').val());
			}
	});
	
	
	//var data = this.getBandSearchData(1);
	/*setTimeout(function(){
		that.bandSearchView.setModelData(data);
		//data = that.getBandSearchData(2);
		//that.bandSearchView.setModelData(data);
		//data = that.getBandSearchData(3);
		//that.bandSearchView.setModelData(data);
	}, 1000);*/
	
};

Homepage.prototype.musicSearchClicked = function(event,who,key){
	key = key.trim();
	if(who == "name"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_by_name",data:{bandkey: key}},$.proxy(this.bandSearchAvailable,this),type="json");
		return;
	}
	if(who == "music"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_by_music", data:{musickey:key }},$.proxy(this.bandSearchAvailable,this),type="json");
		return;
	}
	if(who == "artist"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_by_artist", data:{artistkey: key}},$.proxy(this.bandSearchAvailable,this),type="json");
		return;
	}
};

Homepage.prototype.bandSearchAvailable = function(data){
	if(data.rCode == 0){
		
		this.bandSearchView.setModelData({band: data.data});
	}
}


Homepage.prototype.getBandSearchData = function(input){
var data;
if(input == 1){
	data = {
		band:[{name:"beyonce",type:"solo",img_url:"queries-1.jpg",has_liked:true},
			  {name:"prachi",type:"solo",img_url:"queries-3.jpg", has_liked:true},
			  {name:"linkin park",type:"group",img_url:"queries-2.jpg", has_liked:true},
			  {name:"hello",type:"solo",img_url:"queries-1.jpg", has_liked:false}, 
			  {name:"awesome",type:"solo",img_url:"queries-1.jpg", has_liked:true}, 
			  {name:"whatever",type:"solo",img_url:"queries-1.jpg", has_liked:false},
			  {name:"whatever1",type:"solo",img_url:"queries-1.jpg", has_liked:true},
			  {name:"whatever2",type:"solo",img_url:"queries-1.jpg", has_liked:false},
			  {name:"whatever3",type:"solo",img_url:"queries-1.jpg", has_liked:true},
			  {name:"whatever4",type:"solo",img_url:"queries-1.jpg", has_liked:true},
			  {name:"whatever5",type:"solo",img_url:"queries-1.jpg", has_liked:false},
			  {name:"whatever6",type:"solo",img_url:"queries-1.jpg", has_liked:true},
			  {name:"whatever7",type:"solo",img_url:"queries-1.jpg", has_liked:true},
			  {name:"whatever8",type:"solo",img_url:"queries-1.jpg", has_liked:false},
			  {name:"whatever9",type:"solo",img_url:"queries-1.jpg", has_liked:true},
			  {name:"whatever",type:"solo",img_url:"queries-1.jpg", has_liked:false}]
			};
		}
		else if(input == 2){
		data = {
		band:[{name:"trymeout",type:"solo",img_url:"abcd.jpg",has_liked:true},
			  {name:"prachi",type:"solo",img_url:"queries-3.jpg"},
			  {name:"linkin park",type:"group",img_url:"queries-2.jpg"},
			  {name:"hello",type:"solo",img_url:"queries-1.jpg"}, 
			  {name:"awesome",type:"solo",img_url:"queries-1.jpg"}, 
			  {name:"whatever",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever1",type:"solo",img_url:"queries-1.jpg"},
			  
			  {name:"whatever3",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever4",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever5",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever6",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever7",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever8",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever9",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whateveryoudidit",type:"solo",img_url:"queries-1.jpg"}]
			}
		}else{
			data = {
		band:[{name:"beyonce",type:"solo",img_url:"queries-1.jpg",has_liked:true},
			  {name:"prachi",type:"solo",img_url:"queries-3.jpg"},
			  {name:"linkin park",type:"group",img_url:"queries-2.jpg"},
			  {name:"hello",type:"solo",img_url:"queries-1.jpg"}, 
			  {name:"awesome",type:"solo",img_url:"queries-1.jpg"}, 
			  {name:"whatever",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever1",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever2",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever3",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever4",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever5",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever6",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever7",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever8",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever9",type:"solo",img_url:"queries-1.jpg"},
			  {name:"whatever",type:"solo",img_url:"queries-1.jpg"}]
			};
		}
		
	return data;
};

Homepage.prototype.planClicked = function(){
	$('.nav-highlight').removeClass('nav-highlight');
	$('.nav-plan').addClass('nav-highlight');	
	$('.canvas').empty();
	var searchField = '<input class="concert-search-name" type = "textfield" placeholder="             Search by artist name"></input>\
					   <input class="concert-search-music" type = "textfield" placeholder="            Search by music"></input>\
					   <input class="concert-search-artist" type = "textfield" placeholder="           Search by Artist or Band"></input>\
					   <input class="concert-search-venue" type = "textfield" placeholder="            Search by venue"></input><br>';
	$('.canvas').append(searchField);
	this.concertSearchView = new ConcertContainer();
	this.concertSearchView.setType("concertsearch");
	$('.canvas').append(this.concertSearchView.el);
	that = this;	
	//var data = this.getConcertSearchData();
	/*setTimeout(function(){
		that.concertSearchView.setModelData(data);
	}, 1000);*/
	
	
	$('.concert-search-name').focus(function(){
		$('.concert-search-artist').val("");
		$('.concert-search-music').val("");
		$('.concert-search-venue').val("");
	});
	$('.concert-search-artist').focus(function(){
		$('.concert-search-music').val("");
		$('.concert-search-name').val("");
		$('.concert-search-venue').val("");
	});
	$('.concert-search-music').focus(function(){
		$('.concert-search-artist').val("");
		$('.concert-search-name').val("");
		$('.concert-search-venue').val("");
	});
	
	$('.concert-search-venue').focus(function(){
		$('.concert-search-artist').val("");
		$('.concert-search-name').val("");
		$('.concert-search-music').val("");
	});
	
	$('.concert-search-name').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.concertSearchClicked(event,"name",$('.concert-search-name').val());
			}
	});
	$('.concert-search-artist').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.concertSearchClicked(event,"artist", $('.concert-search-artist').val());
			}
	});
	$('.concert-search-music').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.concertSearchClicked(event,"music", $('.concert-search-music').val());
			}
	});
	
	$('.concert-search-venue').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.concertSearchClicked(event,"venue", $('.concert-search-venue').val());
			}
	});
};

Homepage.prototype.concertSearchClicked = function(event,who,key){
	key = key.trim();
	if(who == "name"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_concert_by_name",data:{cnamekey: key}},$.proxy(this.concertSearchAvailable,this),type="json");
		return;
	}
	if(who == "music"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_concert_by_music", data:{musickey:key }},$.proxy(this.concertSearchAvailable,this),type="json");
		return;
	}
	if(who == "artist"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_concert_by_artist", data:{abkey: key}},$.proxy(this.concertSearchAvailable,this),type="json");
		return;
	}
	if(who == "venue"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_concert_by_venue", data:{vkey: key}},$.proxy(this.concertSearchAvailable,this),type="json");
		return;
	}
};

Homepage.prototype.concertSearchAvailable = function(data){
	if(data.rCode == 0){
		
		this.concertSearchView.setModelData({concert: data.data});
	}
}

Homepage.prototype.getConcertSearchData = function(){
	var data = {
	concert:[{cid:"1",concert_name: "abc1", band_name:"beyonce",type:"solo",img_url:"queries-1.jpg",start_time: "14/10/2014 10:30:44",address:"nyu hall"},
			{cid:"2",concert_name: "abc2",band_name:"linkin park",type:"group",img_url:"queries-2.jpg", start_time: "14/10/2014 10:30:44",address:"nyu hall"},
			{cid:"3",concert_name: "abc3",band_name:"hello",type:"solo",img_url:"queries-1.jpg",start_time: "14/10/2014 10:30:44",address:"nyu hall"}, 
			{cid:"4",concert_name: "abc4",band_name:"awesome",type:"solo",img_url:"queries-1.jpg",start_time: "14/10/2014 10:30:44",address:"nyu hall"}, 
			{cid:"5",concert_name: "abc5",band_name:"whatever",type:"solo",img_url:"queries-1.jpg",start_time: "14/10/2014 10:30:44",address:"nyu hall"}]
		   };
	return data;
};

Homepage.prototype.recoClicked = function(){
	$('.nav-highlight').removeClass('nav-highlight');
	$('.nav-reco').addClass('nav-highlight');	
	$('.canvas').empty();
	var searchField = '<input class="my-reco-recommend" type = "button" value="Recommend Concert"></input>\
					   <input class="my-reco-add-concert" type = "button" value="Add Concert"></input>';					   
	$('.canvas').append(searchField);	
	this.myRecoView = new MyRecoContainer();
	$('.my-reco-recommend').click($.proxy(this.myRecoView.makeRecommendation,this.myRecoView));
	$('.my-reco-add-concert').click($.proxy(this.myRecoView.addConcerts,this.myRecoView));
	$('.canvas').append(this.myRecoView.el);
	this.myRecoView.fetchData();
	
};

Homepage.prototype.membersClicked = function(){
	$('.nav-highlight').removeClass('nav-highlight');
	$('.nav-members').addClass('nav-highlight');	
	$('.canvas').empty();
	var searchField = '<input class="member-search-name" type = "textfield" placeholder="         Search by member name"></input>'
	$('.canvas').append(searchField);
	this.memberSearchView = new MemberContainer();
	$('.canvas').append(this.memberSearchView.el);
	that = this;	
	//data = this.getMemberSearchData();
	/*setTimeout(function(){
		that.memberSearchView.setModelData(data);
	}, 1000);*/
	$('.member-search-name').keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				that.memberSearchClicked(event,"name",$('.member-search-name').val());
			}
	});
	
	
};

Homepage.prototype.memberSearchClicked = function(event,who,key){
	key = key.trim();
	if(who == "name"){
		$.get(SERVER+"/"+"DBAjaxReq.php",{func:"search_member",data:{memkey: key}},$.proxy(this.memberSearchAvailable,this),type="json");
		return;
	}	
};

Homepage.prototype.memberSearchAvailable = function(data){
	if(data.rCode == 0){
		
		this.memberSearchView.setModelData({users: data.data});
	}
};

Homepage.prototype.getMemberSearchData = function(){
	data = {
		users: [{is_artist:true,uname:"madsam",fname:"madhukar",url:"queries-2.jpg", following:true},
				{is_artist:false,uname:"madsam1",fname:"sudhakar",url:"queries-2.jpg", following:true},
				{is_artist:false,uname:"madsam2",fname:"madhu",url:"queries-2.jpg", following:false},
				{is_artist:true,uname:"madsam3",fname:"prachi",url:"queries-2.jpg", following:true},
				{is_artist:false,uname:"madsam",fname:"madhukar",url:"queries-2.jpg", following:true},
				{is_artist:true,uname:"madsam4",fname:"hello",url:"queries-2.jpg", following:false},
				{is_artist:true,uname:"mad",fname:"hello",url:"queries-2.jpg", following:false},
				{is_artist:true,uname:"m",fname:"madhukar",url:"queries-2.jpg", following:true},
				{is_artist:false,uname:"1",fname:"sudhakar",url:"queries-2.jpg", following:true},
				{is_artist:false,uname:"2",fname:"madhu",url:"queries-2.jpg", following:false},
				{is_artist:true,uname:"3",fname:"prachi",url:"queries-2.jpg", following:true},
				{is_artist:false,uname:"l",fname:"madhukar",url:"queries-2.jpg", following:true},
				{is_artist:true,uname:"k",fname:"hello",url:"queries-2.jpg", following:false},
				{is_artist:true,uname:"d",fname:"hello",url:"queries-2.jpg", following:false}]
	};
	return data;
};

Homepage.prototype.othersClicked = function(){
	$('.nav-highlight').removeClass('nav-highlight');
	$('.nav-others').addClass('nav-highlight');	
	$('.canvas').empty();
};





