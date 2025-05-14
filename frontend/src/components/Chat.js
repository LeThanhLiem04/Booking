import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Badge } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const socketRef = useRef(null);

  // Kết nối socket khi mount
  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      withCredentials: true
    });
    if (user && user._id) {
      socketRef.current.emit('join', user._id);
    }
    // Nhận tin nhắn mới
    socketRef.current.on('message', (msg) => {
      if (selectedChat && msg.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchChats();
    });
    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [user, selectedChat]);

  // Lấy danh sách chat
  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/chats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Lấy tin nhắn của một chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
      // Đánh dấu tin nhắn đã đọc
      await axios.put(`http://localhost:3001/api/chats/${chatId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Lấy danh sách user/admin có thể chat
  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/chat', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  // Gửi tin nhắn mới qua socket
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!selectedChat) return;
    try {
      socketRef.current.emit('message', {
        chatId: selectedChat._id,
        content: newMessage,
        receiverId: selectedChat.participants.find(p => String(p._id) !== String(user._id || user.id))._id
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Khi click vào một user/admin để bắt đầu chat
  const handleStartChat = async (otherUserId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/chats/user/${otherUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedChat(response.data);
      fetchChats(); // reload lại danh sách chat
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchAvailableUsers();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', p: 2 }}>
      {/* Danh sách chat */}
      <Paper sx={{ width: 300, mr: 2, overflow: 'auto' }}>
        <List>
          {/* Danh sách chat đã có */}
          {chats.map((chat) => {
            const otherUser = chat.participants.find(
              p => String(p._id) !== String(user._id || user.id)
            );
            return (
              <ListItem
                key={chat._id}
                button
                selected={selectedChat?._id === chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={chat.unreadCount?.[user.id] || 0}
                    color="error"
                  >
                    <Avatar>{otherUser.name?.[0] || otherUser.email[0]}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={otherUser.name || otherUser.email}
                  secondary={chat.lastMessage?.content}
                />
              </ListItem>
            );
          })}
          {/* Danh sách user/admin có thể chat mới */}
          {availableUsers
            .filter(u => !chats.some(chat => chat.participants.some(p => p._id === u._id)))
            .map(u => (
              <ListItem button key={u._id} onClick={() => handleStartChat(u._id)}>
                <ListItemAvatar>
                  <Avatar>{u.name?.[0] || u.email[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={u.name || u.email} secondary={u.role} />
              </ListItem>
            ))}
        </List>
      </Paper>

      {/* Khu vực chat */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                {selectedChat.participants.find(p => p._id !== user.id)?.name ||
                 selectedChat.participants.find(p => p._id !== user.id)?.email}
              </Typography>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent: String(message.sender._id) === String(user._id || user.id) ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      backgroundColor: String(message.sender._id) === String(user._id || user.id) ? 'primary.light' : 'grey.100',
                      maxWidth: '70%',
                    }}
                  >
                    <Typography>{message.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
              component="form"
              onSubmit={sendMessage}
              sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="text.secondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Chat; 