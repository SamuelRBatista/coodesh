import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import api from '../services/api';
import WordCard from '../components/WordCard';
import { useNavigate } from 'react-router-dom'; // melhor que window.location

export default function WordListPage() {
  const navigate = useNavigate(); // hook do react-router
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [search, setSearch] = useState('');
  const loader = useRef(null);

  // Limpa lista ao alterar busca
  useEffect(() => {
    setWords([]);
    setPage(1);
    setHasNext(true);
  }, [search]);

  // Buscar palavras
 useEffect(() => {
  debugger;
  let mounted = true;
  const fetchWord = async () => {
    if (!search) {
      setWords([]);
      return;
    }
    try {
      const res = await api.get(`/entries/en/${encodeURIComponent(search)}`);
      if (!mounted) return;
      setWords(res.data);
      setHasNext(false);
    } catch (err) {
      setWords([]);
      setHasNext(false);
      console.error(err);
    }
  };

  fetchWord();
  return () => { mounted = false; };
}, [search]);
  // Infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasNext) setPage(prev => prev + 1);
  }, [hasNext]);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Abrir página de palavra sem logout
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
      <TextField
        fullWidth
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
     {Array.isArray(words) && words.map((w, idx) => (
      <WordCard
        key={w.word || idx}
        word={w.word}
        data={w}
        onOpen={openWord}
        favorited={false}
        onToggleFavorite={toggleFavorite}
      />
    ))}
      <div ref={loader} />
      {!hasNext && <Typography sx={{ mt: 2 }}>Fim da lista</Typography>}
    </Box>
  );
}
