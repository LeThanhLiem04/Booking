import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import Booking from './pages/Booking';
import Chat from './components/Chat';
import AdminPanel from './pages/AdminPanel';
import ReviewManagement from './pages/ReviewManagement';
import Rooms from './pages/Rooms';
import MyBookings from './pages/MyBookings';
import RoomDetails from './pages/RoomDetails'; // Add this import
import HotelDetails from './pages/HotelDetails'; // Import component mới
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} /> {/* Thêm route cho chi tiết khách sạn */}
            <Route path="/hotels/:hotelId/rooms" element={<Rooms />} />
            <Route path="/booking/:bookingId" element={<Booking />} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/reviews" element={<ReviewManagement />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/room-details/:hotelId" element={<RoomDetails />} /> {/* Add this route */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;