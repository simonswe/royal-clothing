import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

interface NavbarProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const Navbar = ({ isAdmin, setIsAdmin }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
    setMobileMenuOpen(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '320px',
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={handleMobileMenuClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List sx={{ p: 0 }}>
          {isAdmin ? (
            <>
              <ListItem sx={{ p: 0, mb: 1 }}>
                <ListItemButton
                  component={RouterLink}
                  to="/admin"
                  onClick={handleMobileMenuClose}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  <ListItemText 
                    primary="Dashboard" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ p: 0 }}>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'error.main',
                      color: 'error.contrastText',
                    },
                  }}
                >
                  <ListItemText 
                    primary="Logout" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem sx={{ p: 0 }}>
              <ListItemButton
                component={RouterLink}
                to="/admin"
                onClick={handleMobileMenuClose}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <ListItemText 
                  primary="Admin Login" 
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth={false}>
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: { xs: 64, sm: 72 },
              justifyContent: 'space-between',
              px: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              WearAgain
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              gap: 1,
            }}>
              {isAdmin ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'text.primary',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'error.contrastText',
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
                  variant="contained"
                  size="small"
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Admin Login
                </Button>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <MobileMenu />
    </>
  );
};

export default Navbar; 