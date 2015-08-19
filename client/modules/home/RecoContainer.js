define(['Band.js','Concert.js'],function(){

RecoContainer = Backbone.View.extend({
 
});

RecoContainer.prototype.initialize = function(){
	if(!this.model){
		var recoContainerModel = Backbone.Model.extend({});
		this.model = new recoContainerModel();
	}		
	this.model.on("change:music",this.musicDataChanged,this);
	this.model.on("change:band",this.bandDataChanged,this);
	this.model.on("change:concert",this.concertDataChanged,this);
};

RecoContainer.prototype.setType = function(value){
	this.userReco = value;
	this.template = _.template(this.getTemplate());
	this.el = $(this.template(this.getDispModel()));
	if(this.userReco == "sysreco"){
		this.el.find('.accordion').accordion({ active: 1 });
	}else{
		this.el.find('.accordion').accordion({ active: 0 });
	}
};

RecoContainer.prototype.bandDataChanged = function(){
	if($('.reco-container .band-data .loading')){
		$('.reco-container .band-data .loading').remove();
	}
	if(!this.bandObj){
		var userReco = this.userReco //? this.userReco : false;
		this.bandObj = new Band(userReco);
		this.bandCollection = this.bandObj.getCollection();
	}	
	var bandmodel,that = this;
	var musicData = this.getDispModel().get("band");
	$.each(musicData,function(key,obj){
		if(!(bandmodel = that.isBandExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getBandKey(obj)},obj)
			bandModel = that.bandObj.getNewModel();
			bandModel.set(newObj);
			bandView = that.bandObj.getNewView({model: bandModel});
			that.bandCollection.push(bandModel);			
			that.el.find('.band-data').append(bandView.$el);
		}else{
			var data = bandmodel.toJSON();
			$.extend(data,obj);
			bandmodel.set(data);
		}
	});	
	
}; 

RecoContainer.prototype.musicDataChanged = function(){
	if($('.reco-container .music-data .loading')){
		$('.reco-container .music-data .loading').remove();;
	}
	console.log(this.model.toJSON().music);
};

RecoContainer.prototype.concertDataChanged = function(){
	if($('.reco-container .concert-data .loading')){
		$('.reco-container .concert-data .loading').remove();
	}
	if(!this.concertObj){
		var userReco = this.userReco //? this.userReco : false;
		this.concertObj = new Concert(userReco);
		this.concertCollection = this.concertObj.getCollection();
	}	
	var concertmodel,that = this;
	var musicData = this.getDispModel().get("concert");
	$.each(musicData,function(key,obj){
		if(!(concertmodel = that.isConcertExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getConcertKey(obj)},obj)
			concertModel = that.concertObj.getNewModel();
			concertModel.set(newObj);
			concertView = that.concertObj.getNewView({model: concertModel});
			that.concertCollection.push(concertModel);			
			that.el.find('.concert-data').append(concertView.$el);
		}else{
			var data = concertmodel.toJSON();
			$.extend(data,obj);
			concertmodel.set(data);
		}
	});	
}; 

RecoContainer.prototype.getTemplate = function(){	
	var ret =
	'<div class = "reco-container">\
		<div class="accordion">';
		if(this.userReco == "sysreco"){
			ret = ret +
			'<h3>BAND</h3>\
			<div class="band-data">\
				<img class="loading" src="loading.gif"</img>\
			</div>'
		}
			ret = ret +
			'<h3>CONCERT</h3>\
			<div class="concert-data">\
				<img class="loading" src="loading.gif"</img>\
			</div>\
		</div>\
	</div>'
	return ret;
};

RecoContainer.prototype.getDispModel = function(){
	return this.model;
};

RecoContainer.prototype.setModelData = function(data){	
	this.model.set(data);
	this.model.trigger('change');
};

RecoContainer.prototype.isBandExists = function(data){
	var key = this.getBandKey(data);
	return this.bandCollection.get(key);
};

RecoContainer.prototype.getBandKey = function(data){
	var key;
	if(this.userReco == "userreco"){
		key = data.name + data.type + data.recommended_by + data.time;				
	}else{
		key = data.name + data.type;
	}
	return key;
};	

RecoContainer.prototype.isConcertExists = function(data){
	var key = this.getConcertKey(data);
	return this.concertCollection.get(key);
};

/*RecoContainer.prototype.getConcertKey = function(data){
	var key;
	if(this.userReco == "userreco"){
		key = data.name + data.type + data.recommended_by + data.time;				
	}else{
		key = data.name + data.type;
	}
	return key;
};	*/

RecoContainer.prototype.getConcertKey = function(data){
	var key;
	if(this.userReco == "userreco"){
		key = data.cid+data.recommended_by + data.recommended_on;				
	}else{
		key = data.cid;
	}
	return key;
};
	
});

