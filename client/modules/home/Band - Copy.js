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
		events: {
			"click .band-members": "showBandMembers",
			"click .band-like": "likeBand",
			"click .band-review": "reviewBand",
			"click .band-fans": "showFans",
		},
		initialize: function(){
			this.model.on("change",this.render,this);
			this.$el = $(this.template(this.model.toJSON()));
		},	
		template: _.template(this.getTemplate()),
		render: function(){	
			this.$el.empty();
			this.$el = $(this.template(this.model.toJSON()));
		},
		getModel: function(){
			return this.model;
		},
		showBandMembers: function(){
			$.proxy(this.w.showBandMembers(this.model.toJSON().name,this.model.toJSON().type),this.w);
		},
		likeBand: function(event){
			$.proxy(this.w.likeBand(event),this.w);
		},
		reviewBand: function(event){
			$.proxy(this.w.reviewBand(event,this.model.toJSON()),this.w);
		},
		showFans: function(event){
			$.proxy(this.w.showFans(event,this.model.toJSON()),this.w);
		}
		
		
		/*<img src="<%=img_url%>"></img>\
				<div><a>click here for members</a></div>\*/
	});
};

Band.prototype.likeBand = function(event){
	
	if(!$(event.currentTarget).hasClass("band-liked")){
		$(event.currentTarget).addClass("band-liked");
		$(event.currentTarget).val("Unlike");
	}else{
		$(event.currentTarget).removeClass("band-liked");
		$(event.currentTarget).val("Like");
	}
};

Band.prototype.reviewBand = function(event,data){
	var dialog = _u.getReviewDialog();	
	dialog.show();	
	dialog.setTitle("Review Band - "+data.name);
    $('.review-stars').jRating({ type:'big',
    							   length: 10, 
    							   decimalLength : 1, 
    							   canRateAgain : true, 
    							   nbRates : 1000000, 
    							   step : true, 
    							   onClick: $.proxy(this.setStars,this), 
    							   rateMax: 10});
};

Band.prototype.setStars = function(){
};


Band.prototype.showFans = function(event,modelData){
	var data = {};
	data.names = [];
	data.names[0] = "Madhukar";
	data.names[1] = "Sudhakar";
	data.names[2] = "Mayank";
	data.names[3] = "Ashutosh";
	var dialog = _u.getMembersDialog(data);
	dialog.show();
	dialog.setTitle("People who like "+modelData.name);
	
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
	'<div class="band-item">'
		+ this.getBandItemTemplate() +		
	'</div>'				
	return ret;
};

Band.prototype.getBandItemTemplate = function(){
	var ret = 
	'<span><%=name%></span>\
	<img src="<%=PROFILE_PICS%>/<%=img_url%>"></img>\
	<div><a class="band-members">Band Members</a></div>'
	return ret;
};

Band.prototype.getBandSearchItemTemplate = function(){
	var ret = 
	'<div class="band-item">\
	<div class="band-item-border">\
	<span><%=name%></span>\
	<table><tr><td>\
	<img src="<%=PROFILE_PICS%>/<%=img_url%>"></img>\
	</td><td>\
	<input class="band-like" type="button" value = "Like">\
	<input class="band-review" type="button" value = "Review">\
	<input class="band-fans" type="button" value = "Fans">\
	</td></tr></table>\
	<div><a class="band-members">Band Members</a></div>\
	</div>\
	</div>'
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
	'<div class="band-item">\
		<table class="band-item-holder">\
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
		</table>\
	</div>'
	return ret;
};



});