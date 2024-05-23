import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomChartCard = ({ title, data, dataKey, stroke, additionalInfo, sx }) => {
  const limitedData = data.slice(-20); // Show only the last five points

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
        ...sx, // Add custom styles
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Box sx={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={limitedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={stroke} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {additionalInfo && (
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              {additionalInfo}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomChartCard;
