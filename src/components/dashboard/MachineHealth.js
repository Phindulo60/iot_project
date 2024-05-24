import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const MachineHealth = ({ healthData }) => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'background.paper',
        margin: '8px',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              width: '70px',
              height: '70px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              backgroundColor: 'primary.main',
              marginRight: 2,
            }}
          >
            <HealthAndSafetyIcon />
          </Box>
          <Box>
            <Typography variant="h5">Machine Health Monitoring</Typography>
            <Typography variant="body1" color="textSecondary">{healthData.message}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MachineHealth;
