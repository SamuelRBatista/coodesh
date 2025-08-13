import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

export default function WordCard({ word, onOpen, favorited = false, onToggleFavorite }) {

  const handleFavorite = (e) => {
    e.stopPropagation(); // evita que clique no favorito abra a palavra
    if(onToggleFavorite) onToggleFavorite(word);
  };

  return (
    <Card 
      sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
      onClick={() => onOpen && onOpen(word)}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{word}</Typography>
        <Box>
          <IconButton onClick={handleFavorite} color="error">
            {favorited ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
