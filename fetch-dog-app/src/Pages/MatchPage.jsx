import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './matchPage.css';

const MatchPage = () => {
  const [matchDog, setMatchDog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

    const savedMatchId = localStorage.getItem('matchId');
    const savedFavorites = localStorage.getItem('matchFavorites');

    const getMatch = async () => {
      try {
        const matchResponse = await axios.post(
          'https://frontend-take-home-service.fetch.com/dogs/match',
          favoriteIds,
          { withCredentials: true }
        );

        const matchedId = matchResponse.data.match;
        localStorage.setItem('matchId', matchedId);
        localStorage.setItem('matchFavorites', JSON.stringify(favoriteIds));

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

    const fetchSavedMatch = async (id) => {
      try {
        const dogInfoResponse = await axios.post(
          'https://frontend-take-home-service.fetch.com/dogs',
          [id],
          { withCredentials: true }
        );
        setMatchDog(dogInfoResponse.data[0]);
      } catch (err) {
        console.error('Error loading saved match:', err);
      }
    };

    const parsedSavedFavorites = savedFavorites
      ? JSON.parse(savedFavorites)
      : [];

    const isSameFavorites =
      JSON.stringify(parsedSavedFavorites) === JSON.stringify(favoriteIds);

    if (favoriteIds.length > 0) {
      if (savedMatchId && isSameFavorites) {
        fetchSavedMatch(savedMatchId);
      } else {
        getMatch();
      }
    }
  }, []);

  return (
    <>
      <div className="match-container">
        <div className="match-content">
          <h2>Your Dog Match</h2>
          {matchDog ? (
            <div className="match-dog-card">
              <img src={matchDog.img} alt={matchDog.name} width="200" />
              <h3>{matchDog.name}</h3>
              <p>Breed: {matchDog.breed}</p>
              <p>Age: {matchDog.age}</p>
              <p>Zip Code: {matchDog.zip_code}</p>
            </div>
          ) : (
            <p className="loading-message">Loading your perfect dog match...</p>
          )}

          <button className="match-button" onClick={() => navigate('/search')}>
            Back to Search
          </button>
        </div>
      </div>
    </>
  );
};

export default MatchPage;
