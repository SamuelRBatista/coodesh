import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import api from '../services/api';

export default function WordDetailPage() {
  const { word } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/entries/en/${encodeURIComponent(word)}`);
        if (mounted) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [word]);

  if (loading) return <Typography>Carregando...</Typography>;
  if (!data) return <Typography>Não encontrado</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{word}</Typography>

      {data.map((entry, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            {entry.phonetics?.map((p, idx) => (
              <Typography key={idx}>
                {p.text}{' '}
                {p.audio && (
                  <Button onClick={() => new Audio(p.audio).play()}>
                    🔊
                  </Button>
                )}
              </Typography>
            ))}

            {entry.meanings?.map((m, mi) => (
              <Box key={mi} sx={{ mt: 1 }}>
                <Typography variant="subtitle1">{m.partOfSpeech}</Typography>
                {m.definitions.map((d, di) => (
                  <Typography key={di}>
                    • {d.definition}{d.example && <em> — {d.example}</em>}
                  </Typography>
                ))}
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
