import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { getRevenueByDate } from '../database/timestreamClient';

const RevenueByDateCard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [revenue, setRevenue] = useState('N/A');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCheckRevenue = async () => {
    if (selectedDate) {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const revenueData = await getRevenueByDate(formattedDate);
        if (revenueData && revenueData.Rows[0]) {
          setRevenue(parseFloat(revenueData.Rows[0].Data[0].ScalarValue).toFixed(2));
        } else {
          setRevenue('N/A');
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setRevenue('N/A');
      }
    }
  };

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
        width: '100%',
        height: 'auto'
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>Check Revenue by Date</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <Button variant="contained" color="primary" onClick={handleCheckRevenue}>
            Check Revenue
          </Button>
          <Typography variant="h6">Revenue: ${revenue}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueByDateCard;
