const apiKey = "e51fd722"
const searchBtn = document.getElementById('search-btn')
const searchEl = document.getElementById('search-el')
let movies
let movieArray = []
// localStorage.setItem('watchlist', "[1, 2, 3, 4]")
const watchList = localStorage.getItem('watchList') ? JSON.parse(localStorage.getItem('watchList')) : []
// watchList.push(5)
// console.log(watchList)
// localStorage.setItem('watchlist', JSON.stringify(watchList))
// localStorage.removeItem('watchlist')
console.log(watchList)

searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchEl.value}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            movies = data.Search
            console.log(movies)
            movieArray = data.Search.map((movie) => {
                return `
                    <div class="info-width-container">
                        <img src="${movie.Poster}" alt="">
                        <div class="movie-info">
                            <div class="movie-info-top">
                                <h2>${movie.Title}</h2>
                                <div class="rating">
                                    <img src="images/star-icon.png" alt="An image of a star">
                                    <p class="p-info">8.1</p>
                                </div>
                            </div>
                            <div class="movie-info-middle">
                                <p class="p-info">116 min</p>
                                <p class="p-info">Drama, Mystery, Sci-fi</p>
                                <button id="add-btn" data-add="${movie.imdbID}" onClick="addBtnHandler('${movie.imdbID}')"><img src="images/plus-icon.png" alt=""> <p>Watchlist</p></button>
                            </div>
                            <p class="description">A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.</p>
                        </div>
                    </div>
                `
            })
            document.querySelector(".info-section").innerHTML = movieArray
        })
    
})


function addBtnHandler(id){
    const addMovie = movies.filter((movie) => {
        return id === movie.imdbID
    })[0]
    
    if(!watchList.includes(addMovie)){
        watchList.push(addMovie)
        localStorage.setItem('watchList', JSON.stringify(watchList))
        console.log(watchList)
    }
    
}