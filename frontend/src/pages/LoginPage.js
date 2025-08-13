import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function LoginPage(){
  const { signin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate('/words');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={submit}>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={e=>setEmail(e.target.value)} />
        <TextField label="Password" fullWidth margin="normal" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Entrar</Button>
      </form>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">Não tem conta? <Link to="/signup">Cadastre-se</Link></Typography>
      </Box>
    </Box>
  );
}
