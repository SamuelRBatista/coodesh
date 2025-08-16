import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import api from '../services/api';
import WordCard from '../components/WordCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api.get('/user/me/favorites')
      .then(res => setFavorites(res.data.results.map(x => x.word)))
      .catch(err => console.error(err));
  }, []);

  const openWord = (word) => {
    window.location.href = `/word/${encodeURIComponent(word)}`;
  };

  const toggleFavorite = async (word) => {
    try {
      await api.delete(`/entries/en/${encodeURIComponent(word)}/unfavorite`);
      setFavorites(prev => prev.filter(w => w !== word));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Favoritos
      </Typography>

      {favorites.length === 0 ? (
        <Typography>Nenhuma palavra favoritada</Typography>
      ) : (
        favorites.map(word => (
          <WordCard
            key={word}
            word={word}
            onOpen={openWord}
            favorited
            onToggleFavorite={toggleFavorite}
          />
        ))
      )}
    </Box>
  );
}
