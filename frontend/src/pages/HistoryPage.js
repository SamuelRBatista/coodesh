import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import api from '../services/api';
import WordCard from '../components/WordCard';

export default function HistoryPage(){
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/user/me/history')
       .then(r => setHistory(r.data.results.map(x => x.word)))
       .catch(err => console.error(err));
  }, []);

  const openWord = (word) => { window.location.href = `/word/${encodeURIComponent(word)}` };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Histórico</Typography>
      {history.length === 0 ? <Typography>Nenhuma palavra consultada</Typography> :
        history.map(w => <WordCard key={w} word={w} onOpen={openWord} />)}
    </Box>
  );
}
