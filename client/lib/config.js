requirejs.config({    
    baseUrl: '/bandaid/client/lib',
	paths:{
		home: '../modules/home',
		login: '../modules/login',
		profile: '../modules/profile',
		band: '../modules/band',
		concert: '../modules/concert'
	}
});

CLIENT = "/bandaid/client";
SERVER = "/bandaid/server";
MODULES = CLIENT + "/modules";
TEMPLATE = MODULES + "/templates";
PROFILE_PICS = SERVER + "/profile-pics";
BAND_PICS = SERVER + "/band-pics";
//var name = '/bandaid/client/modules/'+LOADMODULE;
requirejs([LOADMODULE]);