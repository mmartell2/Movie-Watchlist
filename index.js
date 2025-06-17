// <div class="movie-card">
//                 <img src="images/image 33.png" alt="">
//                 <div class="movie-right">
//                     <div class="movie-right-top">
//                         <h2 class="movie-title">Blade Runner</h2>
//                         <img src="images/star-icon.png" alt="a small yellow star icon">
//                         <p class="rating">8.1</p>
//                     </div>
//                     <div class="movie-right-middle">
//                         <p class="movie-length">116 min</p>
//                         <p class="movie-catagories">Drama, Mystery, Sci-fi</p>
//                         <button class="add-btn">
//                             <img src="images/plus-icon.png" alt="a small white circle with a black plus sign in the middle">
//                             Watchlist
//                         </button> 
//                     </div>
//                     <p class="movie-description">
//                         A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.
//                     </p>
//                 </div>
//             </div>
//             <hr></hr>


// colors array for random border colors on poster imgs
const colors = [
    'cyan',
    'green',
    'teal',
    'red',
    'purple',
    'orange',
    'darkblue'
]

const apiKey = "e51fd722"
let movieListArray = []
let moviesList = []
const movieSection = document.querySelector('.movie-section')
const searchEl = document.querySelector('.search-inp')
const searchBtn = document.querySelector('.search-btn')
const addWatchlistSection = document.querySelector('.watchlist-notification')
const addNotification = document.querySelector('.add-notification')
const removeNotificationSection = document.querySelector('.watchlist-notification')
const removeNotification = document.querySelector('.remove-notification')
const watchlistBtn = document.querySelector('.watchlist-btn-a')

//checks if there is already an existing watchlist in local storage
function initializeWatchList(key, defaultValue){
    const storedValue = localStorage.getItem(key)
    if(storedValue === null){
        localStorage.setItem(key, JSON.stringify(defaultValue))
        return defaultValue
    } else {
        return JSON.parse(storedValue)
    }
}
//initilizing or fetching watchlist
let watchList =  initializeWatchList('Watchlist', [])
//changing btn text based on number of movies in watchlist
watchlistCount()
//serach btn event listener
searchBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    
    renderMovies()
    
})

document.addEventListener('click', async function(event) {
    //add to wishlist button
    if(event.target.dataset.add) {
        console.log(event.target.dataset.add)
        //variable to check if the movie is already in the watchlist
        const inWatchlist = watchList.some(movie => movie === event.target.dataset.add)
        //if statement to prevent duplicates in the watchlist
        if(!inWatchlist){
            watchList.push(event.target.dataset.add)
            //setting local storage to be the watchlist array
            localStorage.setItem('Watchlist', JSON.stringify(watchList))
            renderMovies()
            const movieTitle = moviesList.filter((movie) => event.target.dataset.add === movie.imdbId)[0].title
            console.log(movieTitle)
            addNotification.textContent = `${movieTitle} has been added to your watchlist`
            addWatchlistSection.style.animation = 'none';
            void addWatchlistSection.offsetWidth;
            addWatchlistSection.style.animation = 'watchlist-add 4s';
            watchlistCount()
        }
    }

    if(event.target.dataset.remove){
        console.log(event.target.dataset.remove)
        watchList = watchList.filter((movie) => movie !== event.target.dataset.remove)
        localStorage.setItem('Watchlist', JSON.stringify(watchList))
        renderMovies()
        const movieTitle = moviesList.filter((movie) => event.target.dataset.remove === movie.imdbId)[0].title
        addNotification.textContent = `${movieTitle} has been removed from your watchlist`
        addWatchlistSection.style.animation = 'none';
        void addWatchlistSection.offsetWidth;
        addWatchlistSection.style.animation = 'watchlist-add 4s';
        watchlistCount()
    }
})

async function renderMovies() {
    const res1 = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchEl.value}`)
    const data1 = await res1.json()
    const moviesArray = data1.Search

    console.log(moviesArray)
    //if the api finds results for the search
    if(moviesArray){
        movieListArray = moviesArray.map(async (movie) => {
            //will have to figure out how to implement full plot later
            const res2 = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`)
            const data2 = await res2.json()
            console.log(data2)
            return ({
                html: ` ${watchList.some(wMovie => wMovie === data2.imdbID) ?
                     `
            <div class="watchlist-card">
                <div class="poster-div">
                    <div class="poster-remove-btn" data-remove="${data2.imdbID}"></div>
                    ${data2.Poster ? `<img class="poster-placeholder" src="${data2.Poster}" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}" alt="Image of the poster for ${data2.Title}"></img>` : `<div class="poster-placeholder" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}"></div>`}
                </div>
                <div class="watchlist-right">
                    <div class="watchlist-right-top">
                        <h2 class="watchlist-title">${data2.Title}</h2>
                    </div>
                    <div class="watchlist-right-middle">
                        <div class="middle-top">
                            ${data2.Type === `movie` ?`<p class="movie-length">${data2.Runtime}</p>` : `<p class="type">${data2.totalSeasons} seasons</p>`}
                            <p class="movie-catagories">${data2.Genre}</p>
                            <p class="year">${data2.Year}</p>
                            <p class="rated">${data2.Rated}</p>
                        </div>
                        <div class="middle-bottom">
                            <div class="rating-div">
                                <img src="images/star-icon.png" alt="a small yellow star icon">
                                <p class="rating">${data2.imdbRating}</p>
                            </div>
                            <button class="add-btn" data-remove="${data2.imdbID}">
                                <img src="images/remove-icon.png" alt="a small white circle with a black minus sign in the middle">
                                Remove
                            </button>
                        </div>
                    </div>
                    <p class="watchlist-description">
                        ${data2.Plot}
                    </p>
                    <div class="cast-crew">
                        <p class=director>Creators: <span>${data2.Director}</span></p>
                        <p class=cast>Cast: <span>${data2.Actors}</span></p>
                    </div>
                </div>
            </div>
            <hr></hr>
        ` : `
            <div class="movie-card">
                <div class="poster-div">  
                    <div class="poster-add-btn" data-add="${data2.imdbID}">+</div>
                    ${data2.Poster ? 
                        `<img class="poster-placeholder" src="${data2.Poster}" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}" alt="Image of the poster for ${data2.Title}"></img>` 
                        : 
                        `<div class="poster-placeholder" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}"></div>`}
                </div>
                <div class="movie-right">
                    <div class="movie-right-top">
                        <h2 class="movie-title">${data2.Title}</h2>
                    </div>
                    <div class="movie-right-middle">
                        <div class="middle-top">
                            ${data2.Type === `movie` ?`<p class="movie-length">${data2.Runtime}</p>` : `<p class="type">${data2.totalSeasons} seasons</p>`}
                            <p class="movie-catagories">${data2.Genre}</p>
                            <p class="year">${data2.Year}</p>
                            <p class="rated">${data2.Rated}</p>
                        </div>
                        <div class="middle-bottom">
                            <div class="rating-div">
                                <img src="images/star-icon.png" alt="a small yellow star icon">
                                <p class="rating">${data2.imdbRating}</p>
                            </div>
                            <button class="add-btn" data-add="${data2.imdbID}">
                                <img src="images/plus-icon.png" alt="a small white circle with a black plus sign in the middle">
                                Watchlist
                            </button> 
                        </div>
                    </div>
                    <p class="movie-description">
                        ${data2.Plot}
                    </p>
                    <div class="cast-crew">
                        <p class=director>Creators: <span>${data2.Director}</span></p>
                        <p class=cast>Cast: <span>${data2.Actors}</span></p>
                    </div>
                </div>
            </div>
            <hr></hr>
        `
                    
                    }
                
            `,
            imdbId: data2.imdbID,
            title: data2.Title
            }) 
        })
        moviesList = await Promise.all(movieListArray)
        const movieListHtml = moviesList.map((movie) => movie.html)
        movieSection.innerHTML = movieListHtml.join('')
        document.querySelector('.initial-container').style.display = 'none'
        document.querySelector('.no-movies').style.display = 'none'
    } else {
        movieListArray = []
        document.querySelector('.no-movies').style.display = 'flex'
        document.querySelector('.initial-container').style.display = 'none'
        movieSection.innerHTML = ''
        searchEl.focus()
    }
}

function watchlistCount() {
    if(watchList.length > 0){
        watchlistBtn.innerHTML = `My Watchlist <span>${watchList.length}</span>`
    } else {
        watchlistBtn.innerHTML = 'My Watchlist'
    }
}