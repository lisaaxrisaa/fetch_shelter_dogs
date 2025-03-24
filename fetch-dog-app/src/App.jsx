import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SearchPage from './Pages/SearchPage';
import MatchPage from './Pages/MatchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/match" element={<MatchPage />} />
      </Routes>
    </Router>
  );
};

export default App;
