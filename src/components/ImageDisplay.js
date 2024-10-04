import React from 'react';
import React from 'react';
import { Grid, Card, CardMedia, CardContent, Link } from '@mui/material';

const ImageDisplay = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <Grid container spacing={2} sx={{ marginTop: 4 }}>
      {images.map((image, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={image.url}
              alt={`Generated Image ${index + 1}`}
              loading="lazy"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {image.content_type}
              </Typography>
              {/* Optional: Add a download link */}
              <Link href={image.url} target="_blank" rel="noopener" underline="hover">
                View Image
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageDisplay;
