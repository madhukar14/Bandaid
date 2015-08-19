define(['Concert.js'],function(){

ConcertContainer = Backbone.View.extend({
	
});

ConcertContainer.prototype.initialize = function(){
	this.childViews = [];
	if(!this.model){
		var concertContainerModel = Backbone.Model.extend({});
		this.model = new concertContainerModel();
	}	
	this.template = _.template(this.getTemplate());
	this.el = $(this.template(this.getDispModel()));
	this.model.on("change",this.concertDataChanged,this);
};

ConcertContainer.prototype.setType = function(value){
	this.location = value;
};

ConcertContainer.prototype.concertDataChanged = function(){
	if($('.concert-holder .loading')){
		$('.concert-holder .loading').remove();
	}
	if(!this.concertObj){
		var userConcert = false;
		this.concertObj = new Concert(this.location);
		//this.concertObj.location = "concertsearch";
		this.concertCollection = this.concertObj.getCollection();
	}	
	var concertmodel,that = this;
	var concertData = this.getDispModel().get("concert");
	this.modifyCollection(concertData);
	$.each(concertData,function(key,obj){
		if(!(concertmodel = that.isConcertExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getConcertKey(obj)},obj)
			concertModel = that.concertObj.getNewModel();
			concertModel.set(newObj);
			concertView = that.concertObj.getNewView({model: concertModel});
			that.concertCollection.push(concertModel);	
			that.childViews[that.getConcertKey(obj)] = concertView;
			that.el.append(concertView.$el);
		}else{
			var data = concertmodel.toJSON();
			$.extend(data,obj);
			concertmodel.set(data);
		}
	});	
	
}; 

ConcertContainer.prototype.modifyCollection = function(data){
	var that = this;
	var found = false;
	
	var ids = this.concertCollection.pluck("id"); 
	for(var i=0; i<ids.length; i++){
		found = false;
		for(var j=0; j<data.length; j++){
			if(ids[i] == that.getConcertKey(data[j])){
				found = true;
				break;
			}
		}
		if(!found){
			this.concertCollection.remove(this.concertCollection.get(ids[i]));
			this.childViews[ids[i]].remove();
		}
	}
}



ConcertContainer.prototype.getTemplate = function(){	
	var ret =
	'<div class = "concert-container">\
	</div>';
	return ret;
};

ConcertContainer.prototype.getDispModel = function(){
	return this.model;
};

ConcertContainer.prototype.setModelData = function(data){	
	this.model.set(data);
};

ConcertContainer.prototype.isConcertExists = function(data){
	var key = this.getConcertKey(data);
	return this.concertCollection.get(key);
};

ConcertContainer.prototype.getConcertKey = function(data){
	var key;
	key = data.cid;
	return key;
};	
	
});

