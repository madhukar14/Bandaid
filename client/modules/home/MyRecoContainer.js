define(['home/MyRecoTitleItem'],function(){

MyRecoContainer = Backbone.View.extend({
	
});

MyRecoContainer.prototype.initialize = function(){
	this.childViews = [];	
	if(!this.model){
		var myRecoContainerModel = Backbone.Model.extend({});
		this.model = new myRecoContainerModel();
	}	
	this.template = _.template(this.getTemplate());
	this.el = $(this.template(this.getDispModel()));
	this.model.on("change",this.myRecoTitleItemDataChanged,this);
};

MyRecoContainer.prototype.setType = function(value){
	this.location = value;
};

MyRecoContainer.prototype.setBands = function(data){
	this.bands = data;
}

MyRecoContainer.prototype.setConcerts = function(data){
	this.concerts = data;
}

MyRecoContainer.prototype.setVenues = function(data){
	this.venues = data;
}

MyRecoContainer.prototype.fetchData = function(respData,data){
	var that = this;
	/*var data = this.getMyRecoData(1);
	this.setBands(this.getBands());
	this.setConcerts(this.getConcerts());
	this.setVenues(this.getVenues());
	setTimeout(function(){
		that.setModelData(data);
	}, 1000);*/
	if(data){
		$.get(SERVER+"/DBAjaxReq.php",{func:"usr_rec",data:{uname: data} },$.proxy(this.recommendationsAvailable,this), type="json");
		
	}else{
		$.get(SERVER+"/DBAjaxReq.php",{func:"usr_rec",data:{} },$.proxy(this.recommendationsAvailable,this), type="json");
		$.get(SERVER+"/DBAjaxReq.php",{func:"return_concert_data",data:{} },$.proxy(this.allConcertsAvailableInitially,this), type="json");
	}
	
};

MyRecoContainer.prototype.allConcertsAvailableInitially = function(data){
	if(data.rCode ==0 ){
		this.setConcerts(data.data);
	}
	
}

MyRecoContainer.prototype.allConcertsAvailable = function(data){
	if(data.rCode ==0 ){
		this.setConcerts(data.data);
		this.showRecoDial();
	}
	
}

MyRecoContainer.prototype.recommendationsAvailable = function(data){
	if(data.rCode == 0){
		this.setModelData(data.data)
	}
};

MyRecoContainer.prototype.getBands = function(){
	this.bands = [{name: "abc", type: "solo"},
				  {name: "def", type: "solo"},
				  {name: "123", type: "solo"},
				  {name: "234", type: "group"},
				  {name: "xyz", type: "group"},
				  {name: "@@@", type: "group"},
				  {name: "kkk", type: "solo"}];
	return this.bands;
}

MyRecoContainer.prototype.getConcerts = function(){
	this.concerts = [{cid:"c1",concert_name:"charlies concert",band_name:"abc", band_type:"solo",start_time:"12/04/2014 10:30:44",end_time: "12/04/2014 11:20:00",added_by:"madsam",fee:30,capacity: 300, no_tickets_available: 300, street:"senator",city:"manhattan", venueid:"1", name:"the great canyon", zipcode:"51220"},
	{cid:"c2",concert_name:"wikis concert",band_name:"xyz", band_type:"group",start_time:"13/04/2014 10:30:44",end_time: "14/04/2014 11:20:00",added_by:"samaklak",fee:30,capacity: 300, no_tickets_available: 300, street:"senator",city:"brooklyn", venueid:"2", name:"whatever", zipcode:"51220" },
	{cid:"c3",concert_name:"baileys concert",band_name:"@@@", band_type:"group",start_time:"12/04/2014 10:30:44",end_time: "12/04/2014 11:20:00",added_by:"whosoever",fee:30,capacity: 300, no_tickets_available: 300, street:"senator",city:"alaska", venueid:"3", name:"who cares", zipcode:"51222"}];
	return this.concerts;
}

MyRecoContainer.prototype.getVenues = function(){
	this.venues = [{venueid:"1",city:"manhattan",street:"senator",name:"the great canyon", zipcode:"51220"},
				   {venueid:"2",city:"brooklyn",street:"senator",name:"whatever", zipcode:"51220" },
				   {venueid:"3",city:"alaska",street:"senator",name:"who cares", zipcode:"51222" }];
				   
	return this.venues;
};

MyRecoContainer.prototype.getMyRecoData = function(input){
if(input == 1)
data= {
	recommendations: [{title:"My fav jazz", 
					   items:[{band_name:"abc", band_type: "solo", concert_name:"charlies concert", cid:"c1", start_time:"12/04/2014 10:30:44", recommended_on : "14/04/1990 10:20:22", street: "senator", city: "manhattan"},
					   {band_name:"xyz", band_type: "group", concert_name:"wikis concert", cid:"c2", start_time:"13/04/2014 10:30:44", recommended_on : "14/04/1990 10:20:22",street: "senator", city: "brooklyn"}]},
					   {title:"My fav aucostics", 
					   items:[{band_name:"abc", band_type: "solo", concert_name:"charlies concert", cid:"c1", start_time:"12/04/2014 10:30:44", recommended_on : "14/04/1990 10:20:22", street: "senator", city: "manhattan"},
					   {band_name:"@@@", band_type: "group", concert_name:"baileys concert", cid:"c3", start_time:"12/04/2014 10:30:44", recommended_on: "14/04/1990 10:20:22", street: "senator", city: "alaska"}]}]
};
else

data= {
	recommendations: [{title:"My fav jazz", 
					   items:[{band_name:"madhukar", band_type: "solo", concert_name:"Awesome concert", cid:"c1", start_time:"14/04/1990 10:20:22", recommended_on : "14/04/1990 10:20:22", street: "manhattan", city: "newyork"},
					   {band_name:"beyonce", band_type: "solo", concert_name:"Awesome concert", cid:"c2", start_time:"14/04/1990 10:20:22", recommended_on : "14/04/1990 10:20:22",street: "manhattan", city: "newyork"}]}]
		};
return data;
};

MyRecoContainer.prototype.myRecoTitleItemDataChanged = function(){
	if($('.myReco-holder .loading')){
		$('.myReco-holder .loading').remove();
	}
	if(!this.myRecoTitleItemObj){
		var userMyReco = false;
		this.myRecoTitleItemObj = new MyRecoTitleItem();
		//this.myRecoTitleItemObj.location = "myRecoTitleItemsearch";
		this.myRecoTitleItemCollection = this.myRecoTitleItemObj.getCollection();
	}	
	
	var myRecoData = this.getDispModel().get("recommendations");
	this.modifyCollection(myRecoData);
	//var myRecoTitleItemmodel,that = this;
	/*$.each(myRecoData,function(key,obj){
		if(!(myRecoTitleItemmodel = that.isMyRecoTitleItemExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getMyRecoTitleItemKey(obj)},obj)
			myRecoTitleItemModel = that.myRecoTitleItemObj.getNewModel();
			myRecoTitleItemModel.set(newObj);
			myRecoTitleItemView = that.myRecoTitleItemObj.getNewView({model: myRecoTitleItemModel});
			that.myRecoTitleItemCollection.push(myRecoTitleItemModel);	
			that.childViews[that.getMyRecoTitleItemKey(obj)] = myRecoTitleItemView;
			that.el.append(myRecoTitleItemView.$el);
		}else{
			var data = myRecoTitleItemmodel.toJSON();
			var view = that.childViews[that.getMyRecoTitleItemKey(data)];
			$.extend(true,data,obj);
			//myRecoTitleItemmodel.set(data);			
			view.setModelData(data);
		}
	});	*/
	
	var myRecoTitleItemmodel;
	for(var i =0; i < myRecoData.length; i++){
		var obj = myRecoData[i];
		if(!(myRecoTitleItemmodel = this.isMyRecoTitleItemExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:this.getMyRecoTitleItemKey(obj)},obj)
			var myRecoTitleItemModel = this.myRecoTitleItemObj.getNewModel();
			myRecoTitleItemModel.set(newObj);
			var myRecoTitleItemView = this.myRecoTitleItemObj.getNewView({model: myRecoTitleItemModel});
			myRecoTitleItemView.setParentRef(this);
			this.myRecoTitleItemCollection.push(myRecoTitleItemModel);	
			this.childViews[this.getMyRecoTitleItemKey(obj)] = myRecoTitleItemView;
			this.el.append(myRecoTitleItemView.$el);
		}else{
			var data = myRecoTitleItemmodel.toJSON();
			var view = this.childViews[this.getMyRecoTitleItemKey(data)];
			$.extend(true,data,obj);
			//myRecoTitleItemmodel.set(data);			
			view.setModelData(data);
		}
	}
	
}; 

MyRecoContainer.prototype.deleteData = function(recoTitle){
	key = this.getMyRecoTitleItemKey(recoTitle.model.toJSON());
	var model = this.myRecoTitleItemCollection.get(key);
	this.myRecoTitleItemCollection.remove(model);
	this.childViews[key].remove();
	delete this.childViews[key];
	for(var k = 0; k < this.model.get("recommendations").length; k++){
		if(this.model.get("recommendations")[k].title == key){
			var pos = k;
			break;
		}
	}
	this.model.get("recommendations").splice(k,1);
	model.clear({silent:true});
};

MyRecoContainer.prototype.modifyCollection = function(data){
	var that = this;
	var found = false;
	
	var ids = this.myRecoTitleItemCollection.pluck("id"); 
	for(var i=0; i<ids.length; i++){
		found = false;
		for(var j=0; j<data.length; j++){
			if(ids[i] == that.getMyRecoTitleItemKey(data[j])){
				found = true;
				break;
			}
		}
		if(!found){
			this.myRecoTitleItemCollection.remove(this.myRecoTitleItemCollection.get(ids[i]));
			this.childViews[ids[i]].remove();
			delete this.childViews[ids[i]];
		}
	}
}


MyRecoContainer.prototype.getTemplate = function(){	
	var ret =
	'<div class = "myReco-container">\
	</div>';
	return ret;
};

MyRecoContainer.prototype.getDispModel = function(){
	return this.model;
};

MyRecoContainer.prototype.setModelData = function(data){	
	this.model.set(data);
	this.model.trigger('change');
};

MyRecoContainer.prototype.isMyRecoTitleItemExists = function(data){
	var key = this.getMyRecoTitleItemKey(data);
	return this.myRecoTitleItemCollection.get(key);
};

MyRecoContainer.prototype.getMyRecoTitleItemKey = function(data){
	var key;
	key = data.title;
	return key.toLowerCase();
};	

MyRecoContainer.prototype.makeRecommendation = function(){
	$.get(SERVER+"/DBAjaxReq.php",{func:"return_concert_data",data:{} },$.proxy(this.allConcertsAvailable,this), type="json");
	
}

MyRecoContainer.prototype.showRecoDial = function(){
	newData = {concerts: this.concerts, recommendations: this.model.toJSON().recommendations};
	
	var tmpl = '<span class="add-new-reco-details">Add a new Recommednation title</span><br>\
					<input class="reco-new-title" type="textfield"></input><br>\
					<span class="add-reco-or"> OR </span><br>';
	if(newData.recommendations.length > 0){
		tmpl = tmpl + 
		'<span class="add-existing-reco-title">Select an existing title</span><br>\
		 <select class="reco-title-select-list">\
			<option value="-1" selected="selected">Select an existing title</option>'
			for(var i=0; i < newData.recommendations.length; i++){
			tmpl = tmpl +
			'<option value="'+newData.recommendations[i].title+'">'+ newData.recommendations[i].title +'</option>';			
			}
			tmpl = tmpl +
		'</select>';	
    } 
	if(newData.concerts.length > 0){
		tmpl = tmpl + 
		'<br>\
		<span class="reco-select-concert-to-rec">Select a concert to recommend</span><br>\
		<select class="reco-concert-select-list">\
		<option value="-1" selected="selected">Select a concert to recommend</option>';
		for(var j=0; j < newData.concerts.length; j++){
		tmpl = tmpl + 
		'<option value="' + newData.concerts[j].cid + '">' + newData.concerts[j].concert_name +" on " + newData.concerts[j].start_time +'</option>';
		}
		tmpl = tmpl +
		'</select>';
	}
	tmpl = tmpl + '<br><textarea class="why-this-reco" placeholder="Why do you recommend this concert ??"></textarea><br><input class="add-reco-now" type="button" value="Add Recommendation"></input>';
	

	console.log(tmpl);
	
	this.d = _u.getDialog({height: 400, width: 500, modal: true});
	this.d.addContent(tmpl);
	this.d.show();
	this.d.setTitle("Add Recommendations");
	$('.add-reco-now').click($.proxy(this.addRecommendation,this));
	$('.reco-title-select-list').change(function(){
		$('.reco-new-title').val("");
	});	
	$('.reco-new-title').focus(function(){
		$('.reco-title-select-list').val("-1");
	});
	
};

MyRecoContainer.prototype.addRecommendation = function(){
	var sendData = {};
	
	
	
		
	
	// if both new title and existing title are not selected
   if($('.reco-new-title').val() == "" && ($('.reco-title-select-list').val() == "-1" || !$('.reco-title-select-list').val())){
		if(!$('.reco-title-select-list').val()){
			alert("Add a new title");
		}else{
			alert("Add a new title or select an existing title");
		}
		return;
   }
   
   //if concert is not selected
   if($('.reco-concert-select-list').val() == "-1"){
		alert("Select a concert to recommend");
		return;
   }
   
   //If it is an existing title
   if($('.reco-new-title').val() == ""){
		var title = this.childViews[$('.reco-title-select-list').val().toLowerCase()];
		
		//if the concert already exists under the same title
		var recoItem = title.childViews[$('.reco-concert-select-list').val().toLowerCase()];
		if(recoItem){
			alert("cannot recommend the same concert under the same title");
			return;
		}
		sendData = {recom_no: Object.keys(this.childViews).length + 1, 
					recom_title: $('.reco-title-select-list').val(), 
					recom_review : $('.why-this-reco').val(),
					cid : $('.reco-concert-select-list').val(),
					
					};
		console.log(sendData);	
		
		var index = 0
		for(var j = 0; j< this.concerts.length; j++){
			if(this.concerts[j].cid == sendData.cid){
				index = j;
			}
		}
		var c = this.concerts[index];
		
		/*var vindex = 0
		for(var j = 0; j < this.venues; j++){
			if(this.venues[j].venueid == this.concerts[index].venueid){
				vindex = j;
				break;
			}
		}
		var v = this.venues[vindex];*/
		
		var addedData = {recommendations: [{title:sendData.recom_title, 
					   items:[{rno: Object.keys(this.childViews).length + 1, band_name:c.band_name, band_type: c.band_type, concert_name:c.concert_name, cid:c.cid, start_time:c.start_time, recommended_on : "14/04/1990 10:20:22"}]}]};
		
		//This is how i will be getting the return data from backend after submitting
		var retData = this.getDispModel().toJSON();
		for(var i = 0; i < retData.recommendations.length; i++){
			if(retData.recommendations[i].title == addedData.recommendations[0].title){
				for(var j = 0; j< addedData.recommendations[0].items.length; j++){
					retData.recommendations[i].items.push(addedData.recommendations[0].items[j]);
				}
			}
		}
		
   }else{
	   sendData = {recom_no: 1,
				   recom_title: $('.reco-new-title').val(),
				   recom_review:  $('.why-this-reco').val(),
				   cid : $('.reco-concert-select-list').val()
				  };
		console.log(sendData);			   
		var title = this.childViews[$('.reco-new-title').val().trim().toLowerCase()];		 
		if(title){
			alert("cannot use an existing title. Use a different one");
			return;
		}
		
		var index = 0
		for(var j = 0; j< this.concerts.length; j++){
			if(this.concerts[j].cid == sendData.cid){
				index = j;
			}
		}
		var c = this.concerts[index];
		
		/*var vindex = 0
		for(var j = 0; j < this.venues; j++){
			if(this.venues[j].venueid == this.concerts[index].venueid){
				vindex = j;
				break;
			}
		}
		var v = this.venues[vindex];*/
		
		var retData = this.getDispModel().toJSON();
		var addedData = {recommendations: [{title:sendData.recom_title, 
					   items:[{rno:1, band_name:c.band_name, band_type: c.band_type, concert_name:c.concert_name, cid:c.cid, start_time:c.start_time, recommended_on : "14/04/1990 10:20:22"}]}]};
					   
		//retData.recommendations.push(addedData.recommendations);
		
		for(var i =0; i < addedData.recommendations.length; i++){
			retData.recommendations.push(addedData.recommendations[i]);
		}
		
   }
   
   $.extend(true,this.getDispModel().get("recommendations"),retData.recommendations);
   $.get(SERVER+"/DBAjaxReq.php",{func:"add_recomm",data:sendData}, $.proxy(this.recoAdded,this),type="json");     
   //
};

MyRecoContainer.prototype.recoAdded = function(data){
   if(data.rCode == 0){
		
   }
   this.setModelData(this.getDispModel().toJSON());
   this.d.close(); 
}

MyRecoContainer.prototype.addConcerts = function(){
$.get(SERVER+"/DBAjaxReq.php",{func:"validate_user",data:{}},$.proxy(this.userValidityAvailable,this),type="json");

};

MyRecoContainer.prototype.userValidityAvailable = function(data){
	if(data.rCode == 4){
		alert("you cannot add concerts as your trust score is low");
		return;
	}
	this.setBands(data.data.band);
	this.setVenues(data.data.venue);
	this.showConcertDialog();
}

MyRecoContainer.prototype.showConcertDialog = function(){
	var tmpl = 
	'<input type="textfield" class="add-concert-name" placeholder="Add a name to the concert"></input><br>';
	tmpl = tmpl +
	'<select class="add-concert-bands">'
	for(var i=0; i< this.bands.length; i++){
		tmpl = tmpl + '<option value="'+this.bands[i].name.toLowerCase()+'$$'+this.bands[i].type.toLowerCase()+'">'+this.bands[i].name+'</option>';
	}
	tmpl = tmpl +
	'</select><br>\
	<select class="add-concert-venues">'
	for(var i=0; i< this.venues.length; i++){
		tmpl = tmpl + '<option value="'+this.venues[i].venueid+'">'+this.venues[i].city+" city"+'</option>';
	}
	tmpl = tmpl +
	'</select><br>\
	<input type="textfield" id="from" class="add-concert-start-date" placeholder="select a start date"></input><br>\
	<input type="textfield" id="to" class="add-concert-end-date" placeholder="select a end date"></input><br>\
	<input type="textfield" class="add-concert-start-time" placeholder="What time does it start"></input><br>\
	<input type="textfield" class="add-concert-end-time" placeholder="What time does it end ?"></input><br>\
	<input type="textfield" class="add-concert-fee" placeholder="What is the cost of the ticket ?"></input><br>\
	<input type="textfield" class="add-concert-capacity" placeholder="What is the capacity of te venue?"></input><br>\
	<input type="textfield" class="add-concert-start-tickets" placeholder="How many tickets available ?"></input><br>\
	<input type="button" class="add-concert-submit" value="Add Concert"></input><br>';
	
	this.d = _u.getDialog({height:510, width: 500, modal: true});
	this.d.addContent(tmpl);
	this.d.show();
	this.d.setTitle("Add Concerts");
	$( "#from" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
	  dateFormat: 'yy-mm-dd',
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#to" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
	  dateFormat: 'yy-mm-dd',
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
	$('.add-concert-submit').click($.proxy(this.submitConcerts,this));
	
};


MyRecoContainer.prototype.submitConcerts = function(){
	var data = {cid: "c"+(this.concerts.length+1),
				concert_name:$('.add-concert-name').val().trim(),
				band_name:$('.add-concert-bands').val().split("$$")[0],
				band_type:$('.add-concert-bands').val().split("$$")[1],
				venueid:$('.add-concert-venues').val().trim(),
				start_time:$('.add-concert-start-date').val().trim() +" "+ $('.add-concert-start-time').val().trim(),
				end_time:$('.add-concert-end-date').val().trim() +" "+ $('.add-concert-end-time').val().trim(),
				fee:$('.add-concert-fee').val().trim(),
				capacity:$('.add-concert-capacity').val().trim(),
				no_tickets_available:$('.add-concert-start-tickets').val().trim()};
				console.log(data);
	$.get(SERVER+"/DBAjaxReq.php",{func:"insert_concert",data:data},$.proxy(this.concertAdded,this));
	
};

MyRecoContainer.prototype.concertAdded = function(){
	this.d.close();
};



	
});

