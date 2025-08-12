const fetch = require('node-fetch');

const BASE = process.env.FREE_DICTIONARY_BASE || 'https://api.dictionaryapi.dev/api/v2/entries';

exports.fetchWord = async (word) => {
  const url = `${BASE}/en/${encodeURIComponent(word)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const body = await res.json();
  return body;
};
