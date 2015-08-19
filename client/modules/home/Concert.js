define(function(){

Concert = function(value){
	this.userReco = value;
	
	//concert model
	this.concertItemModel = Backbone.Model.extend({});
	
	//collection of concert items
	this.concertCollection = Backbone.Collection.extend({model: this.concertItemModel});
	
	//view of concert
	this.concertView = Backbone.View.extend({
		el: '<div class="concert-item"></div>',
		w: this,
		events:{
			"click .concert-rsvp": "concertRsvp",
			"click .concert-review": "reviewConcert",
			"click .concert-attenders": "whosattending",
			"click .nav-for-concert-name":"componentClick",
			"click .nav-for-concert-img":"componentClick"
		},
		componentClick: function(event){
			_u.componentClick("concert",this.model.toJSON());
		},
		initialize: function(){
			this.model.on("change",this.render,this);
			this.$el.html(this.template(this.model.toJSON()));
		},	
		template: _.template(this.getTemplate()),
		render: function(){	
			this.$el.html(this.template(this.model.toJSON()));
			
		},
		concertRsvp: function(event){
			$.proxy(this.w.concertRsvp(event,this));
		},
		whosattending: function(){
			$.get(SERVER+"/"+"DBAjaxReq.php",
				 {func:"concert_attendee",data:{cid: this.model.toJSON().cid}},
				 $.proxy(this.w.whosattending,this),
				 type="json");
				 
		},
		reviewConcert: function(){
			$.proxy(this.w.reviewConcert(this));
		},
		getModel: function(){
			return this.model;
		}
		
		/*<img src="<%=img_url%>"></img>\
				<div><a>click here for members</a></div>\*/
	});
};

Concert.prototype.concertRsvp = function(event,ref){
	if(!$(event.currentTarget).hasClass("concert-unrsvp")){
		$(event.currentTarget).addClass("concert-unrsvp");
		$(event.currentTarget).val("C-RSVP");
	}else{
		$(event.currentTarget).removeClass("concert-unrsvp");
		$(event.currentTarget).val("RSVP");
	}
	console.log({cid: ref.model.toJSON().cid});
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"rsvp",data:{cid: ref.model.toJSON().cid}},type="json");
};

Concert.prototype.whosattending = function(data){
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("People who are attending "+this.model.toJSON().name);
	
};

Concert.prototype.reviewConcert = function(ref){
	var dialog = _u.getReviewDialog();	
	var stars = 0;
	var setStars = function(elem, rate){
		stars = rate;
	}
	dialog.show();	
	dialog.setTitle("Review concert - "+ref.model.toJSON().name);
    $('.review-stars').jRating({ type:'big',
    							   length: 10, 
    							   decimalLength : 1, 
    							   canRateAgain : true, 
    							   nbRates : 1000000, 
    							   step : true, 
    							   onClick: $.proxy(setStars), 
    							   rateMax: 10});
	$('.review-submit').click(function(){
		var rText = $('.review-tarea').val().trim()
		if(rText == ""){
			alert("enter review text");
			return;
		}	
		console.log({cid: ref.model.toJSON().cid, crating: stars, creview_txt: rText });
		$.get(SERVER+"/"+"DBAjaxReq.php",
			{func:"concert_review", data:{cid: ref.model.toJSON().cid, crating: stars, creview_txt: rText }},
			type="json");
		dialog.close();
	});
	
};





Concert.prototype.getNewView = function(data){
	return new this.concertView(data);
};

Concert.prototype.getNewModel = function(){
	return new this.concertItemModel();
}

Concert.prototype.getCollection = function(){
	return new this.concertCollection();
}

Concert.prototype.getSysRecoConcertItemTemplate = function(){
	var ret = 
	//'<div class="concert-item">'
		 this.getConcertItemTemplate();		
	//'</div>'				
	return ret;
};

Concert.prototype.getConcertItemTemplate = function(){
	var ret = 
	'<table><tr class="td-img-comp"><td>\
	<span class="nav-for-concert-name"><%=name%></span><br>\
	<img class = "nav-for-concert-img" src="<%=BAND_PICS%>/<%=pic_url%>"></img>\
	</td><td>\
	<div class="c-perf-by">Performed by <%=band_name%></div><br>\
	<div class="c-perf-on">on <%=start_time%></div><br>\
	<div class="c-perf-at">at <%=address%></div></td></tr>';
	return ret;
};

Concert.prototype.getTemplate = function(){
	if(this.userReco == "userreco"){
		return this.getUserRecoConcertItemTemplate();
	}
	
	if(this.userReco == "sysreco"){
	return this.getSysRecoConcertItemTemplate();
	}
	
	if(this.userReco == "concertsearch"){
		return this.getConcertSearchItemTemplate();
	}
}

Concert.prototype.getConcertSearchItemTemplate = function(){
	var ret=
	//'<div class="concert-item">
	'<div class="concert-name nav-for-concert-name"><%=concert_name%></div><br>\
	<table><tr>\
	<td>\
	<img class="concert-band-pic nav-for-concert-img" src="<%=BAND_PICS%>/<%=pic_url%>"></img>\
	</td>\
	<td>\
	<% \
		var t= start_time.split(" ")[1];\
		var d = start_time.split(" ")[0];\
	%>\
	<div class = "concert-date-time">On <%=d%> at <%=t%></div>\
	<div class = "concert-venue">in <%=address%></div>\
	<div class = "concert-band-name">by <%=band_name%></div>\
	</td>\
	</tr></table>\
	<%if (has_RSVPed){%>\
	<input class="concert-rsvp concert-unrsvp" type="button" value="C-RSVP"></input>\
	<%}else{%>\
	<input class="concert-rsvp" type="button" value="RSVP"></input>\
	<%}%>\
	<input class="concert-review" type="button" value="Review"></input>\
	<input class="concert-attenders" type="button" value="Who\'s attending"></input>'
	//</div>';
	return ret;
};

Concert.prototype.getUserRecoConcertItemTemplate = function(){
	var ret = 
	//'<div class="concert-item">
		'<table class="concert-item-holder">\
			<tr>\
			<td class="concert-item-image-cont">\
				<span class="nav-for-concert-name"><%=concert_name%></span>\
				<img class="nav-for-concert-img" src="<%=BAND_PICS%>/<%=pic_url%>"></img>\
			</td>\
			<td class="c-something">\
				<% \
					var t= recommended_on.split(" ")[1];\
					var d = recommended_on.split(" ")[0];\
				%>\
				<div class="c-perf-by">Performed by <%=band_name%></div><br>\
				<div class="concert-reco-by">Recommended by <%=recommended_by%> on <%=d%> at <%=t%></div>\
				<div class="concert-reco-by-title">Reco Title -  <%=title%></div>\
			</td>\
			</tr>\
		</table>'
	//</div>'
	return ret;
};
});