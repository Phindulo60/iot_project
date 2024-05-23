import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const MachineHealth = ({ healthData }) => {
  return (
    <Card
      sx={{
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>Machine Health Monitoring</Typography>
        <Typography variant="body1" color="textSecondary">
          {healthData.message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MachineHealth;
