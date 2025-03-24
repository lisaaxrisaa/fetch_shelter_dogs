import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchPage = () => {
  const [matchDog, setMatchDog] = useState(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

    const getMatch = async () => {
      try {
        const matchResponse = await axios.post(
          'https://frontend-take-home-service.fetch.com/dogs/match',
          favoriteIds,
          { withCredentials: true }
        );

        const matchedId = matchResponse.data.match;

        const dogInfoResponse = await axios.post(
          'https://frontend-take-home-service.fetch.com/dogs',
          [matchedId],
          { withCredentials: true }
        );

        setMatchDog(dogInfoResponse.data[0]);
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };

    if (favoriteIds.length > 0) {
      getMatch();
    }
  }, []);

  return (
    <>
      <h2>Your Dog Match ❤️🐶</h2>
      {matchDog ? (
        <div>
          <img src={matchDog.img} alt={matchDog.name} width="200" />
          <h3>{matchDog.name}</h3>
          <p>Breed: {matchDog.breed}</p>
          <p>Age: {matchDog.age}</p>
          <p>Zip Code: {matchDog.zip_code}</p>
        </div>
      ) : (
        <p>Loading your perfect dog match...</p>
      )}
    </>
  );
};

export default MatchPage;
