define(['Band.js'],function(){

MusicContainer = Backbone.View.extend({
	
});

MusicContainer.prototype.initialize = function(){
	this.childViews = [];
	if(!this.model){
		var musicContainerModel = Backbone.Model.extend({});
		this.model = new musicContainerModel();
	}	
	this.template = _.template(this.getTemplate());
	this.el = $(this.template(this.getDispModel()));
	this.model.on("change",this.bandDataChanged,this);
};

MusicContainer.prototype.setType = function(value){
	this.location = value;
};

MusicContainer.prototype.bandDataChanged = function(){
	if($('.music-holder .loading')){
		$('.music-holder .loading').remove();
	}
	if(!this.bandObj){
		var userMusic = false;
		this.bandObj = new Band(this.location);
		//this.bandObj.location = "bandsearch";
		this.bandCollection = this.bandObj.getCollection();
	}	
	var bandmodel,that = this;
	var musicData = this.getDispModel().get("band");
	this.modifyCollection(musicData);
	$.each(musicData,function(key,obj){
		if(!(bandmodel = that.isBandExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getBandKey(obj)},obj)
			bandModel = that.bandObj.getNewModel();
			bandModel.set(newObj);
			bandView = that.bandObj.getNewView({model: bandModel});
			that.bandCollection.push(bandModel);	
			that.childViews[that.getBandKey(obj)] = bandView;
			that.el.append(bandView.$el);
		}else{
			var data = bandmodel.toJSON();
			$.extend(data,obj);
			bandmodel.set(data);
		}
	});	
	
}; 


MusicContainer.prototype.modifyCollection = function(data){
	var that = this;
	var found = false;
	
	var ids = this.bandCollection.pluck("id"); 
	for(var i=0; i<ids.length; i++){
		found = false;
		for(var j=0; j<data.length; j++){
			if(ids[i] == that.getBandKey(data[j])){
				found = true;
				break;
			}
		}
		if(!found){
			this.bandCollection.remove(this.bandCollection.get(ids[i]));
			this.childViews[ids[i]].remove();
		}
	}
}


MusicContainer.prototype.getTemplate = function(){	
	var ret =
	'<div class = "music-container">\
	</div>';
	return ret;
};

MusicContainer.prototype.getDispModel = function(){
	return this.model;
};

MusicContainer.prototype.setModelData = function(data){	
	this.model.set(data);
};

MusicContainer.prototype.isBandExists = function(data){
	var key = this.getBandKey(data);
	return this.bandCollection.get(key);
};

MusicContainer.prototype.getBandKey = function(data){
	var key;
	if(this.userMusic){
		key = data.name + data.type + data.musicmmended_by + data.time;				
	}else{
		key = data.name + data.type;
	}
	return key;
};	
	
});

