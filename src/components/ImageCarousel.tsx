import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  height?: number | string;
  showNavigation?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onImageClick?: () => void;
}

const ImageCarousel = ({
  images,
  alt,
  height = 300,
  showNavigation = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImageClick,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          height,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No images available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Main Image */}
      <Box
        sx={{
          position: 'relative',
          height,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 1,
          cursor: onImageClick ? 'pointer' : 'default',
        }}
        onClick={onImageClick}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
        
        {/* Image Counter */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} / {images.length}
          </Box>
        )}
      </Box>

      {/* Navigation Arrows */}
      {showNavigation && images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
              },
              display: { xs: 'none', sm: 'flex' },
            }}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
              },
              display: { xs: 'none', sm: 'flex' },
            }}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.8)',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Mobile Swipe Hints */}
      {isMobile && images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
          }}
        >
          Swipe to view more
        </Box>
      )}
    </Box>
  );
};

export default ImageCarousel; 