define(['home/MyRecoItem'],function(){

MyRecoTitleItem = function(value){
	
	//member model
	this.myRecoTitleItemModel = Backbone.Model.extend({});
	
	//collection of member items
	this.myRecoTitleItemCollection = Backbone.Collection.extend({model: this.memberItemModel});
	
	//view of member
	this.myRecoTitleItemView = Backbone.View.extend({		
		w: this,
		el: '<div class="my-reco-title-item"></div>',
		initialize: function(){
			this.childViews = [];
			this.model.on("change",this.render,this);
			this.$el.html(this.template(this.model.toJSON()));
			this.render();;
		},	
		template: _.template(this.getTemplate()),
		render: function(){	
			if(!this.recoItemObj){		
				this.recoItemObj = new MyRecoItem();
				//this.bandObj.location = "bandsearch";
				this.recoItemCollection = this.recoItemObj.getCollection();
			}	
			
			var recoItemData = this.getModel().get("items");
			this.modifyCollection(recoItemData);
			//var recoItemmodel,that = this;
			/*$.each(recoItemData,function(key,obj){
				if(!(recoItemmodel = that.isrecoItemExists(obj))){
					var newObj = {};
					$.extend(newObj,{id:that.getrecoItemKey(obj)},obj)
					recoItemmodel = that.recoItemObj.getNewModel();
					recoItemmodel.set(newObj);
					recoItemView = that.recoItemObj.getNewView({model: recoItemmodel});
					that.recoItemCollection.push(recoItemmodel);
					that.childViews[that.getrecoItemKey(obj)] = recoItemView;
					that.$el.find('.my-reco-item-body').append(recoItemView.$el);
				}else{
					var data = recoItemmodel.toJSON();
					$.extend(data,obj);
					recoItemmodel.set(data);
				}
			});	*/
			
			var recoItemmodel;
			for(var i = 0; i < recoItemData.length; i++){				
				var obj = recoItemData[i];
				if(!(recoItemmodel = this.isrecoItemExists(obj))){
					var newObj = {};
					$.extend(newObj,{id:this.getrecoItemKey(obj)},obj)
					var recoItemmodel = this.recoItemObj.getNewModel();
					recoItemmodel.set(newObj);
					var recoItemView = this.recoItemObj.getNewView({model: recoItemmodel});
					recoItemView.setParentRef(this);
					this.recoItemCollection.push(recoItemmodel);
					this.childViews[this.getrecoItemKey(obj)] = recoItemView;
					this.$el.find('.my-reco-item-body').append(recoItemView.$el);
				}else{
					var data = recoItemmodel.toJSON();
					$.extend(data,obj);
					recoItemmodel.set(data);
				}
			}
		},
		getModel: function(){
			return this.model;
		},
		isrecoItemExists: function(data){
			var key = this.getrecoItemKey(data);
			return this.recoItemCollection.get(key);
		},
		getrecoItemKey: function(data){
			var key = data.cid;
			return key.toLowerCase();
		},
		modifyCollection: function(data){
			var that = this;
			var found = false;
	
			var ids = this.recoItemCollection.pluck("id"); 
			for(var i=0; i<ids.length; i++){
				found = false;
				for(var j=0; j<data.length; j++){
					if(ids[i] == that.getrecoItemKey(data[j])){
						found = true;
						break;
					}
				}
				if(!found){
					this.recoItemCollection.remove(this.recoItemCollection.get(ids[i]));
					this.childViews[ids[i]].remove();
					delete this.childViews[ids[i]];
				}
			}
		},
		setModelData: function(data){
				this.model.set(data);
				this.model.trigger('change');
		},
		deleteData: function(recommendation){
			var data = recommendation.model.toJSON();
			$.get(SERVER+"/DBAjaxReq.php",{func:"del_recomm",data:{recom_no:data.rno, recom_title:this.model.toJSON().title}});
			key = this.getrecoItemKey(recommendation.model.toJSON());
			this.childViews[key].remove();
			delete this.childViews[key];
			var model = this.recoItemCollection.get(key);
			this.recoItemCollection.remove(model);
			for(var k = 0; k < this.model.get("items").length; k++){
				if(this.model.get("items")[k].cid == key){
					var pos = k;
					break;
				}
			}
			this.model.get("items").splice(k,1);
			model.clear({silent: true});
			if(Object.keys(this.recoItemCollection.models).length == 0){
				this.parent.deleteData(this);
			}
		},
		setParentRef: function(ref){
			this.parent = ref;
		}
		
		
		/*<img src="<%=img_url%>"></img>\
				<div><a>click here for members</a></div>\*/
	});
};

MyRecoTitleItem.prototype.getNewView = function(data){
	return new this.myRecoTitleItemView(data);
};

MyRecoTitleItem.prototype.getNewModel = function(){
	return new this.myRecoTitleItemModel();
}

MyRecoTitleItem.prototype.getCollection = function(){
	return new this.myRecoTitleItemCollection();
}

MyRecoTitleItem.prototype.getTemplate = function(){
	
	return this.myRecoTitleItemTemplate();
};

MyRecoTitleItem.prototype.myRecoTitleItemTemplate = function(){
	var ret=
	//'<div class="member-item">
	'<div class="my-reco-title-head"><%=title%></div>\
	<hr>\
	<div class="my-reco-item-body"></div>'
	//</div>';
	return ret;
};




/*MyRecoTitleItem.prototype.render = function(){	
	if(!this.recoItemObj){		
		this.recoItemObj = new MyRecoItem(this.location);
		//this.bandObj.location = "bandsearch";
		this.recoItemCollection = this.recoItemObj.getCollection();
	}	
	var recoItemmodel,that = this;
	var recoItemData = this.getDispModel().get("items");
	$.each(recoItemData,function(key,obj){
		if(!(recoItemmodel = that.isrecoItemExists(obj))){
			var newObj = {};
			$.extend(newObj,{id:that.getrecoItemKey(obj)},obj)
			recoItemmodel = that.recoItemObj.getNewModel();
			recoItemmodel.set(newObj);
			recoItemView = that.recoItemObj.getNewView({model: recoItemmodel});
			that.recoItemCollection.push(recoItemmodel);			
			that.el.find('my-reco-item-body').append(recoItemView.$el);
		}else{
			var data = recoItemmodel.toJSON();
			$.extend(data,obj);
			recoItemmodel.set(data);
		}
	});	
};

MyRecoTitleItem.prototype.getDispModel = function(){
	return this.model;
};

MyRecoTitleItem.prototype.isrecoItemExists = function(){
	var key = this.getrecoItemKey(data);
	return this.recoItemCollection.get(key);
};

MyRecoTitleItem.prototype.getrecoItemKey = function(data){
	var key = data.cid;
	return key
};*/
});