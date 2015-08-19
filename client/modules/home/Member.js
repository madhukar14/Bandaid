define(function(){

Member = function(value){
	this.userReco = value;
	
	//member model
	this.memberItemModel = Backbone.Model.extend({});
	
	//collection of member items
	this.memberCollection = Backbone.Collection.extend({model: this.memberItemModel});
	
	//view of member
	this.memberView = Backbone.View.extend({
		w: this,
		el: '<div class="member-item"></div>',
		events:{
			"click .member-follow": "follow",
			"click .nav-for-member-name": "componentClick",
			"click .nav-for-member-img": "componentClick",
		},
		componentClick: function(event){
			_u.componentClick("profile",this.model.toJSON());
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
		follow: function(event){
			$.proxy(this.w.follow(event,this));
		},
		
		/*<img src="<%=img_url%>"></img>\
				<div><a>click here for members</a></div>\*/
	});
};

Member.prototype.follow = function(event,ref){
	if(!$(event.currentTarget).hasClass("member-followed")){
		$(event.currentTarget).addClass("member-followed");
		$(event.currentTarget).val("Following");
	}else{
		$(event.currentTarget).removeClass("member-followed");
		$(event.currentTarget).val("Follow");
	}
	$.get(SERVER+"/"+"DBAjaxReq.php",{func:"member_follow_unfollow",data:{follow_user: ref.model.toJSON().uname}},type="json");
}

Member.prototype.getNewView = function(data){
	return new this.memberView(data);
};

Member.prototype.getNewModel = function(){
	return new this.memberItemModel();
}

Member.prototype.getCollection = function(){
	return new this.memberCollection();
}

Member.prototype.getTemplate = function(){
	
	return this.getMemberSearchItemTemplate();
}

Member.prototype.getMemberSearchItemTemplate = function(){
	var ret=
	//'<div class="member-item">
	'<%if(is_artist){%>\
	<img class="artist-identity" src="/bandaid/client/lib/css/images/tick.png"></img>\
	<span class="member-name nav-for-member-name side-shift"><%=fname%></span><br>\
	<%}else{%>\
	<span class="member-name nav-for-member-name"><%=fname%></span><br>\
	<%}%>\
	<img class="member-image nav-for-member-img" src="<%=PROFILE_PICS%>/<%=url%>"></img><br>\
	<%if(following){%>\
	<input class="member-follow member-followed" type="button" value ="Following"></input>\
	<%}else{%>\
	<input class="member-follow" type="button" value="Follow"></input>\
	<%}%>'
	//</div>';
	return ret;
};
});