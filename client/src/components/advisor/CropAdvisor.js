import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Agriculture, TrendingUp, Warning } from '@mui/icons-material';
import axios from 'axios';

const CropAdvisor = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    rainfall: '',
    pH: '',
    season: '',
    soilType: '',
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const seasons = ['Kharif', 'Rabi', 'Zaid'];
  const soilTypes = [
    'Clay',
    'Sandy',
    'Loamy',
    'Black',
    'Red',
    'Alluvial',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/crops/recommendations', formData);
      setRecommendations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enter Farm Conditions
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Temperature (°C)"
                    name="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Rainfall (mm)"
                    name="rainfall"
                    type="number"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Soil pH"
                    name="pH"
                    type="number"
                    value={formData.pH}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Season</InputLabel>
                    <Select
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      required
                    >
                      {seasons.map((season) => (
                        <MenuItem key={season} value={season}>
                          {season}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Soil Type</InputLabel>
                    <Select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleInputChange}
                      required
                    >
                      {soilTypes.map((soil) => (
                        <MenuItem key={soil} value={soil}>
                          {soil}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Agriculture />}
                  >
                    Get Recommendations
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={8}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {recommendations.map((crop) => (
              <Grid item xs={12} md={6} key={crop._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {crop.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Season: {crop.season}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {crop.growthDuration} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrendingUp color="success" />
                      <Typography variant="body2">
                        Yield: {crop.yield.min}-{crop.yield.max} {crop.yield.unit}
                      </Typography>
                    </Box>
                    {crop.diseases.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning color="warning" />
                        <Typography variant="body2">
                          {crop.diseases.length} known diseases
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleCropSelect(crop)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Selected Crop Details */}
          {selectedCrop && (
            <Paper sx={{ mt: 3, p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {selectedCrop.name} - Detailed Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Growing Conditions
                  </Typography>
                  <Typography>
                    Temperature: {selectedCrop.minTemperature}°C - {selectedCrop.maxTemperature}°C
                  </Typography>
                  <Typography>
                    Rainfall: {selectedCrop.minRainfall}mm - {selectedCrop.maxRainfall}mm
                  </Typography>
                  <Typography>
                    pH: {selectedCrop.minpH} - {selectedCrop.maxpH}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Economic Information
                  </Typography>
                  <Typography>
                    Market Value: {selectedCrop.marketValue.min} - {selectedCrop.marketValue.max} {selectedCrop.marketValue.currency}/quintal
                  </Typography>
                  <Typography>
                    Water Requirement: {selectedCrop.waterRequirement}mm
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CropAdvisor; 