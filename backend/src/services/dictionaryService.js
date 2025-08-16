import fetch from 'node-fetch';

export async function fetchWord(word) {
  const BASE = process.env.FREE_DICTIONARY_BASE || 'https://api.dictionaryapi.dev/api/v2/entries';
  const url = `${BASE}/en/${encodeURIComponent(word)}`;
  try {
    console.log(`Buscando palavra na API externa: ${url}`);
    const res = await fetch(url);
    console.log(`Resposta da API externa para ${word}: status ${res.status}`);
    if (!res.ok) {
      console.log(`Erro na API externa para ${word}: status ${res.status}`);
      return null;
    }
    const body = await res.json();
    console.log(`Dados recebidos para ${word}:`, body);
    return Array.isArray(body) ? body : null;
  } catch (err) {
    console.error(`Erro ao chamar API externa para ${word}:`, {
      message: err.message,
      stack: err.stack
    });
    return null;
  }
}