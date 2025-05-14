import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomsByHotel, createBooking } from '../services/api'; // Add createBooking import
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';

const RoomDetails = () => {
  const { hotelId } = useParams(); // Get hotelId from the URL
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRoomsByHotel(hotelId);
        console.log('Fetched rooms for hotel:', response.data);
        setRooms(response.data || []);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        console.error('Error response:', err.response);
        setError('Failed to load rooms. Please try again later.');
        toast.error('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [hotelId]);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setOpenBookingDialog(true);
  };

  const handleBookingSubmit = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const bookingData = {
        roomId: selectedRoom._id,
        checkInDate,
        checkOutDate,
      };
      const { data: booking } = await createBooking(bookingData); // Now createBooking is defined
      toast.success('Booking created successfully! Proceed to payment.');
      setOpenBookingDialog(false);
      setCheckInDate('');
      setCheckOutDate('');
      navigate(`/booking/${booking._id}`);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to create booking');
    }
  };

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
        Rooms for Hotel
      </Typography>
      {rooms.length === 0 ? (
        <Typography>No rooms available for this hotel.</Typography>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card>
                {room.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:3001${room.image}`}
                    alt={room.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{room.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ${room.price} per night
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Capacity: {room.capacity} guests
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleBookNow(room)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)}>
        <DialogTitle>Book Room: {selectedRoom?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Check-In Date"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-Out Date"
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookingDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBookingSubmit} color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomDetails;