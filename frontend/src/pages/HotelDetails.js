import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelById } from '../services/api';
import { Box, Typography, CircularProgress } from '@mui/material';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await getHotelById(id);
        setHotel(response.data);
      } catch (err) {
        setError('Không thể tải thông tin khách sạn');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!hotel) return <Typography>Không tìm thấy khách sạn</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4">{hotel.name}</Typography>
      <Typography variant="body1">{hotel.description}</Typography>
      <Typography variant="body2">Địa chỉ: {hotel.address}</Typography>
      <Typography variant="body2">Đánh giá: {hotel.rating || 'Chưa có đánh giá'}</Typography>
    </Box>
  );
};

export default HotelDetails;