import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <Typography variant="body2" color="textSecondary">{`Time: ${label}`}</Typography>
          <Typography variant="body2" color="textPrimary">{`Value: ${payload[0].value}`}</Typography>
        </Box>
      );
    }
  
    return null;
  };
const CustomChartCard = ({ title, data, dataKey, stroke, additionalInfo, sx }) => {
  const completeData = data.map(item => ({
    ...item,
    [dataKey]: item[dataKey] !== undefined ? item[dataKey] : 0
  }));

  
  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
        marginRight: '8px', 
        ...sx
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Box sx={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={completeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12, angle: -15, textAnchor: 'end' }} />
              <YAxis tick={{ fontSize: 12, padding: { left: 10 } }} />
              <Tooltip content={<CustomTooltip />}/>
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={stroke} 
                dot={{ r: 3 }} 
                activeDot={{ r: 8 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        {additionalInfo && (
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
              {additionalInfo}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomChartCard;
