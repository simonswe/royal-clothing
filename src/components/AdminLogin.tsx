import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { isAdmin as checkIsAdmin } from '../config/firebase';

interface AdminLoginProps {
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminLogin = ({ setIsAdmin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkIsAdmin(password)) {
      setIsAdmin(true);
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockIcon />
          </Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Admin Access
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Enter your password to access the admin dashboard
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin; 