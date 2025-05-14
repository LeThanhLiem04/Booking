import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPayment, confirmPayment, getBookingById } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const stripePromise = loadStripe('pk_test_51R5SfK08JWbPFvSabSIyMGhs757WMKqOJ3rQ1Q4EYFpYpzI7NBkV5mu2hlyOhEtOG546uvBolHWrNjJYVykY9yhz00EW2W45I1'); // Replace with your key

const CheckoutForm = ({ bookingId, clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        toast.error(error.message);
      } else {
        await confirmPayment({ paymentId: paymentIntent.id, bookingId });
        toast.success('Payment successful! Booking confirmed.');
        navigate('/');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Failed to process payment');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Payment</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Pay ${amount}
        </Button>
      </Box>
    </Paper>
  );
};

const Booking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const { data } = await getBookingById(bookingId);
        setBooking(data);
        // Create payment intent
        const { data: payment } = await createPayment({ bookingId, amount: data.totalPrice });
        setPaymentData({ bookingId, ...payment });
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId]);

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
        Complete Your Booking
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
        <Typography variant="h6">Booking Details</Typography>
        <Typography>Booking ID: {booking._id}</Typography> {/* Add Booking ID */}
        <Typography>Room: {booking.roomId?.name || 'Unknown'}</Typography> {/* Fix room name display */}
        <Typography>Check-In: {new Date(booking.checkInDate).toLocaleDateString()}</Typography>
        <Typography>Check-Out: {new Date(booking.checkOutDate).toLocaleDateString()}</Typography>
        <Typography>Total Price: ${booking.totalPrice}</Typography>
      </Paper>
      {paymentData && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            bookingId={paymentData.bookingId}
            clientSecret={paymentData.clientSecret}
            amount={paymentData.payment.amount}
          />
        </Elements>
      )}
    </Box>
  );
};

export default Booking;