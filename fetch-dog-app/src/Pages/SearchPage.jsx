import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [breeds, setBreeds] = useState([]);
  const [dogResults, setDogResults] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  return (
    <>
      <h2>Search Dogs </h2>

      <form onSubmit={handleSearch}>
        <label>Select Breed:</label>
        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        <label>Sort Order:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>

        <button type="submit">Search</button>
      </form>

      <h3>Results:</h3>
      <div>
        {dogResults.map((dog) => (
          <div key={dog.id}>
            <img src={dog.img} alt={dog.name} width="400" />
            <h4>{dog.name}</h4>
            <p>Breed: {dog.breed}</p>
            <p>Age: {dog.age}</p>
            <p>Zip Code: {dog.zip_code}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchPage;
