import React from 'react';
import React from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Switch, FormControlLabel } from '@mui/material';

const ImageForm = ({ formData, setFormData, handleSubmit, isLoading }) => {
  const imageSizes = [
    'square_hd',
    'square',
    'portrait_4_3',
    'portrait_16_9',
    'landscape_4_3',
    'landscape_16_9',
  ];

  const safetyTolerances = ['1', '2', '3', '4', '5', '6'];

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Prompt */}
        <Grid item xs={12}>
          <TextField
            label="Prompt"
            variant="outlined"
            fullWidth
            required
            multiline
            minRows={3}
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          />
        </Grid>

        {/* Image Size */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="image-size-label">Image Size</InputLabel>
            <Select
              labelId="image-size-label"
              value={formData.image_size}
              label="Image Size"
              onChange={(e) => setFormData({ ...formData, image_size: e.target.value })}
            >
              {imageSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Number of Inference Steps */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Inference Steps"
            type="number"
            variant="outlined"
            fullWidth
            inputProps={{ min: 1, max: 100 }}
            value={formData.num_inference_steps}
            onChange={(e) => setFormData({ ...formData, num_inference_steps: e.target.value })}
          />
        </Grid>

        {/* Seed */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Seed"
            type="number"
            variant="outlined"
            fullWidth
            value={formData.seed}
            onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
          />
        </Grid>

        {/* Guidance Scale */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Guidance Scale"
            type="number"
            variant="outlined"
            fullWidth
            inputProps={{ step: 0.1 }}
            value={formData.guidance_scale}
            onChange={(e) => setFormData({ ...formData, guidance_scale: e.target.value })}
          />
        </Grid>

        {/* Number of Images */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Number of Images"
            type="number"
            variant="outlined"
            fullWidth
            inputProps={{ min: 1, max: 10 }}
            value={formData.num_images}
            onChange={(e) => setFormData({ ...formData, num_images: e.target.value })}
          />
        </Grid>

        {/* Safety Tolerance */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="safety-tolerance-label">Safety Tolerance</InputLabel>
            <Select
              labelId="safety-tolerance-label"
              value={formData.safety_tolerance}
              label="Safety Tolerance"
              onChange={(e) => setFormData({ ...formData, safety_tolerance: e.target.value })}
            >
              {safetyTolerances.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sync Mode */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.sync_mode}
                onChange={(e) => setFormData({ ...formData, sync_mode: e.target.checked })}
                color="primary"
              />
            }
            label="Synchronous Mode"
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ImageForm;
