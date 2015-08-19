define(function(){

MyRecoItem = function(value){
	this.type = value;
	
	//member model
	this.myRecoItemModel = Backbone.Model.extend({});
	
	//collection of member items
	this.myRecoItemCollection = Backbone.Collection.extend({model: this.myRecoItemModel});
	
	//view of member
	this.myRecoItemView = Backbone.View.extend({
		el: '<div class="my-reco-item"></div>',
		events:{
		"click img": "deleteItem"
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
		deleteItem: function(){
			this.parent.deleteData(this);
			
		},
		setParentRef: function(ref){
			this.parent = ref;
		}
		
		/*<img src="<%=img_url%>"></img>\
				<div><a>click here for members</a></div>\*/
	});
};

//MyRecoItem.prototype.deleteItem

MyRecoItem.prototype.getNewView = function(data){
	return new this.myRecoItemView(data);
};

MyRecoItem.prototype.getNewModel = function(){
	return new this.myRecoItemModel();
}

MyRecoItem.prototype.getCollection = function(){
	return new this.myRecoItemCollection();
}

MyRecoItem.prototype.getTemplate = function(){
		return this.getMyRecoConcertItemTemplate();
}

MyRecoItem.prototype.getMyRecoBandItemTemplate = function(){
	var ret=
	//'<div class="member-item">
	'<img src="/bandaid/client/lib/css/images/delete.png"></img><span "my-reco-comment">Band - <%=band_name%> ( added on <%=recommended_on%> )</span>';
	//</div>';
	return ret;
};

MyRecoItem.prototype.getMyRecoConcertItemTemplate = function(){
	var ret=
	//'<div class="member-item">
	'<table><tr><td>\
	<img src="/bandaid/client/lib/css/images/delete.png"></img>\
	</td><td>\
	<span class="my-reco-concert-details"><%=concert_name%> performed by <%=band_name%> on <%=start_time%></span><br>\
    <span class="my-reco-added-on"> added on <%=recommended_on%></span>\
	</td></tr></table>';
	//</div>';
	return ret;
};


});