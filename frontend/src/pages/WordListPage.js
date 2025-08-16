import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Typography, Button } from '@mui/material';

import api from '../services/api';
import WordCard from '../components/WordCard';
import { AuthContext } from '../contexts/AuthContext';

export default function WordListPage() {
  
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [search, setSearch] = useState('');

  const loader = useRef(null);
  
  useEffect(() => {
    setWords([]);
    setPage(1);
    setHasNext(true);
  }, [search]);

   useEffect(() => {
    let mounted = true;

    const fetchPage = async () => {
      try {
        const res = await api.get('/entries/en', { params: { search, limit: 20, page } });
        if (!mounted) return;

        setWords(prev => [...prev, ...res.data.results]);
        setHasNext(res.data.hasNext);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPage();
    return () => { mounted = false; };
  }, [page, search]);


  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasNext) {
      setPage(prev => prev + 1);
    }
  }, [hasNext]);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);


  const openWord = (word) => {
    navigate(`/word/${encodeURIComponent(word)}`);
  };

  const toggleFavorite = async (word) => {
    try {
      await api.post(`/entries/en/${encodeURIComponent(word)}/favorite`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Palavras</Typography>

     
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => navigate('/favorites')}>Favoritos</Button>
        <Button component={Link} to="/history" variant="contained">Ver Histórico</Button>
      </Box>

    
      <TextField
        fullWidth
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

    
      {words.map(w => (
        <WordCard
          key={w.word}
          word={w.word}
          onOpen={openWord}
          favorited={w.favorited}
          onToggleFavorite={() => toggleFavorite(w.word)}
        />
      ))}

      <div ref={loader} />
      {!hasNext && <Typography sx={{ mt: 2 }}>Fim da lista</Typography>}
    </Box>
  );
}
