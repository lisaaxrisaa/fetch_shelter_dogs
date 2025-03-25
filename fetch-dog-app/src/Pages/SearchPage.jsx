import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './searchPage.css';

const SearchPage = () => {
  const [breeds, setBreeds] = useState([]);
  const [dogResults, setDogResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [nextPageQuery, setNextPageQuery] = useState(null);
  const [prevPageQuery, setPrevPageQuery] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(
          'https://frontend-take-home-service.fetch.com/dogs/breeds',
          { withCredentials: true }
        );
        setBreeds(response.data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const searchParams = {
        breeds: selectedBreed ? [selectedBreed] : [],
      };

      const searchResponse = await axios.get(
        `https://frontend-take-home-service.fetch.com/dogs/search`,
        {
          params: {
            breeds: searchParams.breeds,
            sort: `breed:${sortOrder}`,
          },
          withCredentials: true,
        }
      );

      const dogIds = searchResponse.data.resultIds;

      const dogsResponse = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs',
        dogIds,
        { withCredentials: true }
      );

      setDogResults(dogsResponse.data);
      setNextPageQuery(searchResponse.data.next);
      setPrevPageQuery(searchResponse.data.prev);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  const fetchPage = async (query) => {
    try {
      const fullUrl = `https://frontend-take-home-service.fetch.com${query}`;
      console.log('Fetching page with URL:', fullUrl);
      const pageResponse = await axios.get(fullUrl, {
        withCredentials: true,
      });

      const dogIds = pageResponse.data.resultIds;

      const dogsResponse = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs',
        dogIds,
        { withCredentials: true }
      );

      setDogResults(dogsResponse.data);
      setNextPageQuery(pageResponse.data.next);
      setPrevPageQuery(pageResponse.data.prev);
    } catch (error) {
      console.error('Error fetching paginated dogs:', error);
    }
  };

  const toggleFavorite = (dogId) => {
    let updatedFavorites;
    if (favorites.includes(dogId)) {
      updatedFavorites = favorites.filter((id) => id !== dogId);
    } else {
      updatedFavorites = [...favorites, dogId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <>
      <div className="search-container">
        <div className="search-wrapper">
          <h2 className="search-title">Search Dogs </h2>

          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label className="form-label">Select Breed:</label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                className="search-select"
              >
                <option value="">All Breeds</option>
                {breeds.map((breed, index) => (
                  <option key={index} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>

            <label className="form-label">Sort Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="search-select"
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>

            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          <h3 className="results-title">Results:</h3>
          <div className="dog-results">
            {dogResults.map((dog) => (
              <div key={dog.id} className="dog-card">
                <img src={dog.img} alt={dog.name} className="dog-img" />
                <h4>{dog.name}</h4>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age}</p>
                <p>Zip Code: {dog.zip_code}</p>
                <button
                  onClick={() => toggleFavorite(dog.id)}
                  className="favorite-button"
                >
                  {favorites.includes(dog.id) ? 'Unfavorite ❤️' : 'Favorite 🤍'}
                </button>
              </div>
            ))}
          </div>
          <h3 className="favorites-title">Favorites:</h3>
          <div className="favorites-container">
            {dogResults
              .filter((dog) => favorites.includes(dog.id))
              .map((dog) => (
                <div key={`fav-${dog.id}`} className="favorite-card">
                  <img src={dog.img} alt={dog.name} width="150" />
                  <h4>{dog.name}</h4>
                  <p>{dog.breed}</p>
                </div>
              ))}
          </div>

          <div className="pagination-buttons">
            {prevPageQuery && (
              <button
                onClick={() => fetchPage(prevPageQuery)}
                className="pagination-button"
              >
                Previous
              </button>
            )}
            {nextPageQuery && (
              <button
                onClick={() => fetchPage(nextPageQuery)}
                className="pagination-button"
              >
                Next
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/match')}
            disabled={favorites.length === 0}
            className="generate-button"
          >
            Generate Match
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
