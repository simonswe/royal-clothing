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
  CardMedia,
  Typography,
  IconButton,
  Container,
  Divider,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Upload as UploadIcon } from '@mui/icons-material';
import { ClothingItem, ClothingSize, ClothingType } from '../types/clothing';
import { addClothingItem, deleteClothingItem, getClothingItems } from '../services/clothingService';
import InitializeData from './InitializeData';

const SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TYPES: ClothingType[] = ['Shirt', 'Pants', 'Dress', 'Jacket', 'Skirt', 'Shoes', 'Accessory'];

// Loading skeleton for products
const LoadingSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((item) => (
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
            height={400}
            animation="wave"
          />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton animation="wave" height={24} width="80%" sx={{ mb: 1 }} />
                <Skeleton animation="wave" height={20} width="60%" sx={{ mb: 1 }} />
              </Box>
              <Skeleton animation="wave" variant="circular" width={32} height={32} />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Skeleton animation="wave" height={20} width="40%" sx={{ mb: 0.5 }} />
            <Skeleton animation="wave" height={20} width="40%" sx={{ mb: 0.5 }} />
            <Skeleton animation="wave" height={20} width="40%" sx={{ mb: 0.5 }} />
            <Skeleton animation="wave" height={24} width="30%" sx={{ mt: 1 }} />
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
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    color: '',
    size: '' as ClothingSize,
    type: '' as ClothingType,
    imageUrl: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const loadItems = async () => {
    try {
      const fetchedItems = await getClothingItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewItem({
      name: '',
      description: '',
      brand: '',
      price: '',
      color: '',
      size: '' as ClothingSize,
      type: '' as ClothingType,
      imageUrl: '',
    });
    setSelectedImage(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    try {
      setLoading(true);
      await addClothingItem({
        ...newItem,
        price: Number(newItem.price),
      }, selectedImage);
      
      handleClose();
      loadItems();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item');
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
      await deleteClothingItem(item.id, item.imageUrl);
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
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
        mb: 4
      }}>
        <Box>
          <Typography variant="h5" component="h1">
            Manage Inventory
          </Typography>
          <InitializeData />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          disabled={loading}
        >
          Add New Item
        </Button>
      </Box>

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
            <Typography variant="h6" gutterBottom>
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
              <Card>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
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
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {item.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Color: {item.color}
                    </Typography>
                    <Typography 
                      variant="subtitle2"
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mt: 1
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Add New Item</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              <Box gridColumn="span 12">
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{ height: 200, borderStyle: 'dashed' }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    selectedImage ? 'Change Image' : 'Upload Image'
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </Button>
                {selectedImage && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                    Selected: {selectedImage.name}
                  </Typography>
                )}
              </Box>
              <Box gridColumn="span 12">
                <TextField
                  fullWidth
                  label="Name"
                  value={newItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={newItem.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  value={newItem.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <TextField
                  fullWidth
                  label="Color"
                  value={newItem.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </Box>
              <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={newItem.size}
                    label="Size"
                    onChange={(e) => handleInputChange('size', e.target.value)}
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
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newItem.type}
                    label="Type"
                    onChange={(e) => handleInputChange('type', e.target.value)}
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
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 