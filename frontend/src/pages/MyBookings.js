import React from 'react';
import { useEffect, useState, useAuth } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getBookings } from '../services/api';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data } = await getBookings();
        // Filter bookings to only show pending ones
        const pendingBookings = (data || []).filter(booking => booking.status === 'pending');
        setBookings(pendingBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 5, p: 3 }}>
        <Typography>Please log in to view your bookings.</Typography>
      </Box>
    );
  }

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
        My Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Typography>No pending bookings found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Booking ID: {booking._id}</Typography>
                  <Typography>Room: {booking.roomId?.name || 'Unknown'}</Typography>
                  <Typography>Check-In: {new Date(booking.checkInDate).toLocaleDateString()}</Typography>
                  <Typography>Check-Out: {new Date(booking.checkOutDate).toLocaleDateString()}</Typography>
                  <Typography>Total Price: ${booking.totalPrice}</Typography>
                  <Typography>Status: {booking.status}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to={`/booking/${booking._id}`}
                    sx={{ mt: 2 }}
                  >
                    View Details
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

export default MyBookings;