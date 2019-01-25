

	var myPieChart=null;
	var myBarChart=null;
	var selected_lang =[];
	var selected_year = '0';
	var selected_month = '0';
	var selected_day = '0';
	var lang_map=['English','German','Russian','Italian','Spanish','French'];
	var lang_s_b = {en: 'English', de: 'German', ru: 'Russian',it: 'Italians',es: 'Spanish',fr: 'French'};
	var sugesstion1 ='';
	var sugesstion2 ='';
	var sugesstion3 ='';
	var map_key = [];
	var map_1_key = [];
	var map_2_key = [];
	var selected_hash_tag = [];
	var selected_country_tag = [];
	var selected_Person_tag = [];
	var myPageLength = 0;
	
	
	
	function launch_widget()
		{
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.Translate(null,'en');
            }
        }
		
      
        //You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
        function onProgress(value) {
            document.getElementById('counter').innerHTML = Math.round(value);
        }

        function onError(error) {
            alert("Translation Error: " + error);
        }

        function onComplete() {
            document.getElementById('counter').style.color = 'green';
        }
        //fires when the user clicks on the exit box of the floating widget
        function onRestoreOriginal() { 
            alert("The page was reverted to the original language. This message is not part of the widget.");
        }
	
	
	/****Map Implementation*****/
	
	
			// linking the key-value-pairs is optional
		// if no argument is provided, linkItems === undefined, i.e. !== false
		// --> linking will be enabled
		function Map(linkItems) {
			this.current = undefined;
			this.size = 0;

			if(linkItems === false)
				this.disableLinking();
		}

		Map.noop = function() {
			return this;
		};

		Map.illegal = function() {
			throw new Error("illegal operation for maps without linking");
		};

		// map initialisation from existing object
		// doesn't add inherited properties if not explicitly instructed to:
		// omitting foreignKeys means foreignKeys === undefined, i.e. == false
		// --> inherited properties won't be added
		Map.from = function(obj, foreignKeys) {
			var map = new Map;

			for(var prop in obj) {
				if(foreignKeys || obj.hasOwnProperty(prop))
					map.put(prop, obj[prop]);
			}

			return map;
		};

		Map.prototype.disableLinking = function() {
			this.link = Map.noop;
			this.unlink = Map.noop;
			this.disableLinking = Map.noop;
			this.next = Map.illegal;
			this.key = Map.illegal;
			this.value = Map.illegal;
			this.removeAll = Map.illegal;

			return this;
		};

		// overwrite in Map instance if necessary
		Map.prototype.hash = function(value) {
			return (value instanceof Object ?
				(value.__hash || (value.__hash = ++arguments.callee.current)) :
				value.toString());
		};

		Map.prototype.hash.current = 0;

		// --- mapping functions

		Map.prototype.get = function(key) {
			var item = this[this.hash(key)];
			return item === undefined ? undefined : item.value;
		};

		Map.prototype.put = function(key, value) {
			var hash = this.hash(key);

			if(this[hash] === undefined) {
				var item = { key : key, value : value };
				this[hash] = item;

				this.link(item);
				++this.size;
			}
			else this[hash].value = value;

			return this;
		};

		Map.prototype.remove = function(key) {
			var hash = this.hash(key);
			var item = this[hash];

			if(item !== undefined) {
				--this.size;
				this.unlink(item);

				delete this[hash];
			}

			return this;
		};

		// only works if linked
		Map.prototype.removeAll = function() {
			while(this.size)
				this.remove(this.key());

			return this;
		};

		// --- linked list helper functions

		Map.prototype.link = function(item) {
			if(this.size == 0) {
				item.prev = item;
				item.next = item;
				this.current = item;
			}
			else {
				item.prev = this.current.prev;
				item.prev.next = item;
				item.next = this.current;
				this.current.prev = item;
			}
		};

		Map.prototype.unlink = function(item) {
			if(this.size == 0)
				this.current = undefined;
			else {
				item.prev.next = item.next;
				item.next.prev = item.prev;
				if(item === this.current)
					this.current = item.next;
			}
		};

		// --- iterator functions - only work if map is linked

		Map.prototype.next = function() {
			this.current = this.current.next;
		};

		Map.prototype.key = function() {
			return this.current.key;
		};

		Map.prototype.value = function() {
			return this.current.value;
		};
	
	/***************/
	
	
	function FillSideBar(lang,map,map_1,map_2)
	{
		
		var sidebarStr = '<form><fieldset><legend>Custom Search</legend><label>Language</label><br><input id=';
		
		//sidebarStr += '';
		
		for(var i = 0 ; i < 6 ; i++)
		{
			sidebarStr += ('"'+lang_map[i]+'"');
			sidebarStr += ' type="checkbox" name="field" value="option"';
			if(lang[i] == 0)
			{
				sidebarStr += ' disabled>';
			}
			else
			{
				sidebarStr += '>';
			}
			sidebarStr += lang_map[i]+'('+lang[i]+')';
			if(i != 5)
			{
				sidebarStr += '<br><input id=';
			}
			else
			{
				sidebarStr += '<br><br>';
			}
		}
		
		sidebarStr += '<input id="date_option" type="checkbox" name="field" value="option"><strong> Date</strong><br><input id = "datepicker" type ="date"  min = "2015-09-10" max ="2016-12-06" value = "2016-12-06" ><br><br>';
			
		//	sidebarStr += '<input id="date_option" type="checkbox" name="field" value="option"><strong>'+t_str +'</strong><br><input id = "datepicker" type ="date"  min = "2015-09-10" max ="2016-12-06" value = "2016-12-06" ><br><br>';
		
			
	
			var map_len = [];
			
			var map_temp_key = [];
			var map_temp_len = [];
			var sz = map.size;
			for(i = 0; i++ < map.size; map.next())
			{
				map_len.push(map.value());
				map_temp_len.push(map.value());
				map_temp_key.push(map.hash(map.key()));
			}
			
			map_len.sort(function(a, b){return b-a});
			var min = 10 > map_len.size?map_len.size:10;
			for(t = 0 ; t < min ; t++)
			{
				for(i = 0; i < sz; i++)
				{
					if(map_len[t] == map_temp_len[i])
					{
						map_key.push(map_temp_key[i]);
					}
				}
			}
			
			var hash_string = '<label>Trending Hashtags</label><br><input id=';
			
			for(var i = 0 ; i < min ; i++)
			{
				hash_string += ('"Hashtag'+i+'"');
				hash_string += ' type="checkbox" name="field" value="option"';
				
				hash_string += '>';
				
				hash_string += map_key[i];
				if(i != min-1)
				{
					hash_string += '<br><input id=';
				}
				else
				{
					hash_string += '<br><br>';
				}
			}
			
			
			/*****/
			
			
			var map_1_len = [];
			
			var map_1_temp_key = [];
			var map_1_temp_len = [];
			var sz1 = map_1.size;
			for(i = 0; i++ < map_1.size; map_1.next())
			{
				map_1_len.push(map_1.value());
				map_1_temp_len.push(map_1.value());
				map_1_temp_key.push(map_1.hash(map_1.key()));
			}
			
			map_1_len.sort(function(a, b){return b-a});
			var min_1 = 20 > map_1_len.size?map_1_len.size:20;
			var temp_1_key = [];
			
			for(t = 0 ; t < min_1 ; t++)
			{
				for(i = 0; i < sz1; i++)
				{
					if(map_1_len[t] == map_1_temp_len[i])
					{
						temp_1_key.push(map_1_temp_key[i]);
					}
				}
			}
			
			map_1_key.push(temp_1_key[0]);
			min_1 = 1;
			for(i = 1 ; i < temp_1_key.length ; i++)
			{
				for(j = 0 ; j < i && j < min_1 ; j++)
				{
					if(temp_1_key[i] == map_1_key[j])
					{
						
						break;
					}
				}
				if(i == j)
				{
					min_1++;
					map_1_key.push(temp_1_key[i]);
				}
			}
		//	min_1 = 10 > map_1_key.size?map_1_key.size:10;
			
			var hash_Person = '<label>Top '+min_1 + ' talked persons</label><br><input id=';
			
			for(var i = 0 ; i < min_1 ; i++)
			{
				hash_Person += ('"Person'+i+'"');
				hash_Person += ' type="checkbox" name="field" value="option"';
				
				hash_Person += '>';
				
				hash_Person += map_1_key[i];
				if(i != min_1-1)
				{
					hash_Person += '<br><input id=';
				}
				else
				{
					hash_Person += '<br><br>';
				}
			}
			
			var map_2_len = [];
			
			var map_2_temp_key = [];
			var map_2_temp_len = [];
			var sz2 = map_2.size;
			for(i = 0; i++ < map_2.size; map_2.next())
			{
				map_2_len.push(map_2.value());
				map_2_temp_len.push(map_2.value());
				map_2_temp_key.push(map_2.hash(map_2.key()));
			}
			
			map_2_len.sort(function(a, b){return b-a});
			var min_2 = 20 > map_2_len.size?map_2_len.size:20;
			
			var temp_2_key = [];
			
			for(t = 0 ; t < min_2 ; t++)
			{
				for(i = 0; i < sz2; i++)
				{
					if(map_2_len[t] == map_2_temp_len[i])
					{
						temp_2_key.push(map_2_temp_key[i]);
						
					}
				}
			}
			min_2 = 1;
			map_2_key.push(temp_2_key[0]);
			for(i = 1 ; i < temp_2_key.length ; i++)
			{
				for(j = 0 ; j < i && j < min_2; j++)
				{
					if(temp_2_key[i] == map_2_key[j])
					{
						
						break;
					}
				}
				if(i == j)
				{
					min_2++;
					map_2_key.push(temp_2_key[i]);
				}
			}
			
		//	min_2 = 10 > map_2_key.size?map_2_key.size:10;
			
			var hash_country = '<label>Top '+min_2 + ' discussed countries</label><br><input id=';
			
			for(var i = 0 ; i < min_2 ; i++)
			{
				hash_country += ('"Country'+i+'"');
				hash_country += ' type="checkbox" name="field" value="option"';
				
				hash_country += '>';
				
				hash_country += map_2_key[i];
				if(i != min_2-1)
				{
					hash_country += '<br><input id=';
				}
				else
				{
					hash_country += '<br><br>';
				}
			}
			
			sidebarStr += hash_string+hash_Person+hash_country;
			/*****/
	
	//	sidebarStr += hash_string;
		
		sidebarStr += '<input id="Apply" type="button" value="Apply" onclick="filter_results();"></br>';
		
		
		sidebarStr += ' </fieldset></form>';
		
		return sidebarStr;
	}
	
	function GetThesaurus(lang)
	{
		var query = $('#query').val();
		var qarray = query.split(" ");
		var _lang = lang+'_';
		if(lang != 'en')
		{
			
			_lang += lang.toUpperCase();
		}
		else
		{
			_lang += 'US';
		}
		
		for(k = 0 ; k < qarray.length ; k++)
		{
			var temp = '';
			temp += qarray[k];
			
			var _url = "http://thesaurus.altervista.org/thesaurus/v1?word="+temp+"&language="+_lang+"&key=G3GeP83dAQcLojG4xLkL&output=json";
			
		 jQuery.ajax({
			url: _url,
			success: function (result) {
			//alert("checking"+typeof result);
				 output = ""; 
			  for (key in result.response) { 
				list = result.response[key].list; 
				output += list.synonyms; 
			  }
			  var res = output.split("|");
			//alert(res); 
				var min = (4 > res.length)?res.length:4;
				var j = 0;
				for(i = 0 ; i < min ; i++)
				{
					if(res[i].includes(")") == false && res[i].includes("(") == false)
					{
						query += (' '+res[i]);
						if(j == 0)
						{
							sugesstion1 += ' '+res[i];
						}
						else if(j == 1)
						{
							sugesstion2 += ' '+res[i];
						}
						else if(j == 2)
						{
							sugesstion3 += ' '+res[i];
						}
						j++;
					}		
				}
					},
			async: false
		});
			
		}
	}
	
	function fillWidget()
	{
		widgetStr = '<input id="ApplyWidget" type="button" value="LAUNCH TRANSLATE WIDGET" onclick="launch_widget();">';
		return widgetStr;
	}
	
	
	function encodeQuery(uri)
	{

		var res = encodeURI(uri).replace('\'','\%27');
		
		return res;
	}

	 // show the given page, hide the rest
	function show(elementID)
	{
		// try to find the requested page and alert if it's not found
		var ele = document.getElementById(elementID);
		if (!ele) {
			alert("no such element");
			return;
		}

		// get all pages, loop through them and hide them
		var pages = document.getElementsByClassName('page');
		for(var i = 0; i < pages.length; i++) {
		//	alert(pages.length);
			pages[i].style.display = 'none';
		}
		
		var num;
		if(elementID.length == 5)
		{
			num = parseInt(elementID.slice(-1));
		}
		else
		{
			num = parseInt(elementID.slice(-2));
		}
		
	//	var pageDisplay = '<span onclick="show(\'Page'+1+'\');">'+'<b style="color:blue;">'+1+'</b>&nbsp'+'</span> ';
	//	$('#Page').append(pageDisplay);	
		$('#Page').html("");
		for(j = 1 ; j <= myPageLength ; j++)
		{
			if(j != num)
			{
				var pageDisplay = '';
				if(j == 1)
				{
					pageDisplay = '<span onclick="show(\'Page'+1+'\');">'+'<b style="color:blue;"><i>Pages : </i></b>'+'<b style="color:black;">'+1+'</b>&nbsp'+'</span>';
				}
				else
				{
					pageDisplay = '<span onclick="show(\'Page'+j+'\');">'+'<b style="color:black;">'+j+'</b>&nbsp'+'</span> ';
				}
				
				$('#Page').append(pageDisplay);	
			}
			else
			{
					var pageDisplay = '';
					if(j == 1)
					{
						pageDisplay = '<span onclick="show(\'Page'+1+'\');">'+'<b style="color:blue;"><i>Pages : </i></b>'+'<b style="color:#b30000;">'+1+'</b>&nbsp'+'</span>';
					}
					else
					{
						pageDisplay = '<span onclick="show(\'Page'+j+'\');">'+'<b style="color:#b30000;">'+j+'</b>&nbsp'+'</span> ';
					}
					
					$('#Page').append(pageDisplay);
			}
				
		}

		// then show the requested page
		ele.style.display = 'block';
	}

	function CompareDates(date)
	{
		
		if(selected_day == '0' || selected_month == '0' || selected_year == '0')
		{
			return true;
		}
		var _date = new Date(date); 
		var year = _date.getFullYear().toString();
		
		var month = (1 + _date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
		var day = _date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;
		
		if(year == selected_year && month == selected_month && day == selected_day)
		{
			
			return true;
		}
		
		return false;
	}

	function getFormattedDate(date) 
	{
		  var _date = new Date(date); 
		  var year = _date.getFullYear();
		  var month = (1 + _date.getMonth()).toString();
		  month = month.length > 1 ? month : '0' + month;
		  var day = _date.getDate().toString();
		  day = day.length > 1 ? day : '0' + day;
		  return month + '/' + day + '/' + year;
	}

	function getFormattedTime(date) 
	{
		  var time = new Date(date); 
		  var hour = time.getHours().toString();
		  hour = hour.length > 1 ? hour : '0' + hour;
		  var minutes = time.getHours().toString();
		  minutes = minutes.length > 1 ? minutes : '0' + minutes;
		  var seconds = time.getSeconds().toString();
		  seconds = seconds.length > 1 ? seconds : '0' + seconds;
		 
		  return hour + ':' + minutes + ':' + seconds;
	}

	function getPieChart(lang,_map)
	{
		if(myPieChart!=null){
			myPieChart.destroy();
		}
		if(myBarChart!=null){
			myBarChart.destroy();
		}
		
		var data = {
		labels: [
			"english",
			"german",
			"russian","italian","spanish","french",
		],
		datasets: [
			{
				label: "Language Statistics",
				data: [lang[0],lang[1],lang[2],lang[3],lang[4],lang[5]],
				backgroundColor: [
					"#878BB6",
					"#4ACAB4",
					"#FF8153",
					"#808080",
					"#800000",
					"#FFFF00"
				],
				hoverBackgroundColor: [
					"#878BB6",
					"#4ACAB4",
					"#FF8153",
					"#808080",
					"#800000",
					"#FFFF00"
				]
			}]
		};
	

		 var Languages= document.getElementById("Languages").getContext("2d");
	   // myPieChart = new Chart(Languages).Pie(pieData);
		myPieChart = new Chart(Languages,{type: 'pie',data, options : {responsive: true}});
		
		
		var data_val = [];
		
		for (i = 0 ; i < map_2_key.length ; i++)
		{
			data_val.push(_map.get(map_2_key[i]));
		}
		
		var barData = {
	labels : map_2_key,
	datasets : [
		{
			label: "Country Statistics",
backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
			borderWidth: 1,
			data : data_val
		}
	]
};

var c_data = document.getElementById("countries").getContext("2d");
 myBarChart = new Chart(c_data, {
    type: 'bar',
    data: barData,
    options: {responsive: true}
});
		
	}

    function on_data(data) {
     
		var docs = data.response.docs;
		var pageLength = Math.ceil(docs.length/5);
		var k = 1;
		var fin_string = '';
		
		map_1_key = [];
		map_2_key = [];
		
		map_key = [];
		
		//No results found case
		if(docs.length == 0)
		{
			 var total = '<h2 class="lead"><strong class="text-danger"> ' + docs.length + ' </strong>results were found for the search for <strong class="text-danger">'+$('#query').val();
			 $('#Page1').prepend('</strong></h2></hgroup></div>');
			$('#Page1').prepend(total);
			$('#Page1').prepend('<div class="container2"><hgroup class="mb20"><h1>Search Results</h1>');
			if(myPieChart!=null){
        myPieChart.destroy();
    }
	if(myBarChart!=null){
        myBarChart.destroy();
    }
			return;
		}
		
		var query = $('#query').val();
		 var res = query.split(" ");

        var lang = [0,0,0,0,0,0,0];
		var p = 1;
		var str = '#Page'+p;
		var map = new Map;
		var map_1 = new Map;
		var map_2 = new Map;
		var first_lang = '';
		var text_hashtags = '';
		
        $.each(docs, function(i, item) {
		
			if(k >  5)
			{	
				 k = 1;
				 p++;
				 $(str).append(fin_string);
				 str ='#Page'+p;
				 
				 fin_string = '';
			}
			var temp_lang = '';
			if(item.tweet_lang)
            {
				temp_lang = item.tweet_lang[0];
            }
			
			if(k == 1 && p == 1)
			{
				first_lang = temp_lang;
			}
			
			if(temp_lang == 'en')
			{
				lang[0]++;
				temp_lang = 'english';
			}
			else if(temp_lang == 'de')
			{
				lang[1]++;
				temp_lang = 'german';
			}
			else if(temp_lang == 'ru')
			{
				lang[2]++;
				temp_lang = 'russian';
			}
			else if(temp_lang == 'it')
			{
				lang[3]++;
				temp_lang = 'italian';
			}
			else if(temp_lang == 'es')
			{
				lang[4]++;
				temp_lang = 'spanish';
			}
			else if(temp_lang == 'fr')
			{
				lang[5]++;
				temp_lang = 'french';
			}
			else
			{
				lang[6]++;
				temp_lang = 'others';
			}
			var fav_count = 0;
			var retweet_count = 0;
			
			if(item.tweet_favorite_count)
			{
				fav_count = item.tweet_favorite_count[0];
			}
			if(item.tweet_retweet_count)
			{
				retweet_count = item.tweet_retweet_count[0];
			}
			
			var text_end = '<span class="plus">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i class="glyphicon glyphicon-heart">'+fav_count+'</i></span><span class="plus">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i class="glyphicon glyphicon-repeat">'+retweet_count+'</i></span></div><span class="clearfix border"></span></div>';	
			
			var tweet_text = '';
            if(item.tweet_text)
            {
				tweet_text = item.tweet_text[0];
            }
			
			var tw_text = tweet_text;
			
								
			 for(i = 0 ; i < res.length ; i++)
			 {
				var searchMask = res[i];
				var regEx = new RegExp(searchMask, "ig");
				replaceMask = "<strong>$&</strong>";
				tw_text = tw_text.replace(regEx, replaceMask);
			 }					
			
			var text_tweet = '<div class="col-md-5"><p>'+tw_text+'</p>';
			
			if(item["entities.urls.url"])
            {
				text_tweet +=  '<a href="'+ item["entities.urls.url"][0] +'">'+ item["entities.urls.url"][0]+'</a></br>';
            }
			
			
			var text_meta = '<div class = "space"><table><tr><th><span class="glyphicon glyphicon-comment"></span></th>';
			
			var text_date = '<th><span class="glyphicon glyphicon-calendar"></span></th>';
			
			var text_time = '<th><span class="glyphicon glyphicon-time"></span></th></tr>';
			
			var time = '';
			if(item.tweet_date)
            {
				time = getFormattedTime(item.tweet_date[0]);
            }
			
			var date = '';
			if(item.tweet_date)
            {
				date = getFormattedDate(item.tweet_date[0]);
            }
			
			var temp_meta = '<tr><td>'+temp_lang+'</td><td>'+date+'</td><td>'+time+'</td></tr></table></div>';
			
			var temp_total = text_meta+text_date+text_time+temp_meta;
			
			var screen_name = '';
			if(item.screen_name)
            {
				screen_name = item.screen_name[0];
            }
			
			var text_user = '<div class="row" id = "header"><div class = "col-md-2">';
			
			var tweet_image = '';
			if(item.profile_image_url)
            {
				tweet_image = item.profile_image_url[0];
            }
			tweet_image.replace("_normal", "");
			text_user += '<div class = "screenName"><img src="'+tweet_image+'" alt="Mountain View" style="width:100;height:120px;">@<b><i>'+screen_name+'</i></b></div></div>';
			
		//	fin_string += (text_user+text_date+text_time+text_meta+text_tweet+text_end);
			fin_string += (text_user+text_tweet+temp_total+text_end);
		

			if(item.Hashtag)
			{
				for(t = 0 ; t < item.Hashtag.length ; t++)
				{
					var tag = item.Hashtag[t];
		
					if(map.get(tag) == undefined)
					{
						map.put(tag, 1);
					}
					else
					{
						var val = map.get(tag);
						val++;
						map.put(tag, val);
					}
				}
			}
			
			/*****/
			
			if(item.Person)
			{
				for(t = 0 ; t < item.Person.length ; t++)
				{
					var tag = item.Person[t];
		
					if(map_1.get(tag) == undefined)
					{
						map_1.put(tag, 1);
					}
					else
					{
						var val = map_1.get(tag);
						val++;
						map_1.put(tag, val);
					}
				}
			}
			
			if(item.Country)
			{
				for(t = 0 ; t < item.Country.length ; t++)
				{
					var tag = item.Country[t];
		
					if(map_2.get(tag) == undefined)
					{
						map_2.put(tag, 1);
					}
					else
					{
						var val = map_2.get(tag);
						val++;
						map_2.put(tag, val);
					}
				}
			}
			
			/*****/
        
			k++;
        });
		
		
		
		if(fin_string != '')
	    {
			$(str).append(fin_string);
		}
		
		
		GetThesaurus(first_lang);
		
		//adding common text to all pages
		for(j = 1 ; j <= pageLength ; j++)
		{
			var str = '#Page'+j;
			
			 var total = '<h2 class="lead"><strong class="text-danger"> ' + docs.length + ' </strong>results were found for the search for <strong class="text-danger">'+$('#query').val();
			 var tempstr = '<div class="container-fluid"><div class = "right col"><hgroup class="mb20"><h1>Search Results</h1>'+total+'</strong></h2></hgroup><div class = "sugesstionBox"><b style="color:black;"><u>Similar Searches :</u> <b><br>';
			 var suggestStr = '';
			 if(sugesstion1 != '')
			 {
				 suggestStr += '<i style="color:black;">'+sugesstion1+'</i><br>';
			 }
			 if(sugesstion2 != '')
			 {
				 suggestStr += '<i style="color:black;">'+sugesstion2+'</i><br>';
			 }
			 if(sugesstion3 != '')
			 {
				 suggestStr += '<i style="color:black;">'+sugesstion3+'</i><br>';
			 }
			 if(suggestStr != '')
			 {
				 tempstr += suggestStr+'</div>';
			 }
			 else
			 {
				 tempstr += 'Nothing found</div>';
			 }
			$(str).prepend(tempstr);
		}	
		
		
		for(j = 1 ; j <= pageLength  ; j++)
		{
			var str = '#Page'+j;
			$(str).append('</div></div>');	
		}
		
		var pageDisplay = '<span onclick="show(\'Page'+1+'\');">'+'<b style="color:blue;"><i>Pages : </i></b>'+'<b style="color:#b30000;">'+1+'</b>&nbsp'+'</span> ';
		$('#Page').append(pageDisplay);	
		
		for(j = 2 ; j <= pageLength  ; j++)
		{
			var pageDisplay = '<span onclick="show(\'Page'+j+'\');">'+'<b style="color:black;">'+j+'</b>&nbsp'+'</span> ';
			$('#Page').append(pageDisplay);		
		}
		var tempstr = FillSideBar(lang,map,map_1,map_2);
		$('#sidebar').append(tempstr);
		$('.testing').show();
		
		var widStr = fillWidget();
		
		$('#widget').append(widStr);
		$('#widget').show();
		myPageLength = pageLength;
		getPieChart(lang,map_2);

    }



    function on_search() {
        var query = $('#query').val();
        if (query.length == 0) {
            return;
        }
		sugesstion1 ='';
		sugesstion2 ='';
		sugesstion3 ='';
		map_key = [];
		//Thesaurus code
		
		
	//	query = $('#query').val();
	
   //     alert(sugesstion1);
		
		var q = encodeQuery(query);
		
		//Clearing all the pages
		for(i = 0 ; i < 13 ; i++)
		{
			var str = '#Page'+i;
			$(str).html("");
		}
		
		//Clearing page nuumbers
		$('#Page').html("");
		
		//Clearin pie chart
		$('#Languages').html("");
		$('#countriess').html("");
		
		//Clearing Sidebar
		$('#sidebar').html("");
		if(myPieChart!=null){
        myPieChart.destroy();
		}
		
		if(myBarChart!=null){
        myBarChart.destroy();
		}
		
		$('#countries').html("");
		$('#widget').html("");
		
        var url='http://localhost:8983/solr/test/select?indent=on&q='+q+'&rows=250&wt=json&callback=?&json.wrf=on_data';
		alert('HTTP request')
        $.getJSON(url);
    }

    function on_ready() {
		console.log( "ready!" );
        $('#searchButton').click(on_search);
        /* Hook enter to search */
        $('body').keypress(function(e) {
            if (e.keyCode == '13') {
                on_search();
            }
        });
    }
	
	function filter_output(data)
	{
		var docs = data.response.docs;
		var pageLength;
		var k = 1;
		var fin_string = '';
		if(docs.length == 0)
		{
			 var total = '<h2 class="lead"><strong class="text-danger"> ' + docs.length + ' </strong>results were found for the search for <strong class="text-danger">'+$('#query').val();
			 $('#Page1').prepend('</strong></h2></hgroup></div>');
			$('#Page1').prepend(total);
			$('#Page1').prepend('<div class="container2"><hgroup class="mb20"><h1>Search Results</h1>');
			return;
		}

		var p = 1;
		var str = '#Page'+p;
		var count = 0;
		
		var query = $('#query').val();
		 var res = query.split(" ");
		
        $.each(docs, function(i, item) {
			var found = true;
		//	alert('WTF1 '+found);
			var temp_lang = '';
			if(item.tweet_lang)
            {
				temp_lang = item.tweet_lang[0];
            }
			var temp1 = false;
			if(selected_lang.length > 0)
			{
				for( t = 0 ; t < selected_lang.length ; t++)
				{
					if(temp_lang == selected_lang[t])
					{
						temp1 = true;
						break;
					}
				}
			}
			else
			{
				temp1 = true;
			}
			
			found &= temp1;
	//alert('WTF2 '+found+temp_lang);
			var temp2 = false;
			
			var date = '';
			if(item.tweet_date)
            {
				date = getFormattedDate(item.tweet_date[0]);
            }
			
			if(CompareDates(date) == true)
			{
				temp2 = true;
			}
			
			found &= temp2;
			
		//	alert('WTF3 '+found);
			
			var temp3 = false;
			
			if(item.Hashtag)
			{
				if(selected_hash_tag.length > 0)
				{
					for(t = 0 ; t < item.Hashtag.length ; t++)
					{
						var tag = item.Hashtag[t];
						
						for(m = 0 ; m < selected_hash_tag.length ; m++)
						{
							if(selected_hash_tag[m] == tag)
							{
								temp3 = true;
								break;
							}
						}
						if(temp3 == true)
						{
							break;
						}
					}
				}
				else
				{
					temp3 = true;
				}
				
			}
			else
			{
				temp3 = true;
			}
			found &= temp3;
		//	alert('WTF4 '+found);
			var temp4 = false;
			
			/***/
			if(item.Person)
			{
				if(selected_Person_tag.length > 0)
				{
					for(t = 0 ; t < item.Person.length ; t++)
					{
						var tag = item.Person[t];
						
						for(m = 0 ; m < selected_Person_tag.length ; m++)
						{
							if(selected_Person_tag[m] == tag)
							{
								temp4 = true;
								break;
							}
						}
						if(temp4 == true)
						{
							break;
						}
					}
				}
				else
				{
					temp4 = true;
				}
			}
			else
			{
				temp4 = true;
			}
			
			found &= temp4;
		//	alert('WTF5 '+found);
			var temp5 = false;
			
			if(item.Country)
			{
				if(selected_hash_tag.length > 0)
				{
					for(t = 0 ; t < item.Country.length ; t++)
					{
						var tag = item.Country[t];
						
						for(m = 0 ; m < selected_hash_tag.length ; m++)
						{
							if(selected_country_tag[m] == tag)
							{
								temp5 = true;
								break;
							}
						}
						if(temp5 == true)
						{
							break;
						}
					}
				}
				else
				{
					temp5 = true;
				}
			}
			else
			{
				temp5 = true;
			}
			found &= temp5;
		//	alert('WTF6 '+found);
			/****/
			if(found == 1)
			{
				if(k >  5)
				{	
					 k = 1;
					 p++;
					 $(str).append(fin_string);
					 str ='#Page'+p;
					 
					 fin_string = '';
				}
			
			if(temp_lang == 'en')
			{
				temp_lang = 'english';
			}
			else if(temp_lang == 'de')
			{
				temp_lang = 'german';
			}
			else if(temp_lang == 'ru')
			{
				temp_lang = 'russian';
			}
			else if(temp_lang == 'it')
			{
				temp_lang = 'italian';
			}
			else if(temp_lang == 'es')
			{
				temp_lang = 'spanish';
			}
			else if(temp_lang == 'fr')
			{
				temp_lang = 'french';
			}
			else
			{
				temp_lang = 'others';
			}
				
				
				
			var fav_count = 0;
			var retweet_count = 0;
			
			if(item.tweet_favorite_count)
			{
				fav_count = item.tweet_favorite_count[0];
			}
			if(item.tweet_retweet_count)
			{
				retweet_count = item.tweet_retweet_count[0];
			}
			
			var text_end = '<span class="plus">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i class="glyphicon glyphicon-heart">'+fav_count+'</i></span><span class="plus">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i class="glyphicon glyphicon-repeat">'+retweet_count+'</i></span></div><span class="clearfix border"></span></div>';	
			
			var tweet_text = '';
            if(item.tweet_text)
            {
				tweet_text = item.tweet_text[0];
            }
			
			var tw_text = tweet_text;
			
								
			 for(i = 0 ; i < res.length ; i++)
			 {
				var searchMask = res[i];
				var regEx = new RegExp(searchMask, "ig");
				replaceMask = "<strong>$&</strong>";
				tw_text = tw_text.replace(regEx, replaceMask);
			 }					
			
			var text_tweet = '<div class="col-md-5"><p>'+tw_text+'</p>';				
			
			if(item["entities.urls.url"])
            {
				text_tweet +=  '<a href="'+ item["entities.urls.url"][0] +'">'+ item["entities.urls.url"][0]+'</a></br>';
            }
			
			
			var text_meta = '<div class = "space"><table><tr><th><span class="glyphicon glyphicon-comment"></span></th>';
			
			var text_date = '<th><span class="glyphicon glyphicon-calendar"></span></th>';
			
			var text_time = '<th><span class="glyphicon glyphicon-time"></span></th></tr>';
			
			var time = '';
			if(item.tweet_date)
            {
				time = getFormattedTime(item.tweet_date[0]);
            }
			
			var temp_meta = '<tr><td>'+temp_lang+'</td><td>'+date+'</td><td>'+time+'</td></tr></table></div>';
			
			var temp_total = text_meta+text_date+text_time+temp_meta;
			
			var screen_name = '';
			if(item.screen_name)
            {
				screen_name = item.screen_name[0];
            }
			
			var text_user = '<div class="row" id = "header"><div class = "col-md-2">';
			
			var tweet_image = '';
			if(item.profile_image_url)
            {
				tweet_image = item.profile_image_url[0];
            }
			tweet_image.replace("_normal", "");
			text_user += '<div class = "screenName"><img src="'+tweet_image+'" alt="Mountain View" style="width:100;height:120px;">@<b><i>'+screen_name+'</i></b></div></div>';
			
		
			fin_string += (text_user+text_tweet+temp_total+text_end);
				
				
				
			k++;
			count++;
			}				
        });
		 
		if(fin_string != '')
	    {
			$(str).append(fin_string);
		}
		
		pageLength = Math.ceil(count/5);
		for(j = 1 ; j <= pageLength  ; j++)
		{
			var str = '#Page'+j;
			$(str).append('</div>');	
		}
		
		
		var pageDisplay = '<span onclick="show(\'Page'+1+'\');">'+'<b style="color:blue;"><i>Pages : </i></b>'+'<b style="color:black;">'+1+'</b>&nbsp'+'</span>';
		$('#Page').append(pageDisplay);	
		
		for(j = 2 ; j <= pageLength  ; j++)
		{
			var pageDisplay = '<span onclick="show(\'Page'+j+'\');">'+'<b style="color:black;">'+j+'</b>&nbsp'+'</span> ';
			$('#Page').append(pageDisplay);	
		}
		
		for(j = 1 ; j <= pageLength ; j++)
		{
			var str = '#Page'+j;
			
			 var total = '<h2 class="lead"><strong class="text-danger"> ' + count + ' </strong>results were found for the search for <strong class="text-danger">'+$('#query').val()+ ' after applying filter';
			 var tempstr = '<div class="container-fluid"><hgroup class="mb20"><h1>Search Results</h1>'+total+'</strong></h2></hgroup>';
			$(str).prepend(tempstr);
		}
		myPageLength = pageLength;
	}
	
	function filter_results() 
	{
		selected_lang = [];
		selected_year = '0';
		selected_month = '0';
		selected_day = '0';
		selected_hash_tag = [];
		selected_country_tag = [];
		selected_Person_tag = [];
		for(i = 0 ; i < 6 ; i++)
		{
			var lang = document.getElementById(lang_map[i]);
			if(lang.checked)
			{
				if(lang_map[i] == 'English')
				{
					selected_lang.push('en');
				}
				else if(lang_map[i] == 'German')
				{
					selected_lang.push('de');
				}
				else if(lang_map[i] == 'Russian')
				{
					selected_lang.push('ru');
				}
				else if(lang_map[i] == 'Italian')
				{
					selected_lang.push('it');
				}
				else if(lang_map[i] == 'Spanish')
				{
					selected_lang.push('es');
				}
				else if(lang_map[i] == 'French')
				{
					selected_lang.push('fr');
				}
				
			}
		}
		
		
		for(i = 0 ; i < map_key.length ; i++)
		{
			var map_id = 'Hashtag'+i;
			var map_ht = document.getElementById(map_id);
			if(map_ht != null && map_ht.checked)
			{
				selected_hash_tag.push(map_key[i]);
			}
		}
		
		for(i = 0 ; i < map_1_key.length ; i++)
		{
			var map_id = 'Person'+i;
			var map_ht = document.getElementById(map_id);
			if(map_ht != null && map_ht.checked)
			{
				selected_Person_tag.push(map_1_key[i]);
			}
		}
		
		for(i = 0 ; i < map_2_key.length ; i++)
		{
			var map_id = 'Country'+i;
			var map_ht = document.getElementById(map_id);
			//alert('WTF1 '+map_id);
			if(map_ht != null && map_ht.checked)
			{
				//alert('WTF1 '+map_id);
				selected_country_tag.push(map_2_key[i]);
			}
		}
		
		
		var date_s = document.getElementById("date_option");
		
		if(date_s.checked)
		{
			var date = $('#datepicker').val().split('-');
			selected_day = date[2];
			selected_month = date[1];
			selected_year = date[0];
		}
	//	alert(selected_month);
		
		var query = $('#query').val();
        if (query.length == 0) {
            return;
        }
		
		var q = encodeQuery(query);
		
		for(i = 0 ; i < 13 ; i++)
		{
			var str = '#Page'+i;
			$(str).html("");
		}
		$('#Page').html("");
		
		
		$('#Languages').html("");
		$('#countries').html("");

        var url='http://localhost:8983/solr/IRF18P1/select?indent=on&q='+q+'&rows=250&wt=json&callback=?&json.wrf=filter_output';
        $.getJSON(url);
    }
	
	
	//Called when search is set
    $(document).ready(on_ready);
	