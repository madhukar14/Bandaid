define(['jquery'],function(){
_u = {
	get: function(template_url){
		var tmpl_string = "";
		$.ajax({
            url: template_url,
            method: 'GET',
            async: false,
            success: function(data) {
                tmpl_string = data;
            },
			error: function(){
				tmpl_string = "";
			}
		});
		return tmpl_string;
	},
	getTmpl: function(str){
		if(str == "header")
			return this.getHeader();
		if(str =="band")
			return this.getBandTmpl();
	},
	getHeader: function(){
		var tmpl=
		'<table class="header-table">\
			<tr class="header-top-border">\
				<td colspan="5"><div></div></td>\
			</tr>\
			<tr class="header-row">\
				<td><div class="header-band-name">BAND - AID</div></td>\
				<td><div class="header-followed-by"></div></td>\
				<td><div class="header-welcome-user"></div></td>\
				<td><div class="header-photo"><img src="<%=PROFILE_PICS%>/<%=image%>"></img></div></td>\
				<td><div class="header-action">\
						<input class="opt-logout" type="button" value="Logout"></input>\
						<input class="opt-profile" type="button" value="Profile"></input>\
					</div>\
				</td>\
			</tr>\
		</table>';		
		
		var logoutClicked = function(){
			var loggedOut = function(data){
				if(data.rCode == -1 || data.rCode == 5){
					window.location.href = MODULES + "/login/login.html";
				}
			}
			$.get(SERVER+"/DBAjaxReq.php",{func:"logout",data:{}},loggedOut,type="json");
		};
		
		var profileClicked = function(){			
			window.location.href = MODULES + "/profile/profile.html";
		}
		
		var homePage = function(){
			window.location.href = MODULES + "/home/homepage.html";
		}
		
		var attachEventHandlers = function(){
			$('.opt-logout').click(logoutClicked);
			$('.opt-profile').click(profileClicked);
			$('.header-photo').click(homePage);
		};
		
		return {tmpl : tmpl, attachEventHandlers: attachEventHandlers};
	},
	
	getBandTmpl: function(){
		var tmpl = 
		'<div class="band-item">\
			<span><%=name%></span>\
			<img src="<%=img_url%>"></img>\
			<div><a>click here for members</a></div>\
		</div>'
	},
	
	getMembersDialog: function(data,settings){
		settings = settings || {};
		$.extend(true,settings,{modal:true});
		var templStr = '<%console.log(names)%>\
						<%if(names.length == 0){%>\
						<div>No Data Available</div>\
						<%}else{%>\
						<%for(var i=0; i<names.length; i++){%>\
						<div style="text-align: center; font-size: 14px; color:  #1E90FF;">\
						<%=names[i].fname%>\
						</div>\
						<%}%>\
						<%}%>'
		var template = _.template(templStr);
		$('#dialog').html(template(data));
		return {
			show: function(){
				$('#dialog').dialog(settings);	
			},
			setTitle: function(title){
				$('.ui-dialog-title').html(title);
			}
		};
	},
	
	getMusicDialog: function(data,settings){
		settings = settings || {};
		$.extend(true,settings,{modal:true});
		var templStr = '<%console.log(names)%>\
						<%if(names.length == 0){%>\
						<div>No Data Available</div>\
						<%}else{%>\
						<%for(var i=0; i<names.length; i++){%>\
						<div style="text-align: center; font-size: 14px; color:  #1E90FF;">\
						<%=names[i].fname%>\
						</div>\
						<%}%>\
						<%}%>'
		var template = _.template(templStr);
		$('#dialog').html(template(data));
		return {
			show: function(){
				$('#dialog').dialog(settings);	
			},
			setTitle: function(title){
				$('.ui-dialog-title').html(title);
			}
		};
	},
	
	getReviewDialog: function(settings){
		settings = settings || {};
		$.extend(true,settings,{modal:true});
		var textarea =  '<div class="review-stars"></div><textarea class="review-tarea"></textarea><br><input type=button class="review-submit" Value="Submit"></input>';
		$('#dialog').html(textarea);
		return {
			show: function(){
				$('#dialog').dialog(settings);	
			},
			setTitle: function(title){
				$('.ui-dialog-title').html(title);
			},
			close: function(){
				$('#dialog').dialog('close');
			}
		};
	},
	
	getDialog: function(data){	
		
		return {
			show: function(){
				$('#dialog').dialog(data);	
			},
			setTitle: function(title){
				$('.ui-dialog-title').html(title);
			},
			addContent: function(content){
				$('#dialog').html(content);
			},
			close: function(){
				$('#dialog').dialog('close');
			}
		};
	},
	
	componentClick: function(key,data){
		
		if(key == "band"){
			var param = "?name="+data.name+"&type="+data.type;			
			/*if(data.type == "solo"){
				window.location.href = "http://localhost/bandaid/client/modules/profile/userprofile.html"+param;
			}else{*/
				window.location.href = "http://localhost/bandaid/client/modules/band/band.html"+" "+param;
			//}
			return;
		}
		if(key == "concert"){
			var param = "?cid="+data.cid;
			window.location.href = "http://localhost/bandaid/client/modules/concert/concert.html" + param;
			return;
		}
		if(key == "profile"){
			var param = "?uname="+data.uname;
			window.location.href = "http://localhost/bandaid/client/modules/profile/userprofile.html" + param;
			return;
		}
	}
};
return _u;
});

