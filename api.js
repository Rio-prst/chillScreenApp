const API_KEY = "85223202";
const url = "https://www.omdbapi.com/";

async function popularMovies(title) {
  try {
    const response = await axios.get(url, {
      params: {
        apikey: API_KEY,
        t: title,
        type: "movie",
      },
    });

    if (response.data.Response === "True") {
      return response.data;
    } else {
      throw new Error(response.data.Error) || "Cannot get the popular movies";
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

async function searchMovie(keyword) {
  try {
    const response = await axios.get(url, {
      params: {
        apikey: API_KEY,
        s: keyword,
        type: "movie",
      },
    });

    if (response.data.Response === "True" && response.data.Search.length > 0) {
      const detailMovies = response.data.Search.slice(0, 10).map(movie => 
        axios.get(url, {
          params: {
            apikey: API_KEY,
            i: movie.imdbID,
            plot: 'short'
          }
        }).then(res => res.data)
      );

      return await Promise.all(detailMovies);
    } else {
      return [];
    }
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

export { popularMovies, searchMovie };
