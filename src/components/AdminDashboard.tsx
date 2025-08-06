import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  IconButton,
  Container,
  Divider,
  Skeleton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Upload as UploadIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { ClothingItem, ClothingSize, ClothingType } from '../types/clothing';
import { addClothingItem, deleteClothingItem, getClothingItems, updateClothingItem } from '../services/clothingService';
import ImageCarousel from './ImageCarousel';

const SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const TYPES: ClothingType[] = ['Shirt', 'Pants', 'Dress', 'Jacket', 'Skirt', 'Shoes', 'Accessory'];

// Loading skeleton for products
const LoadingSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Box 
        key={item}
        gridColumn={{ 
          xs: 'span 12',
          sm: 'span 6',
          md: 'span 4',
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton animation="wave" height={20} width="80%" sx={{ mb: 1 }} />
                <Skeleton animation="wave" height={16} width="60%" />
              </Box>
              <Skeleton animation="wave" variant="circular" width={32} height={32} />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Skeleton animation="wave" height={16} width="40%" sx={{ mb: 0.5 }} />
            <Skeleton animation="wave" height={16} width="40%" sx={{ mb: 0.5 }} />
            <Skeleton animation="wave" height={16} width="40%" sx={{ mb: 0.5 }} />
            <Skeleton animation="wave" height={20} width="30%" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Box>
    ))}
  </>
);

const AdminDashboard = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    color: '',
    size: '' as ClothingSize,
    type: '' as ClothingType,
    imageUrls: [] as string[],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState('');

  const loadItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await getClothingItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error loading items:', error);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpen = (item?: ClothingItem) => {
    if (item) {
      setSelectedItem(item);
      setNewItem({
        name: item.name,
        description: item.description,
        brand: item.brand,
        price: item.price.toString(),
        color: item.color,
        size: item.size,
        type: item.type,
        imageUrls: item.imageUrls,
      });
    } else {
      setSelectedItem(null);
      setNewItem({
        name: '',
        description: '',
        brand: '',
        price: '',
        color: '',
        size: '' as ClothingSize,
        type: '' as ClothingType,
        imageUrls: [],
      });
    }
    setSelectedImages([]);
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setNewItem({
      name: '',
      description: '',
      brand: '',
      price: '',
      color: '',
      size: '' as ClothingSize,
      type: '' as ClothingType,
      imageUrls: [],
    });
    setSelectedImages([]);
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImages(prev => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!newItem.name.trim() || !newItem.brand.trim() || !newItem.price || !newItem.size || !newItem.type) {
        setError('Please fill in all required fields');
        return;
      }

      if (selectedItem) {
        // Update existing item
        await updateClothingItem(
          selectedItem.id,
          {
            ...newItem,
            price: Number(newItem.price),
          },
          selectedImages.length > 0 ? selectedImages : undefined
        );
      } else {
        // Add new item
        if (selectedImages.length === 0) {
          setError('Please select at least one image');
          return;
        }
        await addClothingItem({
          ...newItem,
          price: Number(newItem.price),
        }, selectedImages);
      }
      
      handleClose();
      loadItems();
    } catch (error) {
      console.error('Error saving item:', error);
      setError('Error saving item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: ClothingItem) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteClothingItem(item.id, item.imageUrls);
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Error deleting item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Manage Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={loading}
          sx={{
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          }}
        >
          Add New Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <Box 
            gridColumn="span 12"
            sx={{ 
              textAlign: 'center', 
              py: 8,
              color: 'text.secondary'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              No items in inventory
            </Typography>
            <Typography variant="body2">
              Click "Add New Item" to start adding products
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <Box 
              key={item.id} 
              gridColumn={{ 
                xs: 'span 12',
                sm: 'span 6',
                md: 'span 4',
                lg: 'span 3'
              }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 300, overflow: 'hidden' }}>
                  <ImageCarousel
                    images={item.imageUrls}
                    alt={item.name}
                    height={300}
                    showNavigation={false}
                    showDots={true}
                    onImageClick={() => handleOpen(item)}
                  />
                </Box>
                <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleOpen(item)}>
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
                        sx={{ mb: 1 }}
                      >
                        {item.brand}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleDelete(item)}
                      disabled={loading}
                      color="error"
                      size="small"
                      sx={{ mt: -0.5 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mt: 1, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Type: {item.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Size: {item.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Color: {item.color}
                    </Typography>
                    <Typography 
                      variant="subtitle2"
                      sx={{ 
                        fontWeight: 700,
                        color: 'primary.main',
                        mt: 'auto'
                      }}
                    >
                      ${item.price}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))
        )}
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              <Box gridColumn="span 12">
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Images ({newItem.imageUrls.length + selectedImages.length})
                </Typography>
                
                {/* Existing Images */}
                {newItem.imageUrls.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Current Images:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {newItem.imageUrls.map((url, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img 
                            src={url} 
                            alt={`${newItem.name} - Image ${index + 1}`}
                            style={{ 
                              width: 100, 
                              height: 100, 
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }} 
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveExistingImage(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'error.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'error.dark',
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* New Selected Images */}
                {selectedImages.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      New Images:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedImages.map((file, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`New image ${index + 1}`}
                            style={{ 
                              width: 100, 
                              height: 100, 
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }} 
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'error.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'error.dark',
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Upload Button */}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{ 
                    height: 120, 
                    borderStyle: 'dashed',
                    borderRadius: 2,
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    selectedImages.length > 0 ? 'Add More Images' : 'Upload Images'
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                  You can select multiple images. At least one image is required.
                </Typography>
              </Box>
              <Box gridColumn="span 12">
                <TextField
                  fullWidth
                  label="Name *"
                  value={newItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box gridColumn="span 12">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={newItem.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <TextField
                  fullWidth
                  label="Brand *"
                  value={newItem.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price *"
                  value={newItem.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <TextField
                  fullWidth
                  label="Color *"
                  value={newItem.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <FormControl fullWidth>
                  <InputLabel>Size *</InputLabel>
                  <Select
                    value={newItem.size}
                    label="Size *"
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    disabled={loading}
                  >
                    {SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box gridColumn="span 12">
                <FormControl fullWidth>
                  <InputLabel>Type *</InputLabel>
                  <Select
                    value={newItem.type}
                    label="Type *"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    disabled={loading}
                  >
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
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} disabled={loading} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : (selectedItem ? <EditIcon /> : <AddIcon />)}
            sx={{
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            {loading ? 'Saving...' : (selectedItem ? 'Save Changes' : 'Add Item')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 