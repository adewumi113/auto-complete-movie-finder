$(document).ready(function () {
    $("#title").autocomplete({
        source: async function (request, res) {
            let data = await fetch(`https://auto-complete-movie-finder.onrender.com/search?query=${request.term}`)
                .then(results => results.json())
                .then(results => results.map(result => {
                    return {
                        label: result.title,
                        value: result.title,
                        id: result._id
                    }
                }))
            res(data)
        },
        minLength: 2,
        select: function (event, ui) {
            console.log(ui.item.id)
            fetch(`https://auto-complete-movie-finder.onrender.com/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    $("#cast").empty()
                    result.cast.forEach(cast => 
                        {
                        $("#cast").append(`<li>${cast}</li>`)
                    })
                    $("img").attr("src", result.poster)
                    $("#story").empty().append(`Story: ${result.fullplot}`);
                    $("#genre").empty().append(`Genre: ${result.genres.join(" | ")}`);
                    $("#languages").empty().append(`Language(s): ${result.languages.join(" | ")}`);
                    $("#release").empty().append(`Release Date: ${result.released}`);
                    $("#director").empty().append(`Director: ${result.directors.join(" | ")}`);
                    $("#rated").empty().append(`Rated: ${result.rated}`);
                    $("#production").empty().append(`Production: ${result.tomatoes.production}`);
                    $("#country").empty().append(`Country: ${result.countries.join(" | ")}`);
                    $("#runtime").empty().append(`Runtime: ${result.runtime} minutes`);
                })
        }
})
    
})
