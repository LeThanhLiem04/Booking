import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        padding: 2,
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
        mt: 4,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Hotel Booking. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Link href="/contact" color="primary" sx={{ mx: 1 }}>
          Contact Us
        </Link>
        <Link href="/privacy" color="primary" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        <Link href="/terms" color="primary" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;