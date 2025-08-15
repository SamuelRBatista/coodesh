import fetch from 'node-fetch';

export async function fetchWord(word) {
  const BASE = process.env.FREE_DICTIONARY_BASE || 'https://api.dictionaryapi.dev/api/v2/entries';
  const url = `${BASE}/en/${encodeURIComponent(word)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null; // 404 ou outro erro da API
    const body = await res.json();
    return Array.isArray(body) ? body : null; // garante array
  } catch (err) {
    console.error('Erro ao chamar API externa:', err);
    return null;
  }
}
