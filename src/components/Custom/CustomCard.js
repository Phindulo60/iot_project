import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';

const CustomCard = ({ icon, title, value, subText, bgColor, sx, titleSx, iconSx, valueSx, subTextSx }) => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: bgColor || 'background.paper',
        marginLeft: '35px',
        marginBottom:'20px',
        height: '135px',
        width: '350px',
        ...sx,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 3,
            ...iconSx
          }}
        >
          <Box
            sx={{
              width: '50px',
              height: '30px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              backgroundColor: 'primary.main',
              marginRight: 6,
              marginBottom: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" sx={{ ...titleSx }}>{title}</Typography>
            <Typography variant="h5" component="p" sx={{ ...valueSx }}>{value}</Typography>
          </Box>
        </Box>
        <Divider sx={{ marginY: 2, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
        <Typography variant="body2" color="textSecondary" marginRight={20} sx={{ ...subTextSx }}>{subText}</Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
