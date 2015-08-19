define(['jquery','jquery-ui','backbone','underscore','utility','fbrating'],function(){
	$(document).ready(function(){
		_ = _;
		_u = _u;
		var band = new Band();
		band.init();
	});	
});

Band = function(){
};

Band.prototype.init = function(){	
	console.log(window.location.search);
	var str = window.location.search;
	strr = str.split("?")[1];
	 var name_key_val = str.split("&")[0];
	 var type_key_val = str.split("&")[1];
	 var cidval = name_key_val.split("=")[1].replace(/%20/g," ");
	 cidval = cidval.replace(/\s{2,}/g,' ');;
	 console.log(cidval);
	 this.cid = cidval; 
	$.get(SERVER+"/DBAjaxReq.php",{func:"return_single_concert_data", data:{cid:this.cid}},$.proxy(this.userDetailsAvailable,this),type="json");
	$.get(SERVER+"/DBAjaxReq.php",{func:"concert_reviews", data:{cid:this.cid}},$.proxy(this.bandReviewsAvailable,this),type="json");
	this.addHeader();
	this.attachEventHandlers();
	
};

Band.prototype.addHeader = function(){
	var data = {followers: 30, image : "abc.jpg"};
	var header = _u.getTmpl("header");
	var headerTemplate = _.template(header.tmpl);
	$('.band-pg-header').append(headerTemplate(data));
	header.attachEventHandlers();
};

Band.prototype.userDetailsAvailable = function(data){
	if(data.rCode && data.rCode == -1){
		window.location.href = MODULES+"/login/login.html";
	}
	this.userDetails = data.userDetails;
	if($('.header-welcome-user').parent().length != 0){
		$('.header-welcome-user').html("Welcome "+this.userDetails.fname+" "+this.userDetails.lname);
	}
	if($('.header-photo img').parent().length != 0){
		$('.header-photo img').attr("src",PROFILE_PICS+"/"+this.userDetails.url);
	}
	$('.band-image').attr("src",BAND_PICS+"/"+data.data.pic_url);
	
	
	this.userDetails.band_name = data.data.name;
	this.userDetails.band_type = data.data.type;
	this.userDetails.concert_name = data.data.concert_name;
	this.userDetails.start_time = data.data.start_time;
	this.userDetails.has_RSVPed = data.data.has_RSVPed;
	if(this.userDetails.has_RSVPed){
		$('.band-like').addClass("band-liked");
		$('.band-like').val("C-RSVP");
	}
	if($('.band-name').parent().length != 0){
		$('.band-name').html(this.userDetails.concert_name + " --- "+ this.userDetails.start_time);
	}
	
}

Band.prototype.bandReviewsAvailable = function(data){
	if(data.rCode == 0){
		this.setInitialData(data.data);
	}
};

Band.prototype.setInitialData = function(reviews){
var data = {};	
	/*data.reviews = [{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"},
					{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"},
					{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"},
					{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"},
					{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"},
					{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"},
					{reviewed_by: "madsam", fname: "madhukar", reviewed_on: "10/14/1990 10:20:30", review_text : "Most horrible reviews i have ever seen"}];*/
	data.reviews = reviews;
	var d = {};
	d.data = data;
	d.rCode = 0;
	d.rText = "success";
	this.initialDataAvailable(d);
}

Band.prototype.initialDataAvailable = function(data){
	if(data.rCode == 0){
		
		this.setUp(data.data);
	}else if(data.rCode == -1){
		window.location.href = MODULES+"/login/login.html";
	}

};

Band.prototype.setUp = function(data){
	this.initialData = data;
	if(this.userDetails){
		$('.band-name').html(this.userDetails.concert_name);
	}
	/*if(data.has_liked){
		$('.band-like').addClass("band-liked");
		$('.band-like').val("");
	}*/
	//$('.band-image').attr("src",this.userDetails.pic_url);
	for(var i = 0; i < data.reviews.length; i++){
		var tmpl = this.getReviewTmpl(data.reviews[i]);
		$('.band-review-section').append(tmpl);
	}
};

Band.prototype.getReviewTmpl = function(item){
	var tmpl = 
	'<div class="review-item">' +
	'<span class="what-r">'+ item.review+'</span><br>'+'<span class="who-r">- by '+item.fname+' - '+item.rated_on+'</span>';
	return tmpl;
	
};

Band.prototype.attachEventHandlers = function(){
	$('.band-like').click($.proxy(this.bandLiked,this));
	$('.fans').click($.proxy(this.fansClicked,this));
	$('.review-band').click($.proxy(this.reviewBand,this));
	$('.show-members').click($.proxy(this.artistsClicked,this));
	$('.show-music').click($.proxy(this.musicClicked,this));
};

Band.prototype.bandLiked = function(){
	if(!$(event.currentTarget).hasClass("band-liked")){
		$(event.currentTarget).addClass("band-liked");
		$(event.currentTarget).val("C-RSVP");
	}else{
		$(event.currentTarget).removeClass("band-liked");
		$(event.currentTarget).val("RSVP");
	}
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"rsvp",data:{cid: this.cid}},type="json");
};

Band.prototype.fansClicked = function(){
	$.get(SERVER+"/DBAjaxReq.php",{func:"fan_list",data:{btype:this.band_type,bname: this.band_name}},$.proxy(this.fansAvailable,this),type="json");	
};

Band.prototype.fansAvailable = function(data){
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
	dialog.setTitle("People who like "+this.band_name);
	}
};

Band.prototype.artistsClicked = function(){
	$.get(SERVER+"/DBAjaxReq.php",{func:"artists_from_band",data:{band_type:this.userDetails.band_type,band_name: this.userDetails.band_name}},$.proxy(this.artistsAvailable,this),type="json");	
};

Band.prototype.artistsAvailable = function(data){
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
	dialog.setTitle(this.userDetails.band_name);
	}
};

Band.prototype.musicClicked = function(){
	$.get(SERVER+"/DBAjaxReq.php",{func:"band_music",data:{band_type:this.userDetails.band_type,band_name: this.userDetails.band_name}},$.proxy(this.musicAvailable,this),type="json");	
};

Band.prototype.musicAvailable = function(data){
	if(data.rCode == 0){
	var cdata = {};
	cdata.names = [];
	for(var i = 0; i < data.data.length; i++){
		cdata.names.push({fname: data.data[i].category +"  "+data.data[i].sub_category});
	}
	/*cdata.names[0] = {fname:"Madhukar"};
	cdata.names[1] = {fname:"Sudhakar"};
	cdata.names[2] = {fname:"Mayank"};
	cdata.names[3] = {fname:"Ashutosh"};*/
	data = {};
	data.data = cdata.names;
	var memData = {names: data.data};
	var dialog = _u.getMusicDialog(memData);
	dialog.show();
	dialog.setTitle("Members of "+this.band_name);
	}
};

Band.prototype.reviewBand = function(){
	var stars = 0;
	var dialog = _u.getReviewDialog();	
	dialog.show();	
	dialog.setTitle("Review Band - "+this.userDetails.concert_name);
    $('.review-stars').jRating({ type:'big',
    							   length: 10, 
    							   decimalLength : 1, 
    							   canRateAgain : true, 
    							   nbRates : 1000000, 
    							   step : true, 
    							   onClick: $.proxy(this.setStars,this), 
    							   rateMax: 10});
	var setStars = function(elem,rate){
		stars = rate;
	}
	var that = this;
	$('.review-submit').click(function(){
		var rText = $('.review-tarea').val().trim()
		if(rText == ""){
			alert("enter review text");
			return;
		}	
		that.addReiviewToUi(rText);
		$.get(SERVER+"/"+"DBAjaxReq.php",
			{func:"concert_review", data:{cid: that.cid, crating: stars, creview_txt: rText }},
			type="json");
		dialog.close();
	});
};

Band.prototype.addReiviewToUi = function(rText){
	var date = new Date();
		var month = parseInt(date.getMonth()) + 1;
		month = month < 10 ? "0"+month : month;
		var day = parseInt(date.getDate()) < 10 ? "0"+date.getDate() : date.getDate();
		var hour = parseInt(date.getHours()) < 10 ? "0"+date.getHours() : date.getHours();
		var minutes = parseInt(date.getMinutes()) < 10 ? "0"+date.getMinutes() : date.getMinutes();
		var seconds = parseInt(date.getSeconds()) < 10 ? "0"+date.getSeconds() : date.getSeconds();
		var time = date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
	var cdata = {reviewed_by: this.userDetails.uname, fname: this.userDetails.fname, reviewed_on: time, review_text : rText };
	var review = this.getReviewTmpl(cdata);
	$('.band-review-section').append(review);
};

Band.prototype.showMembers = function(){
	/*$.get(SERVER+"/"+"DBAjaxReq.php",
				 {func:"fan_list",data:{bname: this.initialData.name, btype: "group" }},
				 $.proxy(this.w.membersAvailable,this),
				 type="json");*/
	this.membersAvailable();
};

Band.prototype.membersAvailable = function(data){
	var cdata = {};
	cdata.names = [];
	cdata.names[0] = {fname:"Madhukar"};
	cdata.names[1] = {fname:"Sudhakar"};
	cdata.names[2] = {fname:"Mayank"};
	cdata.names[3] = {fname:"Ashutosh"};
	data = {};
	data.data = cdata.names;
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("Members of "+this.initialData.name);
}


/*Band.prototype.reviewBand = function(ref){
	var dialog = _u.getReviewDialog();	
	dialog.show();	
	dialog.setTitle("Review Band - "+ref.model.toJSON().name);
    $('.review-stars').jRating({ type:'big',
    							   length: 10, 
    							   decimalLength : 1, 
    							   canRateAgain : true, 
    							   nbRates : 1000000, 
    							   step : true, 
    							   onClick: $.proxy(this.setStars,this), 
    							   rateMax: 10});
	$('.review-submit').click(function(){
		var rText = $('.review-tarea').val().trim()
		if(rText == ""){
			alert("enter review text");
			return;
		}						   
		$.get(SERVER+"/"+"DBAjaxReq.php",
			{func:"band_review", data:{bname: ref.model.toJSON().name, btype: ref.model.toJSON().type, review_text: rText }},
			type="json");
		dialog.close();
	});
};

Band.prototype.likeBand = function(event,ref){
	
	if(!$(event.currentTarget).hasClass("band-liked")){
		$(event.currentTarget).addClass("band-liked");
		$(event.currentTarget).val("Unlike");
	}else{
		$(event.currentTarget).removeClass("band-liked");
		$(event.currentTarget).val("Like");
	}
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"band_like_unlike",data:{bname: ref.model.toJSON().name}},type="json");
	
};

Band.prototype.fansAvailable = function(data){
	
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("People who like "+this.model.toJSON().name);
	
};

Band.prototype.showFans = function(event){
			$.get(SERVER+"/"+"DBAjaxReq.php",
				 {func:"fan_list",data:{bname: this.model.toJSON().name, btype: this.model.toJSON().type }},
				 $.proxy(this.fansAvailable,this),
				 type="json");
			
}*/

