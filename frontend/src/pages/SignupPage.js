import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

export default function SignupPage() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/words');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Cadastro</Typography>

      <form onSubmit={submit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Criar conta
        </Button>
      </form>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Já tem conta? <Link to="/login">Entrar</Link>
        </Typography>
      </Box>
    </Box>
  );
}
