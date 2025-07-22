import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
  Container,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
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
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const loadItems = async () => {
      try {
        const fetchedItems = await getClothingItems(filters);
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [filters]);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
    }));
  };

  const handleMultiSelect = (field: keyof FilterOptions, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [field]: (value as string[]).length > 0 ? value : undefined
    }));
  };

  const FilterPanel = () => (
    <Box 
      sx={{ 
        width: isMobile ? '100%' : DRAWER_WIDTH,
        height: '100%',
        p: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
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

      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
            Price Range
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="Min"
              type="number"
              size="small"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <TextField
              fullWidth
              placeholder="Max"
              type="number"
              size="small"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
            Sizes
          </Typography>
          <FormControl fullWidth size="small">
            <Select<ClothingSize[]>
              multiple
              value={filters.sizes || []}
              onChange={(e) => handleMultiSelect('sizes', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as ClothingSize[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              displayEmpty
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

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
            Categories
          </Typography>
          <FormControl fullWidth size="small">
            <Select<ClothingType[]>
              multiple
              value={filters.types || []}
              onChange={(e) => handleMultiSelect('types', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as ClothingType[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              displayEmpty
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
      </Box>
    </Box>
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
            >
              Filters
            </Button>
          </Box>
        )}

        {/* Products Grid */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
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
              <Card key={item.id}>
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
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    ${item.price}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
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
    </Box>
  );
};

export default Catalogue; 