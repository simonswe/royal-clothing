import { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { initializeFirebaseWithSampleData } from '../utils/initializeFirebase';

const InitializeData = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      setError(null);
      await initializeFirebaseWithSampleData();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleInitialize}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Initializing...' : 'Initialize Sample Data'}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Sample data initialized successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InitializeData; 