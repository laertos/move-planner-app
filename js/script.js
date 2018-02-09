
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=7d0a1ba4c652403fad0eb20628e62285';    
    $.getJSON(nytimesUrl, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + city.toUpperCase());

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append(
                '<li class="article">' + 
                '<a href="' +article.web_url+ '">' +
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
            '</li>');
        }

        }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded. Try Again Later.');
    });

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 7000);

    $.ajax({
        url:wikiUrl,
        dataType: "jsonp",
        //jsonp:"callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                articleStr + '</a></li>');
            };
        //will cancel the setTimeout function when not neccesary    
        clearTimeout(wikiRequestTimeout);    
        }
    });                

    return false;
};

$('#form-container').submit(loadData);