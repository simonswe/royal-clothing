import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Button,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import { ClothingItem, ClothingSize, ClothingType, FilterOptions } from '../types/clothing';
import { getClothingItems } from '../services/clothingService';

const SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TYPES: ClothingType[] = ['Shirt', 'Pants', 'Dress', 'Jacket', 'Skirt', 'Shoes', 'Accessory'];
const DRAWER_WIDTH = 280;

const Catalogue = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pendingFilters, setPendingFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await getClothingItems(filters);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiSelect = (field: keyof FilterOptions, value: unknown) => {
    const selectedValues = value as string[];
    setPendingFilters(prev => ({
      ...prev,
      [field]: selectedValues.length > 0 ? selectedValues : undefined
    }));
  };

  const handleApplyFilters = () => {
    setFilters(pendingFilters);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setPendingFilters({});
  };

  const FilterPanel = () => (
    <Box 
      sx={{ 
        width: isMobile ? '100%' : DRAWER_WIDTH,
        height: '100%',
        p: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent any unwanted overflow
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        width: '100%'
      }}>
        <Typography variant="h6" component="h2">
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box 
        display="flex" 
        flexDirection="column" 
        gap={3}
        sx={{ 
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          '& .MuiSelect-select': {
            whiteSpace: 'normal', // Allow text to wrap
          },
          '& .MuiChip-root': {
            maxWidth: '100%', // Ensure chips don't overflow
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
            Sizes
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              multiple
              value={pendingFilters.sizes || []}
              onChange={(e) => handleMultiSelect('sizes', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '100%' }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250
                  }
                }
              }}
            >
              <MenuItem disabled value="">
                Select sizes
              </MenuItem>
              {SIZES.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
            Categories
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              multiple
              value={pendingFilters.types || []}
              onChange={(e) => handleMultiSelect('types', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '100%' }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250
                  }
                }
              }}
            >
              <MenuItem disabled value="">
                Select categories
              </MenuItem>
              {TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2, width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleApplyFilters}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Apply Filters
          </Button>
          
          {(Object.keys(pendingFilters).length > 0) && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleClearFilters}
              disabled={loading}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

  // Loading skeleton for products
  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Box 
          key={item}
          gridColumn={{ 
            xs: 'span 6',
            sm: 'span 6',
            md: 'span 4',
            lg: 'span 3'
          }}
        >
          <Card>
            <Skeleton 
              variant="rectangular" 
              height={400}
              animation="wave"
            />
            <CardContent>
              <Skeleton animation="wave" height={24} width="80%" sx={{ mb: 1 }} />
              <Skeleton animation="wave" height={20} width="60%" sx={{ mb: 1 }} />
              <Skeleton animation="wave" height={24} width="40%" />
            </CardContent>
          </Card>
        </Box>
      ))}
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Filters */}
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            height: '100vh',
            position: 'sticky',
            top: 80,
            overflowY: 'auto',
          }}
        >
          <FilterPanel />
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          pb: 8,
        }}
      >
        {/* Mobile Filter Button */}
        {isMobile && (
          <Box sx={{ 
            position: 'sticky', 
            top: 80, 
            zIndex: 1, 
            bgcolor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 2,
          }}>
            <Button
              startIcon={<FilterIcon />}
              onClick={() => setDrawerOpen(true)}
              fullWidth
              variant="outlined"
              disabled={loading}
            >
              Filters
            </Button>
          </Box>
        )}

        {/* Products Grid */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {loading ? (
            <Box 
              display="grid" 
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={2}
            >
              <LoadingSkeleton />
            </Box>
          ) : items.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                color: 'text.secondary'
              }}
            >
              <Typography variant="h6" gutterBottom>
                No items found
              </Typography>
              <Typography variant="body2">
                Try adjusting your filters to find what you're looking for
              </Typography>
            </Box>
          ) : (
            <Box 
              display="grid" 
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={2}
            >
              {items.map((item) => (
                <Card 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={item.imageUrl}
                    alt={item.name}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      component="div"
                      sx={{ 
                        fontWeight: 500,
                        mb: 0.5
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {item.brand}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        ${item.price}
                      </Typography>
                      <Chip 
                        label={item.size} 
                        size="small"
                        sx={{ 
                          fontWeight: 500,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen && isMobile}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '400px',
          }
        }}
      >
        <FilterPanel />
      </Drawer>

      {/* Item Details Dialog */}
      <Dialog 
        open={!!selectedItem} 
        onClose={() => setSelectedItem(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle>
              <Typography variant="h6" component="div">
                {selectedItem.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {selectedItem.brand}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.name}
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedItem.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label={`Size: ${selectedItem.size}`}
                  sx={{ fontWeight: 500 }}
                />
                <Chip 
                  label={`Type: ${selectedItem.type}`}
                  sx={{ fontWeight: 500 }}
                />
                <Chip 
                  label={`Color: ${selectedItem.color}`}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                ${selectedItem.price}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Catalogue; 