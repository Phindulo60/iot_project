import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../layouts/Sidebar.css';

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
            <ListItemText primary="Main Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/ambient-temperature">
            <ListItemText primary="Ambient Temperature" />
          </ListItem>
          <ListItem button component={Link} to="/exhaust-temperature">
            <ListItemText primary="Exhaust Temperature" />
          </ListItem>
          <ListItem button component={Link} to="/dc-voltage">
            <ListItemText primary="DC Voltage" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
