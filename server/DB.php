<?php
class DB{	
	public $sessionId = '9292933397';
	
	public $ph = null;
	public $uname = "madhukar";
	
	public $key = "";

	public $rcodes = array("success"=>0,
						   "mysql_error"=>1, 
						   "db_error"=> 2,
					       "query_Error"=>3,
						   "failed"=>4);
				
	public $rtext = array("success"=>"success",
						  "mysql_error"=>"Could not connect to mysql",
						  "db_error"=>"could not query the database",
						  "query_Error"=>"could not execute the query - could be syntax error",
						  "failed"=>"failed");
	public $link = null;	
	
			   
	public function get($name,$data){	
		switch ($name){
			case "getMenu":
				break;
			case "getSandwich":
				break;
			case "getOrders":
				break;
			case "getCustomers":
				break;
			case "getMenuCards":
				return $this->getMenuCards();
				break;
			case "placeOrders":
				return $this->placeOrders();
				break;
			case "isCustomer":
				return $this->isCustomer();
			case "sys_rec_band":
				return $this->sys_rec_band();

			case "sys_rec_concert":
				return $this->sys_rec_concert();
			case "combine_sys_recomm":
				return $this->combine_sys_recomm();
			case "is_user":
				/*return $this->is_user('fff','foo@gmail.com');*/
				return $this->is_user($data);
			case "cat_subcat":
				return $this->cat_subcat();
			case "list_bands":
				return $this->list_bands();
			case "user_recommen_concert":
				return $this->user_recommen_concert($data);
			case "user_like_band":
				return $this->user_like_band($data);
			case "signup":
				return $this->signup($data);
			case "update_profile_info":
				return $this->update_profile_info($data);
			case "get_all_band_music":
				return $this->get_all_band_music();
			case "return_profile_data":
				return $this->return_profile_data();
			case "search_by_name":
				return $this->search_by_name($data);
			case "search_by_artist":
				return $this->search_by_artist($data);
			case "search_by_music":
				return $this->search_by_music($data);
			case "fan_list":
				return $this->fan_list($data);
			case "band_like_unlike":
				return $this->band_like_unlike($data);
			case "band_review":
				return $this->band_review($data);
			case "rsvp":
				return $this->rsvp($data);
			case "concert_attendee":
				return $this->concert_attendee($data);
			case "concert_review":
				return $this->concert_review($data);
			case "search_concert_by_music":
				return $this->search_concert_by_music($data);
			case "search_concert_by_artist":
				return $this->search_concert_by_artist($data);
			case "search_concert_by_venue":
				return $this->search_concert_by_venue($data);
			case "search_member":
				return $this->search_member($data);
			case "usr_rec":
				return $this->usr_rec($data);
			case "del_recomm":
				return $this->del_recomm($data);
			case "add_recomm":
				return $this->add_recomm($data);
			case "validate_user":
				return $this->validate_user();
			case "insert_concert":
				return $this->insert_concert($data);
			case "search_concert_by_name":
				return $this->search_concert_by_name($data);
			case "member_follow_unfollow":
				return $this->member_follow_unfollow($data);
			case "artists_from_band":
				return $this->artists_from_band($data);
			case "band_reviews":
				return $this->band_reviews($data);
			case "return_concert_data":
				return $this->return_concert_data($data);
			case "band_music":
				return $this->band_music($data);
			case "concert_reviews":
				return $this->concert_reviews($data);
			case "band_concert":
				return $this->band_concert($data);
			case "usr_profile":
				return $this->usr_profile($data);
			case "user_followed_by":
				return $this->user_followed_by($data);
			case "return_band_data":
				return $this->return_band_data($data);
			case "return_single_concert_data":
				return $this->return_single_concert_data($data);
			case "return_single_profile_data":
				return $this->return_single_profile_data($data);
			case "user_follows_who":
				return $this->user_follows_who($data);
			//madhukar: Added these 3 following lines	
			case "login":
				return $this->login($data);	
			case "logout":
				return $this->logout();
			default: 
				$resp["rText"] = "no method called";
				return json_encode($resp);
		}
	}	

	public function setDBLink(){	
		if (!$this->link = new mysqli("localhost", "root", "", "music_comp")){
			$resp["rText"] = $this->rtext["db_error"];
			$resp["rCode"] = $this->rcodes["db_error"];
			echo $this->jsonize($resp);
			exit ;
		}	
	}

	
public function sys_rec_band()
{
	$result = $this->getQuery('select B.name , B.type, B.pic_url
			from band as B, band_music as M, user_likes_music as U, user_like_band as L
			where B.name = M.band_name
			and B.type = M.band_type
			and M.music_id = U.music_id
			and U.uname = "'.$this->uname.'"');
	$rows = array();
	$band = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$band[$i]["name"] = $rows["name"];
		$band[$i]["type"] = $rows["type"];
		$band[$i]["img_url"] = $rows["pic_url"];
		$i = $i + 1;
	}
	return $band;

	
}

public function sys_rec_concert($name)
{
	$result = $this->getQuery('CALL get_nearest_upcoming_concerts("'.$name.'")');
	
	$tmp = array();
	$rows = array();
	$concert = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{	
		
		$concert[$i]["cid"] = $rows["cid"];
		$concert[$i]["name"] = $rows["concert_name"];
		$concert[$i]["band_name"] = $rows["band_name"];
		$concert[$i]["band_type"] = $rows["band_type"];
		$concert[$i]["start_time"] = $rows["start_time"];	
		$concert[$i]["end_time"] = $rows["end_time"];
		$concert[$i]["no_tickets_available"] = $rows["no_tickets_available"];
		$concert[$i]["pic_url"] = $rows["pic_url"];
		$concert[$i]["address"] = $rows["address"];
		$tmp[$rows["cid"]]["data"] = $rows["cid"];
		$i = $i + 1;		
	}
	//echo "1st ".json_encode($concert);
	
	$result1 = $this->getQuery('call highly_recommended()');
	
	$rows1 = array();
	
	while ($rows1 = $result1-> fetch_assoc())
	{
		/*if (!$tmp[$rows1["cid"]]["data"])*/
		if (!array_key_exists($rows1["cid"],$tmp))
		{
		
		$concert[$i]["cid"] = $rows1["cid"];
		$concert[$i]["name"] = $rows1["concert_name"];
		$concert[$i]["band_name"] = $rows1["band_name"];
		$concert[$i]["band_type"] = $rows1["band_type"];
		$concert[$i]["start_time"] = $rows1["start_time"];	
		$concert[$i]["end_time"] = $rows1["end_time"];
		$concert[$i]["no_tickets_available"] = $rows1["no_tickets_available"];
		$concert[$i]["pic_url"] = $rows1["pic_url"];
		$concert[$i]["address"] = $rows1["address"];
		$tmp[$rows["cid"]]["data"] = $rows1["cid"];
		
		$i = $i + 1;		
		}
		

	}
	//echo "2nd ".json_encode($concert);
	$result2 = $this->getQuery('call get_recommended_pref_music_concerts("'.$name.'")');
	$rows2 = array();
	
	while ($rows2 = $result2-> fetch_assoc())
	{
	
		if (!array_key_exists($rows2["cid"],$tmp))
		{
		
		$concert[$i]["cid"] = $rows2["cid"];
		$concert[$i]["name"] = $rows2["concert_name"];
		$concert[$i]["band_name"] = $rows2["band_name"];
		$concert[$i]["band_type"] = $rows2["band_type"];
		$concert[$i]["start_time"] = $rows2["start_time"];	
		$concert[$i]["end_time"] = $rows2["end_time"];
		$concert[$i]["no_tickets_available"] = $rows2["no_tickets_available"];
		$concert[$i]["pic_url"] = $rows2["pic_url"];
		$concert[$i]["address"] = $rows2["address"];
		$tmp[$rows["cid"]]["data"]= $rows2["cid"];
		$i = $i + 1;		
		}
	}
	//echo "3rd ".json_encode($concert);
	return $concert;
	

	
}
public function combine_sys_recomm()

{
	$a = $this->sys_rec_band();
	$b = $this->sys_rec_concert($this->uname);
	$c = $this->user_recommen_concert($this->uname);
	$data = array();
	$fin_data = array();
	$data["band"] = $a;
	$data["concert"] = $b;
	$data["music"] = [];
	$cdata["concert"] = $c;
	$fin_data["system"] = $data;
	$fin_data["friends"] = $cdata;
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $fin_data;
	return $this->jsonize($resp);
	
}	
	
public function is_user($data)
{
	
	$row = $this->chk_user($data);
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $row;
	return $this->jsonize($resp); 
	
}

public function chk_user($data){
	
	
	$result = $this->getQuery('select count(*) as result from user where uname = "'.$data["uname"].'" or email = "'.$data["email"].'"');
	$row = $result->fetch_assoc();
	return $row["result"];
}
public function cat_subcat()
{
	$i = -1;
	$index = array();
	$rows = array();
	$result = $this->getQuery("select category, sub_category from music");
	while ($rows = $result->fetch_assoc())
	{	
		
		$category = $rows["category"];
		
		if (!array_key_exists($rows["category"],$index))	
		{
			$i = $i + 1;
			$index[$rows["category"]] = $i;
			$comb = array();
			$comb["category"] = $category;
			$comb["sub_category"] = [];
			$res[$i] = $comb;
			 
		}	
		$temp = $res[$index[$rows["category"]]]["sub_category"];
		array_push ($temp,$rows["sub_category"]);
		
		$res[$index[$rows["category"]]]["sub_
		category"] = $temp; 
		
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $res;
		
		return $this->jsonize($resp);
}
public function list_bands()
{
	
	$rows = array();
	$result = $this->getQuery("select name from band where type = 'group'");
	$arr = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$arr[$i] = $rows["name"]; 
		$i = $i + 1;

	}
	    $resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $arr;		
		return $this->jsonize($resp);
}
public function user_recommen_concert()
{
	$i = 0;
	$rows = array();
	$arr = [];
	$result = $this->getQuery('select r.recommended_by, r.recommended_on, r.title, r.review, r.cid, b.name, b.type, b.pic_url, c.concert_name
								from concert as c, band as b, recommendation as r, user_follow_user as u
							where c.cid = r.cid
							and c.band_name = b.name
							and c.band_type = b.type
							and r.recommended_by = u.follow_user
							and u.username = "'.$this->uname.'"');	
							
	while ($rows = $result->fetch_assoc())
	{
		$arr[$i]["recommended_by"] = $rows["recommended_by"];
		$arr[$i]["recommended_on"] = $rows["recommended_on"];
		$arr[$i]["title"] = $rows["title"];
		$arr[$i]["band_name"] = $rows["name"];
		$arr[$i]["review"] = $rows["review"];
		$arr[$i]["cid"] = $rows["cid"];
		$arr[$i]["name"] = $rows["name"];
		$arr[$i]["type"] = $rows["type"];
		$arr[$i]["pic_url"] = $rows["pic_url"];
		$arr[$i]["concert_name"] = $rows["concert_name"];
		$i = $i + 1;
	}
		return $arr;
	
}

public function user_like_band($data)
{
		$result = $this->getQuery('insert into user_like_band values ("'.$data["uname"].'", "'.$data["band_name"].'","'.$data["band_type"].'",now())');
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		return $this->jsonize($resp);
}

//madhukar: modified update_profile_info, signup	
public function signup($data)
{	
	
	$response = $this->chk_user($data);
	if ($response != 0)
	{
		$resp["rText"] = $this->rtext["failed"];
		$resp["rCode"] = $this->rcodes["failed"];
		$reso["data"] = $data["uname"];
		return $this->jsonize($resp);
	}
	$resp["isArtist"] = false;
	if ($data["type"] == NULL) 	// normal user sign up
	{
			//todo - replace uname by session name
			$res = $this->getQuery('insert into user (uname, fname, lname, email, pwd, last_login, trust) values ("'.$data["uname"].'","'.$data["fname"].'","'.$data["lname"].'","'.$data["email"].'","'.$data["pwd"].'",now(),0)');
					
	}
	else if ($data["type"] == 'solo')// Artist does not have a band.
	{	
		//update user profile
		$res = $this->getQuery('insert into user (uname, fname, lname, email, pwd, last_login, trust) values ("'.$data["uname"].'","'.$data["fname"].'","'.$data["lname"].'","'.$data["email"].'","'.$data["pwd"].'",now(),0)');
		// update artist table
		$res = $this->getQuery('insert into artist values ("'.$data["uname"].'","'.$data["fname"].'","solo")');
		$resp["isArtist"] = true;
		
		//update band table with new band entry
		//todo - replace uname by session name
		$result = $this->getQuery('insert into band (name, type) values ("'.$data["fname"].'","solo")');
		
		// update band_music table with the new entry
		for($i = 0; $i < (count($data["band_music"])); $i++){
			$result = $this->getQuery('insert into band_music values ("'.$data["fname"].'","solo","'.$data["band_music"][$i].'")');
		}
		
		
	}
	else // user has a band. He is not a solo performer
	{	
		//update user profile
			$res = $this->getQuery('insert into user (uname, fname, lname, email, pwd, last_login, trust) values ("'.$data["uname"].'","'.$data["fname"].'","'.$data["lname"].'","'.$data["email"].'","'.$data["pwd"].'",now(),0)');
			
			//check if user is creating a new band
		$result = $this->getQuery('select count(*) as result from band where name = "'.$data["band_name"].'" and type = "group"');
		$row = $result->fetch_assoc();
		
		if ($row["result"] == 0)
		{
			//enter new entry in band table
			$result = $this->getQuery('insert into band (name, type) values ("'.$data["band_name"].'","group")');
			// update band_music table with the new entry
			for($i = 0; $i < (count($data["band_music"])); $i++){
				$result = $this->getQuery('insert into band_music values ("'.$data["band_name"].'","group","'.$data["band_music"][$i].'")');
			}
		}
		
			// update artist table
			$res = $this->getQuery('insert into artist values ("'.$data["uname"].'","'.$data["band_name"].'","group")');
			$resp["isArtist"] = true;
			
		
			
		
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $data["uname"];		
		return $this->jsonize($resp);

}

public function update_profile_info($data)
{	
	
	$res = $this->getQuery('update user set phone = "'.$data["phone"].'",dob = "'.$data["dob"].'",
		gender = "'.$data["gender"].'",city = "'.$data["city"].'",street = "'.$data["street"].'",state = "'.$data["state"].'",zip = "'.$data["zipcode"].'",country = "'.$data["country"].'",url = "'.$data["url"].'", fname ="'.$data["fname"].'", lname = "'.$data["lname"].'"
		where uname = "'.$this->uname.'"');
	$res = $this->getQuery(	'select count(*) as count from artist where uname = "'.$this->uname.'" ');
	$row = $res->fetch_assoc();		
	if ($row["count"] != 0)
	{
		$res1 = $this->getQuery('select b.name ,b.type from artist a, band b where a.uname = "'.$this->uname.'" and a.bname = b.name and a.btype = b.type');
		$row1 = $res1->fetch_assoc();	
		if ($row1["type"] == 'group')// update band picture for group band
		{
			$res2 = $this->getQuery('update band set pic_url = "'.$data["pic_url"].'" where type ="'.$row1["type"].'" and name ="'.$row1["name"].'"');
		}
		else// update artist picture as band picture for solo band
		{
			$res2 = $this->getQuery('update band set pic_url = "'.$data["url"].'" where type ="'.$row1["type"].'" and name ="'.$row1["name"].'"');
		}
	}
	
	
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	return $this->jsonize($resp);	
}

public function get_all_band()
{
     $result = $this->getQuery("select name as band_name, type as band_type, pic_url as pic_url from band");
	 $rows = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$band[$i]["name"] = $rows["band_name"];
		$band[$i]["type"] = $rows["band_type"];
		$band[$i]["pic_url"]=  $rows["pic_url"];
		$i = $i + 1;
	}
	return $band;
	 
}
public function get_all_music()
{
	$result = $this->getQuery("select * from music");
	$rows = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$music[$i]["music_id"] = $rows["music_id"];
		$music[$i]["category"] = $rows["category"];
		$music[$i]["sub_category"] = $rows["sub_category"];
		$i = $i + 1;
	}
	return $music;
}
public function get_all_band_music()
{
	$a = $this->get_all_band();
	$b = $this->get_all_music();
	$data = array();
	$data["band"] = $a;
	$data["music"] = $b;
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $data;
	return $this->jsonize($resp);	
}
public function setUsername($uname){
	$this->uname = $uname;
}

//madhukar: added logout , login and modified return_profile_data
public function logout(){
	$result = $this->getQuery('update user set last_logout = now() where uname = "'.$this->uname.'"');
	session_destroy();
	$resp["rText"] = $this->rtext["logged_out"];
	$resp["rCode"] = $this->rcodes["logged_out"];
	return $this->jsonize($resp);
}

public function login($data){
	$result = $this->getQuery('select count(*) as cnt from user where uname = "'.$data["uname"].'" and pwd = "'.$data["pwd"].'"');
	$row = $result->fetch_assoc();
	if($row["cnt"] != 0){
		$result = $this->getQuery('update user set last_login = now() where uname = "'.$data["uname"].'"');
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		
	}else{
		$resp["rText"] = $this->rtext["failed"];
		$resp["rCode"] = $this->rcodes["failed"];
	}
	return $this->jsonize($resp);
}
public function return_profile_data()
{
	$result = $this->getQuery('select fname, lname, email, phone, dob, gender, city, street, state, zip, url, country from user where uname = "'.$this->uname.'"');
	$row = array();
	
	$row = $result-> fetch_assoc();
		
		$profile["fname"] = $row["fname"];
		$profile["lname"] = $row["lname"];
		$profile["email"] = $row["email"];
		$profile["phone"] = $row["phone"];
		$profile["dob"] = $row["dob"];
		$profile["gender"] = $row["gender"];
		$profile["city"] = $row["city"];
		$profile["street"] = $row["street"];
		$profile["state"] = $row["state"];
		$profile["zipcode"] = $row["zip"];
		$profile["country"] = $row["country"];
		$profile["url"] = $row["url"];

	$res = $this->getQuery(	'select count(*) as count from artist where uname = "'.$this->uname.'" ');
	$row = $res->fetch_assoc();		
		if ($row["count"] == 0)
		{
			$profile["isArtist"] = false;
		}
		else
		{	
			$res1 = $this->getQuery('select pic_url from band b, artist a where uname = "'.$this->uname.'" and b.name = a.bname and b.type = a.btype');
			$row1 = $res1->fetch_assoc();
			$profile["pic_url"] = $row1["pic_url"];
			$profile["isArtist"] = true;
		}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $profile;		
		return $this->jsonize($resp);
}

/* search band page query*/
public function search_by_name($data)
{	
	
	$result = $this->getQuery('select * from band where name like "%'.$data["bandkey"].'%" and type = "group"');
	
	$row1 = array();
	$rows = array();
	$band = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$band[$i]["name"] = $rows["name"];
		$band[$i]["type"]= $rows["type"];
		$band[$i]["img_url"] = $rows["pic_url"];
		$res = $this->getQuery('select count(*) as count from user_like_band where uname = "'.$this->uname.'" 
		and band_name = "'.$rows["name"].'" and band_type = "group"');
		$row1 = $res-> fetch_assoc();
		if ($row1["count"] > 0)
		{
			$band[$i]["has_liked"] = True;
		}
		else
		{
			$band[$i]["has_liked"] = false;
		}
		
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $band;
		return $this->jsonize($resp);
}

public function search_by_artist($data)
{
	$result = $this->getQuery('select a.bname, a.btype, b.pic_url
							from artist as a,band as b, user as u
							where u.uname = a.uname
							and a.bname = b.name
							and a.btype = b.type
							and b.type = "group"
							and ((u.fname like "%'.$data["artistkey"].'%") or (u.lname like "%'.$data["artistkey"].'%"))');
						
	$row1 = array();
	$rows = array();
	$band = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$band[$i]["name"] = $rows["bname"];
		$band[$i]["type"]= $rows["btype"];
		$band[$i]["img_url"] = $rows["pic_url"];
		$res = $this->getQuery('select count(*) as count from user_like_band where uname = "'.$this->uname.'" 
		and band_name = "'.$rows["bname"].'" and band_type = "group"');
		$row1 = $res-> fetch_assoc();
		if ($row1["count"] > 0)
		{
			$band[$i]["has_liked"] = True;
		}
		else
		{
			$band[$i]["has_liked"] = false;
		}
		
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $band;
		return $this->jsonize($resp);
}
public function search_by_music($data)
{
	$result = $this->getQuery('select b.name, b.type, b.pic_url
								from band as b, band_music as bm, music as m
								where (	(m.category like "%'.$data["musickey"].'%") or (m.sub_category like "%'.$data["musickey"].'%")
								) and bm.music_id = m.music_id
								and bm.band_type = "group"
								and b.name = bm.band_name
								and b.type = "group"
								');
	
								
	$row1 = array();
	$rows = array();
	$band = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$band[$i]["name"] = $rows["name"];
		$band[$i]["type"]= $rows["type"];
		$band[$i]["img_url"] = $rows["pic_url"];
		$res = $this->getQuery('select count(*) as count from user_like_band where uname = "'.$this->uname.'" 
		and band_name = "'.$rows["name"].'" and band_type = "group"');
		$row1 = $res-> fetch_assoc();
		if ($row1["count"] > 0)
		{
			$band[$i]["has_liked"] = True;
		}
		else
		{
			$band[$i]["has_liked"] = false;
		}
		
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $band;
		return $this->jsonize($resp);							
								
								
}

// Search page end
public function fan_list($data)
{
	$result = $this->getQuery('select u.uname, u.fname from user_like_band as b, user as u 
								where b.band_name = "'.$data["bname"].'"
								and   b.band_type = "'.$data["btype"].'"
								and   u.uname = b.uname');
	
	$rows = array(); 
	$fan = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$fan[$i]["uname"] = $rows["uname"];
		$fan[$i]["fname"]= $rows["fname"];
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $fan;
		return $this->jsonize($resp);
}
//user likes/unlike band
public function band_like_unlike($data)
{
	$result = $this->getQuery('select count(*) as count from user_like_band
								where uname = "'.$this->uname.'"
								and band_name = "'.$data["bname"].'"
								and band_type = "group"');
	$rows = array();
	$rows = $result-> fetch_assoc();
		if ($rows["count"] > 0)
		{
			$res = $this->getQuery('delete from user_like_band
								where uname = "'.$this->uname.'"
								and band_name = "'.$data["bname"].'"
								and band_type = "group"');
		}
		else
		{
			$res = $this->getQuery('insert into user_like_band values ("'.$this->uname.'","'.$data["bname"].'", "group", now() )');
		}
	
}
// user posts band review.
public function band_review($data)
{
	$res = $this->getQuery('insert into band_review values ("'.$data["bname"].'", "'.$data["btype"].'","'.$this->uname.'",now(),"'.$data["review_text"].'")');

}

// User RSVP for the concert from My plans page
public function rsvp($data)
{
	$result = $this->getQuery('select count(*) as count from attends
								where uname = "'.$this->uname.'"
								and cid = "'.$data["cid"].'"');
	$rows = array();
	$rows = $result-> fetch_assoc();
		if ($rows["count"] > 0)
		{
			$res = $this->getQuery('delete from attends	
									where uname = "'.$this->uname.'" 
								and cid = "'.$data["cid"].'"');
		}
		
		else 
		{
			$res = $this->getQuery('insert into attends values ("'.$this->uname.'","'.$data["cid"].'" ,now() )');
			
		}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		return $this->jsonize($resp);
	
}
//display people attending the concert
public function concert_attendee($data)
{
	$result = $this->getQuery('select u.uname, u.fname, u.lname from user as u, attends as a
								where u.uname = a.uname
								and a.cid = "'.$data["cid"].'"
								');
	$rows = array();
	$attends = array(); 
	
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		
		$attends[$i]["uname"] = $rows["uname"];
		$attends[$i]["fname"]= $rows["fname"];
		$attends[$i]["lname"]=  $rows["lname"];
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $attends;
		return $this->jsonize($resp);
	
}
//User writes review and concert ratingv.venueid

public function concert_review($data)
{
	$res = $this->getQuery('insert into rate_concert values("'.$data["cid"].'","'.$this->uname.'",now(),"'.$data["crating"].'","'.$data["creview_txt"].'")');
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		return $this->jsonize($resp);
}

// concert search by artist or band
public function search_concert_by_music($data)
{
	$result = $this->getQuery('select c.start_time,c.end_time, c.band_name,c.band_type,c.concert_name, c.fee, c. added_by,c.cid, 
							v.address, d.pic_url
							from concert as c, venue as v, band_music as b, music as m, band as d
							where c.venueid = v.venueid
								and c.start_time > now()
								and ((m.category like "%'.$data["musickey"].'%") or (m.sub_category like "%'.$data["musickey"].'%"))
								and  m.music_id = b.music_id
								and  c.band_name = b.band_name
								and  c.band_type = b.band_type
								and d.name = b.band_name
								and d.type  = b.band_type
								group by c.cid
								');
	$rows = array();
	$concert = array(); 
	
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$concert[$i]["start_time"] = $rows["start_time"];
		$concert[$i]["end_time"]= $rows["end_time"];
		$concert[$i]["band_name"]= $rows["band_name"];
		$concert[$i]["band_type"]= $rows["band_type"];
		$concert[$i]["concert_name"]= $rows["concert_name"];
		$concert[$i]["fee"]= $rows["fee"];
		$concert[$i]["added_by"] = "'.$this->uname.'";
		$concert[$i]["address"] = $rows["address"];
		$concert[$i]["pic_url"] = $rows["pic_url"];
		$concert[$i]["cid"] = $rows["cid"];
		$res = $this->getQuery(	'select count(*) as count from attends where uname = "'.$this->uname.'" and cid = "'.$rows["cid"].'"');
		$row = $res->fetch_assoc();		
		if ($row["count"] == 0)
		{
			$concert[$i]["has_RSVPed"] = false;
		}
		else
		{
			$concert[$i]["has_RSVPed"] = true;
		}
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $concert;
		return $this->jsonize($resp);
								
}
// concert search by artist or band
public function search_concert_by_artist($data)
{
	$result = $this->getQuery('select c.start_time,c.end_time, c.band_name,c.band_type,c.concert_name, c.fee, c. added_by,c.cid, 
							v.address, d.pic_url
							from concert as c, venue as v, artist as a, user as u, band as d
							where a.uname = u.uname
							and   a.bname = c.band_name
							and   c.venueid = v.venueid
							and   a.btype = c.band_type
							and   c.start_time > now()
							and   d.name = c.band_name
							and   d.type = c.band_type
							and   (u.fname like "%'.$data["abkey"].'%" or u.lname like "%'.$data["abkey"].'%" or a.bname like "%'.$data["abkey"].'%")
								group by c.cid');
	$rows = array();
	$concert = array(); 
	
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$concert[$i]["start_time"] = $rows["start_time"];
		$concert[$i]["end_time"]= $rows["end_time"];
		$concert[$i]["band_name"]= $rows["band_name"];
		$concert[$i]["band_type"]= $rows["band_type"];
		$concert[$i]["concert_name"]= $rows["concert_name"];
		$concert[$i]["fee"]= $rows["fee"];
		$concert[$i]["added_by"] = '"'.$this->uname.'"';
		$concert[$i]["address"] = $rows["address"];
		$concert[$i]["pic_url"] = $rows["pic_url"];
		$concert[$i]["cid"] = $rows["cid"];
		$res = $this->getQuery(	'select count(*) as count from attends where uname = "'.$this->uname.'" and cid = "'.$rows["cid"].'"');
		$row = $res->fetch_assoc();		
		if ($row["count"] == 0)
		{
			$concert[$i]["has_RSVPed"] = false;
		}
		else
		{
			$concert[$i]["has_RSVPed"] = true;
		}
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $concert;
		return $this->jsonize($resp);
	
}
// search concert by venue
public function search_concert_by_venue($data)
{
	$result = $this->getQuery('select c.start_time,c.end_time, c.band_name,c.band_type,c.concert_name, c.fee, c. added_by,c.cid, 
							v.address, d.pic_url
							from concert as c , venue as v, band as d
							where c.venueid = v.venueid
							and c.start_time > now()
							and d.name = c.band_name
							and d.type = c.band_type
							and v.address like "%'.$data["vkey"].'%"');
	$rows = array();
	$concert = array(); 
	
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$concert[$i]["start_time"] = $rows["start_time"];
		$concert[$i]["end_time"]= $rows["end_time"];
		$concert[$i]["band_name"]= $rows["band_name"];
		$concert[$i]["band_type"]= $rows["band_type"];
		$concert[$i]["concert_name"]= $rows["concert_name"];
		$concert[$i]["fee"]= $rows["fee"];
		$concert[$i]["added_by"] = "'.$this->uname.'";
		$concert[$i]["address"] = $rows["address"];
		$concert[$i]["pic_url"] = $rows["pic_url"];
		$concert[$i]["cid"] = $rows["cid"];
		$res = $this->getQuery(	'select count(*) as count from attends where uname = "'.$this->uname.'" and cid = "'.$rows["cid"].'"');
		$row = $res->fetch_assoc();		
		if ($row["count"] == 0)
		{
			$concert[$i]["has_RSVPed"] = false;
		}
		else
		{
			$concert[$i]["has_RSVPed"] = true;
		}
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $concert;
		return $this->jsonize($resp);					
							
}
// search concert over
//member search
public function search_member($data)
{
	$result = $this->getQuery('select u.uname, u.fname, u.lname, u.url from user as u 
								where (u.fname like "%'.$data["memkey"].'%" or u.lname like "%'.$data["memkey"].'%" or u.uname like "%'.$data["memkey"].'%" and u.uname <> "'.$this->uname.'" )');
	$rows = array();
	$r = array();
	$r1 = array();
	
	$mem = array(); 
	
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$mem[$i]["uname"] = $rows["uname"];
		$mem[$i]["fname"] = $rows["fname"];
		$mem[$i]["lname"] = $rows["lname"];
		$mem[$i]["url"] = $rows["url"];
		$res = $this->getQuery('select count(*) as count from user_follow_user
								where username = "'.$this->uname.'"
								and   follow_user = "'.$rows["uname"].'"');
		$r = $res-> fetch_assoc();
		if ($r["count"] > 0)
		{
			$mem[$i]["following"] = true;
		}
		else {$mem[$i]["following"] = false;}
		$res = $this->getQuery('select count(*) as count from artist where uname = "'.$rows["uname"].'"');
		$r1 = $res-> fetch_assoc();
		if ($r1["count"] > 0)
		{
			$mem[$i]["is_artist"] = true;
		}
		else {$mem[$i]["is_artist"] = false;}
		
		$i = $i+1;
		
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $mem;
		return $this->jsonize($resp);
	
}

public function usr_rec($data)
{	
	$un = $this->uname;
	if(!is_null($data) and array_key_exists('uname', $data)){
		$un = $data["uname"];
	}
	
		$i = -1;
	$index = array();
	$rows = array();
	$res = array();
	$result = $this->getQuery('select r.rno ,r.title, r.review, c.band_name, c.band_type, c.concert_name, c.cid, c.start_time, r.recommended_on, v.address
							from concert as c, venue as v, recommendation as r
							where r.recommended_by = "'.$un.'"
							and   r.cid = c.cid 
							and   c.venueid = v.venueid');
	while ($rows = $result->fetch_assoc())
	{	
		
		$title = $rows["title"];
		
		if (!array_key_exists($rows["title"],$index))	
		{
			$i = $i + 1;
			$index[$rows["title"]] = $i;
			$comb = array();
			$comb["title"] = $title;
			$comb["items"] = [];
			$res[$i] = $comb;
			 
		}	
		$a["review"] = $rows["review"];
		$a["band_name"] = $rows["band_name"];
		$a["band_type"] = $rows["band_type"];
		$a["concert_name"] = $rows["concert_name"];
		$a["cid"] = $rows["cid"];
		$a["rno"] = $rows["rno"];
		$a["start_time"] = $rows["start_time"];
		$a["recommended_on"] = $rows["recommended_on"];
		$a["city"] = $rows["address"];
		
		$temp = $res[$index[$rows["title"]]]["items"];
		array_push ($temp,$a);
		
		$res[$index[$rows["title"]]]["items"] = $temp; 
	}
	
		$final["recommendations"] = $res;
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $final;		
		return $this->jsonize($resp);
	
}
//user can delete his own recommendations 
public function del_recomm($data)
{
	$result = $this->getQuery('delete from recommendation 
							where recommended_by = "'.$this->uname.'"
							and   rno  = "'.$data["recom_no"].'"
							and   title = "'.$data["recom_title"].'"');
							
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	return $this->jsonize($resp);
}

// user can add recommendation
public function add_recomm($data)
{
	$result = $this->getQuery('insert into recommendation values("'.$data["recom_no"].'","'.$data["recom_title"].'","'.$data["recom_review"].'","'.$this->uname.'",now(),"'.$data["cid"].'")');
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	return $this->jsonize($resp);
}
//check user's validity before adding concert
public function validate_user()
{
	$result = $this->getQuery('select count(*) as count from user where uname = "'.$this->uname.'" and trust > 2');
	$r = $result->fetch_assoc();
	$i = 0;
	
		if ($r["count"] > 0)
		{
			$rows = array();
			$result = $this->getQuery('select name, type from band');
			while ($rows = $result->fetch_assoc())
			{
				$band[$i]["name"] = $rows["name"];
				$band[$i]["type"] = $rows["type"];	
					$i = $i + 1;
			}
			$result = $this->getQuery('select venueid,address from venue');
			$i = 0;
			while ($rows = $result->fetch_assoc())
			{
				$venue[$i]["venueid"] = $rows["venueid"];
				$venue[$i]["city"] = $rows["address"];	
				$i = $i + 1;				
			}
			$combine["band"] = $band;
			$combine["venue"] = $venue;
			
			$resp["rText"] = $this->rtext["success"];
			$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $combine;
			return $this->jsonize($resp);
		}
		else //check if he is an artist
		{
			$rows = array();
			$result = $this->getQuery('select count(*) as count from artist where uname = "'.$this->uname.'"');
			$r = $result-> fetch_assoc();
			if ($r["count"] > 0)
			{
				$rows = array();
				$result = $this->getQuery('select bname, btype from artist where uname = "'.$this->uname.'" ');
				while ($rows = $result->fetch_assoc())
				{
					$band[$i]["name"] = $rows["bname"];
					$band[$i]["type"] = $rows["btype"];		
						$i = $i + 1;
				}
				$i = 0;
				$result = $this->getQuery('select venueid,address from venue');
				while ($rows = $result->fetch_assoc())
				{
					$venue[$i]["venueid"] = $rows["venueid"];
					$venue[$i]["city"] = $rows["address"];	
						$i = $i + 1;
				}
				$combine["band"] = $band;
				$combine["venue"] = $venue;
				
				$resp["rText"] = $this->rtext["success"];
				$resp["rCode"] = $this->rcodes["success"];
				$resp["data"] = $combine;
				return $this->jsonize($resp);
			}
			else //give msg not allowed to update concert
			{
				$resp["rText"] = $this->rtext["failed"];
				$resp["rCode"] = $this->rcodes["failed"];
				return $this->jsonize($resp);
			}
		}
}
//insert concert
public function insert_concert($data)
{
	$result = $this->getQuery('insert into concert values("'.$data["cid"].'","'.$data["concert_name"].'","'.$data["band_name"].'","'.$data["band_type"].'","'.$data["venueid"].'", now() ,"'.$data["start_time"].'","'.$data["end_time"].'","'.$this->uname.'","'.$data["fee"].'","'.$data["capacity"].'","'.$data["no_tickets_available"].'")');
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	return $this->jsonize($resp);
}

// member follow member
public function member_follow_unfollow($data)
{	
	$result = $this->getQuery('select count(*) as count from user_follow_user
								where username = "'.$this->uname.'"
								and follow_user = "'.$data["follow_user"].'"');
							
	$rows = array();
	$rows = $result-> fetch_assoc();
		if ($rows["count"] > 0)
		{
			$res = $this->getQuery('delete from user_follow_user
								where username = "'.$this->uname.'"
								and follow_user = "'.$data["follow_user"].'"
								');
		// decrement trust score of followed user
			$res = $this->getQuery('update user set trust = trust - 1 where uname = "'.$data["follow_user"].'"');
		}
		else
		{
			$res = $this->getQuery('insert into user_follow_user values ("'.$this->uname.'","'.$data["follow_user"].'", now() )');
			// increment trust score of followed user.
			$res = $this->getQuery('update user set trust = trust + 1 where uname = "'.$data["follow_user"].'"');
		}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		return $this->jsonize($resp);
}
	
// Give all artist from particular band
public function artists_from_band($data)
{
	$result = $this->getQuery('select a.uname, u.fname, u.lname from artist as a , user as u
								where a.bname = "'.$data["band_name"].'"
                 				and	a.btype = "'.$data["band_type"].'"
								and a.uname = u.uname');
	$rows = array();
	$artist = array();
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$artist[$i]["uname"] = $rows["uname"];
		$artist[$i]["fname"] = $rows["fname"];
		$artist[$i]["lname"] = $rows["lname"];
		$i = $i + 1;
	}
			$resp["rText"] = $this->rtext["success"];
			$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $artist;
			return $this->jsonize($resp);
}
//return All reviews for band
public function band_reviews($data)
{
	$result = $this->getQuery('select * from band_review where bname = "'.$data["band_name"].'"
								and btype = "'.$data["band_type"].'"');
	$rows = array();
	$review = array ();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$review[$i]["bname"] = $rows["bname"];
		$review[$i]["btype"] = $rows["btype"];
		$review[$i]["reviewed_by"] = $rows["reviewed_by"];
		$review[$i]["reviewed_on"] = $rows["reviewed_on"];
		$review[$i]["review_text"] = $rows["review_text"];
		$i = $i + 1;
	}
	$resp["rText"] = $this->rtext["success"];
			$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $review;
			return $this->jsonize($resp);
}
 //Return all concert data
public function return_concert_data()
{
	$result = $this->getQuery("select * from concert");
	$rows = array();
	$concert = array ();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$concert[$i]["cid"] = $rows["cid"];
		$concert[$i]["band_name"]= $rows["band_name"];
		$concert[$i]["band_type"]= $rows["band_type"];
		$concert[$i]["concert_name"]= $rows["concert_name"];
		$concert[$i]["fee"]= $rows["fee"];
		$concert[$i]["added_by"] = $rows["added_by"];
		$concert[$i]["updated_datetime"] = $rows["updated_datetime"];
		$concert[$i]["venueid"] = $rows["venueid"];
		$concert[$i]["start_time"] = $rows["start_time"];
		$concert[$i]["end_time"] = $rows["end_time"];
		$concert[$i]["capacity"] = $rows["capacity"];
		$concert[$i]["no_tickets_available"] = $rows["no_tickets_available"];
		$i = $i + 1;
	}
	$resp["rText"] = $this->rtext["success"];
			$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $concert;
			return $this->jsonize($resp);
}


// Return music played by particular band
public function band_music($data)
{
	$result = $this->getQuery('select m.music_id, m.category, m.sub_category
								from band_music as b, music as m
								where m.music_id = b.music_id
								and   	b.band_name = "'.$data["band_name"].'"
								and     b.band_type = "'.$data["band_type"].'"');
	$rows = array();
	$music = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		/*$music[$i]["music_id"] = $rows["music_id"];
		$music[$i]["category"] = $rows["category"];
		$music[$i]["sub_category"] = $rows["sub_category"];*/
		$music[$i] = $rows;
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $music;
			return $this->jsonize($resp);
	
}

// return concert reviews
public function concert_reviews($data)
{
	$result = $this->getQuery('select r.uname, u.fname, u.lname, r.cid, r.rated_on, r.rating, r.review
								from rate_concert as r, user as u
								where u.uname = r.uname
								and   r.cid = "'.$data["cid"].'" ');
	$rows = array();
	$concert = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$concert[$i]["uname"] = $rows["uname"];
		$concert[$i]["fname"] = $rows["fname"];
		$concert[$i]["lname"] = $rows["lname"];
		$concert[$i]["cid"] = $rows["cid"];
		$concert[$i]["rated_on"] = $rows["rated_on"];
		$concert[$i]["rating"] = $rows["rating"];
		$concert[$i]["review"] = $rows["review"];
		$i = $i + 1;
	}
	$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $concert;
			return $this->jsonize($resp);
}

//which band is performing concert
public function band_concert($data)
{
	$result = $this->getQuery('select cid, band_name, band_type from concert where cid = "'.$data["cid"].'"');
	$rows = $result->fetch_assoc();
	$band["cid"] = $rows["cid"];
	$band["band_name"] = $rows["band_name"];
	$band["band_type"] = $rows["band_type"];
	
	$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $band;
			return $this->jsonize($resp);
}

// get profile page data for user
public function usr_profile($data)
{
	//get recommendations made by this user
	/*$result = $this->getQuery('select r.rno, r.title, r.review, r.recommended_by, r.recommended_on, r.cid, u.fname, u.lname
								from recommendation as r, user as u
								where r.recommended_by = "'.$data["uname"].'"
								and   r.recommended_by = u.uname');
	$recom = array(); 
	$rows = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$recomm[$i]["rno"] = $rows["rno"];
		$recomm[$i]["title"] = $rows["title"];
		$recomm[$i]["review"] = $rows["review"];
		$recomm[$i]["recommended_by"] = $rows["recommended_by"];
		$recomm[$i]["recommended_on"] = $rows["recommended_on"];
		$recomm[$i]["cid"] = $rows["cid"];
		$recomm[$i]["fname"] = $rows["fname"];
		$recomm[$i]["lname"] = $rows["lname"];
		$i = $i + 1;
		
	}*/
	//get liked bands
	$result = $this->getQuery('select ba.pic_url, b.uname,b.band_name,b.band_type,b.liked_on,u.fname,u.lname
								from user_like_band as b, user as u, band as ba
								where b.uname = u.uname and b.band_type = ba.type and b.band_name = ba.name
								and b.uname =  "'.$data["uname"].'"');
								
	$band = array(); 
	$rows = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$band[$i]["uname"] = $rows["uname"];
		$band[$i]["band_name"] = $rows["band_name"];
		$band[$i]["band_type"] = $rows["band_type"];
		$band[$i]["pic_url"] = $rows["pic_url"];
		$band[$i]["liked_on"] = $rows["liked_on"];
		$band[$i]["fname"] = $rows["fname"];
		$band[$i]["lname"] = $rows["lname"];
		$i = $i + 1;
	}
	//Get liked music
	$result = $this->getQuery('select u.uname,u.fname,u.lname, m.category, m.sub_category 
								from music m, user_likes_music l, user u
							where m.music_id = l.music_id
							and   u.uname = l.uname
							and l.uname = "'.$data["uname"].'"');
	
	$music = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$music[$i]["uname"] = $rows["uname"];
		$music[$i]["fname"] = $rows["fname"];
		$music[$i]["lname"] = $rows["lname"];
		$music[$i]["category"] = $rows["category"];
		$music[$i]["sub_category"] = $rows["sub_category"];
		$i = $i + 1;
	}
	$result = $this->getQuery('select bname, btype from artist where "'.$data["uname"].'" = uname');
	$rows = array();
	$rows = $result->fetch_assoc();
	if ($rows["bname"] <> null)
	{
		$result_fin["is_artist"] = true; 
		$result_fin["band_name"] = $rows["bname"];
		$result_fin["band_type"] = $rows["btype"];
	}
	else
	{
		$result_fin["is_artist"] = false;
	}
	$result = $this->getQuery('select * from user where "'.$data["uname"].'" = uname');
	$rowt = $result->fetch_assoc();
	$result = $this->getQuery('select count(*) as cnt from user_follow_user where username="'.$this->uname.'" and "'.$data["uname"].'" = follow_user');
	$rowp = $result->fetch_assoc();
	if($rowp["cnt"] > 0){
		$result_fin["has_followed"] = true;
	}else{
		$result_fin["has_followed"] = false;
	}
	$result_fin["url"] = $rowt["url"];
	$result_fin["usr_fname"] = $rowt["fname"];
	$result_fin["usr_lname"] = $rowt["lname"];
	$result_fin["band"] = $band;
	//$result_fin["recomm"] = $recomm;
	$result_fin["music"] = $music;
	
	$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $result_fin;
			return $this->jsonize($resp);
	
}
//user followed by whom
public function user_followed_by($data)
{
	$result = $this->getQuery('select f.username, u.fname,u.lname 
								from user_follow_user as f, user as u
								where f.username = u.uname
								and    f.follow_user = "'.$data["uname"].'"');

	$follow = array();
	$rows = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$follow[$i]["uname"] = $rows["username"];
		$follow[$i]["fname"] = $rows["fname"];
		$follow[$i]["lname"] = $rows["lname"];
		$i= $i + 1;
	}
	$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $follow;
			return $this->jsonize($resp);
}

public function return_band_data($data){
	$result = $this->getQuery('select * from band where name="'.$data["name"].'" and type="'.$data["type"].'"');
	$rows = $result->fetch_assoc();
	$res = $this->getQuery('select count(*) as count from user_like_band where uname = "'.$this->uname.'" 
		and band_name = "'.$data["name"].'" and band_type = "'.$data["type"].'"');
		$row1 = $res-> fetch_assoc();
		if ($row1["count"] > 0)
		{
			$rows["has_liked"] = True;
		}
		else
		{
			$rows["has_liked"] = false;
		}
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $rows;
	return $this->jsonize($resp);
}

public function return_single_concert_data($data){
	$result = $this->getQuery('select * from concert c, band b where c.cid="'.$data["cid"].'" and c.band_name = b.name and c.band_type = b.type');
	$rows = $result->fetch_assoc();
	$res = $this->getQuery('select count(*) as count from attends where uname = "'.$this->uname.'"and cid = "'.$data["cid"].'"');
		$row1 = $res-> fetch_assoc();
		if ($row1["count"] > 0)
		{
			$rows["has_RSVPed"] = true;
		}
		else
		{
			$rows["has_RSVPed"] = false;
		}
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $rows;
	return $this->jsonize($resp);
}

public function return_single_profile_data($data){
	$result = $this->getQuery('select * from user where uname="'.$data["uname"].'"');
	$rows = $result->fetch_assoc();
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $rows;
	return $this->jsonize($resp);
}

public function user_follows_who($data){
	$result = $this->getQuery('select f.username, u.fname,u.lname 
								from user_follow_user as f, user as u
								where f.follow_user = u.uname
								and    f.username = "'.$data["uname"].'"');

	$follow = array();
	$rows = array();
	$i = 0;
	while ($rows = $result->fetch_assoc())
	{
		$follow[$i]["uname"] = $rows["username"];
		$follow[$i]["fname"] = $rows["fname"];
		$follow[$i]["lname"] = $rows["lname"];
		$i= $i + 1;
	}
	$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
			$resp["data"] = $follow;
			return $this->jsonize($resp);
}


public function search_concert_by_name($data)
{
	$result = $this->getQuery('select c.start_time,c.end_time, c.band_name,c.band_type,c.concert_name, c.fee, c. added_by,c.cid, 
							v.address, d.pic_url
							from concert as c , venue as v, band as d
							where c.venueid = v.venueid
							and c.start_time > now()
							and d.name = c.band_name
							and d.type = c.band_type
							and c.concert_name like "%'.$data["cnamekey"].'%"' );
	$rows = array();
	$concert = array(); 
	$i = 0;
	while ($rows = $result-> fetch_assoc())
	{
		$concert[$i]["start_time"] = $rows["start_time"];
		$concert[$i]["end_time"]= $rows["end_time"];
		$concert[$i]["band_name"]= $rows["band_name"];
		$concert[$i]["band_type"]= $rows["band_type"];
		$concert[$i]["concert_name"]= $rows["concert_name"];
		$concert[$i]["fee"]= $rows["fee"];
		$concert[$i]["added_by"] = "'.$this->uname.'";
		$concert[$i]["address"] = $rows["address"];
		$concert[$i]["pic_url"] = $rows["pic_url"];
		$concert[$i]["cid"] = $rows["cid"];
		$res = $this->getQuery(	'select count(*) as count from attends where uname = "'.$this->uname.'" and cid = "'.$rows["cid"].'"');
		$row = $res->fetch_assoc();		
		if ($row["count"] == 0)
		{
			$concert[$i]["has_RSVPed"] = false;
		}
		else
		{
			$concert[$i]["has_RSVPed"] = true;
		}
		$i = $i + 1;
	}
		$resp["rText"] = $this->rtext["success"];
		$resp["rCode"] = $this->rcodes["success"];
		$resp["data"] = $concert;
		return $this->jsonize($resp);
	
}

public function placeOrders(){	
	$orderCollection = $_GET["data"];
	for($i=0; $i < count($orderCollection); $i++){
		$order = $orderCollection[$i];
		if(!$this->isPending($order["name"],$order["size"],$order["time"],$order["quantity"])){			
			$sql = 'insert into orders values("'.$this->ph.'","'.$order["name"].'","'.$order["size"].'","'.$order["time"].
			'","'.$order["quantity"].'","'.$order["status"].'")';
			$result = $this->getQuery($sql);
			$this->free($result);
		}
	}		
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	return $this->jsonize($resp);
}

public function isPending($name,$size,$time,$quantity){	
	$result = $this->getQuery('select * from orders where phone = "'.$this->ph.'" and 	sname = "'.$name.'" and size = "'.$size.'"');
	$row = $result->fetch_assoc();
	$this->free($result);
	if (count($row) == 0){
		return false;
	}
	if($row["status"] != "pending"){
		return false;
	}
	if($row["status"] == "pending"){
		$sql = 'update orders set quantity = quantity +'.$quantity.', o_time ="'.$time.'" where phone = "'.$this->ph.'" and 	sname = "'.$name.'" and size = "'.$size.'"';
		$result = $this->getQuery($sql);
		$this->free($result);
		return true;
	}
}

public function getMenuCards(){
	include 'Menucard.php';
	$result = $this->getQuery('select * from sandwich s, menu m where s.sname=m.sname and s.description like "%'.$this->key.'%"');	
	$menucardList = array();
	while($row = $result->fetch_assoc()){
		if(!array_key_exists($row['sname'],$menucardList)){
			$menucard = new Menucard();
			$menucard->setName($row['sname']);
			$menucard->setDescription($row['description']);			
			$menucardList[$row['sname']] = $menucard;			
		}
		$menucard->addSizeAndPrice($row['size'],$row['price']);
	}
	$this->free($result);
	$resp["rText"] = $this->rtext["success"];
	$resp["rCode"] = $this->rcodes["success"];
	$resp["data"] = $menucardList;
	return $this->jsonize($resp);	
}

public function jsonize($resp){
	return json_encode($resp);
}

public function getQuery($sql){
	
	if(!$this->link){
		$this->setDBLink();
	}
	//prepare
	$stmt = $this->link->prepare($sql);
	//execute
	$result = $stmt->execute();

	
	if (!$result) {
		$resp["rText"] = $this->rtext["query_Error"];
		$resp["rCode"] = $this->rcodes["query_Error"];
		echo $this->jsonize($resp);
		exit;
	}
	return $stmt->get_result();
}

//madhukar: added function getUserDetails
public function getUserDetails(){
	$result = $this->getQuery('select fname, lname, url from user where uname ="'.$this->uname.'"');
	$row = $result->fetch_assoc();
	$ud["uname"] = $this->uname;
	$ud["fname"] = $row["fname"];
	$ud["lname"] = $row["lname"];
    $ud["url"] = $row["url"];
	return $ud;
}

public function free($result){
	@mysql_free_result($result);
}
}
?>

