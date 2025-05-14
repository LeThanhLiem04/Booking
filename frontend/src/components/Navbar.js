import { Chat as ChatIcon } from '@mui/icons-material';

// ... existing code ...

// Trong phần menu items
{user && (
  <MenuItem component={Link} to="/chat">
    <ListItemIcon>
      <ChatIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText>Chat</ListItemText>
  </MenuItem>
)}

// ... existing code ... 