//colors array for randomized border colors on movie posters
const colors = [
    'cyan',
    'green',
    'teal',
    'red',
    'purple',
    'orange',
    'darkblue'
]
//api key
const apiKey = "e51fd722"
let moviesArray = []
let results = []
const removeNotificationSection = document.querySelector('.watchlist-notification')
const removeNotification = document.querySelector('.remove-notification')
//function to initialize watchlist
function initializeWatchList(key, defaultValue){
    const storedValue = localStorage.getItem(key)
    if(storedValue === null){
        localStorage.setItem(key, JSON.stringify(defaultValue))
        return defaultValue
    } else {
        return JSON.parse(storedValue)
    }
}
// setting watchlist = to watchlist in local storage or initializing it as an empty array if empty
let watchList =  initializeWatchList('Watchlist', [])

console.log(watchList)


//if the watchlist has movies in it then populate the html for those movies
if(watchList.length > 0){
    fetchFunction() 
    document.querySelector('.empty-watchlist').style.display = 'none'
}


//asyncronous function for fetching watchlist data and displaying it
async function fetchFunction() {
    moviesArray = watchList.map(async (movie) => {
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movie}&plot=short`)
    const data = await res.json()

    return ({
            html: `
            <div class="watchlist-card">
                <div class="poster-div">
                    <div class="poster-remove-btn" data-remove="${data.imdbID}"></div>
                    ${data.Poster ? `<img class="poster-placeholder" src="${data.Poster}" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}" alt="Image of the poster for ${data.Title}"></img>` : `<div class="poster-placeholder" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}"></div>`}
                </div>
                <div class="watchlist-right">
                    <div class="watchlist-right-top">
                        <h2 class="watchlist-title">${data.Title}</h2>
                    </div>
                    <div class="watchlist-right-middle">
                        <div class="middle-top">
                            ${data.Type === `movie` ?`<p class="movie-length">${data.Runtime}</p>` : `<p class="type">${data.totalSeasons} seasons</p>`}
                            <p class="movie-catagories">${data.Genre}</p>
                            <p class="year">${data.Year}</p>
                            <p class="rated">${data.Rated}</p>
                        </div>
                        <div class="middle-bottom">
                            <div class="rating-div">
                                <img src="images/star-icon.png" alt="a small yellow star icon">
                                <p class="rating">${data.imdbRating}</p>
                            </div>
                            <button class="add-btn" data-remove="${data.imdbID}">
                                <img src="images/remove-icon.png" alt="a small white circle with a black minus sign in the middle">
                                Remove
                            </button>
                        </div>
                    </div>
                    <p class="watchlist-description">
                        ${data.Plot}
                    </p>
                    <div class="cast-crew">
                        <p class=director>Creators: <span>${data.Director}</span></p>
                        <p class=cast>Cast: <span>${data.Actors}</span></p>
                    </div>
                </div>
            </div>
            <hr></hr>
        `,
        imdbId: data.imdbID,
        title: data.Title
        })
    })
    results = await Promise.all(moviesArray)
    console.log(results)
    const watchListHtml = results.map((movie) => movie.html).join(' ')
    document.querySelector('.watchlist-section').innerHTML = watchListHtml
    // document.querySelector('.empty-watchlist').style.display = 'none'
    
    
    
}

//event listener for remove btn
document.addEventListener('click', (event) => {
    if(event.target.dataset.remove){
        console.log(event.target.dataset.remove)
        watchList = watchList.filter((movie) => movie !== event.target.dataset.remove)
        console.log(watchList)
        localStorage.setItem('Watchlist', JSON.stringify(watchList))
        fetchFunction()
        //animation for notificaiton
        const movieTitle = results.filter((movie) => event.target.dataset.remove === movie.imdbId)[0].title
        removeNotification.textContent = `${movieTitle} has been removed from your watchlist`
        removeNotificationSection.style.animation = 'none'
        void removeNotification.offsetWidth;
        removeNotificationSection.style.animation = 'watchlist-add 4s'

        if(watchList.length === 0){
            document.querySelector('.empty-watchlist').style.display = 'flex'
        }
    }
})