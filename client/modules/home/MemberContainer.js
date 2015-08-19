define(['Member.js'],function(){

MemberContainer = Backbone.View.extend({
	
});

MemberContainer.prototype.initialize = function(){
	this.childViews = [];
	if(!this.model){
		var memberContainerModel = Backbone.Model.extend({});
		this.model = new memberContainerModel();
	}	
	this.template = _.template(this.getTemplate());
	this.el = $(this.template(this.getDispModel()));
	this.model.on("change",this.memberDataChanged,this);
};

MemberContainer.prototype.setType = function(value){
	this.location = value;
};

MemberContainer.prototype.memberDataChanged = function(){
	if($('.member-holder .loading')){
		$('.member-holder .loading').remove();
	}
	if(!this.memberObj){
		var userMember = false;
		this.memberObj = new Member(this.location);
		//this.memberObj.location = "membersearch";
		this.memberCollection = this.memberObj.getCollection();
	}	
	var membermodel,that = this;
	var memberData = this.getDispModel().get("users");
	this.modifyCollection(memberData);
	$.each(memberData,function(key,obj){
		if(!(membermodel = that.isMemberExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getMemberKey(obj)},obj)
			memberModel = that.memberObj.getNewModel();
			memberModel.set(newObj);
			memberView = that.memberObj.getNewView({model: memberModel});
			that.memberCollection.push(memberModel);
			that.childViews[that.getMemberKey(obj)] = memberView;
			that.el.append(memberView.$el);
		}else{
			var data = membermodel.toJSON();
			$.extend(data,obj);
			membermodel.set(data);
		}
	});	
	
}; 

MemberContainer.prototype.modifyCollection = function(data){
	var that = this;
	var found = false;
	
	var ids = this.memberCollection.pluck("id"); 
	for(var i=0; i<ids.length; i++){
		found = false;
		for(var j=0; j<data.length; j++){
			if(ids[i] == that.getMemberKey(data[j])){
				found = true;
				break;
			}
		}
		if(!found){
			this.memberCollection.remove(this.memberCollection.get(ids[i]));
			this.childViews[ids[i]].remove();
		}
	}
}


MemberContainer.prototype.getTemplate = function(){	
	var ret =
	'<div class = "member-container">\
	</div>';
	return ret;
};

MemberContainer.prototype.getDispModel = function(){
	return this.model;
};

MemberContainer.prototype.setModelData = function(data){	
	this.model.set(data);
	//this.model.trigger('change');
};

MemberContainer.prototype.isMemberExists = function(data){
	var key = this.getMemberKey(data);
	return this.memberCollection.get(key);
};

MemberContainer.prototype.getMemberKey = function(data){
	var key;
	key = data.uname;
	return key;
};	
	
});

