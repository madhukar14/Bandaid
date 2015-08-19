define(['jquery','backbone','underscore','utility','RecoContainer.js'],function(){
	
HomeView = Backbone.View.extend({

});

HomeView.prototype.initialize = function(){		
	
	if(!this.model){
		var homeModel = Backbone.Model.extend({});
		this.model = new homeModel();
	}
	this.model.on("change",this.onModelChange);
	this.model.on("change:system",this.onSysRecoChange,this);
	this.model.on("change:friends",this.onFrndRecoChange,this);
	
	this.template = _.template(this.getTemplate());		
	this.sysRecoContainer = new RecoContainer();
	this.sysRecoContainer.setType("sysreco");
	this.frndRecoContainer = new RecoContainer();
	this.frndRecoContainer.setType("userreco");
	this.el = $(this.template(this.model));		
	this.el.find('.home-sys-reco').append(this.sysRecoContainer.el);
	this.el.find('.home-frnd-reco').append(this.frndRecoContainer.el);	
};

HomeView.prototype.getTemplate = function(){
	var tmpl =
	'<table>\
		<tr>\
			<td><div class="home-sys-reco">\
				<span class = "sys-reco-text">WE RECOMMEND</span>\
			</div></td>\
			<td><div class="vertical-divider"></div></td>\
			<td><div class="home-frnd-reco">\
			<span class = "sys-reco-text">YOUR FRIENDS RECOMMEND</span>\
			</div></td>\
		</tr>\
	</table>'
	return tmpl;
};

HomeView.prototype.getSysRecoModel = function(model){
	if(!this.sysRecoModel){
		this.sysRecoModel = new this.recoContainerModel();
	}
	return this.sysRecoModel;
}

HomeView.prototype.getFrndRecoModel = function(model){
	if(!this.frndRecoModel){
		this.frndRecoModel = new this.recoContainerModel();
	}
	return this.frndRecoModel;
}

HomeView.prototype.setFrndRecoData = function(){
	var data = this.model.toJSON();
	//this.getFrndRecoModel().set(data.friends);
	this.frndRecoContainer.setModelData(data.friends);
};

HomeView.prototype.setSysRecoData = function(){
	var data = this.model.toJSON();
	//this.getSysRecoModel().set(data.system);
	this.sysRecoContainer.setModelData(data.system);
};

HomeView.prototype.setModelData = function(data){	
	this.model.set(data);
	this.setSysRecoData();
	this.setFrndRecoData();
}

});



