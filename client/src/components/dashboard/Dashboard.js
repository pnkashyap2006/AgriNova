import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Container,
} from '@mui/material';
import {
  WaterDrop,
  Thermostat,
  Co2,
  Agriculture,
  Warning,
  Notifications,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const mockWeatherData = [
  { time: '00:00', temperature: 22, humidity: 65 },
  { time: '04:00', temperature: 20, humidity: 70 },
  { time: '08:00', temperature: 23, humidity: 60 },
  { time: '12:00', temperature: 27, humidity: 55 },
  { time: '16:00', temperature: 26, humidity: 58 },
  { time: '20:00', temperature: 24, humidity: 62 },
];

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h1">
              Welcome to Smart Farm Advisor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your AI-powered farming assistant. Get real-time insights and recommendations for your farm.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Current Conditions" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Thermostat color="primary" />
                <Typography>Temperature: 24°C</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <WaterDrop color="primary" />
                <Typography>Soil Moisture: 65%</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Co2 color="primary" />
                <Typography>Humidity: 58%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Crop Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Crop Status" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Agriculture color="success" />
                <Typography>Current Crop: Wheat</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Typography>Growth Stage: Flowering</Typography>
              </Box>
              <Button variant="contained" color="primary">
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Recent Alerts"
              action={
                <Button startIcon={<Notifications />}>
                  View All
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Warning color="warning" />
                <Typography>Possible pest detection in Section A</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Warning color="info" />
                <Typography>Irrigation scheduled for tomorrow</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weather Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              24-Hour Weather Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockWeatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#82ca9d"
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 