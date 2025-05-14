import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Register form submitted:', form);
      const user = await register(form.email, form.password, form.name);
      console.log('Register successful, user:', user);
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      console.error('Register failed:', error.message);
      toast.error(error.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Đăng ký
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Họ tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          margin="normal"
          required
          disabled={isLoading}
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
          margin="normal"
          required
          disabled={isLoading}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          fullWidth
          margin="normal"
          required
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </Box>
    </Paper>
  );
};

export default Register;