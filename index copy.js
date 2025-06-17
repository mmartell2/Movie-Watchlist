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
let movieListArray = ['hello']
let title = ''
let html = ''
const movieSection = document.querySelector('.movie-section')
const searchEl = document.querySelector('.search-inp')
const searchBtn = document.querySelector('.search-btn')

searchBtn.addEventListener('click', (event) => {
    event.preventDefault()
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${'blade'}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const moviesArray = data.Search
            console.log(moviesArray)
            if(moviesArray){

                movieListArray = moviesArray.map((movie) => {
                    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movie.Title}`)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            console.log(data2)
                            return (`
                                <div class="movie-card">
                                    ${data2.Poster ? `<img class="poster-placeholder" src="${data2.Poster}" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}"></img>` : `<div class="poster-placeholder" style="border: 1px solid ${colors[Math.floor(Math.random() * 6)]}"></div>`}
                                    <div class="movie-right">
                                        <div class="movie-right-top">
                                            <h2 class="movie-title">${data2.Title}</h2>
                                            <div class="rating-div">
                                                <img src="images/star-icon.png" alt="a small yellow star icon">
                                                <p class="rating">${data2.imdbRating}</p>
                                            </div>
                                        </div>
                                        <div class="movie-right-middle">
                                            <p class="movie-length">${data2.Runtime}</p>
                                            <p class="movie-catagories">${data2.Genre}</p>
                                            <button class="add-btn">
                                                <img src="images/plus-icon.png" alt="a small white circle with a black plus sign in the middle">
                                                Watchlist
                                            </button> 
                                        </div>
                                        <p class="movie-description">
                                            ${data2.Plot}
                                        </p>
                                    </div>
                                </div>
                                <hr></hr>
                    `)
                })
                
            })
        document.querySelector('.no-movies').style.display = 'none'
        console.log(movieListArray)
        return movieSection.innerHTML = movieListArray
        
        }else {
            movieSection.innerHTML = ''
            document.querySelector('.no-movies').style.display = 'flex'
            searchEl.focus()
        }
        
        
    })
})


    





