$(document).ready(function () {
    var data;
    var query;
    var lang;
    var city;
    var urlState;
    var currentPageLink;
    var maxPages;
    
    $('body').keypress(function (e) {
        if (e.keyCode == '13') {
            $("#searchButton").click();
        }
    });
    $("#stat-container").hide()

    $("#searchButton").click(function () {
        query = $("#searchBox").val();
        if (query == "") {
            return;
        }
        var q = encodeQuery(query);
        $("#mainLogo").attr("id", "mainLogoS");
        $("#mainBlock").attr("id", "mainBlockS");
        var url = 'http://3.16.108.128:8984/solr/test/select?q=' + q + "&wt=json&rows=20";
        urlState = 0;
        currentPageLink = 1;
        populateResults(url, false);
        google.charts.load('current', { packages: ['corechart', 'bar'] });
        google.charts.setOnLoadCallback(makeGraphs);
        //alert('HTTP request')
        //console.log(q);

    });

    $(".filter-button").click(function () {
        lang = $("input[name='language']:checked").val();
        city = $("input[name='city']:checked").val();
        if (query == "") {
            return;
        }
        var q = encodeQuery(query);
        var url = "http://3.16.108.128:8984/solr/test/select?fq=city:\"" + city + "\"&fq=lang:" + lang + "&q=" + q + "&wt=json&rows=20";
        console.log(url);
        urlState = 1;
        currentPageLink = 1;
        console.log(url);
        populateResults(url, false)
    });

    $("#show-stats").click(function () {
        $('#stat-container').fadeIn(300);
        return false;
        //attachBodyClick();
    })

    $(document).on('click', function (e) {
        $('#stat-container').fadeOut(300);
    });

    function attachBodyClick() {
        $("body").click(function () {
            $("#stat-container").fadeOut(300);
            $("body").off("click");
        })
    }

    function encodeQuery(uri) {
        var res = encodeURI(uri).replace('\'', '\%27');
        return res;
    }

    function populateResults(url, pageChange) {
        $("#data-container").empty();
        $("#bufferBox").css("height", "35px");
        $("#filters").fadeIn(500);
        $("#city-filter").fadeIn(500);
        $("#show-stats").fadeIn(500);
        if (!pageChange) {
            $("#footer").empty();
        }
        $("#searchBox").val(query);
        $.getJSON(url, function (result) {
            data = result.response.docs;
            var noOfResults = result.response.numFound;
            var noOfPages = Math.ceil(noOfResults / 20);
            //console.log(result);
            if (noOfResults == 0) {
                var tweet_text = $("<p></p>")
                    .text("No tweets with the search query available")
                    .attr("class", "tweet_text");
                var tweet_div = $("<a></a>").attr("class", "data");
                tweet_div.append(tweet_text);
                $("#data-container").append(tweet_div).css("margin-top", "39px");
                $(".data").fadeIn(400);
                return;
            }
            else {
                maxPages = noOfPages;
                if (noOfPages > 1 && !pageChange) {
                    var count = 1;
                    var pageLink;
                    while (count <= noOfPages && count <= 10) {
                        pageLink = $("<a></a>").text(count.toString()).attr("class", "pageLinks").val(count);
                        $("#footer").append(pageLink);
                        count++;
                    }
                    $(".pageLinks").first().css("text-decoration", "underline");
                    pageLink = $("<a></a>").text("next >").attr("class", "pageLinks").val(-1);
                    $("#footer").append(pageLink);
                    pageLink = $("<a></a>").text("< previous").attr("class", "pageLinks").val(-2);
                    $("#footer").prepend(pageLink);
                    attachPageLinks();
                }
                $("#data-container").prepend($("<p></p>")
                    .text(noOfResults + " result(s) found"))
                    .attr("class", "tweet_text")
                    .css("margin-top", "-12px");
            }
            $(data).each(function (i, tweet) {
                var tweet_heading = $("<h></h>").attr("class", "tweet-heading");
                tweet_heading.prepend($("<img></img>")
                    .attr("src", tweet['user.profile_image_url'][0])
                    .attr("class", "profile-images")
                    .attr("onError", "this.onerror=this.onerror=null;this.src='media/dImg.jpeg';"));
                // $(".profile-images").on("error", function() {
                //     $(this).attr("src", "D:/1A/ub/sem3/ir/project4/site/media/defaultImage.jpeg")
                // });
                tweet_heading.append($("<p></p>")
                    .text(tweet['user.name'][0] + " @" + tweet["user.screen_name"])
                    .attr("class", "user-name"));
                //console.log(tweet["user.profile_image_url"][0]);
                var tweet_text = $("<p></p>")
                    .attr("class", "tweet_text");
                tweet_text.text(tweet["text"].toString());
                var tweet_div = $("<a></a>").attr("class", "data")
                    .attr("href", "http://www.twitter.com/anyuser/status/" + tweet["id"].toString())
                    .attr("target", "_blank");
                tweet_div.append(tweet_heading, tweet_text);
                $("#data-container").append(tweet_div);
                $(".data").fadeIn(500);
            });
        });
    }

    function attachPageLinks() {
        $(".pageLinks").click(function () {
            var link = parseInt($(this).val());
            var count = link - 5;
            //console.log(parseInt($(".pageLinks").eq(10).val()));
            //console.log(link);
            if (link == -1) {
                link = currentPageLink + 1;
                if (link > maxPages) {
                    return;
                }
            }
            if (link == -2) {
                link = currentPageLink - 1;
                if (link < 1) {
                    return;
                }
            }
            if (currentPageLink == link) {
                return;
            }
            if (parseInt($(".pageLinks").eq(10).val()) == link) {
                $(".pageLinks").each(function (i, pageLink) {
                    //console.log(pageLink);
                    if (i != 0 && i != 11) {
                        $(pageLink).text(count.toString()).val(count.toString());
                        count++;
                    }
                })
            }
            currentPageLink = link;
            console.log(currentPageLink);
            $(".pageLinks").css("text-decoration", "initial");
            $(".pageLinks").eq(currentPageLink - 4).css("text-decoration", "underline");
            var url;
            var start = (link - 1) * 20;
            if (query == "") {
                return;
            }
            var q = encodeQuery(query);
            if (urlState == 0) {
                url = "http://3.16.108.128:8984/solr/test/select?&q=" + q + "&wt=json&rows=20&start=" + start.toString();
            } else if (urlState == 1) {
                url = "http://3.16.108.128:8984/solr/test/select?fq=city:\"" + city + "\"&fq=lang:" + lang + "&q=" + q + "&wt=json&rows=20&start=" + start.toString();
            }
            //console.log(link);
            console.log(url);
            populateResults(url, true);
        });
    }
    function makeGraphs() {
        //get the query    
        if (query == "") {
            return;
        }
        var q = encodeQuery(query);
        var langList = ["en", "fr", "th", "hi", "es"];
        var cityList = ["nyc", "paris", "bangkok", "delhi", "mexico city"];

        var langFullList = ["English", "French", "Thai", "Hindi", "Spanish"];
        var cityFullList = ["NYC", "Paris", "Bangkok", "New-Delhi", "Mexico City"];

        var data1 = new google.visualization.DataTable();
        data1.addColumn('string', 'Language');
        data1.addColumn('number', 'Tweets');
        var options1 = {
            title: 'Tweet distribution by language (by query)',
            chartArea: { width: '50%' },
            colors: ['#b0120a', '#ffab91'],
            hAxis: {
                title: 'Tweets',
                minValue: 0
            },
            vAxis: {
                title: 'Language'
            }
        };
        var chart1 = new google.visualization.BarChart(document.getElementById('q-lang-graph'));
        langList.forEach(function (value, i) {
            var url = "http://3.16.108.128:8984/solr/test/select?&fq=lang:" + value + "&q=" + q + "&wt=json";
            $.getJSON(url, function (result) {
                data1.addRow([langFullList[i], parseInt(result.response.numFound)]);
                chart1.draw(data1, options1);
            });
        });


        var data2 = new google.visualization.DataTable();
        data2.addColumn('string', 'City');
        data2.addColumn('number', 'Tweets');
        var options2 = {
            title: 'Tweet distribution by cities (by query)',
            chartArea: { width: '50%' },
            colors: ['#b0120a', '#ffab91'],
            hAxis: {
                title: 'Tweets',
                minValue: 0
            },
            vAxis: {
                title: 'City'
            }
        };
        var chart2 = new google.visualization.BarChart(document.getElementById('q-city-graph'));
        cityList.forEach(function (value, i) {
            var url = "http://3.16.108.128:8984/solr/test/select?fq=city:\"" + value + "\"&q=" + q + "&wt=json";
            $.getJSON(url, function (result) {
                data2.addRow([cityFullList[i], parseInt(result.response.numFound)]);
                chart2.draw(data2, options2);
            });
        });


        var data3 = new google.visualization.DataTable();
        data3.addColumn('string', 'Language');
        data3.addColumn('number', 'Tweets');
        var options3 = {
            title: 'Tweet distribution by language (full data-set)',
            chartArea: { width: '50%' },
            colors: ['#b0120a', '#ffab91'],
            hAxis: {
                title: 'Tweets',
                minValue: 0
            },
            vAxis: {
                title: 'Language'
            }
        };
        var chart3 = new google.visualization.BarChart(document.getElementById('a-lang-graph'));
        langList.forEach(function (value, i) {
            var url = "http://3.16.108.128:8984/solr/test/select?&fq=lang:" + value + "&q=*&wt=json";
            $.getJSON(url, function (result) {
                data3.addRow([langFullList[i], parseInt(result.response.numFound)]);
                chart3.draw(data3, options3);
            });
        });


        var data4 = new google.visualization.DataTable();
        data4.addColumn('string', 'City');
        data4.addColumn('number', 'Tweets');
        var options4 = {
            title: 'Tweet distribution by cities (full data-set)',
            chartArea: { width: '50%' },
            colors: ['#b0120a', '#ffab91'],
            hAxis: {
                title: 'Tweets',
                minValue: 0
            },
            vAxis: {
                title: 'City'
            }
        };
        var chart4 = new google.visualization.BarChart(document.getElementById('a-city-graph'));
        cityList.forEach(function (value, i) {
            var url = "http://3.16.108.128:8984/solr/test/select?fq=city:\"" + value + "\"&q=*&wt=json";
            $.getJSON(url, function (result) {
                data4.addRow([cityFullList[i], parseInt(result.response.numFound)]);
                chart4.draw(data4, options4);
            });
        });

        console.log(data2);
    }
});