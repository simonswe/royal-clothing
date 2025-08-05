import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
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
  DialogActions,
  Badge,
} from '@mui/material';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import { ClothingItem, ClothingSize, ClothingType, FilterOptions } from '../types/clothing';
import { getClothingItems } from '../services/clothingService';
import ImageCarousel from './ImageCarousel';

const SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TYPES: ClothingType[] = ['Shirt', 'Pants', 'Dress', 'Jacket', 'Skirt', 'Shoes', 'Accessory'];
const DRAWER_WIDTH = 320;

const Catalogue = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pendingFilters, setPendingFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

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

  const getActiveFiltersCount = () => {
    return Object.values(pendingFilters).filter(value => 
      value && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const FilterPanel = () => (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        width: '100%'
      }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
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
          flex: 1,
          '& .MuiSelect-select': {
            whiteSpace: 'normal',
          },
          '& .MuiChip-root': {
            maxWidth: '100%',
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5, fontWeight: 600 }}>
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
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5, fontWeight: 600 }}>
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

        <Box sx={{ mt: 'auto', width: '100%' }}>
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
          
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleClearFilters}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Reset Filters
          </Button>
          
          {(Object.keys(pendingFilters).length > 0) && (
            <Button
              variant="text"
              color="error"
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
            sm: 'span 4',
            md: 'span 3',
            lg: 'span 3'
          }}
        >
          <Card>
            <Skeleton 
              variant="rectangular" 
              height={300}
              animation="wave"
            />
            <CardContent sx={{ p: 2 }}>
              <Skeleton animation="wave" height={20} width="80%" sx={{ mb: 1 }} />
              <Skeleton animation="wave" height={16} width="60%" sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton animation="wave" height={20} width="30%" />
                <Skeleton animation="wave" height={24} width={40} />
              </Box>
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
            top: 72,
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
            top: 72, 
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
              sx={{
                justifyContent: 'space-between',
                px: 2,
              }}
            >
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  badgeContent={getActiveFiltersCount()} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem' } }}
                />
              )}
            </Button>
          </Box>
        )}

        {/* Products Grid */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {loading ? (
            <Box 
              display="grid" 
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={{ xs: 2, sm: 3 }}
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
                md: 'repeat(4, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={{ xs: 2, sm: 3 }}
            >
              {items.map((item) => (
                <Card 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out',
                    }
                  }}
                >
                  <Box sx={{ height: 300, overflow: 'hidden' }}>
                    <ImageCarousel
                      images={item.imageUrls}
                      alt={item.name}
                      height={300}
                      showNavigation={false}
                      showDots={true}
                      onImageClick={() => setSelectedItem(item)}
                    />
                  </Box>
                  <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="subtitle1" 
                      component="div"
                      sx={{ 
                        fontWeight: 600,
                        mb: 0.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1, flex: 1 }}
                    >
                      {item.brand}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          fontWeight: 700,
                          color: 'primary.main'
                        }}
                      >
                        ${item.price}
                      </Typography>
                      <Chip 
                        label={item.size} 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {selectedItem.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {selectedItem.brand}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <ImageCarousel
                  images={selectedItem.imageUrls}
                  alt={selectedItem.name}
                  height={400}
                  showNavigation={true}
                  showDots={true}
                  autoPlay={true}
                  autoPlayInterval={4000}
                />
              </Box>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                {selectedItem.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`Size: ${selectedItem.size}`}
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`Type: ${selectedItem.type}`}
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`Color: ${selectedItem.color}`}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main'
                }}
              >
                ${selectedItem.price}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setSelectedItem(null)} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Catalogue; 