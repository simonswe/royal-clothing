import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';

interface NavbarProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const Navbar = ({ isAdmin, setIsAdmin }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <AppBar 
      position="sticky" 
      color="secondary" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: { xs: 64, sm: 80 },
            justifyContent: 'space-between'
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            ROYAL CLOTHING
          </Typography>

          <Box sx={{ 
            display: { xs: mobileMenuOpen ? 'flex' : 'none', sm: 'flex' },
            flexDirection: { xs: 'column', sm: 'row' },
            position: { xs: 'absolute', sm: 'static' },
            top: { xs: '100%', sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            bgcolor: 'background.paper',
            borderTop: { xs: '1px solid', sm: 'none' },
            borderColor: 'divider',
            zIndex: 1000,
          }}>
            {isAdmin ? (
              <>
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{
                    color: 'text.primary',
                    mx: { sm: 1 },
                    py: { xs: 2, sm: 1 },
                    width: { xs: '100%', sm: 'auto' },
                    textAlign: 'center',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: 'text.primary',
                    mx: { sm: 1 },
                    py: { xs: 2, sm: 1 },
                    width: { xs: '100%', sm: 'auto' },
                    textAlign: 'center',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/admin"
                sx={{
                  color: 'text.primary',
                  mx: { sm: 1 },
                  py: { xs: 2, sm: 1 },
                  width: { xs: '100%', sm: 'auto' },
                  textAlign: 'center',
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Admin Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 