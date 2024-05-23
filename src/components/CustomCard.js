import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CustomCard = ({ icon, title, value, subText, bgColor }) => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: bgColor || 'background.paper',
        margin: '15px', 
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: '60px',
            height: '30px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backgroundColor: 'primary.main',
            marginBottom: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h2" component="p">{value}</Typography>
        <Typography variant="body2" color="textSecondary">{subText}</Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
