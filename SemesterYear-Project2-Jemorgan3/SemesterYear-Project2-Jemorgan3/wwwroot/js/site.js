$(document).ready(function () {

    const apiKey = "9121073e942b40a1c29671fdc8c57b911e835de7";

    // Background cycling images
    let images = [
        "/images/tide-stadium.jpg",
        "/images/ALfootball.png",
        "/images/BigAL.jpg"
    ];
    let currentImage = 0;

    $("#engineName").click(function () {
        currentImage = (currentImage + 1) % images.length;
        $("body").css("background-image", "url('" + images[currentImage] + "')");
    });

    // Time button
    $("#timeBtn").click(function () {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        $("#time").text(hours + ":" + minutes + " " + ampm);
        $("#time").css("visibility", "visible");

        $("#time").dialog({
            title: "Current Time",
            modal: true,
            width: 250
        });
    });

    // People Also Ask (example placeholder)
    $("#questionBtn").click(function () {
        alert("Roll Tide!");
    });

    // Search functionality
    function displayResults(data) {
        let resultsDiv = $("#searchResults");
        resultsDiv.empty();
        resultsDiv.css("visibility", "visible");

        if (data.knowledgeGraph) {
            resultsDiv.append("<h2>Knowledge Graph</h2>");
            resultsDiv.append("<p><strong>" + data.knowledgeGraph.title + "</strong>: " +
                data.knowledgeGraph.description + "</p>");
        }

        if (data.organic && data.organic.length > 0) {
            resultsDiv.append("<h2>Organic Results</h2>");
            data.organic.forEach(function (item) {
                resultsDiv.append(
                    "<p><a href='" + item.link + "' target='_blank'>" +
                    item.title + "</a><br>" +
                    (item.snippet || "") + "</p>"
                );
            });
        }

        if (data.peopleAlsoAsk && data.peopleAlsoAsk.length > 0) {
            resultsDiv.append("<h2>People Also Ask</h2><div class='people-ask'></div>");
            data.peopleAlsoAsk.forEach(function (q) {
                $(".people-ask").append("<p>" + q.question + "</p>");
            });
        }

        if (data.relatedSearches && data.relatedSearches.length > 0) {
            resultsDiv.append("<h2>Related Searches</h2><div class='related-searches'></div>");
            data.relatedSearches.forEach(function (r) {
                let text = r.query || r.title || r;
                $(".related-searches").append("<p>" + text + "</p>");
            });
        }

        $(".related-searches p, .people-ask p").click(function () {
            $("#query").val($(this).text());
            $("#searchBtn").click();
        });
    }

    $("#searchBtn").click(function () {
        let query = $("#query").val().trim();
        if (!query) return;

        let url = "https://google.serper.dev/search?q=" +
            encodeURIComponent(query) +
            "&apiKey=" + apiKey;

        fetch(url)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.log(error));
    });

    $("#luckyBtn").click(function () {
        let query = $("#query").val().trim();
        if (!query) return;

        let url = "https://google.serper.dev/search?q=" +
            encodeURIComponent(query) +
            "&apiKey=" + apiKey;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.organic && data.organic.length > 0) {
                    window.open(data.organic[0].link, "_blank");
                }
            });
    });

});