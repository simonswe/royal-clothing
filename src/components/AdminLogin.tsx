import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Container, Alert } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { isAdmin as checkIsAdmin } from '../config/firebase';

interface AdminLoginProps {
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminLogin = ({ setIsAdmin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (checkIsAdmin(password)) {
        setIsAdmin(true);
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '60vh',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            width: '100%',
            maxWidth: '400px',
            bgcolor: 'background.paper',
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
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              }}
            >
              <LockIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
              Admin Access
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ lineHeight: 1.6 }}>
              Enter your password to access the admin dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              disabled={loading}
              sx={{ mb: 3 }}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin; 