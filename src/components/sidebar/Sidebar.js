import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../layouts/Sidebar.css';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginLeft: '20px',
          marginTop: '20px',
          marginBottom: '20px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      }}
      className="sidebar"
    >
      <div>
        <Typography variant="h6" sx={{ my: 2, mx: 2 }}>
          Dashboard
        </Typography>
        <Divider />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Machine Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/sales-dashboard">
            <ListItemText primary="Sales Dashboard" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
