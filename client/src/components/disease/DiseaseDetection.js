import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload,
  BugReport,
  CheckCircle,
  Healing,
  Warning,
} from '@mui/icons-material';
import * as tf from '@tensorflow/tfjs';

const DiseaseDetection = () => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const fileInputRef = useRef();

  // Load the TensorFlow model on component mount
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setLoading(true);
      // Replace with your actual model URL
      const loadedModel = await tf.loadLayersModel('/models/plant_disease_model/model.json');
      setModel(loadedModel);
    } catch (err) {
      setError('Failed to load disease detection model');
      console.error('Model loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        analyzePlantImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlantImage = async (imageUrl) => {
    if (!model) {
      setError('Model not loaded yet');
      return;
    }

    try {
      setLoading(true);
      setPredictions(null);

      // Load and preprocess the image
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      // Convert image to tensor
      const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224]) // Resize to model input size
        .toFloat()
        .expandDims();

      // Normalize the image
      const normalized = tensor.div(255.0);

      // Get prediction
      const prediction = await model.predict(normalized).data();
      
      // Process predictions (example classes - replace with your actual classes)
      const diseaseClasses = [
        'Healthy',
        'Bacterial Leaf Blight',
        'Brown Spot',
        'Leaf Blast',
      ];

      // Get top 3 predictions
      const topPredictions = Array.from(prediction)
        .map((prob, index) => ({
          class: diseaseClasses[index],
          probability: prob,
        }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

      setPredictions(topPredictions);

      // Cleanup
      tensor.dispose();
      normalized.dispose();
    } catch (err) {
      setError('Failed to analyze image');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTreatmentRecommendations = (diseaseName) => {
    // Example treatments - replace with actual recommendations from your database
    const treatments = {
      'Bacterial Leaf Blight': [
        'Apply copper-based bactericides',
        'Ensure proper field drainage',
        'Use disease-resistant varieties',
        'Practice crop rotation',
      ],
      'Brown Spot': [
        'Apply fungicides',
        'Maintain proper spacing between plants',
        'Remove infected leaves',
        'Balance soil nutrients',
      ],
      'Leaf Blast': [
        'Apply systemic fungicides',
        'Reduce nitrogen application',
        'Improve air circulation',
        'Monitor humidity levels',
      ],
    };

    return treatments[diseaseName] || ['No specific treatments available'];
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Plant Disease Detection
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Upload a clear image of the plant leaf to detect diseases using AI.
            </Typography>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              Upload Image
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Image Preview */}
              {imageUrl && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Uploaded Image
                      </Typography>
                      <Box
                        component="img"
                        src={imageUrl}
                        alt="Plant leaf"
                        sx={{
                          width: '100%',
                          maxHeight: 400,
                          objectFit: 'contain',
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Analysis Results */}
              {loading ? (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              ) : predictions && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Detection Results
                      </Typography>
                      {predictions.map((pred, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {index === 0 ? (
                              <CheckCircle color="success" sx={{ mr: 1 }} />
                            ) : (
                              <BugReport color="warning" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="subtitle1">
                              {pred.class}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Confidence: {(pred.probability * 100).toFixed(2)}%
                          </Typography>
                          
                          {index === 0 && pred.class !== 'Healthy' && (
                            <>
                              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                Recommended Treatments:
                              </Typography>
                              <List dense>
                                {getTreatmentRecommendations(pred.class).map((treatment, i) => (
                                  <ListItem key={i}>
                                    <ListItemIcon>
                                      <Healing color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={treatment} />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DiseaseDetection; 