define(['fbrating'],function(){

Band = function(value){
	this.userReco = value;
	
	//band model
	this.bandItemModel = Backbone.Model.extend({});
	
	//collection of band items
	this.bandCollection = Backbone.Collection.extend({model: this.bandItemModel});
	
	//view of band
	this.bandView = Backbone.View.extend({
		w: this,
		el: '<div class="band-item"></div>',
		events: {
			"click .band-members": "showBandMembers",
			"click .band-like": "likeBand",
			"click .band-review": "reviewBand",
			"click .band-fans": "showFans",
			"click .nav-for-band-name": "componentClick",
			"click .nav-for-band-img": "componentClick",
		},
		componentClick: function(event){
			_u.componentClick("band",this.model.toJSON());
		},
		initialize: function(){
			this.model.on("change",this.render,this);
			this.$el.html(this.template(this.model.toJSON()));
		},	
		template: _.template(this.getTemplate()),
		render: function(){				
			this.$el.html(this.template(this.model.toJSON()));
		},
		getModel: function(){
			return this.model;
		},
		showBandMembers: function(){
			$.proxy(this.w.showBandMembers(this.model.toJSON().name,this.model.toJSON().type),this.w);
		},
		likeBand: function(event){
			$.proxy(this.w.likeBand(event,this));
		},
		reviewBand: function(event){
			$.proxy(this.w.reviewBand(this));
		},
		showFans: function(event){
			$.get(SERVER+"/"+"DBAjaxReq.php",
				 {func:"fan_list",data:{bname: this.model.toJSON().name, btype: this.model.toJSON().type }},
				 $.proxy(this.w.showFans,this),
				 type="json");
			
		}
		
		
		/*<img src="<%=img_url%>"></img>\
				<div><a>click here for members</a></div>\*/
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

Band.prototype.reviewBand = function(ref){
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

Band.prototype.setStars = function(){
};


Band.prototype.showFans = function(data){
	/*var data = {};
	data.names = [];
	data.names[0] = {fname:"Madhukar"};
	data.names[1] = {fname:"Sudhakar"};
	data.names[2] = {fname:"Mayank"};
	data.names[3] = {fname:"Ashutosh"};*/
	var memData = {names: data.data};
	var dialog = _u.getMembersDialog(memData);
	dialog.show();
	dialog.setTitle("People who like "+this.model.toJSON().name);
	
};

Band.prototype.showBandMembers = function(name,type){
	var data = {};
	data.names = [];
	data.names[0] = "Madhukar";
	data.names[1] = "Sudhakar";
	data.names[2] = "Mayank";
	data.names[3] = "Ashutosh";
	var dialog = _u.getMembersDialog(data);	
	dialog.show();
	dialog.setTitle("ARTISTS");
};

Band.prototype.getNewView = function(data){
	return new this.bandView(data);
};

Band.prototype.getNewModel = function(){
	return new this.bandItemModel();
}

Band.prototype.getCollection = function(){
	return new this.bandCollection();
}

Band.prototype.getSysRecoBandItemTemplate = function(){
	var ret = 
	//'<div class="band-item">'
		this.getBandItemTemplate();	
	//'</div>'				
	return ret;
};

Band.prototype.getBandItemTemplate = function(){
	var ret = 
	'<span class="nav-for-band-name"><%=name%></span>\
	<img class="nav-for-band-img" src="<%=BAND_PICS%>/<%=img_url%>"></img>\
	<div><a class="band-members">Band Members</a></div>'
	return ret;
};

Band.prototype.getBandSearchItemTemplate = function(){
	var ret = 
	//'<div class="band-item">
	'<div class="band-item-border">\
	<span class="nav-for-band-name"><%=name%></span>\
	<table><tr><td>\
	<img class="nav-for-band-img" src="<%=BAND_PICS%>/<%=img_url%>"></img>\
	</td><td>\
	<%if(has_liked){%>\
	<input class="band-like band-liked" type="button" value = "Unlike">\
	<%}else{%>\
	<input class="band-like" type="button" value = "Like">\
	<%}%>\
	<input class="band-review" type="button" value = "Review">\
	<input class="band-fans" type="button" value = "Fans">\
	</td></tr></table>\
	<div><a class="band-members">Band Members</a></div>\
	</div>';
	//</div>'
	return ret;
};

Band.prototype.getTemplate = function(){
	if(this.userReco == "userreco"){
		return this.getUserRecoBandItemTemplate();
	}
	if(this.userReco == "sysreco"){
		return this.getSysRecoBandItemTemplate();
	}
	if(this.userReco == "bandsearch"){
		return this.getBandSearchItemTemplate();
	}
}

Band.prototype.getUserRecoBandItemTemplate = function(){
	var ret = 
	//'<div class="band-item">
		'<table class="band-item-holder">\
			<tr>\
			<td class="band-item-image-cont">'
				+ this.getBandItemTemplate() +
			'</td>\
			<td>\
				<% \
					var t= time.split(" ")[1];\
					var d = time.split(" ")[0];\
				%>\
				<div class="band-reco-by">Recommended by <%=recommended_by%> on <%=d%> at <%=t%></div>\
			</td>\
			</tr>\
		</table>';
	//</div>'
	return ret;
};



});