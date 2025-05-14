import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchHotels, getRoomsByHotel } from '../services/api';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box,
  Link,
} from '@mui/material';

const Hotels = () => {
  const { hotelId } = useParams();
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (hotelId) {
          console.log('Fetching rooms for hotel:', hotelId);
          const roomsResponse = await getRoomsByHotel(hotelId);
          console.log('Rooms response:', roomsResponse.data);
          setRooms(roomsResponse.data || []);
        } else {
          console.log('Fetching hotels...');
          const hotelsResponse = await searchHotels({});
          console.log('Hotels from search:', hotelsResponse.data);
          setHotels(hotelsResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        console.error('Error response:', error.response); // Add this to debug the error
        setError('Failed to load data. Please try again later.');
        setHotels([]);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {hotelId ? (
        <>
          <Typography variant="h4" gutterBottom>
            Rooms for Hotel
          </Typography>
          {rooms.length === 0 ? (
            <Typography>No rooms found for this hotel.</Typography>
          ) : (
            <Grid container spacing={2}>
              {rooms.map((room) => (
                <Grid item xs={12} sm={6} md={3} key={room._id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        objectFit: 'cover',
                        width: '100%',
                      }}
                      image={room.image?.startsWith('http') ? room.image : `http://localhost:3001${room.image}`}
                      alt={room.name}
                      onError={(e) => console.error('Image failed to load:', `http://localhost:3001${room.image}`)}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {room.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Price: ${room.price} | Capacity: {room.capacity}
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Link href={`/booking?roomId=${room._id}`} color="primary" underline="hover">
                          Book now →
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Hotels
          </Typography>
          {hotels.length === 0 ? (
            <Typography>No hotels found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {hotels.map((hotel) => (
                <Grid item xs={12} sm={6} md={3} key={hotel._id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        objectFit: 'cover',
                        width: '100%',
                      }}
                      image={hotel.image?.startsWith('http') ? hotel.image : `http://localhost:3001${hotel.image}`}
                      alt={hotel.name}
                      onError={(e) => console.error('Image failed to load:', `http://localhost:3001${hotel.image}`)}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {hotel.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {hotel.address && <>Address: {hotel.address} <br /></>}
                        {hotel.city && <>City: {hotel.city}</>}
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Link href={`/hotels/${hotel._id}`} color="primary" underline="hover">
                          room details →
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default Hotels;