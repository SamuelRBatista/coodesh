import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import api from '../services/api';
import WordCard from '../components/WordCard';

export default function WordListPage(){
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [search, setSearch] = useState('');
  const loader = useRef(null);

  useEffect(() => { setWords([]); setPage(1); setHasNext(true); }, [search]);

  useEffect(() => {
    debugger;
    let mounted = true;
    const fetchPage = async () => {
      try {
        const res = await api.get('/entries/en', { params: { search, limit: 20, page } });
        if (!mounted) return;
        setWords(prev => [...prev, ...res.data.results]);
        setHasNext(res.data.hasNext);
      } catch (err) { console.error(err); }
    };
    fetchPage();
    return () => { mounted = false };
  }, [page, search]);

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

  const openWord = (word) => { window.location.href = `/word/${encodeURIComponent(word)}` };
  const toggleFavorite = async (word) => { await api.post(`/entries/en/${encodeURIComponent(word)}/favorite`); };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Palavras</Typography>
      <TextField fullWidth placeholder="Pesquisar..." value={search} onChange={(e)=>setSearch(e.target.value)} sx={{ mb: 2 }} />
      {words.map(w => <WordCard key={w} word={w} onOpen={openWord} favorited={false} onToggleFavorite={toggleFavorite} />)}
      <div ref={loader} />
      {!hasNext && <Typography sx={{ mt:2 }}>Fim da lista</Typography>}
    </Box>
  );
}
