import {popularMovies, searchMovie} from './api.js';

const popularTitles = [
    'The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'The Godfather Part II',
    '12 Angry Men', 'The Lord of the Rings: The Return of the King', "Schindler's List", 
    'The Lord of the Rings: The Fellowship of the Ring', 'The Good, the Bad and the Ugly'
];

async function renderPopularMovies() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML = `<p style="color: white;">Loading...</p>`;

    const movies = await Promise.all(popularTitles.map(popularMovies));
    wrapper.innerHTML = '';

    movies.forEach(movie => {
        if (!movie) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" class="card-img">
            <div class="details-on-hover">
                <p><strong>Title: </strong> ${movie.Title}</p>
                <p><strong>Year: </strong> ${movie.Year}</p>
                <p><strong>Rating: </strong> ${movie.imdbRating}</p>
                <p><strong>Genre: </strong> ${movie.Genre}</p>
            </div>
         `;
        wrapper.appendChild(card);
    });
}

async function getMovieByTitle() {
    const searchForm = document.querySelector('#search-movie');
    const searchInput = document.querySelector('#search-input');
    const homeSection = document.querySelector('#home-section');
    const listMovieSection = document.querySelector('#list-movie-section');
    const searchResultsWrapper = document.querySelector('.search-results-wrapper');

    searchForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        const title = searchInput.value.trim();
        if (!title) return;

        homeSection.classList.remove('active');
        homeSection.classList.add('hidden');
        listMovieSection.classList.remove('hidden');
        listMovieSection.classList.add('active'); 
        searchResultsWrapper.innerHTML = `<p style="color: white;">Loading...</p>`;

        try {
            const movies = await searchMovie(title);
            console.log('Search results: ', movies);
            
            if (movies.length > 0) {
                searchResultsWrapper.innerHTML = ''; 
                movies.forEach(movie => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" class="card-img">
                    <div class="details-on-hover">
                        <p><strong>Title:</strong> ${movie.Title}</p>
                        <p><strong>Year:</strong> ${movie.Year}</p>
                        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
                        <p><strong>Genre:</strong> ${movie.Genre}</p>
                        <p><strong>Plot:</strong> ${movie.Plot}</p>
                    </div>
                    `;
                    searchResultsWrapper.appendChild(card);
                });
            } else {
                searchResultsWrapper.innerHTML = `
                    <p style="color: #F49F00;">No movie found with that title.</p>
                `;
            }
        } catch (err) {
            searchResultsWrapper.innerHTML = `
                <h2>List Movie</h2>
                <hr>
                <p style="color: white;">Error: ${err.message}</p>
            `;
        }
        searchInput.value = ''; 
    });
}

async function backToHome() {
    const homeSection = document.querySelector('#home-section');
    const listMovieSection = document.querySelector('#list-movie-section');
    const backButton = document.querySelector('#back-button');

    backButton.addEventListener('click', async(e) => {
        e.preventDefault();
        homeSection.classList.remove('hidden');
        homeSection.classList.add('active');
        listMovieSection.classList.remove('active');
        listMovieSection.classList.add('hidden');

        await renderPopularMovies();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderPopularMovies();
    getMovieByTitle();
    backToHome();
});