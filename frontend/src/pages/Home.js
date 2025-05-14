import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchHotels } from '../services/api';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await searchHotels({});
        setHotels(response.data || []);
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
        setError('Failed to load hotels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 5, p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Our Hotel Booking App
      </Typography>
      <Typography variant="h6" gutterBottom>
        Featured Hotels
      </Typography>
      {hotels.length === 0 ? (
        <Typography>No hotels available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel._id}>
              <Card>
                {hotel.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={hotel.image?.startsWith('http') ? hotel.image : `http://localhost:3001${hotel.image}`}
                    alt={hotel.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{hotel.name}</Typography>
                  {hotel.address && <Typography>Address: {hotel.address}</Typography>}
                  {hotel.city && <Typography>City: {hotel.city}</Typography>}
                  <Typography>Rating: {hotel.rating}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/room-details/${hotel._id}`}
                    sx={{ mt: 2 }}
                  >
                    Room Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home;